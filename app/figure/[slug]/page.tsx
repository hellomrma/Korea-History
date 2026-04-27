import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getFigureBySlug, getAllFigures } from '@/lib/figures'
import { getEraBySlug } from '@/lib/eras'
import { getMDXContent } from '@/lib/content'
import { ROLE_ICONS } from '@/lib/roleIcons'
import ClientFigureContent from '@/components/figure/ClientFigureContent'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return getAllFigures().map((f) => ({ slug: f.slug }))
}

function formatYear(year: number): string {
  return year < 0 ? `기원전 ${Math.abs(year)}년` : `${year}년`
}

function formatDeath(death: number | null): string {
  return death === null ? '미상' : formatYear(death)
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const figure = getFigureBySlug(slug)
  if (!figure) return {}
  return {
    title: `${figure.name} — 한국역사`,
    description: `${figure.name} (${formatYear(figure.birth)}~${formatDeath(figure.death)}) — ${figure.role}`,
  }
}

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/

export default async function FigurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const figure = getFigureBySlug(slug)
  if (!figure) notFound()

  const era = getEraBySlug(figure.era)
  const content = await getMDXContent('figures', slug)
  const icon = ROLE_ICONS[figure.role] ?? '👤'
  const birthLabel = formatYear(figure.birth)
  const deathLabel = formatDeath(figure.death)
  const safeEraColor = era && HEX_COLOR.test(era.color) ? era.color : '#8b3a2a'

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Figure header */}
      <div
        className="rounded-2xl p-8 text-white mb-8"
        style={{ background: `linear-gradient(135deg, #3d1f0d, ${safeEraColor})` }}
      >
        <div
          className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl bg-white/20"
          aria-hidden="true"
        >
          {icon}
        </div>
        <h1 className="font-serif text-3xl font-bold text-center mb-1">{figure.name}</h1>
        <p className="text-center opacity-[0.8] text-sm mb-1">{figure.role}</p>
        <p className="text-center opacity-[0.7] text-sm">{birthLabel} ~ {deathLabel}</p>
        {era && (
          <p className="text-center mt-2">
            <Link
              href={`/era/${era.slug}`}
              className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
            >
              {era.name}
            </Link>
          </p>
        )}
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {figure.tags.map((tag) => (
            <span key={tag} className="bg-white/20 px-3 py-0.5 rounded-full text-xs">{tag}</span>
          ))}
        </div>
      </div>

      {/* MDX content with difficulty selector */}
      {content ? (
        <ClientFigureContent mdxSource={content.mdxSource} />
      ) : (
        <div className="text-center py-12 text-gray-500 bg-traditional-bg rounded-xl">
          <p className="text-lg mb-2" aria-hidden="true">📝</p>
          <p>이 인물의 콘텐츠를 준비 중입니다.</p>
        </div>
      )}

      {/* Back to figures and era links */}
      <div className="flex gap-4 mt-12">
        <Link
          href="/figures"
          aria-label="인물 도감으로 돌아가기"
          className="flex-1 bg-traditional-bg rounded-xl p-4 hover:shadow-md transition-shadow text-center"
        >
          <p className="text-xs text-gray-500 mb-1">
            <span aria-hidden="true">←</span> 인물 도감으로
          </p>
          <p className="font-serif font-bold text-traditional-dark">전체 인물 목록</p>
        </Link>
        {era && (
          <Link
            href={`/era/${era.slug}`}
            aria-label={`${era.name} 시대 보기`}
            className="flex-1 bg-traditional-bg rounded-xl p-4 hover:shadow-md transition-shadow text-center"
          >
            <p className="text-xs text-gray-500 mb-1">시대 보기</p>
            <p className="font-serif font-bold text-traditional-dark">{era.name}</p>
          </Link>
        )}
      </div>
    </div>
  )
}
