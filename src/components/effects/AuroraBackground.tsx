import { useEffect, useRef } from 'react'

/**
 * Full-screen "liquid gradient" backdrop.
 *
 * A handful of large, heavily-blurred colour blobs drift via CSS keyframes —
 * the only animated property is `transform`, so each blob is a cached GPU layer
 * and the whole thing composites at 60fps with no per-frame JS or WebGL.
 *
 * A very subtle pointer parallax is layered on top (rAF, transform only) for a
 * premium "alive" feel without cost.
 */
export default function AuroraBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const target = { x: 0, y: 0 }
    const cur = { x: 0, y: 0 }

    const onMove = (e: MouseEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2
      target.y = (e.clientY / window.innerHeight - 0.5) * 2
    }

    const tick = () => {
      cur.x += (target.x - cur.x) * 0.05
      cur.y += (target.y - cur.y) * 0.05
      el.style.transform = `translate3d(${cur.x * 22}px, ${cur.y * 22}px, 0)`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="aurora" aria-hidden="true">
      <div className="aurora__parallax" ref={ref}>
        <span className="aurora__blob aurora__blob--sun" />
        <span className="aurora__blob aurora__blob--peach" />
        <span className="aurora__blob aurora__blob--sky" />
        <span className="aurora__blob aurora__blob--honey" />
      </div>
      <div className="aurora__grain" />
    </div>
  )
}
