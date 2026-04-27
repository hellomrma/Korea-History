'use client'
import type { HistoryEvent } from '@/types'

type Category = HistoryEvent['category'] | '전체'

const categories: Category[] = ['전체', '정치', '문화', '전쟁', '과학', '인물']

interface Props {
  selected: Category
  onChange: (c: Category) => void
}

export default function TimelineFilter({ selected, onChange }: Props) {
  return (
    <div role="group" aria-label="카테고리 필터" className="flex gap-2 flex-wrap justify-center mb-10">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
          aria-pressed={selected === cat}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === cat
              ? 'bg-point text-white shadow-sm'
              : 'bg-bg border border-border text-muted hover:border-point hover:text-point'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
