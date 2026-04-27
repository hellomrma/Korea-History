import Link from 'next/link'
import type { Era } from '@/types'

export default function EraCard({ era }: { era: Era }) {
  const startLabel = era.period.start < 0
    ? `기원전 ${Math.abs(era.period.start)}년`
    : `${era.period.start}년`
  const endLabel = era.period.end === null
    ? '현재'
    : era.period.end < 0
      ? `기원전 ${Math.abs(era.period.end)}년`
      : `${era.period.end}년`

  return (
    <Link href={`/era/${era.slug}`} className="block group">
      <div
        className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-traditional-bg"
        style={{ borderTop: `4px solid ${era.color}` }}
      >
        <div className="p-5 bg-white">
          <h3 className="font-serif text-lg font-bold text-traditional-dark mb-1 group-hover:text-traditional transition-colors">
            {era.name}
          </h3>
          <p className="text-xs text-gray-500 mb-2">{startLabel} ~ {endLabel}</p>
          <p className="text-sm text-gray-700 leading-relaxed">{era.summary}</p>
          <div className="flex flex-wrap gap-1 mt-3">
            {era.tags.map((tag) => (
              <span key={tag} className="bg-traditional-bg text-traditional-dark text-xs px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
