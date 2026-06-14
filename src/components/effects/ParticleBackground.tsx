import { useCallback, useEffect, useMemo, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { ISourceOptions } from '@tsparticles/engine'
import { useIntroComplete } from '../../hooks/useIntroComplete'

const MOBILE_QUERY = '(max-width: 960px)'

function buildOptions(mobile: boolean): ISourceOptions {
  return {
    fullScreen: { enable: false },
    fpsLimit: mobile ? 36 : 60,
    particles: {
      number: { value: mobile ? 40 : 65, density: { enable: true } },
      color: { value: ['#f5a623', '#ffd166', '#ff8c69', '#e8a838'] },
      links: {
        enable: !mobile,
        color: '#f5a623',
        opacity: mobile ? 0.22 : 0.18,
        distance: mobile ? 100 : 140,
        width: 1,
      },
      move: {
        enable: true,
        speed: mobile ? 0.55 : 0.6,
        direction: 'none',
        random: true,
        outModes: { default: 'bounce' },
      },
      opacity: { value: { min: mobile ? 0.3 : 0.25, max: mobile ? 0.65 : 0.55 } },
      size: { value: { min: mobile ? 1.25 : 1, max: mobile ? 3.5 : 3.5 } },
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
        push: { quantity: mobile ? 3 : 3 },
      },
    },
    detectRetina: !mobile,
  }
}

function useIsMobile() {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_QUERY).matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    const onChange = () => setMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return mobile
}

export default function ParticleBackground() {
  const introComplete = useIntroComplete()
  const [ready, setReady] = useState(false)
  const isMobile = useIsMobile()
  const options = useMemo(() => buildOptions(isMobile), [isMobile])

  useEffect(() => {
    if (!introComplete) return

    let cancelled = false
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      if (!cancelled) setReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [introComplete])

  const particlesLoaded = useCallback(async () => {}, [])

  if (!introComplete || !ready) return null

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
