'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import type { HistoryEvent } from '@/types'
import { formatYear, getDictionary, type Locale } from '@/lib/i18n'

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
  locale,
}: {
  event: HistoryEvent
  figureMap: Record<string, string>
  onClose: () => void
  locale: Locale
}) {
  const dict = getDictionary(locale)
  const yearLabel = formatYear(event.year, locale)
  const categoryLabel = dict.timeline.categories[event.category] ?? event.category
  const importanceLabel = dict.timeline.importance[event.importance] ?? dict.timeline.importance.low

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
              aria-label={dict.common.close}
            >
              ✕
            </button>

            <div className="flex items-center gap-2 flex-wrap pr-10">
              <span className="text-xs text-subtle border border-border px-2 py-0.5">
                {categoryLabel}
              </span>
              <span className="text-xs text-subtle border border-border px-2 py-0.5">
                {importanceLabel}
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

            <Section title={dict.timeline.sections.summary}>{event.summary}</Section>
            {event.background && <Section title={dict.timeline.sections.background}>{event.background}</Section>}
            {event.process && <Section title={dict.timeline.sections.process}>{event.process}</Section>}
            {event.significance && <Section title={dict.timeline.sections.significance}>{event.significance}</Section>}

            {event.figures.length > 0 && (
              <div className="border-t border-border pt-5">
                <h3 className="text-[11px] uppercase tracking-[0.18em] text-subtle mb-3">{dict.timeline.sections.relatedFigures}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {event.figures.map((slug) => (
                    <Link
                      key={slug}
                      href={`/${locale}/figure/${slug}`}
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
            {dict.common.close}
          </button>
        </div>
      </div>
    </div>
  )
}
