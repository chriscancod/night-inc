import { useRef, useState } from 'react'
import {
  motion,
  useMotionValue, useSpring, useTransform, useAnimationFrame,
} from 'framer-motion'

const W = 72, H = 220, D = 18

const FACE_BASE = {
  position: 'absolute',
  border: '1px solid rgba(255,140,0,0.32)',
  background: 'rgba(255,140,0,0.012)',
}

function Face({ style }) {
  return <div style={{ ...FACE_BASE, ...style }} />
}

export default function WireframeMonolith() {
  const ref = useRef(null)
  const [hovered, setHovered] = useState(false)

  // Continuous spin driven by animation frame
  const spinY = useMotionValue(0)
  const mouseOffsetX = useMotionValue(0)
  const mouseOffsetY = useMotionValue(0)

  const spring = { stiffness: 140, damping: 22 }
  const springOffsetX = useSpring(mouseOffsetX, spring)
  const springOffsetY = useSpring(mouseOffsetY, spring)

  // Combine spin + mouse offset for rotateY
  const rotateY = useTransform(
    [spinY, springOffsetX],
    ([s, m]) => s + m
  )
  const rotateX = springOffsetY

  useAnimationFrame((_, delta) => {
    if (!hovered) spinY.set(spinY.get() + delta * 0.022)
  })

  function onMove(e) {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mouseOffsetX.set(((e.clientX - r.left) / r.width - 0.5) * 28)
    mouseOffsetY.set(((e.clientY - r.top) / r.height - 0.5) * -14)
  }
  function onEnter() { setHovered(true) }
  function onLeave() {
    setHovered(false)
    mouseOffsetX.set(0)
    mouseOffsetY.set(0)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative flex items-center justify-center"
      style={{ width: W + 60, height: H + 60, perspective: 800 }}
    >
      {/* Ground glow */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: 100, height: 24, background: 'radial-gradient(ellipse, rgba(255,140,0,0.3) 0%, transparent 70%)', filter: 'blur(6px)' }} />

      <motion.div
        style={{
          width: W, height: H,
          position: 'relative',
          transformStyle: 'preserve-3d',
          rotateY,
          rotateX,
        }}
      >
        {/* Front */}
        <Face style={{ top: 0, left: 0, width: W, height: H, transform: `translateZ(${D / 2}px)` }} />
        {/* Back */}
        <Face style={{ top: 0, left: 0, width: W, height: H, transform: `rotateY(180deg) translateZ(${D / 2}px)` }} />
        {/* Left */}
        <Face style={{ top: 0, left: W / 2 - D / 2, width: D, height: H, transform: `rotateY(-90deg) translateZ(${W / 2}px)` }} />
        {/* Right */}
        <Face style={{ top: 0, left: W / 2 - D / 2, width: D, height: H, transform: `rotateY(90deg) translateZ(${W / 2}px)` }} />
        {/* Top */}
        <Face style={{ top: H / 2 - D / 2, left: 0, width: W, height: D, transform: `rotateX(90deg) translateZ(${H / 2}px)` }} />
        {/* Bottom */}
        <Face style={{ top: H / 2 - D / 2, left: 0, width: W, height: D, transform: `rotateX(-90deg) translateZ(${H / 2}px)` }} />

        {/* Front face grid lines */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: W, height: H,
          transform: `translateZ(${D / 2 + 0.5}px)`,
          backgroundImage: `
            linear-gradient(rgba(255,140,0,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,140,0,0.07) 1px, transparent 1px)
          `,
          backgroundSize: '18px 18px',
        }} />

        {/* Specular streak */}
        <div style={{
          position: 'absolute', top: '15%', left: '18%',
          width: 3, height: '55%',
          transform: `translateZ(${D / 2 + 1}px)`,
          background: 'linear-gradient(to bottom, transparent, rgba(255,140,0,0.28), transparent)',
        }} />
      </motion.div>

      {/* Corner ticks */}
      {[[0, 0, '1px 0 0 1px'], [W + 48, 0, '1px 1px 0 0'], [0, H + 48, '0 0 1px 1px'], [W + 48, H + 48, '0 1px 1px 0']].map(([x, y, bw], i) => (
        <div key={i} style={{
          position: 'absolute', top: y, left: x, width: 10, height: 10,
          border: `${bw} solid rgba(255,140,0,0.3)`,
        }} />
      ))}
    </div>
  )
}
