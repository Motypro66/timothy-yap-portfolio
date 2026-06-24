import { useCallback, useEffect, useMemo, useState } from 'react'
import Particles from '@tsparticles/react'
import type { ISourceOptions } from '@tsparticles/engine'
import { preloadParticlesEngine } from '../../lib/preloadParticles'
import { useIsMobile } from '../../hooks/useMediaQuery'

function buildOptions(mobile: boolean): ISourceOptions {
  return {
    fullScreen: { enable: false },
    fpsLimit: mobile ? 36 : 45,
    particles: {
      number: { value: mobile ? 52 : 65, density: { enable: true } },
      color: { value: ['#f5a623', '#ffd166', '#ff8c69', '#e8a838', '#ff7555'] },
      links: {
        enable: true,
        color: '#f5a623',
        opacity: mobile ? 0.28 : 0.18,
        distance: mobile ? 110 : 140,
        width: mobile ? 1.15 : 1,
      },
      move: {
        enable: true,
        speed: mobile ? 0.88 : 0.82,
        direction: 'none',
        random: true,
        outModes: { default: 'bounce' },
      },
      opacity: { value: { min: mobile ? 0.38 : 0.25, max: mobile ? 0.82 : 0.55 } },
      size: { value: { min: mobile ? 1.5 : 1, max: mobile ? 4.75 : 3.5 } },
    },
    interactivity: {
      detectsOn: 'window',
      events: {
        onHover: { enable: !mobile, mode: 'grab' },
        onClick: { enable: mobile, mode: 'push' },
        resize: { enable: true },
      },
      modes: {
        grab: { distance: 160, links: { opacity: 0.35 } },
        push: { quantity: mobile ? 4 : 3 },
      },
    },
    detectRetina: !mobile,
  }
}

type Props = {
  active: boolean
}

export default function ParticleBackground({ active }: Props) {
  const [ready, setReady] = useState(false)
  const isMobile = useIsMobile()
  const options = useMemo(() => buildOptions(isMobile), [isMobile])

  useEffect(() => {
    if (!active) {
      setReady(false)
      return
    }

    let cancelled = false
    preloadParticlesEngine().then(() => {
      if (!cancelled) setReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [active])

  const particlesLoaded = useCallback(async () => {}, [])

  if (!active || !ready) return null

  return (
    <div className={`particle-bg${isMobile ? ' particle-bg--mobile' : ''}`} aria-hidden="true">
      <Particles
        id="tsparticles"
        key={isMobile ? 'mobile' : 'desktop'}
        options={options}
        particlesLoaded={particlesLoaded}
      />
    </div>
  )
}
