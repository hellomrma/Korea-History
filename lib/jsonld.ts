import type { Era, Figure } from '@/types'
import { defaultLocale, formatYearRange, getDictionary, type Locale } from './i18n'

export const SITE_URL = 'https://korea-history.playgrounder.dev'
export const SITE_NAME = 'K-History Explorer'

function publisherFor(locale: Locale) {
  return {
    '@type': 'Organization',
    name: getDictionary(locale).meta.creator,
    url: SITE_URL,
  }
}

function inLanguageFor(locale: Locale): string {
  return locale === 'en' ? 'en-US' : 'ko-KR'
}

// Schema.org allows ISO 8601 with leading "-" for BC dates.
function isoYear(year: number): string {
  const abs = Math.abs(year).toString().padStart(4, '0')
  return year < 0 ? `-${abs}` : abs
}

export function websiteSchema(locale: Locale = defaultLocale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: inLanguageFor(locale),
    publisher: publisherFor(locale),
  }
}

export function organizationSchema(locale: Locale = defaultLocale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: getDictionary(locale).meta.creator,
    url: SITE_URL,
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  }
}

export function eraArticleSchema(era: Era, locale: Locale = defaultLocale) {
  const url = `${SITE_URL}/${locale}/era/${era.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: era.name,
    name: era.name,
    description: era.summary,
    about: {
      '@type': 'Thing',
      name: `${era.name} (${formatYearRange(era.period.start, era.period.end, locale)})`,
    },
    keywords: era.tags.join(', '),
    inLanguage: inLanguageFor(locale),
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    author: { '@type': 'Person', name: getDictionary(locale).meta.creator },
    publisher: publisherFor(locale),
    url,
  }
}

export function figurePersonSchema(figure: Figure, eraName: string | undefined, locale: Locale = defaultLocale) {
  const url = `${SITE_URL}/${locale}/figure/${figure.slug}`
  const lifespan = formatYearRange(figure.birth, figure.death, locale)
  const description = `${figure.role}${eraName ? ` · ${eraName}` : ''} (${lifespan})`
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    name: figure.name,
    description,
    birthDate: isoYear(figure.birth),
    ...(figure.death !== null && { deathDate: isoYear(figure.death) }),
    jobTitle: figure.role,
    nationality: { '@type': 'Country', name: locale === 'en' ? 'Republic of Korea' : '대한민국' },
    knowsAbout: figure.tags,
    url,
  }
}
