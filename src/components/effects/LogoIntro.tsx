import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/**
 * Cinematic studio-ident style intro — "Sunrise + Luxo dot" (refs: Disney light
 * sweep, MGM shockwave, Pixar's bouncy lamp):
 *
 *  1. the orange dot (the sun) bounces playfully in
 *  2. a warm light sweep glides across, drawing the monoline "T"
 *  3. at the apex the sun pulses, rays bloom and a shockwave ring expands
 *  4. the whole mark flies up and docks into the navbar logo as the warm
 *     backdrop wipes away to reveal the hero
 *
 * ~1.8s, no tagline text, reduced-motion aware, pure CSS/SVG + GSAP.
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
      // CSS already centres the mark (left/top 50% + translate -50%); mirror that
      // in GSAP so it stays dead-centre, then we only animate x/y deltas to fly.
      gsap.set(mark, { xPercent: -50, yPercent: -50, transformOrigin: 'center center' })

      const strokes = gsap.utils.toArray<SVGPathElement>('.li-stroke')
      strokes.forEach((p) => {
        const len = p.getTotalLength()
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
      })
      // sun starts above centre, smaller — so it visibly drops & bounces in
      gsap.set('.li-dot', { y: -38, scale: 0.7, svgOrigin: '26 16' })
      gsap.set('.li-rays', { scale: 0, opacity: 0, svgOrigin: '26 16' })
      gsap.set('.li-shock', { scale: 0, opacity: 0, svgOrigin: '26 16' })
      gsap.set('.li-flare', { opacity: 0, attr: { cx: -16 } })
      gsap.set('.li-word', { opacity: 0 })

      const tl = gsap.timeline({ onComplete: finish })

      // 1) Luxo-style: the sun drops from above and bounces into place
      tl.to('.li-dot', { y: 0, scale: 1, duration: 0.85, ease: 'bounce.out' })

      // 2) sunrise light sweep draws the T
      tl.to('.li-flare', { opacity: 1, duration: 0.12 }, 0.6)
        .to('.li-flare', { attr: { cx: 188 }, duration: 0.62, ease: 'power1.inOut' }, 0.6)
        .to(strokes, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out', stagger: 0.07 }, 0.64)
        .to('.li-word', { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.94)
        .to('.li-flare', { opacity: 0, duration: 0.25 }, 1.08)

      // 3) apex: sun pulse + rays bloom + shockwave ring
      tl.to('.li-dot', { scale: 1.2, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.inOut' }, 1.2)
        .to('.li-rays', { scale: 1.3, opacity: 1, duration: 0.28, ease: 'power2.out' }, 1.2)
        .to('.li-rays', { scale: 2, opacity: 0, duration: 0.42, ease: 'power1.out' }, '>-0.08')
        .to('.li-shock', { scale: 6, opacity: 0, duration: 0.6, ease: 'power2.out' }, 1.22)

      // 4) fly into the navbar logo + wipe backdrop
      tl.addLabel('fly', '>-0.1')
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
            gsap.to(mark, { y: '-=120', scale: 0.4, duration: 0.62, ease: 'power3.inOut' })
          }
        }, 'fly')
        .to('.li-bg', { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 'fly')
        .to(mark, { opacity: 0, duration: 0.2 }, 'fly+=0.55')
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
          <defs>
            <radialGradient id="liFlare" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#fff6e0" stopOpacity="0.95" />
              <stop offset="1" stopColor="#fff6e0" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* expanding sunrise shockwave ring (the dark halo) */}
          <circle className="li-shock" cx="26" cy="16" r="6" fill="none" stroke="rgba(61,46,42,0.5)" strokeWidth="1.4" />

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

          {/* warm light sweep that travels across as the T draws */}
          <ellipse className="li-flare" cx="-16" cy="18" rx="20" ry="24" fill="url(#liFlare)" />
        </svg>
      </div>
    </div>
  )
}
