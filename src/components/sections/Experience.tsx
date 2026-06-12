import { jobIds } from '../../data/resume'
import { useLanguage } from '../../i18n/LanguageContext'
import ScrollRevealSection from '../effects/ScrollRevealSection'
import SectionHeading from '../ui/SectionHeading'
import GlassCard from '../ui/GlassCard'

export default function Experience() {
  const { t } = useLanguage()

  return (
    <ScrollRevealSection id="experience" className="experience">
      <div className="container">
        <SectionHeading
          eyebrow={t.experience.eyebrow}
          title={t.experience.title}
          subtitle={t.experience.subtitle}
        />

        <div className="experience__timeline">
          {jobIds.map((id, i) => {
            const job = t.jobs[id]
            const isCurrent = i === 0

            return (
              <GlassCard
                key={id}
                className={`experience__card reveal-item ${isCurrent ? 'experience__card--current' : ''}`}
                delay={i * 0.1}
              >
                <div className="experience__card-inner">
                  <div className="experience__marker" aria-hidden="true">
                    <span className="experience__marker-dot" />
                  </div>

                  <div className="experience__body">
                    <div className="experience__header">
                      <div className="experience__header-main">
                        <span className="experience__eyebrow">
                          {isCurrent ? t.experience.currentRole : t.experience.pastRole}
                        </span>
                        <h3 className="experience__role">{job.role}</h3>
                        <p className="experience__company">{job.company}</p>
                      </div>
                      <span className="experience__period">{job.period}</span>
                    </div>

                    <ul className="experience__list">
                      {job.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>

                    <div className="experience__tags">
                      {job.tags.map((tag) => (
                        <span key={tag} className="experience__tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>
      </div>
    </ScrollRevealSection>
  )
}
