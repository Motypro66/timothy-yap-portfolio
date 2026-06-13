import * as THREE from 'three'
import type { SectionId } from '../context/CommandContext'
import { defaultCameraPath, type RoomShot } from '../utils/roomScene'

export type CameraKeyframe = {
  t: number
  section: SectionId
  pos: THREE.Vector3
  target: THREE.Vector3
  fov: number
}

const SECTION_AT: { section: SectionId; t: number }[] = [
  { section: 'hero', t: 0 },
  { section: 'about', t: 0.22 },
  { section: 'skills', t: 0.4 },
  { section: 'experience', t: 0.62 },
  { section: 'contact', t: 0.82 },
  { section: 'contact', t: 1 },
]

function shotsToKeyframes(shots: RoomShot[]): CameraKeyframe[] {
  return SECTION_AT.map(({ section, t }, i) => {
    const shot = shots[i] ?? shots[shots.length - 1]
    return {
      t,
      section,
      pos: new THREE.Vector3(...shot.pos),
      target: new THREE.Vector3(...shot.target),
      fov: shot.fov,
    }
  })
}

let runtimeKeyframes: CameraKeyframe[] = shotsToKeyframes(defaultCameraPath())
let runtimePathVersion = 0

export function setRuntimeJourneyKeyframes(shots: RoomShot[]) {
  runtimeKeyframes = shotsToKeyframes(shots)
  runtimePathVersion += 1
}

export function getCameraPathVersion() {
  return runtimePathVersion
}

export function getJourneyKeyframes() {
  return runtimeKeyframes
}

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
  const frames = runtimeKeyframes
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

const SECTION_THRESHOLDS = SECTION_JOURNEY.reduce<{ id: SectionId; start: number }[]>(
  (acc, s) => {
    const start = acc.length ? acc[acc.length - 1].start + SECTION_JOURNEY[acc.length - 1].weight : 0
    acc.push({ id: s.id, start })
    return acc
  },
  [],
)

export function sectionFromProgress(progress: number): SectionId {
  const p = Math.max(0, Math.min(1, progress))
  let current: SectionId = 'hero'
  for (const row of SECTION_THRESHOLDS) {
    if (p >= row.start) current = row.id
  }
  return current
}

export function sectionProgressFromJourney(progress: number): Record<SectionId, number> {
  const p = Math.max(0, Math.min(1, progress))
  const out: Record<SectionId, number> = {
    hero: 0,
    about: 0,
    skills: 0,
    experience: 0,
    contact: 0,
  }
  for (const s of SECTION_JOURNEY) {
    const start = SECTION_THRESHOLDS.find((t) => t.id === s.id)?.start ?? 0
    const local = (p - start) / s.weight
    out[s.id] = Math.max(0, Math.min(1, local))
  }
  return out
}

export function getSectionBeat(id: SectionId, lang: 'en' | 'zh') {
  const cfg = SECTION_JOURNEY.find((s) => s.id === id)
  if (!cfg) return ''
  return lang === 'zh' ? cfg.beatZh : cfg.beatEn
}
