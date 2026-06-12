import { createContext, useContext, useState, type ReactNode } from 'react'
import { translations, type Lang, type TranslationKeys } from './translations'

type LanguageContextValue = {
  lang: Lang
  t: TranslationKeys
  setLang: (lang: Lang) => void
  toggleLang: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')

  const value: LanguageContextValue = {
    lang,
    t: translations[lang],
    setLang,
    toggleLang: () => setLang((l) => (l === 'en' ? 'zh' : 'en')),
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
