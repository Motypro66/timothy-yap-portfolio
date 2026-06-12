import { experience } from '../../data/resume'
import ScrollRevealSection from '../effects/ScrollRevealSection'
import SectionHeading from '../ui/SectionHeading'
import GlassCard from '../ui/GlassCard'

export default function Experience() {
  return (
    <ScrollRevealSection id="experience" className="experience">
      <div className="container">
        <SectionHeading
          eyebrow="Experience"
          title="Where I've made impact"
          subtitle="Campaign optimization & live commerce"
        />

        <div className="experience__timeline">
          {experience.map((job, i) => (
            <GlassCard key={job.id} className="experience__card reveal-item" delay={i * 0.1}>
              <div className="experience__header">
                <div>
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
            </GlassCard>
          ))}
        </div>
      </div>
    </ScrollRevealSection>
  )
}
