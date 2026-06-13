/** AI operator hints shown on skill pill flip (marketing + AI stacks) */
export const skillHints: Record<string, { en: string; zh: string }> = {
  'Google Ads': {
    en: 'AI clusters search terms; I commit budget shifts.',
    zh: 'AI 聚类搜索词；我决定是否调预算。',
  },
  'Google Tag Manager': {
    en: 'Event schema first — AI helps audit misfires.',
    zh: '事件 schema 优先 — AI 协助审计漏触。',
  },
  'Google Analytics 4': {
    en: 'Funnel reports feed daily CPL decisions.',
    zh: '漏斗报告驱动每日 CPL 决策。',
  },
  'Conversion Tracking': {
    en: 'Untracked spend = blind spend. Non-negotiable.',
    zh: '未追踪 = 盲投。没有商量余地。',
  },
  'Lead Generation': {
    en: 'Intent modifiers beat volume every time.',
    zh: '意图修饰词永远比盲目要量重要。',
  },
  'CPL Optimization': {
    en: 'Guardrails before scale — simulate then deploy.',
    zh: '先护栏后放量 — 模拟再上线。',
  },
  'Cursor AI / Agent Workflows': {
    en: 'Agents for audits; human signs off on spend.',
    zh: 'Agent 跑审计；人签字改预算。',
  },
  'Prompt Engineering': {
    en: 'Brief Room logic — structured inputs, testable outputs.',
    zh: 'Brief Room 同款 — 结构化输入、可验证输出。',
  },
  'AI-assisted Ad Copy': {
    en: 'RSA variants in batch; Expected CTR decides winners.',
    zh: '批量 RSA 变体；Expected CTR 定胜负。',
  },
  'MCP Tool Integration': {
    en: 'Tooling extends the console — not a gimmick layer.',
    zh: '工具扩展指挥台 — 不是噱头层。',
  },
}

export function getSkillHint(label: string, lang: 'en' | 'zh'): string | undefined {
  const hint = skillHints[label]
  if (!hint) return undefined
  return lang === 'zh' ? hint.zh : hint.en
}
