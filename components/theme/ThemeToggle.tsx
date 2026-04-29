'use client'
import { useEffect, useState } from 'react'

type Mode = 'light' | 'dark' | 'system'

const LABEL: Record<Mode, string> = {
  light: '라이트',
  dark: '다크',
  system: '시스템',
}

function applyTheme(mode: Mode) {
  const isDark =
    mode === 'dark' ||
    (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', isDark)
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = (localStorage.getItem('theme') as Mode | null) ?? 'light'
    setMode(stored)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || mode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme('system')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [mode, mounted])

  function cycle() {
    const next: Mode = mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light'
    setMode(next)
    localStorage.setItem('theme', next)
    applyTheme(next)
  }

  const current = mounted ? mode : 'light'
  const label = `테마 전환 (현재: ${LABEL[current]})`

  return (
    <button
      type="button"
      onClick={cycle}
      className="text-muted hover:text-text transition-colors p-1 -m-1 inline-flex items-center justify-center"
      aria-label={label}
      title={label}
    >
      {current === 'light' && <SunIcon />}
      {current === 'dark' && <MoonIcon />}
      {current === 'system' && <SystemIcon />}
    </button>
  )
}

const ICON_PROPS = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function SunIcon() {
  return (
    <svg {...ICON_PROPS} aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg {...ICON_PROPS} aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function SystemIcon() {
  return (
    <svg {...ICON_PROPS} aria-hidden="true">
      <rect x="2.5" y="3.5" width="19" height="13" rx="1.5" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  )
}
