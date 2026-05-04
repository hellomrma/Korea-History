import type { Metadata } from 'next'
import SearchPage from '@/components/search/SearchPage'
import { getAllEras } from '@/lib/eras'
import { getAllFigures } from '@/lib/figures'
import { getAllEvents } from '@/lib/events'
import { buildSearchIndex } from '@/lib/search'

export const metadata: Metadata = {
  title: '검색',
  description: '인물·사건·시대를 검색하세요.',
}

export default function Page() {
  const items = buildSearchIndex({
    eras: getAllEras(),
    figures: getAllFigures(),
    events: getAllEvents(),
  })
  return <SearchPage items={items} />
}
