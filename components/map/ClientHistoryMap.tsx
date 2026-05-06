'use client'
import dynamic from 'next/dynamic'
import type { Era, HistoryEvent, Figure } from '@/types'
import { getDictionary, type Locale } from '@/lib/i18n'

const HistoryMap = dynamic(() => import('./HistoryMap'), {
  ssr: false,
})

export default function ClientHistoryMap({
  eras,
  events,
  figures,
  locale,
}: {
  eras: Era[]
  events: HistoryEvent[]
  figures: Figure[]
  locale: Locale
}) {
  const dict = getDictionary(locale)
  return (
    <HistoryMap
      eras={eras}
      events={events}
      figures={figures}
      locale={locale}
      loadingLabel={dict.map.loading}
    />
  )
}
