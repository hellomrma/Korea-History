import { getAllFigures } from '@/lib/figures'
import { getAllEras } from '@/lib/eras'
import FigureGrid from '@/components/figures/FigureGrid'

export const metadata = {
  title: '인물 도감 — 5000년의 시간여행: 한국사',
  description: '고조선부터 현대까지, 5000년 한국사를 만든 인물들을 만나보세요',
}

export default function FiguresPage() {
  const figures = getAllFigures()
  const eras = getAllEras().sort((a, b) => a.order - b.order)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl font-bold text-text mb-2">인물 도감</h1>
      <p className="text-muted mb-8">5000년 한국사를 이끈 인물들을 만나보세요</p>
      <FigureGrid figures={figures} eras={eras} />
    </div>
  )
}
