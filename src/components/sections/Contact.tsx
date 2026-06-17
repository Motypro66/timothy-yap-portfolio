import { profile } from '../../data/resume'
import { assetUrl } from '../../lib/assetUrl'
import { useLanguage } from '../../i18n/LanguageContext'
import ScrollRevealSection from '../effects/ScrollRevealSection'
import SectionHeading from '../ui/SectionHeading'
import MagneticButton from '../ui/MagneticButton'
import GlassCard from '../ui/GlassCard'
import SocialIcons from '../ui/SocialIcons'

export default function Contact() {
  const { t } = useLanguage()
  const cvUrl = assetUrl(profile.resumePdf)

  return (
    <ScrollRevealSection id="contact" className="contact">
      <div className="container">
        <SectionHeading
          eyebrow={t.contact.eyebrow}
          title={t.contact.title}
          subtitle={t.contact.subtitle}
        />

        <GlassCard className="contact__card reveal-item">
          <div className="contact__grid">
            <div className="contact__item">
              <span className="contact__label type-label">{t.contact.email}</span>
              <a href={`mailto:${profile.email}`} className="contact__value type-body">
                {profile.email}
              </a>
            </div>
            <div className="contact__item">
              <span className="contact__label type-label">{t.contact.phone}</span>
              <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className="contact__value type-body">
                {profile.phone}
              </a>
            </div>
            <div className="contact__item">
              <span className="contact__label type-label">{t.contact.social}</span>
              <SocialIcons
                linkedin={profile.linkedin}
                instagram={profile.instagram || undefined}
                size="lg"
              />
            </div>
            <div className="contact__item">
              <span className="contact__label type-label">{t.contact.location}</span>
              <span className="contact__value type-body">{profile.address}</span>
            </div>
          </div>

          <div className="contact__actions">
            <MagneticButton href={`mailto:${profile.email}`} variant="primary">
              {t.contact.sendEmail}
            </MagneticButton>
            <MagneticButton href={profile.linkedin} variant="secondary">
              {t.contact.viewSocial}
            </MagneticButton>
            <MagneticButton href={cvUrl} variant="ghost">
              {t.nav.downloadCv}
            </MagneticButton>
          </div>
        </GlassCard>
      </div>
    </ScrollRevealSection>
  )
}
