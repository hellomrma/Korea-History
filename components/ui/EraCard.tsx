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
        className="rounded-xl overflow-hidden border border-border hover:border-point hover:shadow-md transition-all bg-surface"
        style={{ borderTop: `4px solid ${era.color}` }}
      >
        <div className="p-5">
          <h3 className="font-serif text-lg font-bold text-text mb-1 group-hover:text-point transition-colors">
            {era.name}
          </h3>
          <p className="text-xs text-muted mb-2">{startLabel} ~ {endLabel}</p>
          <p className="text-sm text-muted leading-relaxed">{era.summary}</p>
          <div className="flex flex-wrap gap-1 mt-3">
            {era.tags.map((tag) => (
              <span key={tag} className="bg-bg text-muted text-xs px-2 py-0.5 rounded-full border border-border">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
