import eventsData from '@/content/data/events.json'
import eventsEn from '@/content/data/events.en.json'
import type { HistoryEvent } from '@/types'
import { isExcludedEra } from './exclusions'
import { defaultLocale, type Locale } from './i18n'

type EventTranslation = Partial<Pick<HistoryEvent, 'title' | 'summary' | 'background' | 'process' | 'significance'>>

const overrides: Record<Locale, Record<string, EventTranslation>> = {
  ko: {},
  en: eventsEn as Record<string, EventTranslation>,
}

function applyLocale(event: HistoryEvent, locale: Locale): HistoryEvent {
  if (locale === defaultLocale) return event
  const tr = overrides[locale]?.[event.id]
  if (!tr) return event
  return { ...event, ...tr }
}

export function getAllEvents(locale: Locale = defaultLocale): HistoryEvent[] {
  return (eventsData as HistoryEvent[])
    .filter((e) => !isExcludedEra(e.era))
    .map((e) => applyLocale(e, locale))
    .sort((a, b) => a.year - b.year)
}

export function getEventsByEra(
  eraSlug: string,
  locale: Locale = defaultLocale,
): HistoryEvent[] {
  return getAllEvents(locale).filter((e) => e.era === eraSlug)
}

export function getEventsByCategory(
  category: HistoryEvent['category'],
  locale: Locale = defaultLocale,
): HistoryEvent[] {
  return getAllEvents(locale).filter((e) => e.category === category)
}
