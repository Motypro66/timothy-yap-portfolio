import * as THREE from 'three'
import type { SectionId } from '../context/CommandContext'
import { roomCameraPath } from '../utils/roomScene'

export type CameraKeyframe = {
  t: number
  section: SectionId
  pos: THREE.Vector3
  target: THREE.Vector3
  fov: number
}

const SHOTS = roomCameraPath()
const SECTION_AT: { section: SectionId; t: number }[] = [
  { section: 'hero', t: 0 },
  { section: 'hero', t: 0.18 },
  { section: 'about', t: 0.28 },
  { section: 'about', t: 0.38 },
  { section: 'skills', t: 0.48 },
  { section: 'skills', t: 0.58 },
  { section: 'experience', t: 0.68 },
  { section: 'experience', t: 0.76 },
  { section: 'contact', t: 0.86 },
  { section: 'contact', t: 1 },
]

export const JOURNEY_KEYFRAMES: CameraKeyframe[] = SECTION_AT.map(({ section, t }, i) => ({
  t,
  section,
  pos: new THREE.Vector3(...SHOTS[i].pos),
  target: new THREE.Vector3(...SHOTS[i].target),
  fov: SHOTS[i].fov,
}))

export type SectionJourneyConfig = {
  id: SectionId
  pin: string
  weight: number
  beatEn: string
  beatZh: string
}

export const SECTION_JOURNEY: SectionJourneyConfig[] = [
  { id: 'hero', pin: '165%', weight: 0.22, beatEn: 'WELCOME IN', beatZh: '欢迎进来' },
  { id: 'about', pin: '155%', weight: 0.18, beatEn: 'WHO I AM', beatZh: '关于我' },
  { id: 'skills', pin: '150%', weight: 0.18, beatEn: 'WHAT I USE', beatZh: '技能工具' },
  { id: 'experience', pin: '155%', weight: 0.2, beatEn: 'WHERE I IMPACT', beatZh: '经历与成果' },
  { id: 'contact', pin: '145%', weight: 0.22, beatEn: 'SAY HELLO', beatZh: '联系我' },
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
