import type { Era, Figure } from '@/types'

export const SITE_URL = 'https://korea-history.playgrounder.dev'
export const SITE_NAME = 'K-History Explorer'
export const PUBLISHER = '가나다라마박사'

const publisher = {
  '@type': 'Organization',
  name: PUBLISHER,
  url: SITE_URL,
}

// Schema.org allows ISO 8601 with leading "-" for BC dates.
// Pad to 4 digits, prefix with "-" when year < 0.
function isoYear(year: number): string {
  const abs = Math.abs(year).toString().padStart(4, '0')
  return year < 0 ? `-${abs}` : abs
}

function periodLabel(start: number, end: number | null): string {
  const fmt = (y: number) => (y < 0 ? `기원전 ${Math.abs(y)}년` : `${y}년`)
  return `${fmt(start)} — ${end === null ? '현재' : fmt(end)}`
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'ko-KR',
    publisher,
  }
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: PUBLISHER,
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

export function eraArticleSchema(era: Era) {
  const url = `${SITE_URL}/era/${era.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: era.name,
    name: era.name,
    description: era.summary,
    about: {
      '@type': 'Thing',
      name: `${era.name} (${periodLabel(era.period.start, era.period.end)})`,
    },
    keywords: era.tags.join(', '),
    inLanguage: 'ko-KR',
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    author: { '@type': 'Person', name: PUBLISHER },
    publisher,
    url,
  }
}

export function figurePersonSchema(figure: Figure, eraName?: string) {
  const url = `${SITE_URL}/figure/${figure.slug}`
  const description = `${figure.role}${eraName ? ` · ${eraName}` : ''} (${periodLabel(figure.birth, figure.death)})`
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    name: figure.name,
    description,
    birthDate: isoYear(figure.birth),
    ...(figure.death !== null && { deathDate: isoYear(figure.death) }),
    jobTitle: figure.role,
    nationality: { '@type': 'Country', name: '대한민국' },
    knowsAbout: figure.tags,
    url,
  }
}
