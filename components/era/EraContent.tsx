'use client'
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote'
import { MDX_COMPONENTS } from '@/components/mdx/mdx-components'

export default function EraContent({ mdxSource }: { mdxSource: MDXRemoteSerializeResult }) {
  return (
    <article className="prose prose-stone max-w-none">
      <MDXRemote {...mdxSource} components={MDX_COMPONENTS} />
    </article>
  )
}
