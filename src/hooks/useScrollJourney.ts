import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Scroll-linked camera drift for the command shell */
export function useScrollJourney() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.to('.command-main', {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      })

      gsap.utils.toArray<HTMLElement>('.command-section, .hero--command').forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0.88, y: 24 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 82%',
              end: 'top 55%',
              scrub: 0.4,
            },
          },
        )
      })
    })

    return () => ctx.revert()
  }, [])
}
