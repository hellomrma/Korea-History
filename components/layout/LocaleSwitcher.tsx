'use client'
import { usePathname, useRouter } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n'

export default function LocaleSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter()
  const pathname = usePathname()

  const swapLocale = (next: Locale) => {
    if (next === locale) return
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length === 0) {
      router.push(`/${next}`)
      return
    }
    segments[0] = next
    router.push(`/${segments.join('/')}`)
  }

  return (
    <div role="group" aria-label="Language" className="flex items-center text-[11px] tracking-[0.12em] uppercase">
      {locales.map((l, idx) => (
        <span key={l} className="flex items-center">
          {idx > 0 && <span aria-hidden="true" className="text-subtle mx-1.5">·</span>}
          <button
            type="button"
            onClick={() => swapLocale(l)}
            aria-current={l === locale ? 'true' : undefined}
            className={l === locale ? 'text-text' : 'text-muted hover:text-text'}
          >
            {l === 'ko' ? 'KO' : 'EN'}
          </button>
        </span>
      ))}
    </div>
  )
}
