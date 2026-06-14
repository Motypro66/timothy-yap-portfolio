import { useEffect } from 'react'
import { preloadParticlesEngine } from './lib/preloadParticles'
import { LanguageProvider } from './i18n/LanguageContext'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import LogoIntro from './components/effects/LogoIntro'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Experience from './components/sections/Experience'
import Contact from './components/sections/Contact'
import './styles/components.css'
import './styles/logo-intro.css'
import './styles/floating-orbs.css'
import './styles/polish.css'

export default function App() {
  useSmoothScroll()

  useEffect(() => {
    preloadParticlesEngine()
  }, [])

  return (
    <LanguageProvider>
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
    </LanguageProvider>
  )
}
