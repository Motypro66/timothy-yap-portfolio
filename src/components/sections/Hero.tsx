import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { profile } from '../../data/resume'
import { useCommand } from '../../context/CommandContext'
import { useLanguage } from '../../i18n/LanguageContext'
import StaggeredText from '../ui/StaggeredText'
import MagneticButton from '../ui/MagneticButton'
import RollingNumber from '../ui/RollingNumber'
import InteractiveBox from '../ui/InteractiveBox'
import Logo from '../ui/Logo'

type Metric = {
  type: string
  value?: string
  count?: number
  prefix?: string
  suffix?: string
  label: string
}

function MetricValue({ metric, rollStarted }: { metric: Metric; rollStarted: boolean }) {
  if (metric.type === 'count' && metric.count != null) {
    return (
      <RollingNumber
        value={metric.count}
        prefix={metric.prefix ?? ''}
        suffix={metric.suffix ?? ''}
        className="hero__metric-value"
        start={rollStarted}
        startDelay={120}
      />
    )
  }
  return <span className="hero__metric-value hero__metric-value--text type-display">{metric.value}</span>
}

export default function Hero() {
  const [rollStarted, setRollStarted] = useState(false)
  const { bootComplete, setBootComplete, introComplete } = useCommand()
  const { t, lang } = useLanguage()
  const title = lang === 'zh' ? profile.titleZh : profile.title
  const cvUrl = `${import.meta.env.BASE_URL}${profile.resumePdf}`

  // Reveal the hero content immediately (no dark boot screen).
  useEffect(() => {
    setBootComplete(true)
  }, [setBootComplete])

  // Roll the metrics the moment the logo intro clears — visible, no long wait.
  useEffect(() => {
    if (!introComplete) return
    const timer = window.setTimeout(() => setRollStarted(true), 250)
    return () => window.clearTimeout(timer)
  }, [introComplete])

  return (
    <section className="hero hero--command journey-station" id="hero">
      <div className="hero__grid hero__grid--command" aria-hidden="true" />
      <div className="hero__scrim hero__scrim--command hero__scrim--light" aria-hidden="true" />

      <AnimatePresence>
        {!bootComplete && (
          <motion.div
            className="hero-boot"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Logo variant="command" iconOnly className="hero-boot__logo" />
            <svg className="hero-boot__stroke" viewBox="0 0 32 32" aria-hidden="true">
              <motion.path
                d="M7 8h12M13 8v16M13 20c5 0 9-2.5 10-6"
                fill="none"
                stroke="#e8e0d8"
                strokeWidth="2.4"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0.3 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
            <motion.p
              className="hero-boot__status type-label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              {t.hero.systemOnline}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container hero__content journey-station__inner">
        <div className="hero__copy">
          <motion.div
            className="hero__badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={bootComplete ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <span className="hero__badge-dot" />
            {t.hero.badge}
          </motion.div>

          <h1 className="hero__title">
            <motion.span
              className="hero__name type-display"
              initial={{ opacity: 0, y: 30 }}
              animate={bootComplete ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {profile.displayName}
            </motion.span>
            <span className="hero__role type-body-strong">
              {bootComplete && <StaggeredText text={title} delay={0.35} />}
            </span>
          </h1>

          <motion.p
            className="hero__tagline type-body"
            initial={{ opacity: 0 }}
            animate={bootComplete ? { opacity: 1 } : {}}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            {t.hero.tagline}
          </motion.p>

          <motion.p
            className="hero__operator type-caption"
            initial={{ opacity: 0 }}
            animate={bootComplete ? { opacity: 1 } : {}}
            transition={{ delay: 1, duration: 0.6 }}
          >
            {t.hero.operatorLine}
          </motion.p>

          <motion.div
            className="hero__metrics"
            initial={{ opacity: 0, y: 20 }}
            animate={bootComplete ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.1, duration: 0.7 }}
          >
            {t.hero.metrics.map((m) => (
              <InteractiveBox key={m.label} className="hero__metric">
                <MetricValue metric={m} rollStarted={rollStarted} />
                <span className="hero__metric-label type-label">{m.label}</span>
              </InteractiveBox>
            ))}
          </motion.div>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 20 }}
            animate={bootComplete ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.3, duration: 0.7 }}
          >
            <MagneticButton href="#contact" variant="primary">
              {t.hero.getInTouch}
            </MagneticButton>
            <MagneticButton href="#experience" variant="secondary">
              {t.hero.viewExperience}
            </MagneticButton>
            <MagneticButton href={cvUrl} variant="ghost">
              {t.nav.downloadCv}
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          className="hero__scroll type-label"
          initial={{ opacity: 0 }}
          animate={bootComplete ? { opacity: 1 } : {}}
          transition={{ delay: 1.7, duration: 0.8 }}
        >
          <span>{t.hero.scroll}</span>
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
