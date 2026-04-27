import { getAllEras } from '@/lib/eras'
import { getAllEvents } from '@/lib/events'
import { getAllFigures } from '@/lib/figures'
import ClientHistoryMap from '@/components/map/ClientHistoryMap'

export const metadata = {
  title: '역사 지도 — 한국역사',
  description: '시대를 선택해 영토·주요 사건·인물·장소를 한눈에 확인하세요',
}

export default function MapPage() {
  const eras = getAllEras()
  const events = getAllEvents()
  const figures = getAllFigures()

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl font-bold text-traditional-dark text-center mb-2">역사 지도</h1>
      <p className="text-gray-600 text-center mb-8">시대를 선택해 영토, 사건, 인물, 장소를 탐색하세요</p>
      <ClientHistoryMap eras={eras} events={events} figures={figures} />
    </div>
  )
}
