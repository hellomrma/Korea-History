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
        className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-surface text-text placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-point focus:border-point"
      />
      <div role="group" aria-label="시대 필터" className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onEraChange('')}
          aria-pressed={selectedEra === ''}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            selectedEra === '' ? 'bg-point text-white' : 'bg-bg border border-border text-muted hover:border-point hover:text-point'
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
              selectedEra === era ? 'bg-point text-white' : 'bg-bg border border-border text-muted hover:border-point hover:text-point'
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
            selectedRole === '' ? 'bg-text text-surface' : 'bg-bg border border-border text-muted hover:border-text hover:text-text'
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
              selectedRole === role ? 'bg-text text-surface' : 'bg-bg border border-border text-muted hover:border-text hover:text-text'
            }`}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  )
}
