import { useCommand, type SectionId } from '../../context/CommandContext'
import { useLanguage } from '../../i18n/LanguageContext'
import SignalDot from '../ui/SignalDot'

const sectionIds: SectionId[] = ['hero', 'about', 'skills', 'experience', 'brief', 'contact']

export default function CheckpointRail() {
  const { activeSection } = useCommand()
  const { t } = useLanguage()

  const labelFor = (id: SectionId) => {
    if (id === 'hero') return 'Ops'
    if (id === 'brief') return t.nav.brief
    return t.nav[id as keyof typeof t.nav] ?? id
  }

  return (
    <nav className="checkpoint-rail" aria-label="Section checkpoints">
      {sectionIds.map((id) => {
        const link = id === 'hero' ? '#hero' : `#${id}`
        const active = activeSection === id
        return (
          <a
            key={id}
            href={link}
            className={`checkpoint-rail__item ${active ? 'checkpoint-rail__item--active' : ''}`}
            aria-current={active ? 'true' : undefined}
          >
            <span className="checkpoint-rail__dot">
              {active ? <SignalDot size={8} /> : <span className="checkpoint-rail__ring" />}
            </span>
            <span className="checkpoint-rail__label type-caption">{labelFor(id)}</span>
          </a>
        )
      })}
    </nav>
  )
}
