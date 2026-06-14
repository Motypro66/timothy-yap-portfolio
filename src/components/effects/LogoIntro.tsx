import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { LOGO_INTRO_COMPLETE } from '../../hooks/useIntroComplete'
import LogoContent from '../ui/LogoContent'
import { LOGO_VIEWBOX } from '../ui/logoTokens'

const VIEWBOX_CX = 84
const VIEWBOX_CY = 20
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

      const introSvg = mark.querySelector('.logo-intro__svg') as SVGSVGElement | null
      const introGroup = mark.querySelector('.logo-content') as SVGGraphicsElement | null

      ctx = gsap.context(() => {
        gsap.set(mark, { force3D: true })

        centerSvgContent(introGroup)

        const strokes = gsap.utils.toArray<SVGPathElement>('.li-stroke')
        strokes.forEach((p) => {
          const len = p.getTotalLength()
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
        })
        gsap.set('.li-dot', { scale: 0, svgOrigin: '26 16' })
        gsap.set('.li-word', { opacity: 0, y: 6 })

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
          <svg className="logo-intro__svg" viewBox={LOGO_VIEWBOX} xmlns="http://www.w3.org/2000/svg">
            <LogoContent
              groupClassName="logo-content li-content"
              strokeClassName="li-stroke"
              dotClassName="li-dot"
              wordClassName="li-word"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
