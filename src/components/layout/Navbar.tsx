import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { navLinks, profile } from '../../data/resume'
import { useLanguage } from '../../i18n/LanguageContext'
import { useIntroStages } from '../../hooks/useIntroStages'
import { useIntroComplete } from '../../hooks/useIntroComplete'
import Logo from '../ui/Logo'

export default function Navbar() {
  const { uiReady } = useIntroStages()
  const introComplete = useIntroComplete()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { t, lang, setLang } = useLanguage()
  const cvUrl = `${import.meta.env.BASE_URL}${profile.resumePdf}`

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      initial={{ y: 0, opacity: 0 }}
      animate={uiReady ? { y: 0, opacity: 1 } : { y: 0, opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container navbar__inner">
        <a href="#" className="navbar__logo-link" aria-label={profile.name}>
          <Logo variant="dark" showSun={introComplete} />
        </a>

        <nav className="navbar__nav" aria-label="Main">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="navbar__link">
              {t.nav[link.key]}
            </a>
          ))}
        </nav>

        <div className="navbar__actions">
          <div className="lang-toggle" role="group" aria-label="Language">
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
          <a href={cvUrl} className="navbar__cv" download>
            {t.nav.downloadCv}
          </a>
          <a href="#contact" className="navbar__cta">
            {t.nav.cta}
          </a>
        </div>

        <button
          className="navbar__burger"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="navbar__mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                {t.nav[link.key]}
              </a>
            ))}
            <a href={cvUrl} download onClick={() => setMenuOpen(false)}>
              {t.nav.downloadCv}
            </a>
            <div className="lang-toggle lang-toggle--mobile">
              <button type="button" className={lang === 'en' ? 'lang-toggle__btn--active' : ''} onClick={() => setLang('en')}>EN</button>
              <button type="button" className={lang === 'zh' ? 'lang-toggle__btn--active' : ''} onClick={() => setLang('zh')}>中文</button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
