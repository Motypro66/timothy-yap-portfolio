type Props = {
  className?: string
  variant?: 'light' | 'dark'
}

/** Logo 04 — Monoline T + wordmark */
export default function Logo({ className = '', variant = 'dark' }: Props) {
  const stroke = variant === 'dark' ? '#3d2e2a' : '#fff8f0'
  const textFill = stroke

  return (
    <svg
      className={`logo-mark ${className}`}
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
      />
      <circle cx="26" cy="16" r="3.2" fill="#f5a623" />
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
    </svg>
  )
}
