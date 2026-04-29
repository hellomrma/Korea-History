'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Era } from '@/types'

function displayYear(y: number): string {
  return y < 0 ? `기원전 ${Math.abs(y)}년` : `${y}년`
}

export default function EraHero({ eras }: { eras: Era[] }) {
  const sorted = [...eras].sort((a, b) => a.order - b.order)
  const [currentIdx, setCurrentIdx] = useState(6)
  const era = sorted[currentIdx]

  return (
    <section
      className="bg-bg border-b border-border"
      aria-label={`현재 선택된 시대: ${era.name}`}
    >
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <p className="text-[11px] uppercase tracking-[0.22em] text-subtle mb-6">
          5000년의 시간여행 · 한국사
        </p>
        <h1 className="text-5xl md:text-7xl font-semibold text-text tracking-tight leading-[1.05] mb-6">
          {era.name}
        </h1>
        <p className="text-sm text-muted mb-3 tracking-tight">
          {displayYear(era.period.start)} — {era.period.end ? displayYear(era.period.end) : '현재'}
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
          href={`/era/${era.slug}`}
          className="inline-flex items-center gap-2 text-sm text-text border-b border-text pb-0.5 hover:text-point hover:border-point"
        >
          이 시대 탐험하기
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <nav aria-label="시대 선택" className="border-t border-border">
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
