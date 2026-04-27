'use client'
import { useContext } from 'react'
import type { Difficulty } from '@/types'
import { DifficultyContext } from '@/lib/difficulty-context'

export default function Level({
  difficulty,
  children,
}: {
  difficulty: Difficulty
  children: React.ReactNode
}) {
  const selected = useContext(DifficultyContext)
  if (selected !== difficulty) return null
  return <div className="level-content">{children}</div>
}
