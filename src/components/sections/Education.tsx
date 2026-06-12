import { education } from '../../data/resume'
import ScrollRevealSection from '../effects/ScrollRevealSection'
import SectionHeading from '../ui/SectionHeading'
import GlassCard from '../ui/GlassCard'

export default function Education() {
  return (
    <ScrollRevealSection id="education" className="education">
      <div className="container">
        <SectionHeading
          eyebrow="Education"
          title="Academic foundation"
        />

        <GlassCard className="education__card reveal-item">
          <div className="education__header">
            <div>
              <h3 className="education__degree">{education.degree}</h3>
              <p className="education__school">{education.school}</p>
            </div>
            <span className="education__period">{education.period}</span>
          </div>

          <div className="education__stats">
            <div className="education__stat">
              <span className="education__stat-value">{education.cgpa}</span>
              <span className="education__stat-label">CGPA</span>
            </div>
            <div className="education__stat education__stat--award">
              <span className="education__stat-value">🏆</span>
              <span className="education__stat-label">{education.achievement}</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </ScrollRevealSection>
  )
}
