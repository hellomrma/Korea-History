import { getAllEvents } from '@/lib/events'
import { getAllFigures } from '@/lib/figures'
import TimelineView from '@/components/timeline/TimelineView'

export const metadata = {
  title: '인터랙티브 타임라인 — 한국역사',
  description: '한국 역사의 주요 사건을 시간 순으로 탐험하세요',
}

export default function TimelinePage() {
  const events = getAllEvents()
  const figures = getAllFigures()
  const figureMap: Record<string, string> = Object.fromEntries(
    figures.map((f) => [f.slug, f.name])
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl font-bold text-text text-center mb-2">
        인터랙티브 타임라인
      </h1>
      <p className="text-gray-600 text-center mb-10">
        사건 카드를 클릭하면 자세한 내용을 볼 수 있습니다
      </p>
      <TimelineView events={events} figureMap={figureMap} />
    </div>
  )
}
