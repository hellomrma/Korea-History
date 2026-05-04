# UI Design System — Editorial Monochrome

> 어떤 스택에서든 동일한 톤을 이식하기 위한 단일 소스.
>
> **한 줄 정의**: 흰 배경 위, 검정/회색 5단계의 본문과 단 하나의 파란색 포인트로 구성된 **에디토리얼 모노크롬** 시스템. 색이 아닌 **타이포그래피·여백·1px 보더**로 위계를 표현하고, 카드는 라운드/그림자 없이 상단 검정 1px로 시작한다.

---

## 목차

1. [디자인 원칙](#1-디자인-원칙)
2. [색상 토큰](#2-색상-토큰)
3. [타이포그래피](#3-타이포그래피)
4. [레이아웃 그리드](#4-레이아웃-그리드)
5. [카드 패턴](#5-카드-패턴-시그니처-컴포넌트)
6. [인터랙션](#6-인터랙션)
7. [헤더 / 푸터 / 모바일](#7-헤더--푸터--모바일)
8. [본문 컴포넌트](#8-본문-컴포넌트)
9. [의미 색상 — 예외 처리](#9-의미-색상--예외-처리)
10. [접근성](#10-접근성)
11. [다크 모드](#11-다크-모드)
12. [프레임워크 어댑터](#12-프레임워크-어댑터)
13. [이식 가이드](#13-이식-가이드)

---

## 1. 디자인 원칙

| 원칙 | 정의 |
|---|---|
| **Monochrome + Single Point** | 검정/회색 5단계 + 파란색(`#1d4ed8`) 1색. 그 외 색은 의미적 신호에만 허용. |
| **Editorial Hierarchy** | 색이 아닌 **타이포그래피 크기·굵기·여백·트래킹**으로 위계를 만든다. |
| **Border, not Shadow** | 카드/구분에 `box-shadow` 대신 `1px border-top`(검정) 또는 `border`(회색). |
| **Tight + Wide Tracking 대비** | 제목은 좁게(`-0.025em`), 키커(eyebrow)는 넓게(`0.22em`). 이 대비가 에디토리얼 인상의 핵심. |
| **No Gradient, No Rounded Card** | `border-radius`는 점/뱃지에만. 카드·태그·탭은 모두 직각. 그라디언트 사용 안 함. |
| **Hover-only Accent** | 파란색은 정적 상태에서 절대 사용하지 않고, `:hover` / `:focus` 상태에서만 등장. |
| **No Transitions** | 상태 변화는 즉시 일어난다. `transition` / `animation` 미사용. 에디토리얼 톤에는 칼같은 즉시 전환이 더 어울린다. |

---

## 2. 색상 토큰

모든 색은 **CSS 커스텀 프로퍼티**가 원천이다. 어떤 프레임워크든 이 변수만 참조하면 다크 모드 전환이 자동으로 작동한다.

### 2-1. 라이트 (기본)

```css
:root {
  --color-bg:      #ffffff;  /* 페이지 배경 */
  --color-surface: #fafafa;  /* footer, 섹션 분리 배경 */
  --color-border:  #e5e5e5;  /* 얇은 구분선 */
  --color-text:    #0a0a0a;  /* 제목·강조·강한 보더 */
  --color-muted:   #525252;  /* 본문·내비게이션 */
  --color-subtle:  #737373;  /* 메타·키커·캡션 */

  --color-point:   #1d4ed8;  /* 단일 포인트 색 — :hover/:focus 전용 */

  --color-difficulty-easy:     #16a34a;
  --color-difficulty-normal:   #d97706;
  --color-difficulty-advanced: #dc2626;
}
```

### 2-2. 다크 (`.dark` 클래스로 오버라이드)

```css
.dark {
  color-scheme: dark;   /* 네이티브 폼·스크롤바도 다크화 */

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

> **핵심 규칙**: 컴포넌트는 절대 하드코딩 색상(`#0a0a0a`, `white` 등)을 쓰지 않는다. 토큰 변수만 참조하면 `.dark` 클래스를 `<html>`에 붙이는 것만으로 전 화면이 자동 전환된다.

### 2-3. 사용 규칙

| 역할 | 토큰 |
|---|---|
| 제목·강조 | `var(--color-text)` |
| 본문·내비 | `var(--color-muted)` |
| 메타·연도·키커 | `var(--color-subtle)` |
| 페이지 배경 | `var(--color-bg)` |
| Footer·섹션 배경 | `var(--color-surface)` |
| 강한 구분선 | `var(--color-text)` 1px |
| 약한 구분선 | `var(--color-border)` 1px |
| 포인트 (hover/focus만) | `var(--color-point)` |

---

## 3. 타이포그래피

### 3-1. 폰트

```css
:root {
  --font-sans:
    'Pretendard Variable', Pretendard,
    -apple-system, BlinkMacSystemFont,
    system-ui, 'Segoe UI', sans-serif;
}

body {
  font-family: var(--font-sans);
  font-feature-settings: "ss03", "ss04";
  letter-spacing: -0.01em;
  color: var(--color-muted);
  background: var(--color-bg);
}
```

**Pretendard CDN** — `<head>` 최상단에 삽입:
```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
/>
```

- **단일 폰트 패밀리** 한 종으로 통일. serif·명조체 혼용 금지.
- Variable 폰트 사용 → 모든 weight를 단일 파일로 처리.

### 3-2. 타입 스케일

| 역할 | `font-size` | `font-weight` | `letter-spacing` | `line-height` |
|---|---|---|---|---|
| Hero H1 | `3rem` ~ `4.5rem` | 600 | `-0.025em` | `1.05` |
| Page H1 | `2.25rem` ~ `3rem` | 600 | `-0.025em` | `1.1` |
| Section H2 | `1.875rem` ~ `2.25rem` | 600 | `-0.025em` | `1.2` |
| Card H3 | `1.25rem` | 600 | `-0.025em` | `1.3` |
| Body | `0.875rem` ~ `1rem` | 400 | `-0.01em` | `1.625` |
| MDX 본문 단락 | `1rem` | 400 | `-0.01em` | `1.85` |
| **Kicker (Eyebrow)** | `0.6875rem` (11px) | 400 | **`0.22em`** | `1.4` |
| Meta | `0.75rem` | 400 | `0` | `1.4` |
| Tag | `0.75rem` | 400 | `0` | `1.4` |

```css
/* 예시 CSS */
.hero-title {
  font-size: clamp(3rem, 6vw, 4.5rem);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.05;
  color: var(--color-text);
}

.kicker {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: var(--color-subtle);
}
```

### 3-3. 키커(Eyebrow) 패턴 — 핵심 시그니처

모든 섹션 위에 소문자 영문 라벨을 트래킹 넓게 배치. 본문(한글)과 라벨(영문, 와이드 트래킹)의 대비가 이 시스템의 정체성을 만드는 단일 시그니처.

```html
<p class="kicker" style="margin-bottom: 1.5rem;">Sections</p>
<h2 class="section-title">역사를 탐험하는 방법</h2>
```

```css
.kicker {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: var(--color-subtle);
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: clamp(1.875rem, 3vw, 2.25rem);
  font-weight: 600;
  letter-spacing: -0.025em;
  color: var(--color-text);
}
```

---

## 4. 레이아웃 그리드

```css
.container {
  max-width: 72rem;          /* 1152px */
  margin-inline: auto;
  padding-inline: 1.5rem;    /* 24px */
}

.section {
  padding-block: 5rem;       /* 80px — 메인 섹션 */
}

.section--hero {
  padding-top: 5rem;
  padding-bottom: 4rem;
}

/* 카드 그리드 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2.5rem 2rem;          /* row: 40px, col: 32px */
}

@media (min-width: 640px) {
  .card-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .card-grid { grid-template-columns: repeat(3, 1fr); }
}
```

---

## 5. 카드 패턴 (시그니처 컴포넌트)

이 시스템의 핵심 패턴 — **상단 검정 1px → 메타(연도/번호) → 제목 → 설명 → 태그**. 라운드 없음, 그림자 없음. 카드라기보다 **신문 칼럼의 시작점**에 가깝다.

```html
<a href="/..." class="card">
  <p class="card__meta">918 — 1392</p>
  <h3 class="card__title">고려</h3>
  <p class="card__desc">불교 문화의 꽃을 피운 왕조...</p>
  <div class="card__tags">
    <span class="tag">불교</span>
    <span class="tag">고려청자</span>
  </div>
</a>
```

```css
.card {
  display: block;
  border-top: 1px solid var(--color-text);
  padding-top: 1.25rem;
  text-decoration: none;
}

.card__meta {
  font-size: 0.75rem;
  color: var(--color-subtle);
  font-variant-numeric: tabular-nums;
  margin-bottom: 0.5rem;
}

.card__title {
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  color: var(--color-text);
  margin-bottom: 0.75rem;
}

/* 호버 시 즉시 전환 — transition 없음 */
.card:hover .card__title,
.card:focus .card__title {
  color: var(--color-point);
}

.card__desc {
  font-size: 0.875rem;
  color: var(--color-muted);
  line-height: 1.625;
  margin-bottom: 1rem;
}

.card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.5rem;
}

.tag {
  font-size: 0.75rem;
  color: var(--color-subtle);
  border: 1px solid var(--color-border);
  padding: 0.125rem 0.5rem;
  /* border-radius 없음 — 직각 */
}
```

### 변형 — 넘버드 카드

```html
<a href="/..." class="card card--numbered">
  <div class="card__header">
    <span class="card__number">01</span>
    <h3 class="card__title">제목</h3>
  </div>
  <p class="card__desc">설명</p>
</a>
```

```css
.card__header {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.card__number {
  font-size: 0.75rem;
  color: var(--color-subtle);
  font-variant-numeric: tabular-nums;
}
```

---

## 6. 인터랙션

### 링크 / CTA

```html
<a href="/..." class="cta">탐험하기 →</a>
```

```css
.cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-text);
  padding-bottom: 0.125rem;
  text-decoration: none;
}

.cta:hover,
.cta:focus {
  color: var(--color-point);
  border-bottom-color: var(--color-point);
}
```

- **버튼 디자인 없음** — 모든 CTA는 텍스트 + 하단 1px border.
- 호버 시 텍스트와 보더 둘 다 `point`로 **즉시** 전환 (페이드 없음).

### 탭 / 토글

```css
.tab {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  color: var(--color-muted);
  background: transparent;
  border: none;
  cursor: pointer;
}

.tab:hover { color: var(--color-text); }

.tab[aria-selected="true"],
.tab--active {
  background: var(--color-text);
  color: var(--color-bg);
  /* border-radius 없음 */
}
```

### 트랜지션

**사용하지 않는다.** `transition-*`, `animation-*` 모두 금지. 상태 변화는 즉시 반영.

---

## 7. 헤더 / 푸터 / 모바일

### Header 구조

```html
<header class="header">
  <div class="container">
    <div class="header__inner">
      <a href="/" class="logo">
        <strong>한국사</strong>
        <span class="logo__sub">Korea History</span>
      </a>
      <nav class="nav" aria-label="주 내비게이션">
        <a href="/timeline" class="nav__link">타임라인</a>
        <a href="/figures"  class="nav__link">인물</a>
        <a href="/eras"     class="nav__link">시대</a>
      </nav>
    </div>
  </div>
</header>
```

```css
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  padding-block: 1.25rem;
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.logo { text-decoration: none; display: flex; align-items: baseline; gap: 0.5rem; }
.logo strong { color: var(--color-text); font-weight: 700; }
.logo__sub {
  font-size: 0.625rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-subtle);
}

.nav { display: flex; gap: 2rem; }
.nav__link {
  font-size: 0.875rem;
  color: var(--color-muted);
  text-decoration: none;
}
.nav__link:hover { color: var(--color-text); }
```

### Footer 구조

```css
.footer {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  margin-top: 4rem;
  padding-block: 3rem;
}

.footer__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .footer__grid { grid-template-columns: repeat(3, 1fr); }
}

.footer__heading {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.footer__copy {
  font-size: 0.75rem;
  color: var(--color-subtle);
  text-align: center;
  margin-top: 2rem;
}
```

---

## 8. 본문 컴포넌트

긴 글 본문(MDX, 블로그, 문서)에 적용하는 기본 스타일.

```css
.prose h1 { font-size: 1.875rem; font-weight: 600; letter-spacing: -0.025em; margin: 3rem 0 1.25rem; color: var(--color-text); }
.prose h2 { font-size: 1.5rem;   font-weight: 600; letter-spacing: -0.025em; margin: 2.5rem 0 1rem;   color: var(--color-text); }
.prose h3 { font-size: 1.25rem;  font-weight: 600; letter-spacing: -0.025em; margin: 1.5rem 0 0.75rem; color: var(--color-text); }

.prose p {
  line-height: 1.85;
  color: var(--color-text);
  margin-bottom: 1.25rem;
}

.prose ul {
  list-style: disc;
  list-style-position: inside;
  margin-bottom: 1.25rem;
}
.prose li { margin-bottom: 0.375rem; }

.prose blockquote {
  border-left: 2px solid var(--color-text);
  padding-left: 1.25rem;
  margin: 1.5rem 0;
  color: var(--color-muted);
}
```

### 난이도별 섹션

```html
<section class="level-section">
  <p class="kicker">Easy · 쉬움</p>
  <div class="prose">...</div>
</section>
```

```css
.level-section {
  border-top: 1px solid var(--color-text);
  padding-top: 1.5rem;
  margin-top: 3.5rem;
}
.level-section:first-child { margin-top: 0.5rem; }
```

---

## 9. 의미 색상 — 예외 처리

흑백 원칙의 **유일한 예외**는 난이도 신호.

```html
<span class="badge badge--easy">●</span> 쉬움
<span class="badge badge--normal">●</span> 보통
<span class="badge badge--advanced">●</span> 심화
```

```css
.badge--easy     { color: var(--color-difficulty-easy); }
.badge--normal   { color: var(--color-difficulty-normal); }
.badge--advanced { color: var(--color-difficulty-advanced); }
```

- **점(●) + 텍스트**로만 사용. 배경 채우기 금지.
- 새로운 의미 색이 필요하면 토큰을 추가하되 같은 패턴(점+텍스트)을 따른다.

---

## 10. 접근성

- 모션이 0이므로 `prefers-reduced-motion` 가드 불필요 — 모션 감소 설정 사용자도 동일한 경험.
- 모든 인터랙티브 요소에 `aria-label` / `aria-current` / `aria-expanded` 명시.
- 카드 링크는 전체 영역이 클릭 가능해야 한다 (`<a>` wrapping).
- `--color-muted: #525252` → 흰 배경 대비 4.6:1 (AA 통과).
- 액티브 탭 반전(검정 배경 + 흰 글자)은 `aria-selected="true"` 또는 `aria-current` 사용.

---

## 11. 다크 모드

### 모드 정의

| 모드 | 동작 |
|---|---|
| `light` | 항상 라이트. **초기 진입 기본값.** |
| `dark` | 항상 다크. |
| `system` | `prefers-color-scheme` 미디어쿼리를 따라감. |

저장: `localStorage.theme` = `'light' | 'dark' | 'system'`. 미설정 시 `'light'` 취급.

### No-flash 인라인 스크립트

페이지 로드 깜빡임을 막으려면 `<head>` **최상단**에 동기 스크립트를 삽입한다. React hydration 전에 실행되어야 효과가 있다.

```html
<head>
  <script>
    (function () {
      try {
        var m = localStorage.getItem('theme') || 'light';
        var dark =
          m === 'dark' ||
          (m === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (dark) document.documentElement.classList.add('dark');
      } catch (e) {}
    })();
  </script>
  <!-- 이후 CSS, 폰트 링크 -->
</head>
```

### 토글 로직 (Vanilla JS)

```js
function getTheme() {
  return localStorage.getItem('theme') || 'light';
}

function applyTheme(mode) {
  var dark =
    mode === 'dark' ||
    (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
  localStorage.setItem('theme', mode);
}

function cycleTheme() {
  var order = ['light', 'dark', 'system'];
  var cur = order.indexOf(getTheme());
  applyTheme(order[(cur + 1) % order.length]);
}

document.getElementById('theme-toggle').addEventListener('click', cycleTheme);

// system 모드일 때 OS 변경에 즉시 반응
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
  if (getTheme() === 'system') applyTheme('system');
});
```

### 다크 토큰 디자인 가이드

- 라이트의 정확한 반대가 아니라 **계조 보존**: text↔muted↔subtle 사이 명도 차이를 라이트와 비슷하게 유지해야 가독성이 유지된다.
- `--color-point`는 다크에서 한 단계 밝게 (`#1d4ed8` → `#60a5fa`).
- `--color-bg`와 `--color-surface`의 차이를 다크에서 더 크게: `#0a0a0a` / `#141414`.

---

## 12. 프레임워크 어댑터

CSS 커스텀 프로퍼티(§2)가 모든 스택의 원천이다. 아래는 각 환경별 연결 방법.

### 12-1. 순수 HTML/CSS

§2의 `:root { ... }` 블록을 전역 CSS 파일에 그대로 복사하면 끝.

```html
<html class="">  <!-- JS로 'dark' 클래스 붙임 -->
<head>
  <script>/* no-flash 스크립트 (§11) */</script>
  <link rel="stylesheet" href="tokens.css"> <!-- :root 변수 포함 -->
</head>
```

### 12-2. Tailwind CSS v4

`@theme` 블록에 토큰을 등록하면 `bg-bg`, `text-text` 등의 클래스가 자동 생성된다.

```css
/* globals.css */
@import "tailwindcss";

@theme {
  --color-bg:       #ffffff;
  --color-surface:  #fafafa;
  --color-border:   #e5e5e5;
  --color-text:     #0a0a0a;
  --color-muted:    #525252;
  --color-subtle:   #737373;
  --color-point:    #1d4ed8;

  --color-difficulty-easy:     #16a34a;
  --color-difficulty-normal:   #d97706;
  --color-difficulty-advanced: #dc2626;
}

@custom-variant dark (&:where(.dark, .dark *));

.dark {
  color-scheme: dark;
  --color-bg:      #0a0a0a;
  --color-surface: #141414;
  --color-border:  #262626;
  --color-text:    #fafafa;
  --color-muted:   #a3a3a3;
  --color-subtle:  #737373;
  --color-point:   #60a5fa;

  --color-difficulty-easy:     #22c55e;
  --color-difficulty-normal:   #f59e0b;
  --color-difficulty-advanced: #f87171;
}
```

> 컴포넌트는 `bg-bg`, `text-muted`, `border-border` 등 토큰 클래스만 사용. `dark:bg-*` 변형은 쓰지 않는다.

### 12-3. Tailwind CSS v3

`tailwind.config.js`에 토큰을 등록하고, CSS 변수로 연결한다.

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg:      'var(--color-bg)',
        surface: 'var(--color-surface)',
        border:  'var(--color-border)',
        text:    'var(--color-text)',
        muted:   'var(--color-muted)',
        subtle:  'var(--color-subtle)',
        point:   'var(--color-point)',
        'difficulty-easy':     'var(--color-difficulty-easy)',
        'difficulty-normal':   'var(--color-difficulty-normal)',
        'difficulty-advanced': 'var(--color-difficulty-advanced)',
      },
    },
  },
};
```

전역 CSS에는 `:root { ... }` + `.dark { ... }` 블록(§2)을 그대로 사용.

### 12-4. React / Next.js

```tsx
// components/ThemeToggle.tsx
'use client';
import { useEffect, useState } from 'react';

type Mode = 'light' | 'dark' | 'system';
const ORDER: Mode[] = ['light', 'dark', 'system'];
const ICONS: Record<Mode, string> = { light: '☼', dark: '☾', system: '▭' };

function applyTheme(mode: Mode) {
  const dark =
    mode === 'dark' ||
    (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
  localStorage.setItem('theme', mode);
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>('light');

  useEffect(() => {
    setMode((localStorage.getItem('theme') as Mode) || 'light');
  }, []);

  const cycle = () => {
    const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
    applyTheme(next);
    setMode(next);
  };

  return (
    <button onClick={cycle} aria-label={`테마: ${mode}`}>
      {ICONS[mode]}
    </button>
  );
}
```

No-flash 스크립트는 `<head>` 안에 `<script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }}>`로 삽입하고, `<html suppressHydrationWarning>`을 설정한다.

### 12-5. Vue 3 / Nuxt

```ts
// composables/useTheme.ts
import { ref } from 'vue';

type Mode = 'light' | 'dark' | 'system';
const ORDER: Mode[] = ['light', 'dark', 'system'];

function apply(mode: Mode) {
  const dark =
    mode === 'dark' ||
    (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
  localStorage.setItem('theme', mode);
}

export function useTheme() {
  const mode = ref<Mode>((localStorage.getItem('theme') as Mode) || 'light');
  const cycle = () => {
    mode.value = ORDER[(ORDER.indexOf(mode.value) + 1) % ORDER.length];
    apply(mode.value);
  };
  return { mode, cycle };
}
```

No-flash 스크립트는 Nuxt에서 `useHead({ script: [{ innerHTML: NO_FLASH_SCRIPT }] })`으로 주입.

### 12-6. Svelte / SvelteKit

```svelte
<!-- ThemeToggle.svelte -->
<script lang="ts">
  type Mode = 'light' | 'dark' | 'system';
  const ORDER: Mode[] = ['light', 'dark', 'system'];
  let mode: Mode = (typeof localStorage !== 'undefined'
    ? (localStorage.getItem('theme') as Mode)
    : null) ?? 'light';

  function cycle() {
    mode = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
    const dark = mode === 'dark' ||
      (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', mode);
  }
</script>

<button on:click={cycle} aria-label="테마 전환">
  {mode === 'light' ? '☼' : mode === 'dark' ? '☾' : '▭'}
</button>
```

No-flash는 SvelteKit `app.html`의 `<head>` 최상단에 직접 삽입.

---

## 13. 이식 가이드

### Step 1 — 색상 토큰 복사

`§2`의 `:root { ... }` + `.dark { ... }` 블록을 전역 CSS에 붙인다.

### Step 2 — 폰트 import

Pretendard CDN 링크를 `<head>`에 추가 (§3-1 참조).

### Step 3 — No-flash 스크립트 삽입

`<head>` 최상단에 §11의 인라인 스크립트를 삽입한다. CSS보다 먼저 위치해야 한다.

### Step 4 — 시그니처 3종 적용

이 셋만 일관되게 있으면 시스템의 정체성이 유지된다.

| 패턴 | 핵심 CSS |
|---|---|
| **카드** | `border-top: 1px solid var(--color-text); padding-top: 1.25rem` |
| **키커** | `font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.22em; color: var(--color-subtle)` |
| **CTA** | `border-bottom: 1px solid var(--color-text); :hover { color: var(--color-point); border-color: var(--color-point) }` |

### Step 5 — 프레임워크 어댑터 선택

§12에서 현재 스택에 맞는 방법을 적용한다.

### 금지 리스트

| 금지 | 이유 |
|---|---|
| `border-radius` ≥ `0.5rem` (점/뱃지 제외) | 에디토리얼 직각 원칙 |
| `box-shadow` 일체 | 보더로 대체 |
| 배경 그라디언트 | 단색 원칙 |
| 정적 상태에서 `var(--color-point)` | hover/focus 전용 |
| `transition` / `animation` | 즉시 전환 원칙 |
| 여러 폰트 패밀리 혼용 | Pretendard 단일 |
| 의미 색을 배경(면)으로 사용 | 점+텍스트로만 신호화 |
| 컴포넌트에 하드코딩 색상 | 토큰 변수만 사용 |

### 신규 컴포넌트 결정 트리

```
새 컴포넌트가 필요하다
  → 흑백 + border + 타이포그래피만으로 표현 가능한가?
    yes → 그대로 진행
    no  → 정말 의미적 신호인가? (성공/실패/난이도 등)
      yes → 토큰을 추가하고 점+텍스트 패턴 적용
      no  → 디자인 재고 (시각 위계로 풀 수 있는지)
```
