/** World-space positions for 3D campaign nodes along the scroll journey */
function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 7777) * 10000
  return x - Math.floor(x)
}

export const campaignWorldPositions: { x: number; y: number; z: number }[] = Array.from(
  { length: 30 },
  (_, i) => {
    const r = pseudoRandom(i + 11)
    const row = Math.floor(i / 6)
    return {
      x: (i % 6) * 2.2 - 5.5 + (r - 0.5) * 1.2,
      y: 0.4 + r * 1.8,
      z: -6 - row * 3.5 - r * 2,
    }
  },
)

export type MountainSpec = {
  x: number
  z: number
  height: number
  radius: number
  color: string
}

const PALETTE = ['#8b6914', '#4a7c59', '#3d6b7a', '#6b5344', '#5a8a7a', '#c49a2c']

export const mountainSpecs: MountainSpec[] = Array.from({ length: 48 }, (_, i) => {
  const r = pseudoRandom(i + 99)
  const r2 = pseudoRandom(i + 501)
  return {
    x: (r - 0.5) * 38,
    z: -4 - r2 * 32,
    height: 2 + r * 7,
    radius: 1.2 + r2 * 2.8,
    color: PALETTE[i % PALETTE.length],
  }
})

export function getNearestNodeIndices(fromIndex: number, max = 3, maxDist = 9) {
  const from = campaignWorldPositions[fromIndex]
  return campaignWorldPositions
    .map((p, i) => ({
      i,
      d: Math.hypot(p.x - from.x, p.y - from.y, p.z - from.z),
    }))
    .filter((x) => x.i !== fromIndex && x.d < maxDist)
    .sort((a, b) => a.d - b.d)
    .slice(0, max)
    .map((x) => x.i)
}
