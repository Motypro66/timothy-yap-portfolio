import { useEffect, useState } from 'react'
import SignalDot from '../ui/SignalDot'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      setProgress(max > 0 ? doc.scrollTop / max : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress__track">
        <div className="scroll-progress__fill" style={{ height: `${progress * 100}%` }} />
        <div className="scroll-progress__thumb" style={{ top: `${progress * 100}%` }}>
          <SignalDot size={10} />
        </div>
      </div>
    </div>
  )
}
