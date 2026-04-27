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
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="font-serif text-2xl font-bold text-traditional-dark text-center mb-8">
          전체 시대 보기
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {eras.map((era) => (
            <EraCard key={era.slug} era={era} />
          ))}
        </div>
      </section>
    </>
  )
}
