import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCommand } from '../context/CommandContext'
import type { SectionId } from '../context/CommandContext'
import { progressFromSections, SECTION_JOURNEY } from '../data/journeyPath'

gsap.registerPlugin(ScrollTrigger)

/** Per-section pin + scrubbed camera journey across the full storyboard */
export function useScrollJourney() {
  const { setJourneyProgress, setScrollVelocity, setSectionProgress, bootComplete } = useCommand()

  useEffect(() => {
    if (!bootComplete) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const progressMap: Record<SectionId, number> = {
      hero: 0,
      about: 0,
      skills: 0,
      experience: 0,
      contact: 0,
    }

    const syncGlobal = (velocity = 0) => {
      setJourneyProgress(progressFromSections(progressMap))
      setScrollVelocity(velocity)
    }

    const onRefresh = () => syncGlobal()

    const ctx = gsap.context(() => {
      SECTION_JOURNEY.forEach(({ id, pin }) => {
        const el = document.getElementById(id)
        if (!el) return

        ScrollTrigger.create({
          trigger: el,
          start: 'top top',
          end: `+=${pin}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            progressMap[id] = self.progress
            setSectionProgress(id, self.progress)
            syncGlobal(Math.abs(self.getVelocity()))
          },
        })
      })

      ScrollTrigger.addEventListener('refreshInit', onRefresh)
      syncGlobal()
      ScrollTrigger.refresh()
    })

    return () => {
      ScrollTrigger.removeEventListener('refreshInit', onRefresh)
      ctx.revert()
    }
  }, [bootComplete, setJourneyProgress, setScrollVelocity, setSectionProgress])
}
