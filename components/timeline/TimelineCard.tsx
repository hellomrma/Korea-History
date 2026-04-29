'use client'
import type { HistoryEvent } from '@/types'

export default function TimelineCard({
  event,
  side,
  onClick,
}: {
  event: HistoryEvent
  side: 'left' | 'right'
  onClick: () => void
}) {
  const yearLabel = event.year < 0
    ? `기원전 ${Math.abs(event.year)}년`
    : `${event.year}년`

  return (
    <div className={`flex items-start gap-4 ${side === 'right' ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-1 ${side === 'right' ? 'text-right' : ''}`}>
        <button
          type="button"
          onClick={onClick}
          className="w-full text-left border-t border-text pt-4 group"
          aria-label={`${event.title} 상세 보기`}
        >
          <p className="text-xs text-subtle tabular-nums mb-2">
            <span className="text-text">{yearLabel}</span> · {event.category}
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
