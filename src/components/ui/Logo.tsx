type Props = {
  className?: string
  variant?: 'light' | 'dark'
}

export default function Logo({ className = '', variant = 'dark' }: Props) {
  const textFill = variant === 'dark' ? '#3d2e2a' : '#fff8f0'
  const sunCore = '#f5a623'
  const sunRay = '#ffd166'

  return (
    <svg
      className={`logo-mark ${className}`}
      viewBox="0 0 180 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Timothy Yap"
      role="img"
    >
      {/* Sun arc mark — warm, personal, not TY block */}
      <circle cx="18" cy="20" r="7" fill={sunCore} opacity="0.95" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180
        const x1 = 18 + Math.cos(rad) * 9
        const y1 = 20 + Math.sin(rad) * 9
        const x2 = 18 + Math.cos(rad) * 12.5
        const y2 = 20 + Math.sin(rad) * 12.5
        return (
          <line
            key={deg}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={sunRay}
            strokeWidth="2"
            strokeLinecap="round"
          />
        )
      })}
      {/* Wordmark */}
      <text
        x="38"
        y="26"
        fill={textFill}
        fontFamily="'Fraunces', Georgia, serif"
        fontSize="18"
        fontWeight="700"
        letterSpacing="-0.02em"
      >
        Timothy
      </text>
      <text
        x="128"
        y="26"
        fill={sunCore}
        fontFamily="'Outfit', system-ui, sans-serif"
        fontSize="14"
        fontWeight="500"
        opacity="0.85"
      >
        Yap
      </text>
    </svg>
  )
}
