'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Era } from '@/types'

function displayYear(y: number): string {
  return y < 0 ? `기원전 ${Math.abs(y)}년` : `${y}년`
}

export default function EraHero({ eras }: { eras: Era[] }) {
  const sorted = [...eras].sort((a, b) => a.order - b.order)
  const [currentIdx, setCurrentIdx] = useState(6) // default to 조선 (order 7, index 6)
  const era = sorted[currentIdx]

  return (
    <section
      className="relative min-h-[480px] flex flex-col items-center justify-center text-white text-center px-4 py-16 era-transition"
      style={{ background: `linear-gradient(135deg, #3d1f0d, ${era.color})` }}
      aria-label={`현재 선택된 시대: ${era.name}`}
    >
      <p className="text-sm uppercase tracking-widest opacity-70 mb-2">5,000년 한국의 역사</p>
      <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">{era.name}</h1>
      <p className="text-base opacity-85 mb-1">
        {displayYear(era.period.start)} ~ {era.period.end ? displayYear(era.period.end) : '현재'}
      </p>
      <p className="max-w-md text-sm opacity-80 mb-8">{era.summary}</p>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {era.tags.map((tag) => (
          <span key={tag} className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
            {tag}
          </span>
        ))}
      </div>

      <Link
        href={`/era/${era.slug}`}
        className="bg-white text-traditional font-bold px-6 py-2.5 rounded-full hover:bg-traditional-bg transition-colors mb-10"
      >
        이 시대 탐험하기 →
      </Link>

      <nav aria-label="시대 선택">
        <ul className="flex gap-2 flex-wrap justify-center max-w-2xl list-none p-0 m-0">
          {sorted.map((e, idx) => (
            <li key={e.slug}>
              <button
                type="button"
                onClick={() => setCurrentIdx(idx)}
                aria-current={idx === currentIdx ? 'true' : undefined}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  idx === currentIdx
                    ? 'bg-white text-traditional-dark font-bold scale-105'
                    : 'bg-white/20 hover:bg-white/30'
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
