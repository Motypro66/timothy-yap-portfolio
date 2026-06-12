import { motion } from 'framer-motion'
import { useState, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  delay?: number
}

export default function GlassCard({ children, className = '', delay = 0 }: Props) {
  const [shimmer, setShimmer] = useState(false)

  const triggerShimmer = () => {
    setShimmer(true)
    window.setTimeout(() => setShimmer(false), 650)
  }

  return (
    <motion.div
      className={`glass-card interactive-card ${shimmer ? 'interactive-card--shimmer' : ''} ${className}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } }}
      onClick={triggerShimmer}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') triggerShimmer()
      }}
      role="presentation"
    >
      <span className="interactive-card__shine" aria-hidden="true" />
      {children}
    </motion.div>
  )
}
