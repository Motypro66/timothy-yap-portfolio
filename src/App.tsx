import { useScrollJourney } from './hooks/useScrollJourney'
import { LanguageProvider } from './i18n/LanguageContext'
import { CommandProvider } from './context/CommandContext'
import CommandHud from './components/layout/CommandHud'
import CheckpointRail from './components/layout/CheckpointRail'
import CommandPalette from './components/layout/CommandPalette'
import ScrollProgress from './components/layout/ScrollProgress'
import CampaignCardOverlay from './components/layout/CampaignCardOverlay'
import JourneyCanvas from './components/effects/JourneyCanvas'
import JourneySpeedLines from './components/effects/JourneySpeedLines'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Experience from './components/sections/Experience'
import BriefRoom from './components/sections/BriefRoom'
import Contact from './components/sections/Contact'
import './styles/components.css'
import './styles/command.css'

function CommandApp() {
  useScrollJourney()

  return (
    <div className="command-shell">
      <JourneyCanvas />
      <JourneySpeedLines />
      <CommandHud />
      <CheckpointRail />
      <ScrollProgress />
      <CommandPalette />
      <CampaignCardOverlay />
      <main className="command-main">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <BriefRoom />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <CommandProvider>
        <CommandApp />
      </CommandProvider>
    </LanguageProvider>
  )
}
