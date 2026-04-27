const REFERENCES = [
  { label: '국사편찬위원회', url: 'https://www.history.go.kr' },
  { label: '한국민족문화대백과사전', url: 'https://encykorea.aks.ac.kr' },
  { label: '조선왕조실록', url: 'https://sillok.history.go.kr' },
  { label: '한국역사정보통합시스템', url: 'https://www.koreanhistory.or.kr' },
  { label: '문화재청 국가문화유산포털', url: 'https://www.heritage.go.kr' },
]

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-16">
      {/* AI 면책 배너 */}
      <div className="bg-bg border-b border-border px-4 py-3">
        <p className="max-w-6xl mx-auto text-xs text-muted flex items-start gap-2">
          <span className="flex-shrink-0 text-sm" aria-hidden="true">⚠️</span>
          <span>
            이 사이트의 콘텐츠는 <strong className="text-text">AI(인공지능)를 통해 수집·생성된 자료</strong>입니다.
            역사적 사실과 다르거나 불정확한 내용이 포함될 수 있으며, 학문적·공식적 자료로 사용하기 전에
            반드시 아래 참조 기관의 공식 자료를 통해 확인하시기 바랍니다.
          </span>
        </p>
      </div>

      {/* 본문 */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 브랜드 */}
        <div>
          <p className="font-serif text-base font-bold text-text mb-1">5000년의 시간여행: 한국사</p>
          <p className="text-xs text-muted leading-relaxed">
            고조선부터 현대까지, 5000년 한국의 이야기를<br />모든 세대와 함께합니다.
          </p>
        </div>

        {/* 참조 자료 */}
        <div>
          <h3 className="text-xs font-bold text-text uppercase tracking-wider mb-3">참조 자료</h3>
          <ul className="space-y-1.5">
            {REFERENCES.map(({ label, url }) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted hover:text-point transition-colors"
                >
                  {label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 면책 */}
        <div>
          <h3 className="text-xs font-bold text-text uppercase tracking-wider mb-3">이용 안내</h3>
          <ul className="space-y-1.5 text-xs text-muted leading-relaxed">
            <li>본 콘텐츠는 교육·학습 참고용으로만 제공됩니다.</li>
            <li>AI 생성 특성상 오류·누락이 있을 수 있습니다.</li>
            <li>정확한 사실 확인은 공식 참조 기관을 이용해 주세요.</li>
            <li>상업적 사용 및 무단 전재를 금합니다.</li>
          </ul>
        </div>
      </div>

      {/* 저작권 */}
      <div className="border-t border-border px-4 py-4">
        <p className="max-w-6xl mx-auto text-xs text-subtle text-center">
          {`© ${new Date().getFullYear()} 5000년의 시간여행: 한국사. All rights reserved. · 콘텐츠는 AI 생성 자료로 정확성을 보장하지 않습니다.`}
        </p>
      </div>
    </footer>
  )
}
