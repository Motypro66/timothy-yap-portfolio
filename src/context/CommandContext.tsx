import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CampaignNode } from '../data/campaigns'

export type SignalStatus = 'idle' | 'processing' | 'ready'
export type SectionId = 'hero' | 'about' | 'skills' | 'experience' | 'brief' | 'contact'

type CommandContextValue = {
  bootComplete: boolean
  setBootComplete: (v: boolean) => void
  signalStatus: SignalStatus
  setSignalStatus: (s: SignalStatus) => void
  activeSection: SectionId
  setActiveSection: (s: SectionId) => void
  paletteOpen: boolean
  setPaletteOpen: (v: boolean) => void
  highlightCampaigns: boolean
  setHighlightCampaigns: (v: boolean) => void
  logoHovered: boolean
  setLogoHovered: (v: boolean) => void
  journeyProgress: number
  setJourneyProgress: (n: number) => void
  scrollVelocity: number
  setScrollVelocity: (n: number) => void
  pointer: { x: number; y: number }
  selectedCampaign: CampaignNode | null
  setSelectedCampaign: (c: CampaignNode | null) => void
  openPalette: () => void
  closePalette: () => void
}

const CommandContext = createContext<CommandContextValue | null>(null)

const SECTION_IDS: SectionId[] = ['hero', 'about', 'skills', 'experience', 'brief', 'contact']

export function CommandProvider({ children }: { children: ReactNode }) {
  const [bootComplete, setBootComplete] = useState(false)
  const [signalStatus, setSignalStatus] = useState<SignalStatus>('idle')
  const [activeSection, setActiveSection] = useState<SectionId>('hero')
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [highlightCampaigns, setHighlightCampaigns] = useState(false)
  const [logoHovered, setLogoHovered] = useState(false)
  const [journeyProgress, setJourneyProgress] = useState(0)
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignNode | null>(null)

  const openPalette = useCallback(() => setPaletteOpen(true), [])
  const closePalette = useCallback(() => setPaletteOpen(false), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      }
      if (e.key === '/' && !paletteOpen) {
        const tag = (e.target as HTMLElement)?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
        e.preventDefault()
        setPaletteOpen(true)
      }
      if (e.key === 'Escape') setPaletteOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [paletteOpen])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -(e.clientY / window.innerHeight) * 2 + 1
      setPointer({ x: nx, y: ny })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id as SectionId)
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5] },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [bootComplete])

  const value = useMemo(
    () => ({
      bootComplete,
      setBootComplete,
      signalStatus,
      setSignalStatus,
      activeSection,
      setActiveSection,
      paletteOpen,
      setPaletteOpen,
      highlightCampaigns,
      setHighlightCampaigns,
      logoHovered,
      setLogoHovered,
      journeyProgress,
      setJourneyProgress,
      scrollVelocity,
      setScrollVelocity,
      pointer,
      selectedCampaign,
      setSelectedCampaign,
      openPalette,
      closePalette,
    }),
    [
      bootComplete,
      signalStatus,
      activeSection,
      paletteOpen,
      highlightCampaigns,
      logoHovered,
      journeyProgress,
      scrollVelocity,
      pointer,
      selectedCampaign,
      openPalette,
      closePalette,
    ],
  )

  return <CommandContext.Provider value={value}>{children}</CommandContext.Provider>
}

export function useCommand() {
  const ctx = useContext(CommandContext)
  if (!ctx) throw new Error('useCommand must be used within CommandProvider')
  return ctx
}
