import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/**
 * Flashy on-load intro:
 *  1. warm particles streak in from all over the screen and ASSEMBLE into the
 *     Timothy logo
 *  2. a rotating sun-corona of god-rays blasts out behind it with a white flash
 *     and an expanding shockwave ring
 *  3. the crisp logo resolves and flies up to dock into the navbar as the warm
 *     backdrop wipes away
 *
 * Pure canvas + CSS + GSAP. Centred on the viewport (works on mobile too).
 * Reduced-motion aware, with a safety timeout so it can never block the page.
 */

const COLORS = ['#f5a623', '#ff8c69', '#ffd166', '#ffe2a6']

type P = {
  sx: number
  sy: number
  tx: number
  ty: number
  r: number
  color: string
  delay: number
}

export default function LogoIntro() {
  const [done, setDone] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const mark = markRef.current
    const canvas = canvasRef.current
    if (!root || !mark || !canvas) {
      setDone(true)
      return
    }

    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      setDone(true)
    }

    // Never let the overlay get stuck.
    const safety = window.setTimeout(finish, 3600)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = canvas.getContext('2d')
    if (reduce || !ctx) {
      const t = window.setTimeout(finish, 350)
      return () => {
        window.clearTimeout(t)
        window.clearTimeout(safety)
      }
    }

    const W = window.innerWidth
    const H = window.innerHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)

    const cx = W / 2
    const cy = H / 2

    const prog = { a: 0 } // assemble progress 0..1
    let raf = 0
    const particles: P[] = []

    const render = () => {
      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'lighter'
      const a = prog.a
      for (const p of particles) {
        const local = Math.min(1, Math.max(0, (a - p.delay) / (1 - 0.4)))
        const e = 1 - Math.pow(1 - local, 3) // easeOutCubic
        const x = p.sx + (p.tx - p.sx) * e
        const y = p.sy + (p.ty - p.sy) * e
        ctx.globalAlpha = Math.min(1, a * 1.4)
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(x, y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(render)
    }

    const start = () => {
      raf = requestAnimationFrame(render)

      const tl = gsap.timeline({ onComplete: finish })

      // 1) assemble
      tl.to(prog, { a: 1, duration: 1.0, ease: 'power2.out' }, 0)

      // 2) sun corona blast + flash + shockwave ring
      tl.fromTo(
        '.li-corona',
        { scale: 0.25, opacity: 0, rotate: 0 },
        { scale: 1, opacity: 0.95, rotate: 95, duration: 0.9, ease: 'power2.out' },
        0.85,
      )
        .to('.li-corona', { opacity: 0, rotate: 140, duration: 0.7, ease: 'power1.in' }, 1.55)
        .fromTo('.li-flash', { scale: 0.3, opacity: 0 }, { scale: 1.5, opacity: 0.95, duration: 0.22, ease: 'power2.out' }, 0.98)
        .to('.li-flash', { opacity: 0, duration: 0.4, ease: 'power1.out' }, 1.18)
        .fromTo('.li-ring', { scale: 0, opacity: 0.7 }, { scale: 1, opacity: 0, duration: 0.7, ease: 'power2.out' }, 1.0)

      // 3) resolve to the crisp logo, then fly into the navbar
      tl.to('.li-canvas', { opacity: 0, duration: 0.4, ease: 'power1.inOut' }, 1.5)
        .to(mark, { opacity: 1, duration: 0.35, ease: 'power2.out' }, 1.5)
        .addLabel('fly', '>-0.02')
        .add(() => {
          const navLogo = document.querySelector('.navbar__logo-link')
          const mr = mark.getBoundingClientRect()
          const mcx = mr.left + mr.width / 2
          const mcy = mr.top + mr.height / 2
          if (navLogo) {
            const nr = navLogo.getBoundingClientRect()
            gsap.to(mark, {
              x: nr.left + nr.width / 2 - mcx,
              y: nr.top + nr.height / 2 - mcy,
              scale: nr.width / mr.width,
              duration: 0.62,
              ease: 'power3.inOut',
            })
          } else {
            gsap.to(mark, { y: '-=160', scale: 0.4, duration: 0.62, ease: 'power3.inOut' })
          }
        }, 'fly')
        .to('.li-bg', { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 'fly')
        .to(mark, { opacity: 0, duration: 0.2 }, 'fly+=0.6')
    }

    // Centre the crisp mark and size the particle target to match it.
    gsap.set(mark, { xPercent: -50, yPercent: -50, transformOrigin: 'center center', opacity: 0 })
    const drawW = mark.offsetWidth || 320
    const drawH = mark.offsetHeight || Math.round((drawW * 40) / 168)

    // Rasterise the logo to sample its shape into particle targets.
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 168 40'>
      <path d='M6 8h16M14 8v22M14 26c6 0 11-3 12-8' fill='none' stroke='#fff' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/>
      <circle cx='26' cy='16' r='3.6' fill='#fff'/>
      <text x='34' y='27' fill='#fff' font-family='Georgia, serif' font-size='20' font-weight='700'>imothy</text>
    </svg>`
    const oc = document.createElement('canvas')
    const ocW = Math.max(160, Math.round(drawW))
    const ocH = Math.max(40, Math.round(drawH))
    oc.width = ocW
    oc.height = ocH
    const octx = oc.getContext('2d')

    const buildAndStart = () => {
      if (octx) {
        const data = octx.getImageData(0, 0, ocW, ocH).data
        const stride = W < 768 ? 4 : 3
        const left = cx - drawW / 2
        const top = cy - drawH / 2
        for (let y = 0; y < ocH; y += stride) {
          for (let x = 0; x < ocW; x += stride) {
            if (data[(y * ocW + x) * 4 + 3] > 130) {
              const tx = left + (x / ocW) * drawW
              const ty = top + (y / ocH) * drawH
              const ang = Math.random() * Math.PI * 2
              const dist = Math.max(W, H) * (0.5 + Math.random() * 0.6)
              particles.push({
                tx,
                ty,
                sx: cx + Math.cos(ang) * dist,
                sy: cy + Math.sin(ang) * dist,
                r: 1.1 + Math.random() * 1.6,
                color: COLORS[(Math.random() * COLORS.length) | 0],
                delay: Math.random() * 0.4,
              })
            }
          }
        }
      }
      if (particles.length < 30) {
        // sampling failed somehow — skip straight to the fly/reveal
        gsap.set(mark, { opacity: 1 })
        gsap.set('.li-canvas', { opacity: 0 })
      }
      start()
    }

    const img = new Image()
    img.onload = () => {
      octx?.drawImage(img, 0, 0, ocW, ocH)
      buildAndStart()
    }
    img.onerror = buildAndStart
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)

    return () => {
      window.clearTimeout(safety)
      cancelAnimationFrame(raf)
      gsap.killTweensOf([prog, mark, '.li-corona', '.li-flash', '.li-ring', '.li-canvas', '.li-bg'])
    }
  }, [])

  if (done) return null

  return (
    <div className="logo-intro" ref={rootRef} role="presentation" aria-hidden="true">
      <div className="logo-intro__bg li-bg" />
      <div className="li-corona" />
      <canvas className="li-canvas" ref={canvasRef} />
      <div className="li-ring" />
      <div className="logo-intro__mark" ref={markRef}>
        <svg className="logo-intro__svg" viewBox="0 0 168 40" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6 8h16M14 8v22M14 26c6 0 11-3 12-8"
            fill="none"
            stroke="#3d2e2a"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="26" cy="16" r="3.2" fill="#f5a623" />
          <text
            x="34"
            y="27"
            fill="#3d2e2a"
            fontFamily="'Fraunces', Georgia, serif"
            fontSize="20"
            fontWeight="700"
            letterSpacing="-0.02em"
          >
            imothy
          </text>
        </svg>
      </div>
      <div className="li-flash" />
    </div>
  )
}
