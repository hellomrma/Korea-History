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
    title: `${era.name} — 한국역사`,
    description: era.summary,
  }
}

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/

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

  const safeColor = HEX_COLOR.test(era.color) ? era.color : '#8b3a2a'

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Era header */}
      <div
        className="rounded-2xl p-8 text-white mb-8"
        style={{ background: `linear-gradient(135deg, #3d1f0d, ${safeColor})` }}
      >
        <p className="text-xs uppercase tracking-widest opacity-70 mb-1">시대</p>
        <h1 className="font-serif text-3xl font-bold mb-2">{era.name}</h1>
        <p className="opacity-[0.85] text-sm">{startLabel} ~ {endLabel}</p>
        <p className="mt-3 opacity-90 leading-relaxed">{era.summary}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {era.tags.map((tag) => (
            <span key={tag} className="bg-white/20 px-3 py-0.5 rounded-full text-xs">{tag}</span>
          ))}
        </div>
      </div>

      {/* MDX content with difficulty selector */}
      {content ? (
        <ClientEraContent mdxSource={content.mdxSource} />
      ) : (
        <div className="text-center py-12 text-gray-500 bg-traditional-bg rounded-xl">
          <p className="text-lg mb-2" aria-hidden="true">📝</p>
          <p>이 시대의 콘텐츠를 준비 중입니다.</p>
        </div>
      )}

      {/* Related figures */}
      {figures.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-xl font-bold text-traditional-dark mb-5">이 시대의 인물</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {figures.map((fig) => <FigureCard key={fig.slug} figure={fig} />)}
          </div>
        </section>
      )}

      {/* Previous/next era navigation */}
      <div className="flex justify-between mt-12 gap-4">
        {prev ? (
          <Link
            href={`/era/${prev.slug}`}
            aria-label={`이전 시대: ${prev.name}`}
            className="flex-1 bg-traditional-bg rounded-xl p-4 hover:shadow-md transition-shadow group"
          >
            <p className="text-xs text-gray-500 mb-1">
              <span aria-hidden="true">←</span> 이전 시대
            </p>
            <p className="font-serif font-bold text-traditional-dark group-hover:text-traditional transition-colors">{prev.name}</p>
          </Link>
        ) : <div className="flex-1" />}
        {next ? (
          <Link
            href={`/era/${next.slug}`}
            aria-label={`다음 시대: ${next.name}`}
            className="flex-1 bg-traditional-bg rounded-xl p-4 hover:shadow-md transition-shadow text-right group"
          >
            <p className="text-xs text-gray-500 mb-1">
              다음 시대 <span aria-hidden="true">→</span>
            </p>
            <p className="font-serif font-bold text-traditional-dark group-hover:text-traditional transition-colors">{next.name}</p>
          </Link>
        ) : <div className="flex-1" />}
      </div>
    </div>
  )
}
