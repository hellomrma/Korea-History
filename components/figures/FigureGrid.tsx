'use client'
import { useState, useMemo } from 'react'
import FigureCard from '@/components/ui/FigureCard'
import FigureFilter from './FigureFilter'
import type { Figure, Era } from '@/types'

export default function FigureGrid({ figures, eras }: { figures: Figure[]; eras: Era[] }) {
  const [search, setSearch] = useState('')
  const [selectedEra, setSelectedEra] = useState('')
  const [selectedRole, setSelectedRole] = useState('')

  const eraNames = useMemo(() => eras.map((e) => e.name), [eras])
  const roles = useMemo(() => [...new Set(figures.map((f) => f.role))], [figures])

  const filtered = useMemo(() => {
    return figures.filter((f) => {
      const matchSearch =
        search === '' ||
        f.name.includes(search) ||
        f.tags.some((t) => t.includes(search))
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
      />
      {filtered.length === 0 ? (
        <p className="text-muted py-12">검색 결과가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10">
          {filtered.map((fig) => <FigureCard key={fig.slug} figure={fig} />)}
        </div>
      )}
    </>
  )
}
