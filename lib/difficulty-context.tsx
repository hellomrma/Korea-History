'use client'
import { createContext, useContext, useState } from 'react'
import type { Difficulty } from '@/types'

interface DifficultyContextValue {
  difficulty: Difficulty
  setDifficulty: (d: Difficulty) => void
}

export const DifficultyContext = createContext<DifficultyContextValue>({
  difficulty: 'easy',
  setDifficulty: () => {},
})

export function DifficultyProvider({ children }: { children: React.ReactNode }) {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  return (
    <DifficultyContext.Provider value={{ difficulty, setDifficulty }}>
      {children}
    </DifficultyContext.Provider>
  )
}

export function useDifficulty(): DifficultyContextValue {
  return useContext(DifficultyContext)
}
