import { getAllFigures } from '@/lib/figures'
import { getAllEras } from '@/lib/eras'
import FigureGrid from '@/components/figures/FigureGrid'

export const metadata = {
  title: '인물 도감 — 한국역사',
  description: '한국 역사를 만든 위인들을 만나보세요',
}

export default function FiguresPage() {
  const figures = getAllFigures()
  const eras = getAllEras().sort((a, b) => a.order - b.order)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl font-bold text-traditional-dark mb-2">인물 도감</h1>
      <p className="text-gray-600 mb-8">한국 역사를 만든 위인들을 만나보세요</p>
      <FigureGrid figures={figures} eras={eras} />
    </div>
  )
}
