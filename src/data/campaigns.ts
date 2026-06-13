export type CampaignNode = {
  id: number
  name: string
  nameZh: string
  status: 'LIVE' | 'PAUSED'
  cpl: number
  ctr: number
  conv: number
  aiNote: string
  aiNoteZh: string
  isPrimary?: boolean
}

const leadGenNames = [
  'KL Home Services — Search',
  'Penang Renovation — Search',
  'JB Legal Leads — Search',
  'KL Dental — Search',
  'Selangor HVAC — Search',
  'KL Moving — Search',
  'Insurance Quotes — Search',
  'Tuition Leads — Search',
  'Solar Install — Search',
  'Pest Control — Search',
  'Roof Repair — Search',
  'Plumbing Emergency — Search',
  'Car Workshop — Search',
  'Beauty Clinic — Search',
  'Fitness Trial — Search',
  'Real Estate Viewing — Search',
  'Wedding Venue — Search',
  'Pet Grooming — Search',
  'Accounting Leads — Search',
  'Cleaning Service — Search',
  'Landscaping — Search',
  'Auto Detailing — Search',
  'Physio Booking — Search',
  'Catering Quote — Search',
  'Interior Design — Search',
  'Water Filter — Search',
  'Security Install — Search',
  'Tutoring Math — Search',
  'Massage Spa — Search',
  'Electrical Repair — Search',
]

function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

export const campaignNodes: CampaignNode[] = leadGenNames.map((name, i) => {
  const r = pseudoRandom(i + 1)
  const isPrimary = i === 0
  return {
    id: i + 1,
    name,
    nameZh: name.replace('Search', '搜索').replace('Leads', '线索'),
    status: r > 0.12 ? 'LIVE' : 'PAUSED',
    cpl: Math.round(28 + r * 85),
    ctr: Math.round((2.1 + r * 4.2) * 10) / 10,
    conv: Math.round(12 + r * 48),
    aiNote: isPrimary
      ? 'Primary portfolio node — full-funnel tracking verified. Query sculpting active.'
      : r > 0.7
        ? 'Review search terms — ~12% spend on low-intent queries.'
        : r > 0.4
          ? 'CPL stable. Test RSA variant B on top ad group.'
          : 'Bid strategy healthy. Monitor impression share weekly.',
    aiNoteZh: isPrimary
      ? '主组合节点 — 全漏斗追踪已验证，搜索词 sculpting 运行中。'
      : r > 0.7
        ? '检查搜索词 — 约 12% 花费在低意图 query。'
        : r > 0.4
          ? 'CPL 稳定。建议在 top ad group 测试 RSA B 版。'
          : '出价策略健康。每周监控 impression share。',
    isPrimary,
  }
})

/** Normalized positions for the campaign field (0–1) */
export const campaignPositions: { x: number; y: number }[] = Array.from({ length: 30 }, (_, i) => {
  const col = i % 6
  const row = Math.floor(i / 6)
  const jitterX = pseudoRandom(i * 3) * 0.08 - 0.04
  const jitterY = pseudoRandom(i * 7) * 0.08 - 0.04
  return {
    x: 0.08 + col * 0.155 + jitterX,
    y: 0.12 + row * 0.17 + jitterY,
  }
})
