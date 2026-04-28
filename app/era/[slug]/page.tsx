import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getEraBySlug, getAdjacentEras, getAllEras } from '@/lib/eras'
import { getFiguresByEra } from '@/lib/figures'
import { getMDXContent } from '@/lib/content'
import ClientEraContent from '@/components/era/ClientEraContent'
import FigureCard from '@/components/ui/FigureCard'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const eras = getAllEras()
  return eras.map((era) => ({ slug: era.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const era = getEraBySlug(slug)
  if (!era) return {}
  return {
    title: `${era.name} — 5000년의 시간여행: 한국사`,
    description: era.summary,
  }
}

export default async function EraPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const era = getEraBySlug(slug)
  if (!era) notFound()

  const { prev, next } = getAdjacentEras(slug)
  const figures = getFiguresByEra(slug)
  const content = await getMDXContent('eras', slug)

  const startLabel = era.period.start < 0
    ? `기원전 ${Math.abs(era.period.start)}년`
    : `${era.period.start}년`
  const endLabel = era.period.end === null
    ? '현재'
    : era.period.end < 0
      ? `기원전 ${Math.abs(era.period.end)}년`
      : `${era.period.end}년`

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <header className="border-b border-border pb-12 mb-12">
        <p className="text-[11px] uppercase tracking-[0.22em] text-subtle mb-6">시대</p>
        <h1 className="text-5xl md:text-6xl font-semibold text-text tracking-tight leading-[1.05] mb-5">
          {era.name}
        </h1>
        <p className="text-sm text-muted tabular-nums mb-5">{startLabel} — {endLabel}</p>
        <p className="text-base md:text-lg text-muted leading-relaxed mb-6 max-w-2xl">{era.summary}</p>
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {era.tags.map((tag) => (
            <span key={tag} className="text-xs text-subtle border border-border px-2 py-0.5">{tag}</span>
          ))}
        </div>
      </header>

      {content ? (
        <ClientEraContent mdxSource={content.mdxSource} />
      ) : (
        <div className="py-16 text-center text-muted border border-border">
          <p>이 시대의 콘텐츠를 준비 중입니다.</p>
        </div>
      )}

      {figures.length > 0 && (
        <section className="mt-20">
          <p className="text-[11px] uppercase tracking-[0.22em] text-subtle mb-6">이 시대의 인물</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {figures.map((fig) => <FigureCard key={fig.slug} figure={fig} />)}
          </div>
        </section>
      )}

      <nav className="flex justify-between mt-20 gap-6 pt-10 border-t border-border">
        {prev ? (
          <Link
            href={`/era/${prev.slug}`}
            aria-label={`이전 시대: ${prev.name}`}
            className="flex-1 group"
          >
            <p className="text-xs text-subtle mb-2"><span aria-hidden="true">←</span> 이전 시대</p>
            <p className="text-base font-semibold text-text tracking-tight group-hover:text-point transition-colors">{prev.name}</p>
          </Link>
        ) : <div className="flex-1" />}
        {next ? (
          <Link
            href={`/era/${next.slug}`}
            aria-label={`다음 시대: ${next.name}`}
            className="flex-1 text-right group"
          >
            <p className="text-xs text-subtle mb-2">다음 시대 <span aria-hidden="true">→</span></p>
            <p className="text-base font-semibold text-text tracking-tight group-hover:text-point transition-colors">{next.name}</p>
          </Link>
        ) : <div className="flex-1" />}
      </nav>
    </div>
  )
}
