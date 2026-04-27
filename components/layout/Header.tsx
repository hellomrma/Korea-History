'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '/timeline', label: '타임라인' },
  { href: '/map', label: '역사지도' },
  { href: '/figures', label: '인물도감' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-[10px] font-sans text-muted tracking-widest uppercase">5000년의 시간여행</span>
          <span className="font-serif text-lg font-bold text-text">한국사</span>
        </Link>
        <ul className="hidden md:flex gap-6 text-sm font-medium">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className="text-muted hover:text-point transition-colors">
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <button
          className="md:hidden p-2 text-muted hover:text-text"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          ☰
        </button>
      </nav>
      {menuOpen && (
        <ul id="mobile-nav" className="md:hidden bg-surface border-t border-border px-4 pb-4 flex flex-col gap-3 text-sm">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} onClick={() => setMenuOpen(false)} className="block py-1 text-muted hover:text-point transition-colors">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
