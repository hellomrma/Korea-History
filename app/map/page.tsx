import { getAllEras } from '@/lib/eras'
import ClientHistoryMap from '@/components/map/ClientHistoryMap'

export const metadata = {
  title: '역사 지도 — 한국역사',
  description: '시대를 선택해 영토와 주요 장소를 확인하세요',
}

export default function MapPage() {
  const eras = getAllEras()
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl font-bold text-traditional-dark text-center mb-2">역사 지도</h1>
      <p className="text-gray-600 text-center mb-8">시대를 선택해 영토와 주요 장소를 확인하세요</p>
      <ClientHistoryMap eras={eras} />
    </div>
  )
}
