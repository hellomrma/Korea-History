import { notFound } from 'next/navigation'
import { getAllEras } from '@/lib/eras'
import EraHero from '@/components/home/EraHero'
import QuickLinks from '@/components/home/QuickLinks'
import EraCard from '@/components/ui/EraCard'
import { getDictionary, isLocale } from '@/lib/i18n'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const eras = getAllEras(locale).sort((a, b) => a.order - b.order)

  return (
    <>
      <EraHero eras={eras} locale={locale} />
      <QuickLinks locale={locale} />
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-baseline justify-between mb-10">
          <p className="text-[11px] uppercase tracking-[0.22em] text-subtle">{dict.home.allErasKicker}</p>
          <span className="text-xs text-subtle tabular-nums">{dict.home.erasCount(eras.length)}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold text-text tracking-tight mb-10">
          {dict.home.allErasTitle}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {eras.map((era) => (
            <EraCard key={era.slug} era={era} locale={locale} />
          ))}
        </div>
      </section>
    </>
  )
}
