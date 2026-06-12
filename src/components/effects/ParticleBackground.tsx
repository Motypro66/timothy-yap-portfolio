import { useCallback, useEffect, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { ISourceOptions } from '@tsparticles/engine'

const particleOptions: ISourceOptions = {
  fullScreen: { enable: false },
  fpsLimit: 60,
  particles: {
    number: { value: 70, density: { enable: true } },
    color: { value: ['#f5a623', '#ffd166', '#ff8c69', '#5bb5e8'] },
    links: {
      enable: true,
      color: '#f5a623',
      opacity: 0.18,
      distance: 140,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.6,
      direction: 'none',
      random: true,
      outModes: { default: 'bounce' },
    },
    opacity: { value: { min: 0.25, max: 0.55 } },
    size: { value: { min: 1, max: 3.5 } },
  },
  interactivity: {
    detectsOn: 'window',
    events: {
      onHover: { enable: true, mode: 'grab' },
      onClick: { enable: true, mode: 'push' },
      resize: { enable: true },
    },
    modes: {
      grab: { distance: 160, links: { opacity: 0.35 } },
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
