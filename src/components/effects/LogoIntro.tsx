import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { LOGO_INTRO_COMPLETE } from '../../hooks/useIntroComplete'

const VIEWBOX_CX = 84
const VIEWBOX_CY = 20
/** Measured fallback when getBBox is unavailable before first paint (common on mobile). */
const CONTENT_OFFSET_FALLBACK = { x: 26.5, y: 0.5 }

function centerSvgContent(content: SVGGraphicsElement | null) {
  if (!content) return
  try {
    const bb = content.getBBox()
    if (bb.width <= 0 || bb.height <= 0) throw new Error('empty bbox')
    gsap.set(content, {
      x: VIEWBOX_CX - (bb.x + bb.width / 2),
      y: VIEWBOX_CY - (bb.y + bb.height / 2),
    })
  } catch {
    gsap.set(content, CONTENT_OFFSET_FALLBACK)
  }
}

async function waitForLayout() {
  if (document.fonts?.ready) {
    try {
      await document.fonts.ready
    } catch {
      /* ignore */
    }
  }
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })
}

/**
 * Brand intro: draw the mark, hold centred, glide into the navbar.
 * Flexbox-centred (reliable on mobile); SVG content centred after fonts load.
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
      window.dispatchEvent(new CustomEvent(LOGO_INTRO_COMPLETE))
      return
    }

    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      setDone(true)
      window.dispatchEvent(new CustomEvent(LOGO_INTRO_COMPLETE))
    }
    const safety = window.setTimeout(finish, 3200)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const t = window.setTimeout(finish, 300)
      return () => {
        window.clearTimeout(t)
        window.clearTimeout(safety)
      }
    }

    let ctx: gsap.Context | undefined

    void waitForLayout().then(() => {
      if (finished) return

      const content = mark.querySelector('.li-content') as SVGGraphicsElement | null

      ctx = gsap.context(() => {
        gsap.set(mark, { transformOrigin: '50% 50%', force3D: true })

        centerSvgContent(content)

        const strokes = gsap.utils.toArray<SVGPathElement>('.li-stroke')
        strokes.forEach((p) => {
          const len = p.getTotalLength()
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
        })
        gsap.set('.li-dot', { scale: 0, svgOrigin: '26 16' })
        gsap.set('.li-word', { opacity: 0, y: 6 })

        const measureFly = () => {
          const navLogo = document.querySelector('.navbar__logo-link')
          const mr = mark.getBoundingClientRect()
          const mcx = mr.left + mr.width / 2
          const mcy = mr.top + mr.height / 2

          if (!navLogo) {
            return { x: 0, y: -150, scale: 0.4 }
          }

          const nr = navLogo.getBoundingClientRect()
          return {
            x: nr.left + nr.width / 2 - mcx,
            y: nr.top + nr.height / 2 - mcy,
            scale: nr.width / mr.width,
          }
        }

        const tl = gsap.timeline({ onComplete: finish })

        tl.to(strokes, {
          strokeDashoffset: 0,
          duration: 0.58,
          ease: 'power2.inOut',
          stagger: 0.1,
        })
          .to('.li-dot', { scale: 1, duration: 0.42, ease: 'back.out(2)' }, '-=0.2')
          .to('.li-word', { opacity: 1, y: 0, duration: 0.48, ease: 'power2.out' }, '-=0.26')
          .to({}, { duration: 0.5 })
          .addLabel('fly')
          .to(
            mark,
            {
              x: () => measureFly().x,
              y: () => measureFly().y,
              scale: () => measureFly().scale,
              duration: 0.72,
              ease: 'power3.inOut',
            },
            'fly',
          )
          .to('.li-bg', { opacity: 0, duration: 0.62, ease: 'power2.inOut' }, 'fly')
          .to(mark, { opacity: 0, duration: 0.22 }, 'fly+=0.58')
      }, root)
    })

    return () => {
      window.clearTimeout(safety)
      ctx?.revert()
    }
  }, [])

  if (done) return null

  return (
    <div className="logo-intro" ref={rootRef} role="presentation" aria-hidden="true">
      <div className="logo-intro__bg li-bg" />
      <div className="logo-intro__center">
        <div className="logo-intro__mark" ref={markRef}>
          <svg className="logo-intro__svg" viewBox="0 0 168 40" xmlns="http://www.w3.org/2000/svg">
            <g className="li-content">
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
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
}
