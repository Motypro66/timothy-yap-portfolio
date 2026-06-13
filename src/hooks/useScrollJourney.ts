import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCommand } from '../context/CommandContext'

gsap.registerPlugin(ScrollTrigger)

/** Scroll-scrubbed camera journey + pinned hero dive */
export function useScrollJourney() {
  const { setJourneyProgress, setScrollVelocity, bootComplete } = useCommand()

  useEffect(() => {
    if (!bootComplete) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '.command-main',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.9,
        onUpdate: (self) => {
          setJourneyProgress(self.progress)
          setScrollVelocity(Math.abs(self.getVelocity()))
        },
      })

      ScrollTrigger.create({
        trigger: '#hero',
        start: 'top top',
        end: '+=130%',
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      })

      gsap.utils.toArray<HTMLElement>('.journey-station').forEach((station) => {
        gsap.fromTo(
          station.querySelector('.journey-station__inner'),
          { opacity: 0, y: 80, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: station,
              start: 'top 78%',
              end: 'top 38%',
              scrub: 0.85,
            },
          },
        )
      })

      gsap.to('.hero__copy', {
        y: -120,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: '+=130%',
          scrub: 1,
        },
      })
    })

    return () => ctx.revert()
  }, [bootComplete, setJourneyProgress, setScrollVelocity])
}
