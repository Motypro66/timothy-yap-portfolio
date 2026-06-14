import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/**
 * Smooth, restrained brand intro:
 *  - the monoline "T" draws on, the sun dot settles, the wordmark fades up
 *  - holds dead-centre for a beat
 *  - then the mark glides up and docks into the navbar as the warm backdrop
 *    wipes away
 *
 * Centred purely with CSS transforms (reliable on mobile). Reduced-motion aware,
 * with a safety timeout so it can never block the page.
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

    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      setDone(true)
    }
    const safety = window.setTimeout(finish, 3000)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const t = window.setTimeout(finish, 300)
      return () => {
        window.clearTimeout(t)
        window.clearTimeout(safety)
      }
    }

    const ctx = gsap.context(() => {
      gsap.set(mark, { xPercent: -50, yPercent: -50, transformOrigin: 'center center' })

      const strokes = gsap.utils.toArray<SVGPathElement>('.li-stroke')
      strokes.forEach((p) => {
        const len = p.getTotalLength()
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
      })
      gsap.set('.li-dot', { scale: 0, svgOrigin: '26 16' })
      gsap.set('.li-word', { opacity: 0, y: 6 })

      const tl = gsap.timeline({ onComplete: finish })

      tl.to(strokes, { strokeDashoffset: 0, duration: 0.62, ease: 'power2.inOut', stagger: 0.12 })
        .to('.li-dot', { scale: 1, duration: 0.45, ease: 'back.out(2.2)' }, '-=0.22')
        .to('.li-word', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.28')
        .to({}, { duration: 0.45 }) // hold dead-centre so it reads as centred
        .addLabel('fly')
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
              duration: 0.7,
              ease: 'power3.inOut',
            })
          } else {
            gsap.to(mark, { y: '-=150', scale: 0.4, duration: 0.7, ease: 'power3.inOut' })
          }
        }, 'fly')
        .to('.li-bg', { opacity: 0, duration: 0.65, ease: 'power2.inOut' }, 'fly')
        .to(mark, { opacity: 0, duration: 0.25 }, 'fly+=0.6')
    }, root)

    return () => {
      window.clearTimeout(safety)
      ctx.revert()
    }
  }, [])

  if (done) return null

  return (
    <div className="logo-intro" ref={rootRef} role="presentation" aria-hidden="true">
      <div className="logo-intro__bg li-bg" />
      <div className="logo-intro__mark" ref={markRef}>
        <svg className="logo-intro__svg" viewBox="0 0 168 40" xmlns="http://www.w3.org/2000/svg">
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
            className="li-word"
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
