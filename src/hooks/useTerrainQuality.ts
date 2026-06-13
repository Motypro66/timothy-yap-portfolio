import { useEffect, useState } from 'react'

export type TerrainQuality = 'high' | 'medium' | 'low'

function detectQuality(): TerrainQuality {
  if (typeof window === 'undefined') return 'high'
  const w = window.innerWidth
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced || (w < 640 && coarse)) return 'low'
  if (w < 900 || coarse) return 'medium'
  return 'high'
}

export function useTerrainQuality() {
  const [quality, setQuality] = useState<TerrainQuality>(detectQuality)

  useEffect(() => {
    const onResize = () => setQuality(detectQuality())
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return quality
}

export function terrainCounts(quality: TerrainQuality) {
  switch (quality) {
    case 'low':
      return { mountains: 16, stars: 400, particles: 50, nodeSegments: 10 }
    case 'medium':
      return { mountains: 28, stars: 800, particles: 100, nodeSegments: 12 }
    default:
      return { mountains: 48, stars: 1200, particles: 180, nodeSegments: 16 }
  }
}
