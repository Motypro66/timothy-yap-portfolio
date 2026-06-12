import { useEffect, useState } from 'react'

const ROLL_DURATION_S = 2.6
const DIGIT_STAGGER_MS = 130

type SlotDigitProps = {
  digit: number
  delayMs?: number
  start?: boolean
}

function SlotDigit({ digit, delayMs = 0, start = false }: SlotDigitProps) {
  const [spin, setSpin] = useState(false)

  const loops = 4
  const sequence = Array.from({ length: loops * 10 + digit + 1 }, (_, i) => i % 10)
  const targetIndex = sequence.length - 1

  useEffect(() => {
    if (!start) {
      setSpin(false)
      return
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setSpin(true)
      return
    }

    let cancelled = false
    const timer = window.setTimeout(() => {
      if (cancelled) return
      setSpin(false)
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (!cancelled) setSpin(true)
        })
      })
    }, delayMs)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [start, delayMs])

  return (
    <span className="slot-digit" aria-hidden="true">
      <span
        className="slot-digit__strip"
        style={{
          transform: spin
            ? `translateY(calc(${-targetIndex} * var(--slot-height)))`
            : 'translateY(0)',
          transition: spin
            ? `transform ${ROLL_DURATION_S}s cubic-bezier(0.16, 1, 0.28, 1)`
            : 'none',
        }}
      >
        {sequence.map((n, i) => (
          <span className="slot-digit__num" key={`${i}-${n}`}>
            {n}
          </span>
        ))}
      </span>
      <span className="sr-only">{digit}</span>
    </span>
  )
}

type Props = {
  value: number
  prefix?: string
  suffix?: string
  className?: string
  start?: boolean
  startDelay?: number
}

/** Odometer-style vertical roll — digits scroll down then land on target */
export default function RollingNumber({
  value,
  prefix = '',
  suffix = '',
  className = '',
  start = false,
  startDelay = 0,
}: Props) {
  const digits = String(Math.abs(value)).split('').map(Number)

  return (
    <span className={`rolling-number ${className}`.trim()} aria-label={`${prefix}${value}${suffix}`}>
      {prefix && <span className="rolling-number__affix">{prefix}</span>}
      <span className="rolling-number__digits">
        {digits.map((d, i) => (
          <SlotDigit
            key={i}
            digit={d}
            delayMs={startDelay + i * DIGIT_STAGGER_MS}
            start={start}
          />
        ))}
      </span>
      {suffix && <span className="rolling-number__affix">{suffix}</span>}
    </span>
  )
}
