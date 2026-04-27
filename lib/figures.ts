import figuresData from '@/content/data/figures.json'
import type { Figure } from '@/types'

export function getAllFigures(): Figure[] {
  return figuresData as Figure[]
}

export function getFigureBySlug(slug: string): Figure | undefined {
  return getAllFigures().find((f) => f.slug === slug)
}

export function getFiguresByEra(eraSlug: string): Figure[] {
  return getAllFigures().filter((f) => f.era === eraSlug)
}
