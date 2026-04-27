import Link from 'next/link'

const links = [
  {
    href: '/timeline',
    icon: '📅',
    title: '인터랙티브 타임라인',
    desc: '역사의 흐름을 한눈에 — 주요 사건을 시간순으로 탐험',
  },
  {
    href: '/map',
    icon: '🗺️',
    title: '역사 지도',
    desc: '시대별 영토 변화와 주요 장소를 지도로 살펴보기',
  },
  {
    href: '/figures',
    icon: '👤',
    title: '인물 도감',
    desc: '5000년 한국사를 이끈 인물들의 이야기',
  },
]

export default function QuickLinks() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-14">
      <h2 className="font-serif text-2xl font-bold text-text text-center mb-8">
        역사를 탐험하는 방법
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {links.map(({ href, icon, title, desc }) => (
          <Link key={href} href={href} className="block group">
            <div className="bg-surface border border-border rounded-2xl p-6 hover:border-point hover:shadow-md transition-all h-full">
              <div className="text-3xl mb-4" aria-hidden="true">{icon}</div>
              <h3 className="font-serif text-lg font-bold text-text mb-2 group-hover:text-point transition-colors">{title}</h3>
              <p className="text-sm text-muted leading-relaxed">{desc}</p>
              <div className="mt-4 text-sm font-medium text-point opacity-0 group-hover:opacity-100 transition-opacity">
                바로 가기 →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
