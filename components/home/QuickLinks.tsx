import Link from 'next/link'
import { getDictionary, type Locale } from '@/lib/i18n'

export default function QuickLinks({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale)
  const prefix = `/${locale}`

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 border-b border-border">
      <p className="text-[11px] uppercase tracking-[0.22em] text-subtle mb-3">{dict.home.sectionsKicker}</p>
      <h2 className="text-3xl md:text-4xl font-semibold text-text tracking-tight mb-12">
        {dict.home.howToExplore}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-12">
        {dict.home.quickLinks.map(({ href, kicker, title, desc }) => (
          <Link key={href} href={`${prefix}${href}`} className="group block border-t border-text pt-5">
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-xs text-subtle tabular-nums">{kicker}</span>
              <h3 className="text-xl font-semibold text-text tracking-tight group-hover:text-point">
                {title}
              </h3>
            </div>
            <p className="text-sm text-muted leading-relaxed mb-4">{desc}</p>
            <span className="text-xs text-text border-b border-text pb-0.5 group-hover:text-point group-hover:border-point">
              {dict.common.moreDetails} →
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
