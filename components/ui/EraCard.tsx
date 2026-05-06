import Link from 'next/link'
import type { Era } from '@/types'
import { formatYear, getDictionary, type Locale } from '@/lib/i18n'

export default function EraCard({ era, locale }: { era: Era; locale: Locale }) {
  const dict = getDictionary(locale)
  const startLabel = formatYear(era.period.start, locale)
  const endLabel = era.period.end === null ? dict.common.present : formatYear(era.period.end, locale)

  return (
    <Link href={`/${locale}/era/${era.slug}`} className="group block border-t border-text pt-5">
      <p className="text-xs text-subtle tabular-nums mb-2">{startLabel} — {endLabel}</p>
      <h3 className="text-xl font-semibold text-text tracking-tight mb-3 group-hover:text-point">
        {era.name}
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4">{era.summary}</p>
      <div className="flex flex-wrap gap-x-2 gap-y-1">
        {era.tags.map((tag) => (
          <span key={tag} className="text-xs text-subtle border border-border px-2 py-0.5">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}
