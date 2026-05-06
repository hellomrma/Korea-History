import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllFigures } from '@/lib/figures'
import { getAllEras } from '@/lib/eras'
import FigureGrid from '@/components/figures/FigureGrid'
import { getDictionary, isLocale } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  return {
    title: dict.figures.metaTitle,
    description: dict.figures.metaDesc,
    alternates: { canonical: `/${locale}/figures` },
  }
}

export default async function FiguresPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const figures = getAllFigures(locale)
  const eras = getAllEras(locale).sort((a, b) => a.order - b.order)

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <p className="text-[11px] uppercase tracking-[0.22em] text-subtle mb-6">{dict.figures.kicker}</p>
      <h1 className="text-4xl md:text-5xl font-semibold text-text tracking-tight mb-4">{dict.figures.title}</h1>
      <p className="text-base text-muted mb-16 max-w-xl leading-relaxed">
        {dict.figures.desc}
      </p>
      <FigureGrid figures={figures} eras={eras} locale={locale} />
    </div>
  )
}
