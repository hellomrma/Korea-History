'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import GlobalSearch from '@/components/search/GlobalSearch'
import type { SearchItem } from '@/lib/search'

const navLinks = [
  { href: '/timeline', label: '타임라인' },
  { href: '/map', label: '역사지도' },
  { href: '/figures', label: '인물도감' },
]

export default function Header({ searchItems }: { searchItems: SearchItem[] }) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className="bg-bg border-b border-border sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-3 group">
          <span className="text-[19px] font-semibold text-text tracking-tight">한국사</span>
          <span className="hidden sm:inline text-[11px] text-subtle tracking-[0.18em] uppercase">5000 Years</span>
        </Link>
        <div className="flex items-center gap-6">
          <ul className="hidden md:flex gap-8 text-sm">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-muted hover:text-text transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <GlobalSearch items={searchItems} />
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
              <Link href={href} onClick={() => setMenuOpen(false)} className="block py-1 text-muted hover:text-text transition-colors">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
