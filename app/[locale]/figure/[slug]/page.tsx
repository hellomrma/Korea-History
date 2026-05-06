import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getFigureBySlug, getAllFigures } from '@/lib/figures'
import { getEraBySlug } from '@/lib/eras'
import { getMDXContent } from '@/lib/content'
import ClientFigureContent from '@/components/figure/ClientFigureContent'
import JsonLd from '@/components/seo/JsonLd'
import { figurePersonSchema, breadcrumbSchema } from '@/lib/jsonld'
import { formatLifespan, formatYear, getDictionary, isLocale, locales } from '@/lib/i18n'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = []
  for (const locale of locales) {
    for (const f of getAllFigures(locale)) {
      params.push({ locale, slug: f.slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const figure = getFigureBySlug(slug, locale)
  if (!figure) return {}
  const lifespan = formatLifespan(figure.birth, figure.death, locale)
  return {
    title: figure.name,
    description: `${figure.name} (${lifespan}) — ${figure.role}`,
    alternates: { canonical: `/${locale}/figure/${slug}` },
  }
}

export default async function FigurePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const figure = getFigureBySlug(slug, locale)
  if (!figure) notFound()

  const era = getEraBySlug(figure.era, locale)
  const content = await getMDXContent('figures', slug, locale)
  const birthLabel = formatYear(figure.birth, locale)
  const deathLabel = figure.death === null ? dict.common.unknown : formatYear(figure.death, locale)
  const prefix = `/${locale}`

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <JsonLd
        data={[
          figurePersonSchema(figure, era?.name, locale),
          breadcrumbSchema([
            { name: dict.common.backToHome, url: prefix },
            { name: dict.figures.title, url: `${prefix}/figures` },
            { name: figure.name, url: `${prefix}/figure/${figure.slug}` },
          ]),
        ]}
      />
      <header className="border-b border-border pb-12 mb-12">
        <p className="text-[11px] uppercase tracking-[0.22em] text-subtle mb-6">{dict.figure.kicker}</p>
        <h1 className="text-5xl md:text-6xl font-semibold text-text tracking-tight leading-[1.05] mb-5">
          {figure.name}
        </h1>
        <p className="text-sm text-muted mb-1">{figure.role}</p>
        <p className="text-sm text-muted tabular-nums mb-5">{birthLabel} — {deathLabel}</p>
        {era && (
          <p className="mb-5">
            <Link
              href={`${prefix}/era/${era.slug}`}
              className="text-sm text-text border-b border-text pb-0.5 hover:text-point hover:border-point"
            >
              {era.name}
            </Link>
          </p>
        )}
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {figure.tags.map((tag) => (
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
          <ClientFigureContent mdxSource={content.mdxSource} />
        </>
      ) : (
        <div className="py-16 text-center text-muted border border-border">
          <p>{dict.figure.contentPending}</p>
        </div>
      )}

      <nav className="flex gap-6 mt-20 pt-10 border-t border-border">
        <Link href={`${prefix}/figures`} aria-label={dict.figure.backToListAria} className="flex-1 group">
          <p className="text-xs text-subtle mb-2"><span aria-hidden="true">←</span> {dict.figure.backToList}</p>
          <p className="text-base font-semibold text-text tracking-tight group-hover:text-point">{dict.figure.allList}</p>
        </Link>
        {era && (
          <Link href={`${prefix}/era/${era.slug}`} aria-label={dict.figure.viewEraAria(era.name)} className="flex-1 text-right group">
            <p className="text-xs text-subtle mb-2">{dict.figure.viewEra}</p>
            <p className="text-base font-semibold text-text tracking-tight group-hover:text-point">{era.name}</p>
          </Link>
        )}
      </nav>
    </div>
  )
}
