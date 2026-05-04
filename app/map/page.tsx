import { getAllEras } from '@/lib/eras'
import { getAllEvents } from '@/lib/events'
import { getAllFigures } from '@/lib/figures'
import ClientHistoryMap from '@/components/map/ClientHistoryMap'

export const metadata = {
  title: '역사 지도',
  description: '시대별 영토 변화와 주요 사건·인물·장소를 지도로 한눈에 확인하세요',
  alternates: { canonical: '/map' },
}

export default function MapPage() {
  const eras = getAllEras().filter((e) => e.slug !== 'modern')
  const events = getAllEvents().filter((ev) => ev.era !== 'modern')
  const figures = getAllFigures().filter((f) => f.era !== 'modern')

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <p className="text-[11px] uppercase tracking-[0.22em] text-subtle mb-6">Map</p>
      <h1 className="text-4xl md:text-5xl font-semibold text-text tracking-tight mb-4">역사 지도</h1>
      <p className="text-base text-muted mb-16 max-w-xl leading-relaxed">
        시대를 선택해 5000년 한국사의 영토·사건·인물·장소를 탐색하세요.
      </p>
      <ClientHistoryMap eras={eras} events={events} figures={figures} />
    </div>
  )
}
