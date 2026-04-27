import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SECRET = 'chris-mode'

// ── NFC Tap Animation ─────────────────────────────────────────────────────────

function NFCTap({ onSuccess }) {
  const [tapping, setTapping] = useState(false)
  const [done, setDone] = useState(false)

  function handleTap() {
    if (tapping || done) return
    setTapping(true)
    setTimeout(() => {
      setDone(true)
      setTimeout(onSuccess, 900)
    }, 1400)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="font-mono text-[9px] tracking-[4px] text-gray-600 uppercase">
        NFC ENTRY POINT
      </div>

      <div
        onClick={handleTap}
        className="relative flex items-center justify-center cursor-pointer select-none"
        style={{ width: 120, height: 120 }}
      >
        {/* Concentric rings */}
        {[0, 1, 2, 3].map(i => (
          <motion.div
            key={i}
            className="absolute rounded-full border"
            style={{
              width: 30 + i * 24,
              height: 30 + i * 24,
              borderColor: done ? 'rgba(34,197,94,0.5)' : 'rgba(255,140,0,0.2)',
            }}
            animate={tapping ? {
              scale: [1, 1.4, 1],
              opacity: [0.6, 0, 0.6],
            } : { scale: 1, opacity: 0.3 + i * 0.05 }}
            transition={{
              duration: tapping ? 0.7 : 2,
              delay: tapping ? i * 0.08 : i * 0.4,
              repeat: tapping ? 2 : Infinity,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Center icon */}
        <motion.div
          className="relative z-10 flex items-center justify-center rounded-full border"
          style={{
            width: 52, height: 52,
            borderColor: done ? '#22C55E' : 'rgba(255,140,0,0.5)',
            background: done ? 'rgba(34,197,94,0.08)' : 'rgba(255,140,0,0.05)',
          }}
          animate={tapping ? { scale: [1, 0.9, 1.05, 1] } : {}}
          transition={{ duration: 0.4 }}
        >
          {done ? (
            <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </motion.svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,140,0,0.7)" strokeWidth="1.5" strokeLinecap="round">
              <path d="M20 12a8 8 0 1 1-4.03-6.93"/>
              <path d="M14.5 12a2.5 2.5 0 1 1-1.77-2.4"/>
              <circle cx="12" cy="12" r="0.5" fill="rgba(255,140,0,0.7)"/>
            </svg>
          )}
        </motion.div>
      </div>

      <div className="font-mono text-[10px] tracking-[3px] text-gray-500 uppercase">
        {done ? (
          <span className="text-green-DEFAULT" style={{ color: '#22C55E' }}>IDENTITY CONFIRMED</span>
        ) : tapping ? (
          <span style={{ color: '#FF8C00' }}>READING...</span>
        ) : (
          'TAP TO AUTHENTICATE'
        )}
      </div>
    </div>
  )
}

// ── Terminal ──────────────────────────────────────────────────────────────────

function Terminal({ onSuccess }) {
  const [lines, setLines] = useState([
    '> NIGHT.INC SECURE SHELL v2.4.1',
    '> CONNECTION ENCRYPTED — AES-256',
    '> AWAITING OPERATOR CREDENTIALS...',
  ])
  const [input, setInput] = useState('')
  const [shake, setShake] = useState(false)
  const [success, setSuccess] = useState(false)
  const inputRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [lines])

  function submit() {
    if (input.trim().toLowerCase() === SECRET) {
      setLines(l => [...l, `> ${input}`, '> PASSPHRASE ACCEPTED — WELCOME, CHRIS.', '> LOADING COMMAND CENTER...'])
      setInput('')
      setSuccess(true)
      setTimeout(onSuccess, 1200)
    } else {
      setLines(l => [...l, `> ${input}`, '> ACCESS DENIED — INVALID CREDENTIALS'])
      setInput('')
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <motion.div
      animate={shake ? { x: [-6, 6, -4, 4, 0] } : {}}
      transition={{ duration: 0.3 }}
      className="flex flex-col font-mono text-[11px] leading-relaxed"
      style={{ width: '100%', minHeight: 180 }}
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((line, i) => (
        <div key={i} className="text-gray-500"
          style={{ color: line.includes('ACCEPTED') ? '#22C55E' : line.includes('DENIED') ? '#EF4444' : undefined }}>
          {line}
        </div>
      ))}
      {!success && (
        <div className="flex items-center gap-1 mt-1" style={{ color: '#FF8C00' }}>
          <span>{'>'}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            className="bg-transparent outline-none flex-1 caret-noctis"
            style={{ caretColor: '#FF8C00', color: '#FF8C00' }}
            spellCheck={false}
            autoComplete="off"
          />
          <span className="animate-blink" style={{ color: '#FF8C00' }}>█</span>
        </div>
      )}
      <div ref={bottomRef} />
    </motion.div>
  )
}

// ── TerminalGate overlay ──────────────────────────────────────────────────────

export default function TerminalGate({ isOpen, onClose, onSuccess }) {
  const [mode, setMode] = useState('terminal') // 'terminal' | 'nfc'

  const handleSuccess = useCallback(() => {
    setTimeout(onSuccess, 400)
  }, [onSuccess])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.96)' }}
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          {/* Scanline overlay */}
          <div className="fixed inset-0 pointer-events-none scanlines" style={{ zIndex: 51 }} />

          <motion.div
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl border border-gray-800"
            style={{ background: '#000', zIndex: 52 }}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-900">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-noctis-DEFAULT animate-pulse" style={{ backgroundColor: '#FF8C00' }} />
                <span className="font-mono text-[10px] tracking-[4px] text-gray-500">RESTRICTED ACCESS — NIGHT.INC</span>
              </div>
              <button onClick={onClose} className="font-mono text-[10px] text-gray-700 hover:text-gray-400 transition-colors tracking-widest">
                [ESC]
              </button>
            </div>

            {/* Mode tabs */}
            <div className="flex border-b border-gray-900">
              {[['terminal', 'TERMINAL'], ['nfc', 'NFC // PAT']].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setMode(key)}
                  className="flex-1 py-3 font-mono text-[9px] tracking-[3px] transition-colors"
                  style={{
                    color: mode === key ? '#FF8C00' : '#525252',
                    borderBottom: mode === key ? '1px solid #FF8C00' : '1px solid transparent',
                    background: mode === key ? 'rgba(255,140,0,0.03)' : 'transparent',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 min-h-[240px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {mode === 'terminal' ? (
                  <motion.div key="terminal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Terminal onSuccess={handleSuccess} />
                  </motion.div>
                ) : (
                  <motion.div key="nfc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex justify-center py-4">
                    <NFCTap onSuccess={handleSuccess} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-900 px-5 py-2.5 flex items-center justify-between">
              <span className="font-mono text-[8px] tracking-[3px] text-gray-800">AUTHORIZED PERSONNEL ONLY</span>
              <span className="font-mono text-[8px] tracking-[2px] text-gray-800">© NIGHT.INC {new Date().getFullYear()}</span>
            </div>

            {/* Corner ticks */}
            {[['top-0 left-0', '6 0 0 6 0 0'], ['top-0 right-0', '0 0 6 0 6 0'],
              ['bottom-0 left-0', '6 0 0 6 6 6'], ['bottom-0 right-0', '0 0 6 0 0 6']].map(([pos], i) => (
              <div key={i} className={`absolute ${pos} w-3 h-3`}
                style={{ borderColor: 'rgba(255,140,0,0.3)', borderStyle: 'solid',
                  borderWidth: i === 0 ? '1px 0 0 1px' : i === 1 ? '1px 1px 0 0' : i === 2 ? '0 0 1px 1px' : '0 1px 1px 0' }} />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
