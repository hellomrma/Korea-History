import Link from 'next/link'
import type { Figure } from '@/types'
import { formatLifespan, type Locale } from '@/lib/i18n'

export default function FigureCard({ figure, locale }: { figure: Figure; locale: Locale }) {
  const lifespan = formatLifespan(figure.birth, figure.death, locale)
  return (
    <Link href={`/${locale}/figure/${figure.slug}`} className="group block border-t border-text pt-5">
      <p className="text-xs text-subtle tabular-nums mb-2">{lifespan}</p>
      <h3 className="text-lg font-semibold text-text tracking-tight mb-1 group-hover:text-point">
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
