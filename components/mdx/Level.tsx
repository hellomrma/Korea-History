import type { Difficulty } from '@/types'

const LABELS: Record<Difficulty, { ko: string; en: string }> = {
  easy:     { ko: '쉬움', en: 'Easy' },
  normal:   { ko: '보통', en: 'Normal' },
  advanced: { ko: '심화', en: 'Advanced' },
}

export default function Level({
  difficulty,
  children,
}: {
  difficulty: Difficulty
  children: React.ReactNode
}) {
  const { ko, en } = LABELS[difficulty]
  return (
    <section className="border-t border-text pt-6 mt-14 first:mt-2">
      <p className="text-[11px] uppercase tracking-[0.22em] text-subtle mb-6">
        {en} · {ko}
      </p>
      <div>{children}</div>
    </section>
  )
}
