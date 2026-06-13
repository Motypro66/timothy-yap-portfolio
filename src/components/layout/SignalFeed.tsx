import { useEffect, useState } from 'react'
import { signalFeedItems } from '../../data/briefPlan'
import { useLanguage } from '../../i18n/LanguageContext'

export default function SignalFeed() {
  const { lang } = useLanguage()
  const items = signalFeedItems[lang]
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const t = window.setInterval(() => setIndex((i) => (i + 1) % items.length), 4200)
    return () => window.clearInterval(t)
  }, [items.length, paused])

  return (
    <div
      className="signal-feed"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-live="polite"
    >
      <span className="signal-feed__label type-label">Signal</span>
      <span className="signal-feed__text type-caption">{items[index]}</span>
      {paused && (
        <span className="signal-feed__hint type-caption">
          {lang === 'zh' ? '悬停暂停' : 'Paused'}
        </span>
      )}
    </div>
  )
}
