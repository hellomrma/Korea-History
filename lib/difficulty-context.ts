'use client'
import { createContext } from 'react'
import type { Difficulty } from '@/types'

export const DifficultyContext = createContext<Difficulty>('easy')
