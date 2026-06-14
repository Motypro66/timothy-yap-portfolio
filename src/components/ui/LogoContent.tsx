import {
  LOGO_FONT,
  LOGO_INK,
  LOGO_INK_LIGHT,
  LOGO_STROKE_WIDTH,
  LOGO_SUN,
} from './logoTokens'

type Props = {
  ink?: string
  groupClassName?: string
  strokeClassName?: string
  dotClassName?: string
  wordClassName?: string
  showWord?: boolean
  showSun?: boolean
  /** Sun pulse rings — intro animation only */
  introEffects?: boolean
}

/** Monoline T + sun dot + Fraunces wordmark (shared geometry). */
export default function LogoContent({
  ink = LOGO_INK,
  groupClassName = 'logo-content',
  strokeClassName,
  dotClassName,
  wordClassName,
  showWord = true,
  showSun = true,
  introEffects = false,
}: Props) {
  return (
    <g className={groupClassName}>
      {introEffects && (
        <>
          <circle
            className="li-sun-glow"
            cx="26"
            cy="16"
            r="22"
            fill="url(#logoSunGlow)"
            opacity="0"
          />
          <circle className="li-sun-pulse" cx="26" cy="16" r="10" fill={LOGO_SUN} opacity="0" />
        </>
      )}
      <path
        className={strokeClassName}
        pathLength={strokeClassName ? 1 : undefined}
        d="M6 8h16"
        fill="none"
        stroke={ink}
        strokeWidth={LOGO_STROKE_WIDTH}
        strokeLinecap={strokeClassName ? 'butt' : 'round'}
        opacity={strokeClassName ? 0 : 1}
      />
      <path
        className={strokeClassName}
        pathLength={strokeClassName ? 1 : undefined}
        d="M14 8v22"
        fill="none"
        stroke={ink}
        strokeWidth={LOGO_STROKE_WIDTH}
        strokeLinecap={strokeClassName ? 'butt' : 'round'}
        opacity={strokeClassName ? 0 : 1}
      />
      <path
        className={strokeClassName}
        pathLength={strokeClassName ? 1 : undefined}
        d="M14 26c6 0 11-3 12-8"
        fill="none"
        stroke={ink}
        strokeWidth={LOGO_STROKE_WIDTH}
        strokeLinecap={strokeClassName ? 'butt' : 'round'}
        strokeLinejoin="round"
        opacity={strokeClassName ? 0 : 1}
      />
      {dotClassName ? (
        <circle className={dotClassName} cx="26" cy="16" r="3.2" fill={LOGO_SUN} />
      ) : (
        showSun && <circle className="logo-sun" cx="26" cy="16" r="3.2" fill={LOGO_SUN} />
      )}
      {showWord && (
        <text
          className={wordClassName}
          x="36"
          y="27"
          fill={ink}
          fontFamily={LOGO_FONT}
          fontSize="20"
          fontWeight="700"
          letterSpacing="-0.03em"
        >
          imothy
        </text>
      )}
    </g>
  )
}

export { LOGO_INK_LIGHT }
