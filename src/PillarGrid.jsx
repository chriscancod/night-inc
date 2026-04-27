import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PILLARS = [
  {
    id: 'noctis',
    label: 'NOCTIS',
    division: 'OS / HARDWARE',
    color: '#FF8C00',
    colorDim: 'rgba(255,140,0,0.08)',
    status: 'ACTIVE',
    tagline: 'Dark Operating System for Operators',
    products: ['Noctis OS v4', 'NoctisPad', 'Noctis // II (DEV)'],
    metric: { label: 'UNITS PROVISIONED', value: '04' },
    classify: 'BATCH 01 — MFG IN PROGRESS',
  },
  {
    id: 'twoam',
    label: '2AM',
    division: 'CASES / ACCESSORIES',
    color: '#00BFFF',
    colorDim: 'rgba(0,191,255,0.08)',
    status: 'LIVE',
    tagline: 'Precision-Cut Mobile Armor for the Night Shift',
    products: ['iPhone 16 Pro Case', 'MagSafe Wallet', 'Drop Shield'],
    metric: { label: 'UNITS MOVED', value: '247' },
    classify: 'SHOPIFY ACTIVE — REVENUE LIVE',
  },
  {
    id: 'apx',
    label: 'APX',
    division: 'PRODUCTIVITY / APP',
    color: '#8B5CF6',
    colorDim: 'rgba(139,92,246,0.08)',
    status: 'BETA',
    tagline: 'Operator-Grade Focus & Command System',
    products: ['APX iOS App', 'APX Pro Keys', 'Focus Protocols'],
    metric: { label: 'ACTIVE OPERATORS', value: '∞' },
    classify: 'TESTFLIGHT — DEPLOYING',
  },
  {
    id: 'clikey',
    label: 'CLIKEY',
    division: 'PERIPHERALS / HARDWARE',
    color: '#A8A9AD',
    colorDim: 'rgba(168,169,173,0.08)',
    status: 'MFG',
    tagline: '3D-Printed Matte Mechanical Keycap',
    products: ['Clikey Batch 01', 'APX Integration Key', 'Clikey Pro (TBD)'],
    metric: { label: 'BATCH SIZE', value: '04' },
    classify: 'NOCTIS LABS — IN PRODUCTION',
  },
]

function StatusDot({ status, color }) {
  const pulse = status === 'LIVE' || status === 'ACTIVE'
  return (
    <span className="relative inline-flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
            style={{ backgroundColor: color }} />
        )}
        <span className="relative inline-flex rounded-full h-2 w-2"
          style={{ backgroundColor: pulse ? color : '#525252' }} />
      </span>
      <span className="font-mono text-[9px] tracking-[3px]" style={{ color }}>
        {status}
      </span>
    </span>
  )
}

function Pillar({ p, isOpen, onClick }) {
  return (
    <motion.div
      layout
      onClick={onClick}
      className="relative cursor-pointer border-l border-gray-800 overflow-hidden"
      style={{ borderLeftColor: isOpen ? p.color : undefined, borderLeftWidth: isOpen ? 2 : 1 }}
      animate={{ flex: isOpen ? 2.6 : 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Background glow when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 30% 50%, ${p.colorDim} 0%, transparent 70%)` }}
          />
        )}
      </AnimatePresence>

      <div className="relative h-full flex flex-col px-5 py-6 gap-6">
        {/* Vertical label (always visible) */}
        <div className="flex flex-col items-start gap-3">
          <StatusDot status={p.status} color={p.color} />
          <motion.h2
            className="font-mono font-bold tracking-widest uppercase"
            animate={{ fontSize: isOpen ? '28px' : '13px', writingMode: isOpen ? 'horizontal-tb' : 'vertical-rl' }}
            transition={{ duration: 0.4 }}
            style={{ color: p.color, textShadow: isOpen ? `0 0 28px ${p.color}60` : 'none', lineHeight: 1.1 }}
          >
            {p.label}
          </motion.h2>
          <AnimatePresence>
            {isOpen && (
              <motion.p
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                transition={{ delay: 0.15 }}
                className="font-mono text-[10px] tracking-[2px] text-gray-500 uppercase"
              >
                {p.division}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ delay: 0.12, duration: 0.3 }}
              className="flex flex-col gap-5 flex-1"
            >
              <p className="font-mono text-[11px] text-gray-300 leading-relaxed max-w-xs">
                {p.tagline}
              </p>

              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[8px] tracking-[3px] text-gray-600">PRODUCTS</span>
                {p.products.map(prod => (
                  <div key={prod} className="flex items-center gap-2">
                    <span className="text-[9px]" style={{ color: p.color }}>▸</span>
                    <span className="font-mono text-[10px] text-gray-400">{prod}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-gray-900">
                <div className="font-mono text-[8px] tracking-[3px] text-gray-600 mb-1">{p.metric.label}</div>
                <div className="font-mono text-3xl font-bold" style={{ color: p.color, textShadow: `0 0 24px ${p.color}50` }}>
                  {p.metric.value}
                </div>
                <div className="font-mono text-[8px] tracking-[2px] text-gray-700 mt-2">{p.classify}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Closed state: division tag at bottom */}
        {!isOpen && (
          <div className="mt-auto">
            <div className="font-mono text-[7px] tracking-[2px] text-gray-700 uppercase"
              style={{ writingMode: 'vertical-rl' }}>
              {p.division}
            </div>
          </div>
        )}
      </div>

      {/* Top edge accent */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, ${p.color}40, transparent)` }} />
    </motion.div>
  )
}

export default function PillarGrid() {
  const [openId, setOpenId] = useState(null)

  return (
    <div className="w-full border-t border-gray-900">
      <div className="flex h-[340px]">
        {PILLARS.map(p => (
          <Pillar
            key={p.id}
            p={p}
            isOpen={openId === p.id}
            onClick={() => setOpenId(openId === p.id ? null : p.id)}
          />
        ))}
      </div>
      <div className="border-t border-gray-900 px-6 py-2 flex items-center justify-between">
        <span className="font-mono text-[8px] tracking-[3px] text-gray-700">
          NIGHT.INC // FOUR DIVISIONS — CLICK TO EXPAND
        </span>
        <span className="font-mono text-[8px] tracking-[3px] text-gray-700">
          CLASSIFIED // DO NOT DISTRIBUTE
        </span>
      </div>
    </div>
  )
}
