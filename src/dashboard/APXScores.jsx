import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }

function Ring({ value, max = 100, color, label, sublabel }) {
  const pct = value / max
  const R = 30, strokeW = 3
  const circ = 2 * Math.PI * R

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: 72, height: 72 }}>
        <svg width="72" height="72" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeW} />
          <motion.circle
            cx="36" cy="36" r={R}
            fill="none" stroke={color} strokeWidth={strokeW} strokeLinecap="round"
            style={{ rotate: '-90deg', transformOrigin: '50% 50%', filter: `drop-shadow(0 0 4px ${color}70)` }}
            animate={{ strokeDasharray: `${circ * pct} ${circ * (1 - pct)}` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-[12px] font-bold text-white">{value}</span>
          <span className="font-mono text-[6px] text-gray-600">{sublabel}</span>
        </div>
      </div>
      <span className="font-mono text-[8px] tracking-[2px] text-gray-600 text-center">{label}</span>
    </div>
  )
}

const OPERATORS = [
  { name: 'CHRIS', score: 94, streak: 12 },
  { name: 'APEX_01', score: 81, streak: 7 },
  { name: 'NOCTIS_X', score: 76, streak: 5 },
  { name: 'OPERATOR_9', score: 68, streak: 3 },
]

export default function APXScores({ data }) {
  const [scores, setScores] = useState({
    focus: data?.focusScore ?? 94,
    sessions: data?.sessions ?? 3,
    streak: data?.streak ?? 12,
    xp: data?.xp ?? 2840,
  })

  useEffect(() => {
    const iv = setInterval(() => {
      setScores(s => ({ ...s, xp: s.xp + rand(0, 25) }))
    }, 5000)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-[8px] tracking-[4px] text-gray-600 mb-1">APX PRO // FOCUS SCORES</div>
          <div className="font-mono text-lg font-bold" style={{ color: '#8B5CF6', textShadow: '0 0 20px rgba(139,92,246,0.4)' }}>
            CHRIS_MODE ★
          </div>
        </div>
        <div className="font-mono text-[10px] font-bold text-white">
          {scores.xp.toLocaleString()} <span style={{ color: '#8B5CF6' }}>XP</span>
        </div>
      </div>

      {/* Score rings */}
      <div className="border-t border-gray-900 pt-3">
        <div className="font-mono text-[7px] tracking-[3px] text-gray-700 mb-3">TODAY'S METRICS</div>
        <div className="flex justify-around">
          <Ring value={scores.focus} max={100} color="#8B5CF6" label="FOCUS" sublabel="SCORE" />
          <Ring value={scores.sessions} max={6} color="#FF8C00" label="SESSIONS" sublabel="TODAY" />
          <Ring value={scores.streak} max={30} color="#00BFFF" label="STREAK" sublabel="DAYS" />
        </div>
      </div>

      {/* Operator leaderboard */}
      <div className="border-t border-gray-900 pt-3 flex flex-col gap-1.5">
        <div className="font-mono text-[7px] tracking-[3px] text-gray-700 mb-1">OPERATOR BOARD</div>
        {OPERATORS.map((op, i) => (
          <div key={op.name} className="flex items-center gap-2">
            <span className="font-mono text-[7px] text-gray-700 w-4">0{i + 1}</span>
            <div className="flex-1 flex items-center gap-2">
              <span className="font-mono text-[9px] text-gray-400 w-20">{op.name}</span>
              <div className="flex-1 h-0.5 bg-gray-900">
                <motion.div
                  className="h-full"
                  style={{ background: i === 0 ? '#8B5CF6' : 'rgba(139,92,246,0.3)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${op.score}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                />
              </div>
            </div>
            <span className="font-mono text-[9px] font-bold" style={{ color: i === 0 ? '#8B5CF6' : '#525252' }}>
              {op.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
