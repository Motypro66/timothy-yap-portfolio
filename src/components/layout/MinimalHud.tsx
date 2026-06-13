import { profile } from '../../data/resume'
import { useCommand, type SectionId } from '../../context/CommandContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { getSectionBeat } from '../../data/journeyPath'
import Logo from '../ui/Logo'
import MagneticButton from '../ui/MagneticButton'

const SECTIONS: SectionId[] = ['hero', 'about', 'skills', 'experience', 'contact']

export default function MinimalHud() {
  const { activeSection } = useCommand()
  const { t, lang, setLang } = useLanguage()
  const cvUrl = `${import.meta.env.BASE_URL}${profile.resumePdf}`

  const label = (id: SectionId) => {
    if (id === 'hero') return 'Home'
    return t.nav[id as keyof typeof t.nav] ?? id
  }

  return (
    <>
      <header className="minimal-hud">
        <a href="#hero" className="minimal-hud__brand" aria-label={profile.name}>
          <Logo variant="dark" showSignal />
        </a>
        <div className="minimal-hud__actions">
          <div className="lang-toggle lang-toggle--cmd" role="group" aria-label="Language">
            <button
              type="button"
              className={`lang-toggle__btn ${lang === 'en' ? 'lang-toggle__btn--active' : ''}`}
              onClick={() => setLang('en')}
            >
              EN
            </button>
            <button
              type="button"
              className={`lang-toggle__btn ${lang === 'zh' ? 'lang-toggle__btn--active' : ''}`}
              onClick={() => setLang('zh')}
            >
              中文
            </button>
          </div>
          <a href={cvUrl} className="minimal-hud__link type-caption" download>
            CV
          </a>
        </div>
      </header>

      <nav className="minimal-rail" aria-label="Sections">
        {SECTIONS.map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className={`minimal-rail__item ${activeSection === id ? 'minimal-rail__item--active' : ''}`}
          >
            <span className="minimal-rail__dot" />
            <span className="minimal-rail__label type-caption">{label(id)}</span>
          </a>
        ))}
      </nav>
    </>
  )
}

export function JourneyOverlay() {
  const { activeSection, sectionProgress, bootComplete, journeyProgress } = useCommand()
  const { lang } = useLanguage()

  if (!bootComplete) return null

  const local = sectionProgress[activeSection] ?? 0
  const opacity =
    activeSection === 'hero' && journeyProgress < 0.08
      ? 1
      : Math.min(1, Math.max(0.55, local * 1.15))
  const beat = getSectionBeat(activeSection, lang)

  return (
    <div className="journey-overlay" style={{ opacity }}>
      <p className="journey-overlay__beat type-label">{beat}</p>
      <div className="journey-overlay__body">
        <OverlayBody section={activeSection} />
      </div>
    </div>
  )
}

function OverlayBody({ section }: { section: SectionId }) {
  const { t, lang } = useLanguage()
  if (section === 'hero') {
    return (
      <>
        <h1 className="journey-overlay__title type-display">{profile.displayName}</h1>
        <p className="journey-overlay__role type-body-strong">
          {lang === 'zh' ? profile.titleZh : profile.title}
        </p>
        <p className="journey-overlay__line type-body">{t.hero.tagline}</p>
        <div className="journey-overlay__actions">
          <MagneticButton href="#about" variant="primary">
            {t.hero.viewExperience}
          </MagneticButton>
          <MagneticButton href="#contact" variant="secondary">
            {t.nav.cta}
          </MagneticButton>
        </div>
        <p className="journey-overlay__hint type-caption">{t.hero.journeyHint}</p>
      </>
    )
  }

  if (section === 'about') {
    return (
      <>
        <h2 className="journey-overlay__title type-display">{t.about.title}</h2>
        <p className="journey-overlay__line type-body">
          {lang === 'zh' ? profile.summaryZh : profile.summary}
        </p>
      </>
    )
  }

  if (section === 'skills') {
    return (
      <>
        <h2 className="journey-overlay__title type-display">{t.skills.title}</h2>
        <p className="journey-overlay__line type-body">{t.skills.subtitle}</p>
      </>
    )
  }

  if (section === 'experience') {
    return (
      <>
        <h2 className="journey-overlay__title type-display">{t.experience.title}</h2>
        <p className="journey-overlay__line type-body">{t.experience.subtitle}</p>
      </>
    )
  }

  return (
    <>
      <h2 className="journey-overlay__title type-display">{t.contact.title}</h2>
      <p className="journey-overlay__line type-body">{t.contact.subtitle}</p>
      <div className="journey-overlay__actions">
        <MagneticButton href={`mailto:${profile.email}`} variant="primary">
          {profile.email}
        </MagneticButton>
        <MagneticButton href={profile.linkedin} variant="secondary">
          LinkedIn
        </MagneticButton>
      </div>
    </>
  )
}
