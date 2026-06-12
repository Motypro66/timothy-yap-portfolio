import { motion } from 'framer-motion'
import { profile } from '../../data/resume'
import FloatingOrbs from '../effects/FloatingOrbs'
import ParticleBackground from '../effects/ParticleBackground'
import StaggeredText from '../ui/StaggeredText'
import MagneticButton from '../ui/MagneticButton'

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <ParticleBackground />
      <FloatingOrbs />

      <div className="hero__grid" aria-hidden="true" />

      <div className="container hero__content">
        <motion.div
          className="hero__badge"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span className="hero__badge-dot" />
          Open to opportunities
        </motion.div>

        <h1 className="hero__title">
          <motion.span
            className="hero__name gradient-text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {profile.name}
          </motion.span>
          <span className="hero__role">
            <StaggeredText text={profile.title} delay={0.5} />
          </span>
        </h1>

        <motion.p
          className="hero__tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          className="hero__metrics"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.7 }}
        >
          {profile.metrics.map((m) => (
            <div key={m.label} className="hero__metric">
              <span className="hero__metric-value">{m.value}</span>
              <span className="hero__metric-label">{m.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.7 }}
        >
          <MagneticButton href="#contact" variant="primary">
            Get in Touch
          </MagneticButton>
          <MagneticButton href="#experience" variant="secondary">
            View Experience
          </MagneticButton>
        </motion.div>

        <motion.div
          className="hero__scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <span>Scroll</span>
          <motion.div
            className="hero__scroll-line"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
