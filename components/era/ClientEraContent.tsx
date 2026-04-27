'use client'
import dynamic from 'next/dynamic'
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'

const EraContent = dynamic(() => import('./EraContent'), { ssr: false })

export default function ClientEraContent({ mdxSource }: { mdxSource: MDXRemoteSerializeResult }) {
  return <EraContent mdxSource={mdxSource} />
}
