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

const importanceConfig: Record<string, { label: string; color: string }> = {
  high:   { label: '핵심 사건', color: '#ef4444' },
  medium: { label: '주요 사건', color: '#f59e0b' },
  low:    { label: '참고 사건', color: '#94a3b8' },
}

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-bg p-4 border border-border">
      <h3 className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-wider mb-2">
        <span aria-hidden="true">{icon}</span>
        {title}
      </h3>
      <div className="text-sm text-text leading-relaxed">{children}</div>
    </div>
  )
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
  const imp = importanceConfig[event.importance] ?? importanceConfig.low
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
      <div className="relative bg-surface rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden border border-border">
        {/* 상단 색상 바 */}
        <div className="h-1.5 flex-shrink-0" style={{ background: color }} />

        {/* 스크롤 영역 */}
        <div className="overflow-y-auto flex-1">
          <div className="p-6 space-y-5">
            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-bg hover:bg-border text-muted hover:text-text transition-colors text-sm font-bold z-10"
              aria-label="닫기"
            >
              ✕
            </button>

            {/* 뱃지 행 */}
            <div className="flex items-center gap-2 flex-wrap pr-10">
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                style={{ background: color }}
              >
                {event.category}
              </span>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: imp.color + '20', color: imp.color }}
              >
                {imp.label}
              </span>
            </div>

            {/* 연도 + 제목 */}
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color }}>{yearLabel}</p>
              <h2
                id="modal-title"
                className="font-serif text-2xl font-bold text-text leading-snug"
              >
                {event.title}
              </h2>
            </div>

            {/* 개요 */}
            <Section icon="📋" title="개요">
              {event.summary}
            </Section>

            {/* 배경 */}
            {event.background && (
              <Section icon="🔍" title="배경 및 원인">
                {event.background}
              </Section>
            )}

            {/* 전개 과정 */}
            {event.process && (
              <Section icon="⚙️" title="전개 과정">
                {event.process}
              </Section>
            )}

            {/* 역사적 의의 */}
            {event.significance && (
              <Section icon="⭐" title="역사적 의의 및 영향">
                {event.significance}
              </Section>
            )}

            {/* 관련 인물 */}
            {event.figures.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">
                  관련 인물
                </h3>
                <div className="flex flex-wrap gap-2">
                  {event.figures.map((slug) => (
                    <Link
                      key={slug}
                      href={`/figure/${slug}`}
                      onClick={onClose}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bg border border-border text-muted rounded-full text-sm font-medium hover:border-point hover:text-point transition-colors"
                    >
                      <span aria-hidden="true">👤</span>
                      {figureMap[slug] ?? slug}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 하단 액션 바 */}
        <div className="flex-shrink-0 border-t border-border px-6 py-3 flex justify-between items-center bg-bg">
          <span className="text-xs text-subtle">{yearLabel} · {event.era}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-surface hover:bg-bg text-muted border border-border rounded-lg text-sm font-medium transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
