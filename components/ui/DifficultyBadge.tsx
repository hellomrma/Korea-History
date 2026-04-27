import type { Difficulty } from '@/types'

const config: Record<Difficulty, { label: string; className: string; stars: string }> = {
  easy:     { label: '쉬움',  className: 'bg-difficulty-easy text-white',     stars: '⭐' },
  normal:   { label: '보통',  className: 'bg-difficulty-normal text-white',   stars: '⭐⭐' },
  advanced: { label: '심화',  className: 'bg-difficulty-advanced text-white', stars: '⭐⭐⭐' },
}

export default function DifficultyBadge({ level }: { level: Difficulty }) {
  const { label, className, stars } = config[level]
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      <span aria-hidden="true">{stars}</span> {label}
    </span>
  )
}
