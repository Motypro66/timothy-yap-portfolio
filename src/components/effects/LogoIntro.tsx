import { useEffect, useRef, useState, type CSSProperties } from 'react'
import gsap from 'gsap'
import { LOGO_INTRO_COMPLETE } from '../../hooks/useIntroComplete'
import LogoContent from '../ui/LogoContent'
import { LOGO_VIEWBOX } from '../ui/logoTokens'

const INTRO_MS = 1600
const VIEWBOX_CX = 84
const VIEWBOX_CY = 20
const CONTENT_OFFSET_FALLBACK = { x: 24.5, y: 0.5 }
const MOTE_COUNT = 4
const MOBILE_QUERY = '(max-width: 960px)'

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

function getGroupScreenCenter(svg: SVGSVGElement, group: SVGGraphicsElement) {
  const bb = group.getBBox()
  const pt = svg.createSVGPoint()
  pt.x = bb.x + bb.width / 2
  pt.y = bb.y + bb.height / 2
  const ctm = group.getScreenCTM()
  if (!ctm) return null
  return pt.matrixTransform(ctm)
}

function setTransformOriginToContent(
  mark: HTMLElement,
  svg: SVGSVGElement,
  group: SVGGraphicsElement,
) {
  const markRect = mark.getBoundingClientRect()
  const center = getGroupScreenCenter(svg, group)
  if (!center || markRect.width <= 0 || markRect.height <= 0) return

  const originX = ((center.x - markRect.left) / markRect.width) * 100
  const originY = ((center.y - markRect.top) / markRect.height) * 100
  gsap.set(mark, { transformOrigin: `${originX}% ${originY}%` })
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

export default function LogoIntro() {
  const [done, setDone] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLDivElement>(null)
  const isMobile =
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_QUERY).matches : false

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
    const safety = window.setTimeout(finish, INTRO_MS)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const t = window.setTimeout(finish, 300)
      return () => {
        window.clearTimeout(t)
        window.clearTimeout(safety)
      }
    }

    let ctx: gsap.Context | undefined
    const mobile = window.matchMedia(MOBILE_QUERY).matches

    void waitForLayout().then(() => {
      if (finished) return

      const introSvg = mark.querySelector('.logo-intro__svg') as SVGSVGElement | null
      const introGroup = mark.querySelector('.logo-content') as SVGGraphicsElement | null

      ctx = gsap.context(() => {
        gsap.set(mark, { force3D: true })

        if (mobile) {
          gsap.set('.logo-intro__ambience', { opacity: 0.55 })
        } else {
          gsap.set('.logo-intro__ambience', { opacity: 0 })
          gsap.set('.logo-intro__orb', { opacity: 0 })
        }

        gsap.set('.li-mote', { opacity: 0, y: 6 })
        gsap.set('.li-sweep', { x: '-130%' })
        gsap.set('.li-sun-pulse', { scale: 0, opacity: 0, svgOrigin: '26 16' })
        gsap.set('.li-sun-glow', { scale: 0.75, opacity: 0, svgOrigin: '26 16' })

        centerSvgContent(introGroup)

        const strokes = gsap.utils.toArray<SVGPathElement>('.li-stroke')
        strokes.forEach((p) => {
          const len = p.getTotalLength()
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
        })

        gsap.set('.li-dot', {
          attr: { cy: 5 },
          opacity: 0,
          scale: 0.45,
          svgOrigin: '26 16',
        })
        gsap.set('.li-word', { opacity: 0, y: 4 })

        let flyTarget = { x: 0, y: -150, scale: 0.4 }

        const measureFly = () => {
          const navSvg = document.querySelector('.navbar__logo-link .logo-mark') as SVGSVGElement | null
          const navGroup = navSvg?.querySelector('.logo-content') as SVGGraphicsElement | null

          if (!introSvg || !introGroup || !navSvg || !navGroup) {
            return flyTarget
          }

          const from = getGroupScreenCenter(introSvg, introGroup)
          const to = getGroupScreenCenter(navSvg, navGroup)
          if (!from || !to) {
            return flyTarget
          }

          const navRect = navSvg.getBoundingClientRect()
          const introRect = introSvg.getBoundingClientRect()
          const scale =
            navRect.height > 0 && introRect.height > 0 ? navRect.height / introRect.height : 0.4

          flyTarget = {
            x: to.x - from.x,
            y: to.y - from.y,
            scale,
          }
          return flyTarget
        }

        const tl = gsap.timeline({ onComplete: finish })

        if (!mobile) {
          tl.to('.logo-intro__ambience', { opacity: 1, duration: 0.18, ease: 'power2.out' })
            .to('.logo-intro__orb', { opacity: 0.85, duration: 0.22, stagger: 0.04, ease: 'power2.out' }, 0)
        }

        tl.to(strokes, {
          strokeDashoffset: 0,
          duration: 0.3,
          ease: 'power2.inOut',
          stagger: 0.04,
        }, 0.02)
          .to(
            '.li-dot',
            {
              attr: { cy: 16 },
              opacity: 1,
              duration: 0.26,
              ease: 'power2.in',
            },
            '-=0.06',
          )
          .to('.li-dot', { scale: 1, duration: 0.16, ease: 'back.out(2.4)' }, '-=0.08')
          .to(
            '.li-sun-pulse',
            { scale: 1.55, opacity: 0.34, duration: 0.16, ease: 'power2.out' },
            '-=0.1',
          )
          .to('.li-sun-pulse', { scale: 2.1, opacity: 0, duration: 0.14, ease: 'power2.in' })
          .to(
            '.li-sun-glow',
            { scale: 1.08, opacity: 0.42, duration: 0.18, ease: 'power2.out' },
            '-=0.16',
          )
          .to('.li-word', { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' }, '-=0.14')

        if (!mobile) {
          tl.to('.li-sweep', { x: '130%', duration: 0.34, ease: 'power2.inOut' }, '-=0.18')
            .to(
              '.li-mote',
              { opacity: 0.45, y: -12, duration: 0.4, stagger: 0.03, ease: 'power2.out' },
              '-=0.28',
            )
        }

        tl.addLabel('fly', '+=0.06')
          .add(() => {
            if (introSvg && introGroup) {
              setTransformOriginToContent(mark, introSvg, introGroup)
            }
            measureFly()
          }, 'fly')
          .to(
            mark,
            {
              x: () => flyTarget.x,
              y: () => flyTarget.y,
              scale: () => flyTarget.scale,
              duration: 0.42,
              ease: 'power3.inOut',
            },
            'fly',
          )
          .to('.logo-intro__ambience', { opacity: 0, duration: 0.28, ease: 'power2.in' }, 'fly')
          .to('.li-bg', { opacity: 0, duration: 0.32, ease: 'power2.inOut' }, 'fly')
          .to(mark, { opacity: 0, duration: 0.12 }, 'fly+=0.34')
      }, root)
    })

    return () => {
      window.clearTimeout(safety)
      ctx?.revert()
    }
  }, [])

  if (done) return null

  return (
    <div
      className={`logo-intro${isMobile ? ' logo-intro--lite' : ''}`}
      ref={rootRef}
      role="presentation"
      aria-hidden="true"
    >
      <div className="logo-intro__bg li-bg" />
      <div className="logo-intro__ambience" aria-hidden="true">
        <span className="logo-intro__orb logo-intro__orb--sun" />
        <span className="logo-intro__orb logo-intro__orb--peach" />
        <span className="logo-intro__orb logo-intro__orb--sky" />
      </div>
      <div className="logo-intro__center">
        <div className="logo-intro__mark" ref={markRef}>
          <div className="logo-intro__mark-inner">
            {!isMobile && <div className="logo-intro__sweep li-sweep" aria-hidden="true" />}
            {!isMobile && (
              <div className="logo-intro__motes" aria-hidden="true">
                {Array.from({ length: MOTE_COUNT }, (_, i) => (
                  <span key={i} className="li-mote" style={{ '--i': i } as CSSProperties} />
                ))}
              </div>
            )}
            <svg className="logo-intro__svg" viewBox={LOGO_VIEWBOX} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="logoSunGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffd166" stopOpacity="0.65" />
                  <stop offset="55%" stopColor="#f5a623" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#f5a623" stopOpacity="0" />
                </radialGradient>
              </defs>
              <LogoContent
                introEffects
                groupClassName="logo-content li-content"
                strokeClassName="li-stroke"
                dotClassName="li-dot"
                wordClassName="li-word"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
