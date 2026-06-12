import { useEffect, useRef } from 'react'

/** Warm golden sun rays — NEW hero effect (keeps particles + 3D orbs) */
export default function SunRays() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId = 0
    let w = 0
    let h = 0

    const resize = () => {
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w * devicePixelRatio
      canvas.height = h * devicePixelRatio
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const rays = Array.from({ length: 12 }, (_, i) => ({
      angle: (i / 12) * Math.PI * 2,
      length: 0.6 + Math.random() * 0.4,
      speed: 0.0003 + Math.random() * 0.0002,
      offset: Math.random() * Math.PI * 2,
    }))

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h)

      const cx = w * 0.85
      const cy = h * 0.08

      // Soft radial glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.55)
      glow.addColorStop(0, 'rgba(255, 209, 102, 0.35)')
      glow.addColorStop(0.4, 'rgba(245, 166, 35, 0.12)')
      glow.addColorStop(1, 'rgba(255, 248, 240, 0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, w, h)

      if (!prefersReduced) {
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
      }

      // Floating light motes
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

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="sun-rays" aria-hidden="true" />
}
