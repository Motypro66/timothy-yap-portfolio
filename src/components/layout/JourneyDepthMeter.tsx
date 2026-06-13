import { useCommand } from '../../context/CommandContext'

export default function JourneyDepthMeter() {
  const { journeyProgress, bootComplete, scrollVelocity } = useCommand()

  if (!bootComplete) return null

  const pct = Math.round(journeyProgress * 100)
  const hot = scrollVelocity > 800

  return (
    <div className={`journey-depth ${hot ? 'journey-depth--hot' : ''}`} aria-hidden="true">
      <span className="journey-depth__label type-label">DEPTH</span>
      <div className="journey-depth__track">
        <span className="journey-depth__fill" style={{ height: `${pct}%` }} />
      </div>
      <span className="journey-depth__pct type-caption">{pct}</span>
    </div>
  )
}
