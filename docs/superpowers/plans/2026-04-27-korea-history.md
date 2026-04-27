# 한국역사 학습 웹사이트 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 고조선부터 현대까지 한국 역사를 어린이~노인 전 연령이 학습할 수 있는 Next.js 정적 웹사이트 구축

**Architecture:** Next.js 14 App Router + TypeScript로 정적 생성(SSG) 기반 웹사이트. 콘텐츠는 MDX 파일로 관리하며 `<Level>` 컴포넌트로 난이도(쉬움/보통/심화)별 콘텐츠를 분기. 타임라인은 외부 라이브러리 없이 CSS + Intersection Observer로, 지도는 react-simple-maps로 구현.

**Tech Stack:** Next.js 14 (App Router), TypeScript 5, Tailwind CSS 3, next-mdx-remote 4, react-simple-maps, pnpm, Vercel

---

## 파일 구조

```
korea-history/
├── app/
│   ├── layout.tsx                  # 공통 레이아웃 (폰트/헤더/푸터)
│   ├── globals.css                 # Tailwind directives + 커스텀 CSS
│   ├── page.tsx                    # 홈 (타임라인 히어로)
│   ├── era/[slug]/page.tsx         # 시대 상세
│   ├── figure/[slug]/page.tsx      # 인물 상세
│   ├── figures/page.tsx            # 인물 도감 목록
│   ├── timeline/page.tsx           # 인터랙티브 타임라인
│   └── map/page.tsx                # 역사 지도
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx              # 상단 네비게이션
│   │   └── Footer.tsx              # 하단 푸터
│   ├── ui/
│   │   ├── DifficultyBadge.tsx     # 난이도 배지
│   │   ├── LevelSelector.tsx       # 난이도 전환 탭
│   │   ├── EraCard.tsx             # 시대 카드
│   │   └── FigureCard.tsx          # 인물 카드
│   ├── mdx/
│   │   ├── Level.tsx               # 난이도별 콘텐츠 래퍼
│   │   └── mdx-components.tsx      # MDX 커스텀 컴포넌트 맵
│   ├── home/
│   │   ├── EraHero.tsx             # 히어로 (시대 슬라이더)
│   │   └── QuickLinks.tsx          # 바로가기 카드 3개
│   ├── timeline/
│   │   ├── TimelineView.tsx        # 타임라인 컨테이너
│   │   ├── TimelineCard.tsx        # 사건 카드 (좌우 교차)
│   │   └── TimelineFilter.tsx      # 카테고리 필터
│   ├── map/
│   │   ├── HistoryMap.tsx          # SVG 지도 컨테이너
│   │   ├── EraSelector.tsx         # 시대 선택 드롭다운
│   │   └── LocationMarker.tsx      # 지도 핀 + 팝업
│   └── figures/
│       ├── FigureGrid.tsx          # 인물 그리드
│       └── FigureFilter.tsx        # 시대/역할 필터
│
├── lib/
│   ├── content.ts                  # MDX 파일 로딩 유틸리티
│   ├── eras.ts                     # eras.json 타입 + 로더
│   ├── figures.ts                  # figures.json 타입 + 로더
│   └── events.ts                   # events.json 타입 + 로더
│
├── types/
│   └── index.ts                    # 공통 TypeScript 타입 정의
│
├── content/
│   ├── data/
│   │   ├── eras.json               # 시대 메타데이터 (12개)
│   │   ├── figures.json            # 인물 메타데이터
│   │   └── events.json             # 타임라인 사건 데이터
│   ├── eras/                       # 시대별 MDX 파일
│   └── figures/                    # 인물별 MDX 파일
│
└── public/
    └── images/
        ├── eras/                   # 시대 대표 이미지
        └── figures/                # 인물 이미지
```

---

## Task 1: 프로젝트 초기화 및 설정

**Files:**
- Create: `package.json` (pnpm + Next.js 설정)
- Create: `tailwind.config.ts`
- Create: `next.config.mjs`
- Create: `app/globals.css`
- Create: `app/layout.tsx`
- Create: `components/layout/Header.tsx`
- Create: `components/layout/Footer.tsx`

- [ ] **Step 1: Next.js 프로젝트 생성**

```bash
cd D:/github/Korea-History
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir=no --import-alias="@/*"
```

프롬프트에서: TypeScript=Yes, ESLint=Yes, Tailwind=Yes, src/=No, App Router=Yes, import alias=`@/*`

- [ ] **Step 2: 추가 의존성 설치**

```bash
pnpm add next-mdx-remote gray-matter react-simple-maps
pnpm add -D @types/react @types/node
```

- [ ] **Step 3: `tailwind.config.ts` — 커스텀 색상 팔레트 적용**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#f8f4ed',
        traditional: {
          DEFAULT: '#8b3a2a',
          dark: '#3d1f0d',
          light: '#c4712a',
          bg: '#f5ede0',
        },
        navy: {
          DEFAULT: '#1e293b',
          light: '#334155',
        },
        difficulty: {
          easy: '#22c55e',
          normal: '#f59e0b',
          advanced: '#ef4444',
        },
      },
      fontFamily: {
        serif: ['Noto Serif KR', 'serif'],
        sans: ['Noto Sans KR', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 4: `app/globals.css` — Tailwind 지시어 + 기본 스타일**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Noto+Serif+KR:wght@400;700&display=swap');

@layer base {
  body {
    @apply bg-cream text-traditional-dark font-sans;
  }
  h1, h2, h3 {
    @apply font-serif;
  }
}

@layer components {
  .era-transition {
    @apply transition-all duration-500 ease-in-out;
  }
}
```

- [ ] **Step 5: `next.config.mjs` — MDX 설정**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    domains: [],
    unoptimized: true,
  },
}

export default nextConfig
```

- [ ] **Step 6: `app/layout.tsx` — 공통 레이아웃**

```tsx
import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: '한국역사 — 5000년의 이야기',
  description: '고조선부터 현대까지, 모든 연령을 위한 한국역사 학습 웹사이트',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **Step 7: `components/layout/Header.tsx`**

```tsx
'use client'
import Link from 'next/link'
import { useState } from 'react'

const navLinks = [
  { href: '/timeline', label: '타임라인' },
  { href: '/map', label: '역사지도' },
  { href: '/figures', label: '인물도감' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className="bg-navy text-white sticky top-0 z-50 shadow-md">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl font-bold flex items-center gap-2">
          🏛 한국역사
        </Link>
        {/* 데스크톱 메뉴 */}
        <ul className="hidden md:flex gap-6 text-sm font-medium">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className="hover:text-traditional-light transition-colors">
                {label}
              </Link>
            </li>
          ))}
        </ul>
        {/* 모바일 햄버거 */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="메뉴 열기"
        >
          ☰
        </button>
      </nav>
      {menuOpen && (
        <ul className="md:hidden bg-navy-light px-4 pb-4 flex flex-col gap-3 text-sm">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} onClick={() => setMenuOpen(false)} className="block py-1">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
```

- [ ] **Step 8: `components/layout/Footer.tsx`**

```tsx
export default function Footer() {
  return (
    <footer className="bg-traditional-dark text-traditional-bg py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm opacity-80">
        <p className="font-serif text-lg mb-2">🏛 한국역사</p>
        <p>5,000년 한국의 이야기를 모든 세대와 함께</p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 9: 개발 서버 실행 확인**

```bash
pnpm dev
```

브라우저에서 `http://localhost:3000` 열기 — 헤더/푸터가 크림색 배경 위에 표시되면 정상.

- [ ] **Step 10: 커밋**

```bash
git add -A
git commit -m "feat: Next.js 14 프로젝트 초기화 및 공통 레이아웃 설정"
```

---

## Task 2: TypeScript 타입 정의 및 JSON 데이터 작성

**Files:**
- Create: `types/index.ts`
- Create: `content/data/eras.json`
- Create: `content/data/figures.json`
- Create: `content/data/events.json`
- Create: `lib/eras.ts`
- Create: `lib/figures.ts`
- Create: `lib/events.ts`

- [ ] **Step 1: `types/index.ts` — 공통 타입 정의**

```typescript
export type Difficulty = 'easy' | 'normal' | 'advanced'

export interface Era {
  slug: string
  name: string
  period: { start: number; end: number | null }
  order: number
  color: string
  thumbnail: string
  summary: string
  tags: string[]
  difficulties: Difficulty[]
}

export interface Figure {
  slug: string
  name: string
  era: string
  birth: number
  death: number | null
  role: string
  tags: string[]
  thumbnail: string
  difficulties: Difficulty[]
}

export interface HistoryEvent {
  id: string
  year: number
  title: string
  era: string
  figures: string[]
  category: '정치' | '문화' | '전쟁' | '과학' | '인물'
  importance: 'high' | 'medium' | 'low'
  summary: string
}
```

- [ ] **Step 2: `content/data/eras.json` — 12개 시대 메타데이터**

```json
[
  {
    "slug": "gojoseon",
    "name": "고조선",
    "period": { "start": -2333, "end": -108 },
    "order": 1,
    "color": "#6b4c2a",
    "thumbnail": "/images/eras/gojoseon.jpg",
    "summary": "단군왕검이 세운 우리 민족 최초의 나라",
    "tags": ["단군", "청동기", "8조법"],
    "difficulties": ["easy", "normal", "advanced"]
  },
  {
    "slug": "proto-three-kingdoms",
    "name": "원삼국시대",
    "period": { "start": -100, "end": 300 },
    "order": 2,
    "color": "#7a5c38",
    "thumbnail": "/images/eras/proto-three-kingdoms.jpg",
    "summary": "부족 연맹이 왕국으로 성장하던 전환기",
    "tags": ["부여", "옥저", "동예", "삼한"],
    "difficulties": ["easy", "normal", "advanced"]
  },
  {
    "slug": "three-kingdoms",
    "name": "삼국시대",
    "period": { "start": 300, "end": 668 },
    "order": 3,
    "color": "#8b6914",
    "thumbnail": "/images/eras/three-kingdoms.jpg",
    "summary": "고구려·백제·신라 세 나라가 한반도를 다투다",
    "tags": ["고구려", "백제", "신라", "가야"],
    "difficulties": ["easy", "normal", "advanced"]
  },
  {
    "slug": "unified-silla",
    "name": "통일신라",
    "period": { "start": 668, "end": 935 },
    "order": 4,
    "color": "#8b7a3a",
    "thumbnail": "/images/eras/unified-silla.jpg",
    "summary": "신라가 한반도를 통일하고 불교 문화를 꽃피우다",
    "tags": ["불국사", "석굴암", "화랑도"],
    "difficulties": ["easy", "normal", "advanced"]
  },
  {
    "slug": "balhae",
    "name": "발해",
    "period": { "start": 698, "end": 926 },
    "order": 5,
    "color": "#5a7a3a",
    "thumbnail": "/images/eras/balhae.jpg",
    "summary": "고구려 유민이 세운 해동성국, 북방의 강대국",
    "tags": ["대조영", "해동성국", "고구려 계승"],
    "difficulties": ["easy", "normal", "advanced"]
  },
  {
    "slug": "goryeo",
    "name": "고려",
    "period": { "start": 918, "end": 1392 },
    "order": 6,
    "color": "#3a6b8b",
    "thumbnail": "/images/eras/goryeo.jpg",
    "summary": "불교 국가 고려, 세계 최초 금속활자와 팔만대장경",
    "tags": ["불교", "팔만대장경", "금속활자", "고려청자"],
    "difficulties": ["easy", "normal", "advanced"]
  },
  {
    "slug": "joseon",
    "name": "조선",
    "period": { "start": 1392, "end": 1897 },
    "order": 7,
    "color": "#8b3a2a",
    "thumbnail": "/images/eras/joseon.jpg",
    "summary": "이성계가 세운 유교 국가, 500년의 역사와 한글 창제",
    "tags": ["유교", "한글", "과거제도", "임진왜란"],
    "difficulties": ["easy", "normal", "advanced"]
  },
  {
    "slug": "daehan",
    "name": "대한제국",
    "period": { "start": 1897, "end": 1910 },
    "order": 8,
    "color": "#8b5a2a",
    "thumbnail": "/images/eras/daehan.jpg",
    "summary": "자주 근대 국가를 향한 짧고 치열한 도전",
    "tags": ["고종", "광무개혁", "독립"],
    "difficulties": ["easy", "normal", "advanced"]
  },
  {
    "slug": "japanese-rule",
    "name": "일제강점기",
    "period": { "start": 1910, "end": 1945 },
    "order": 9,
    "color": "#5a4a6b",
    "thumbnail": "/images/eras/japanese-rule.jpg",
    "summary": "35년간의 일제 지배와 끊이지 않은 독립운동",
    "tags": ["3.1운동", "독립운동", "유관순", "안중근"],
    "difficulties": ["easy", "normal", "advanced"]
  },
  {
    "slug": "liberation",
    "name": "해방과 분단",
    "period": { "start": 1945, "end": 1950 },
    "order": 10,
    "color": "#4a6b5a",
    "thumbnail": "/images/eras/liberation.jpg",
    "summary": "광복의 기쁨과 남북 분단의 비극",
    "tags": ["광복", "38선", "미소군정", "단독정부"],
    "difficulties": ["easy", "normal", "advanced"]
  },
  {
    "slug": "korean-war",
    "name": "6·25 전쟁",
    "period": { "start": 1950, "end": 1953 },
    "order": 11,
    "color": "#6b3a3a",
    "thumbnail": "/images/eras/korean-war.jpg",
    "summary": "민족 최대의 비극, 3년간의 전쟁과 정전",
    "tags": ["6.25", "인천상륙작전", "정전협정"],
    "difficulties": ["easy", "normal", "advanced"]
  },
  {
    "slug": "modern",
    "name": "현대 대한민국",
    "period": { "start": 1953, "end": null },
    "order": 12,
    "color": "#2a5a8b",
    "thumbnail": "/images/eras/modern.jpg",
    "summary": "폐허에서 기적으로, 민주주의와 경제 성장의 대한민국",
    "tags": ["한강의 기적", "민주화", "K-컬처"],
    "difficulties": ["easy", "normal", "advanced"]
  }
]
```

- [ ] **Step 3: `content/data/figures.json` — 핵심 인물 10명**

```json
[
  {
    "slug": "dangun",
    "name": "단군왕검",
    "era": "gojoseon",
    "birth": -2333,
    "death": null,
    "role": "건국 시조",
    "tags": ["고조선", "건국"],
    "thumbnail": "/images/figures/dangun.jpg",
    "difficulties": ["easy", "normal", "advanced"]
  },
  {
    "slug": "gwanggaeto",
    "name": "광개토대왕",
    "era": "three-kingdoms",
    "birth": 374,
    "death": 412,
    "role": "왕",
    "tags": ["고구려", "정복", "영토"],
    "thumbnail": "/images/figures/gwanggaeto.jpg",
    "difficulties": ["easy", "normal", "advanced"]
  },
  {
    "slug": "wang-geon",
    "name": "왕건",
    "era": "goryeo",
    "birth": 877,
    "death": 943,
    "role": "왕",
    "tags": ["고려 건국", "후삼국"],
    "thumbnail": "/images/figures/wang-geon.jpg",
    "difficulties": ["easy", "normal", "advanced"]
  },
  {
    "slug": "sejong",
    "name": "세종대왕",
    "era": "joseon",
    "birth": 1397,
    "death": 1450,
    "role": "왕",
    "tags": ["한글", "과학", "음악", "훈민정음"],
    "thumbnail": "/images/figures/sejong.jpg",
    "difficulties": ["easy", "normal", "advanced"]
  },
  {
    "slug": "yisunshin",
    "name": "이순신",
    "era": "joseon",
    "birth": 1545,
    "death": 1598,
    "role": "장군",
    "tags": ["임진왜란", "거북선", "명량"],
    "thumbnail": "/images/figures/yisunshin.jpg",
    "difficulties": ["easy", "normal", "advanced"]
  },
  {
    "slug": "jang-yeong-sil",
    "name": "장영실",
    "era": "joseon",
    "birth": 1390,
    "death": 1450,
    "role": "과학자",
    "tags": ["앙부일구", "측우기", "자격루"],
    "thumbnail": "/images/figures/jang-yeong-sil.jpg",
    "difficulties": ["easy", "normal", "advanced"]
  },
  {
    "slug": "shin-saimdang",
    "name": "신사임당",
    "era": "joseon",
    "birth": 1504,
    "death": 1551,
    "role": "예술가·학자",
    "tags": ["예술", "서예", "여성"],
    "thumbnail": "/images/figures/shin-saimdang.jpg",
    "difficulties": ["easy", "normal", "advanced"]
  },
  {
    "slug": "ahn-junggeun",
    "name": "안중근",
    "era": "japanese-rule",
    "birth": 1879,
    "death": 1910,
    "role": "독립운동가",
    "tags": ["독립운동", "이토 히로부미", "하얼빈"],
    "thumbnail": "/images/figures/ahn-junggeun.jpg",
    "difficulties": ["easy", "normal", "advanced"]
  },
  {
    "slug": "yu-gwansun",
    "name": "유관순",
    "era": "japanese-rule",
    "birth": 1902,
    "death": 1920,
    "role": "독립운동가",
    "tags": ["3.1운동", "독립운동", "아우내장터"],
    "thumbnail": "/images/figures/yu-gwansun.jpg",
    "difficulties": ["easy", "normal", "advanced"]
  },
  {
    "slug": "kim-gu",
    "name": "김구",
    "era": "japanese-rule",
    "birth": 1876,
    "death": 1949,
    "role": "독립운동가·정치인",
    "tags": ["임시정부", "독립운동", "한인애국단"],
    "thumbnail": "/images/figures/kim-gu.jpg",
    "difficulties": ["easy", "normal", "advanced"]
  }
]
```

- [ ] **Step 4: `content/data/events.json` — 타임라인용 30개 주요 사건**

```json
[
  { "id": "gojoseon-founding", "year": -2333, "title": "고조선 건국", "era": "gojoseon", "figures": ["dangun"], "category": "정치", "importance": "high", "summary": "단군왕검이 아사달에 도읍을 정하고 고조선을 건국" },
  { "id": "goguryeo-founding", "year": -37, "title": "고구려 건국", "era": "proto-three-kingdoms", "figures": [], "category": "정치", "importance": "high", "summary": "주몽이 졸본에 고구려를 세움" },
  { "id": "baekje-founding", "year": -18, "title": "백제 건국", "era": "proto-three-kingdoms", "figures": [], "category": "정치", "importance": "high", "summary": "온조가 위례성에 백제를 세움" },
  { "id": "silla-founding", "year": -57, "title": "신라 건국", "era": "proto-three-kingdoms", "figures": [], "category": "정치", "importance": "high", "summary": "박혁거세가 서라벌에 신라를 세움" },
  { "id": "gwanggaeto-conquests", "year": 391, "title": "광개토대왕 즉위", "era": "three-kingdoms", "figures": ["gwanggaeto"], "category": "정치", "importance": "high", "summary": "광개토대왕이 즉위해 만주까지 영토를 넓힘" },
  { "id": "silla-unification", "year": 668, "title": "신라의 삼국 통일", "era": "unified-silla", "figures": [], "category": "정치", "importance": "high", "summary": "신라가 당의 도움으로 고구려를 멸망시키고 삼국을 통일" },
  { "id": "balhae-founding", "year": 698, "title": "발해 건국", "era": "balhae", "figures": [], "category": "정치", "importance": "high", "summary": "대조영이 고구려 유민을 이끌고 발해를 건국" },
  { "id": "goryeo-founding", "year": 918, "title": "고려 건국", "era": "goryeo", "figures": ["wang-geon"], "category": "정치", "importance": "high", "summary": "왕건이 고려를 세우고 후삼국 통일을 추진" },
  { "id": "goryeo-tripitaka", "year": 1011, "title": "팔만대장경 제작 시작", "era": "goryeo", "figures": [], "category": "문화", "importance": "high", "summary": "거란의 침입을 막기 위한 발원으로 팔만대장경 제작 시작" },
  { "id": "metal-type", "year": 1234, "title": "세계 최초 금속활자 사용", "era": "goryeo", "figures": [], "category": "과학", "importance": "high", "summary": "고려가 세계 최초로 금속활자로 책을 인쇄" },
  { "id": "joseon-founding", "year": 1392, "title": "조선 건국", "era": "joseon", "figures": [], "category": "정치", "importance": "high", "summary": "이성계가 고려를 무너뜨리고 조선을 건국" },
  { "id": "hangul-creation", "year": 1443, "title": "훈민정음 창제", "era": "joseon", "figures": ["sejong"], "category": "문화", "importance": "high", "summary": "세종대왕이 백성을 위해 한글(훈민정음)을 창제" },
  { "id": "angbuilgu", "year": 1434, "title": "앙부일구 제작", "era": "joseon", "figures": ["jang-yeong-sil", "sejong"], "category": "과학", "importance": "medium", "summary": "장영실이 세종의 명으로 해시계 앙부일구를 제작" },
  { "id": "imjin-war", "year": 1592, "title": "임진왜란 발발", "era": "joseon", "figures": ["yisunshin"], "category": "전쟁", "importance": "high", "summary": "일본 도요토미 히데요시가 조선을 침략, 이순신 장군이 해전에서 활약" },
  { "id": "myeongryang", "year": 1597, "title": "명량해전", "era": "joseon", "figures": ["yisunshin"], "category": "전쟁", "importance": "high", "summary": "이순신이 배 13척으로 왜선 133척을 물리친 역사적 해전" },
  { "id": "daehan-empire", "year": 1897, "title": "대한제국 선포", "era": "daehan", "figures": [], "category": "정치", "importance": "high", "summary": "고종이 황제를 칭하며 대한제국을 선포, 자주 근대화 추진" },
  { "id": "ahn-junggeun-action", "year": 1909, "title": "안중근 의사 의거", "era": "japanese-rule", "figures": ["ahn-junggeun"], "category": "인물", "importance": "high", "summary": "안중근이 하얼빈에서 이토 히로부미를 처단" },
  { "id": "annexation", "year": 1910, "title": "경술국치", "era": "japanese-rule", "figures": [], "category": "정치", "importance": "high", "summary": "일제에 의해 국권을 빼앗긴 치욕의 날" },
  { "id": "march-first", "year": 1919, "title": "3.1 운동", "era": "japanese-rule", "figures": ["yu-gwansun"], "category": "정치", "importance": "high", "summary": "전국에서 독립을 외친 비폭력 만세 운동, 유관순 열사 활약" },
  { "id": "provisional-government", "year": 1919, "title": "대한민국 임시정부 수립", "era": "japanese-rule", "figures": ["kim-gu"], "category": "정치", "importance": "high", "summary": "상하이에 대한민국 임시정부 수립, 독립운동의 구심점" },
  { "id": "liberation", "year": 1945, "title": "광복", "era": "liberation", "figures": [], "category": "정치", "importance": "high", "summary": "일본의 패망으로 35년 만에 국권을 되찾음" },
  { "id": "division", "year": 1945, "title": "남북 분단 (38선)", "era": "liberation", "figures": [], "category": "정치", "importance": "high", "summary": "미소 군정에 의해 38선을 경계로 남북이 분단" },
  { "id": "rok-founding", "year": 1948, "title": "대한민국 정부 수립", "era": "liberation", "figures": [], "category": "정치", "importance": "high", "summary": "이승만 초대 대통령 취임, 대한민국 정부 공식 수립" },
  { "id": "korean-war-start", "year": 1950, "title": "6·25 전쟁 발발", "era": "korean-war", "figures": [], "category": "전쟁", "importance": "high", "summary": "북한군의 기습 남침으로 한국전쟁 발발" },
  { "id": "incheon-landing", "year": 1950, "title": "인천상륙작전", "era": "korean-war", "figures": [], "category": "전쟁", "importance": "high", "summary": "맥아더 장군의 인천상륙작전으로 전세 역전" },
  { "id": "armistice", "year": 1953, "title": "정전협정 체결", "era": "korean-war", "figures": [], "category": "정치", "importance": "high", "summary": "3년간의 전쟁이 정전협정으로 멈추고 현재까지 이어지는 휴전 상태" },
  { "id": "april-revolution", "year": 1960, "title": "4.19 혁명", "era": "modern", "figures": [], "category": "정치", "importance": "high", "summary": "학생과 시민이 이승만 독재에 맞서 민주주의를 쟁취" },
  { "id": "economic-miracle", "year": 1970, "title": "한강의 기적 (경제개발)", "era": "modern", "figures": [], "category": "정치", "importance": "high", "summary": "박정희 정부의 경제개발 계획으로 급속한 산업화 달성" },
  { "id": "democracy-1987", "year": 1987, "title": "6월 민주항쟁", "era": "modern", "figures": [], "category": "정치", "importance": "high", "summary": "국민의 힘으로 대통령 직선제를 쟁취한 민주화 운동" },
  { "id": "seoul-olympics", "year": 1988, "title": "서울 올림픽", "era": "modern", "figures": [], "category": "문화", "importance": "medium", "summary": "대한민국을 세계에 알린 서울 올림픽 개최" }
]
```

- [ ] **Step 5: `lib/eras.ts` — 시대 데이터 로더**

```typescript
import erasData from '@/content/data/eras.json'
import type { Era } from '@/types'

export function getAllEras(): Era[] {
  return erasData as Era[]
}

export function getEraBySlug(slug: string): Era | undefined {
  return getAllEras().find((era) => era.slug === slug)
}

export function getAdjacentEras(slug: string): { prev: Era | null; next: Era | null } {
  const all = getAllEras().sort((a, b) => a.order - b.order)
  const idx = all.findIndex((e) => e.slug === slug)
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  }
}
```

- [ ] **Step 6: `lib/figures.ts` — 인물 데이터 로더**

```typescript
import figuresData from '@/content/data/figures.json'
import type { Figure } from '@/types'

export function getAllFigures(): Figure[] {
  return figuresData as Figure[]
}

export function getFigureBySlug(slug: string): Figure | undefined {
  return getAllFigures().find((f) => f.slug === slug)
}

export function getFiguresByEra(eraSlug: string): Figure[] {
  return getAllFigures().filter((f) => f.era === eraSlug)
}
```

- [ ] **Step 7: `lib/events.ts` — 사건 데이터 로더**

```typescript
import eventsData from '@/content/data/events.json'
import type { HistoryEvent } from '@/types'

export function getAllEvents(): HistoryEvent[] {
  return (eventsData as HistoryEvent[]).sort((a, b) => a.year - b.year)
}

export function getEventsByEra(eraSlug: string): HistoryEvent[] {
  return getAllEvents().filter((e) => e.era === eraSlug)
}

export function getEventsByCategory(category: HistoryEvent['category']): HistoryEvent[] {
  return getAllEvents().filter((e) => e.category === category)
}
```

- [ ] **Step 8: 커밋**

```bash
git add -A
git commit -m "feat: TypeScript 타입 정의 및 JSON 데이터 파일 작성"
```

---

## Task 3: 공통 UI 컴포넌트

**Files:**
- Create: `components/ui/DifficultyBadge.tsx`
- Create: `components/ui/LevelSelector.tsx`
- Create: `components/ui/EraCard.tsx`
- Create: `components/ui/FigureCard.tsx`

- [ ] **Step 1: `components/ui/DifficultyBadge.tsx`**

```tsx
import type { Difficulty } from '@/types'

const config: Record<Difficulty, { label: string; className: string; stars: string }> = {
  easy:     { label: '쉬움',  className: 'bg-difficulty-easy text-white',     stars: '⭐' },
  normal:   { label: '보통',  className: 'bg-difficulty-normal text-white',   stars: '⭐⭐' },
  advanced: { label: '심화',  className: 'bg-difficulty-advanced text-white', stars: '⭐⭐⭐' },
}

export default function DifficultyBadge({ level }: { level: Difficulty }) {
  const { label, className, stars } = config[level]
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {stars} {label}
    </span>
  )
}
```

- [ ] **Step 2: `components/ui/LevelSelector.tsx`**

```tsx
'use client'
import { useState } from 'react'
import type { Difficulty } from '@/types'

const levels: { value: Difficulty; label: string; stars: string }[] = [
  { value: 'easy',     label: '쉬움', stars: '⭐' },
  { value: 'normal',   label: '보통', stars: '⭐⭐' },
  { value: 'advanced', label: '심화', stars: '⭐⭐⭐' },
]

interface Props {
  selected: Difficulty
  onChange: (level: Difficulty) => void
}

export default function LevelSelector({ selected, onChange }: Props) {
  return (
    <div className="flex gap-2 p-1 bg-traditional-bg rounded-xl inline-flex">
      {levels.map(({ value, label, stars }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selected === value
              ? 'bg-traditional text-white shadow-sm'
              : 'text-traditional-dark hover:bg-white/60'
          }`}
        >
          {stars} {label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: `components/ui/EraCard.tsx`**

```tsx
import Link from 'next/link'
import type { Era } from '@/types'

export default function EraCard({ era }: { era: Era }) {
  const endLabel = era.period.end ? String(era.period.end) : '현재'
  const startLabel = era.period.start < 0
    ? `기원전 ${Math.abs(era.period.start)}년`
    : `${era.period.start}년`

  return (
    <Link href={`/era/${era.slug}`} className="block group">
      <div
        className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-traditional-bg"
        style={{ borderTop: `4px solid ${era.color}` }}
      >
        <div className="p-5 bg-white">
          <h3 className="font-serif text-lg font-bold text-traditional-dark mb-1 group-hover:text-traditional transition-colors">
            {era.name}
          </h3>
          <p className="text-xs text-gray-500 mb-2">{startLabel} ~ {endLabel}</p>
          <p className="text-sm text-gray-700 leading-relaxed">{era.summary}</p>
          <div className="flex flex-wrap gap-1 mt-3">
            {era.tags.map((tag) => (
              <span key={tag} className="bg-traditional-bg text-traditional-dark text-xs px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 4: `components/ui/FigureCard.tsx`**

```tsx
import Link from 'next/link'
import Image from 'next/image'
import type { Figure } from '@/types'

const roleIcons: Record<string, string> = {
  '왕': '👑', '장군': '⚔️', '과학자': '🔬', '예술가·학자': '🎨',
  '독립운동가': '🏅', '독립운동가·정치인': '🏅', '건국 시조': '🏛',
}

export default function FigureCard({ figure }: { figure: Figure }) {
  const icon = roleIcons[figure.role] ?? '👤'
  const deathLabel = figure.death ? String(figure.death) : '미상'

  return (
    <Link href={`/figure/${figure.slug}`} className="block group">
      <div className="bg-white rounded-xl border border-traditional-bg shadow-sm hover:shadow-md transition-shadow p-5 text-center">
        <div
          className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl"
          style={{ background: `linear-gradient(135deg, #8b3a2a, #c4712a)` }}
        >
          {icon}
        </div>
        <h3 className="font-serif font-bold text-traditional-dark group-hover:text-traditional transition-colors">
          {figure.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1">{figure.birth} ~ {deathLabel}</p>
        <p className="text-xs text-traditional mt-1 font-medium">{figure.role}</p>
        <div className="flex flex-wrap justify-center gap-1 mt-3">
          {figure.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="bg-traditional-bg text-traditional-dark text-xs px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 5: 빌드 확인**

```bash
pnpm build
```

에러 없이 빌드 완료되면 정상.

- [ ] **Step 6: 커밋**

```bash
git add -A
git commit -m "feat: 공통 UI 컴포넌트 (DifficultyBadge, LevelSelector, EraCard, FigureCard)"
```

---

## Task 4: MDX 인프라 및 콘텐츠 로더

**Files:**
- Create: `components/mdx/Level.tsx`
- Create: `components/mdx/mdx-components.tsx`
- Create: `lib/content.ts`
- Create: `content/eras/gojoseon.mdx` (샘플)
- Create: `content/eras/joseon.mdx` (샘플)
- Create: `content/figures/sejong.mdx` (샘플)

- [ ] **Step 1: `components/mdx/Level.tsx` — 난이도별 콘텐츠 래퍼**

```tsx
'use client'
import { useContext } from 'react'
import type { Difficulty } from '@/types'
import { DifficultyContext } from '@/lib/difficulty-context'

export default function Level({
  difficulty,
  children,
}: {
  difficulty: Difficulty
  children: React.ReactNode
}) {
  const selected = useContext(DifficultyContext)
  if (selected !== difficulty) return null
  return <div className="level-content">{children}</div>
}
```

- [ ] **Step 2: `lib/difficulty-context.ts` — 난이도 Context**

```typescript
'use client'
import { createContext } from 'react'
import type { Difficulty } from '@/types'

export const DifficultyContext = createContext<Difficulty>('easy')
```

- [ ] **Step 3: `components/mdx/mdx-components.tsx` — MDX 커스텀 컴포넌트 맵**

```tsx
import type { MDXComponents } from 'mdx/types'
import Level from './Level'
import DifficultyBadge from '@/components/ui/DifficultyBadge'

export function getMDXComponents(): MDXComponents {
  return {
    Level,
    DifficultyBadge,
    h1: (props) => <h1 className="font-serif text-3xl font-bold text-traditional-dark mt-8 mb-4" {...props} />,
    h2: (props) => <h2 className="font-serif text-2xl font-bold text-traditional mt-6 mb-3" {...props} />,
    h3: (props) => <h3 className="font-serif text-xl font-semibold text-traditional-dark mt-4 mb-2" {...props} />,
    p:  (props) => <p className="leading-relaxed text-gray-800 mb-4" {...props} />,
    ul: (props) => <ul className="list-disc list-inside mb-4 space-y-1 text-gray-800" {...props} />,
    li: (props) => <li className="leading-relaxed" {...props} />,
    strong: (props) => <strong className="font-bold text-traditional-dark" {...props} />,
    blockquote: (props) => (
      <blockquote className="border-l-4 border-traditional pl-4 italic text-gray-600 my-4" {...props} />
    ),
  }
}
```

- [ ] **Step 4: `lib/content.ts` — MDX 파일 로딩 유틸리티**

```typescript
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
  const mdxSource = await serialize(content, { scope: data })
  return { mdxSource, frontmatter: data }
}

export function getAvailableSlugs(type: 'eras' | 'figures'): string[] {
  const dir = path.join(CONTENT_ROOT, type)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace('.mdx', ''))
}
```

- [ ] **Step 5: `content/eras/gojoseon.mdx` — 고조선 샘플 콘텐츠**

```mdx
---
era: gojoseon
---

<Level difficulty="easy">

## 고조선은 어떤 나라였을까요?

아주 아주 오래전, 지금으로부터 4,000년도 더 전에 우리나라 최초의 나라가 세워졌어요. 그 이름은 바로 **고조선**이에요!

고조선을 세운 사람은 **단군왕검**이에요. 단군왕검은 하늘의 신 환인의 손자였다고 전해져요. 단군은 태백산 신단수 아래에서 나라를 세우고, 도읍을 **아사달**에 정했어요.

고조선 사람들은 다음과 같은 규칙을 지켰어요:
- 사람을 다치게 하면 안 돼요
- 다른 사람의 물건을 훔치면 안 돼요
- 다른 사람에게 상처를 입히면 안 돼요

이런 규칙을 **8조법**이라고 해요. 고조선이 얼마나 문명이 발달한 나라였는지 알 수 있어요!

</Level>

<Level difficulty="normal">

## 고조선의 건국과 발전

고조선은 기원전 2333년, 단군왕검에 의해 건국된 한국 역사상 최초의 국가입니다. 한반도 북부와 만주 일대를 영역으로 하는 청동기 문화권의 나라였습니다.

**건국 설화:** 환웅이 웅녀와 결혼해 낳은 단군왕검이 아사달에 도읍을 정하고 '조선'을 건국했다는 단군 신화가 전해집니다. 이 신화는 단순한 전설이 아니라 당시 사회 구조(하늘 숭배, 농경, 부족 연합)를 반영합니다.

**8조법(팔조금법):** 고조선의 법률로, 살인·상해·절도에 대한 처벌을 규정했습니다. 이는 고조선이 이미 사유재산 제도와 계급 사회를 갖추었음을 보여줍니다.

**멸망:** 기원전 108년, 한나라 무제의 침략으로 고조선은 멸망하고 한사군이 설치되었습니다.

</Level>

<Level difficulty="advanced">

## 고조선의 역사적 재구성과 논쟁

고조선은 문헌 사료의 절대적 부족으로 인해 역사학계에서 지속적인 논쟁이 이루어지는 시기입니다.

**단군 기록의 사료 비판:** 고조선 건국 연대(기원전 2333년)는 고려 시대 일연의 『삼국유사』(1281년경)에 처음 등장합니다. 『삼국사기』에는 기록이 없으며, 중국 정사에는 '조선'이 기원전 7세기 무렵부터 등장합니다. 따라서 실제 건국 시기를 기원전 10~7세기경으로 보는 학설도 있습니다.

**강역 논쟁:** 고조선의 중심지를 평양(재래설)으로 볼 것인지 요동(요동설)으로 볼 것인지를 놓고 남북한 및 중국 학계의 견해가 엇갈립니다. 한국 민족주의 역사학은 광대한 영역을 주장하는 경향이 있으나, 고고학적 증거는 제한적입니다.

**위만조선의 성격:** 기원전 194년 위만이 준왕을 몰아내고 세운 위만조선은 중국계 이주민이 세운 것인지, 토착 세력이 중국 문물을 수용한 것인지에 대한 논쟁이 있습니다. 최근에는 위만을 연나라 출신의 이주 한인(韓人) 집단으로 보는 시각도 있습니다.

> "고조선사는 사료의 한계 때문에 완전한 역사 복원이 불가능하다. 현재로서는 기원전 4~3세기 이후의 역사만 비교적 확실하게 말할 수 있다." — 한국 고대사학계 통설

</Level>
```

- [ ] **Step 6: `content/eras/joseon.mdx` — 조선 샘플 콘텐츠**

```mdx
---
era: joseon
---

<Level difficulty="easy">

## 조선이라는 나라

1392년, 이성계 장군이 새 나라를 세웠어요. 그 이름은 **조선**이에요!

조선은 **유교**를 나라의 기본 규칙으로 삼았어요. 유교는 어른을 공경하고, 나라에 충성하며, 공부를 열심히 하는 것을 중요하게 여겨요.

조선에서 가장 훌륭한 왕은 **세종대왕**이에요. 세종대왕은 백성들이 글을 읽지 못해 힘들어하는 것을 안타깝게 여겨 1443년에 **한글(훈민정음)**을 만들었어요. 덕분에 우리는 지금 한글로 글을 쓸 수 있답니다!

</Level>

<Level difficulty="normal">

## 조선 왕조의 건국과 통치

조선(1392~1897)은 이성계가 위화도 회군(1388)을 통해 고려의 실권을 장악한 후 건국한 유교 왕조입니다. 수도를 개경에서 한양(현재의 서울)으로 옮겼습니다.

**통치 체제:** 왕 아래 의정부와 6조로 구성된 관료제를 운영했습니다. 과거제를 통해 능력 있는 인재를 관리로 등용했으며, 유교 이념에 따라 문관을 무관보다 우대했습니다(문치주의).

**세종대왕의 업적:**
- 훈민정음(한글) 창제(1443)
- 측우기·앙부일구 등 과학 기구 제작
- 4군 6진 개척으로 북방 영토 확장

**임진왜란(1592~1598):** 도요토미 히데요시의 일본군 침략으로 나라 전체가 초토화되었으나, 이순신 장군의 해전 승리와 의병의 활약으로 결국 격퇴했습니다.

</Level>

<Level difficulty="advanced">

## 조선의 정치 구조와 역사적 평가

**사림 정치와 붕당:** 조선 중기 이후 훈구파와 사림파의 갈등, 이후 동인·서인의 분파로 전개되는 붕당 정치는 조선 정치의 핵심 동력이었습니다. 붕당은 단순한 파벌이 아니라 학맥과 정치 노선의 결합체였으며, 왕권을 견제하는 기능도 했습니다.

**위화도 회군의 역사적 의미:** 이성계의 위화도 회군(1388)은 단순한 군사적 사건이 아니라, 고려 말 신흥 사대부 세력의 성장과 결합한 체제 전환의 분기점이었습니다. 역성혁명의 정당성 확보를 위해 신진 사대부(정도전 등)는 유교적 왕도 정치 이념을 적극 활용했습니다.

**임진왜란의 국제적 맥락:** 임진왜란은 조선-명-일본 간의 국제 전쟁이었습니다. 명의 참전은 조선 구원뿐 아니라 자국 안보를 위한 것이었으며, 전쟁은 동아시아 국제 질서를 재편했습니다. 일본에서는 이 전쟁을 계기로 도쿠가와 막부가 성립했고, 명은 쇠퇴의 길로 접어들었습니다.

**조선 후기 실학:** 18~19세기 실학자들(이익, 정약용, 박지원 등)은 성리학의 공리공론을 비판하고 실용적 개혁을 주장했습니다. 이는 서양 학문(서학, 천주교)의 유입과 맞물려 조선 사회의 변화를 촉구하는 지적 흐름이었습니다.

</Level>
```

- [ ] **Step 7: `content/figures/sejong.mdx` — 세종대왕 샘플 콘텐츠**

```mdx
---
figure: sejong
---

<Level difficulty="easy">

## 세종대왕은 어떤 분이었을까요?

세종대왕은 조선의 네 번째 왕이에요. 1397년에 태어나 1450년에 돌아가셨어요.

세종대왕이 한 일 중 가장 유명한 것은 **한글을 만든 것**이에요! 그 전까지 조선 사람들은 중국 글자(한자)를 썼는데, 한자는 배우기가 너무 어려웠어요. 세종대왕은 "백성들이 쉽게 글을 읽고 쓸 수 있으면 좋겠다!"고 생각해서 1443년에 **훈민정음**을 만들었어요. 훈민정음이 바로 지금 우리가 쓰는 한글이에요!

세종대왕은 또 장영실 같은 훌륭한 과학자를 도와 해시계, 물시계, 비의 양을 재는 기구도 만들었어요.

</Level>

<Level difficulty="normal">

## 세종대왕의 생애와 업적

세종(1397~1450)은 조선의 제4대 왕으로, 태종의 셋째 아들입니다. 형 양녕대군이 세자에서 폐위된 후 왕위에 올랐습니다.

**훈민정음 창제(1443):** 당시 지식인 계층은 한자를 사용했으나 일반 백성은 문자 생활이 불가능했습니다. 세종은 집현전 학자들과 함께 한국어의 음운 체계를 정밀하게 분석해 28자로 이루어진 훈민정음을 창제했습니다. 세계 유수의 언어학자들이 한글을 가장 과학적인 문자 중 하나로 평가합니다.

**과학 기술 진흥:** 장영실을 신분의 한계에도 불구하고 관직에 등용해 앙부일구(해시계), 자격루(물시계), 측우기를 발명하게 했습니다.

**영토 확장:** 최윤덕·김종서를 시켜 4군 6진을 개척해 압록강·두만강을 국경으로 확정했습니다.

</Level>

<Level difficulty="advanced">

## 세종의 통치 철학과 역사적 재평가

**집현전의 역할:** 세종은 집현전을 단순한 연구 기관이 아니라 국정 자문과 문화 창달의 핵심 기관으로 운영했습니다. 훈민정음 창제 과정에서도 집현전 학자들의 역할이 있었으나, 세종 스스로 주도적으로 연구했다는 점이 강조됩니다.

**훈민정음의 저항:** 최만리 등 집현전 학자들은 훈민정음 창제에 반대 상소를 올렸습니다. 그 이유는 중국 문화권에서 이탈할 수 있다는 사대주의적 우려와 기득권 상실에 대한 불안이었습니다. 세종은 이를 단호하게 물리쳤습니다.

**신분제의 한계와 극복:** 장영실은 관노 출신임에도 세종의 파격적인 발탁으로 종3품까지 올랐습니다. 이는 유교 신분 사회에서 매우 이례적인 일이었으며, 세종의 실용적 인재관을 보여줍니다.

**세종에 대한 비판적 시각:** 세종 치세는 대체로 긍정적으로 평가받지만, 부(父) 태종이 왕자의 난으로 권력을 잡고 외척을 숙청하는 등 정치적 폭력을 통해 안정된 기반을 물려준 덕분이라는 시각도 있습니다. 또한 세종 말년의 불교 귀의와 건강 악화가 이후 문종·단종·세조 시대의 정치 혼란과 무관하지 않다는 분석도 있습니다.

</Level>
```

- [ ] **Step 8: 빌드 확인**

```bash
pnpm build
```

- [ ] **Step 9: 커밋**

```bash
git add -A
git commit -m "feat: MDX 인프라, Level 컴포넌트, 샘플 MDX 콘텐츠 작성"
```

---

## Task 5: 홈 페이지 (타임라인 히어로)

**Files:**
- Create: `components/home/EraHero.tsx`
- Create: `components/home/QuickLinks.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: `components/home/EraHero.tsx` — 시대 슬라이더 히어로**

```tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Era } from '@/types'

export default function EraHero({ eras }: { eras: Era[] }) {
  const sorted = [...eras].sort((a, b) => a.order - b.order)
  const [current, setCurrent] = useState(0)
  const era = sorted[current]

  function displayYear(y: number) {
    return y < 0 ? `기원전 ${Math.abs(y)}년` : `${y}년`
  }

  return (
    <section
      className="relative min-h-[480px] flex flex-col items-center justify-center text-white text-center px-4 py-16 era-transition"
      style={{ background: `linear-gradient(135deg, #3d1f0d, ${era.color})` }}
    >
      {/* 제목 */}
      <p className="text-sm uppercase tracking-widest opacity-70 mb-2">5,000년 한국의 역사</p>
      <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">{era.name}</h1>
      <p className="text-base opacity-85 mb-1">
        {displayYear(era.period.start)} ~ {era.period.end ? displayYear(era.period.end) : '현재'}
      </p>
      <p className="max-w-md text-sm opacity-80 mb-8">{era.summary}</p>

      {/* 태그 */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {era.tags.map((tag) => (
          <span key={tag} className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
            {tag}
          </span>
        ))}
      </div>

      {/* 시대 탐험하기 버튼 */}
      <Link
        href={`/era/${era.slug}`}
        className="bg-white text-traditional font-bold px-6 py-2.5 rounded-full hover:bg-traditional-bg transition-colors mb-10"
      >
        이 시대 탐험하기 →
      </Link>

      {/* 시대 슬라이더 */}
      <div className="flex gap-2 flex-wrap justify-center max-w-2xl">
        {sorted.map((e, idx) => (
          <button
            key={e.slug}
            onClick={() => setCurrent(idx)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              idx === current
                ? 'bg-white text-traditional-dark font-bold scale-105'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            {e.name}
          </button>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: `components/home/QuickLinks.tsx` — 바로가기 카드 3개**

```tsx
import Link from 'next/link'

const links = [
  {
    href: '/timeline',
    icon: '📅',
    title: '인터랙티브 타임라인',
    desc: '역사의 흐름을 한눈에 — 주요 사건을 시간순으로 탐험',
    color: 'from-navy to-blue-700',
  },
  {
    href: '/map',
    icon: '🗺️',
    title: '역사 지도',
    desc: '시대별 영토 변화와 주요 장소를 지도로 살펴보기',
    color: 'from-green-800 to-green-600',
  },
  {
    href: '/figures',
    icon: '👤',
    title: '인물 도감',
    desc: '한국 역사를 만든 위인들의 이야기',
    color: 'from-traditional-dark to-traditional',
  },
]

export default function QuickLinks() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="font-serif text-2xl font-bold text-traditional-dark text-center mb-8">
        역사를 탐험하는 방법
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {links.map(({ href, icon, title, desc, color }) => (
          <Link key={href} href={href} className="block group">
            <div className={`bg-gradient-to-br ${color} text-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow h-full`}>
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="font-serif text-xl font-bold mb-2">{title}</h3>
              <p className="text-sm opacity-85 leading-relaxed">{desc}</p>
              <div className="mt-4 text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                바로 가기 →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: `app/page.tsx` — 홈 페이지**

```tsx
import { getAllEras } from '@/lib/eras'
import EraHero from '@/components/home/EraHero'
import QuickLinks from '@/components/home/QuickLinks'
import EraCard from '@/components/ui/EraCard'

export default function HomePage() {
  const eras = getAllEras().sort((a, b) => a.order - b.order)

  return (
    <>
      <EraHero eras={eras} />
      <QuickLinks />

      {/* 전체 시대 목록 */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="font-serif text-2xl font-bold text-traditional-dark text-center mb-8">
          전체 시대 보기
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {eras.map((era) => (
            <EraCard key={era.slug} era={era} />
          ))}
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 4: 개발 서버에서 홈 페이지 확인**

```bash
pnpm dev
```

`http://localhost:3000` 에서 히어로 섹션의 시대 버튼을 클릭하면 배경 색상과 텍스트가 바뀌어야 함. 하단에 시대 카드 12개가 그리드로 표시되어야 함.

- [ ] **Step 5: 커밋**

```bash
git add -A
git commit -m "feat: 홈 페이지 — 타임라인 히어로 및 바로가기 카드"
```

---

## Task 6: 시대 상세 페이지

**Files:**
- Create: `app/era/[slug]/page.tsx`

- [ ] **Step 1: `app/era/[slug]/page.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { getEraBySlug, getAdjacentEras } from '@/lib/eras'
import { getFiguresByEra } from '@/lib/figures'
import { getMDXContent } from '@/lib/content'
import { getMDXComponents } from '@/components/mdx/mdx-components'
import { DifficultyContext } from '@/lib/difficulty-context'
import LevelSelector from '@/components/ui/LevelSelector'
import FigureCard from '@/components/ui/FigureCard'
import type { Difficulty } from '@/types'

export async function generateStaticParams() {
  const { getAllEras } = await import('@/lib/eras')
  return getAllEras().map((era) => ({ slug: era.slug }))
}

export default async function EraPage({ params }: { params: { slug: string } }) {
  const era = getEraBySlug(params.slug)
  if (!era) notFound()

  const { prev, next } = getAdjacentEras(params.slug)
  const figures = getFiguresByEra(params.slug)
  const content = await getMDXContent('eras', params.slug)

  const startLabel = era.period.start < 0
    ? `기원전 ${Math.abs(era.period.start)}년`
    : `${era.period.start}년`
  const endLabel = era.period.end ? `${era.period.end}년` : '현재'

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* 헤더 */}
      <div
        className="rounded-2xl p-8 text-white mb-8"
        style={{ background: `linear-gradient(135deg, #3d1f0d, ${era.color})` }}
      >
        <p className="text-xs uppercase tracking-widest opacity-70 mb-1">시대</p>
        <h1 className="font-serif text-3xl font-bold mb-2">{era.name}</h1>
        <p className="opacity-85 text-sm">{startLabel} ~ {endLabel}</p>
        <p className="mt-3 opacity-90 leading-relaxed">{era.summary}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {era.tags.map((tag) => (
            <span key={tag} className="bg-white/20 px-3 py-0.5 rounded-full text-xs">{tag}</span>
          ))}
        </div>
      </div>

      {/* 난이도 선택 + 콘텐츠 */}
      {content ? (
        <EraContent mdxSource={content.mdxSource} />
      ) : (
        <p className="text-gray-500 text-center py-8">이 시대의 콘텐츠를 준비 중입니다.</p>
      )}

      {/* 이 시대의 인물 */}
      {figures.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-xl font-bold text-traditional-dark mb-5">이 시대의 인물</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {figures.map((fig) => <FigureCard key={fig.slug} figure={fig} />)}
          </div>
        </section>
      )}

      {/* 이전/다음 시대 */}
      <div className="flex justify-between mt-12 gap-4">
        {prev ? (
          <Link href={`/era/${prev.slug}`} className="flex-1 bg-traditional-bg rounded-xl p-4 hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-500 mb-1">← 이전 시대</p>
            <p className="font-serif font-bold text-traditional-dark">{prev.name}</p>
          </Link>
        ) : <div className="flex-1" />}
        {next ? (
          <Link href={`/era/${next.slug}`} className="flex-1 bg-traditional-bg rounded-xl p-4 hover:shadow-md transition-shadow text-right">
            <p className="text-xs text-gray-500 mb-1">다음 시대 →</p>
            <p className="font-serif font-bold text-traditional-dark">{next.name}</p>
          </Link>
        ) : <div className="flex-1" />}
      </div>
    </div>
  )
}

function EraContent({ mdxSource }: { mdxSource: any }) {
  'use client'
  const [level, setLevel] = useState<Difficulty>('easy')
  return (
    <DifficultyContext.Provider value={level}>
      <div className="mb-6">
        <LevelSelector selected={level} onChange={setLevel} />
      </div>
      <article className="prose max-w-none">
        <MDXRemote source={mdxSource} components={getMDXComponents()} />
      </article>
    </DifficultyContext.Provider>
  )
}
```

> **참고:** Next.js App Router에서 Server Component 안에 Client Component를 중첩하려면 `EraContent`를 별도 파일 `components/era/EraContent.tsx`로 분리하고 `'use client'` 지시어를 파일 최상단에 붙여야 합니다. 위 코드는 구조 설명용이며, 실제 구현 시 파일을 분리하세요.

- [ ] **Step 2: `components/era/EraContent.tsx` 로 분리**

```tsx
'use client'
import { useState } from 'react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { DifficultyContext } from '@/lib/difficulty-context'
import LevelSelector from '@/components/ui/LevelSelector'
import { getMDXComponents } from '@/components/mdx/mdx-components'
import type { Difficulty } from '@/types'

export default function EraContent({ mdxSource }: { mdxSource: any }) {
  const [level, setLevel] = useState<Difficulty>('easy')
  return (
    <DifficultyContext.Provider value={level}>
      <div className="mb-6">
        <LevelSelector selected={level} onChange={setLevel} />
      </div>
      <article className="prose prose-stone max-w-none">
        <MDXRemote source={mdxSource} components={getMDXComponents()} />
      </article>
    </DifficultyContext.Provider>
  )
}
```

- [ ] **Step 3: `app/era/[slug]/page.tsx` 수정 — EraContent import 사용**

`EraContent`를 `@/components/era/EraContent`에서 import하도록 변경.

- [ ] **Step 4: 확인**

```bash
pnpm dev
```

`http://localhost:3000/era/gojoseon` 접속 → 난이도 탭 클릭 시 콘텐츠 전환 확인.
`http://localhost:3000/era/joseon` 접속 → 이전/다음 시대 링크 확인.

- [ ] **Step 5: 커밋**

```bash
git add -A
git commit -m "feat: 시대 상세 페이지 — 난이도 선택 + MDX 콘텐츠 렌더링"
```

---

## Task 7: 인물 도감 및 인물 상세 페이지

**Files:**
- Create: `components/figures/FigureGrid.tsx`
- Create: `components/figures/FigureFilter.tsx`
- Create: `app/figures/page.tsx`
- Create: `app/figure/[slug]/page.tsx`
- Create: `components/figure/FigureContent.tsx`

- [ ] **Step 1: `components/figures/FigureFilter.tsx`**

```tsx
'use client'
interface Props {
  eras: string[]
  roles: string[]
  selectedEra: string
  selectedRole: string
  search: string
  onEraChange: (v: string) => void
  onRoleChange: (v: string) => void
  onSearchChange: (v: string) => void
}

export default function FigureFilter({
  eras, roles, selectedEra, selectedRole, search,
  onEraChange, onRoleChange, onSearchChange,
}: Props) {
  return (
    <div className="space-y-4 mb-8">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="🔍 인물 이름 또는 태그 검색..."
        className="w-full border border-traditional-bg rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-traditional bg-white"
      />
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onEraChange('')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            selectedEra === '' ? 'bg-traditional text-white' : 'bg-traditional-bg text-traditional-dark hover:bg-traditional/20'
          }`}
        >
          전체 시대
        </button>
        {eras.map((era) => (
          <button
            key={era}
            onClick={() => onEraChange(era)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedEra === era ? 'bg-traditional text-white' : 'bg-traditional-bg text-traditional-dark hover:bg-traditional/20'
            }`}
          >
            {era}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onRoleChange('')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            selectedRole === '' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          전체 역할
        </button>
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => onRoleChange(role)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedRole === role ? 'bg-navy text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: `components/figures/FigureGrid.tsx`**

```tsx
'use client'
import { useState, useMemo } from 'react'
import FigureCard from '@/components/ui/FigureCard'
import FigureFilter from './FigureFilter'
import type { Figure, Era } from '@/types'

export default function FigureGrid({ figures, eras }: { figures: Figure[]; eras: Era[] }) {
  const [search, setSearch] = useState('')
  const [selectedEra, setSelectedEra] = useState('')
  const [selectedRole, setSelectedRole] = useState('')

  const eraNames = eras.map((e) => e.name)
  const roles = [...new Set(figures.map((f) => f.role))]

  const filtered = useMemo(() => {
    return figures.filter((f) => {
      const matchSearch =
        search === '' ||
        f.name.includes(search) ||
        f.tags.some((t) => t.includes(search))
      const era = eras.find((e) => e.slug === f.era)
      const matchEra = selectedEra === '' || era?.name === selectedEra
      const matchRole = selectedRole === '' || f.role === selectedRole
      return matchSearch && matchEra && matchRole
    })
  }, [figures, eras, search, selectedEra, selectedRole])

  return (
    <>
      <FigureFilter
        eras={eraNames}
        roles={roles}
        selectedEra={selectedEra}
        selectedRole={selectedRole}
        search={search}
        onEraChange={setSelectedEra}
        onRoleChange={setSelectedRole}
        onSearchChange={setSearch}
      />
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-12">검색 결과가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {filtered.map((fig) => <FigureCard key={fig.slug} figure={fig} />)}
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 3: `app/figures/page.tsx`**

```tsx
import { getAllFigures } from '@/lib/figures'
import { getAllEras } from '@/lib/eras'
import FigureGrid from '@/components/figures/FigureGrid'

export default function FiguresPage() {
  const figures = getAllFigures()
  const eras = getAllEras().sort((a, b) => a.order - b.order)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl font-bold text-traditional-dark mb-2">인물 도감</h1>
      <p className="text-gray-600 mb-8">한국 역사를 만든 위인들을 만나보세요</p>
      <FigureGrid figures={figures} eras={eras} />
    </div>
  )
}
```

- [ ] **Step 4: `components/figure/FigureContent.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { DifficultyContext } from '@/lib/difficulty-context'
import LevelSelector from '@/components/ui/LevelSelector'
import { getMDXComponents } from '@/components/mdx/mdx-components'
import type { Difficulty } from '@/types'

export default function FigureContent({ mdxSource }: { mdxSource: any }) {
  const [level, setLevel] = useState<Difficulty>('easy')
  return (
    <DifficultyContext.Provider value={level}>
      <div className="mb-6">
        <LevelSelector selected={level} onChange={setLevel} />
      </div>
      <article className="prose prose-stone max-w-none">
        <MDXRemote source={mdxSource} components={getMDXComponents()} />
      </article>
    </DifficultyContext.Provider>
  )
}
```

- [ ] **Step 5: `app/figure/[slug]/page.tsx`**

```tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getFigureBySlug, getAllFigures } from '@/lib/figures'
import { getEraBySlug } from '@/lib/eras'
import { getMDXContent } from '@/lib/content'
import FigureContent from '@/components/figure/FigureContent'

export async function generateStaticParams() {
  return getAllFigures().map((f) => ({ slug: f.slug }))
}

const roleIcons: Record<string, string> = {
  '왕': '👑', '장군': '⚔️', '과학자': '🔬', '예술가·학자': '🎨',
  '독립운동가': '🏅', '독립운동가·정치인': '🏅', '건국 시조': '🏛',
}

export default async function FigurePage({ params }: { params: { slug: string } }) {
  const figure = getFigureBySlug(params.slug)
  if (!figure) notFound()

  const era = getEraBySlug(figure.era)
  const content = await getMDXContent('figures', params.slug)
  const icon = roleIcons[figure.role] ?? '👤'
  const deathLabel = figure.death ? `${figure.death}년` : '미상'

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* 헤더 */}
      <div className="flex items-center gap-6 mb-8">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-4xl flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #8b3a2a, #c4712a)' }}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm text-traditional font-medium mb-1">{figure.role}</p>
          <h1 className="font-serif text-3xl font-bold text-traditional-dark">{figure.name}</h1>
          <p className="text-gray-500 text-sm mt-1">{figure.birth}년 ~ {deathLabel}</p>
          {era && (
            <Link href={`/era/${era.slug}`} className="text-xs bg-traditional-bg text-traditional-dark px-2 py-0.5 rounded-full mt-2 inline-block hover:bg-traditional/20 transition-colors">
              📜 {era.name}
            </Link>
          )}
        </div>
      </div>

      {/* 태그 */}
      <div className="flex flex-wrap gap-2 mb-8">
        {figure.tags.map((tag) => (
          <span key={tag} className="bg-traditional-bg text-traditional-dark px-3 py-1 rounded-full text-sm">
            {tag}
          </span>
        ))}
      </div>

      {/* 콘텐츠 */}
      {content ? (
        <FigureContent mdxSource={content.mdxSource} />
      ) : (
        <p className="text-gray-500 text-center py-8">이 인물의 콘텐츠를 준비 중입니다.</p>
      )}

      <div className="mt-10">
        <Link href="/figures" className="text-traditional hover:underline text-sm">← 인물 도감으로 돌아가기</Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: 확인**

```bash
pnpm dev
```

`http://localhost:3000/figures` — 인물 그리드, 검색, 필터 동작 확인.
`http://localhost:3000/figure/sejong` — 세종대왕 상세 페이지, 난이도 전환 확인.

- [ ] **Step 7: 커밋**

```bash
git add -A
git commit -m "feat: 인물 도감 목록 + 인물 상세 페이지"
```

---

## Task 8: 인터랙티브 타임라인 페이지

**Files:**
- Create: `components/timeline/TimelineFilter.tsx`
- Create: `components/timeline/TimelineCard.tsx`
- Create: `components/timeline/TimelineView.tsx`
- Create: `app/timeline/page.tsx`

- [ ] **Step 1: `components/timeline/TimelineFilter.tsx`**

```tsx
'use client'
import type { HistoryEvent } from '@/types'

type Category = HistoryEvent['category'] | '전체'

const categories: Category[] = ['전체', '정치', '문화', '전쟁', '과학', '인물']

interface Props {
  selected: Category
  onChange: (c: Category) => void
}

export default function TimelineFilter({ selected, onChange }: Props) {
  return (
    <div className="flex gap-2 flex-wrap justify-center mb-10">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === cat
              ? 'bg-navy text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: `components/timeline/TimelineCard.tsx`**

```tsx
'use client'
import { useRef, useEffect, useState } from 'react'
import type { HistoryEvent } from '@/types'

const categoryColors: Record<string, string> = {
  '정치': '#3b82f6', '문화': '#22c55e', '전쟁': '#ef4444',
  '과학': '#8b5cf6', '인물': '#f59e0b',
}

export default function TimelineCard({
  event,
  side,
}: {
  event: HistoryEvent
  side: 'left' | 'right'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const color = categoryColors[event.category] ?? '#64748b'
  const yearLabel = event.year < 0 ? `기원전 ${Math.abs(event.year)}년` : `${event.year}년`

  return (
    <div
      ref={ref}
      className={`flex items-center gap-4 transition-all duration-700 ${
        side === 'right' ? 'flex-row-reverse' : ''
      } ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {/* 카드 */}
      <div className={`flex-1 ${side === 'right' ? 'text-right' : ''}`}>
        <div
          className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow border-l-4"
          style={{ borderColor: color }}
        >
          <p className="text-xs font-bold mb-1" style={{ color }}>{yearLabel} · {event.category}</p>
          <h3 className="font-serif font-bold text-traditional-dark text-base mb-1">{event.title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{event.summary}</p>
        </div>
      </div>

      {/* 중앙 점 */}
      <div
        className="w-4 h-4 rounded-full flex-shrink-0 z-10 ring-4 ring-white shadow"
        style={{ background: color }}
      />

      {/* 반대쪽 여백 */}
      <div className="flex-1" />
    </div>
  )
}
```

- [ ] **Step 3: `components/timeline/TimelineView.tsx`**

```tsx
'use client'
import { useState, useMemo } from 'react'
import TimelineFilter from './TimelineFilter'
import TimelineCard from './TimelineCard'
import type { HistoryEvent } from '@/types'

type Category = HistoryEvent['category'] | '전체'

export default function TimelineView({ events }: { events: HistoryEvent[] }) {
  const [category, setCategory] = useState<Category>('전체')

  const filtered = useMemo(() => {
    if (category === '전체') return events
    return events.filter((e) => e.category === category)
  }, [events, category])

  return (
    <>
      <TimelineFilter selected={category} onChange={setCategory} />
      <div className="relative">
        {/* 중앙 세로선 */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2" />
        <div className="space-y-8 py-4">
          {filtered.map((event, idx) => (
            <TimelineCard
              key={event.id}
              event={event}
              side={idx % 2 === 0 ? 'left' : 'right'}
            />
          ))}
        </div>
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-16">해당 카테고리의 사건이 없습니다.</p>
      )}
    </>
  )
}
```

- [ ] **Step 4: `app/timeline/page.tsx`**

```tsx
import { getAllEvents } from '@/lib/events'
import TimelineView from '@/components/timeline/TimelineView'

export default function TimelinePage() {
  const events = getAllEvents()
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl font-bold text-traditional-dark text-center mb-2">
        인터랙티브 타임라인
      </h1>
      <p className="text-gray-600 text-center mb-10">한국 역사의 주요 사건을 시간 순으로 탐험하세요</p>
      <TimelineView events={events} />
    </div>
  )
}
```

- [ ] **Step 5: 확인**

```bash
pnpm dev
```

`http://localhost:3000/timeline` — 사건 카드가 좌우 교차 배치로 표시, 스크롤 시 페이드인 애니메이션, 카테고리 필터 동작 확인.

- [ ] **Step 6: 커밋**

```bash
git add -A
git commit -m "feat: 인터랙티브 타임라인 — CSS 애니메이션 + 카테고리 필터"
```

---

## Task 9: 역사 지도 페이지

**Files:**
- Create: `components/map/EraSelector.tsx`
- Create: `components/map/LocationMarker.tsx`
- Create: `components/map/HistoryMap.tsx`
- Create: `app/map/page.tsx`

- [ ] **Step 1: 지도 라이브러리 설치**

```bash
pnpm add react-simple-maps d3-geo
pnpm add -D @types/d3-geo
```

- [ ] **Step 2: `components/map/EraSelector.tsx`**

```tsx
'use client'
import type { Era } from '@/types'

interface Props {
  eras: Era[]
  selectedSlug: string
  onChange: (slug: string) => void
}

export default function EraSelector({ eras, selectedSlug, onChange }: Props) {
  const sorted = [...eras].sort((a, b) => a.order - b.order)
  return (
    <div className="flex gap-2 flex-wrap justify-center mb-8">
      {sorted.map((era) => (
        <button
          key={era.slug}
          onClick={() => onChange(era.slug)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            selectedSlug === era.slug
              ? 'text-white shadow-md scale-105'
              : 'bg-traditional-bg text-traditional-dark hover:bg-traditional/10'
          }`}
          style={selectedSlug === era.slug ? { background: era.color } : {}}
        >
          {era.name}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: `components/map/LocationMarker.tsx`**

```tsx
'use client'
import { useState } from 'react'

interface MarkerData {
  id: string
  name: string
  coordinates: [number, number]
  description: string
  type: 'capital' | 'battle' | 'site'
}

const typeConfig = {
  capital: { icon: '🏛', color: '#8b3a2a' },
  battle:  { icon: '⚔️', color: '#ef4444' },
  site:    { icon: '📍', color: '#3b82f6' },
}

export default function LocationMarker({
  marker,
  x,
  y,
}: {
  marker: MarkerData
  x: number
  y: number
}) {
  const [open, setOpen] = useState(false)
  const { icon, color } = typeConfig[marker.type]

  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle
        r={8}
        fill={color}
        stroke="white"
        strokeWidth={2}
        className="cursor-pointer"
        onClick={() => setOpen(!open)}
      />
      <text textAnchor="middle" dy={-12} fontSize={10} style={{ pointerEvents: 'none' }}>
        {icon}
      </text>
      {open && (
        <foreignObject x={10} y={-40} width={160} height={80}>
          <div className="bg-white rounded-lg p-2 shadow-lg text-xs border border-gray-200">
            <p className="font-bold text-traditional-dark">{marker.name}</p>
            <p className="text-gray-600 mt-0.5">{marker.description}</p>
          </div>
        </foreignObject>
      )}
    </g>
  )
}
```

- [ ] **Step 4: `components/map/HistoryMap.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import EraSelector from './EraSelector'
import LocationMarker from './LocationMarker'
import type { Era } from '@/types'

// 시대별 주요 지점 (위도/경도)
const eraMarkers: Record<string, Array<{ id: string; name: string; coordinates: [number, number]; description: string; type: 'capital' | 'battle' | 'site' }>> = {
  gojoseon: [
    { id: 'asadal', name: '아사달', coordinates: [125.7, 38.9], description: '고조선의 수도', type: 'capital' },
  ],
  three-kingdoms: [
    { id: 'pyongyang', name: '평양', coordinates: [125.7, 39.0], description: '고구려 후기 수도', type: 'capital' },
    { id: 'hanseong', name: '한성', coordinates: [127.0, 37.6], description: '백제 초기 수도', type: 'capital' },
    { id: 'gyeongju', name: '경주', coordinates: [129.2, 35.8], description: '신라의 수도', type: 'capital' },
  ],
  joseon: [
    { id: 'hanyang', name: '한양', coordinates: [126.98, 37.57], description: '조선의 수도 (지금의 서울)', type: 'capital' },
    { id: 'myeongryang', name: '명량', coordinates: [126.3, 34.6], description: '1597년 명량해전 격전지', type: 'battle' },
  ],
  modern: [
    { id: 'seoul', name: '서울', coordinates: [126.98, 37.57], description: '대한민국 수도', type: 'capital' },
    { id: 'incheon', name: '인천', coordinates: [126.7, 37.45], description: '1950년 인천상륙작전', type: 'battle' },
  ],
}

const GEO_URL = 'https://raw.githubusercontent.com/southkorea/southkorea-maps/master/kostat/2012/json/skorea-provinces-2012-simple.json'

export default function HistoryMap({ eras }: { eras: Era[] }) {
  const [selectedEra, setSelectedEra] = useState('joseon')
  const markers = eraMarkers[selectedEra] ?? []
  const currentEra = eras.find((e) => e.slug === selectedEra)

  return (
    <div>
      <EraSelector eras={eras} selectedSlug={selectedEra} onChange={setSelectedEra} />
      {currentEra && (
        <p className="text-center text-sm text-gray-600 mb-6">
          <span className="font-bold" style={{ color: currentEra.color }}>{currentEra.name}</span>
          {' '}— {currentEra.summary}
        </p>
      )}
      <div className="bg-blue-50 rounded-2xl overflow-hidden shadow-inner">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 2500, center: [127.5, 36.5] }}
          width={600}
          height={700}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={currentEra?.color ?? '#d1c4a8'}
                  stroke="#fff"
                  strokeWidth={0.5}
                  style={{ default: { outline: 'none' }, hover: { outline: 'none', opacity: 0.8 }, pressed: { outline: 'none' } }}
                />
              ))
            }
          </Geographies>
          {markers.map((marker) => (
            <Marker key={marker.id} coordinates={marker.coordinates}>
              {({ x, y }) => <LocationMarker marker={marker} x={x} y={y} />}
            </Marker>
          ))}
        </ComposableMap>
      </div>
      <p className="text-xs text-center text-gray-400 mt-3">마커를 클릭하면 설명이 나타납니다</p>
    </div>
  )
}
```

> **참고:** 위 GEO_URL은 남한 지도 데이터를 사용합니다. 고구려·고조선 등 북방 시대는 전체 한반도 + 만주를 포함한 다른 GeoJSON이 필요합니다. 초기 MVP에서는 남한 지도를 사용하고, 이후 확장 시 전체 지도 데이터로 교체하세요.

- [ ] **Step 5: `app/map/page.tsx`**

```tsx
import { getAllEras } from '@/lib/eras'
import HistoryMap from '@/components/map/HistoryMap'

export default function MapPage() {
  const eras = getAllEras()
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl font-bold text-traditional-dark text-center mb-2">역사 지도</h1>
      <p className="text-gray-600 text-center mb-8">시대를 선택해 영토와 주요 장소를 확인하세요</p>
      <HistoryMap eras={eras} />
    </div>
  )
}
```

- [ ] **Step 6: 확인**

```bash
pnpm dev
```

`http://localhost:3000/map` — 시대 버튼 클릭 시 지도 색상 변경, 마커 클릭 시 팝업 표시 확인.

- [ ] **Step 7: 커밋**

```bash
git add -A
git commit -m "feat: 역사 지도 — react-simple-maps + 시대별 마커"
```

---

## Task 10: 나머지 MDX 콘텐츠 작성

**Files:**
- Create: `content/eras/proto-three-kingdoms.mdx`
- Create: `content/eras/three-kingdoms.mdx`
- Create: `content/eras/unified-silla.mdx`
- Create: `content/eras/balhae.mdx`
- Create: `content/eras/goryeo.mdx`
- Create: `content/eras/daehan.mdx`
- Create: `content/eras/japanese-rule.mdx`
- Create: `content/eras/liberation.mdx`
- Create: `content/eras/korean-war.mdx`
- Create: `content/eras/modern.mdx`
- Create: `content/figures/yisunshin.mdx`
- Create: `content/figures/gwanggaeto.mdx`
- Create: `content/figures/yu-gwansun.mdx`
- Create: `content/figures/ahn-junggeun.mdx`

각 MDX 파일은 아래 구조를 따릅니다. 나머지 시대·인물을 동일한 패턴으로 작성합니다.

- [ ] **Step 1: 시대 MDX 템플릿 (각 파일에 적용)**

```mdx
---
era: [slug]
---

<Level difficulty="easy">
## [시대명]은 어떤 시대였을까요?
[어린이 친화적 언어로 핵심 사건 2-3개 설명. 200자 이내.]
</Level>

<Level difficulty="normal">
## [시대명]의 역사
[사건의 배경·원인·결과 포함. 관련 인물·사건 연결. 500자 내외.]
</Level>

<Level difficulty="advanced">
## [시대명]의 역사적 맥락과 평가
[사료 기반 분석, 학술적 논쟁, 인접 국가와의 관계 포함. 800자 이상.]
</Level>
```

- [ ] **Step 2: 인물 MDX 템플릿 (각 파일에 적용)**

```mdx
---
figure: [slug]
---

<Level difficulty="easy">
## [이름]은 어떤 분이었을까요?
[어린이 친화적 언어로 대표 업적 2개 설명. 150자 이내.]
</Level>

<Level difficulty="normal">
## [이름]의 생애와 업적
[생몰년, 주요 업적의 배경·결과, 역사적 의의. 400자 내외.]
</Level>

<Level difficulty="advanced">
## [이름]의 역사적 평가와 재해석
[사료 비판, 당대 맥락, 후대 평가의 변화. 600자 이상.]
</Level>
```

- [ ] **Step 3: 콘텐츠 작성 후 모든 시대 페이지 확인**

```bash
pnpm dev
```

모든 `/era/[slug]` 경로에서 "콘텐츠를 준비 중입니다" 메시지 대신 실제 내용이 표시되는지 확인.

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "content: 전 시대 및 주요 인물 MDX 콘텐츠 완성"
```

---

## Task 11: 반응형 및 접근성, 배포

**Files:**
- Modify: `app/globals.css` — 큰 글씨 모드
- Modify: `next.config.mjs` — 메타데이터 최적화
- Create: `vercel.json`

- [ ] **Step 1: 반응형 점검 — 모바일 뷰 확인**

브라우저 개발자 도구에서 모바일(375px) 뷰로 전환 후 아래 페이지 확인:
- 홈 히어로: 시대 버튼이 wrap되어 표시 → OK
- 인물 도감: 2열 그리드 → OK
- 타임라인: 중앙선 + 카드가 겹치지 않음 → OK  
- 지도: 스크롤 가능 → OK

- [ ] **Step 2: 큰 글씨 지원 — `app/globals.css` 추가**

```css
@media (prefers-reduced-motion: reduce) {
  .era-transition,
  [class*="transition"] {
    transition: none !important;
  }
}
```

- [ ] **Step 3: 각 페이지에 metadata 추가**

`app/era/[slug]/page.tsx` 상단에 추가:
```typescript
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const era = getEraBySlug(params.slug)
  if (!era) return {}
  return {
    title: `${era.name} — 한국역사`,
    description: era.summary,
  }
}
```

`app/figures/page.tsx`에 추가:
```typescript
export const metadata = {
  title: '인물 도감 — 한국역사',
  description: '한국 역사를 만든 위인들을 만나보세요',
}
```

- [ ] **Step 4: `vercel.json` — 배포 설정**

```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install"
}
```

- [ ] **Step 5: `.gitignore` 확인 — `.superpowers/` 추가**

```bash
echo ".superpowers/" >> .gitignore
```

- [ ] **Step 6: 최종 빌드 확인**

```bash
pnpm build
```

에러 없이 빌드 완료, Static exports 숫자 확인.

- [ ] **Step 7: Vercel 배포**

```bash
# Vercel CLI 설치 (최초 1회)
pnpm add -g vercel
vercel
```

프롬프트: 프로젝트 이름 설정, 자동 감지된 Next.js 설정 확인.

- [ ] **Step 8: 최종 커밋**

```bash
git add -A
git commit -m "feat: 반응형 최적화, SEO 메타데이터, Vercel 배포 설정"
```

---

## 자체 검토 — 스펙 대조

| 스펙 요구사항 | 구현 태스크 |
|-------------|-----------|
| 복합형 (백과사전 + 인터랙티브 + 스토리텔링) | Task 4 (MDX), Task 8 (타임라인) |
| 단일 사이트 + 쉬움/보통/심화 배지 | Task 3 (DifficultyBadge, LevelSelector), Task 4 (Level 컴포넌트) |
| Next.js 14 App Router + TypeScript | Task 1 |
| Tailwind CSS 하이브리드 디자인 | Task 1 (tailwind.config.ts) |
| 고조선 ~ 현대 12개 시대 | Task 2 (eras.json), Task 10 (MDX) |
| 인터랙티브 타임라인 | Task 8 |
| 역사 지도 | Task 9 |
| 인물 도감 | Task 7 |
| 정적 JSON/MDX 콘텐츠 | Task 2, Task 4, Task 10 |
| 타임라인 히어로 홈 | Task 5 |
| 반응형 + 접근성 | Task 11 |
| Vercel 배포 | Task 11 |
