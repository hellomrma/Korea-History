'use client'
import type { Era } from '@/types'

interface Props {
  eras: Era[]
  selectedSlug: string
  onChange: (slug: string) => void
}

export default function EraSelector({ eras, selectedSlug, onChange }: Props) {
  const sorted = [...eras].sort((a, b) => a.order - b.order)
  return (
    <div role="group" aria-label="시대 선택" className="flex gap-1.5 flex-wrap mb-8">
      {sorted.map((era) => {
        const active = selectedSlug === era.slug
        return (
          <button
            key={era.slug}
            type="button"
            onClick={() => onChange(era.slug)}
            aria-pressed={active}
            className={`px-3 py-1 text-xs border ${
              active
                ? 'bg-text text-bg border-text'
                : 'bg-bg text-muted border-border hover:text-text hover:border-text'
            }`}
          >
            {era.name}
          </button>
        )
      })}
    </div>
  )
}
