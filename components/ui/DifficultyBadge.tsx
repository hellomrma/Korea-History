import type { Difficulty } from '@/types'

const config: Record<Difficulty, { label: string; colorClass: string }> = {
  easy:     { label: '쉬움', colorClass: 'text-difficulty-easy' },
  normal:   { label: '보통', colorClass: 'text-difficulty-normal' },
  advanced: { label: '심화', colorClass: 'text-difficulty-advanced' },
}

export default function DifficultyBadge({ level }: { level: Difficulty }) {
  const { label, colorClass } = config[level]
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${colorClass}`}>
      <span aria-hidden="true" className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}
