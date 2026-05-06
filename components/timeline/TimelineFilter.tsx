'use client'
import { getDictionary, type Locale } from '@/lib/i18n'
import type { HistoryEvent } from '@/types'

const sourceCategories: HistoryEvent['category'][] = ['정치', '문화', '전쟁', '과학', '인물']

interface Props {
  selected: string
  onChange: (c: string) => void
  locale: Locale
  allValue: string
}

export default function TimelineFilter({ selected, onChange, locale, allValue }: Props) {
  const dict = getDictionary(locale)
  const buttons: { value: string; label: string }[] = [
    { value: allValue, label: dict.timeline.allCategory },
    ...sourceCategories.map((c) => ({ value: c, label: dict.timeline.categories[c] ?? c })),
  ]

  return (
    <div role="group" aria-label={dict.timeline.categoryFilter} className="flex gap-1.5 flex-wrap mb-12">
      {buttons.map((b) => (
        <button
          key={b.value}
          type="button"
          onClick={() => onChange(b.value)}
          aria-pressed={selected === b.value}
          className={`px-3 py-1 text-xs border ${
            selected === b.value
              ? 'bg-text text-bg border-text'
              : 'bg-bg text-muted border-border hover:text-text hover:border-text'
          }`}
        >
          {b.label}
        </button>
      ))}
    </div>
  )
}
