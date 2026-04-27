'use client'
import type { Difficulty } from '@/types'

const levels: { value: Difficulty; label: string; stars: string }[] = [
  { value: 'easy',     label: '쉬움', stars: '⭐' },
  { value: 'normal',   label: '보통', stars: '⭐⭐' },
  { value: 'advanced', label: '심화', stars: '⭐⭐⭐' },
]

interface Props {
  selected: Difficulty
  onChange: (level: Difficulty) => void
}

export default function LevelSelector({ selected, onChange }: Props) {
  return (
    <div className="inline-flex gap-1 p-1 bg-bg border border-border rounded-xl" role="group" aria-label="콘텐츠 난이도 선택">
      {levels.map(({ value, label, stars }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          aria-pressed={selected === value}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selected === value
              ? 'bg-text text-surface shadow-sm'
              : 'text-muted hover:text-text hover:bg-surface'
          }`}
        >
          <span aria-hidden="true">{stars}</span> {label}
        </button>
      ))}
    </div>
  )
}
