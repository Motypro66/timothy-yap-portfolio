import { useEffect } from 'react'
import { useScrollJourney } from './hooks/useScrollJourney'
import { useCommand } from './context/CommandContext'
import { LanguageProvider } from './i18n/LanguageContext'
import { CommandProvider } from './context/CommandContext'
import MinimalHud, { JourneyOverlay } from './components/layout/MinimalHud'
import ScrollProgress from './components/layout/ScrollProgress'
import RoomCanvas from './components/effects/RoomCanvas'
import { SECTION_JOURNEY } from './data/journeyPath'
import './styles/components.css'
import './styles/room-journey.css'

function RoomApp() {
  useScrollJourney()
  const { setBootComplete } = useCommand()

  useEffect(() => {
    const t = window.setTimeout(() => setBootComplete(true), 400)
    return () => window.clearTimeout(t)
  }, [setBootComplete])

  return (
    <div className="room-shell">
      <RoomCanvas />
      <MinimalHud />
      <JourneyOverlay />
      <ScrollProgress />
      <main className="journey-scroll">
        {SECTION_JOURNEY.map(({ id }) => (
          <section key={id} id={id} className="journey-anchor journey-station" aria-label={id}>
            <div className="journey-station__inner" />
          </section>
        ))}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <CommandProvider>
        <RoomApp />
      </CommandProvider>
    </LanguageProvider>
  )
}
