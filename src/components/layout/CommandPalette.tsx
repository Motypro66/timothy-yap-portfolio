import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { profile } from '../../data/resume'
import { useCommand } from '../../context/CommandContext'
import { useLanguage } from '../../i18n/LanguageContext'
import Logo from '../ui/Logo'

type Command = {
  id: string
  label: string
  hint?: string
  run: () => void
}

export default function CommandPalette() {
  const { paletteOpen, closePalette, setHighlightCampaigns } = useCommand()
  const { t, lang, setLang } = useLanguage()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const cvUrl = `${import.meta.env.BASE_URL}${profile.resumePdf}`

  const commands: Command[] = useMemo(
    () => [
      {
        id: 'brief',
        label: t.palette.brief,
        hint: '#brief',
        run: () => {
          document.getElementById('brief')?.scrollIntoView({ behavior: 'smooth' })
          closePalette()
        },
      },
      {
        id: 'campaigns',
        label: t.palette.campaigns,
        hint: '#hero',
        run: () => {
          document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })
          setHighlightCampaigns(true)
          window.setTimeout(() => setHighlightCampaigns(false), 3200)
          closePalette()
        },
      },
      {
        id: 'about',
        label: t.palette.about,
        run: () => {
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
          closePalette()
        },
      },
      {
        id: 'skills',
        label: t.palette.skills,
        run: () => {
          document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' })
          closePalette()
        },
      },
      {
        id: 'experience',
        label: t.palette.experience,
        run: () => {
          document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })
          closePalette()
        },
      },
      {
        id: 'contact',
        label: t.palette.contact,
        run: () => {
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
          closePalette()
        },
      },
      {
        id: 'cv',
        label: t.palette.cv,
        run: () => {
          const a = document.createElement('a')
          a.href = cvUrl
          a.download = ''
          a.click()
          closePalette()
        },
      },
      {
        id: 'lang-en',
        label: t.palette.langEn,
        run: () => {
          setLang('en')
          closePalette()
        },
      },
      {
        id: 'lang-zh',
        label: t.palette.langZh,
        run: () => {
          setLang('zh')
          closePalette()
        },
      },
    ],
    [t, cvUrl, closePalette, setHighlightCampaigns, setLang],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.id.includes(q) || c.hint?.includes(q),
    )
  }, [commands, query])

  useEffect(() => {
    if (paletteOpen) {
      setQuery('')
      setActive(0)
      window.setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [paletteOpen])

  useEffect(() => {
    setActive(0)
  }, [query])

  if (!paletteOpen) return null

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && filtered[active]) {
      e.preventDefault()
      filtered[active].run()
    }
  }

  return (
    <div className="command-palette" role="dialog" aria-modal="true" aria-label="Command palette">
      <button type="button" className="command-palette__backdrop" onClick={closePalette} aria-label="Close" />
      <div className="command-palette__panel">
        <div className="command-palette__head">
          <Logo variant="command" iconOnly />
          <input
            ref={inputRef}
            className="command-palette__input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t.palette.placeholder}
            aria-label={t.palette.placeholder}
          />
          <kbd className="command-palette__kbd">esc</kbd>
        </div>
        <ul className="command-palette__list">
          {filtered.map((cmd, i) => (
            <li key={cmd.id}>
              <button
                type="button"
                className={`command-palette__item ${i === active ? 'command-palette__item--active' : ''}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => cmd.run()}
              >
                <span>{cmd.label}</span>
                {cmd.hint && <span className="command-palette__hint">{cmd.hint}</span>}
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="command-palette__empty type-caption">{t.palette.empty}</li>
          )}
        </ul>
        <p className="command-palette__foot type-caption">
          {lang === 'zh' ? '↑↓ 选择 · Enter 执行 · / 或 Ctrl+K 打开' : '↑↓ navigate · Enter run · / or Ctrl+K'}
        </p>
      </div>
    </div>
  )
}
