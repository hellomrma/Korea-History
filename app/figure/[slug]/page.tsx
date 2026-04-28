import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getFigureBySlug, getAllFigures } from '@/lib/figures'
import { getEraBySlug } from '@/lib/eras'
import { getMDXContent } from '@/lib/content'
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
    title: figure.name,
    description: `${figure.name} (${formatYear(figure.birth)}~${formatDeath(figure.death)}) — ${figure.role}`,
    alternates: { canonical: `/figure/${slug}` },
  }
}

export default async function FigurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const figure = getFigureBySlug(slug)
  if (!figure) notFound()

  const era = getEraBySlug(figure.era)
  const content = await getMDXContent('figures', slug)
  const birthLabel = formatYear(figure.birth)
  const deathLabel = formatDeath(figure.death)

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <header className="border-b border-border pb-12 mb-12">
        <p className="text-[11px] uppercase tracking-[0.22em] text-subtle mb-6">인물</p>
        <h1 className="text-5xl md:text-6xl font-semibold text-text tracking-tight leading-[1.05] mb-5">
          {figure.name}
        </h1>
        <p className="text-sm text-muted mb-1">{figure.role}</p>
        <p className="text-sm text-muted tabular-nums mb-5">{birthLabel} — {deathLabel}</p>
        {era && (
          <p className="mb-5">
            <Link
              href={`/era/${era.slug}`}
              className="text-sm text-text border-b border-text pb-0.5 hover:text-point hover:border-point transition-colors"
            >
              {era.name}
            </Link>
          </p>
        )}
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {figure.tags.map((tag) => (
            <span key={tag} className="text-xs text-subtle border border-border px-2 py-0.5">{tag}</span>
          ))}
        </div>
      </header>

      {content ? (
        <ClientFigureContent mdxSource={content.mdxSource} />
      ) : (
        <div className="py-16 text-center text-muted border border-border">
          <p>이 인물의 콘텐츠를 준비 중입니다.</p>
        </div>
      )}

      <nav className="flex gap-6 mt-20 pt-10 border-t border-border">
        <Link href="/figures" aria-label="인물 도감으로 돌아가기" className="flex-1 group">
          <p className="text-xs text-subtle mb-2"><span aria-hidden="true">←</span> 인물 도감으로</p>
          <p className="text-base font-semibold text-text tracking-tight group-hover:text-point transition-colors">전체 인물 목록</p>
        </Link>
        {era && (
          <Link href={`/era/${era.slug}`} aria-label={`${era.name} 시대 보기`} className="flex-1 text-right group">
            <p className="text-xs text-subtle mb-2">시대 보기</p>
            <p className="text-base font-semibold text-text tracking-tight group-hover:text-point transition-colors">{era.name}</p>
          </Link>
        )}
      </nav>
    </div>
  )
}
