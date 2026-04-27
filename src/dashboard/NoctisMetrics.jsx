import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function rand(min, max, decimals = 1) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

function ThermalGauge({ value, max = 85, label, color }) {
  const pct = Math.min(value / max, 1)
  const R = 36, stroke = 4
  const circ = 2 * Math.PI * R
  const arc = circ * 0.75  // 270° arc
  const filled = arc * pct
  const gap = circ - arc

  const hue = pct < 0.5 ? '#00BFFF' : pct < 0.75 ? '#FF8C00' : '#EF4444'

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: 88, height: 88 }}>
        <svg width="88" height="88" viewBox="0 0 88 88" style={{ transform: 'rotate(135deg)' }}>
          {/* Track */}
          <circle cx="44" cy="44" r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke}
            strokeDasharray={`${arc} ${gap}`} strokeLinecap="round" />
          {/* Fill */}
          <motion.circle
            cx="44" cy="44" r={R} fill="none" stroke={hue} strokeWidth={stroke}
            strokeLinecap="round"
            animate={{ strokeDasharray: `${filled} ${circ - filled}`, stroke: hue }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 4px ${hue}60)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-[13px] font-bold text-white">{value}°</span>
          <span className="font-mono text-[6px] tracking-[2px] text-gray-600">CELSIUS</span>
        </div>
      </div>
      <span className="font-mono text-[8px] tracking-[2px] text-gray-600">{label}</span>
    </div>
  )
}

const STATUS_OPTIONS = ['NOMINAL', 'NOMINAL', 'NOMINAL', 'ELEVATED', 'NOMINAL']

export default function NoctisMetrics({ data }) {
  const [temps, setTemps] = useState({ cpu: 42.3, ambient: 24.1, sla: 38.7 })
  const [uptime, setUptime] = useState(data?.uptime ?? 99.97)
  const [buildStatus, setBuildStatus] = useState('NOMINAL')
  const [batch, setBatch] = useState({ units: 4, complete: 0, status: 'MFG IN PROGRESS' })

  useEffect(() => {
    const iv = setInterval(() => {
      setTemps({
        cpu: rand(38, 56),
        ambient: rand(22, 27),
        sla: rand(34, 44),
      })
    }, 4000)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-[8px] tracking-[4px] text-gray-600 mb-1">NOCTIS LAB // THERMAL</div>
          <div className="font-mono text-lg font-bold" style={{ color: '#FF8C00', textShadow: '0 0 20px rgba(255,140,0,0.35)' }}>
            SYS NOMINAL
          </div>
        </div>
        <div className="font-mono text-[8px] tracking-[2px] text-green-DEFAULT" style={{ color: '#22C55E' }}>
          ↑ {uptime}% UPTIME
        </div>
      </div>

      {/* Thermal gauges */}
      <div className="border-t border-gray-900 pt-3">
        <div className="font-mono text-[7px] tracking-[3px] text-gray-700 mb-3">THERMAL READINGS</div>
        <div className="flex justify-around">
          <ThermalGauge value={temps.cpu} max={85} label="CPU" color="#FF8C00" />
          <ThermalGauge value={temps.ambient} max={40} label="AMBIENT" color="#FF8C00" />
          <ThermalGauge value={temps.sla} max={60} label="SLA" color="#FF8C00" />
        </div>
      </div>

      {/* Batch status */}
      <div className="border-t border-gray-900 pt-3 flex flex-col gap-2">
        <div className="font-mono text-[7px] tracking-[3px] text-gray-700">CLIKEY BATCH 01</div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] text-gray-400">STATUS</span>
          <span className="font-mono text-[9px] font-bold" style={{ color: '#FF8C00' }}>{batch.status}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] text-gray-400">UNITS PROVISIONED</span>
          <span className="font-mono text-[9px] font-bold text-white">04 / 04</span>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-gray-900 rounded-full overflow-hidden">
          <motion.div
            className="h-full"
            style={{ background: '#FF8C00' }}
            initial={{ width: 0 }}
            animate={{ width: '18%' }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>
        <div className="font-mono text-[7px] tracking-[2px] text-gray-800">18% COMPLETE — EST. SHIP Q3 2026</div>
      </div>
    </div>
  )
}
