'use client'
interface Props {
  eras: string[]
  roles: string[]
  selectedEra: string
  selectedRole: string
  search: string
  onEraChange: (v: string) => void
  onRoleChange: (v: string) => void
  onSearchChange: (v: string) => void
}

export default function FigureFilter({
  eras, roles, selectedEra, selectedRole, search,
  onEraChange, onRoleChange, onSearchChange,
}: Props) {
  return (
    <div className="space-y-4 mb-8">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="🔍 인물 이름 또는 태그 검색..."
        aria-label="인물 검색"
        className="w-full border border-traditional-bg rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-traditional bg-white"
      />
      <div role="group" aria-label="시대 필터" className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onEraChange('')}
          aria-pressed={selectedEra === ''}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            selectedEra === '' ? 'bg-traditional text-white' : 'bg-traditional-bg text-traditional-dark hover:bg-traditional/20'
          }`}
        >
          전체 시대
        </button>
        {eras.map((era) => (
          <button
            key={era}
            type="button"
            onClick={() => onEraChange(era)}
            aria-pressed={selectedEra === era}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedEra === era ? 'bg-traditional text-white' : 'bg-traditional-bg text-traditional-dark hover:bg-traditional/20'
            }`}
          >
            {era}
          </button>
        ))}
      </div>
      <div role="group" aria-label="역할 필터" className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onRoleChange('')}
          aria-pressed={selectedRole === ''}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            selectedRole === '' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          전체 역할
        </button>
        {roles.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => onRoleChange(role)}
            aria-pressed={selectedRole === role}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedRole === role ? 'bg-navy text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  )
}
