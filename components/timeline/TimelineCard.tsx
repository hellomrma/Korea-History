'use client'
import type { HistoryEvent } from '@/types'
import { formatYear, getDictionary, type Locale } from '@/lib/i18n'

export default function TimelineCard({
  event,
  side,
  onClick,
  locale,
}: {
  event: HistoryEvent
  side: 'left' | 'right'
  onClick: () => void
  locale: Locale
}) {
  const dict = getDictionary(locale)
  const yearLabel = formatYear(event.year, locale)
  const categoryLabel = dict.timeline.categories[event.category] ?? event.category

  return (
    <div className={`flex items-start gap-4 ${side === 'right' ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-1 ${side === 'right' ? 'text-right' : ''}`}>
        <button
          type="button"
          onClick={onClick}
          className="w-full text-left border-t border-text pt-4 group"
          aria-label={dict.timeline.detailAria(event.title)}
        >
          <p className="text-xs text-subtle tabular-nums mb-2">
            <span className="text-text">{yearLabel}</span> · {categoryLabel}
          </p>
          <h3 className="text-base font-semibold text-text tracking-tight mb-2 group-hover:text-point">
            {event.title}
          </h3>
          <p className="text-sm text-muted leading-relaxed line-clamp-3">{event.summary}</p>
        </button>
      </div>

      <div
        className="w-2 h-2 rounded-full bg-text flex-shrink-0 z-10 mt-5 ring-4 ring-bg"
        aria-hidden="true"
      />

      <div className="flex-1" aria-hidden="true" />
    </div>
  )
}
