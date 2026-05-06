import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import SearchPage from '@/components/search/SearchPage'
import { getAllEras } from '@/lib/eras'
import { getAllFigures } from '@/lib/figures'
import { getAllEvents } from '@/lib/events'
import { buildSearchIndex } from '@/lib/search'
import { getDictionary, isLocale } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  return { title: dict.search.metaTitle, description: dict.search.metaDesc }
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const items = buildSearchIndex(
    {
      eras: getAllEras(locale),
      figures: getAllFigures(locale),
      events: getAllEvents(locale),
    },
    locale,
  )
  return <SearchPage items={items} locale={locale} />
}
