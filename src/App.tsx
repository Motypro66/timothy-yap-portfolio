import { useEffect } from 'react'
import { LanguageProvider } from './i18n/LanguageContext'
import { CommandProvider, useCommand } from './context/CommandContext'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import AuroraBackground from './components/effects/AuroraBackground'
import LogoIntro from './components/effects/LogoIntro'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Experience from './components/sections/Experience'
import Contact from './components/sections/Contact'
import './styles/components.css'
import './styles/room-journey.css'
import './styles/aurora.css'

function Portfolio() {
  useSmoothScroll()
  const { setBootComplete } = useCommand()

  // Skip the old dark "system boot" overlay; reveal the warm hero right away.
  useEffect(() => {
    setBootComplete(true)
  }, [setBootComplete])

  return (
    <>
      <AuroraBackground />
      <LogoIntro />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <CommandProvider>
        <Portfolio />
      </CommandProvider>
    </LanguageProvider>
  )
}
