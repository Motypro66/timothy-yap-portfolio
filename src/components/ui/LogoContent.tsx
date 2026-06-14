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
}

/** Monoline T + sun dot + Fraunces wordmark (shared geometry). */
export default function LogoContent({
  ink = LOGO_INK,
  groupClassName = 'logo-content',
  strokeClassName,
  dotClassName,
  wordClassName,
  showWord = true,
}: Props) {
  return (
    <g className={groupClassName}>
      <path
        className={strokeClassName}
        d="M6 8h16"
        stroke={ink}
        strokeWidth={LOGO_STROKE_WIDTH}
        strokeLinecap="round"
      />
      <path
        className={strokeClassName}
        d="M14 8v22"
        stroke={ink}
        strokeWidth={LOGO_STROKE_WIDTH}
        strokeLinecap="round"
      />
      <path
        className={strokeClassName}
        d="M14 26c6 0 11-3 12-8"
        stroke={ink}
        strokeWidth={LOGO_STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle className={dotClassName} cx="26" cy="16" r="3.2" fill={LOGO_SUN} />
      {showWord && (
        <text
          className={wordClassName}
          x="30"
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
