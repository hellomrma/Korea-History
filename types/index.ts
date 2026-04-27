export type Difficulty = 'easy' | 'normal' | 'advanced'

export interface Era {
  slug: string
  name: string
  period: { start: number; end: number | null }
  order: number
  color: string
  thumbnail: string
  summary: string
  tags: string[]
  difficulties: Difficulty[]
}

export interface Figure {
  slug: string
  name: string
  era: string
  birth: number
  death: number | null
  role: string
  tags: string[]
  thumbnail: string
  difficulties: Difficulty[]
}

export interface HistoryEvent {
  id: string
  year: number
  title: string
  era: string
  figures: string[]
  category: '정치' | '문화' | '전쟁' | '과학' | '인물'
  importance: 'high' | 'medium' | 'low'
  summary: string
}
