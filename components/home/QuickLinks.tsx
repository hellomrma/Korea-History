import Link from 'next/link'

const links = [
  {
    href: '/timeline',
    kicker: '01',
    title: '인터랙티브 타임라인',
    desc: '역사의 흐름을 한눈에 — 주요 사건을 시간순으로 탐험합니다.',
  },
  {
    href: '/map',
    kicker: '02',
    title: '역사 지도',
    desc: '시대별 영토 변화와 주요 장소를 지도 위에서 살펴봅니다.',
  },
  {
    href: '/figures',
    kicker: '03',
    title: '인물 도감',
    desc: '5000년 한국사를 이끈 인물들의 이야기를 모았습니다.',
  },
]

export default function QuickLinks() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 border-b border-border">
      <p className="text-[11px] uppercase tracking-[0.22em] text-subtle mb-8">Sections</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-12">
        {links.map(({ href, kicker, title, desc }) => (
          <Link key={href} href={href} className="group block border-t border-text pt-5">
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-xs text-subtle tabular-nums">{kicker}</span>
              <h3 className="text-xl font-semibold text-text tracking-tight group-hover:text-point transition-colors">
                {title}
              </h3>
            </div>
            <p className="text-sm text-muted leading-relaxed mb-4">{desc}</p>
            <span className="text-xs text-text border-b border-text pb-0.5 group-hover:text-point group-hover:border-point transition-colors">
              자세히 보기 →
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
