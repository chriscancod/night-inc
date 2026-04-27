import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import TerminalGate from './TerminalGate.jsx'

// ── Env / config ──────────────────────────────────────────────────────────────
const SQUARE_2AM_URL    = import.meta.env.VITE_SQUARE_2AM_URL    || '#checkout'
const SQUARE_CLIKEY_URL = import.meta.env.VITE_SQUARE_CLIKEY_URL || '#checkout'
const SQUARE_SHOP_URL   = SQUARE_2AM_URL  // shared storefront entry point

// ── Noise overlay ─────────────────────────────────────────────────────────────
function Noise() {
  return <div className="noise-layer" aria-hidden />
}

// ── Pulse CTA button ──────────────────────────────────────────────────────────
function CTA({ children, href, onClick, variant = 'primary', className = '' }) {
  const base =
    'inline-flex items-center gap-2 font-mono text-[11px] tracking-[3px] uppercase px-7 py-4 border transition-all duration-300 cursor-pointer select-none'
  const styles = {
    primary:
      'bg-[#FF4D00] border-[#FF4D00] text-black hover:bg-[#ff3300] hover:border-[#ff3300] pulse-cta',
    ghost:
      'bg-transparent border-white/20 text-[#F5F5F5] hover:border-[#FF4D00]/60 hover:text-[#FF4D00]',
    orange:
      'bg-transparent border-[#FF4D00]/50 text-[#FF4D00] hover:bg-[#FF4D00]/08 pulse-cta',
  }
  const cls = `${base} ${styles[variant]} ${className}`
  if (href && href !== '#checkout')
    return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>
  return <button onClick={onClick} className={cls}>{children}</button>
}

// ── Reveal-on-scroll wrapper ───────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Ticker tape ───────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  'INTEGRATED HARDWARE', '2AM CASES', 'NOCTIS // II', 'CLIKEY BATCH 01',
  'APX PLATFORM', 'AUTOMATED COMMERCE', 'NIGHT.INC', 'DARK BY DEFAULT',
]

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className="border-t border-b border-white/[0.05] py-2.5 overflow-hidden">
      <div className="ticker-track flex gap-12 whitespace-nowrap w-max">
        {items.map((t, i) => (
          <span key={i} className="font-mono text-[9px] tracking-[4px] text-white/20 uppercase">
            {t} <span className="text-[#FF4D00]/40 mx-4">◈</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-4 mb-14">
      <span className="font-mono text-[10px] tracking-[5px] text-[#FF4D00]/70 uppercase">{children}</span>
      <div className="flex-1 h-px bg-white/[0.06]" />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  HERO
// ═══════════════════════════════════════════════════════════════════════════════
function Hero({ onFounderClick }) {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { setTimeout(() => setLoaded(true), 120) }, [])

  const fade = (delay) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: loaded ? 1 : 0, y: loaded ? 0 : 16 },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  })

  return (
    <section className="relative flex flex-col justify-between min-h-screen px-8 md:px-16 pt-28 pb-0"
      style={{ background: '#050505' }}>

      {/* Ambient radial behind hero text */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div style={{
          position: 'absolute', top: '30%', left: '10%',
          width: 600, height: 400,
          background: 'radial-gradient(ellipse, rgba(255,77,0,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
      </div>

      {/* ── Main wordmark ───────────────────────────────────────────── */}
      <div className="relative z-10">
        <motion.div {...fade(0.05)} className="font-mono text-[10px] tracking-[6px] text-white/30 mb-6 uppercase">
          // 2026 — NIGHT INCORPORATED
        </motion.div>

        <motion.h1
          {...fade(0.15)}
          className="font-mono font-bold leading-[0.9] tracking-tighter mb-8"
          style={{ fontSize: 'clamp(52px, 10.5vw, 130px)', color: '#F5F5F5' }}
        >
          [NIGHT
          <span style={{ color: '#FF4D00' }}>.</span>
          INC]
        </motion.h1>

        <motion.p {...fade(0.28)} className="font-mono text-[13px] md:text-[15px] tracking-[4px] text-white/45 uppercase mb-10 max-w-lg">
          Integrated Hardware.<br />Automated Commerce.
        </motion.p>

        <motion.div {...fade(0.40)} className="flex flex-wrap gap-4">
          <CTA variant="primary" onClick={() => {
            document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
          }}>
            Shop Now ▶
          </CTA>
          <CTA variant="ghost" onClick={() => {
            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
          }}>
            Explore ↓
          </CTA>
        </motion.div>
      </div>

      {/* ── Bottom strip ────────────────────────────────────────────── */}
      <motion.div {...fade(0.55)} className="relative z-10 pt-16">
        <Ticker />
      </motion.div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  HARDWARE SECTION — Noctis // II (coming soon)
// ═══════════════════════════════════════════════════════════════════════════════
function HardwareSection() {
  const [hovered, setHovered] = useState(false)
  return (
    <section id="products" className="px-8 md:px-16 py-24" style={{ background: '#050505' }}>
      <SectionLabel>// Hardware</SectionLabel>
      <Reveal>
        <motion.div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          animate={{ borderColor: hovered ? 'rgba(255,77,0,0.25)' : 'rgba(255,255,255,0.06)' }}
          transition={{ duration: 0.25 }}
          className="relative border p-8 md:p-12 overflow-hidden"
          style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#070707' }}
        >
          {/* Top accent line */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px"
            animate={{ opacity: hovered ? 1 : 0.35 }}
            style={{ background: 'linear-gradient(90deg, #FF4D00, transparent 40%)' }}
          />
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{ background: 'radial-gradient(ellipse 50% 60% at 10% 30%, rgba(255,77,0,0.05), transparent)' }}
          />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            {/* Label block */}
            <div>
              <div className="font-mono text-[9px] tracking-[4px] text-white/30 mb-2">01 — HARDWARE</div>
              <div className="font-mono text-2xl md:text-3xl font-bold tracking-tight mb-3" style={{ color: '#F5F5F5' }}>
                NOCTIS // II
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00]" />
                <span className="font-mono text-[8px] tracking-[2px] text-white/30">COMING Q3 2026</span>
              </div>
            </div>

            {/* Body */}
            <div className="md:col-span-2 space-y-4">
              <p className="font-mono text-[12px] leading-relaxed text-white/45">
                A reconfigurable compute unit built for founders who operate at night.
                Mag-Link 24-pin connectivity. Thermal-monitored chassis. NightOS pre-installed.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 pt-2">
                {['24-pin MAG-LINK', 'ARM-X 12-core', 'NightOS v4.0', 'DEV UNIT'].map(s => (
                  <div key={s} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#FF4D00] opacity-50 flex-shrink-0" />
                    <span className="font-mono text-[9px] tracking-[1px] text-white/35">{s}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4">
                <CTA href="#waitlist" variant="orange">Join Waitlist ▶</CTA>
              </div>
            </div>
          </div>
        </motion.div>
      </Reveal>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SHOP SECTION — 2AM Cases × Clikey (unified storefront)
// ═══════════════════════════════════════════════════════════════════════════════
const CLIKEY_SPECS = [
  ['Operating Force', '45g actuation'],
  ['Total Travel',    '4.0 mm'],
  ['Material',        'CNC 6061 Aluminum'],
  ['Sound Profile',   'Full mechanical thock'],
  ['Finish',          'Matte black anodized'],
  ['Batch',           '01 — 4 units'],
]

const TWOAM_SPECS = [
  ['Device',          'iPhone 16 Pro'],
  ['Compatibility',   'MagSafe'],
  ['Protection',      'Drop Certified'],
  ['Material',        'CNC Polycarbonate'],
  ['Finish',          'Matte Night Black'],
  ['Shipping',        'Ships in 3 Days'],
]

function ShopProduct({ side, label, tagline, body, specs, accentColor, ctaHref, ctaLabel, delay }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Reveal delay={delay}>
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex flex-col h-full border overflow-hidden"
        animate={{ borderColor: hovered ? `${accentColor}35` : 'rgba(255,255,255,0.05)' }}
        transition={{ duration: 0.25 }}
        style={{ borderColor: 'rgba(255,255,255,0.05)', background: '#070707' }}
      >
        {/* Top accent line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px"
          animate={{ opacity: hovered ? 1 : 0.3 }}
          style={{ background: `linear-gradient(90deg, ${accentColor}, transparent 60%)` }}
        />

        {/* Ambient */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ background: `radial-gradient(ellipse 70% 50% at 20% 10%, ${accentColor}09, transparent)` }}
        />

        <div className="relative z-10 flex flex-col h-full p-8 md:p-10">
          {/* Header */}
          <div className="mb-8">
            <div className="font-mono text-[8px] tracking-[4px] mb-2" style={{ color: `${accentColor}80` }}>
              {tagline}
            </div>
            <div className="font-mono text-xl font-bold tracking-tight" style={{ color: '#F5F5F5' }}>{label}</div>
          </div>

          {/* Copy */}
          <p className="font-mono text-[11px] leading-relaxed text-white/35 mb-8 flex-1">{body}</p>

          {/* Spec table */}
          <div className="border mb-8" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <div className="px-5 py-2.5 border-b flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              <span className="font-mono text-[8px] tracking-[4px] text-white/25">SPEC SHEET</span>
              <span className="font-mono text-[8px] tracking-[2px]" style={{ color: `${accentColor}70` }}>REV 1.0</span>
            </div>
            {specs.map(([k, v]) => (
              <div key={k} className="px-5 py-3 flex items-center justify-between border-b last:border-b-0"
                style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
                <span className="font-mono text-[9px] tracking-[1px] text-white/25">{k}</span>
                <span className="font-mono text-[9px] tracking-[1px] font-semibold text-white/60">{v}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <CTA href={ctaHref} variant="primary">{ctaLabel}</CTA>
        </div>
      </motion.div>
    </Reveal>
  )
}

function ShopSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="shop" ref={ref} className="px-8 md:px-16 py-24 border-t"
      style={{ background: '#050505', borderColor: 'rgba(255,255,255,0.05)' }}>

      <SectionLabel>// Shop — 2AM Cases × Clikey</SectionLabel>

      {/* Editorial hero word */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="font-mono font-bold leading-none mb-4 tracking-tighter select-none"
        style={{ fontSize: 'clamp(48px, 11vw, 150px)', color: '#F5F5F5' }}
      >
        SHOP<span style={{ color: '#FF4D00' }}>.</span>
      </motion.div>

      <Reveal delay={0.1}>
        <p className="font-mono text-[11px] tracking-[3px] text-white/30 uppercase mb-16 max-w-lg">
          Two products. One store. Machined hardware and precision cases — built for the same person.
        </p>
      </Reveal>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <ShopProduct
          label="2AM CASES"
          tagline="02 — MOBILE ARMOR"
          body="CNC-precision cut for iPhone 16 Pro. MagSafe-compatible. Drop-certified. Designed after midnight when most people are asleep and you are working."
          specs={TWOAM_SPECS}
          accentColor="#FF4D00"
          ctaHref={SQUARE_2AM_URL}
          ctaLabel="Shop 2AM Cases ▶"
          delay={0.05}
        />
        <ShopProduct
          label="CLIKEY"
          tagline="03 — TACTILE INSTRUMENT"
          body="Not a toy. Machined from solid 6061 aluminum, tuned for one purpose: satisfying, repeatable mechanical feedback. 45g actuation. Full metal thock."
          specs={CLIKEY_SPECS}
          accentColor="#FF4D00"
          ctaHref={SQUARE_CLIKEY_URL}
          ctaLabel="Order Clikey — Batch 01 ▶"
          delay={0.15}
        />
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  NAV
// ═══════════════════════════════════════════════════════════════════════════════
function Nav({ onFounderClick, onCEOClick }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 md:px-16 h-16 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(5,5,5,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
      }}
    >
      <div className="font-mono text-[11px] font-bold tracking-[5px] text-white/90">
        NIGHT<span style={{ color: '#FF4D00' }}>.</span>INC
      </div>
      <nav className="flex items-center gap-6">
        <button
          onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
          className="font-mono text-[9px] tracking-[3px] text-white/40 hover:text-white/80 transition-colors uppercase"
        >
          Hardware
        </button>
        <button
          onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
          className="font-mono text-[9px] tracking-[3px] text-white/40 hover:text-white/80 transition-colors uppercase"
        >
          Shop
        </button>
        <button
          onClick={onFounderClick}
          className="font-mono text-[9px] tracking-[3px] text-white/40 hover:text-[#FF4D00]/80 transition-colors uppercase"
        >
          Founder
        </button>
        <CTA variant="primary" className="!px-5 !py-2.5 !text-[9px]" onClick={() => {
          document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
        }}>
          Shop ▶
        </CTA>
      </nav>
    </motion.header>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  FOOTER
// ═══════════════════════════════════════════════════════════════════════════════
function Footer({ onCEOClick }) {
  return (
    <footer className="border-t px-8 md:px-16 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      style={{ borderColor: 'rgba(255,255,255,0.05)', background: '#050505' }}>
      <div className="font-mono text-[9px] tracking-[4px] text-white/20">
        © {new Date().getFullYear()} NIGHT INCORPORATED — ALL RIGHTS RESERVED
      </div>
      <div className="flex items-center gap-6">
        <span className="font-mono text-[8px] tracking-[2px] text-white/15">
          HARDWARE · 2AM CASES · CLIKEY · APX
        </span>
        <button
          onClick={onCEOClick}
          className="font-mono text-[8px] tracking-[2px] text-white/15 hover:text-[#FF4D00]/50 transition-colors"
        >
          CMD ▸
        </button>
      </div>
    </footer>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PUBLIC LANDING ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function PublicLanding({ onAuth }) {
  const [gateOpen, setGateOpen] = useState(false)
  const [authing, setAuthing] = useState(false)

  function handleAuth() {
    setAuthing(true)
    setTimeout(onAuth, 500)
  }

  function goFounder() {
    window.location.hash = '#/founder'
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  }

  return (
    <div style={{ background: '#050505', minHeight: '100vh' }}>
      <Noise />

      <Nav onFounderClick={goFounder} onCEOClick={() => setGateOpen(true)} />

      {/* Auth flash */}
      <AnimatePresence>
        {authing && (
          <motion.div className="fixed inset-0 z-[100] bg-white pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0] }}
            transition={{ duration: 0.45, ease: 'easeOut' }} />
        )}
      </AnimatePresence>

      <main>
        <Hero onFounderClick={goFounder} />
        <HardwareSection />
        <ShopSection />
      </main>

      <Footer onCEOClick={() => setGateOpen(true)} />

      <TerminalGate
        isOpen={gateOpen}
        onClose={() => setGateOpen(false)}
        onSuccess={handleAuth}
      />
    </div>
  )
}
