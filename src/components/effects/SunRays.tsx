import { useEffect, useRef } from 'react'
import { MOBILE_QUERY } from '../../hooks/useMediaQuery'

/** Warm golden sun rays — static glow on mobile, animated on desktop. */
export default function SunRays() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const mobile = window.matchMedia(MOBILE_QUERY).matches
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const animate = !mobile && !prefersReduced

    let animId = 0
    let w = 0
    let h = 0

    const resize = () => {
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      const dpr = Math.min(window.devicePixelRatio || 1, animate ? 2 : 1.5)
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const rays = Array.from({ length: animate ? 12 : 0 }, (_, i) => ({
      angle: (i / 12) * Math.PI * 2,
      length: 0.6 + Math.random() * 0.4,
      speed: 0.0003 + Math.random() * 0.0002,
      offset: Math.random() * Math.PI * 2,
    }))

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h)

      const cx = w * 0.85
      const cy = h * 0.08

      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.55)
      glow.addColorStop(0, 'rgba(255, 209, 102, 0.35)')
      glow.addColorStop(0.4, 'rgba(245, 166, 35, 0.12)')
      glow.addColorStop(1, 'rgba(255, 248, 240, 0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, w, h)

      if (animate) {
        rays.forEach((ray) => {
          const angle = ray.angle + Math.sin(time * ray.speed + ray.offset) * 0.08
          const len = w * ray.length
          const x2 = cx + Math.cos(angle) * len
          const y2 = cy + Math.sin(angle) * len

          const grad = ctx.createLinearGradient(cx, cy, x2, y2)
          grad.addColorStop(0, 'rgba(255, 209, 102, 0.25)')
          grad.addColorStop(1, 'rgba(255, 209, 102, 0)')

          ctx.beginPath()
          ctx.moveTo(cx, cy)
          ctx.lineTo(x2, y2)
          ctx.strokeStyle = grad
          ctx.lineWidth = 2
          ctx.stroke()
        })

        for (let i = 0; i < 8; i++) {
          const t = time * 0.001 + i * 1.3
          const mx = w * (0.1 + (i % 4) * 0.22) + Math.sin(t) * 20
          const my = h * (0.2 + (i % 3) * 0.25) + Math.cos(t * 0.7) * 15
          const alpha = 0.15 + Math.sin(t * 2) * 0.1
          ctx.beginPath()
          ctx.arc(mx, my, 2 + (i % 2), 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 209, 102, ${alpha})`
          ctx.fill()
        }

        animId = requestAnimationFrame(draw)
      }
    }

    draw(0)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="sun-rays" aria-hidden="true" />
}
