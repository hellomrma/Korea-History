'use client'
import { useState } from 'react'
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote'
import { DifficultyContext } from '@/lib/difficulty-context'
import LevelSelector from '@/components/ui/LevelSelector'
import { getMDXComponents } from '@/components/mdx/mdx-components'
import type { Difficulty } from '@/types'

export default function EraContent({ mdxSource }: { mdxSource: MDXRemoteSerializeResult }) {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  return (
    <DifficultyContext.Provider value={{ difficulty, setDifficulty }}>
      <div className="mb-6">
        <LevelSelector selected={difficulty} onChange={setDifficulty} />
      </div>
      <article className="prose prose-stone max-w-none mt-6">
        <MDXRemote {...mdxSource} components={getMDXComponents()} />
      </article>
    </DifficultyContext.Provider>
  )
}
