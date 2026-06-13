import { useState } from 'react'
import { motion } from 'framer-motion'

type Props = {
  label: string
  index?: number
  backText?: string
}

export default function SkillPill({ label, index = 0, backText }: Props) {
  const [flipped, setFlipped] = useState(false)
  const interactive = Boolean(backText)

  return (
    <motion.button
      type="button"
      className={`skill-pill ${interactive ? 'skill-pill--interactive' : ''} ${flipped ? 'skill-pill--flipped' : ''}`}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.4, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.06, y: -2 }}
      onClick={() => interactive && setFlipped((f) => !f)}
      aria-pressed={interactive ? flipped : undefined}
    >
      <span className="skill-pill__face skill-pill__face--front">{label}</span>
      {backText && <span className="skill-pill__face skill-pill__face--back">{backText}</span>}
    </motion.button>
  )
}
