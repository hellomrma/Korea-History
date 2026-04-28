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
    <div role="group" aria-label="카테고리 필터" className="flex gap-1.5 flex-wrap mb-12">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
          aria-pressed={selected === cat}
          className={`px-3 py-1 text-xs border transition-colors ${
            selected === cat
              ? 'bg-text text-bg border-text'
              : 'bg-bg text-muted border-border hover:text-text hover:border-text'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
