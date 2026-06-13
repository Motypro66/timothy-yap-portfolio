import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { campaignNodes, campaignPositions, type CampaignNode } from '../../data/campaigns'
import { useCommand } from '../../context/CommandContext'
import { useLanguage } from '../../i18n/LanguageContext'

export default function CampaignField() {
  const fieldRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [selected, setSelected] = useState<CampaignNode | null>(null)
  const { highlightCampaigns, bootComplete } = useCommand()
  const { lang } = useLanguage()

  useEffect(() => {
    const applyOffset = (nx: number, ny: number) => {
      setOffset({ x: nx * 18, y: ny * 12 })
    }

    const onMove = (e: MouseEvent) => {
      const el = fieldRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      applyOffset((e.clientX - rect.left) / rect.width - 0.5, (e.clientY - rect.top) / rect.height - 0.5)
    }

    const onTouch = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (!touch) return
      const el = fieldRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      applyOffset((touch.clientX - rect.left) / rect.width - 0.5, (touch.clientY - rect.top) / rect.height - 0.5)
    }

    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return
      const nx = Math.max(-0.5, Math.min(0.5, e.gamma / 45))
      const ny = Math.max(-0.5, Math.min(0.5, (e.beta - 45) / 90))
      applyOffset(nx, ny)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })

    const isMobile = window.matchMedia('(max-width: 900px)').matches
    if (isMobile && typeof DeviceOrientationEvent !== 'undefined') {
      window.addEventListener('deviceorientation', onOrientation, { passive: true })
    }

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('deviceorientation', onOrientation)
    }
  }, [])

  return (
    <div className="campaign-field" ref={fieldRef} aria-hidden={!bootComplete}>
      <div
        className="campaign-field__terrain"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      >
        <svg className="campaign-field__contours" viewBox="0 0 100 100" preserveAspectRatio="none">
          {[18, 32, 46, 60, 74].map((y) => (
            <path
              key={y}
              d={`M0 ${y} Q25 ${y - 4} 50 ${y} T100 ${y}`}
              fill="none"
              stroke="rgba(91, 181, 232, 0.12)"
              strokeWidth="0.35"
            />
          ))}
        </svg>

        {campaignNodes.map((node, i) => {
          const pos = campaignPositions[i]
          return (
            <button
              key={node.id}
              type="button"
              className={`campaign-node ${node.isPrimary ? 'campaign-node--primary' : ''} ${
                highlightCampaigns ? 'campaign-node--highlight' : ''
              }`}
              style={{ left: `${pos.x * 100}%`, top: `${pos.y * 100}%` }}
              onClick={() => setSelected(node)}
              aria-label={node.name}
            >
              <span className="campaign-node__core" />
              {node.isPrimary && <span className="campaign-node__ring" />}
            </button>
          )
        })}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="campaign-card"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            role="dialog"
            aria-label="Campaign detail"
          >
            <button
              type="button"
              className="campaign-card__close"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              ×
            </button>
            <p className="campaign-card__sim type-label">SIMULATED</p>
            <h3 className="campaign-card__title type-body-strong">
              {lang === 'zh' ? selected.nameZh : selected.name}
            </h3>
            <p className="campaign-card__status type-caption">
              {selected.status} · CPL RM{selected.cpl} · CTR {selected.ctr}% · {selected.conv} conv.
            </p>
            <p className="campaign-card__ai type-caption">
              {lang === 'zh' ? selected.aiNoteZh : selected.aiNote}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
