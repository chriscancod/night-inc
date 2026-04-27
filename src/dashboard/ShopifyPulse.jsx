import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PRODUCTS = ['iPhone 16 Pro Case', 'MagSafe Wallet', 'Drop Shield', 'Night Edition Bundle']
const REGIONS  = ['NYC', 'LA', 'CHI', 'MIA', 'ATL', 'DEN', 'SEA', 'BOS']

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function fmtCurrency(n) { return `$${n.toFixed(2)}` }

function genSale() {
  return {
    id: Math.random().toString(36).slice(2, 8).toUpperCase(),
    product: PRODUCTS[rand(0, PRODUCTS.length - 1)],
    amount: rand(29, 89) + 0.99,
    region: REGIONS[rand(0, REGIONS.length - 1)],
    ts: new Date(),
  }
}

// Tiny sparkline
function Sparkline({ data, color }) {
  const W = 180, H = 40
  if (data.length < 2) return null
  const min = Math.min(...data), max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W
    const y = H - ((v - min) / range) * H
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={W} height={H} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,${H} ${pts} ${W},${H}`} fill={`${color}15`} stroke="none" />
    </svg>
  )
}

export default function ShopifyPulse({ data }) {
  const [sales, setSales] = useState(() => Array.from({ length: 6 }, genSale))
  const [sparkData, setSparkData] = useState(() => Array.from({ length: 18 }, () => rand(20, 120)))
  const [totalToday, setTotalToday] = useState(data?.revenue ?? 1247.82)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const iv = setInterval(() => {
      const sale = genSale()
      setSales(prev => [sale, ...prev].slice(0, 6))
      setTotalToday(t => t + sale.amount)
      setSparkData(prev => [...prev.slice(1), rand(20, 140)])
      setPulse(true)
      setTimeout(() => setPulse(false), 400)
    }, rand(3000, 7000))
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-[8px] tracking-[4px] text-gray-600 mb-1">2AM CASES // SHOPIFY PULSE</div>
          <motion.div
            animate={pulse ? { scale: [1, 1.04, 1], color: ['#00BFFF', '#fff', '#00BFFF'] } : {}}
            transition={{ duration: 0.4 }}
            className="font-mono text-2xl font-bold"
            style={{ color: '#00BFFF', textShadow: '0 0 20px rgba(0,191,255,0.4)' }}
          >
            {fmtCurrency(totalToday)}
          </motion.div>
          <div className="font-mono text-[8px] tracking-[3px] text-gray-700">TODAY'S REVENUE</div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#00BFFF' }} />
          <span className="font-mono text-[8px] tracking-[2px]" style={{ color: '#00BFFF' }}>LIVE</span>
        </div>
      </div>

      {/* Sparkline */}
      <div className="border-t border-gray-900 pt-3">
        <div className="font-mono text-[7px] tracking-[3px] text-gray-700 mb-2">24H REVENUE TREND</div>
        <Sparkline data={sparkData} color="#00BFFF" />
      </div>

      {/* Sales feed */}
      <div className="flex-1 border-t border-gray-900 pt-3 flex flex-col gap-0 overflow-hidden">
        <div className="font-mono text-[7px] tracking-[3px] text-gray-700 mb-2">RECENT ORDERS</div>
        <AnimatePresence initial={false}>
          {sales.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -8, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between py-1.5 border-b border-gray-950"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono text-[7px] text-gray-700 shrink-0">{s.region}</span>
                <span className="font-mono text-[9px] text-gray-400 truncate">{s.product}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-[9px] font-bold" style={{ color: '#00BFFF' }}>
                  {fmtCurrency(s.amount)}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
