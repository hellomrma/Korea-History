import erasData from '@/content/data/eras.json'
import type { Era } from '@/types'
import { isExcludedEra } from './exclusions'

export function getAllEras(): Era[] {
  return (erasData as Era[]).filter((era) => !isExcludedEra(era.slug))
}

export function getEraBySlug(slug: string): Era | undefined {
  return getAllEras().find((era) => era.slug === slug)
}

export function getAdjacentEras(slug: string): { prev: Era | null; next: Era | null } {
  const all = getAllEras().sort((a, b) => a.order - b.order)
  const idx = all.findIndex((e) => e.slug === slug)
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  }
}
