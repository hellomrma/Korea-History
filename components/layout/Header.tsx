'use client'
import Link from 'next/link'
import { useState } from 'react'

const navLinks = [
  { href: '/timeline', label: '타임라인' },
  { href: '/map', label: '역사지도' },
  { href: '/figures', label: '인물도감' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className="bg-navy text-white sticky top-0 z-50 shadow-md">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl font-bold flex items-center gap-2">
          🏛 한국역사
        </Link>
        <ul className="hidden md:flex gap-6 text-sm font-medium">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className="hover:text-traditional-light transition-colors">
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="메뉴 열기"
        >
          ☰
        </button>
      </nav>
      {menuOpen && (
        <ul className="md:hidden bg-navy-light px-4 pb-4 flex flex-col gap-3 text-sm">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} onClick={() => setMenuOpen(false)} className="block py-1">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
