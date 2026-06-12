import { motion } from 'framer-motion'

export default function PersonIllustration() {
  return (
    <motion.svg
      className="person-illustration"
      viewBox="0 0 120 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Abstract friendly figure — line art, no photo */}
      <circle cx="60" cy="32" r="18" stroke="#f5a623" strokeWidth="2.5" fill="rgba(245,166,35,0.12)" />
      <path
        d="M60 52 C40 52 28 68 28 90 L28 130 C28 138 36 145 60 145 C84 145 92 138 92 130 L92 90 C92 68 80 52 60 52"
        stroke="#ff8c69"
        strokeWidth="2.5"
        fill="rgba(255,140,105,0.08)"
        strokeLinecap="round"
      />
      <path
        d="M42 95 Q60 110 78 95"
        stroke="#5bb5e8"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Wave hand — friendly gesture */}
      <path
        d="M92 75 Q105 65 108 50 Q110 42 102 44"
        stroke="#ffd166"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <motion.circle
        cx="108"
        cy="44"
        r="3"
        fill="#ffd166"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  )
}
