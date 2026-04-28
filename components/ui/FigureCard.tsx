import Link from 'next/link'
import type { Figure } from '@/types'

export default function FigureCard({ figure }: { figure: Figure }) {
  return (
    <Link href={`/figure/${figure.slug}`} className="group block border-t border-text pt-5">
      <p className="text-xs text-subtle tabular-nums mb-2">
        {figure.birth}년 — {figure.death !== null ? `${figure.death}년` : '미상'}
      </p>
      <h3 className="text-lg font-semibold text-text tracking-tight mb-1 group-hover:text-point transition-colors">
        {figure.name}
      </h3>
      <p className="text-xs text-muted mb-3">{figure.role}</p>
      <div className="flex flex-wrap gap-x-2 gap-y-1">
        {figure.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-xs text-subtle border border-border px-2 py-0.5">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}
