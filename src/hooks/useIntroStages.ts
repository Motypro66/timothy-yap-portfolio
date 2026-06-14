import { useEffect, useState } from 'react'
import { useIntroComplete } from './useIntroComplete'

const MOBILE_QUERY = '(max-width: 960px)'

/**
 * Splits post-intro work across frames so Lenis, canvas, and WebGL-style
 * effects do not land in the same paint as the hero text reveal.
 */
export function useIntroStages() {
  const introComplete = useIntroComplete()
  const [uiReady, setUiReady] = useState(false)
  const [effectsReady, setEffectsReady] = useState(false)

  useEffect(() => {
    if (!introComplete) {
      setUiReady(false)
      setEffectsReady(false)
      return
    }

    let uiFrame = 0
    let effectsTimer = 0

    // Intro complete fires at fly start — reveal page on the next frame (no extra hold).
    uiFrame = requestAnimationFrame(() => {
      setUiReady(true)
      const mobile = window.matchMedia(MOBILE_QUERY).matches
      effectsTimer = window.setTimeout(() => setEffectsReady(true), mobile ? 280 : 180)
    })

    return () => {
      cancelAnimationFrame(uiFrame)
      window.clearTimeout(effectsTimer)
    }
  }, [introComplete])

  return { introComplete, uiReady, effectsReady }
}
