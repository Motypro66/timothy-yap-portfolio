import type { SectionId } from '../context/CommandContext'

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
