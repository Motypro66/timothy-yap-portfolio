import { profile } from '../../data/resume'
import ScrollRevealSection from '../effects/ScrollRevealSection'
import SectionHeading from '../ui/SectionHeading'
import GlassCard from '../ui/GlassCard'

export default function About() {
  return (
    <ScrollRevealSection id="about" className="about">
      <div className="container">
        <SectionHeading
          eyebrow="About"
          title="Data meets creativity"
          subtitle="Performance marketing with measurable impact"
        />

        <div className="about__grid">
          <GlassCard className="about__main reveal-item">
            <p className="about__text">{profile.summary}</p>
          </GlassCard>

          <GlassCard className="about__info reveal-item" delay={0.1}>
            <h3 className="about__info-title">Location</h3>
            <p>{profile.location}</p>
            <h3 className="about__info-title">Focus</h3>
            <p>Google Search · Lead Gen · Conversion Tracking</p>
          </GlassCard>
        </div>
      </div>
    </ScrollRevealSection>
  )
}
