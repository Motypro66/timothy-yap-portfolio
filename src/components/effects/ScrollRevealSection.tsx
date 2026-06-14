import { useEffect, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIntroComplete } from '../../hooks/useIntroComplete'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  children: ReactNode
  className?: string
  id?: string
}

export default function ScrollRevealSection({ children, className = '', id }: Props) {
  const introComplete = useIntroComplete()

  useEffect(() => {
    if (!introComplete) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    let ctx: gsap.Context | undefined
    const frame = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('.reveal-item').forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 38 },
            {
              opacity: 1,
              y: 0,
              duration: 1.0,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none reverse',
              },
            },
          )
        })
        ScrollTrigger.refresh()
      })
    })

    return () => {
      cancelAnimationFrame(frame)
      ctx?.revert()
    }
  }, [introComplete, id])

  return (
    <section className={`section ${className}`} id={id}>
      {children}
    </section>
  )
}
