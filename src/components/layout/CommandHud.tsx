import { navLinks, profile } from '../../data/resume'
import { useCommand } from '../../context/CommandContext'
import { useLanguage } from '../../i18n/LanguageContext'
import Logo from '../ui/Logo'
import SignalDot from '../ui/SignalDot'
import SignalFeed from './SignalFeed'

export default function CommandHud() {
  const { activeSection, setLogoHovered, bootComplete, openPalette, introComplete } = useCommand()
  const { t, lang, setLang } = useLanguage()
  const cvUrl = `${import.meta.env.BASE_URL}${profile.resumePdf}`
  const compact = activeSection !== 'hero' && bootComplete

  if (!introComplete) return null

  return (
    <header className={`command-hud ${compact ? 'command-hud--compact' : ''}`}>
      <div className="command-hud__left">
        <a
          href="#hero"
          className="command-hud__logo"
          aria-label={profile.name}
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
        >
          {compact ? (
            <Logo variant="command" iconOnly showSignal={false} />
          ) : (
            <Logo variant="command" showSignal={false} />
          )}
          <SignalDot className="command-hud__signal" />
        </a>
        {!compact && (
          <span className="command-hud__crumb type-caption">
            {activeSection === 'hero' ? 'OVERVIEW' : activeSection.toUpperCase()}
          </span>
        )}
      </div>

      <div className="command-hud__center">
        <SignalFeed />
      </div>

      <div className="command-hud__right">
        <span className="command-hud__live type-label">
          <SignalDot size={5} />
          LIVE · 30
        </span>
        <button type="button" className="command-hud__cmd" onClick={openPalette} title="Ctrl+K">
          ⌘
        </button>
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
        <a href={cvUrl} className="command-hud__link type-caption" download>
          CV
        </a>
        <a href="#contact" className="command-hud__cta type-caption">
          {t.nav.cta}
        </a>
      </div>

      <nav className="command-hud__mobile-nav" aria-label="Mobile">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} className="type-caption">
            {t.nav[link.key]}
          </a>
        ))}
      </nav>
    </header>
  )
}
