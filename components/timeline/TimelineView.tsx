'use client'
import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import TimelineFilter from './TimelineFilter'
import TimelineCard from './TimelineCard'
import EventDetailModal from './EventDetailModal'
import type { HistoryEvent } from '@/types'
import { getDictionary, type Locale } from '@/lib/i18n'

const ALL = '__all__'

export default function TimelineView({
  events,
  figureMap,
  locale,
}: {
  events: HistoryEvent[]
  figureMap: Record<string, string>
  locale: Locale
}) {
  const dict = getDictionary(locale)
  const [category, setCategory] = useState<string>(ALL)
  const [selectedEvent, setSelectedEvent] = useState<HistoryEvent | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const filtered = useMemo(() => {
    if (category === ALL) return events
    return events.filter((e) => e.category === category)
  }, [events, category])

  const eventParam = searchParams.get('event')
  useEffect(() => {
    if (!eventParam) {
      setSelectedEvent(null)
      return
    }
    const event = events.find((e) => e.id === eventParam)
    if (event) setSelectedEvent(event)
  }, [eventParam, events])

  const closeModal = () => {
    setSelectedEvent(null)
    if (eventParam) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('event')
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    }
  }

  return (
    <>
      <TimelineFilter selected={category} onChange={setCategory} locale={locale} allValue={ALL} />
      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" aria-hidden="true" />
        <div className="space-y-8 py-4">
          {filtered.map((event, idx) => (
            <TimelineCard
              key={event.id}
              event={event}
              side={idx % 2 === 0 ? 'left' : 'right'}
              onClick={() => setSelectedEvent(event)}
              locale={locale}
            />
          ))}
        </div>
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-muted py-16">{dict.timeline.noEvents}</p>
      )}

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          figureMap={figureMap}
          onClose={closeModal}
          locale={locale}
        />
      )}
    </>
  )
}
