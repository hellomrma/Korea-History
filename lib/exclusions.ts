/**
 * 노출하지 않을 시대 slug 목록.
 * lib/eras.ts, lib/figures.ts, lib/events.ts 의 getAll* 진입점에서 일괄 차단되어
 * 홈·검색·타임라인·지도·도감·sitemap·직접 URL 등 모든 노출 경로에서 제외됩니다.
 */
export const EXCLUDED_ERAS: ReadonlySet<string> = new Set(['modern'])

export function isExcludedEra(slug: string): boolean {
  return EXCLUDED_ERAS.has(slug)
}
