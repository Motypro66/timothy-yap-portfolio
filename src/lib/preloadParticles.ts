import { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

let preloadPromise: Promise<void> | null = null

/** Warm up tsparticles while the logo intro plays so post-intro mount is cheap. */
export function preloadParticlesEngine() {
  if (typeof window === 'undefined') return Promise.resolve()
  if (!preloadPromise) {
    preloadPromise = initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => undefined)
  }
  return preloadPromise
}
