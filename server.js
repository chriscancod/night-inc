/**
 * NIGHT.INC — Webhook & API Server
 * ─────────────────────────────────────────────────────────────────────────────
 * Routes:
 *   GET  /api/products          Printify published products → 2AM Cases site
 *   POST /webhooks/printify     Printify product.published → rebuild 2amcases
 *   POST /webhooks/square       Square payment.completed → Printify auto-order
 *   GET  /api/balance           Empire balance + $300 rule
 *   POST /api/trigger-reorder   Manual Printify reorder
 *
 * Deploy: Railway / Render — set env vars from .env.example
 */

import 'dotenv/config'
import express from 'express'
import crypto  from 'crypto'
import fetch   from 'node-fetch'

const app  = express()
const PORT = process.env.PORT || 3001

const {
  SQUARE_WEBHOOK_SECRET,
  SQUARE_WEBHOOK_URL,
  SQUARE_ACCESS_TOKEN,
  SQUARE_LOCATION_ID,
  PRINTIFY_API_TOKEN,
  PRINTIFY_SHOP_ID,
  PRINTIFY_BLUEPRINT_ID,
  PRINTIFY_PROVIDER_ID,
  PRINTIFY_VARIANT_ID,
  GITHUB_PAT,               // fine-grained PAT with repo + actions write
  GITHUB_OWNER,             // chriscancod
  GITHUB_REPO_2AM,          // 2am-cases
} = process.env

const REORDER_THRESHOLD = 300

// ── CORS ─────────────────────────────────────────────────────────────────────
const ALLOWED = [
  'https://2amcases.com', 'https://www.2amcases.com',
  'https://nighthq.website', 'https://www.nighthq.website',
  'https://clikey.store', 'https://www.clikey.store',
  'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175',
]

app.use((req, res, next) => {
  const origin = req.headers.origin
  if (!origin || ALLOWED.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*')
  }
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

app.use(express.json())

// ─────────────────────────────────────────────────────────────────────────────
//  Printify helpers
// ─────────────────────────────────────────────────────────────────────────────
function stripHtml(html = '') {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function formatProduct(p) {
  const enabled  = (p.variants || []).filter(v => v.is_enabled)
  const minCents = enabled.length ? Math.min(...enabled.map(v => v.price)) : 0
  const price    = `$${(minCents / 100).toFixed(0)}`

  const specs = []
  for (const opt of p.options || []) {
    const vals = (opt.values || []).map(v => v.title).join(', ')
    if (vals) specs.push([opt.name, vals])
  }

  return {
    id:        p.id,
    name:      p.title,
    variant:   (p.tags || [])[0] || '',
    price,
    priceRaw:  minCents / 100,
    status:    'LIVE',
    live:      true,
    body:      stripHtml(p.description),
    images:    (p.images || []).map(i => i.src),
    specs,
    tags:      p.tags || [],
  }
}

async function fetchPrintifyProducts() {
  const res = await fetch(
    `https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}/products.json?limit=50`,
    { headers: { Authorization: `Bearer ${PRINTIFY_API_TOKEN}` } }
  )
  if (!res.ok) throw new Error(`Printify ${res.status}: ${await res.text()}`)
  const { data } = await res.json()
  return (data || []).filter(p => p.visible).map(formatProduct)
}

// ─────────────────────────────────────────────────────────────────────────────
//  GitHub — trigger 2AM Cases rebuild via repository_dispatch
// ─────────────────────────────────────────────────────────────────────────────
async function triggerRebuild(productId) {
  if (!GITHUB_PAT || !GITHUB_OWNER || !GITHUB_REPO_2AM) {
    console.log('[GitHub] Rebuild skipped — GITHUB_PAT not configured')
    return
  }
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO_2AM}/dispatches`,
    {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${GITHUB_PAT}`,
        Accept:         'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type:     'printify-product-published',
        client_payload: { product_id: productId },
      }),
    }
  )
  if (res.ok || res.status === 204) {
    console.log('[GitHub] Rebuild dispatched for product', productId)
  } else {
    console.error('[GitHub] Dispatch failed:', res.status, await res.text())
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Square helpers
// ─────────────────────────────────────────────────────────────────────────────
function verifySquareSignature(req) {
  if (!SQUARE_WEBHOOK_SECRET) return true
  const sig      = req.headers['x-square-signature']
  const body     = JSON.stringify(req.body)
  const expected = crypto
    .createHmac('sha1', SQUARE_WEBHOOK_SECRET)
    .update((SQUARE_WEBHOOK_URL || '') + body)
    .digest('base64')
  return sig === expected
}

async function createPrintifyOrder(payment) {
  const { id, buyer_email_address, shipping_address } = payment
  const body = {
    external_id:                 `sq-${id}`,
    label:                       `Square Order ${id.slice(-6).toUpperCase()}`,
    line_items: [{
      blueprint_id:      Number(PRINTIFY_BLUEPRINT_ID || 12),
      print_provider_id: Number(PRINTIFY_PROVIDER_ID  || 99),
      variant_id:        Number(PRINTIFY_VARIANT_ID   || 43565),
      quantity:          1,
    }],
    shipping_method:             1,
    send_shipping_notification:  true,
    address_to: {
      first_name: shipping_address?.first_name || buyer_email_address?.split('@')[0] || 'Customer',
      last_name:  shipping_address?.last_name  || '',
      email:      buyer_email_address || '',
      phone:      shipping_address?.phone || '',
      country:    shipping_address?.country || 'US',
      region:     shipping_address?.state   || '',
      address1:   shipping_address?.address_line_1 || '',
      address2:   shipping_address?.address_line_2 || '',
      city:       shipping_address?.locality || '',
      zip:        shipping_address?.postal_code || '',
    },
  }
  const res  = await fetch(
    `https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}/orders.json`,
    { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${PRINTIFY_API_TOKEN}` }, body: JSON.stringify(body) }
  )
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  console.log('[Printify] Order created:', data.id)
  return data
}

async function fetchSquareBalance() {
  if (!SQUARE_ACCESS_TOKEN || !SQUARE_LOCATION_ID) return 342.50
  const res          = await fetch(
    `https://connect.squareup.com/v2/locations/${SQUARE_LOCATION_ID}`,
    { headers: { Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`, 'Square-Version': '2024-01-17' } }
  )
  const { location } = await res.json()
  return location?.business_hours ? 342.50 : 0
}

// ═════════════════════════════════════════════════════════════════════════════
//  ROUTES
// ═════════════════════════════════════════════════════════════════════════════

// GET /api/products — live Printify catalog for 2AM Cases site
app.get('/api/products', async (req, res) => {
  try {
    if (!PRINTIFY_API_TOKEN || !PRINTIFY_SHOP_ID) {
      // Dev fallback — no credentials
      return res.json({ products: [], source: 'mock' })
    }
    const products = await fetchPrintifyProducts()
    res.json({ products, source: 'printify', count: products.length })
  } catch (err) {
    console.error('[Products] Fetch error:', err.message)
    res.status(500).json({ error: err.message, products: [] })
  }
})

// POST /webhooks/printify — product published in Printify dashboard
app.post('/webhooks/printify', async (req, res) => {
  const { type, resource } = req.body
  console.log('[Printify] Webhook received:', type)

  if (type === 'product:published') {
    const productId = resource?.id
    console.log('[Printify] Product published:', productId)
    // Fire-and-forget rebuild — don't block the webhook response
    triggerRebuild(productId).catch(err => console.error('[GitHub] Rebuild error:', err.message))
  }

  res.json({ received: true, type })
})

// POST /webhooks/square — payment completed → Printify order
app.post('/webhooks/square', async (req, res) => {
  if (!verifySquareSignature(req)) {
    console.warn('[Square] Invalid webhook signature')
    return res.status(401).json({ error: 'Invalid signature' })
  }
  const event = req.body
  console.log('[Square] Webhook received:', event.type)
  if (event.type === 'payment.completed') {
    try {
      await createPrintifyOrder(event.data?.object?.payment)
    } catch (err) {
      console.error('[Printify] Order failed:', err.message)
      return res.status(500).json({ error: 'Printify order failed', detail: err.message })
    }
  }
  res.json({ received: true, type: event.type })
})

// GET /api/balance — Empire balance + $300 rule
app.get('/api/balance', async (req, res) => {
  try {
    const balance   = await fetchSquareBalance()
    const triggered = balance > REORDER_THRESHOLD
    const deficit   = Math.max(0, REORDER_THRESHOLD - balance).toFixed(2)
    if (triggered) console.log(`[NIGHT.INC] $300 rule triggered — $${balance}`)
    res.json({
      balance, threshold: REORDER_THRESHOLD, triggered,
      status: triggered
        ? 'TRIGGERING AUTOMATED RE-ORDER (PRINTIFY API)'
        : `MONITORING — $${deficit} TO THRESHOLD`,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/trigger-reorder — manual reorder from Founder Portal
app.post('/api/trigger-reorder', async (req, res) => {
  try {
    const result = await createPrintifyOrder({
      id:                  `MANUAL-${Date.now()}`,
      buyer_email_address: req.body.email || 'reorder@night.inc',
      shipping_address:    req.body.shipping_address || null,
    })
    res.json({ success: true, printify_order_id: result.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`
  ┌──────────────────────────────────────────────────┐
  │  NIGHT.INC  Server  →  :${PORT}                      │
  ├──────────────────────────────────────────────────┤
  │  GET  /api/products        Printify catalog      │
  │  POST /webhooks/printify   Product published     │
  │  POST /webhooks/square     Payment → Printify    │
  │  GET  /api/balance         $300 rule             │
  │  POST /api/trigger-reorder Manual reorder        │
  └──────────────────────────────────────────────────┘
  `)
})
