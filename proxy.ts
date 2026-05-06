import { NextRequest, NextResponse } from 'next/server'
import { defaultLocale, locales } from '@/lib/i18n'

const STATIC_PREFIXES = ['/_next', '/api', '/images', '/fonts', '/favicon']
const STATIC_FILES = new Set(['/robots.txt', '/sitemap.xml', '/favicon.ico'])

function pickLocale(request: NextRequest): string {
  const accept = request.headers.get('accept-language') ?? ''
  for (const part of accept.split(',')) {
    const tag = part.split(';')[0].trim().toLowerCase()
    if (!tag) continue
    const primary = tag.split('-')[0]
    if ((locales as readonly string[]).includes(primary)) return primary
  }
  return defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (STATIC_FILES.has(pathname)) return
  if (STATIC_PREFIXES.some((p) => pathname.startsWith(p))) return

  const hasLocale = (locales as readonly string[]).some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )
  if (hasLocale) return

  const locale = pickLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next|api|images|fonts|.*\\..*).*)'],
}
