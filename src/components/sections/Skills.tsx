import { skills } from '../../data/resume'
import ScrollRevealSection from '../effects/ScrollRevealSection'
import SectionHeading from '../ui/SectionHeading'
import SkillPill from '../ui/SkillPill'
import GlassCard from '../ui/GlassCard'

export default function Skills() {
  return (
    <ScrollRevealSection id="skills" className="skills">
      <div className="container">
        <SectionHeading
          eyebrow="Skills"
          title="Tools & expertise"
          subtitle="From campaign management to creative production"
        />

        <div className="skills__grid">
          <GlassCard className="skills__group reveal-item">
            <h3 className="skills__group-title">Marketing & Analytics</h3>
            <div className="skills__pills">
              {skills.marketing.map((s, i) => (
                <SkillPill key={s} label={s} index={i} />
              ))}
            </div>
          </GlassCard>

          <GlassCard className="skills__group reveal-item" delay={0.1}>
            <h3 className="skills__group-title">Languages</h3>
            <div className="skills__langs">
              {skills.languages.map((lang) => (
                <div key={lang.name} className="skills__lang">
                  <span className="skills__lang-name">{lang.name}</span>
                  <span className="skills__lang-level">{lang.level}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="skills__group reveal-item" delay={0.2}>
            <h3 className="skills__group-title">Creative</h3>
            <div className="skills__pills">
              {skills.creative.map((s, i) => (
                <SkillPill key={s} label={s} index={i} />
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </ScrollRevealSection>
  )
}
