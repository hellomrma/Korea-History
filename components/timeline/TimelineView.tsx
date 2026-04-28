'use client'
import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import TimelineFilter from './TimelineFilter'
import TimelineCard from './TimelineCard'
import EventDetailModal from './EventDetailModal'
import type { HistoryEvent } from '@/types'

type Category = HistoryEvent['category'] | '전체'

export default function TimelineView({
  events,
  figureMap,
}: {
  events: HistoryEvent[]
  figureMap: Record<string, string>
}) {
  const [category, setCategory] = useState<Category>('전체')
  const [selectedEvent, setSelectedEvent] = useState<HistoryEvent | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const filtered = useMemo(() => {
    if (category === '전체') return events
    return events.filter((e) => e.category === category)
  }, [events, category])

  // Sync modal with ?event= query param (e.g. from global search)
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
      <TimelineFilter selected={category} onChange={setCategory} />
      <div className="relative">
        {/* 중앙 세로선 */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" aria-hidden="true" />
        <div className="space-y-8 py-4">
          {filtered.map((event, idx) => (
            <TimelineCard
              key={event.id}
              event={event}
              side={idx % 2 === 0 ? 'left' : 'right'}
              onClick={() => setSelectedEvent(event)}
            />
          ))}
        </div>
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-muted py-16">해당 카테고리의 사건이 없습니다.</p>
      )}

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          figureMap={figureMap}
          onClose={closeModal}
        />
      )}
    </>
  )
}
