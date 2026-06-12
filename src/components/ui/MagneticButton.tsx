import { motion } from 'framer-motion'
import { useRef, type ReactNode, type MouseEvent } from 'react'

type Props = {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  href?: string
  className?: string
  onClick?: () => void
}

export default function MagneticButton({
  children,
  variant = 'primary',
  href,
  className = '',
  onClick,
}: Props) {
  const ref = useRef<HTMLElement>(null)

  const handleMove = (e: MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`
  }

  const handleLeave = () => {
    const el = ref.current
    if (el) el.style.transform = 'translate(0, 0)'
  }

  const classes = `magnetic-btn magnetic-btn--${variant} ${className}`

  if (href) {
    const isExternal = href.startsWith('http')
    const isDownload = href.endsWith('.pdf')

    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={classes}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        download={isDownload ? true : undefined}
        whileTap={{ scale: 0.96 }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        <span className="magnetic-btn__glow" aria-hidden="true" />
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={classes}
      whileTap={{ scale: 0.96 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      type="button"
    >
      <span className="magnetic-btn__glow" aria-hidden="true" />
      {children}
    </motion.button>
  )
}
