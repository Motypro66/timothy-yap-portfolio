import { languages } from '../../data/resume'
import { useLanguage } from '../../i18n/LanguageContext'
import ScrollRevealSection from '../effects/ScrollRevealSection'
import SectionHeading from '../ui/SectionHeading'
import SkillPill from '../ui/SkillPill'
import GlassCard from '../ui/GlassCard'

export default function Skills() {
  const { t, lang } = useLanguage()

  return (
    <ScrollRevealSection id="skills" className="skills">
      <div className="container">
        <SectionHeading
          eyebrow={t.skills.eyebrow}
          title={t.skills.title}
          subtitle={t.skills.subtitle}
        />

        <div className="skills__grid">
          <GlassCard className="skills__group reveal-item">
            <h3 className="skills__group-title">{t.skills.marketing}</h3>
            <div className="skills__pills">
              {t.skillLabels.marketing.map((s, i) => (
                <SkillPill key={s} label={s} index={i} />
              ))}
            </div>
          </GlassCard>

          <GlassCard className="skills__group reveal-item" delay={0.08}>
            <h3 className="skills__group-title">{t.skills.ai}</h3>
            <div className="skills__pills">
              {t.skillLabels.ai.map((s, i) => (
                <SkillPill key={s} label={s} index={i} />
              ))}
            </div>
          </GlassCard>

          <GlassCard className="skills__group reveal-item" delay={0.12}>
            <h3 className="skills__group-title">{t.skills.languages}</h3>
            <div className="skills__langs">
              {languages.map((langItem) => (
                <div key={langItem.name} className="skills__lang">
                  <span className="skills__lang-name">
                    {lang === 'zh' ? langItem.nameZh : langItem.name}
                  </span>
                  <span className="skills__lang-level">
                    {t.langLevels[langItem.name as keyof typeof t.langLevels]}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="skills__group reveal-item" delay={0.16}>
            <h3 className="skills__group-title">{t.skills.creative}</h3>
            <div className="skills__pills">
              {t.skillLabels.creative.map((s, i) => (
                <SkillPill key={s} label={s} index={i} />
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </ScrollRevealSection>
  )
}
