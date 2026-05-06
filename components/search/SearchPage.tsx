'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { searchIndex, type SearchItem, type SearchItemType } from '@/lib/search'
import { getDictionary, type Locale } from '@/lib/i18n'

const TYPE_ORDER: SearchItemType[] = ['figure', 'event', 'era']

export default function SearchPage({ items, locale }: { items: SearchItem[]; locale: Locale }) {
  const router = useRouter()
  const dict = getDictionary(locale)
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const results = useMemo(() => searchIndex(items, query, 24, locale), [items, query, locale])

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

  useEffect(() => { inputRef.current?.focus() }, [])
  useEffect(() => { setActiveIdx(0) }, [results])

  const navigate = (item: SearchItem) => router.push(item.href)

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

  useEffect(() => {
    if (!listRef.current) return
    const el = listRef.current.querySelector<HTMLElement>(`[data-idx="${activeIdx}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIdx])

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.18em] text-subtle mb-3">{dict.search.kicker}</p>
        <h1 className="text-3xl font-semibold text-text tracking-tight">{dict.search.title}</h1>
      </div>

      <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
        <span aria-hidden="true" className="text-muted text-xl">⌕</span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onInputKey}
          placeholder={dict.search.placeholder}
          aria-label={dict.search.placeholder}
          className="flex-1 bg-transparent text-text placeholder:text-subtle text-lg focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); inputRef.current?.focus() }}
            aria-label={dict.common.close}
            className="text-xs text-subtle border border-border px-2 py-0.5 hover:text-text hover:border-text"
          >
            ×
          </button>
        )}
      </div>

      {query.trim() === '' ? (
        <p className="text-sm text-subtle py-12 text-center">
          {dict.search.typeHint}
        </p>
      ) : results.length === 0 ? (
        <p className="text-sm text-subtle py-12 text-center">
          {dict.search.noResults}
        </p>
      ) : (
        <>
          <p className="text-[11px] uppercase tracking-[0.18em] text-subtle mb-2 tabular-nums">
            {results.length}
          </p>
          <ul ref={listRef}>
            {grouped.map(({ type, items: groupItems }) => (
              <li key={type}>
                <p className="text-[11px] uppercase tracking-[0.18em] text-subtle pt-6 pb-2">
                  {dict.search.types[type] ?? type} · {groupItems.length}
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
                          className={`w-full text-left px-4 py-3 border-b border-border ${
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
          <p className="text-[11px] text-subtle pt-6">↑↓ · Enter</p>
        </>
      )}
    </div>
  )
}
