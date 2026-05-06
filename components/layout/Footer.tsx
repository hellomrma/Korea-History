import Link from 'next/link'
import { getDictionary, type Locale } from '@/lib/i18n'

export default function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale)
  const year = new Date().getFullYear()
  const prefix = `/${locale}`
  return (
    <footer data-native-hide className="bg-surface border-t border-border">
      <div className="bg-bg border-b border-border px-4 py-3">
        <p className="max-w-6xl mx-auto text-xs text-muted flex items-start gap-2">
          <span className="flex-shrink-0 text-sm" aria-hidden="true">⚠️</span>
          <span>
            {dict.footer.aiDisclaimerPrefix}
            <strong className="text-text">{dict.footer.aiDisclaimerStrong}</strong>
            {dict.footer.aiDisclaimerSuffix}
            <Link href={`${prefix}/about`} className="underline hover:text-point">
              {dict.footer.aiDisclaimerLink}
            </Link>
            {dict.footer.aiDisclaimerEnd}
          </span>
        </p>
      </div>

      <div className="px-4 py-4">
        <p className="max-w-6xl mx-auto text-xs text-subtle flex items-center justify-center gap-2 flex-wrap">
          <span>© {year} {dict.footer.copyrightAuthor}</span>
          <span aria-hidden="true">·</span>
          <Link href={`${prefix}/about`} className="hover:text-text">
            {dict.footer.aboutLink}
          </Link>
          <span aria-hidden="true">·</span>
          <Link href={`${prefix}/privacy`} className="hover:text-text">
            {dict.footer.privacyLink}
          </Link>
        </p>
      </div>
    </footer>
  )
}
