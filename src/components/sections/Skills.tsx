import { languages } from '../../data/resume'
import { useLanguage } from '../../i18n/LanguageContext'
import ScrollRevealSection from '../effects/ScrollRevealSection'
import SectionHeading from '../ui/SectionHeading'
import SkillPill from '../ui/SkillPill'
import GlassCard from '../ui/GlassCard'

const skillGroups = [
  { key: 'marketing' as const, featured: true, descEn: 'Campaigns, tracking & optimization', descZh: '广告投放、追踪与优化' },
  { key: 'ai' as const, featured: true, descEn: 'Workflows & AI-assisted production', descZh: '工作流与 AI 辅助制作' },
  { key: 'languages' as const, featured: false, descEn: 'Communication', descZh: '语言沟通' },
  { key: 'creative' as const, featured: false, descEn: 'Visual & video content', descZh: '视觉与视频内容' },
] as const

type SkillLabelKey = keyof (typeof import('../../i18n/translations'))['translations']['en']['skillLabels']

type FeaturedSkillGroup = (typeof skillGroups)[number] & { key: Extract<SkillLabelKey, 'marketing' | 'ai'> }

function isFeaturedSkillGroup(
  group: (typeof skillGroups)[number],
): group is FeaturedSkillGroup {
  return group.featured && (group.key === 'marketing' || group.key === 'ai')
}

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

        <div className="skills__layout">
          <div className="skills__featured">
            {skillGroups
              .filter(isFeaturedSkillGroup)
              .map((group, i) => (
                <GlassCard
                  key={group.key}
                  className={`skills__group skills__group--featured reveal-item`}
                  delay={i * 0.08}
                >
                  <div className="skills__group-head">
                    <span className="skills__group-index">0{i + 1}</span>
                    <div>
                      <h3 className="skills__group-title">{t.skills[group.key]}</h3>
                      <p className="skills__group-desc">
                        {lang === 'zh' ? group.descZh : group.descEn}
                      </p>
                    </div>
                  </div>
                  <div className="skills__pills">
                    {t.skillLabels[group.key].map((s: string, idx: number) => (
                      <SkillPill key={s} label={s} index={idx} />
                    ))}
                  </div>
                </GlassCard>
              ))}
          </div>

          <div className="skills__secondary">
            {skillGroups
              .filter((g) => !g.featured)
              .map((group, i) => (
                <GlassCard
                  key={group.key}
                  className="skills__group skills__group--compact reveal-item"
                  delay={0.16 + i * 0.08}
                >
                  <h3 className="skills__group-title skills__group-title--compact">
                    {t.skills[group.key]}
                  </h3>
                  <p className="skills__group-desc skills__group-desc--compact">
                    {lang === 'zh' ? group.descZh : group.descEn}
                  </p>

                  {group.key === 'languages' ? (
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
                  ) : (
                    <div className="skills__pills skills__pills--compact">
                      {t.skillLabels.creative.map((s, idx) => (
                        <SkillPill key={s} label={s} index={idx} />
                      ))}
                    </div>
                  )}
                </GlassCard>
              ))}
          </div>
        </div>
      </div>
    </ScrollRevealSection>
  )
}
