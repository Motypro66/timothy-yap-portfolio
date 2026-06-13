import { useScrollJourney } from './hooks/useScrollJourney'
import { useCommand } from './context/CommandContext'
import { LanguageProvider } from './i18n/LanguageContext'
import { CommandProvider } from './context/CommandContext'
import CommandHud from './components/layout/CommandHud'
import CheckpointRail from './components/layout/CheckpointRail'
import CommandPalette from './components/layout/CommandPalette'
import ScrollProgress from './components/layout/ScrollProgress'
import CampaignCardOverlay from './components/layout/CampaignCardOverlay'
import IntroShowreel from './components/effects/IntroShowreel'
import JourneyCanvas from './components/effects/JourneyCanvas'
import JourneySpeedLines from './components/effects/JourneySpeedLines'
import JourneyDepthMeter from './components/layout/JourneyDepthMeter'
import SectionBeatOverlay from './components/layout/SectionBeatOverlay'
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
  const { introComplete } = useCommand()

  return (
    <div className={`command-shell ${introComplete ? 'command-shell--live' : ''}`}>
      <IntroShowreel />
      <JourneyCanvas />
      <JourneySpeedLines />
      <CommandHud />
      <CheckpointRail />
      <JourneyDepthMeter />
      <SectionBeatOverlay />
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
