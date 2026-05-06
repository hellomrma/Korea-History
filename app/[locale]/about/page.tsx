import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getDictionary, isLocale } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  return { title: dict.about.metaTitle, description: dict.about.metaDesc }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <p className="text-[11px] uppercase tracking-[0.22em] text-subtle mb-3">{dict.about.kicker}</p>
      <h1 className="text-3xl md:text-4xl font-semibold text-text tracking-tight mb-12">
        {dict.about.title}
      </h1>

      <section className="border-t border-border pt-8 mb-12">
        <h2 className="text-xs font-bold text-text uppercase tracking-wider mb-4">
          {dict.about.section1Title}
        </h2>
        <p className="text-sm text-muted leading-relaxed">
          {dict.about.section1Body}
        </p>
      </section>

      <section className="border-t border-border pt-8 mb-12">
        <h2 className="text-xs font-bold text-text uppercase tracking-wider mb-4">
          {dict.about.aiNoticeTitle}
        </h2>
        <p className="text-sm text-muted leading-relaxed">
          {dict.about.aiNoticeBody}
        </p>
      </section>

      <section className="border-t border-border pt-8 mb-12">
        <h2 className="text-xs font-bold text-text uppercase tracking-wider mb-4">
          {dict.about.referencesTitle}
        </h2>
        <ul className="space-y-2">
          {dict.about.references.map(({ label, url }) => (
            <li key={url}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted hover:text-point"
              >
                {label} ↗
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border pt-8 mb-12">
        <h2 className="text-xs font-bold text-text uppercase tracking-wider mb-4">
          {dict.about.usageTitle}
        </h2>
        <ul className="space-y-2">
          {dict.about.usageNotes.map((note) => (
            <li key={note} className="text-sm text-muted leading-relaxed">
              {note}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
