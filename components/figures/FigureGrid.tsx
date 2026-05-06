'use client'
import { useState, useMemo } from 'react'
import FigureCard from '@/components/ui/FigureCard'
import FigureFilter from './FigureFilter'
import type { Figure, Era } from '@/types'
import { getDictionary, type Locale } from '@/lib/i18n'

export default function FigureGrid({ figures, eras, locale }: { figures: Figure[]; eras: Era[]; locale: Locale }) {
  const dict = getDictionary(locale)
  const [search, setSearch] = useState('')
  const [selectedEra, setSelectedEra] = useState('')
  const [selectedRole, setSelectedRole] = useState('')

  const eraNames = useMemo(() => eras.map((e) => e.name), [eras])
  const roles = useMemo(() => [...new Set(figures.map((f) => f.role))], [figures])

  const filtered = useMemo(() => {
    return figures.filter((f) => {
      const q = search.toLowerCase()
      const matchSearch =
        q === '' ||
        f.name.toLowerCase().includes(q) ||
        f.tags.some((t) => t.toLowerCase().includes(q))
      const era = eras.find((e) => e.slug === f.era)
      const matchEra = selectedEra === '' || era?.name === selectedEra
      const matchRole = selectedRole === '' || f.role === selectedRole
      return matchSearch && matchEra && matchRole
    })
  }, [figures, eras, search, selectedEra, selectedRole])

  return (
    <>
      <FigureFilter
        eras={eraNames}
        roles={roles}
        selectedEra={selectedEra}
        selectedRole={selectedRole}
        search={search}
        onEraChange={setSelectedEra}
        onRoleChange={setSelectedRole}
        onSearchChange={setSearch}
        locale={locale}
      />
      {filtered.length === 0 ? (
        <p className="text-muted py-12">{dict.figures.noResults}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10">
          {filtered.map((fig) => <FigureCard key={fig.slug} figure={fig} locale={locale} />)}
        </div>
      )}
    </>
  )
}
