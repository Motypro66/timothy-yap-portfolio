import { useCommand } from '../../context/CommandContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { getSectionBeat } from '../../data/journeyPath'

export default function SectionBeatOverlay() {
  const { activeSection, bootComplete, sectionProgress, journeyProgress } = useCommand()
  const { lang } = useLanguage()

  if (!bootComplete) return null

  const local = sectionProgress[activeSection] ?? 0
  const beat = getSectionBeat(activeSection, lang)
  const pct = Math.round(journeyProgress * 100)

  return (
    <div className="section-beat" aria-live="polite">
      <span className="section-beat__depth type-label">{pct}%</span>
      <span className="section-beat__line" style={{ transform: `scaleX(${0.35 + local * 0.65})` }} />
      <span className="section-beat__label type-label">{beat}</span>
    </div>
  )
}
