import { profile } from '../../data/resume'
import { useLanguage } from '../../i18n/LanguageContext'
import Logo from '../ui/Logo'
import SocialIcons from '../ui/SocialIcons'

export default function Footer() {
  const year = new Date().getFullYear()
  const { t } = useLanguage()

  return (
    <footer className="footer footer--command">
      <div className="container footer__inner">
        <div className="footer__stamp">
          <Logo variant="command" iconOnly showSignal={false} className="footer__logo" />
          <div>
            <p className="footer__operator type-label">{t.footer.operator}</p>
            <p className="footer__copy type-caption">
              © {year} {profile.fullName}
            </p>
          </div>
        </div>
        <div className="footer__links">
          <span className="footer__built type-caption">{t.footer.built}</span>
          <a href={`mailto:${profile.email}`} className="type-caption">
            {t.footer.email}
          </a>
          <SocialIcons linkedin={profile.linkedin} instagram={profile.instagram || undefined} />
        </div>
      </div>
    </footer>
  )
}
