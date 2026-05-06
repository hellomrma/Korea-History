import type { Metadata } from 'next'
import Script from 'next/script'
import { notFound } from 'next/navigation'
import '../globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import { websiteSchema, organizationSchema, SITE_URL } from '@/lib/jsonld'
import { getDictionary, isLocale, locales, type Locale } from '@/lib/i18n'

const GA_MEASUREMENT_ID = 'G-MCDRXC7JJ8'

const NO_FLASH_THEME_SCRIPT = `(function(){try{var m=localStorage.getItem('theme')||'light';var d=m==='dark'||(m==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`

const NATIVE_APP_SCRIPT = `(function(){try{if(navigator.userAgent.indexOf('KoreaHistoryApp')>-1)document.documentElement.classList.add('native-app');}catch(e){}})();`

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  const languages: Record<string, string> = {}
  for (const l of locales) languages[l] = `/${l}`

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: dict.meta.siteName, template: `%s — ${dict.meta.siteName}` },
    description: dict.meta.siteDesc,
    authors: [{ name: dict.meta.creator }],
    creator: dict.meta.creator,
    publisher: dict.meta.creator,
    alternates: {
      canonical: `/${locale}`,
      languages,
    },
    openGraph: {
      type: 'website',
      url: `/${locale}`,
      siteName: dict.meta.siteName,
      title: dict.meta.siteName,
      description: dict.meta.siteDesc,
      locale: dict.meta.ogLocale,
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.meta.siteName,
      description: dict.meta.siteDesc,
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const typedLocale: Locale = locale
  const dict = getDictionary(typedLocale)

  return (
    <html lang={dict.meta.htmlLang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: NATIVE_APP_SCRIPT }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <JsonLd data={[websiteSchema(typedLocale), organizationSchema(typedLocale)]} />
        <Header locale={typedLocale} />
        <main className="flex-1">{children}</main>
        <Footer locale={typedLocale} />
        {process.env.NODE_ENV === 'production' && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
