import { useEffect, useState } from 'react'

export const LOGO_INTRO_COMPLETE = 'logo-intro-complete'

/** True once the opening logo intro finishes (or immediately for reduced motion). */
export function useIntroComplete() {
  const [complete, setComplete] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  )

  useEffect(() => {
    if (complete) return

    const onDone = () => {
      document.documentElement.classList.remove('intro-active')
      setComplete(true)
    }
    window.addEventListener(LOGO_INTRO_COMPLETE, onDone)
    const safety = window.setTimeout(onDone, 4800)

    return () => {
      window.removeEventListener(LOGO_INTRO_COMPLETE, onDone)
      window.clearTimeout(safety)
    }
  }, [complete])

  return complete
}
