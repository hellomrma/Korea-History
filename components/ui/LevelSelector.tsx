'use client'
import type { Difficulty } from '@/types'

const levels: { value: Difficulty; label: string }[] = [
  { value: 'easy',     label: '쉬움' },
  { value: 'normal',   label: '보통' },
  { value: 'advanced', label: '심화' },
]

interface Props {
  selected: Difficulty
  onChange: (level: Difficulty) => void
}

export default function LevelSelector({ selected, onChange }: Props) {
  return (
    <div className="inline-flex border border-border" role="group" aria-label="콘텐츠 난이도 선택">
      {levels.map(({ value, label }, idx) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          aria-pressed={selected === value}
          className={`px-4 py-2 text-sm transition-colors ${idx > 0 ? 'border-l border-border' : ''} ${
            selected === value
              ? 'bg-text text-bg'
              : 'text-muted hover:text-text bg-bg'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
