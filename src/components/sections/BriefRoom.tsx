import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  generateBriefPlan,
  type BriefAngle,
  type BriefChannel,
  type BriefPlan,
} from '../../data/briefPlan'
import { useCommand } from '../../context/CommandContext'
import { useLanguage } from '../../i18n/LanguageContext'
import ScrollRevealSection from '../effects/ScrollRevealSection'
import SectionHeading from '../ui/SectionHeading'
import MagneticButton from '../ui/MagneticButton'
import Logo from '../ui/Logo'

export default function BriefRoom() {
  const { signalStatus, setSignalStatus } = useCommand()
  const { t, lang } = useLanguage()
  const [budget, setBudget] = useState(12000)
  const [targetCpl, setTargetCpl] = useState(65)
  const [channel, setChannel] = useState<BriefChannel>('search')
  const [angle, setAngle] = useState<BriefAngle>(0)
  const [plan, setPlan] = useState<BriefPlan | null>(null)
  const [typingIndex, setTypingIndex] = useState(-1)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [scanning, setScanning] = useState(false)

  const previewLeads = useMemo(
    () => Math.max(1, Math.round((budget / targetCpl) * (channel === 'search' ? 1 : 0.88))),
    [budget, targetCpl, channel],
  )

  const runGenerate = useCallback(() => {
    setScanning(true)
    setSignalStatus('processing')
    setPlan(null)
    setTypingIndex(-1)
    setExpanded(null)

    window.setTimeout(() => {
      const next = generateBriefPlan({ budget, targetCpl, channel, angle }, lang)
      setPlan(next)
      setScanning(false)
      setSignalStatus('ready')
      setTypingIndex(0)
      window.setTimeout(() => setSignalStatus('idle'), 2400)
    }, 1400)
  }, [budget, targetCpl, channel, angle, lang, setSignalStatus])

  useEffect(() => {
    if (!plan || typingIndex < 0) return
    if (typingIndex >= plan.lines.length) return
    const tmr = window.setTimeout(() => setTypingIndex((i) => i + 1), 380)
    return () => window.clearTimeout(tmr)
  }, [plan, typingIndex])

  const shuffleAngle = () => setAngle(((angle + 1) % 3) as BriefAngle)

  return (
    <ScrollRevealSection id="brief" className="brief-room command-section journey-station">
      <div className="container journey-station__inner">
        <SectionHeading eyebrow={t.brief.eyebrow} title={t.brief.title} subtitle={t.brief.subtitle} />

        <div className="brief-room__grid">
          <div className="brief-room__console glass-panel reveal-item">
            <div className="brief-room__console-head">
              <Logo variant="command" iconOnly />
              <span className="type-label">{t.brief.consoleLabel}</span>
              <span className="brief-room__sim type-caption">{t.brief.simulated}</span>
            </div>

            <p className="brief-room__industry type-body-strong">{t.brief.industry}</p>

            <label className="brief-room__field">
              <span className="type-label">{t.brief.budget}</span>
              <input
                type="range"
                min={3000}
                max={50000}
                step={500}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
              />
              <span className="brief-room__value type-body-strong">RM {budget.toLocaleString()}</span>
            </label>

            <label className="brief-room__field">
              <span className="type-label">{t.brief.targetCpl}</span>
              <input
                type="range"
                min={25}
                max={180}
                step={5}
                value={targetCpl}
                onChange={(e) => setTargetCpl(Number(e.target.value))}
              />
              <span className="brief-room__value type-body-strong">RM {targetCpl}</span>
            </label>

            <div className="brief-room__field">
              <span className="type-label">{t.brief.channel}</span>
              <div className="brief-room__toggles">
                <button
                  type="button"
                  className={channel === 'search' ? 'brief-room__toggle--active' : ''}
                  onClick={() => setChannel('search')}
                >
                  Search
                </button>
                <button
                  type="button"
                  className={channel === 'pmax' ? 'brief-room__toggle--active' : ''}
                  onClick={() => setChannel('pmax')}
                >
                  PMax
                </button>
              </div>
            </div>

            <p className="brief-room__preview type-caption">
              {t.brief.estLeads}: <strong>{previewLeads}</strong>/mo · {t.brief.angle} #{angle + 1}
            </p>

            <div className="brief-room__actions">
              <MagneticButton variant="primary" onClick={runGenerate}>
                {signalStatus === 'processing' ? t.brief.generating : t.brief.generate}
              </MagneticButton>
              <MagneticButton variant="secondary" onClick={shuffleAngle}>
                {t.brief.shuffle}
              </MagneticButton>
            </div>
          </div>

          <div className="brief-room__output glass-panel reveal-item">
            <AnimatePresence>
              {scanning && (
                <motion.div
                  className="brief-room__scan"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>

            {!plan && !scanning && (
              <p className="brief-room__empty type-body">{t.brief.empty}</p>
            )}

            {plan && (
              <div className="brief-room__plan">
                <div className="brief-room__summary">
                  <span className="type-label">{t.brief.output}</span>
                  <p className="type-body-strong">
                    ~{plan.estLeads} leads/mo · RM {plan.estSpend.toLocaleString()} spend
                  </p>
                </div>
                <ul className="brief-room__lines">
                  {plan.lines.map((line, i) => {
                    const visible = i <= typingIndex
                    if (!visible) return null
                    const title = lang === 'zh' ? line.titleZh : line.title
                    const body = lang === 'zh' ? line.bodyZh : line.body
                    const why = lang === 'zh' ? line.whyZh : line.why
                    return (
                      <motion.li
                        key={line.title}
                        className="brief-room__line"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <button
                          type="button"
                          className="brief-room__line-head"
                          onClick={() => setExpanded(expanded === i ? null : i)}
                        >
                          <span className="type-body-strong">{title}</span>
                          <span className="type-caption">{expanded === i ? '−' : '+'}</span>
                        </button>
                        <p className="type-caption brief-room__line-body">{body}</p>
                        {expanded === i && (
                          <motion.p
                            className="brief-room__why type-caption"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            {why}
                          </motion.p>
                        )}
                      </motion.li>
                    )
                  })}
                </ul>
                {typingIndex >= plan.lines.length && (
                  <MagneticButton href="#contact" variant="primary" className="brief-room__cta">
                    {t.brief.cta}
                  </MagneticButton>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ScrollRevealSection>
  )
}
