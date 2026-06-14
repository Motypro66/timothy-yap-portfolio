import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LOGO_INTRO_COMPLETE } from './useIntroComplete'

gsap.registerPlugin(ScrollTrigger)

/**
 * Buttery scroll for the whole site.
 *
 * Lenis is driven from GSAP's single ticker (not its own rAF) so every
 * scroll-triggered reveal updates in the same frame — this is what removes the
 * jitter/stutter the old multi-loop room journey had.
 *
 * Starts after the logo intro so opening animation stays smooth on mobile.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let lenis: Lenis | null = null
    let onTick: ((time: number) => void) | null = null

    const start = () => {
      if (lenis) return

      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
      })

      lenis.on('scroll', ScrollTrigger.update)

      onTick = (time: number) => lenis!.raf(time * 1000)
      gsap.ticker.add(onTick)
      gsap.ticker.lagSmoothing(0)
    }

    window.addEventListener(LOGO_INTRO_COMPLETE, start, { once: true })
    const safety = window.setTimeout(start, 3200)

    return () => {
      window.clearTimeout(safety)
      window.removeEventListener(LOGO_INTRO_COMPLETE, start)
      if (onTick) gsap.ticker.remove(onTick)
      lenis?.destroy()
    }
  }, [])
}
