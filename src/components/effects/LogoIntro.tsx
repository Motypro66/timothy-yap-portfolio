import { useEffect } from 'react'
import { useCommand } from '../../context/CommandContext'

/** Pixel2Motion-inspired logo draw-on intro — stroke reveal, dot pop, word stagger. */
export default function LogoIntro() {
  const { introComplete, setIntroComplete } = useCommand()

  useEffect(() => {
    if (introComplete) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const delay = prefersReduced ? 400 : 2800
    const timer = window.setTimeout(() => setIntroComplete(true), delay)
    return () => window.clearTimeout(timer)
  }, [introComplete, setIntroComplete])

  if (introComplete) return null

  return (
    <div className="logo-intro" role="presentation" aria-hidden="true">
      <div className="logo-intro__panel">
        <svg
          className="logo-intro__mark"
          viewBox="0 0 168 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g className="logo-intro__icon">
            <path
              className="logo-intro__stroke logo-intro__stroke--bar"
              pathLength={1}
              d="M6 8h16"
              stroke="#2a2218"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <path
              className="logo-intro__stroke logo-intro__stroke--stem"
              pathLength={1}
              d="M14 8v22"
              stroke="#2a2218"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <path
              className="logo-intro__stroke logo-intro__stroke--hook"
              pathLength={1}
              d="M14 26c6 0 11-3 12-8"
              stroke="#2a2218"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle className="logo-intro__dot" cx="26" cy="16" r="3.2" fill="#f5a623" />
          </g>
          <text
            className="logo-intro__word"
            x="34"
            y="27"
            fill="#2a2218"
            fontFamily="'Fraunces', Georgia, serif"
            fontSize="20"
            fontWeight="700"
            letterSpacing="-0.02em"
          >
            imothy
          </text>
        </svg>
        <p className="logo-intro__tag type-caption">Performance Marketing · Kuala Lumpur</p>
      </div>
    </div>
  )
}
