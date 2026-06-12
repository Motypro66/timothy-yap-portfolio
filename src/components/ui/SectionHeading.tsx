type Props = {
  eyebrow?: string
  title: string
  subtitle?: string
}

export default function SectionHeading({ eyebrow, title, subtitle }: Props) {
  return (
    <div className="section-heading reveal-item">
      {eyebrow && <span className="section-heading__eyebrow type-label">{eyebrow}</span>}
      <h2 className="section-heading__title type-display">{title}</h2>
      {subtitle && <p className="section-heading__subtitle type-body">{subtitle}</p>}
    </div>
  )
}
