import Link from 'next/link'
import type { Figure } from '@/types'
import { ROLE_ICONS } from '@/lib/roleIcons'

export default function FigureCard({ figure }: { figure: Figure }) {
  const icon = ROLE_ICONS[figure.role] ?? '👤'

  return (
    <Link href={`/figure/${figure.slug}`} className="block group">
      <div className="bg-surface rounded-xl border border-border hover:border-point hover:shadow-md transition-all p-5 text-center">
        <div
          className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl bg-bg border border-border"
          aria-hidden="true"
        >
          {icon}
        </div>
        <h3 className="font-serif font-bold text-text group-hover:text-point transition-colors">
          {figure.name}
        </h3>
        <p className="text-xs text-muted mt-1">
          {figure.birth}년 ~ {figure.death !== null ? `${figure.death}년` : '미상'}
        </p>
        <p className="text-xs text-point mt-1 font-medium">{figure.role}</p>
        <div className="flex flex-wrap justify-center gap-1 mt-3">
          {figure.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="bg-bg text-muted text-xs px-2 py-0.5 rounded-full border border-border">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
