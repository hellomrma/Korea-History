'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Era } from '@/types'
import { formatYear, getDictionary, type Locale } from '@/lib/i18n'

export default function EraHero({ eras, locale }: { eras: Era[]; locale: Locale }) {
  const dict = getDictionary(locale)
  const sorted = [...eras].sort((a, b) => a.order - b.order)
  const [currentIdx, setCurrentIdx] = useState(6)
  const era = sorted[currentIdx]
  const prefix = `/${locale}`

  const startLabel = formatYear(era.period.start, locale)
  const endLabel = era.period.end === null ? dict.common.present : formatYear(era.period.end, locale)

  return (
    <section
      className="bg-bg border-b border-border"
      aria-label={dict.home.currentEraAria(era.name)}
    >
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <p className="text-[11px] uppercase tracking-[0.22em] text-subtle mb-6">
          K-History {dict.nav.explorer}
        </p>
        <h1 className="text-5xl md:text-7xl font-semibold text-text tracking-tight leading-[1.05] mb-6">
          {era.name}
        </h1>
        <p className="text-sm text-muted mb-3 tracking-tight">
          {startLabel} — {endLabel}
        </p>
        <p className="max-w-2xl text-base md:text-lg text-muted mb-8 leading-relaxed">
          {era.summary}
        </p>

        <div className="flex flex-wrap gap-x-2 gap-y-1 mb-10">
          {era.tags.map((tag) => (
            <span key={tag} className="text-xs text-subtle border border-border px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={`${prefix}/era/${era.slug}`}
          className="inline-flex items-center gap-2 text-sm text-text border-b border-text pb-0.5 hover:text-point hover:border-point"
        >
          {dict.home.exploreThisEra}
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <nav aria-label={dict.home.eraSelectorAria} className="border-t border-border">
        <ul className="max-w-6xl mx-auto px-6 py-4 flex gap-1 flex-wrap list-none">
          {sorted.map((e, idx) => (
            <li key={e.slug}>
              <button
                type="button"
                onClick={() => setCurrentIdx(idx)}
                aria-current={idx === currentIdx ? 'true' : undefined}
                className={`px-3 py-1.5 text-xs ${
                  idx === currentIdx
                    ? 'bg-text text-bg'
                    : 'text-muted hover:text-text'
                }`}
              >
                {e.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  )
}
