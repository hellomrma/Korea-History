'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ThemeToggle from '@/components/theme/ThemeToggle'
import LocaleSwitcher from '@/components/layout/LocaleSwitcher'
import { getDictionary, type Locale } from '@/lib/i18n'

export default function Header({ locale }: { locale: Locale }) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const dict = getDictionary(locale)
  const prefix = `/${locale}`

  const navLinks = [
    { href: `${prefix}/timeline`, label: dict.nav.timeline },
    { href: `${prefix}/map`, label: dict.nav.map },
    { href: `${prefix}/figures`, label: dict.nav.figures },
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
      const isMac = navigator.platform.toUpperCase().includes('MAC')
      const cmdK = (isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'k'
      if (cmdK) {
        e.preventDefault()
        router.push(`${prefix}/search`)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [router, prefix])

  return (
    <header data-native-hide className="bg-bg border-b border-border sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href={prefix} className="flex items-baseline gap-3 group">
          <span className="text-[19px] font-semibold text-text tracking-tight">K-History</span>
          <span className="hidden sm:inline text-[11px] text-subtle tracking-[0.18em] uppercase">{dict.nav.explorer}</span>
        </Link>
        <div className="flex items-center gap-6">
          <ul className="hidden md:flex gap-8 text-sm">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-muted hover:text-text">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={`${prefix}/search`}
            aria-label={dict.nav.searchAria}
            className="inline-flex items-center gap-2 text-xs text-muted hover:text-text border border-border px-3 py-1.5"
          >
            <span aria-hidden="true">⌕</span>
            <span className="hidden sm:inline">{dict.nav.search}</span>
            <span className="hidden md:inline text-subtle border-l border-border pl-2 ml-1 tabular-nums">⌘K</span>
          </Link>
          <LocaleSwitcher locale={locale} />
          <ThemeToggle />
          <button
            className="md:hidden p-1 text-muted hover:text-text"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? dict.nav.closeMenu : dict.nav.openMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            ☰
          </button>
        </div>
      </nav>
      {menuOpen && (
        <ul id="mobile-nav" className="md:hidden bg-bg border-t border-border px-6 pb-5 pt-2 flex flex-col gap-3 text-sm">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} onClick={() => setMenuOpen(false)} className="block py-1 text-muted hover:text-text">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
