import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '사이트 소개',
  description: '5000년의 시간여행: 한국사 — 사이트 소개와 참조 자료',
}

const REFERENCES = [
  { label: '국사편찬위원회', url: 'https://www.history.go.kr' },
  { label: '한국민족문화대백과사전', url: 'https://encykorea.aks.ac.kr' },
  { label: '조선왕조실록', url: 'https://sillok.history.go.kr' },
  { label: '한국역사정보통합시스템', url: 'https://www.koreanhistory.or.kr' },
  { label: '문화재청 국가문화유산포털', url: 'https://www.heritage.go.kr' },
]

const USAGE_NOTES = [
  '본 콘텐츠는 교육·학습 참고용으로만 제공됩니다.',
  'AI 생성 특성상 오류·누락이 있을 수 있습니다.',
  '정확한 사실 확인은 공식 참조 기관을 이용해 주세요.',
  '상업적 사용 및 무단 전재를 금합니다.',
]

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <p className="text-[11px] uppercase tracking-[0.22em] text-subtle mb-3">About</p>
      <h1 className="text-3xl md:text-4xl font-semibold text-text tracking-tight mb-12">
        사이트 소개
      </h1>

      <section className="border-t border-border pt-8 mb-12">
        <h2 className="text-xs font-bold text-text uppercase tracking-wider mb-4">
          5000년의 시간여행: 한국사
        </h2>
        <p className="text-sm text-muted leading-relaxed">
          고조선부터 현대까지, 5000년 한국의 이야기를 모든 세대와 함께합니다.
        </p>
      </section>

      <section className="border-t border-border pt-8 mb-12">
        <h2 className="text-xs font-bold text-text uppercase tracking-wider mb-4">
          AI 콘텐츠 안내
        </h2>
        <p className="text-sm text-muted leading-relaxed">
          이 사이트의 콘텐츠는{' '}
          <strong className="text-text">AI(인공지능)를 통해 수집·생성된 자료</strong>입니다.
          역사적 사실과 다르거나 불정확한 내용이 포함될 수 있으며, 학문적·공식적 자료로 사용하기 전에
          반드시 아래 참조 기관의 공식 자료를 통해 확인하시기 바랍니다.
        </p>
      </section>

      <section className="border-t border-border pt-8 mb-12">
        <h2 className="text-xs font-bold text-text uppercase tracking-wider mb-4">
          참조 자료
        </h2>
        <ul className="space-y-2">
          {REFERENCES.map(({ label, url }) => (
            <li key={url}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted hover:text-point"
              >
                {label} ↗
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border pt-8 mb-12">
        <h2 className="text-xs font-bold text-text uppercase tracking-wider mb-4">
          이용 안내
        </h2>
        <ul className="space-y-2">
          {USAGE_NOTES.map((note) => (
            <li key={note} className="text-sm text-muted leading-relaxed">
              {note}
            </li>
          ))}
        </ul>
      </section>

      <p className="border-t border-border pt-8 text-xs text-subtle text-center">
        © {new Date().getFullYear()} 5000년의 시간여행: 한국사. All rights reserved.
      </p>
    </div>
  )
}
