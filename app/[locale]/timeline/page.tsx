import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllEvents } from '@/lib/events'
import { getAllFigures } from '@/lib/figures'
import TimelineView from '@/components/timeline/TimelineView'
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
    title: dict.timeline.metaTitle,
    description: dict.timeline.metaDesc,
    alternates: { canonical: `/${locale}/timeline` },
  }
}

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const events = getAllEvents(locale)
  const figures = getAllFigures(locale)
  const figureMap: Record<string, string> = Object.fromEntries(
    figures.map((f) => [f.slug, f.name]),
  )

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <p className="text-[11px] uppercase tracking-[0.22em] text-subtle mb-6">{dict.timeline.kicker}</p>
      <h1 className="text-4xl md:text-5xl font-semibold text-text tracking-tight mb-4">
        {dict.timeline.title}
      </h1>
      <p className="text-base text-muted mb-16 max-w-xl leading-relaxed">
        {dict.timeline.desc}
      </p>
      <Suspense fallback={null}>
        <TimelineView events={events} figureMap={figureMap} locale={locale} />
      </Suspense>
    </div>
  )
}
