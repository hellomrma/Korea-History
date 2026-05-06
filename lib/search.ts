import type { Era, Figure, HistoryEvent } from '@/types'
import { defaultLocale, formatLifespan, formatYear, formatYearRange, getDictionary, type Locale } from './i18n'

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

export function buildSearchIndex(
  {
    eras,
    figures,
    events,
  }: {
    eras: Era[]
    figures: Figure[]
    events: HistoryEvent[]
  },
  locale: Locale = defaultLocale,
): SearchItem[] {
  const dict = getDictionary(locale)
  const prefix = `/${locale}`
  const eraNameBySlug = new Map(eras.map((e) => [e.slug, e.name]))

  const eraItems: SearchItem[] = eras.map((era) => {
    const period = formatYearRange(era.period.start, era.period.end, locale)
    return {
      type: 'era',
      slug: era.slug,
      title: era.name,
      subtitle: period,
      meta: era.summary,
      href: `${prefix}/era/${era.slug}`,
      haystack: [era.name, era.summary, period, ...era.tags].join(' ').toLowerCase(),
    }
  })

  const figureItems: SearchItem[] = figures.map((fig) => {
    const eraName = eraNameBySlug.get(fig.era) ?? fig.era
    const lifespan = formatLifespan(fig.birth, fig.death, locale)
    return {
      type: 'figure',
      slug: fig.slug,
      title: fig.name,
      subtitle: `${fig.role} · ${eraName}`,
      meta: lifespan,
      href: `${prefix}/figure/${fig.slug}`,
      haystack: [fig.name, fig.role, eraName, lifespan, ...fig.tags].join(' ').toLowerCase(),
    }
  })

  const eventItems: SearchItem[] = events.map((ev) => {
    const eraName = eraNameBySlug.get(ev.era) ?? ev.era
    const categoryLabel = dict.timeline.categories[ev.category] ?? ev.category
    const yLabel = formatYear(ev.year, locale)
    return {
      type: 'event',
      slug: ev.id,
      title: ev.title,
      subtitle: `${yLabel} · ${categoryLabel}`,
      meta: eraName,
      href: `${prefix}/timeline?event=${encodeURIComponent(ev.id)}`,
      haystack: [ev.title, ev.summary, ev.category, categoryLabel, eraName, yLabel].join(' ').toLowerCase(),
    }
  })

  return [...eraItems, ...figureItems, ...eventItems]
}

export function searchIndex(items: SearchItem[], query: string, limit = 24, locale: Locale = defaultLocale): SearchItem[] {
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

  scored.sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, locale))
  return scored.slice(0, limit).map((s) => s.item)
}
