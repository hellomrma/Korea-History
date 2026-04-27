'use client'
import type { Era } from '@/types'

interface Props {
  eras: Era[]
  selectedSlug: string
  onChange: (slug: string) => void
}

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/

export default function EraSelector({ eras, selectedSlug, onChange }: Props) {
  const sorted = [...eras].sort((a, b) => a.order - b.order)
  return (
    <div role="group" aria-label="시대 선택" className="flex gap-2 flex-wrap justify-center mb-8">
      {sorted.map((era) => {
        const safeColor = HEX_COLOR.test(era.color) ? era.color : '#2563eb'
        return (
          <button
            key={era.slug}
            type="button"
            onClick={() => onChange(era.slug)}
            aria-pressed={selectedSlug === era.slug}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedSlug === era.slug
                ? 'text-white shadow-sm'
                : 'bg-bg border border-border text-muted hover:border-point hover:text-point'
            }`}
            style={selectedSlug === era.slug ? { background: safeColor } : {}}
          >
            {era.name}
          </button>
        )
      })}
    </div>
  )
}
