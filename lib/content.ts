import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import type { Locale } from './i18n'
import { defaultLocale } from './i18n'

const CONTENT_ROOT = path.join(process.cwd(), 'content')

export type MDXResult = {
  mdxSource: MDXRemoteSerializeResult
  frontmatter: Record<string, unknown>
  /** True when the requested locale was not available and a fallback was used. */
  fallback: boolean
  /** Locale actually loaded. */
  locale: Locale
}

export async function getMDXContent(
  type: 'eras' | 'figures',
  slug: string,
  locale: Locale = defaultLocale,
): Promise<MDXResult | null> {
  const requested = path.join(CONTENT_ROOT, type, locale, `${slug}.mdx`)
  const fallback = path.join(CONTENT_ROOT, type, defaultLocale, `${slug}.mdx`)

  let filePath: string
  let usedLocale: Locale
  let didFallback = false

  if (fs.existsSync(requested)) {
    filePath = requested
    usedLocale = locale
  } else if (fs.existsSync(fallback)) {
    filePath = fallback
    usedLocale = defaultLocale
    didFallback = locale !== defaultLocale
  } else {
    return null
  }

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { content, data } = matter(raw)
  try {
    const mdxSource = await serialize(content, { scope: data })
    return { mdxSource, frontmatter: data, fallback: didFallback, locale: usedLocale }
  } catch (err) {
    console.error(`[getMDXContent] Failed to serialize ${type}/${locale}/${slug}:`, err)
    return null
  }
}

export function getAvailableSlugs(
  type: 'eras' | 'figures',
  locale: Locale = defaultLocale,
): string[] {
  const dir = path.join(CONTENT_ROOT, type, locale)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace('.mdx', ''))
}
