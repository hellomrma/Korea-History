import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getEraBySlug, getAdjacentEras, getAllEras } from '@/lib/eras'
import { getFiguresByEra } from '@/lib/figures'
import { getMDXContent } from '@/lib/content'
import ClientEraContent from '@/components/era/ClientEraContent'
import FigureCard from '@/components/ui/FigureCard'
import JsonLd from '@/components/seo/JsonLd'
import { eraArticleSchema, breadcrumbSchema } from '@/lib/jsonld'
import { formatYearRange, getDictionary, isLocale, locales } from '@/lib/i18n'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = []
  for (const locale of locales) {
    for (const era of getAllEras(locale)) {
      params.push({ locale, slug: era.slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const era = getEraBySlug(slug, locale)
  if (!era) return {}
  return {
    title: era.name,
    description: era.summary,
    alternates: { canonical: `/${locale}/era/${slug}` },
  }
}

export default async function EraPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const era = getEraBySlug(slug, locale)
  if (!era) notFound()

  const { prev, next } = getAdjacentEras(slug, locale)
  const figures = getFiguresByEra(slug, locale)
  const content = await getMDXContent('eras', slug, locale)
  const period = formatYearRange(era.period.start, era.period.end, locale)
  const prefix = `/${locale}`

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <JsonLd
        data={[
          eraArticleSchema(era, locale),
          breadcrumbSchema([
            { name: dict.common.backToHome, url: prefix },
            { name: dict.era.kicker, url: prefix },
            { name: era.name, url: `${prefix}/era/${era.slug}` },
          ]),
        ]}
      />
      <header className="border-b border-border pb-12 mb-12">
        <p className="text-[11px] uppercase tracking-[0.22em] text-subtle mb-6">{dict.era.kicker}</p>
        <h1 className="text-5xl md:text-6xl font-semibold text-text tracking-tight leading-[1.05] mb-5">
          {era.name}
        </h1>
        <p className="text-sm text-muted tabular-nums mb-5">{period}</p>
        <p className="text-base md:text-lg text-muted leading-relaxed mb-6 max-w-2xl">{era.summary}</p>
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {era.tags.map((tag) => (
            <span key={tag} className="text-xs text-subtle border border-border px-2 py-0.5">{tag}</span>
          ))}
        </div>
      </header>

      {content ? (
        <>
          {content.fallback && (
            <div className="mb-8 px-4 py-3 border border-border text-xs text-muted">
              {dict.notFound.fallbackNotice}
            </div>
          )}
          <ClientEraContent mdxSource={content.mdxSource} />
        </>
      ) : (
        <div className="py-16 text-center text-muted border border-border">
          <p>{dict.era.contentPending}</p>
        </div>
      )}

      {figures.length > 0 && (
        <section className="mt-20">
          <p className="text-[11px] uppercase tracking-[0.22em] text-subtle mb-3">{dict.era.figuresKicker}</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-text tracking-tight mb-10">
            {dict.era.figuresTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {figures.map((fig) => <FigureCard key={fig.slug} figure={fig} locale={locale} />)}
          </div>
        </section>
      )}

      <nav className="flex justify-between mt-20 gap-6 pt-10 border-t border-border">
        {prev ? (
          <Link
            href={`${prefix}/era/${prev.slug}`}
            aria-label={dict.era.prevAria(prev.name)}
            className="flex-1 group"
          >
            <p className="text-xs text-subtle mb-2"><span aria-hidden="true">←</span> {dict.era.prev}</p>
            <p className="text-base font-semibold text-text tracking-tight group-hover:text-point">{prev.name}</p>
          </Link>
        ) : <div className="flex-1" />}
        {next ? (
          <Link
            href={`${prefix}/era/${next.slug}`}
            aria-label={dict.era.nextAria(next.name)}
            className="flex-1 text-right group"
          >
            <p className="text-xs text-subtle mb-2">{dict.era.next} <span aria-hidden="true">→</span></p>
            <p className="text-base font-semibold text-text tracking-tight group-hover:text-point">{next.name}</p>
          </Link>
        ) : <div className="flex-1" />}
      </nav>
    </div>
  )
}
