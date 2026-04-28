import type { Era, Figure, HistoryEvent } from '@/types'

export type SearchItemType = 'figure' | 'event' | 'era'

export interface SearchItem {
  type: SearchItemType
  slug: string
  title: string
  subtitle: string
  meta: string
  href: string
  haystack: string
}

function yearLabel(y: number): string {
  return y < 0 ? `기원전 ${Math.abs(y)}년` : `${y}년`
}

export function buildSearchIndex({
  eras,
  figures,
  events,
}: {
  eras: Era[]
  figures: Figure[]
  events: HistoryEvent[]
}): SearchItem[] {
  const eraNameBySlug = new Map(eras.map((e) => [e.slug, e.name]))

  const eraItems: SearchItem[] = eras.map((era) => {
    const period = `${yearLabel(era.period.start)} — ${era.period.end === null ? '현재' : yearLabel(era.period.end)}`
    return {
      type: 'era',
      slug: era.slug,
      title: era.name,
      subtitle: period,
      meta: era.summary,
      href: `/era/${era.slug}`,
      haystack: [era.name, era.summary, period, ...era.tags].join(' ').toLowerCase(),
    }
  })

  const figureItems: SearchItem[] = figures.map((fig) => {
    const eraName = eraNameBySlug.get(fig.era) ?? fig.era
    const lifespan = `${yearLabel(fig.birth)} — ${fig.death === null ? '미상' : yearLabel(fig.death)}`
    return {
      type: 'figure',
      slug: fig.slug,
      title: fig.name,
      subtitle: `${fig.role} · ${eraName}`,
      meta: lifespan,
      href: `/figure/${fig.slug}`,
      haystack: [fig.name, fig.role, eraName, lifespan, ...fig.tags].join(' ').toLowerCase(),
    }
  })

  const eventItems: SearchItem[] = events.map((ev) => {
    const eraName = eraNameBySlug.get(ev.era) ?? ev.era
    return {
      type: 'event',
      slug: ev.id,
      title: ev.title,
      subtitle: `${yearLabel(ev.year)} · ${ev.category}`,
      meta: eraName,
      href: `/timeline#${encodeURIComponent(ev.id)}`,
      haystack: [ev.title, ev.summary, ev.category, eraName, yearLabel(ev.year)].join(' ').toLowerCase(),
    }
  })

  return [...eraItems, ...figureItems, ...eventItems]
}

export function searchIndex(items: SearchItem[], query: string, limit = 24): SearchItem[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const scored: { item: SearchItem; score: number }[] = []
  for (const item of items) {
    const titleLower = item.title.toLowerCase()
    let score = 0
    if (titleLower === q) score = 100
    else if (titleLower.startsWith(q)) score = 80
    else if (titleLower.includes(q)) score = 60
    else if (item.haystack.includes(q)) score = 30
    if (score > 0) scored.push({ item, score })
  }

  scored.sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, 'ko'))
  return scored.slice(0, limit).map((s) => s.item)
}
