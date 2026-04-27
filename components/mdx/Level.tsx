'use client'
import type { Difficulty } from '@/types'
import { useDifficulty } from '@/lib/difficulty-context'

export default function Level({
  difficulty,
  children,
}: {
  difficulty: Difficulty
  children: React.ReactNode
}) {
  const { difficulty: selected } = useDifficulty()
  if (selected !== difficulty) return null
  return <div className="level-content">{children}</div>
}
