import { useEffect } from 'react'
import { useScrollJourney } from './hooks/useScrollJourney'
import { useCommand } from './context/CommandContext'
import { LanguageProvider } from './i18n/LanguageContext'
import { CommandProvider } from './context/CommandContext'
import MinimalHud, { JourneyOverlay } from './components/layout/MinimalHud'
import ScrollProgress from './components/layout/ScrollProgress'
import CorridorScene from './components/effects/CorridorScene'
import LogoIntro from './components/effects/LogoIntro'
import { SECTION_JOURNEY } from './data/journeyPath'
import './styles/components.css'
import './styles/room-journey.css'
import './styles/corridor.css'

function RoomApp() {
  useScrollJourney()
  const { setBootComplete } = useCommand()

  useEffect(() => {
    setBootComplete(true)
  }, [setBootComplete])

  return (
    <div className="room-shell">
      <CorridorScene />
      <LogoIntro />
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
