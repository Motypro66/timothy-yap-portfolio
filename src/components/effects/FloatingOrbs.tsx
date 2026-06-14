/**
 * Soft floating orbs on the hero's right side — a CSS/GPU version of the old
 * react-three-fiber orbs. Same warm look, but no three.js (keeps the bundle
 * light and the page smooth, especially on mobile where these are hidden).
 */
export default function FloatingOrbs() {
  return (
    <div className="floating-orbs floating-orbs--side" aria-hidden="true">
      <span className="fo-orb fo-orb--sun" />
      <span className="fo-orb fo-orb--peach" />
      <span className="fo-orb fo-orb--sky" />
      <span className="fo-orb fo-orb--coral" />
    </div>
  )
}
