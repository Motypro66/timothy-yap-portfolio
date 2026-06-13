import { useCommand } from '../../context/CommandContext'

type Props = {
  className?: string
  size?: number
}

export default function SignalDot({ className = '', size = 6.4 }: Props) {
  const { signalStatus, logoHovered } = useCommand()
  const pulseFast = logoHovered || signalStatus === 'processing'

  return (
    <span
      className={`signal-dot signal-dot--${signalStatus} ${pulseFast ? 'signal-dot--fast' : ''} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  )
}
