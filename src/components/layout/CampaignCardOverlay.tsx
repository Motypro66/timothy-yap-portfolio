import { motion, AnimatePresence } from 'framer-motion'
import { useCommand } from '../../context/CommandContext'
import { useLanguage } from '../../i18n/LanguageContext'

export default function CampaignCardOverlay() {
  const { selectedCampaign, setSelectedCampaign } = useCommand()
  const { lang } = useLanguage()

  return (
    <AnimatePresence>
      {selectedCampaign && (
        <motion.div
          className="campaign-card campaign-card--overlay"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          role="dialog"
          aria-label="Campaign detail"
        >
          <button
            type="button"
            className="campaign-card__close"
            onClick={() => setSelectedCampaign(null)}
            aria-label="Close"
          >
            ×
          </button>
          <p className="campaign-card__sim type-label">SIMULATED</p>
          <h3 className="campaign-card__title type-body-strong">
            {lang === 'zh' ? selectedCampaign.nameZh : selectedCampaign.name}
          </h3>
          <p className="campaign-card__status type-caption">
            {selectedCampaign.status} · CPL RM{selectedCampaign.cpl} · CTR {selectedCampaign.ctr}% ·{' '}
            {selectedCampaign.conv} conv.
          </p>
          <p className="campaign-card__ai type-caption">
            {lang === 'zh' ? selectedCampaign.aiNoteZh : selectedCampaign.aiNote}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
