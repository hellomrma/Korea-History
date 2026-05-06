import erasData from '@/content/data/eras.json'
import erasEn from '@/content/data/eras.en.json'
import type { Era } from '@/types'
import { isExcludedEra } from './exclusions'
import { defaultLocale, type Locale } from './i18n'

type EraTranslation = Pick<Era, 'name' | 'summary' | 'tags'>

const overrides: Record<Locale, Record<string, EraTranslation>> = {
  ko: {},
  en: erasEn as Record<string, EraTranslation>,
}

function applyLocale(era: Era, locale: Locale): Era {
  if (locale === defaultLocale) return era
  const tr = overrides[locale]?.[era.slug]
  if (!tr) return era
  return { ...era, ...tr }
}

export function getAllEras(locale: Locale = defaultLocale): Era[] {
  return (erasData as Era[])
    .filter((era) => !isExcludedEra(era.slug))
    .map((era) => applyLocale(era, locale))
}

export function getEraBySlug(slug: string, locale: Locale = defaultLocale): Era | undefined {
  return getAllEras(locale).find((era) => era.slug === slug)
}

export function getAdjacentEras(
  slug: string,
  locale: Locale = defaultLocale,
): { prev: Era | null; next: Era | null } {
  const all = getAllEras(locale).sort((a, b) => a.order - b.order)
  const idx = all.findIndex((e) => e.slug === slug)
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  }
}
