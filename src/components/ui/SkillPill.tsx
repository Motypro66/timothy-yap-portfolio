import { motion } from 'framer-motion'

type Props = {
  label: string
  index?: number
}

export default function SkillPill({ label, index = 0 }: Props) {
  return (
    <motion.span
      className="skill-pill"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.4, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.08, y: -2 }}
    >
      {label}
    </motion.span>
  )
}
