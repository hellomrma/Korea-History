import { getAllFigures } from '@/lib/figures'
import { getAllEras } from '@/lib/eras'
import FigureGrid from '@/components/figures/FigureGrid'

export const metadata = {
  title: '인물 도감',
  description: '고조선부터 현대까지, 5000년 한국사를 만든 인물들을 만나보세요',
  alternates: { canonical: '/figures' },
}

export default function FiguresPage() {
  const figures = getAllFigures()
  const eras = getAllEras().sort((a, b) => a.order - b.order)

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <p className="text-[11px] uppercase tracking-[0.22em] text-subtle mb-6">Figures</p>
      <h1 className="text-4xl md:text-5xl font-semibold text-text tracking-tight mb-4">인물 도감</h1>
      <p className="text-base text-muted mb-16 max-w-xl leading-relaxed">
        5000년 한국사를 이끈 인물들을 만나보세요.
      </p>
      <FigureGrid figures={figures} eras={eras} />
    </div>
  )
}
