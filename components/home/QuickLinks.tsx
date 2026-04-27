import Link from 'next/link'

const links = [
  {
    href: '/timeline',
    icon: '📅',
    title: '인터랙티브 타임라인',
    desc: '역사의 흐름을 한눈에 — 주요 사건을 시간순으로 탐험',
    color: 'from-navy to-blue-700',
  },
  {
    href: '/map',
    icon: '🗺️',
    title: '역사 지도',
    desc: '시대별 영토 변화와 주요 장소를 지도로 살펴보기',
    color: 'from-green-800 to-green-600',
  },
  {
    href: '/figures',
    icon: '👤',
    title: '인물 도감',
    desc: '한국 역사를 만든 위인들의 이야기',
    color: 'from-traditional-dark to-traditional',
  },
]

export default function QuickLinks() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="font-serif text-2xl font-bold text-traditional-dark text-center mb-8">
        역사를 탐험하는 방법
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {links.map(({ href, icon, title, desc, color }) => (
          <Link key={href} href={href} className="block group">
            <div className={`bg-gradient-to-br ${color} text-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow h-full`}>
              <div className="text-4xl mb-4" aria-hidden="true">{icon}</div>
              <h3 className="font-serif text-xl font-bold mb-2">{title}</h3>
              <p className="text-sm opacity-85 leading-relaxed">{desc}</p>
              <div className="mt-4 text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                바로 가기 →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
