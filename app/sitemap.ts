import type { MetadataRoute } from 'next'
import { getAllEras } from '@/lib/eras'
import { getAllFigures } from '@/lib/figures'

const BASE = 'https://korea-history.playgrounder.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,         lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/timeline`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/map`,      lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/figures`,  lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ]
  const eras: MetadataRoute.Sitemap = getAllEras().map((era) => ({
    url: `${BASE}/era/${era.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))
  const figures: MetadataRoute.Sitemap = getAllFigures().map((fig) => ({
    url: `${BASE}/figure/${fig.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))
  return [...staticRoutes, ...eras, ...figures]
}
