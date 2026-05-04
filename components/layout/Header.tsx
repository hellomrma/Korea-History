'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ThemeToggle from '@/components/theme/ThemeToggle'

const navLinks = [
  { href: '/timeline', label: '타임라인' },
  { href: '/map', label: '역사지도' },
  { href: '/figures', label: '인물도감' },
]

export default function Header() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
      const isMac = navigator.platform.toUpperCase().includes('MAC')
      const cmdK = (isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'k'
      if (cmdK) {
        e.preventDefault()
        router.push('/search')
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [router])

  return (
    <header data-native-hide className="bg-bg border-b border-border sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-3 group">
          <span className="text-[19px] font-semibold text-text tracking-tight">K-History</span>
          <span className="hidden sm:inline text-[11px] text-subtle tracking-[0.18em] uppercase">Explorer</span>
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
            href="/search"
            aria-label="검색"
            className="inline-flex items-center gap-2 text-xs text-muted hover:text-text border border-border px-3 py-1.5"
          >
            <span aria-hidden="true">⌕</span>
            <span className="hidden sm:inline">검색</span>
            <span className="hidden md:inline text-subtle border-l border-border pl-2 ml-1 tabular-nums">⌘K</span>
          </Link>
          <ThemeToggle />
          <button
            className="md:hidden p-1 text-muted hover:text-text"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
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
