import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getAllEras } from '@/lib/eras'
import { getAllFigures } from '@/lib/figures'
import { getAllEvents } from '@/lib/events'
import { buildSearchIndex } from '@/lib/search'

const SITE_URL = 'https://korea-history.playgrounder.dev'
const SITE_NAME = '5000년의 시간여행: 한국사'
const SITE_DESC = '고조선부터 현대까지, 5000년 한국의 시간여행 — 모든 세대를 위한 한국사 학습'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s — ${SITE_NAME}` },
  description: SITE_DESC,
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
  const searchItems = buildSearchIndex({
    eras: getAllEras(),
    figures: getAllFigures(),
    events: getAllEvents(),
  })

  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col">
        <Header searchItems={searchItems} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
