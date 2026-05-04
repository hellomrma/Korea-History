import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-surface border-t border-border mt-16">
      {/* AI 면책 — 웹 전용 (네이티브 앱에서는 숨김) */}
      <div data-native-hide className="bg-bg border-b border-border px-4 py-3">
        <p className="max-w-6xl mx-auto text-xs text-muted flex items-start gap-2">
          <span className="flex-shrink-0 text-sm" aria-hidden="true">⚠️</span>
          <span>
            이 사이트의 콘텐츠는 <strong className="text-text">AI를 통해 수집·생성된 자료</strong>로
            정확성을 보장하지 않습니다. 자세한 내용은{' '}
            <Link href="/about" className="underline hover:text-point">
              사이트 소개
            </Link>
            를 참고해 주세요.
          </span>
        </p>
      </div>

      {/* 저작권 — 항상 노출 */}
      <div className="px-4 py-4">
        <p className="max-w-6xl mx-auto text-xs text-subtle flex items-center justify-center gap-2 flex-wrap">
          <span>© {year} 5000년의 시간여행: 한국사</span>
          <span data-native-hide aria-hidden="true">·</span>
          <Link data-native-hide href="/about" className="hover:text-text">
            소개
          </Link>
        </p>
      </div>
    </footer>
  )
}
