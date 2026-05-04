import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import { websiteSchema, organizationSchema } from '@/lib/jsonld'

const GA_MEASUREMENT_ID = 'G-MCDRXC7JJ8'

const SITE_URL = 'https://korea-history.playgrounder.dev'
const SITE_NAME = 'K-History Explorer'
const SITE_DESC = '고조선부터 현대까지, 5000년 한국의 시간여행 — 모든 세대를 위한 한국사 학습'

const NO_FLASH_THEME_SCRIPT = `(function(){try{var m=localStorage.getItem('theme')||'light';var d=m==='dark'||(m==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`

const NATIVE_APP_SCRIPT = `(function(){try{if(navigator.userAgent.indexOf('KoreaHistoryApp')>-1)document.documentElement.classList.add('native-app');}catch(e){}})();`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s — ${SITE_NAME}` },
  description: SITE_DESC,
  authors: [{ name: '가나다라마박사' }],
  creator: '가나다라마박사',
  publisher: '가나다라마박사',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESC,
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESC,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: NATIVE_APP_SCRIPT }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <JsonLd data={[websiteSchema(), organizationSchema()]} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
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
