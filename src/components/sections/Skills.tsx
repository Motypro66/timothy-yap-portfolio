import { languages } from '../../data/resume'
import { useLanguage } from '../../i18n/LanguageContext'
import ScrollRevealSection from '../effects/ScrollRevealSection'
import SectionHeading from '../ui/SectionHeading'
import SkillPill from '../ui/SkillPill'
import GlassCard from '../ui/GlassCard'
import SkillIllustrations from '../ui/SkillIllustrations'
import { getSkillHint } from '../../data/skillHints'

const skillGroups = [
  { key: 'marketing' as const, num: '01', descEn: 'Campaigns, tracking and optimization', descZh: '广告投放、追踪与优化' },
  { key: 'ai' as const, num: '02', descEn: 'Workflows and AI-assisted production', descZh: '工作流与 AI 辅助制作' },
  { key: 'languages' as const, num: '03', descEn: 'Communication', descZh: '语言沟通' },
  { key: 'creative' as const, num: '04', descEn: 'Visual and video content', descZh: '视觉与视频内容' },
] as const

export default function Skills() {
  const { t, lang } = useLanguage()

  return (
    <ScrollRevealSection id="skills" className="skills command-section">
      <div className="container">
        <SectionHeading
          eyebrow={t.skills.eyebrow}
          title={t.skills.title}
          subtitle={t.skills.subtitle}
        />

        <div className="skills__grid-unified">
          {skillGroups.map((group, i) => (
            <GlassCard
              key={group.key}
              className="skills__group skills__group--unified reveal-item"
              delay={i * 0.07}
            >
              <div className="skills__group-head">
                <span className="skills__group-index">{group.num}</span>
                <div>
                  <h3 className="skills__group-title type-display">{t.skills[group.key]}</h3>
                  <p className="skills__group-desc type-body">
                    {lang === 'zh' ? group.descZh : group.descEn}
                  </p>
                </div>
              </div>

              <div className="skills__card-body">
                {group.key === 'languages' ? (
                  <div className="skills__langs">
                    {languages.map((langItem) => (
                      <div key={langItem.name} className="skills__lang">
                        <span className="skills__lang-name type-body-strong">
                          {lang === 'zh' ? langItem.nameZh : langItem.name}
                        </span>
                        <span className="skills__lang-level type-caption">
                          {t.langLevels[langItem.name as keyof typeof t.langLevels]}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="skills__pills">
                    {t.skillLabels[group.key].map((s: string, idx: number) => (
                      <SkillPill
                        key={s}
                        label={s}
                        index={idx}
                        backText={
                          group.key === 'marketing' || group.key === 'ai'
                            ? getSkillHint(s, lang)
                            : undefined
                        }
                      />
                    ))}
                  </div>
                )}
                <SkillIllustrations variant={group.key} />
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </ScrollRevealSection>
  )
}
