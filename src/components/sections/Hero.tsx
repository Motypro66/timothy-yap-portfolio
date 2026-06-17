import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../../data/resume'
import { assetUrl } from '../../lib/assetUrl'
import { useLanguage } from '../../i18n/LanguageContext'
import { useIntroStages } from '../../hooks/useIntroStages'
import FloatingOrbs from '../effects/FloatingOrbs'
import ParticleBackground from '../effects/ParticleBackground'
import SunRays from '../effects/SunRays'
import StaggeredText from '../ui/StaggeredText'
import MagneticButton from '../ui/MagneticButton'
import RollingNumber from '../ui/RollingNumber'
import InteractiveBox from '../ui/InteractiveBox'

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
  const { uiReady, effectsReady } = useIntroStages()
  const [rollStarted, setRollStarted] = useState(false)
  const { t, lang } = useLanguage()
  const title = lang === 'zh' ? profile.titleZh : profile.title
  const cvUrl = assetUrl(profile.resumePdf)

  useEffect(() => {
    if (!uiReady) return

    let cancelled = false

    const beginRoll = () => {
      if (!cancelled) setRollStarted(true)
    }

    const timer = window.setTimeout(beginRoll, 900)
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setRollStarted(false)
        window.setTimeout(beginRoll, 300)
      }
    }

    window.addEventListener('pageshow', onPageShow)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
      window.removeEventListener('pageshow', onPageShow)
    }
  }, [uiReady])

  return (
    <section className={`hero${uiReady ? ' hero--ui-ready' : ''}`} id="hero">
      {uiReady && <FloatingOrbs />}
      {effectsReady && (
        <motion.div
          className="hero__fx-layer"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <SunRays />
          <ParticleBackground active />
        </motion.div>
      )}
      <div className="hero__mobile-glow" aria-hidden="true" />
      <div className="hero__scrim" aria-hidden="true" />
      <div className="hero__grid" aria-hidden="true" />

      <div className="container hero__content">
        <div className="hero__copy">
          <motion.div
            className="hero__badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={uiReady ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.05, duration: 0.5 }}
          >
            <span className="hero__badge-dot" />
            {t.hero.badge}
          </motion.div>

          <h1 className="hero__title">
            <motion.span
              className="hero__name type-display"
              initial={{ opacity: 0, y: 30 }}
              animate={uiReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.06, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              {profile.displayName}
            </motion.span>
            <span className="hero__role type-body-strong">
              <StaggeredText text={title} start={uiReady} delay={0.52} />
            </span>
          </h1>

          <motion.p
            className="hero__tagline type-body"
            initial={{ opacity: 0 }}
            animate={uiReady ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.82, duration: 0.55 }}
          >
            {t.hero.tagline}
          </motion.p>

          <motion.div
            className="hero__metrics"
            initial={{ opacity: 0, y: 20 }}
            animate={uiReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.96, duration: 0.55 }}
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
            animate={uiReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 1.1, duration: 0.55 }}
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
          animate={uiReady ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.28, duration: 0.55 }}
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
