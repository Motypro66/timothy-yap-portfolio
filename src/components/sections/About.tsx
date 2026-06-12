import { profile } from '../../data/resume'
import { useLanguage } from '../../i18n/LanguageContext'
import ScrollRevealSection from '../effects/ScrollRevealSection'
import SectionHeading from '../ui/SectionHeading'
import GlassCard from '../ui/GlassCard'
import PersonIllustration from '../ui/PersonIllustration'
import AboutIllustrations from '../ui/AboutIllustrations'
import SkillPill from '../ui/SkillPill'

export default function About() {
  const { t, lang } = useLanguage()
  const summary = lang === 'zh' ? profile.summaryZh : profile.summary

  return (
    <ScrollRevealSection id="about" className="about">
      <div className="container">
        <SectionHeading
          eyebrow={t.about.eyebrow}
          title={t.about.title}
          subtitle={t.about.subtitle}
        />

        <div className="about__grid">
          <GlassCard className="about__main reveal-item">
            <div className="about__main-inner">
              <div className="about__illus-col">
                <PersonIllustration />
                <AboutIllustrations />
              </div>
              <p className="about__text">{summary}</p>
            </div>
          </GlassCard>

          <div className="about__side">
            <GlassCard className="about__info reveal-item" delay={0.1}>
              <h3 className="about__info-title">{t.about.location}</h3>
              <p>{profile.location}</p>
              <h3 className="about__info-title">{t.about.focus}</h3>
              <p>{t.about.focusValue}</p>
            </GlassCard>

            <GlassCard className="about__interests reveal-item" delay={0.15}>
              <h3 className="about__info-title">{t.about.interests}</h3>
              <div className="about__chips">
                {t.interests.map((item, i) => (
                  <SkillPill key={item} label={item} index={i} />
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </ScrollRevealSection>
  )
}
