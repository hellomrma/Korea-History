import figuresData from '@/content/data/figures.json'
import figuresEn from '@/content/data/figures.en.json'
import type { Figure } from '@/types'
import { isExcludedEra } from './exclusions'
import { defaultLocale, type Locale } from './i18n'

type FigureTranslation = Pick<Figure, 'name' | 'role' | 'tags'>

const overrides: Record<Locale, Record<string, FigureTranslation>> = {
  ko: {},
  en: figuresEn as Record<string, FigureTranslation>,
}

function applyLocale(figure: Figure, locale: Locale): Figure {
  if (locale === defaultLocale) return figure
  const tr = overrides[locale]?.[figure.slug]
  if (!tr) return figure
  return { ...figure, ...tr }
}

export function getAllFigures(locale: Locale = defaultLocale): Figure[] {
  return (figuresData as Figure[])
    .filter((f) => !isExcludedEra(f.era))
    .map((f) => applyLocale(f, locale))
}

export function getFigureBySlug(
  slug: string,
  locale: Locale = defaultLocale,
): Figure | undefined {
  return getAllFigures(locale).find((f) => f.slug === slug)
}

export function getFiguresByEra(
  eraSlug: string,
  locale: Locale = defaultLocale,
): Figure[] {
  return getAllFigures(locale).filter((f) => f.era === eraSlug)
}
