import { useCallback, useEffect, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { ISourceOptions } from '@tsparticles/engine'

const particleOptions: ISourceOptions = {
  fullScreen: { enable: false },
  fpsLimit: 60,
  particles: {
    number: { value: 80, density: { enable: true } },
    color: { value: ['#00e5ff', '#8b5cf6', '#ff6b4a'] },
    links: {
      enable: true,
      color: '#00e5ff',
      opacity: 0.15,
      distance: 150,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.8,
      direction: 'none',
      random: true,
      outModes: { default: 'bounce' },
    },
    opacity: { value: { min: 0.2, max: 0.6 } },
    size: { value: { min: 1, max: 3 } },
  },
  interactivity: {
    detectsOn: 'window',
    events: {
      onHover: { enable: true, mode: 'grab' },
      onClick: { enable: true, mode: 'push' },
      resize: { enable: true },
    },
    modes: {
      grab: { distance: 180, links: { opacity: 0.4 } },
      push: { quantity: 3 },
    },
  },
  detectRetina: true,
}

export default function ParticleBackground() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => setReady(true))
  }, [])

  const particlesLoaded = useCallback(async () => {}, [])

  if (!ready) return null

  return (
    <div className="particle-bg" aria-hidden="true">
      <Particles id="tsparticles" options={particleOptions} particlesLoaded={particlesLoaded} />
    </div>
  )
}
