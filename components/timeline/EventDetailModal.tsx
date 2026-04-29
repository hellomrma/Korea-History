'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import type { HistoryEvent } from '@/types'

const importanceLabel: Record<string, string> = {
  high: '핵심 사건',
  medium: '주요 사건',
  low: '참고 사건',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border pt-5">
      <h3 className="text-[11px] uppercase tracking-[0.18em] text-subtle mb-3">{title}</h3>
      <div className="text-[15px] text-text leading-[1.85]">{children}</div>
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
      <div
        className="absolute inset-0 bg-text/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-bg w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden border border-border">
        <div className="overflow-y-auto flex-1">
          <div className="p-8 space-y-6">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-subtle hover:text-text text-base z-10"
              aria-label="닫기"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 flex-wrap pr-10">
              <span className="text-xs text-subtle border border-border px-2 py-0.5">
                {event.category}
              </span>
              <span className="text-xs text-subtle border border-border px-2 py-0.5">
                {importanceLabel[event.importance] ?? '참고 사건'}
              </span>
            </div>

            <div>
              <p className="text-sm text-muted tabular-nums mb-2">{yearLabel}</p>
              <h2
                id="modal-title"
                className="text-3xl font-semibold text-text tracking-tight leading-tight"
              >
                {event.title}
              </h2>
            </div>

            <Section title="개요">{event.summary}</Section>
            {event.background && <Section title="배경 및 원인">{event.background}</Section>}
            {event.process && <Section title="전개 과정">{event.process}</Section>}
            {event.significance && <Section title="역사적 의의 및 영향">{event.significance}</Section>}

            {event.figures.length > 0 && (
              <div className="border-t border-border pt-5">
                <h3 className="text-[11px] uppercase tracking-[0.18em] text-subtle mb-3">관련 인물</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {event.figures.map((slug) => (
                    <Link
                      key={slug}
                      href={`/figure/${slug}`}
                      onClick={onClose}
                      className="text-sm text-text border-b border-text pb-0.5 hover:text-point hover:border-point"
                    >
                      {figureMap[slug] ?? slug}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 border-t border-border px-8 py-4 flex justify-between items-center">
          <span className="text-xs text-subtle">{yearLabel} · {event.era}</span>
          <button
            onClick={onClose}
            className="text-sm text-text border-b border-text pb-0.5 hover:text-point hover:border-point"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
