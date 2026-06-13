import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCommand } from '../context/CommandContext'
import {
  sectionFromProgress,
  sectionProgressFromJourney,
} from '../data/journeyPath'

gsap.registerPlugin(ScrollTrigger)

/** One continuous scrub across the journey — avoids multi-pin progress jumps. */
export function useScrollJourney() {
  const { setJourneyProgress, setScrollVelocity, setSectionProgress, setActiveSection, bootComplete } =
    useCommand()

  useEffect(() => {
    if (!bootComplete) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scrollRoot = document.querySelector('.journey-scroll')
    if (!scrollRoot) return

    const syncFromProgress = (progress: number, velocity = 0) => {
      const p = Math.max(0, Math.min(1, progress))
      setJourneyProgress(p)
      setScrollVelocity(velocity)
      setActiveSection(sectionFromProgress(p))
      const perSection = sectionProgressFromJourney(p)
      for (const [id, value] of Object.entries(perSection)) {
        setSectionProgress(id as keyof typeof perSection, value)
      }
    }

    if (prefersReduced) {
      syncFromProgress(0)
      return
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: scrollRoot,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.75,
        onUpdate: (self) => {
          syncFromProgress(self.progress, Math.abs(self.getVelocity()))
        },
      })

      syncFromProgress(0)
      ScrollTrigger.refresh()
    })

    return () => ctx.revert()
  }, [bootComplete, setJourneyProgress, setScrollVelocity, setSectionProgress, setActiveSection])
}
