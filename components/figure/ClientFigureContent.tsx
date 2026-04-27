'use client'
import dynamic from 'next/dynamic'
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'

const FigureContent = dynamic(() => import('./FigureContent'), { ssr: false })

export default function ClientFigureContent({ mdxSource }: { mdxSource: MDXRemoteSerializeResult }) {
  return <FigureContent mdxSource={mdxSource} />
}
