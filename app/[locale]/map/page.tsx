import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllEras } from '@/lib/eras'
import { getAllEvents } from '@/lib/events'
import { getAllFigures } from '@/lib/figures'
import ClientHistoryMap from '@/components/map/ClientHistoryMap'
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
    title: dict.map.metaTitle,
    description: dict.map.metaDesc,
    alternates: { canonical: `/${locale}/map` },
  }
}

export default async function MapPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const eras = getAllEras(locale)
  const events = getAllEvents(locale)
  const figures = getAllFigures(locale)

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <p className="text-[11px] uppercase tracking-[0.22em] text-subtle mb-6">{dict.map.kicker}</p>
      <h1 className="text-4xl md:text-5xl font-semibold text-text tracking-tight mb-4">{dict.map.title}</h1>
      <p className="text-base text-muted mb-16 max-w-xl leading-relaxed">
        {dict.map.desc}
      </p>
      <ClientHistoryMap eras={eras} events={events} figures={figures} locale={locale} />
    </div>
  )
}
