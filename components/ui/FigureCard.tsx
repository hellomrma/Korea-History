import Link from 'next/link'
import type { Figure } from '@/types'

const roleIcons: Record<string, string> = {
  '왕': '👑',
  '장군': '⚔️',
  '과학자': '🔬',
  '예술가·학자': '🎨',
  '독립운동가': '🏅',
  '독립운동가·정치인': '🏅',
  '건국 시조': '🏛',
}

export default function FigureCard({ figure }: { figure: Figure }) {
  const icon = roleIcons[figure.role] ?? '👤'
  const deathLabel = figure.death ? String(figure.death) : '미상'

  return (
    <Link href={`/figure/${figure.slug}`} className="block group">
      <div className="bg-white rounded-xl border border-traditional-bg shadow-sm hover:shadow-md transition-shadow p-5 text-center">
        <div
          className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl"
          style={{ background: 'linear-gradient(135deg, #8b3a2a, #c4712a)' }}
          aria-hidden="true"
        >
          {icon}
        </div>
        <h3 className="font-serif font-bold text-traditional-dark group-hover:text-traditional transition-colors">
          {figure.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {figure.birth}년 ~ {figure.death !== null ? `${figure.death}년` : '미상'}
        </p>
        <p className="text-xs text-traditional mt-1 font-medium">{figure.role}</p>
        <div className="flex flex-wrap justify-center gap-1 mt-3">
          {figure.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="bg-traditional-bg text-traditional-dark text-xs px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
