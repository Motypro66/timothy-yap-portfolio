import { useCommand } from '../../context/CommandContext'

const LINES = 28

export default function JourneySpeedLines() {
  const { journeyProgress, scrollVelocity, bootComplete } = useCommand()

  if (!bootComplete || journeyProgress < 0.02) return null

  const boost = Math.min(1, journeyProgress * 1.8 + scrollVelocity * 0.002)
  const opacity = Math.min(0.85, boost)

  return (
    <div
      className="journey-speed"
      style={{ opacity }}
      aria-hidden="true"
    >
      {Array.from({ length: LINES }, (_, i) => (
        <span
          key={i}
          className="journey-speed__line"
          style={{ ['--i' as string]: i, ['--speed' as string]: `${0.45 + (i % 5) * 0.12}s` }}
        />
      ))}
      <div className="journey-speed__haze" />
    </div>
  )
}
