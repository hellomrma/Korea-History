import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/i18n'

export const metadata: Metadata = {
  title: '개인정보 처리 방침 / Privacy Policy',
  description: 'K-History Explorer 개인정보 처리 방침',
}

const EFFECTIVE_DATE = '2025년 1월 1일'
const CONTACT_EMAIL = 'hellooomrma@gmail.com'
const SITE_NAME = 'K-History Explorer'
const SITE_URL = 'https://korea-history.playgrounder.dev'

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <p className="text-[11px] uppercase tracking-[0.22em] text-subtle mb-3">Privacy Policy</p>
      <h1 className="text-3xl md:text-4xl font-semibold text-text tracking-tight mb-4">
        개인정보 처리 방침
      </h1>
      <p className="text-sm text-muted mb-3">시행일: {EFFECTIVE_DATE}</p>
      {locale === 'en' && (
        <p className="text-xs text-muted border border-border px-4 py-3 mb-12">
          The official Privacy Policy is only available in Korean. The Korean text below is the binding version.
        </p>
      )}
      {locale !== 'en' && <div className="mb-12" />}

      {/* 1. 개요 */}
      <section className="border-t border-border pt-8 mb-10">
        <h2 className="text-xs font-bold text-text uppercase tracking-wider mb-4">1. 개요</h2>
        <p className="text-sm text-muted leading-relaxed">
          {SITE_NAME}(이하 &ldquo;서비스&rdquo;, <span className="text-text">{SITE_URL}</span>)은 이용자의
          개인정보를 소중히 여깁니다. 본 방침은 서비스 이용 과정에서 수집·이용되는 정보의 종류와
          목적, 보호 방법을 안내합니다. 본 서비스는 회원가입·로그인 기능을 제공하지 않으므로 이름·
          이메일·전화번호 등 식별 가능한 개인정보를 직접 수집하지 않습니다.
        </p>
      </section>

      {/* 2. 수집하는 정보 */}
      <section className="border-t border-border pt-8 mb-10">
        <h2 className="text-xs font-bold text-text uppercase tracking-wider mb-4">
          2. 수집하는 정보
        </h2>
        <p className="text-sm text-muted leading-relaxed mb-4">
          서비스는 이용 통계 분석을 위해 다음과 같은 비식별 정보를 자동으로 수집합니다.
        </p>
        <ul className="space-y-2">
          {[
            '방문 페이지 URL 및 페이지 이동 경로',
            '방문 일시 및 체류 시간',
            '유입 경로(검색엔진, 링크 등)',
            '브라우저 종류 및 운영체제 정보',
            '화면 해상도·언어 설정 등 기기 환경 정보',
            'IP 주소(Google Analytics에서 익명 처리)',
          ].map((item) => (
            <li key={item} className="text-sm text-muted leading-relaxed flex gap-2">
              <span className="text-subtle select-none">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted leading-relaxed mt-4">
          위 정보는 개인을 직접 식별하는 데 사용되지 않으며, 서비스 품질 개선 목적으로만 활용됩니다.
        </p>
      </section>

      {/* 3. 이용 목적 */}
      <section className="border-t border-border pt-8 mb-10">
        <h2 className="text-xs font-bold text-text uppercase tracking-wider mb-4">
          3. 수집 정보의 이용 목적
        </h2>
        <ul className="space-y-2">
          {[
            '서비스 이용 현황 파악 및 콘텐츠 개선',
            '기술적 오류 감지 및 서비스 안정성 유지',
            '이용자 관심 주제 분석을 통한 콘텐츠 기획',
          ].map((item) => (
            <li key={item} className="text-sm text-muted leading-relaxed flex gap-2">
              <span className="text-subtle select-none">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 4. 쿠키 및 추적 기술 */}
      <section className="border-t border-border pt-8 mb-10">
        <h2 className="text-xs font-bold text-text uppercase tracking-wider mb-4">
          4. 쿠키 및 로컬 스토리지
        </h2>
        <p className="text-sm text-muted leading-relaxed mb-4">
          서비스는 이용자 경험 개선을 위해 다음 정보를 브라우저에 저장합니다.
        </p>
        <ul className="space-y-3">
          <li className="text-sm text-muted leading-relaxed">
            <strong className="text-text">테마 설정</strong> — 라이트/다크 모드 선택값을{' '}
            <code className="text-xs bg-surface border border-border rounded px-1 py-0.5">
              localStorage
            </code>
            에 저장합니다. 이 값은 서버로 전송되지 않으며, 이용자가 브라우저 저장소를 초기화하면
            삭제됩니다.
          </li>
          <li className="text-sm text-muted leading-relaxed">
            <strong className="text-text">Google Analytics 쿠키</strong> — 방문 통계 수집을 위해
            Google Analytics 4(GA4)가 쿠키(
            <code className="text-xs bg-surface border border-border rounded px-1 py-0.5">_ga</code>
            ,{' '}
            <code className="text-xs bg-surface border border-border rounded px-1 py-0.5">
              _ga_*
            </code>
            )를 설정합니다. 쿠키 만료 기간은 최대 2년이며, 이용자는 브라우저 설정에서 쿠키를
            삭제하거나 거부할 수 있습니다.
          </li>
        </ul>
      </section>

      {/* 5. 제3자 서비스 */}
      <section className="border-t border-border pt-8 mb-10">
        <h2 className="text-xs font-bold text-text uppercase tracking-wider mb-4">
          5. 제3자 서비스
        </h2>
        <p className="text-sm text-muted leading-relaxed mb-4">
          서비스는 다음 제3자 도구를 이용합니다. 해당 서비스의 개인정보 처리 방침이 별도로
          적용됩니다.
        </p>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-text font-medium mb-1">Google Analytics 4</p>
            <p className="text-sm text-muted leading-relaxed">
              웹사이트 방문 통계 분석 서비스입니다. 수집된 데이터는 Google의 서버에 저장되며, IP
              주소는 익명화되어 처리됩니다. Google의 데이터 사용 방식은{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-point underline"
              >
                Google 개인정보처리방침
              </a>
              을 참고하세요. Google Analytics 데이터 수집을 원하지 않으시면{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-point underline"
              >
                Google Analytics 차단 브라우저 부가기능
              </a>
              을 설치하실 수 있습니다.
            </p>
          </div>
          <div>
            <p className="text-sm text-text font-medium mb-1">Vercel (호스팅)</p>
            <p className="text-sm text-muted leading-relaxed">
              서비스는 Vercel 플랫폼에서 호스팅됩니다. Vercel은 서버 접근 로그를 자체적으로
              기록할 수 있습니다. 자세한 내용은{' '}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-point underline"
              >
                Vercel 개인정보처리방침
              </a>
              을 참고하세요.
            </p>
          </div>
        </div>
      </section>

      {/* 6. 이용자 권리 */}
      <section className="border-t border-border pt-8 mb-10">
        <h2 className="text-xs font-bold text-text uppercase tracking-wider mb-4">
          6. 이용자 권리
        </h2>
        <p className="text-sm text-muted leading-relaxed mb-4">
          이용자는 다음 방법으로 데이터 수집에 관한 권리를 행사할 수 있습니다.
        </p>
        <ul className="space-y-2">
          {[
            '브라우저 설정에서 쿠키 삭제 또는 차단',
            'Google Analytics 차단 부가기능 설치를 통한 통계 수집 거부',
            '브라우저 로컬 스토리지 초기화를 통한 테마 설정 삭제',
          ].map((item) => (
            <li key={item} className="text-sm text-muted leading-relaxed flex gap-2">
              <span className="text-subtle select-none">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted leading-relaxed mt-4">
          서비스는 별도의 계정 시스템이 없으므로 삭제·열람·정정 요청 대상인 개인정보를 직접 보유하지
          않습니다.
        </p>
      </section>

      {/* 7. 아동 개인정보 */}
      <section className="border-t border-border pt-8 mb-10">
        <h2 className="text-xs font-bold text-text uppercase tracking-wider mb-4">
          7. 아동 이용자
        </h2>
        <p className="text-sm text-muted leading-relaxed">
          서비스는 만 14세 미만 아동의 개인정보를 의도적으로 수집하지 않습니다. 본 서비스는
          회원가입 기능이 없어 연령 확인 절차를 운영하지 않으며, 개인을 식별할 수 있는 정보를 직접
          수집하지 않습니다. 만약 아동 관련 정보가 수집된 사실을 발견하시면 아래 연락처로 알려주세요.
        </p>
      </section>

      {/* 8. 방침 변경 */}
      <section className="border-t border-border pt-8 mb-10">
        <h2 className="text-xs font-bold text-text uppercase tracking-wider mb-4">
          8. 방침 변경 안내
        </h2>
        <p className="text-sm text-muted leading-relaxed">
          본 방침은 관련 법령 변경이나 서비스 변경에 따라 업데이트될 수 있습니다. 중요한 변경 사항이
          있을 경우 페이지 상단의 시행일을 갱신하여 안내합니다. 변경된 방침은 게시 즉시 효력이
          발생합니다.
        </p>
      </section>

      {/* 9. 문의 */}
      <section className="border-t border-border pt-8 mb-12">
        <h2 className="text-xs font-bold text-text uppercase tracking-wider mb-4">9. 문의</h2>
        <p className="text-sm text-muted leading-relaxed">
          개인정보 처리 방침에 관한 문의나 요청이 있으시면 아래로 연락해 주세요.
        </p>
        <p className="text-sm text-muted mt-3">
          이메일:{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-text hover:text-point underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </section>
    </div>
  )
}
