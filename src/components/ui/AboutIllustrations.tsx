export default function AboutIllustrations() {
  return (
    <div className="about-mini-wrap" aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="none" className="about-mini about-mini--chart">
        <path d="M8 36V22M20 36V14M32 36V26M44 36V8" stroke="#f5a623" strokeWidth="3" strokeLinecap="round" />
        <circle cx="44" cy="8" r="3" fill="#ff8c69" />
      </svg>
      <svg viewBox="0 0 48 48" fill="none" className="about-mini about-mini--camera">
        <rect x="6" y="14" width="36" height="24" rx="4" stroke="#e8a838" strokeWidth="2.5" fill="rgba(232,168,56,0.1)" />
        <circle cx="24" cy="26" r="7" stroke="#e8a838" strokeWidth="2.5" />
        <path d="M16 14L20 8H28L32 14" stroke="#e8a838" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <svg viewBox="0 0 48 48" fill="none" className="about-mini about-mini--coffee">
        <path d="M10 18h22v16c0 4-3 6-8 6H18c-5 0-8-2-8-6V18z" stroke="#ff8c69" strokeWidth="2.5" fill="rgba(255,140,105,0.08)" />
        <path d="M32 22h4c3 0 5 2 5 5s-2 5-5 5h-4" stroke="#ff8c69" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M14 12c0-2 2-4 4-4" stroke="#ffd166" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <svg viewBox="0 0 48 48" fill="none" className="about-mini about-mini--spark">
        <path d="M24 6l3 12 12 3-12 3-3 12-3-12-12-3 12-3 3-12z" stroke="#ffd166" strokeWidth="2" fill="rgba(255,209,102,0.15)" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
