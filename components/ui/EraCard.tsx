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
    <Link href={`/era/${era.slug}`} className="group block border-t border-text pt-5">
      <p className="text-xs text-subtle tabular-nums mb-2">{startLabel} — {endLabel}</p>
      <h3 className="text-xl font-semibold text-text tracking-tight mb-3 group-hover:text-point transition-colors">
        {era.name}
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4">{era.summary}</p>
      <div className="flex flex-wrap gap-x-2 gap-y-1">
        {era.tags.map((tag) => (
          <span key={tag} className="text-xs text-subtle border border-border px-2 py-0.5">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}
