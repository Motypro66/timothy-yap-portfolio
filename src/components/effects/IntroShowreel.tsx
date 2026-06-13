import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCommand } from '../../context/CommandContext'
import { useLanguage } from '../../i18n/LanguageContext'
import Logo from '../ui/Logo'

const PHASE_MS = [0, 900, 2200, 3600, 4800]

export default function IntroShowreel() {
  const { introComplete, setIntroComplete } = useCommand()
  const { t } = useLanguage()
  const [phase, setPhase] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  const finish = useCallback(() => setIntroComplete(true), [setIntroComplete])

  useEffect(() => {
    if (introComplete) return
    const timers = PHASE_MS.slice(1).map((ms, i) =>
      window.setTimeout(() => setPhase(i + 1), ms),
    )
    const auto = window.setTimeout(finish, 5200)
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(auto)
    }
  }, [introComplete, finish])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || phase < 2) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    const dots = Array.from({ length: 48 }, (_, i) => ({
      x: (i % 8) * (w / 8) + Math.random() * 20,
      y: Math.floor(i / 8) * (h / 6) + Math.random() * 12,
      z: Math.random(),
    }))

    let t0 = performance.now()
    const draw = (now: number) => {
      const elapsed = (now - t0) / 1000
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = 'rgba(7, 11, 18, 0.35)'
      ctx.fillRect(0, 0, w, h)

      dots.forEach((d, i) => {
        const speed = 0.4 + d.z * 0.8
        const py = ((d.y + elapsed * 80 * speed) % (h + 40)) - 20
        const size = 1.5 + d.z * 2.5
        const alpha = 0.25 + d.z * 0.55
        ctx.beginPath()
        ctx.fillStyle = i % 5 === 0 ? `rgba(245,166,35,${alpha})` : `rgba(91,181,232,${alpha})`
        ctx.arc(d.x, py, size, 0, Math.PI * 2)
        ctx.fill()
      })

      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [phase])

  if (introComplete) return null

  return (
    <AnimatePresence>
      <motion.div
        className="intro-showreel"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="intro-showreel__scan" aria-hidden="true" />
        <canvas ref={canvasRef} className="intro-showreel__terrain" width={640} height={360} aria-hidden="true" />

        <div className="intro-showreel__content">
          <motion.p
            className="intro-showreel__label type-label"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 0 ? 1 : 0 }}
          >
            {t.intro.initializing}
          </motion.p>

          <motion.div
            className="intro-showreel__logo-wrap"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, scale: phase >= 1 ? 1 : 0.92 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Logo variant="command" iconOnly className="intro-showreel__logo" />
          </motion.div>

          <motion.h1
            className="intro-showreel__title type-display"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 24 }}
            transition={{ duration: 0.8 }}
          >
            {t.intro.title}
          </motion.h1>

          <motion.p
            className="intro-showreel__tagline type-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 3 ? 1 : 0 }}
          >
            {t.intro.tagline}
          </motion.p>

          <motion.button
            type="button"
            className="intro-showreel__enter magnetic-btn magnetic-btn--primary"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 12 }}
            onClick={finish}
          >
            {t.intro.enter}
          </motion.button>
        </div>

        <button type="button" className="intro-showreel__skip type-caption" onClick={finish}>
          {t.intro.skip}
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
