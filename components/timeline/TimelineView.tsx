'use client'
import { useState, useMemo, useEffect } from 'react'
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

  const filtered = useMemo(() => {
    if (category === '전체') return events
    return events.filter((e) => e.category === category)
  }, [events, category])

  // Open modal when URL hash matches an event id (e.g. from global search)
  useEffect(() => {
    const openFromHash = () => {
      const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''))
      if (!hash) return
      const event = events.find((e) => e.id === hash)
      if (event) setSelectedEvent(event)
    }
    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [events])

  const closeModal = () => {
    setSelectedEvent(null)
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search)
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
