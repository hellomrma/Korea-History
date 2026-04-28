import { getAllEras } from '@/lib/eras'
import EraHero from '@/components/home/EraHero'
import QuickLinks from '@/components/home/QuickLinks'
import EraCard from '@/components/ui/EraCard'

export default function HomePage() {
  const eras = getAllEras().sort((a, b) => a.order - b.order)

  return (
    <>
      <EraHero eras={eras} />
      <QuickLinks />
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-baseline justify-between mb-10">
          <p className="text-[11px] uppercase tracking-[0.22em] text-subtle">All Eras</p>
          <span className="text-xs text-subtle tabular-nums">{eras.length} eras</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold text-text tracking-tight mb-10">
          전체 시대 보기
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {eras.map((era) => (
            <EraCard key={era.slug} era={era} />
          ))}
        </div>
      </section>
    </>
  )
}
