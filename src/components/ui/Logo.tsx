type Props = {
  className?: string
  variant?: 'dark' | 'light' | 'command'
  iconOnly?: boolean
  showSignal?: boolean
}

/** Logo 04 — Monoline T + wordmark */
export default function Logo({
  className = '',
  variant = 'command',
  iconOnly = false,
  showSignal = true,
}: Props) {
  const stroke =
    variant === 'dark' ? '#3d2e2a' : variant === 'light' ? '#fff8f0' : '#e8e0d8'
  const textFill = stroke

  if (iconOnly) {
    return (
      <svg
        className={`logo-mark logo-mark--icon ${className}`}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Timothy"
        role="img"
      >
        <path
          d="M7 8h12M13 8v16M13 20c5 0 9-2.5 10-6"
          stroke={stroke}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="logo-mark__stroke"
        />
        {showSignal && <circle cx="23" cy="12" r="3" fill="#f5a623" className="logo-mark__dot" />}
      </svg>
    )
  }

  return (
    <svg
      className={`logo-mark logo-mark--full ${className}`}
      viewBox="0 0 168 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Timothy"
      role="img"
    >
      <path
        d="M6 8h16M14 8v22M14 26c6 0 11-3 12-8"
        stroke={stroke}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="logo-mark__stroke"
      />
      {showSignal && (
        <circle cx="26" cy="16" r="3.2" fill="#f5a623" className="logo-mark__dot" />
      )}
      {!iconOnly && (
        <text
          x="34"
          y="27"
          fill={textFill}
          fontFamily="'Fraunces', Georgia, serif"
          fontSize="20"
          fontWeight="700"
          letterSpacing="-0.02em"
        >
          imothy
        </text>
      )}
    </svg>
  )
}
