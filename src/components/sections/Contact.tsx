import { profile } from '../../data/resume'
import ScrollRevealSection from '../effects/ScrollRevealSection'
import SectionHeading from '../ui/SectionHeading'
import MagneticButton from '../ui/MagneticButton'
import GlassCard from '../ui/GlassCard'

export default function Contact() {
  return (
    <ScrollRevealSection id="contact" className="contact">
      <div className="container">
        <SectionHeading
          eyebrow="Contact"
          title="Let's connect"
          subtitle="Open to performance marketing roles in KL and remote"
        />

        <GlassCard className="contact__card reveal-item">
          <div className="contact__grid">
            <div className="contact__item">
              <span className="contact__label">Email</span>
              <a href={`mailto:${profile.email}`} className="contact__value">
                {profile.email}
              </a>
            </div>
            <div className="contact__item">
              <span className="contact__label">Phone</span>
              <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className="contact__value">
                {profile.phone}
              </a>
            </div>
            <div className="contact__item">
              <span className="contact__label">Location</span>
              <span className="contact__value">{profile.address}</span>
            </div>
          </div>

          <div className="contact__actions">
            <MagneticButton href={`mailto:${profile.email}`} variant="primary">
              Send Email
            </MagneticButton>
            <MagneticButton href={profile.github} variant="secondary">
              View GitHub
            </MagneticButton>
          </div>
        </GlassCard>
      </div>
    </ScrollRevealSection>
  )
}
