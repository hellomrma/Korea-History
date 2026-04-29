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

function chipClass(active: boolean): string {
  return `px-3 py-1 text-xs border ${
    active
      ? 'bg-text text-bg border-text'
      : 'bg-bg text-muted border-border hover:text-text hover:border-text'
  }`
}

export default function FigureFilter({
  eras, roles, selectedEra, selectedRole, search,
  onEraChange, onRoleChange, onSearchChange,
}: Props) {
  return (
    <div className="space-y-5 mb-12">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="인물 이름 또는 태그 검색"
        aria-label="인물 검색"
        className="w-full border-b border-border px-1 py-3 text-base bg-transparent text-text placeholder:text-subtle focus:outline-none focus:border-text"
      />
      <div role="group" aria-label="시대 필터" className="flex flex-wrap gap-1.5">
        <button type="button" onClick={() => onEraChange('')} aria-pressed={selectedEra === ''} className={chipClass(selectedEra === '')}>
          전체 시대
        </button>
        {eras.map((era) => (
          <button key={era} type="button" onClick={() => onEraChange(era)} aria-pressed={selectedEra === era} className={chipClass(selectedEra === era)}>
            {era}
          </button>
        ))}
      </div>
      <div role="group" aria-label="역할 필터" className="flex flex-wrap gap-1.5">
        <button type="button" onClick={() => onRoleChange('')} aria-pressed={selectedRole === ''} className={chipClass(selectedRole === '')}>
          전체 역할
        </button>
        {roles.map((role) => (
          <button key={role} type="button" onClick={() => onRoleChange(role)} aria-pressed={selectedRole === role} className={chipClass(selectedRole === role)}>
            {role}
          </button>
        ))}
      </div>
    </div>
  )
}
