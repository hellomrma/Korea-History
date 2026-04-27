'use client'
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote'
import { DifficultyProvider, useDifficulty } from '@/lib/difficulty-context'
import LevelSelector from '@/components/ui/LevelSelector'
import { MDX_COMPONENTS } from '@/components/mdx/mdx-components'

function FigureContentInner({ mdxSource }: { mdxSource: MDXRemoteSerializeResult }) {
  const { difficulty, setDifficulty } = useDifficulty()
  return (
    <>
      <div className="mb-6">
        <LevelSelector selected={difficulty} onChange={setDifficulty} />
      </div>
      <article className="prose prose-stone max-w-none mt-6">
        <MDXRemote {...mdxSource} components={MDX_COMPONENTS} />
      </article>
    </>
  )
}

export default function FigureContent({ mdxSource }: { mdxSource: MDXRemoteSerializeResult }) {
  return (
    <DifficultyProvider>
      <FigureContentInner mdxSource={mdxSource} />
    </DifficultyProvider>
  )
}
