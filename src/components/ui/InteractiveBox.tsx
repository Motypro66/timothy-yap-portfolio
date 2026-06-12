import { useState } from 'react'
import { motion } from 'framer-motion'

type Props = {
  children: React.ReactNode
  className?: string
}

/** Click shimmer + hover float for non-GlassCard boxes (e.g. hero metrics) */
export default function InteractiveBox({ children, className = '' }: Props) {
  const [shimmer, setShimmer] = useState(false)

  return (
    <motion.div
      className={`interactive-card ${shimmer ? 'interactive-card--shimmer' : ''} ${className}`}
      whileHover={{ y: -5, transition: { duration: 0.32 } }}
      onClick={() => {
        setShimmer(true)
        window.setTimeout(() => setShimmer(false), 650)
      }}
      role="presentation"
    >
      <span className="interactive-card__shine" aria-hidden="true" />
      {children}
    </motion.div>
  )
}
