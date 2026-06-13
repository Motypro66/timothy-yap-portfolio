export type BriefChannel = 'search' | 'pmax'
export type BriefAngle = 0 | 1 | 2

export type BriefInput = {
  budget: number
  targetCpl: number
  channel: BriefChannel
  angle: BriefAngle
}

export type PlanLine = {
  title: string
  titleZh: string
  body: string
  bodyZh: string
  why: string
  whyZh: string
}

export type BriefPlan = {
  simulated: true
  estLeads: number
  estSpend: number
  lines: PlanLine[]
}

const anglesEn = [
  {
    theme: 'Intent-first Search',
    structure: '3 campaign tiers: Brand · High-intent service · Competitor conquest',
    keywords: 'Focus exact + phrase on “near me”, “quote”, “cost”, “book appointment”',
    tracking: 'GTM: form_submit + click-to-call + thank-you page · GA4 key events',
    ai: 'Use AI to cluster search terms weekly; auto-flag low-intent spend buckets',
  },
  {
    theme: 'CPL guardrail scaling',
    structure: '2 Search campaigns + 1 remarketing RLSA layer',
    keywords: 'Pause broad match bleeders; scale top 20% queries by conv. rate',
    tracking: 'Offline conversion import for qualified leads · Enhanced conversions',
    ai: 'AI draft RSA variants per ad group; human approves before publish',
  },
  {
    theme: 'Local lead gen blitz',
    structure: 'Geo-fenced Search + PMax asset groups by service line',
    keywords: 'Location insertions + call extensions · Schedule ads for peak inquiry hours',
    tracking: 'Call tracking DNI + CRM webhook to close the loop on lead quality',
    ai: 'Simulate CPL scenarios before budget shifts; alert on 15% WoW drift',
  },
]

const anglesZh = [
  {
    theme: '意图优先 Search',
    structure: '3 层 campaign：品牌 · 高意图服务 · 竞品 conquest',
    keywords: '主攻 exact + phrase：“near me”“quote”“预约”类 query',
    tracking: 'GTM：form_submit + 电话点击 + 感谢页 · GA4 关键事件',
    ai: 'AI 每周聚类搜索词；自动标记低意图花费桶',
  },
  {
    theme: 'CPL 护栏式放量',
    structure: '2 个 Search + 1 层 RLSA remarketing',
    keywords: '暂停 broad 浪费；放大转化率 top 20% query',
    tracking: '合格 lead 离线转化导入 · Enhanced conversions',
    ai: 'AI 生成 RSA 变体；人工审核后上线',
  },
  {
    theme: '本地 Lead Gen 闪击',
    structure: '地理围栏 Search + 按服务线拆 PMax asset group',
    keywords: '位置插入 + 电话扩展 · 高峰时段排期',
    tracking: 'DNI 电话追踪 + CRM webhook 闭环 lead 质量',
    ai: '预算调整前模拟 CPL；WoW 漂移超 15% 告警',
  },
]

export function generateBriefPlan(input: BriefInput, lang: 'en' | 'zh'): BriefPlan {
  const channelMult = input.channel === 'search' ? 1 : 0.88
  const estLeads = Math.max(1, Math.round((input.budget / input.targetCpl) * channelMult))
  const estSpend = input.budget
  const a = input.angle
  const en = anglesEn[a]
  const zh = anglesZh[a]

  const industryEn = 'Local Lead Gen (home & professional services)'
  const industryZh = '本地 Lead Gen（家居 & 专业服务）'

  const lines: PlanLine[] = [
    {
      title: 'Industry & objective',
      titleZh: '行业与目标',
      body: `${industryEn} · Target CPL RM ${input.targetCpl} · Monthly budget RM ${input.budget.toLocaleString()}`,
      bodyZh: `${industryZh} · 目标 CPL RM ${input.targetCpl} · 月预算 RM ${input.budget.toLocaleString()}`,
      why: 'Lead gen lives or dies on CPL discipline and query intent — budget follows measurable leads, not clicks.',
      whyZh: 'Lead gen 成败在 CPL 纪律与 query 意图 — 预算跟着可衡量 leads 走，不是 clicks。',
    },
    {
      title: 'Strategy angle',
      titleZh: '策略角度',
      body: lang === 'zh' ? zh.theme : en.theme,
      bodyZh: zh.theme,
      why: lang === 'zh' ? '轮换假设，避免单一路径优化陷阱。' : 'Rotate hypotheses to avoid single-path optimization traps.',
      whyZh: '轮换假设，避免单一路径优化陷阱。',
    },
    {
      title: 'Campaign structure',
      titleZh: 'Campaign 结构',
      body: lang === 'zh' ? zh.structure : en.structure,
      bodyZh: zh.structure,
      why: 'Structure separates intent tiers so budget doesn’t leak across funnel stages.',
      whyZh: '结构分层意图，避免预算在漏斗阶段间泄漏。',
    },
    {
      title: 'Keywords & queries',
      titleZh: '关键词 & 搜索词',
      body: lang === 'zh' ? zh.keywords : en.keywords,
      bodyZh: zh.keywords,
      why: 'Lead gen Search wins on high-intent modifiers, not volume for volume’s sake.',
      whyZh: 'Lead gen Search 靠高意图修饰词赢，不是盲目要量。',
    },
    {
      title: 'Tracking stack',
      titleZh: '追踪栈',
      body: lang === 'zh' ? zh.tracking : en.tracking,
      bodyZh: zh.tracking,
      why: 'Untracked spend is blind spend — every lead must map to a query and an ad.',
      whyZh: '未追踪的花费是盲投 — 每个 lead 必须映射到 query 和广告。',
    },
    {
      title: 'AI operator layer',
      titleZh: 'AI 操作层',
      body: lang === 'zh' ? zh.ai : en.ai,
      bodyZh: zh.ai,
      why: 'AI reads signals at scale; the operator commits budget and owns outcomes.',
      whyZh: 'AI 规模化读信号；操作者决定预算并承担结果。',
    },
  ]

  return { simulated: true, estLeads, estSpend, lines }
}

export const signalFeedItems = {
  en: [
    'CPL ↑12% on Ad Group “KL Home Services” — review search terms',
    'New high-intent cluster: “emergency plumber near me” (+23% conv. rate)',
    'GTM event form_submit firing correctly on /thank-you',
    'AI: 8 queries flagged for negative keyword add — est. save RM 420/wk',
    'Impression share dropped 6pts — check budget cap on Brand campaign',
    'RSA variant B outperforming A on Expected CTR (+0.4)',
  ],
  zh: [
    'Ad Group「KL Home Services」CPL ↑12% — 建议检查搜索词',
    '新高意图聚类：“emergency plumber near me”（转化率 +23%）',
    'GTM 事件 form_submit 在 /thank-you 触发正常',
    'AI：8 条 query 建议加否定词 — 预估节省 RM 420/周',
    'Impression share 降 6pts — 检查 Brand campaign 预算上限',
    'RSA B 版 Expected CTR 优于 A（+0.4）',
  ],
}
