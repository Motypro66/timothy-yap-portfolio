import LogoContent, { LOGO_INK_LIGHT } from './LogoContent'
import { LOGO_INK, LOGO_VIEWBOX } from './logoTokens'

type Props = {
  className?: string
  variant?: 'light' | 'dark'
  showSun?: boolean
}

/** Logo 04 — Monoline T + wordmark */
export default function Logo({ className = '', variant = 'dark', showSun = true }: Props) {
  const ink = variant === 'dark' ? LOGO_INK : LOGO_INK_LIGHT

  return (
    <svg
      className={`logo-mark ${className}`}
      viewBox={LOGO_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Timothy"
      role="img"
    >
      <LogoContent ink={ink} showSun={showSun} />
    </svg>
  )
}
