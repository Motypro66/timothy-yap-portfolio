import * as THREE from 'three'
import type { SectionId } from '../context/CommandContext'

export type CameraKeyframe = {
  t: number
  section: SectionId
  pos: THREE.Vector3
  target: THREE.Vector3
  fov: number
  fogNear: number
  fogFar: number
  fogColor: string
}

const k = (
  t: number,
  section: SectionId,
  pos: [number, number, number],
  target: [number, number, number],
  fov: number,
  fogNear = 14,
  fogFar = 42,
  fogColor = '#070b12',
): CameraKeyframe => ({
  t,
  section,
  pos: new THREE.Vector3(...pos),
  target: new THREE.Vector3(...target),
  fov,
  fogNear,
  fogFar,
  fogColor,
})

export const JOURNEY_KEYFRAMES: CameraKeyframe[] = [
  k(0, 'hero', [0, 24, 44], [0, 2, 4], 68),
  k(0.1, 'hero', [0, 19, 34], [0, 1.5, -2], 62),
  k(0.2, 'hero', [5, 15, 24], [2, 1, -8], 58, 12, 40),

  k(0.2, 'about', [5, 15, 24], [2, 1, -8], 58),
  k(0.28, 'about', [-4, 11, 18], [-1, 0.6, -12], 54, 12, 38, '#081018'),
  k(0.34, 'about', [-2, 8, 14], [0, 0.4, -16], 50, 11, 36, '#081018'),

  k(0.34, 'skills', [-2, 8, 14], [0, 0.4, -16], 50),
  k(0.42, 'skills', [6, 6.5, 10], [3, 0.2, -18], 48, 10, 34, '#071018'),
  k(0.48, 'skills', [3, 5, 8], [1, 0, -20], 46, 10, 32, '#071018'),

  k(0.48, 'experience', [3, 5, 8], [1, 0, -20], 46),
  k(0.56, 'experience', [-5, 4, 5], [-2, 0, -22], 44, 9, 30, '#060e16'),
  k(0.62, 'experience', [-1, 3, 3.5], [0, 0, -24], 42, 9, 28, '#060e16'),

  k(0.62, 'brief', [-1, 3, 3.5], [0, 0, -24], 42),
  k(0.72, 'brief', [4, 2.5, 2], [2, 0, -26], 40, 8, 26, '#050c14'),
  k(0.78, 'brief', [0, 2, 1], [0, 0, -28], 38, 8, 24, '#050c14'),

  k(0.78, 'contact', [0, 2, 1], [0, 0, -28], 38),
  k(0.88, 'contact', [0, 1.6, 0.2], [0, 0, -32], 36, 7, 22, '#040a10'),
  k(1, 'contact', [0, 1.2, -0.5], [0, 0, -34], 34, 6, 20, '#040a10'),
]

export type SectionJourneyConfig = {
  id: SectionId
  pin: string
  weight: number
  beatEn: string
  beatZh: string
}

export const SECTION_JOURNEY: SectionJourneyConfig[] = [
  { id: 'hero', pin: '150%', weight: 0.2, beatEn: 'SIGNAL ACQUIRED', beatZh: '信号锁定' },
  { id: 'about', pin: '115%', weight: 0.14, beatEn: 'OPERATOR PROFILE', beatZh: '操作员档案' },
  { id: 'skills', pin: '110%', weight: 0.14, beatEn: 'TOOLCHAIN ONLINE', beatZh: '工具链就绪' },
  { id: 'experience', pin: '110%', weight: 0.16, beatEn: 'IMPACT LOG', beatZh: '战绩记录' },
  { id: 'brief', pin: '120%', weight: 0.18, beatEn: 'BRIEF SIMULATOR', beatZh: '简报模拟器' },
  { id: 'contact', pin: '100%', weight: 0.18, beatEn: 'OPEN CHANNEL', beatZh: '开放频道' },
]

export function sampleJourneyPath(progress: number) {
  const frames = JOURNEY_KEYFRAMES
  const p = Math.max(0, Math.min(1, progress))
  let i = 0
  while (i < frames.length - 1 && frames[i + 1].t < p) i += 1
  const a = frames[i]
  const b = frames[Math.min(i + 1, frames.length - 1)]
  const local = b.t === a.t ? 0 : (p - a.t) / (b.t - a.t)
  const ease = local * local * (3 - 2 * local)
  return {
    position: a.pos.clone().lerp(b.pos, ease),
    target: a.target.clone().lerp(b.target, ease),
    fov: THREE.MathUtils.lerp(a.fov, b.fov, ease),
    fogNear: THREE.MathUtils.lerp(a.fogNear, b.fogNear, ease),
    fogFar: THREE.MathUtils.lerp(a.fogFar, b.fogFar, ease),
    fogColor: a.fogColor,
    section: local > 0.5 ? b.section : a.section,
  }
}

export function progressFromSections(sectionProgress: Record<SectionId, number>) {
  let total = 0
  for (const s of SECTION_JOURNEY) {
    total += (sectionProgress[s.id] ?? 0) * s.weight
  }
  return Math.max(0, Math.min(1, total))
}

export function getSectionBeat(id: SectionId, lang: 'en' | 'zh') {
  const cfg = SECTION_JOURNEY.find((s) => s.id === id)
  if (!cfg) return ''
  return lang === 'zh' ? cfg.beatZh : cfg.beatEn
}
