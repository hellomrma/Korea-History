'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { searchIndex, type SearchItem, type SearchItemType } from '@/lib/search'

const TYPE_LABELS: Record<SearchItemType, string> = {
  figure: '인물',
  event: '사건',
  era: '시대',
}

const TYPE_ORDER: SearchItemType[] = ['figure', 'event', 'era']

export default function GlobalSearch({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const router = useRouter()

  const results = useMemo(() => searchIndex(items, query), [items, query])

  const grouped = useMemo(() => {
    const map = new Map<SearchItemType, SearchItem[]>()
    for (const item of results) {
      const arr = map.get(item.type) ?? []
      arr.push(item)
      map.set(item.type, arr)
    }
    return TYPE_ORDER.flatMap((type) => {
      const list = map.get(type)
      return list ? [{ type, items: list }] : []
    })
  }, [results])

  // ⌘K / Ctrl+K toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC')
      const cmdK = (isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'k'
      if (cmdK) {
        e.preventDefault()
        setOpen((v) => !v)
      } else if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  // Lock body scroll + focus input + reset state
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      setActiveIdx(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    } else {
      document.body.style.overflow = ''
      setQuery('')
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Reset active index when results change
  useEffect(() => { setActiveIdx(0) }, [results])

  const navigate = (item: SearchItem) => {
    setOpen(false)
    router.push(item.href)
  }

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[activeIdx]) {
      e.preventDefault()
      navigate(results[activeIdx])
    }
  }

  // Keep active item in view
  useEffect(() => {
    if (!open || !listRef.current) return
    const el = listRef.current.querySelector<HTMLElement>(`[data-idx="${activeIdx}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIdx, open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="검색 열기"
        className="inline-flex items-center gap-2 text-xs text-muted hover:text-text border border-border px-3 py-1.5"
      >
        <span aria-hidden="true">⌕</span>
        <span className="hidden sm:inline">검색</span>
        <span className="hidden md:inline text-subtle border-l border-border pl-2 ml-1 tabular-nums">⌘K</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="사이트 검색"
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-16 sm:pt-24"
        >
          <div
            className="absolute inset-0 bg-text/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-2xl bg-bg border border-border max-h-[75vh] flex flex-col overflow-hidden">
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <span aria-hidden="true" className="text-muted text-lg">⌕</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="인물·사건·시대 검색"
                aria-label="검색어 입력"
                className="flex-1 bg-transparent text-text placeholder:text-subtle text-base focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="검색 닫기"
                className="text-xs text-subtle border border-border px-2 py-0.5 hover:text-text hover:border-text"
              >
                ESC
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {query.trim() === '' ? (
                <p className="text-sm text-subtle px-5 py-8 text-center">
                  인물 이름, 사건 제목, 시대명·태그 등을 입력하세요.
                </p>
              ) : results.length === 0 ? (
                <p className="text-sm text-subtle px-5 py-8 text-center">
                  &ldquo;{query}&rdquo;에 대한 결과가 없습니다.
                </p>
              ) : (
                <ul ref={listRef} className="py-2">
                  {grouped.map(({ type, items: groupItems }) => (
                    <li key={type}>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-subtle px-5 pt-4 pb-2">
                        {TYPE_LABELS[type]} · {groupItems.length}
                      </p>
                      <ul>
                        {groupItems.map((item) => {
                          const idx = results.indexOf(item)
                          const active = idx === activeIdx
                          return (
                            <li key={`${item.type}-${item.slug}`}>
                              <button
                                type="button"
                                data-idx={idx}
                                onMouseEnter={() => setActiveIdx(idx)}
                                onClick={() => navigate(item)}
                                className={`w-full text-left px-5 py-3 ${
                                  active ? 'bg-surface' : 'hover:bg-surface'
                                }`}
                              >
                                <div className="flex items-baseline justify-between gap-3">
                                  <span className="text-sm font-semibold text-text tracking-tight truncate">
                                    {item.title}
                                  </span>
                                  <span className="text-xs text-subtle whitespace-nowrap tabular-nums flex-shrink-0">
                                    {item.meta}
                                  </span>
                                </div>
                                <p className="text-xs text-muted truncate mt-0.5">{item.subtitle}</p>
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex-shrink-0 border-t border-border px-5 py-3 flex justify-between items-center text-[11px] text-subtle">
              <span>↑↓ 이동 · Enter 선택 · Esc 닫기</span>
              <span className="tabular-nums">{results.length} 건</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
