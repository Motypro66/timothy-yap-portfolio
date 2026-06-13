import * as THREE from 'three'
import type { SectionId } from '../context/CommandContext'

export type CameraKeyframe = {
  t: number
  section: SectionId
  pos: THREE.Vector3
  target: THREE.Vector3
  fov: number
}

/** Camera path inside sunny room (Three.js Y-up). Tune after GLB export if needed. */
const k = (
  t: number,
  section: SectionId,
  pos: [number, number, number],
  target: [number, number, number],
  fov: number,
): CameraKeyframe => ({
  t,
  section,
  pos: new THREE.Vector3(...pos),
  target: new THREE.Vector3(...target),
  fov,
})

export const JOURNEY_KEYFRAMES: CameraKeyframe[] = [
  k(0, 'hero', [0, 1.68, 3.6], [0, 1.25, -1.2], 54),
  k(0.1, 'hero', [0, 1.58, 2.5], [0, 1.18, -1.45], 50),
  k(0.2, 'hero', [0.15, 1.52, 1.35], [0, 1.12, -1.55], 47),

  k(0.2, 'about', [0.15, 1.52, 1.35], [0, 1.12, -1.55], 47),
  k(0.34, 'about', [1.45, 1.38, 0.05], [0.05, 1.14, -1.58], 44),
  k(0.42, 'about', [1.15, 1.32, -0.35], [0, 1.1, -1.52], 42),

  k(0.42, 'skills', [1.15, 1.32, -0.35], [-1.85, 1.52, -1.75], 42),
  k(0.54, 'skills', [-1.75, 1.48, -1.15], [-2.05, 1.58, -2.05], 40),
  k(0.6, 'skills', [-1.55, 1.42, -0.85], [-2.0, 1.55, -1.95], 38),

  k(0.6, 'experience', [-1.55, 1.42, -0.85], [0.15, 1.05, -1.15], 38),
  k(0.72, 'experience', [0.55, 1.28, 0.05], [0, 1.02, -1.38], 36),
  k(0.78, 'experience', [0.35, 1.24, -0.15], [0, 1.08, -1.48], 35),

  k(0.78, 'contact', [0.35, 1.24, -0.15], [2.15, 1.72, -1.35], 35),
  k(0.9, 'contact', [1.65, 1.52, -0.95], [2.25, 1.78, -1.55], 33),
  k(1, 'contact', [0.25, 1.46, 0.95], [0, 1.14, -0.75], 32),
]

export type SectionJourneyConfig = {
  id: SectionId
  pin: string
  weight: number
  beatEn: string
  beatZh: string
}

export const SECTION_JOURNEY: SectionJourneyConfig[] = [
  { id: 'hero', pin: '140%', weight: 0.22, beatEn: 'WELCOME IN', beatZh: '欢迎进来' },
  { id: 'about', pin: '120%', weight: 0.18, beatEn: 'WHO I AM', beatZh: '关于我' },
  { id: 'skills', pin: '115%', weight: 0.18, beatEn: 'WHAT I USE', beatZh: '技能工具' },
  { id: 'experience', pin: '120%', weight: 0.2, beatEn: 'WHERE I IMPACT', beatZh: '经历与成果' },
  { id: 'contact', pin: '110%', weight: 0.22, beatEn: 'SAY HELLO', beatZh: '联系我' },
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
    section: local > 0.5 ? b.section : a.section,
    fogColor: '#070b12',
    fogNear: 14,
    fogFar: 42,
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
