import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/**
 * On-load brand intro:
 *  A) the monoline "T" draws on, the orange dot pops and bursts a little sun flare
 *  B) the whole mark then flies up and docks into the navbar logo as the warm
 *     backdrop wipes away to reveal the hero.
 * Fast (~1.4s), no tagline text. Respects reduced-motion.
 */
export default function LogoIntro() {
  const [done, setDone] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const mark = markRef.current
    if (!root || !mark) {
      setDone(true)
      return
    }

    const finish = () => setDone(true)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduce) {
      const t = window.setTimeout(finish, 350)
      return () => window.clearTimeout(t)
    }

    const ctx = gsap.context(() => {
      const centre = () => {
        const w = mark.offsetWidth
        const h = mark.offsetHeight
        gsap.set(mark, {
          x: (window.innerWidth - w) / 2,
          y: (window.innerHeight - h) / 2,
          scale: 1,
          transformOrigin: 'top left',
        })
      }
      centre()

      const strokes = gsap.utils.toArray<SVGPathElement>('.li-stroke')
      strokes.forEach((p) => {
        const len = p.getTotalLength()
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
      })
      gsap.set('.li-dot', { scale: 0, svgOrigin: '26 16' })
      gsap.set('.li-rays', { scale: 0, opacity: 0, svgOrigin: '26 16' })

      const tl = gsap.timeline({ onComplete: finish })
      tl.to(strokes, {
        strokeDashoffset: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.07,
      })
        .to('.li-dot', { scale: 1, duration: 0.3, ease: 'back.out(3)' }, '-=0.18')
        .to('.li-rays', { scale: 1.25, opacity: 1, duration: 0.28, ease: 'power2.out' }, '<')
        .to('.li-rays', { scale: 1.9, opacity: 0, duration: 0.4, ease: 'power1.out' }, '>-0.08')
        .addLabel('fly', '>-0.1')
        .add(() => {
          const navLogo = document.querySelector('.navbar__logo-link')
          const mr = mark.getBoundingClientRect()
          if (navLogo) {
            const nr = navLogo.getBoundingClientRect()
            gsap.to(mark, {
              x: nr.left,
              y: nr.top,
              scale: nr.width / mr.width,
              duration: 0.6,
              ease: 'power3.inOut',
            })
          } else {
            gsap.to(mark, { y: '-=48', scale: 0.4, duration: 0.6, ease: 'power3.inOut' })
          }
        }, 'fly')
        .to('.li-bg', { opacity: 0, duration: 0.55, ease: 'power2.inOut' }, 'fly')
        .to(mark, { opacity: 0, duration: 0.2 }, 'fly+=0.5')
    }, root)

    return () => ctx.revert()
  }, [])

  if (done) return null

  const rays = Array.from({ length: 12 }).map((_, i) => {
    const a = (i / 12) * Math.PI * 2
    return (
      <line
        key={i}
        x1={26 + Math.cos(a) * 7}
        y1={16 + Math.sin(a) * 7}
        x2={26 + Math.cos(a) * 15}
        y2={16 + Math.sin(a) * 15}
      />
    )
  })

  return (
    <div className="logo-intro" ref={rootRef} role="presentation" aria-hidden="true">
      <div className="logo-intro__bg li-bg" />
      <div className="logo-intro__mark" ref={markRef}>
        <svg className="logo-intro__svg" viewBox="0 0 168 40" xmlns="http://www.w3.org/2000/svg">
          <g className="li-rays" stroke="#f5a623" strokeWidth="2" strokeLinecap="round">
            {rays}
          </g>
          <path className="li-stroke" d="M6 8h16" stroke="#3d2e2a" strokeWidth="2.8" strokeLinecap="round" />
          <path className="li-stroke" d="M14 8v22" stroke="#3d2e2a" strokeWidth="2.8" strokeLinecap="round" />
          <path
            className="li-stroke"
            d="M14 26c6 0 11-3 12-8"
            stroke="#3d2e2a"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle className="li-dot" cx="26" cy="16" r="3.2" fill="#f5a623" />
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
    </div>
  )
}
