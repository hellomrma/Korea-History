'use client'
import { useRef, useEffect, useState } from 'react'
import type { HistoryEvent } from '@/types'

const categoryColors: Record<string, string> = {
  '정치': '#3b82f6',
  '문화': '#22c55e',
  '전쟁': '#ef4444',
  '과학': '#8b5cf6',
  '인물': '#f59e0b',
}

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

  const color = categoryColors[event.category] ?? '#64748b'
  const yearLabel = event.year < 0
    ? `기원전 ${Math.abs(event.year)}년`
    : `${event.year}년`

  return (
    <div
      ref={ref}
      className={`flex items-center gap-4 transition-all duration-700 ${
        side === 'right' ? 'flex-row-reverse' : ''
      } ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {/* 카드 */}
      <div className={`flex-1 ${side === 'right' ? 'text-right' : ''}`}>
        <button
          type="button"
          onClick={onClick}
          className="w-full text-left bg-white rounded-xl p-4 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all border-l-4 group"
          style={{ borderColor: color }}
          aria-label={`${event.title} 상세 보기`}
        >
          <p className="text-xs font-bold mb-1" style={{ color }}>{yearLabel} · {event.category}</p>
          <h3 className="font-serif font-bold text-traditional-dark text-base mb-1">{event.title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{event.summary}</p>
          <p className="text-xs mt-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }}>
            자세히 보기 →
          </p>
        </button>
      </div>

      {/* 중앙 점 */}
      <div
        className="w-4 h-4 rounded-full flex-shrink-0 z-10 ring-4 ring-white shadow"
        style={{ background: color }}
        aria-hidden="true"
      />

      {/* 반대쪽 여백 */}
      <div className="flex-1" aria-hidden="true" />
    </div>
  )
}
