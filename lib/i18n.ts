import { ko } from './dictionaries/ko'
import { en } from './dictionaries/en'

export const locales = ['ko', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'ko'

const dictionaries = { ko, en }

export type Dictionary = typeof ko

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale]
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

export function localizePath(path: string, locale: Locale): string {
  if (path.startsWith('http')) return path
  const clean = path.startsWith('/') ? path : `/${path}`
  return `/${locale}${clean === '/' ? '' : clean}`
}

export function formatYear(year: number, locale: Locale): string {
  if (locale === 'en') {
    return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`
  }
  return year < 0 ? `기원전 ${Math.abs(year)}년` : `${year}년`
}

export function formatYearRange(
  start: number,
  end: number | null,
  locale: Locale,
): string {
  const dict = getDictionary(locale)
  const startLabel = formatYear(start, locale)
  const endLabel = end === null ? dict.common.present : formatYear(end, locale)
  return `${startLabel} — ${endLabel}`
}

export function formatLifespan(
  birth: number,
  death: number | null,
  locale: Locale,
): string {
  const dict = getDictionary(locale)
  const birthLabel = formatYear(birth, locale)
  const deathLabel = death === null ? dict.common.unknown : formatYear(death, locale)
  return `${birthLabel} — ${deathLabel}`
}
