type Variant = 'marketing' | 'ai' | 'languages' | 'creative'

type Props = {
  variant: Variant
}

type IconSet = () => React.ReactElement

function MarketingIcons() {
  return (
    <>
      <svg viewBox="0 0 56 56" fill="none" className="skill-mini">
        <path d="M10 40V28M22 40V18M34 40V24M46 40V12" stroke="#f5a623" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="46" cy="12" r="3" fill="#ff8c69" />
      </svg>
      <svg viewBox="0 0 56 56" fill="none" className="skill-mini">
        <circle cx="28" cy="28" r="14" stroke="#e8a838" strokeWidth="2.5" fill="rgba(232,168,56,0.08)" />
        <circle cx="28" cy="28" r="7" stroke="#e8a838" strokeWidth="2.5" />
        <circle cx="28" cy="28" r="2.5" fill="#f5a623" />
      </svg>
      <svg viewBox="0 0 56 56" fill="none" className="skill-mini">
        <circle cx="24" cy="24" r="10" stroke="#ff8c69" strokeWidth="2.5" />
        <path d="M32 32l10 10" stroke="#ff8c69" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <svg viewBox="0 0 56 56" fill="none" className="skill-mini">
        <path d="M10 38l12-14 8 8 16-20" stroke="#ffd166" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M38 12h8v8" stroke="#ffd166" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </>
  )
}

function AiIcons() {
  return (
    <>
      <svg viewBox="0 0 56 56" fill="none" className="skill-mini">
        <path d="M28 8l4 12 12 4-12 4-4 12-4-12-12-4 12-4 4-12z" stroke="#ffd166" strokeWidth="2.2" fill="rgba(255,209,102,0.15)" strokeLinejoin="round" />
      </svg>
      <svg viewBox="0 0 56 56" fill="none" className="skill-mini">
        <circle cx="16" cy="20" r="4" fill="#e8a838" />
        <circle cx="40" cy="16" r="4" fill="#f5a623" />
        <circle cx="32" cy="40" r="4" fill="#ff8c69" />
        <path d="M19 22l18-4M20 24l10 12M36 20l-2 16" stroke="#e8a838" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      </svg>
      <svg viewBox="0 0 56 56" fill="none" className="skill-mini">
        <rect x="10" y="14" width="28" height="20" rx="6" stroke="#f5a623" strokeWidth="2.5" fill="rgba(245,166,35,0.08)" />
        <circle cx="18" cy="24" r="1.8" fill="#3d2e2a" />
        <circle cx="24" cy="24" r="1.8" fill="#3d2e2a" />
        <circle cx="30" cy="24" r="1.8" fill="#3d2e2a" />
        <path d="M38 22l8-4v16l-8-4" stroke="#f5a623" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
      <svg viewBox="0 0 56 56" fill="none" className="skill-mini">
        <path d="M28 10v12M28 34v12M18 28h-8M46 28h-8" stroke="#ff8c69" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="28" cy="28" r="8" stroke="#ff8c69" strokeWidth="2.5" fill="rgba(255,140,105,0.12)" />
      </svg>
    </>
  )
}

function LanguageIcons() {
  return (
    <>
      <svg viewBox="0 0 56 56" fill="none" className="skill-mini">
        <circle cx="28" cy="28" r="16" stroke="#e8a838" strokeWidth="2.5" fill="rgba(232,168,56,0.08)" />
        <ellipse cx="28" cy="28" rx="7" ry="16" stroke="#e8a838" strokeWidth="2" />
        <path d="M12 28h32M14 20h28M14 36h28" stroke="#e8a838" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
      </svg>
      <svg viewBox="0 0 56 56" fill="none" className="skill-mini">
        <path d="M12 18c6 0 10 4 10 10s-4 10-10 10" stroke="#f5a623" strokeWidth="2.5" strokeLinecap="round" fill="rgba(245,166,35,0.08)" />
        <path d="M44 18c-6 0-10 4-10 10s4 10 10 10" stroke="#ff8c69" strokeWidth="2.5" strokeLinecap="round" fill="rgba(255,140,105,0.08)" />
      </svg>
      <svg viewBox="0 0 56 56" fill="none" className="skill-mini">
        <rect x="12" y="16" width="32" height="22" rx="6" stroke="#ffd166" strokeWidth="2.5" fill="rgba(255,209,102,0.1)" />
        <path d="M20 26h16M20 32h10" stroke="#ffd166" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      <svg viewBox="0 0 56 56" fill="none" className="skill-mini">
        <path d="M18 36l8-24M38 36l-8-24" stroke="#e8a838" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M22 28h12" stroke="#f5a623" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </>
  )
}

function CreativeIcons() {
  return (
    <>
      <svg viewBox="0 0 56 56" fill="none" className="skill-mini">
        <rect x="8" y="16" width="40" height="28" rx="4" stroke="#e8a838" strokeWidth="2.5" fill="rgba(232,168,56,0.08)" />
        <circle cx="28" cy="30" r="8" stroke="#e8a838" strokeWidth="2.5" />
        <path d="M18 16l6-8h8l6 8" stroke="#e8a838" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <svg viewBox="0 0 56 56" fill="none" className="skill-mini">
        <rect x="10" y="12" width="36" height="32" rx="4" stroke="#f5a623" strokeWidth="2.5" fill="rgba(245,166,35,0.08)" />
        <path d="M10 20h36M22 20v24" stroke="#f5a623" strokeWidth="2" />
        <circle cx="34" cy="30" r="4" fill="#ff8c69" />
      </svg>
      <svg viewBox="0 0 56 56" fill="none" className="skill-mini">
        <path d="M12 40l10-14 8 10 6-8 8 12" stroke="#ff8c69" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="42" cy="18" r="5" stroke="#ffd166" strokeWidth="2.5" fill="rgba(255,209,102,0.2)" />
      </svg>
      <svg viewBox="0 0 56 56" fill="none" className="skill-mini">
        <rect x="14" y="10" width="28" height="36" rx="6" stroke="#ffd166" strokeWidth="2.5" fill="rgba(255,209,102,0.1)" />
        <path d="M22 42h12" stroke="#ffd166" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="28" cy="22" r="6" stroke="#f5a623" strokeWidth="2" />
      </svg>
    </>
  )
}

const icons: Record<Variant, IconSet> = {
  marketing: MarketingIcons,
  ai: AiIcons,
  languages: LanguageIcons,
  creative: CreativeIcons,
}

export default function SkillIllustrations({ variant }: Props) {
  const Icons = icons[variant]

  return (
    <div className="skill-mini-wrap" aria-hidden="true">
      <Icons />
    </div>
  )
}
