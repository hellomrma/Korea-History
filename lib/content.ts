import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'

const CONTENT_ROOT = path.join(process.cwd(), 'content')

export async function getMDXContent(type: 'eras' | 'figures', slug: string) {
  const filePath = path.join(CONTENT_ROOT, type, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { content, data } = matter(raw)
  try {
    const mdxSource = await serialize(content, { scope: data })
    return { mdxSource, frontmatter: data }
  } catch (err) {
    console.error(`[getMDXContent] Failed to serialize ${type}/${slug}:`, err)
    return null
  }
}

export function getAvailableSlugs(type: 'eras' | 'figures'): string[] {
  const dir = path.join(CONTENT_ROOT, type)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace('.mdx', ''))
}
