'use client'

import { useEffect } from 'react'
import { preloadParticlesEngine } from './lib/preloadParticles'
import { LOGO_INTRO_COMPLETE } from './hooks/useIntroComplete'
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
import ScrollToTop from './components/ui/ScrollToTop'

export default function App() {
  useSmoothScroll()

  useEffect(() => {
    const preload = () => {
      void preloadParticlesEngine()
    }
    window.addEventListener(LOGO_INTRO_COMPLETE, preload, { once: true })
    const fallback = window.setTimeout(preload, 4500)
    return () => {
      window.removeEventListener(LOGO_INTRO_COMPLETE, preload)
      window.clearTimeout(fallback)
    }
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
      <ScrollToTop />
    </LanguageProvider>
  )
}
