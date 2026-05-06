import type { MetadataRoute } from 'next'
import { getAllEras } from '@/lib/eras'
import { getAllFigures } from '@/lib/figures'
import { locales } from '@/lib/i18n'

const BASE = 'https://korea-history.playgrounder.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    entries.push(
      { url: `${BASE}/${locale}`,          lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
      { url: `${BASE}/${locale}/timeline`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
      { url: `${BASE}/${locale}/map`,      lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
      { url: `${BASE}/${locale}/figures`,  lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    )
    for (const era of getAllEras(locale)) {
      entries.push({
        url: `${BASE}/${locale}/era/${era.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
    for (const fig of getAllFigures(locale)) {
      entries.push({
        url: `${BASE}/${locale}/figure/${fig.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  }

  return entries
}
