'use client'
import { useRef, useEffect, useState } from 'react'
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
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const yearLabel = event.year < 0
    ? `기원전 ${Math.abs(event.year)}년`
    : `${event.year}년`

  return (
    <div
      ref={ref}
      className={`flex items-start gap-4 transition-all duration-700 ${
        side === 'right' ? 'flex-row-reverse' : ''
      } ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
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
          <h3 className="text-base font-semibold text-text tracking-tight mb-2 group-hover:text-point transition-colors">
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
