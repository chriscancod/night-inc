import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }

const EVENT_POOL = [
  { tag: 'SHOPIFY', text: 'Order #2AM-{id} — iPhone 16 Pro Case × 1', color: '#00BFFF' },
  { tag: 'SHOPIFY', text: 'Drop Shield sold → ATL', color: '#00BFFF' },
  { tag: 'APX', text: 'CHRIS focus session complete — +{xp} XP', color: '#8B5CF6' },
  { tag: 'APX', text: 'Operator NOCTIS_X hit 5-day streak', color: '#8B5CF6' },
  { tag: 'NOCTIS', text: 'Lab thermal nominal — CPU 42.1°C', color: '#FF8C00' },
  { tag: 'CLIKEY', text: 'Batch 01 print cycle {n}/24 complete', color: '#A8A9AD' },
  { tag: 'APX', text: 'Pro key activated: APX-PRO-{id}', color: '#8B5CF6' },
  { tag: 'SHOPIFY', text: 'MagSafe Wallet sold → NYC', color: '#00BFFF' },
  { tag: 'NOCTIS', text: 'Noctis OS v4 build check passed', color: '#FF8C00' },
  { tag: 'SYS', text: 'CEO dashboard accessed // CHRIS_MODE', color: '#525252' },
]

function genEvent() {
  const template = EVENT_POOL[rand(0, EVENT_POOL.length - 1)]
  return {
    id: Math.random().toString(36).slice(2),
    tag: template.tag,
    text: template.text
      .replace('{id}', rand(1000, 9999).toString(16).toUpperCase())
      .replace('{xp}', rand(50, 200).toString())
      .replace('{n}', rand(1, 24).toString()),
    color: template.color,
    ts: new Date().toLocaleTimeString('en-US', { hour12: false }),
  }
}

export default function ActivityFeed() {
  const [events, setEvents] = useState(() => Array.from({ length: 8 }, genEvent))

  useEffect(() => {
    const iv = setInterval(() => {
      setEvents(prev => [genEvent(), ...prev].slice(0, 14))
    }, rand(2500, 5500))
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center gap-3">
        <div className="font-mono text-[8px] tracking-[4px] text-gray-600">ACTIVITY FEED // ALL DIVISIONS</div>
        <div className="flex items-center gap-1 ml-auto">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-green-DEFAULT" style={{ backgroundColor: '#22C55E' }} />
          <span className="font-mono text-[7px] tracking-[2px] text-gray-600">STREAMING</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col gap-0">
        <AnimatePresence initial={false}>
          {events.map(ev => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, x: -12, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-3 py-1.5 border-b border-gray-950"
            >
              <span className="font-mono text-[7px] text-gray-700 w-16 shrink-0">{ev.ts}</span>
              <span className="font-mono text-[7px] tracking-[2px] px-1.5 py-0.5 shrink-0"
                style={{ color: ev.color, border: `1px solid ${ev.color}30`, background: `${ev.color}08` }}>
                {ev.tag}
              </span>
              <span className="font-mono text-[9px] text-gray-500 truncate">{ev.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
