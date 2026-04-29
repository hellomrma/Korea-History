# UI Design System — Editorial Monochrome

> 다른 사이트에 동일한 톤을 이식하기 위한 단일 소스.
>
> **한 줄 정의**: 흰 배경 위, 검정/회색 5단계의 본문과 단 하나의 파란색 포인트로 구성된 **라이트 에디토리얼 모노크롬** 시스템. 색이 아닌 **타이포그래피·여백·1px 보더**로 위계를 표현하고, 카드는 라운드/그림자 없이 상단 검정 1px로 시작한다.

---

## 1. 디자인 원칙

| 원칙 | 정의 |
|---|---|
| **Monochrome + Single Point** | 검정/회색 5단계 + 파란색(`#1d4ed8`) 1색. 그 외 색은 의미적 신호(난이도 3색)에만 허용. |
| **Editorial Hierarchy** | 색이 아닌 **타이포그래피 크기·굵기·여백·트래킹**으로 위계를 만든다. |
| **Border, not Shadow** | 카드/구분에 box-shadow 대신 1px border-top(검정) 또는 border(회색). |
| **Tight + Wide Tracking 대비** | 제목은 좁게 `tracking-tight` (-0.02em), 키커(eyebrow)는 넓게 `tracking-[0.22em]`. 이 대비가 에디토리얼 인상의 핵심. |
| **No Gradient, No Rounded Card** | 라운드는 점/뱃지에만. 카드·태그·탭은 모두 직각. 그라디언트 사용 안 함. |
| **Hover-only Accent** | 파란색은 정적 상태에서 절대 사용하지 않고, 호버/포커스 상태에서만 등장. |
| **Reduced Motion 존중** | `prefers-reduced-motion` 시 모든 transition/animation 비활성화. |

---

## 2. 색상 토큰

`app/globals.css`의 `@theme` 블록에 CSS 변수로 정의 → Tailwind v4 자동 클래스화 (`bg-bg`, `text-text`, `border-border` 등).

### 라이트 (기본)
```css
@theme {
  --color-bg:      #ffffff;  /* page background */
  --color-surface: #fafafa;  /* footer, subtle blocks */
  --color-border:  #e5e5e5;  /* hairlines */
  --color-text:    #0a0a0a;  /* primary text, strong borders */
  --color-muted:   #525252;  /* body copy, nav */
  --color-subtle:  #737373;  /* meta, kicker, captions */

  --color-point:   #1d4ed8;  /* single accent — hover only */

  --color-difficulty-easy:     #16a34a;
  --color-difficulty-normal:   #d97706;
  --color-difficulty-advanced: #dc2626;
}
```

### 다크 (`.dark` 클래스로 토큰 오버라이드)
```css
.dark {
  color-scheme: dark;
  --color-bg:      #0a0a0a;
  --color-surface: #141414;
  --color-border:  #262626;
  --color-text:    #fafafa;
  --color-muted:   #a3a3a3;
  --color-subtle:  #737373;

  --color-point:   #60a5fa;  /* 어두운 배경에서 가독성 위해 한 단계 밝게 */

  --color-difficulty-easy:     #22c55e;
  --color-difficulty-normal:   #f59e0b;
  --color-difficulty-advanced: #f87171;
}
```

핵심: **컴포넌트는 토큰 클래스(`bg-bg`, `text-text` 등)만 사용한다**. 다크 모드 전환은 `<html>`에 `.dark` 클래스를 붙이는 것만으로 전 화면이 자동 대응된다. 컴포넌트에 `dark:` 변형(`dark:bg-...`)을 박지 않는 것이 원칙 — UI가 항상 같은 토큰을 가리키고, 토큰의 값만 모드별로 달라진다.

### 사용 규칙
- **본문**: `text-text` (제목/강조), `text-muted` (본문), `text-subtle` (메타/년도/카테고리)
- **배경**: 페이지는 `bg-bg`, footer·섹션 분리는 `bg-surface`
- **구분선**: 강한 분리 = `border-text` (텍스트색 1px), 약한 분리 = `border-border` (회색 1px)
- **포인트**: 호버 상태에서만 `hover:text-point`, `hover:border-point`. 정적 상태에서 파랑 사용 금지.
- **그림자/그라디언트**: 사용하지 않는다.

---

## 3. 타이포그래피

### 폰트
```css
--font-sans: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont,
             system-ui, 'Segoe UI', sans-serif;
```

- **단일 폰트 패밀리**(Pretendard Variable) 한 종으로 통일. serif/Shilla 등 별도 명조체 사용 안 함.
- `font-feature-settings: "ss03", "ss04"` (body) — 가독성 향상 OpenType feature.
- `letter-spacing: -0.01em` body 전체, 제목은 `-0.02em`.

### 타입 스케일

| 역할 | 클래스 | 비고 |
|---|---|---|
| Hero H1 | `text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]` | 페이지 최상단 단 1회 |
| Page H1 | `text-4xl md:text-5xl font-semibold tracking-tight` | 서브 페이지 |
| Section H2 | `text-3xl md:text-4xl font-semibold tracking-tight` | 큰 섹션 제목 |
| Card H3 | `text-xl font-semibold text-text tracking-tight` | 카드/리스트 아이템 제목 |
| MDX H1/H2/H3 | `text-3xl / text-2xl / text-xl font-semibold tracking-tight` | 본문 위계 |
| Body | `text-sm` 또는 `text-base text-muted leading-relaxed` | 본문 단락 |
| MDX p | `leading-[1.85] text-text mb-5` | 읽기 전용 본문 — 행간 넓게 |
| Kicker (Eyebrow) | `text-[11px] uppercase tracking-[0.22em] text-subtle` | 모든 섹션 상단의 라벨 |
| Meta | `text-xs text-subtle tabular-nums` | 연도, 카운트, 카테고리 |
| Tag | `text-xs text-subtle border border-border px-2 py-0.5` | 카드 하단 칩 |

### 키커(Eyebrow) 패턴 — 핵심 시그니처
모든 섹션 위에 **소문자 영문 라벨**을 트래킹 넓게 배치. 본문(한글)과 라벨(영문, 와이드 트래킹)의 대비가 이 시스템의 정체성을 만드는 단일 시그니처.
```tsx
<p className="text-[11px] uppercase tracking-[0.22em] text-subtle mb-6">
  Sections
</p>
<h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
  역사를 탐험하는 방법
</h2>
```

---

## 4. 레이아웃 그리드

| 토큰 | 값 |
|---|---|
| 컨테이너 폭 | `max-w-6xl mx-auto` (1152px) |
| 좌우 패딩 | `px-6` (24px) |
| 섹션 상하 패딩 | `py-20` (80px) — 메인 섹션 / `py-10` 등 가변 |
| Hero 패딩 | `pt-20 pb-16` |
| 카드 그리드 갭 | `gap-x-8 gap-y-10` (균일하지 않은 가로/세로) |
| QuickLinks 갭 | `gap-x-10 gap-y-12` |

### 카드 그리드 표준
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
  {items.map(item => <Card />)}
</div>
```

---

## 5. 카드 패턴 (시그니처 컴포넌트)

이 시스템의 "심볼" 패턴 — **상단 검정 1px → 메타(연도/번호) → 제목 → 설명 → 태그**. 라운드 없음, 그림자 없음, 카드 박스 없음. 카드라기보다 **신문 칼럼의 시작점**에 가깝다.

```tsx
<Link href="..." className="group block border-t border-text pt-5">
  <p className="text-xs text-subtle tabular-nums mb-2">
    {startLabel} — {endLabel}
  </p>
  <h3 className="text-xl font-semibold text-text tracking-tight mb-3
                 group-hover:text-point transition-colors">
    {title}
  </h3>
  <p className="text-sm text-muted leading-relaxed mb-4">{summary}</p>
  <div className="flex flex-wrap gap-x-2 gap-y-1">
    {tags.map(tag => (
      <span key={tag} className="text-xs text-subtle border border-border px-2 py-0.5">
        {tag}
      </span>
    ))}
  </div>
</Link>
```

### 변형 — 넘버드 카드 (QuickLinks)
숫자 키커(`01`, `02`, `03`)가 제목과 동일 baseline에 위치.
```tsx
<div className="flex items-baseline gap-3 mb-3">
  <span className="text-xs text-subtle tabular-nums">01</span>
  <h3 className="text-xl font-semibold tracking-tight group-hover:text-point">제목</h3>
</div>
```

---

## 6. 인터랙션

### 링크 / CTA
```tsx
<Link className="inline-flex items-center gap-2 text-sm text-text
                 border-b border-text pb-0.5
                 hover:text-point hover:border-point transition-colors">
  탐험하기
  <span aria-hidden="true">→</span>
</Link>
```
- **버튼 디자인 없음** — 모든 CTA는 텍스트 + 하단 1px border 형태.
- 호버 시 텍스트와 보더 둘 다 `point`로 전환.

### 탭 / 토글 (시대 선택)
```tsx
<button className={
  isActive
    ? 'bg-text text-bg px-3 py-1.5 text-xs'
    : 'text-muted hover:text-text px-3 py-1.5 text-xs'
}>...</button>
```
- 액티브 = **검정 배경 + 흰 글자 반전**, 라운드 없음.

### 태그 / 칩
```tsx
<span className="text-xs text-subtle border border-border px-2 py-0.5">태그</span>
```
- 모서리 없음(`rounded` 안 씀), 회색 보더, 배경 투명.

### 트랜지션
- 색상 전환만: `transition-colors`. 일반적으로 200~300ms.
- 시대 전환 같은 큰 인터랙션: `.era-transition` 유틸리티 = `transition-all duration-500 ease-in-out`.

---

## 7. 헤더 / 푸터 / 모바일

### Header
- `sticky top-0 z-50`, `border-b border-border`, 높이 `py-5`.
- 로고: 한글(굵게) + 영문 키커 (`tracking-[0.18em]`) 베이스라인 정렬.
- 데스크톱 nav: `gap-8 text-sm text-muted hover:text-text`.
- 모바일 햄버거: `text-muted hover:text-text` (점 3개 / `☰` 텍스트).

### Footer
- `bg-surface border-t border-border mt-16`
- 3컬럼 그리드(`md:grid-cols-3 gap-8`)
- 상단 면책 배너 = `bg-bg border-b`, 아이콘 1개 + 작은 텍스트.
- 컬럼 헤더 = `text-xs font-bold uppercase tracking-wider`.
- 저작권 = `text-xs text-subtle text-center`.

---

## 8. MDX / 본문 컴포넌트

`components/mdx/mdx-components.tsx`에 등록된 매핑이 본문 톤을 결정.
```ts
h1: 'text-3xl font-semibold tracking-tight mt-12 mb-5'
h2: 'text-2xl font-semibold tracking-tight mt-10 mb-4'
h3: 'text-xl font-semibold tracking-tight mt-6 mb-3'
p:  'leading-[1.85] text-text mb-5'
ul: 'list-disc list-inside mb-5 space-y-1.5'
blockquote: 'border-l-2 border-text pl-5 my-6 text-muted'
```

### Level 섹션 (난이도별 본문)
```tsx
<section className="border-t border-text pt-6 mt-14 first:mt-2">
  <p className="text-[11px] uppercase tracking-[0.22em] text-subtle mb-6">
    Easy · 쉬움
  </p>
  <div>{children}</div>
</section>
```
한 페이지에 Easy/Normal/Advanced 섹션을 수직으로 쌓되, 각 시작점은 검정 보더 + 키커.

---

## 9. 의미 색상 — 예외 처리

흑백 원칙의 **유일한 예외**는 난이도 신호.
```tsx
<span className="text-difficulty-easy">●</span>     // 녹색
<span className="text-difficulty-normal">●</span>   // 주황
<span className="text-difficulty-advanced">●</span> // 빨강
```
- 점(2x2) + 텍스트로만 사용. 배경 채우기 금지.
- 이 외에 의미 색이 필요하면 토큰을 추가하되 같은 패턴(점+텍스트)을 따른다.

---

## 10. 접근성 / 모션

```css
@media (prefers-reduced-motion: reduce) {
  .era-transition,
  [class*="transition"],
  [class*="duration"] {
    transition: none !important;
    animation: none !important;
  }
}
```
- 모든 인터랙티브 요소는 `aria-label` / `aria-current` / `aria-expanded` 명시.
- 카드 링크는 `group` + `group-hover` 패턴으로 자식 요소 일괄 색 전환.
- 검정 위 흰 글자 반전(액티브 탭) 외에는 텍스트 대비를 충분히 확보(text-muted = #525252 = AA 통과).

---

## 11. 테마 전환 (Light / Dark / System)

### 모드 정의
| 모드 | 동작 |
|---|---|
| `light` | 항상 라이트. **초기 진입 기본값.** |
| `dark` | 항상 다크. |
| `system` | `prefers-color-scheme` 미디어쿼리를 따라감. 시스템 설정이 바뀌면 즉시 반영. |

저장소: `localStorage.theme` (`'light' | 'dark' | 'system'`). 비어 있으면 `'light'`로 간주.

### 토글 동작
헤더 우측 버튼 클릭 시 순환: **light → dark → system → light**. 아이콘은 SVG ☼ / ☾ / ▭ 세 종.

### 구성 파일
| 역할 | 파일 |
|---|---|
| 토큰 오버라이드 | [app/globals.css](../app/globals.css) `.dark { ... }` 블록 |
| No-flash 스크립트 | [app/layout.tsx](../app/layout.tsx) 내 `NO_FLASH_THEME_SCRIPT` 상수 |
| 토글 버튼 | [components/theme/ThemeToggle.tsx](../components/theme/ThemeToggle.tsx) |
| 헤더 슬롯 | [components/layout/Header.tsx](../components/layout/Header.tsx) — `<GlobalSearch />` 다음 |

### 무깜빡임(no-flash) 패턴
`<head>` 최상단에 동기 인라인 스크립트를 두어 React 하이드레이션 **전에** localStorage를 읽고 `<html>`에 `.dark`를 붙인다. 이 한 줄로 SSR → 첫 페인트 사이의 라이트 깜빡임을 제거한다.

```ts
// app/layout.tsx
const NO_FLASH_THEME_SCRIPT =
  `(function(){try{var m=localStorage.getItem('theme')||'light';` +
  `var d=m==='dark'||(m==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);` +
  `if(d)document.documentElement.classList.add('dark');}catch(e){}})();`

return (
  <html lang="ko" suppressHydrationWarning>
    <head>
      <script dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }} />
    </head>
    ...
  </html>
)
```

`suppressHydrationWarning`은 스크립트가 하이드레이션 전에 클래스를 변경하기 때문에 필요(없으면 React가 mismatch 경고를 띄운다).

### 다크 토큰 디자인 가이드
- 라이트의 정확한 반대가 아니라 **계조 보존**: text와 muted/subtle 사이의 명도 차이가 라이트와 비슷해야 가독성이 유지된다.
- `point`(파란색)는 다크 배경에서 한 단계 밝게 (`#1d4ed8` → `#60a5fa`).
- 의미 색(난이도)도 다크에서는 한 단계 밝은 톤으로 (700 → 500/400 단계).
- `bg`와 `surface`의 차이는 라이트(`#ffffff`/`#fafafa`)보다 다크(`#0a0a0a`/`#141414`)에서 더 크게 둔다 — 다크에서는 명도차가 작으면 분리감이 사라진다.
- `color-scheme: dark`를 `.dark`에 함께 선언 → 네이티브 폼 컨트롤·스크롤바도 다크화.

---

## 12. 다른 프로젝트로 이식하기

### Step 1. globals.css 복사
`app/globals.css` 전체를 그대로 가져간다. Tailwind v4(`@theme` 디렉티브)가 전제. v3 사용 중이면 토큰을 `tailwind.config.ts`의 `theme.extend.colors`로 옮긴다.

### Step 2. 폰트 import
Pretendard CDN 링크를 `globals.css` 최상단에서 그대로 사용. 별도 `next/font` 설정 불필요.

### Step 3. 시그니처 3종을 베이스로
이 셋만 일관되게 박혀 있으면 시스템의 정체성이 유지된다.
- **카드**: `border-t border-text pt-5` 패턴 (§5 참조)
- **키커**: `text-[11px] uppercase tracking-[0.22em] text-subtle` (§3 참조)
- **CTA**: `border-b border-text pb-0.5 hover:text-point hover:border-point` (§6 참조)

### Step 4. 금지 리스트
- ❌ `rounded-lg` 이상 라운드 (점/뱃지의 `rounded-full` 제외)
- ❌ `shadow-*` 일체
- ❌ 배경 그라디언트 (`bg-gradient-to-*`)
- ❌ 정적 상태에서 `text-point` / 파란 텍스트 — 호버/포커스 전용
- ❌ 다양한 폰트 패밀리 혼용 (Pretendard 한 종으로 끝)
- ❌ 의미 색을 면(배경)으로 채우기 — 점+텍스트로만 신호화

### Step 5. 테마 전환 설치 (선택)
다크 모드를 함께 가져가려면:
1. `globals.css`의 `.dark { ... }` 블록과 `@custom-variant dark (...)` 디렉티브를 그대로 복사
2. 루트 layout `<head>`에 `NO_FLASH_THEME_SCRIPT` 인라인 삽입 + `<html suppressHydrationWarning>`
3. `components/theme/ThemeToggle.tsx`를 그대로 복사 후 헤더에 한 줄 추가

이게 전부. 컴포넌트는 토큰만 쓰면 되므로 다크 대응 작업이 별도로 발생하지 않는다.

### Step 6. 신규 컴포넌트 결정 트리
```
새 컴포넌트가 필요하다
  → 흑백 + border + 타이포그래피만으로 표현 가능한가?
    yes → 그대로 진행
    no  → 정말 의미적 신호인가? (성공/실패/난이도 등)
      yes → 토큰을 새로 추가하고 점+텍스트 패턴 적용
      no  → 디자인 재고 (시각 위계로 풀 수 있는지)
```

---

## 13. 참고 파일 인덱스

| 영역 | 파일 |
|---|---|
| 토큰/폰트 (라이트·다크) | [app/globals.css](../app/globals.css) |
| 글로벌 레이아웃 + 무깜빡임 스크립트 | [app/layout.tsx](../app/layout.tsx) |
| 테마 토글 | [components/theme/ThemeToggle.tsx](../components/theme/ThemeToggle.tsx) |
| 헤더 (토글 슬롯) | [components/layout/Header.tsx](../components/layout/Header.tsx) |
| 푸터 | [components/layout/Footer.tsx](../components/layout/Footer.tsx) |
| Hero | [components/home/EraHero.tsx](../components/home/EraHero.tsx) |
| 카드(시그니처) | [components/ui/EraCard.tsx](../components/ui/EraCard.tsx), [components/ui/FigureCard.tsx](../components/ui/FigureCard.tsx) |
| 넘버드 카드 | [components/home/QuickLinks.tsx](../components/home/QuickLinks.tsx) |
| 타임라인 카드 | [components/timeline/TimelineCard.tsx](../components/timeline/TimelineCard.tsx) |
| MDX 매핑 | [components/mdx/mdx-components.tsx](../components/mdx/mdx-components.tsx) |
| 난이도 뱃지 | [components/ui/DifficultyBadge.tsx](../components/ui/DifficultyBadge.tsx) |
