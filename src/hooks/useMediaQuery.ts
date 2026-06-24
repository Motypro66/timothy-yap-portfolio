import { useEffect, useState } from 'react'

export const MOBILE_BREAKPOINT = 960
export const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT}px)`

export function useIsMobile(): boolean {
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

export function isMobileOnce(): boolean {
  return typeof window !== 'undefined' ? window.matchMedia(MOBILE_QUERY).matches : false
}
