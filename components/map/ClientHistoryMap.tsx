'use client'
import dynamic from 'next/dynamic'
import type { Era, HistoryEvent, Figure } from '@/types'

const HistoryMap = dynamic(() => import('./HistoryMap'), {
  ssr: false,
  loading: () => (
    <div className="bg-blue-50 rounded-2xl h-96 flex items-center justify-center text-gray-400">
      지도를 불러오는 중...
    </div>
  ),
})

export default function ClientHistoryMap({
  eras,
  events,
  figures,
}: {
  eras: Era[]
  events: HistoryEvent[]
  figures: Figure[]
}) {
  return <HistoryMap eras={eras} events={events} figures={figures} />
}
