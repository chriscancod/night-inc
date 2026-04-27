/**
 * FOUNDER PORTAL — /founder
 * Password-protected. Displays Empire Balance with $300 auto-reorder rule.
 * Password: set via VITE_FOUNDER_PASSWORD env var (default: "night300")
 */
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FOUNDER_PW     = import.meta.env.VITE_FOUNDER_PASSWORD || 'night300'
const REORDER_THRESHOLD = 300

// ── Mock empire data (replace with real Square API calls in production) ──────
function generateBalance() {
  // Simulates a live balance fetch; wire to GET /api/balance in production
  const base = 342.50
  return parseFloat((base + (Math.random() * 40 - 20)).toFixed(2))
}

const MOCK_ORDERS = [
  { id: '2AM-A1F2', product: 'iPhone 16 Pro Case', price: 62.99,  region: 'NYC', status: 'FULFILLED',  ts: '2026-04-27 02:14' },
  { id: '2AM-B3C4', product: 'MagSafe Wallet',     price: 34.99,  region: 'LA',  status: 'FULFILLED',  ts: '2026-04-26 23:58' },
  { id: '2AM-D5E6', product: 'Drop Shield',         price: 28.99,  region: 'CHI', status: 'PROCESSING', ts: '2026-04-26 21:33' },
  { id: 'CLK-0001', product: 'Clikey — Batch 01',   price: 89.00,  region: 'MIA', status: 'MFG',        ts: '2026-04-25 18:00' },
  { id: '2AM-F7G8', product: 'iPhone 16 Pro Case',  price: 62.99,  region: 'SEA', status: 'FULFILLED',  ts: '2026-04-24 14:22' },
]

// ── Reorder logic — mirrors what the webhook server executes automatically ────
async function triggerPrintifyReorder() {
  // In production: POST /api/trigger-reorder → server hits Printify API
  // Printify endpoint: POST /v1/shops/{shop_id}/orders.json
  console.log('[NIGHT.INC] Printify reorder triggered')
  await new Promise(r => setTimeout(r, 1400))  // simulate network
  return { success: true, printify_order_id: `PF-${Math.random().toString(16).slice(2, 10).toUpperCase()}` }
}

// ── $300 Rule ─────────────────────────────────────────────────────────────────
function evaluateRule(balance) {
  const triggered = balance > REORDER_THRESHOLD
  const deficit   = Math.max(0, REORDER_THRESHOLD - balance).toFixed(2)
  return {
    triggered,
    status: triggered
      ? 'TRIGGERING AUTOMATED RE-ORDER (PRINTIFY API)'
      : `MONITORING — $${deficit} TO THRESHOLD`,
    statusColor: triggered ? '#FF4D00' : '#F5F5F5',
    dotColor: triggered ? '#FF4D00' : '#525252',
  }
}

// ── Components ────────────────────────────────────────────────────────────────
function Cell({ label, value, color = '#F5F5F5', sub }) {
  return (
    <div className="flex flex-col gap-1 px-6 py-4 border-r last:border-r-0"
      style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="font-mono text-[8px] tracking-[3px] text-white/30 uppercase">{label}</div>
      <div className="font-mono text-lg font-bold" style={{ color, textShadow: `0 0 16px ${color}30` }}>{value}</div>
      {sub && <div className="font-mono text-[8px] tracking-[2px] text-white/25">{sub}</div>}
    </div>
  )
}

function StatusBadge({ status, color, dot }) {
  return (
    <div className="flex items-center gap-2.5">
      <motion.span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: dot }}
        animate={dot === '#FF4D00' ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span className="font-mono text-[10px] tracking-[2px] font-semibold"
        style={{ color }}>{status}</span>
    </div>
  )
}

function OrderRow({ order }) {
  const statusColors = {
    FULFILLED:  '#22C55E',
    PROCESSING: '#FF9F0A',
    MFG:        '#FF4D00',
  }
  const color = statusColors[order.status] || '#F5F5F5'
  return (
    <div className="flex items-center gap-0 border-b text-[10px]"
      style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
      <div className="font-mono tracking-[1px] text-white/40 px-4 py-3 w-28 flex-shrink-0">{order.id}</div>
      <div className="font-mono text-white/60 px-4 py-3 flex-1 min-w-0 truncate">{order.product}</div>
      <div className="font-mono text-white/40 px-4 py-3 w-20 text-right">${order.price.toFixed(2)}</div>
      <div className="font-mono text-white/30 px-4 py-3 w-14">{order.region}</div>
      <div className="font-mono font-semibold px-4 py-3 w-28 text-right" style={{ color }}>{order.status}</div>
      <div className="font-mono text-white/20 px-4 py-3 w-36 text-right">{order.ts}</div>
    </div>
  )
}

// ── Password gate ─────────────────────────────────────────────────────────────
function PasswordGate({ onUnlock }) {
  const [pw, setPw]       = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  function attempt() {
    if (pw === FOUNDER_PW) {
      sessionStorage.setItem('night_founder', '1')
      onUnlock()
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setPw('')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: '#050505' }}>
      <div className="noise-layer" aria-hidden />
      <motion.div
        animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="font-mono text-[9px] tracking-[5px] text-white/30 mb-2">NIGHT.INC</div>
        <div className="font-mono text-[9px] tracking-[5px] text-[#FF4D00]/60 mb-10">FOUNDER PORTAL</div>

        <div className="border p-8 space-y-6" style={{ borderColor: 'rgba(255,255,255,0.07)', background: '#070707' }}>
          <div className="font-mono text-[10px] tracking-[3px] text-white/40">ENTER ACCESS CODE</div>

          <input
            autoFocus
            type="password"
            value={pw}
            onChange={e => { setPw(e.target.value); setError(false) }}
            onKeyDown={e => e.key === 'Enter' && attempt()}
            placeholder="••••••••"
            className="w-full bg-transparent border-b font-mono text-sm text-white/80 py-2 outline-none placeholder-white/15 transition-colors duration-200"
            style={{
              borderColor: error ? '#FF4D00' : 'rgba(255,255,255,0.12)',
              caretColor: '#FF4D00',
            }}
          />

          {error && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="font-mono text-[9px] tracking-[2px] text-[#FF4D00]/70">
              ACCESS DENIED — INVALID CODE
            </motion.div>
          )}

          <button
            onClick={attempt}
            className="w-full font-mono text-[10px] tracking-[3px] uppercase py-3 border transition-all duration-200 pulse-cta"
            style={{ borderColor: '#FF4D00', color: '#FF4D00', background: 'rgba(255,77,0,0.06)' }}
          >
            AUTHENTICATE ▶
          </button>
        </div>

        <div className="mt-6 font-mono text-[8px] tracking-[2px] text-white/15 text-center">
          <button onClick={() => { window.location.hash = ''; window.location.reload() }}>
            ← BACK TO NIGHT.INC
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Main dashboard ────────────────────────────────────────────────────────────
function FounderDashboard({ onLogout }) {
  const [balance, setBalance]     = useState(() => generateBalance())
  const [reordering, setReorder]  = useState(false)
  const [reorderDone, setDone]    = useState(null)  // { printify_order_id }
  const [time, setTime]           = useState(new Date())
  const rule                      = evaluateRule(balance)

  // Drift balance every 12s to simulate live data
  useEffect(() => {
    const iv = setInterval(() => setBalance(generateBalance()), 12000)
    return () => clearInterval(iv)
  }, [])

  // Clock
  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(iv)
  }, [])

  async function handleReorder() {
    if (reordering) return
    setReorder(true)
    setDone(null)
    const result = await triggerPrintifyReorder()
    setReorder(false)
    setDone(result)
  }

  const totalRevenue = MOCK_ORDERS.reduce((s, o) => s + o.price, 0)
  const fulfilled    = MOCK_ORDERS.filter(o => o.status === 'FULFILLED').length

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(8px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen flex flex-col"
      style={{ background: '#050505', fontFamily: '"IBM Plex Mono", monospace' }}
    >
      <div className="noise-layer" aria-hidden />

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="border-b flex items-center justify-between px-8 py-3 flex-shrink-0"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-5">
          <div className="font-mono text-[10px] tracking-[5px] text-white/80">NIGHT.INC</div>
          <div className="w-px h-4 bg-white/10" />
          <div className="font-mono text-[9px] tracking-[3px]" style={{ color: '#FF4D00' }}>
            FOUNDER PORTAL
          </div>
        </div>
        <div className="flex items-center gap-5">
          <span className="font-mono text-[9px] tracking-[2px] text-white/30 tabular-nums">
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </span>
          <button onClick={onLogout}
            className="font-mono text-[8px] tracking-[3px] text-white/30 hover:text-white/60 border border-white/10 hover:border-white/25 px-3 py-1.5 transition-colors">
            [BACK]
          </button>
        </div>
      </div>

      {/* ── KPI bar ─────────────────────────────────────────────────── */}
      <div className="border-b flex flex-wrap flex-shrink-0"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <Cell label="Empire Balance"     value={`$${balance.toFixed(2)}`} color="#FF4D00" sub="ALL DIVISIONS" />
        <Cell label="Reorder Threshold"  value={`$${REORDER_THRESHOLD}.00`} color="#F5F5F5" sub="$300 RULE" />
        <Cell label="Total Orders"       value={MOCK_ORDERS.length} color="#00BFFF" sub="ALL TIME" />
        <Cell label="Revenue"            value={`$${totalRevenue.toFixed(2)}`} color="#22C55E" sub="THIS PERIOD" />
        <Cell label="Fulfilled"          value={fulfilled} color="#22C55E" sub={`OF ${MOCK_ORDERS.length}`} />
      </div>

      {/* ── $300 Rule card ──────────────────────────────────────────── */}
      <div className="px-8 pt-8 pb-6">
        <div className="border p-6 relative overflow-hidden"
          style={{ borderColor: rule.triggered ? 'rgba(255,77,0,0.35)' : 'rgba(255,255,255,0.06)', background: '#070707' }}>
          {rule.triggered && (
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, #FF4D00, transparent 60%)' }} />
          )}

          <div className="font-mono text-[8px] tracking-[4px] text-white/30 mb-4">$300 RULE — AUTO REORDER ENGINE</div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-3xl font-bold" style={{ color: '#FF4D00' }}>
                  ${balance.toFixed(2)}
                </span>
                <span className="font-mono text-[9px] tracking-[2px] text-white/30">
                  EMPIRE BALANCE
                </span>
              </div>

              <StatusBadge status={rule.status} color={rule.statusColor} dot={rule.dotColor} />

              {rule.triggered && (
                <div className="font-mono text-[9px] tracking-[1px] text-white/30 max-w-md leading-5">
                  Balance exceeds $300 threshold. Printify re-order API is queued.
                  New 2AM Cases print run will be dispatched automatically.
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleReorder}
                disabled={reordering}
                className="font-mono text-[10px] tracking-[2px] uppercase px-6 py-3 border transition-all duration-200 disabled:opacity-50"
                style={{
                  borderColor: '#FF4D00',
                  color: reordering ? '#FF4D00' : '#000',
                  background: reordering ? 'transparent' : '#FF4D00',
                }}
              >
                {reordering ? '↻ TRIGGERING...' : '↻ TRIGGER REORDER'}
              </button>

              {reorderDone && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  className="font-mono text-[8px] tracking-[1px] text-[#22C55E] text-center">
                  ✓ QUEUED: {reorderDone.printify_order_id}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Orders table ────────────────────────────────────────────── */}
      <div className="px-8 pb-8 flex-1">
        <div className="border" style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#070707' }}>
          <div className="border-b flex items-center justify-between px-4 py-3"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="font-mono text-[8px] tracking-[4px] text-white/30">ORDER FEED</div>
            <div className="font-mono text-[8px] tracking-[2px] text-[#22C55E]/60">
              ● LIVE
            </div>
          </div>
          {/* Table header */}
          <div className="flex text-[8px] border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            {['ORDER ID', 'PRODUCT', 'PRICE', 'REGION', 'STATUS', 'TIMESTAMP'].map(h => (
              <div key={h} className="font-mono tracking-[2px] text-white/20 px-4 py-2.5
                first:w-28 first:flex-shrink-0
                [&:nth-child(2)]:flex-1
                [&:nth-child(3)]:w-20 [&:nth-child(3)]:text-right
                [&:nth-child(4)]:w-14
                [&:nth-child(5)]:w-28 [&:nth-child(5)]:text-right
                [&:nth-child(6)]:w-36 [&:nth-child(6)]:text-right">
                {h}
              </div>
            ))}
          </div>
          {MOCK_ORDERS.map(o => <OrderRow key={o.id} order={o} />)}
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <div className="border-t px-8 py-2.5 flex items-center justify-between flex-shrink-0"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-4">
          {[['SQUARE', '#00BFFF'], ['PRINTIFY', '#22C55E'], ['2AM', '#00BFFF'], ['CLIKEY', '#FF4D00']].map(([l, c]) => (
            <div key={l} className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full" style={{ backgroundColor: c }} />
              <span className="font-mono text-[7px] tracking-[2px] text-white/25">{l}</span>
            </div>
          ))}
        </div>
        <div className="font-mono text-[7px] tracking-[3px] text-white/15">
          NIGHT.INC — FOUNDER PORTAL — AUTHORIZED ACCESS ONLY
        </div>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  FOUNDER PORTAL ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function FounderPortal() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem('night_founder') === '1'
  )

  function logout() {
    sessionStorage.removeItem('night_founder')
    window.location.hash = ''
    window.location.reload()
  }

  return unlocked
    ? <FounderDashboard onLogout={logout} />
    : <PasswordGate onUnlock={() => setUnlocked(true)} />
}
