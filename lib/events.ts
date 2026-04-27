import eventsData from '@/content/data/events.json'
import type { HistoryEvent } from '@/types'

export function getAllEvents(): HistoryEvent[] {
  return (eventsData as HistoryEvent[]).sort((a, b) => a.year - b.year)
}

export function getEventsByEra(eraSlug: string): HistoryEvent[] {
  return getAllEvents().filter((e) => e.era === eraSlug)
}

export function getEventsByCategory(category: HistoryEvent['category']): HistoryEvent[] {
  return getAllEvents().filter((e) => e.category === category)
}
