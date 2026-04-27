import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ShopifyPulse from './dashboard/ShopifyPulse.jsx'
import NoctisMetrics from './dashboard/NoctisMetrics.jsx'
import APXScores from './dashboard/APXScores.jsx'
import ActivityFeed from './dashboard/ActivityFeed.jsx'

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }

function DashCard({ children, className = '', accent }) {
  return (
    <div
      className={`relative border border-gray-900 bg-gray-950 p-4 overflow-hidden ${className}`}
      style={accent ? { borderTopColor: accent, borderTopWidth: 1 } : {}}
    >
      {accent && (
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, ${accent}60, transparent 60%)` }} />
      )}
      {children}
    </div>
  )
}

function KPICell({ label, value, sub, color }) {
  return (
    <div className="flex flex-col gap-0.5 px-5 py-3 border-r border-gray-900 last:border-r-0">
      <div className="font-mono text-[7px] tracking-[3px] text-gray-700 uppercase">{label}</div>
      <div className="font-mono text-xl font-bold" style={{ color, textShadow: `0 0 16px ${color}40` }}>{value}</div>
      {sub && <div className="font-mono text-[7px] tracking-[2px] text-gray-700">{sub}</div>}
    </div>
  )
}

function Clock() {
  const [t, setT] = useState(new Date())
  useEffect(() => {
    const iv = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(iv)
  }, [])
  return (
    <span className="font-mono text-[9px] tracking-[3px] text-gray-600 tabular-nums">
      {t.toLocaleTimeString('en-US', { hour12: false })}
    </span>
  )
}

const QUICK_ACTIONS = [
  { label: 'PUSH SHOPIFY SALE', color: '#00BFFF', icon: '↑' },
  { label: 'NOCTIS LAB REPORT', color: '#FF8C00', icon: '⬡' },
  { label: 'BROADCAST TO OPS', color: '#8B5CF6', icon: '◈' },
  { label: 'CLIKEY BATCH UPDATE', color: '#A8A9AD', icon: '◻' },
]

export default function CEODashboard({ onLogout }) {
  const [visible, setVisible] = useState(false)
  const [kpis, setKpis] = useState({
    revenue: 1247.82,
    units: 247,
    operators: 91,
    temp: 42.3,
  })

  // Dissolve-in on mount
  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [])

  // Drift KPIs slowly
  useEffect(() => {
    const iv = setInterval(() => {
      setKpis(k => ({
        ...k,
        revenue: k.revenue + rand(0, 90) + Math.random(),
        units: k.units + (Math.random() > 0.7 ? 1 : 0),
        operators: rand(85, 120),
        temp: parseFloat((38 + Math.random() * 18).toFixed(1)),
      }))
    }, 6000)
    return () => clearInterval(iv)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.98, filter: visible ? 'blur(0px)' : 'blur(8px)' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-black flex flex-col"
      style={{ fontFamily: '"IBM Plex Mono", monospace' }}
    >
      {/* Scanline */}
      <div className="fixed inset-0 pointer-events-none scanlines opacity-30 z-50" />

      {/* Top header */}
      <div className="border-b border-gray-900 flex items-center justify-between px-6 py-3 shrink-0">
        <div className="flex items-center gap-5">
          <div className="font-mono text-[10px] tracking-[5px] text-white neon-white">NIGHT.INC</div>
          <div className="w-px h-4 bg-gray-800" />
          <div className="font-mono text-[9px] tracking-[3px]" style={{ color: '#FF8C00' }}>
            GOD VIEW
          </div>
          <div className="w-px h-4 bg-gray-800" />
          <div className="font-mono text-[8px] tracking-[3px] text-green-DEFAULT" style={{ color: '#22C55E' }}>
            CHRIS_MODE: ACTIVE
          </div>
        </div>
        <div className="flex items-center gap-5">
          <Clock />
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#22C55E' }} />
            <span className="font-mono text-[7px] tracking-[3px] text-gray-600">ALL SYSTEMS NOMINAL</span>
          </div>
          <button
            onClick={onLogout}
            className="font-mono text-[8px] tracking-[3px] text-gray-700 hover:text-gray-400 transition-colors border border-gray-900 hover:border-gray-700 px-3 py-1.5"
          >
            [LOGOUT]
          </button>
        </div>
      </div>

      {/* KPI bar */}
      <div className="border-b border-gray-900 flex shrink-0">
        <KPICell label="REVENUE TODAY" value={`$${kpis.revenue.toFixed(0)}`} sub="2AM CASES" color="#00BFFF" />
        <KPICell label="UNITS SOLD" value={kpis.units} sub="ALL TIME" color="#00BFFF" />
        <KPICell label="ACTIVE OPERATORS" value={kpis.operators} sub="APX PLATFORM" color="#8B5CF6" />
        <KPICell label="LAB TEMP" value={`${kpis.temp}°C`} sub="NOCTIS LAB" color={kpis.temp > 52 ? '#EF4444' : '#FF8C00'} />
        <KPICell label="BATCH 01" value="04 UNITS" sub="MFG IN PROGRESS" color="#A8A9AD" />
        <KPICell label="APX PRO KEYS" value="04" sub="CLIKEY-LINKED" color="#8B5CF6" />
      </div>

      {/* Main grid */}
      <div className="flex-1 grid grid-cols-12 grid-rows-[1fr_auto] overflow-hidden">

        {/* Row 1: Three main modules */}
        <DashCard className="col-span-5 row-span-1 border-r border-gray-900 overflow-y-auto" accent="#00BFFF">
          <ShopifyPulse data={{ revenue: kpis.revenue }} />
        </DashCard>

        <DashCard className="col-span-4 row-span-1 border-r border-gray-900 overflow-y-auto" accent="#FF8C00">
          <NoctisMetrics data={{ uptime: 99.97 }} />
        </DashCard>

        <DashCard className="col-span-3 row-span-1 overflow-y-auto" accent="#8B5CF6">
          <APXScores data={{ focusScore: 94, sessions: 3, streak: 12, xp: 2840 }} />
        </DashCard>

        {/* Row 2: Activity feed + Quick controls */}
        <DashCard className="col-span-8 border-t border-r border-gray-900 overflow-hidden" style={{ height: 240 }}>
          <ActivityFeed />
        </DashCard>

        <div className="col-span-4 border-t border-gray-900 p-4 flex flex-col gap-3" style={{ height: 240 }}>
          <div className="font-mono text-[8px] tracking-[4px] text-gray-600">QUICK ACTIONS</div>
          {QUICK_ACTIONS.map(a => (
            <button
              key={a.label}
              className="flex items-center gap-3 px-3 py-2.5 border border-gray-900 hover:border-gray-700 transition-colors text-left"
              style={{ background: 'rgba(255,255,255,0.01)' }}
            >
              <span className="font-mono text-sm" style={{ color: a.color }}>{a.icon}</span>
              <span className="font-mono text-[9px] tracking-[2px] text-gray-500 hover:text-gray-300 transition-colors">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div className="border-t border-gray-900 px-6 py-1.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          {[['SHOPIFY', '#00BFFF'], ['APX', '#8B5CF6'], ['NOCTIS', '#FF8C00'], ['CLIKEY', '#A8A9AD']].map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
              <span className="font-mono text-[7px] tracking-[2px] text-gray-700">{label}</span>
            </div>
          ))}
        </div>
        <span className="font-mono text-[7px] tracking-[3px] text-gray-800">
          NIGHT.INC // GOD VIEW — AUTHORIZED ACCESS ONLY
        </span>
      </div>
    </motion.div>
  )
}
