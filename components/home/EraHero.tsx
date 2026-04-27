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
      className="relative bg-text text-surface text-center px-4 py-20 era-transition"
      aria-label={`현재 선택된 시대: ${era.name}`}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{ background: `radial-gradient(ellipse at 60% 40%, ${era.color}, transparent 70%)` }}
        aria-hidden="true"
      />
      <div className="relative">
        <p className="text-xs uppercase tracking-widest text-subtle mb-3">5,000년 한국의 역사</p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">{era.name}</h1>
        <p className="text-sm text-subtle mb-1">
          {displayYear(era.period.start)} ~ {era.period.end ? displayYear(era.period.end) : '현재'}
        </p>
        <p className="max-w-md mx-auto text-sm text-subtle mb-8 leading-relaxed">{era.summary}</p>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {era.tags.map((tag) => (
            <span key={tag} className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs text-subtle">
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={`/era/${era.slug}`}
          className="inline-block bg-point text-white font-semibold px-6 py-2.5 rounded-full hover:bg-blue-700 transition-colors mb-10"
        >
          이 시대 탐험하기 →
        </Link>

        <nav aria-label="시대 선택">
          <ul className="flex gap-2 flex-wrap justify-center max-w-2xl mx-auto list-none p-0 m-0">
            {sorted.map((e, idx) => (
              <li key={e.slug}>
                <button
                  type="button"
                  onClick={() => setCurrentIdx(idx)}
                  aria-current={idx === currentIdx ? 'true' : undefined}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    idx === currentIdx
                      ? 'bg-white text-text font-bold'
                      : 'bg-white/10 text-subtle hover:bg-white/20'
                  }`}
                >
                  {e.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
