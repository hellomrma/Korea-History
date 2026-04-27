'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import type { HistoryEvent } from '@/types'

const categoryColors: Record<string, string> = {
  '정치': '#3b82f6',
  '문화': '#22c55e',
  '전쟁': '#ef4444',
  '과학': '#8b5cf6',
  '인물': '#f59e0b',
}

const importanceLabel: Record<string, string> = {
  high: '중요도 높음',
  medium: '중요도 보통',
  low: '중요도 낮음',
}

export default function EventDetailModal({
  event,
  figureMap,
  onClose,
}: {
  event: HistoryEvent
  figureMap: Record<string, string>
  onClose: () => void
}) {
  const color = categoryColors[event.category] ?? '#64748b'
  const yearLabel = event.year < 0
    ? `기원전 ${Math.abs(event.year)}년`
    : `${event.year}년`

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 모달 본체 */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* 헤더 색상 바 */}
        <div className="h-1.5 rounded-t-2xl" style={{ background: color }} />

        <div className="p-6">
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors text-sm font-bold"
            aria-label="닫기"
          >
            ✕
          </button>

          {/* 메타 정보 */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
              style={{ background: color }}
            >
              {event.category}
            </span>
            <span className="text-xs text-gray-400">{importanceLabel[event.importance]}</span>
          </div>

          {/* 연도 + 제목 */}
          <p className="text-sm font-semibold mb-1" style={{ color }}>{yearLabel}</p>
          <h2
            id="modal-title"
            className="font-serif text-2xl font-bold text-traditional-dark mb-4 leading-tight"
          >
            {event.title}
          </h2>

          {/* 본문 */}
          <p className="text-gray-700 leading-relaxed text-base mb-6">{event.summary}</p>

          {/* 관련 인물 */}
          {event.figures.length > 0 && (
            <div className="border-t pt-4 mb-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                관련 인물
              </h3>
              <div className="flex flex-wrap gap-2">
                {event.figures.map((slug) => (
                  <Link
                    key={slug}
                    href={`/figure/${slug}`}
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 rounded-full text-sm font-medium hover:bg-amber-100 transition-colors"
                  >
                    <span aria-hidden="true">👤</span>
                    {figureMap[slug] ?? slug}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 하단 액션 */}
          <div className="border-t pt-4 flex justify-between items-center">
            <span className="text-xs text-gray-400">{event.era} 시대</span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
