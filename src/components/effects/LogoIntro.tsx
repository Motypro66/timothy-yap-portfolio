import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import gsap from 'gsap'
import { LOGO_INTRO_COMPLETE } from '../../hooks/useIntroComplete'
import LogoContent from '../ui/LogoContent'
import { LOGO_VIEWBOX } from '../ui/logoTokens'

const DOT_FALL_Y = -11

const HOLD_BEFORE_FLY = 0.06
const FLY_DURATION = 0.44
const LAYOUT_SAFETY_MS = 3200
const TIMELINE_SAFETY_MS = 2400
const VIEWBOX_CX = 84
const VIEWBOX_CY = 20
const CONTENT_OFFSET_FALLBACK = { x: 24.5, y: 0.5 }
const MOTE_COUNT = 4
const MOBILE_QUERY = '(max-width: 960px)'

function applyStrokeDash(strokes: SVGPathElement[]) {
  strokes.forEach((p) => {
    p.style.willChange = 'stroke-dashoffset, opacity'
    gsap.set(p, { strokeDasharray: 1, strokeDashoffset: 1 })
  })
}

function clearStrokeWillChange(strokes: SVGPathElement[]) {
  strokes.forEach((p) => {
    p.style.willChange = ''
  })
}

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

function clearIntroActive() {
  document.documentElement.classList.remove('intro-active')
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

  useLayoutEffect(() => {
    document.documentElement.classList.add('intro-active')
    return () => clearIntroActive()
  }, [])

  useLayoutEffect(() => {
    const root = rootRef.current
    const mark = markRef.current
    if (!root || !mark) return

    let finished = false
    let safetyLayout = 0
    let safetyTimeline = 0

    const finish = () => {
      if (finished) return
      finished = true
      window.clearTimeout(safetyLayout)
      window.clearTimeout(safetyTimeline)
      requestAnimationFrame(() => setDone(true))
    }

    safetyLayout = window.setTimeout(finish, LAYOUT_SAFETY_MS)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const t = window.setTimeout(finish, 300)
      return () => {
        window.clearTimeout(t)
        window.clearTimeout(safetyLayout)
      }
    }

    let ctx: gsap.Context | undefined
    const mobile = window.matchMedia(MOBILE_QUERY).matches

    void waitForLayout().then(() => {
      if (finished) return

      const introSvg = mark.querySelector('.logo-intro__svg') as SVGSVGElement | null
      const introGroup = mark.querySelector('.logo-content') as SVGGraphicsElement | null

      ctx = gsap.context(() => {
        gsap.set(mark, { force3D: true, autoAlpha: 0 })
        gsap.set('.logo-intro__ambience', { opacity: 0 })
        gsap.set('.logo-intro__orb', { opacity: 0 })
        gsap.set('.li-mote', { opacity: 0, y: 6 })
        gsap.set('.li-sweep', { x: '-130%' })
        gsap.set('.li-sun-pulse', { scale: 0, opacity: 0, svgOrigin: '26 16' })
        gsap.set('.li-sun-glow', { scale: 0.75, opacity: 0, svgOrigin: '26 16' })
        gsap.set('.li-spark-burst', { scale: 0.3, svgOrigin: '26 16' })
        gsap.set('.li-spark', { opacity: 0 })

        centerSvgContent(introGroup)

        const strokes = gsap.utils.toArray<SVGPathElement>('.li-stroke')
        applyStrokeDash(strokes)

        gsap.set('.li-dot', {
          y: DOT_FALL_Y,
          autoAlpha: 0,
          scale: 0.45,
          svgOrigin: '26 16',
        })
        gsap.set('.li-word', { autoAlpha: 0, y: 4 })

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

        measureFly()

        window.clearTimeout(safetyLayout)
        safetyTimeline = window.setTimeout(finish, TIMELINE_SAFETY_MS)

        const tl = gsap.timeline({ onComplete: finish })

        tl.set(mark, { autoAlpha: 1, force3D: true }, 0)
          .set(introSvg, { visibility: 'visible' }, 0)
          .set(strokes, { opacity: 1, visibility: 'visible' }, 0)
          .add(() => root.classList.add('logo-intro--drawing'), 0)
          .to(
            strokes,
            {
              strokeDashoffset: 0,
              duration: 0.34,
              ease: 'power1.inOut',
              stagger: 0.06,
            },
            0.02,
          )
          .add(() => {
            clearStrokeWillChange(strokes)
            strokes.forEach((p) => p.setAttribute('stroke-linecap', 'round'))
            root.classList.remove('logo-intro--drawing')
          })
          .to(
            '.li-dot',
            {
              y: 0,
              scale: 1,
              autoAlpha: 1,
              duration: 0.26,
              ease: 'power2.in',
            },
            '-=0.06',
          )
          .addLabel('land')
          .to('.li-dot', { scaleX: 1.4, scaleY: 0.65, duration: 0.09, ease: 'power2.out' }, 'land')
          .to('.li-dot', { scaleX: 1, scaleY: 1, duration: 0.22, ease: 'elastic.out(1, 0.5)' })
          .to(
            '.li-sun-pulse',
            { scale: 1.55, opacity: 0.34, duration: 0.16, ease: 'power2.out' },
            'land-=0.02',
          )
          .to('.li-sun-pulse', { scale: 2.1, opacity: 0, duration: 0.14, ease: 'power2.in' })
          .to(
            '.li-sun-glow',
            { scale: 1.08, opacity: 0.42, duration: 0.18, ease: 'power2.out' },
            'land',
          )
          .to('.li-spark-burst', { scale: 1, duration: 0.1, ease: 'power2.out' }, 'land')
          .to(
            '.li-spark',
            { opacity: 0.9, duration: 0.1, ease: 'power2.out', stagger: 0.012 },
            'land',
          )
          .to('.li-spark-burst', { scale: 1.7, duration: 0.24, ease: 'power2.in' }, 'land+=0.06')
          .to(
            '.li-spark',
            { opacity: 0, duration: 0.24, ease: 'power2.in', stagger: 0.012 },
            'land+=0.06',
          )
          .to('.li-word', { autoAlpha: 1, y: 0, duration: 0.22, ease: 'power2.out' }, '-=0.14')

        if (mobile) {
          tl.to('.logo-intro__ambience', { opacity: 0.55, duration: 0.18, ease: 'power2.out' }, '-=0.18')
        } else {
          tl.to('.logo-intro__ambience', { opacity: 1, duration: 0.18, ease: 'power2.out' }, '-=0.18')
            .add(() => root.classList.add('logo-intro--orbs-live'))
            .to(
              '.logo-intro__orb',
              { opacity: 0.85, duration: 0.22, stagger: 0.04, ease: 'power2.out' },
              '-=0.14',
            )
            .to('.li-sweep', { x: '130%', duration: 0.34, ease: 'power2.inOut' }, '-=0.18')
            .to(
              '.li-mote',
              { opacity: 0.45, y: -12, duration: 0.4, stagger: 0.03, ease: 'power2.out' },
              '-=0.28',
            )
        }

        tl.to({}, { duration: HOLD_BEFORE_FLY })
          .addLabel('fly')
          .add(() => {
            root.classList.add('logo-intro--handoff')
            clearIntroActive()
            window.dispatchEvent(new CustomEvent(LOGO_INTRO_COMPLETE))
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
              duration: FLY_DURATION,
              ease: 'power3.inOut',
            },
            'fly',
          )
          .to('.logo-intro__ambience', { opacity: 0, duration: 0.28, ease: 'power2.in' }, 'fly')
          .to('.li-bg', { opacity: 0, duration: 0.32, ease: 'power2.inOut' }, 'fly')
          .to(mark, { autoAlpha: 0, duration: 0.1 }, `fly+=${FLY_DURATION - 0.08}`)
      }, root)
    })

    return () => {
      window.clearTimeout(safetyLayout)
      window.clearTimeout(safetyTimeline)
      root.classList.remove('logo-intro--drawing', 'logo-intro--orbs-live', 'logo-intro--handoff')
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
                showSun={false}
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
