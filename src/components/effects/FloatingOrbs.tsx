import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

const ORBS = [
  { id: 'sun', shell: 'fo-orb-shell--sun', orb: 'fo-orb--sun', delay: 0.08 },
  { id: 'peach', shell: 'fo-orb-shell--peach', orb: 'fo-orb--peach', delay: 0.16 },
  { id: 'sky', shell: 'fo-orb-shell--sky', orb: 'fo-orb--sky', delay: 0.24 },
  { id: 'coral', shell: 'fo-orb-shell--coral', orb: 'fo-orb--coral', delay: 0.32 },
] as const

/**
 * Soft floating orbs on the hero's right side — entrance stagger matches hero copy.
 */
export default function FloatingOrbs() {
  return (
    <motion.div
      className="floating-orbs floating-orbs--side"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      {ORBS.map(({ id, shell, orb, delay }) => (
        <motion.span
          key={id}
          className={`fo-orb-shell ${shell}`}
          initial={{ opacity: 0, scale: 0.74, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.62, delay, ease: EASE }}
        >
          <span className={`fo-orb ${orb}`} />
        </motion.span>
      ))}
    </motion.div>
  )
}
