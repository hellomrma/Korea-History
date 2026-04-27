# 한국역사 — 5,000년의 이야기

고조선부터 현대 대한민국까지, 어린이부터 어른까지 모두 함께 배우는 한국역사 학습 웹사이트입니다.

---

## 주요 기능

- **타임라인 히어로** — 홈 화면에서 시대를 직접 선택해 대표 이미지·요약·태그를 한눈에 확인
- **시대 상세 페이지** — 12개 역사 시대별 난이도 선택형 콘텐츠 (쉬움·보통·심화)
- **인물 도감** — 이름·태그 검색, 시대·역할 필터, 인물 상세 페이지
- **인터랙티브 타임라인** — 30개 주요 사건을 좌우 교차 레이아웃으로, 스크롤 시 페이드인 애니메이션
- **역사 지도** — 시대별 영토를 SVG 지도로 시각화, 마커 클릭 시 장소 설명 팝업

## 난이도 시스템

모든 콘텐츠는 세 가지 난이도로 제공됩니다. 페이지 상단의 탭으로 전환할 수 있습니다.

| 레벨 | 대상 | 특징 |
|------|------|------|
| ⭐ 쉬움 | 초등학생 이하 | 짧은 문장, 쉬운 단어, 스토리 형식 |
| ⭐⭐ 보통 | 중고등학생 | 원인·결과, 시대적 맥락 포함 |
| ⭐⭐⭐ 심화 | 성인·역사 애호가 | 사료 인용, 학술적 해석, 논쟁점 포함 |

## 수록 시대 (12개)

| 순서 | 시대 | 기간 |
|------|------|------|
| 1 | 고조선 | 기원전 2333 ~ 기원전 108 |
| 2 | 원삼국시대 | 기원전 1세기 ~ 3세기 |
| 3 | 삼국시대 | 4세기 ~ 668 |
| 4 | 통일신라 | 668 ~ 935 |
| 5 | 발해 | 698 ~ 926 |
| 6 | 고려 | 918 ~ 1392 |
| 7 | 조선 | 1392 ~ 1897 |
| 8 | 대한제국 | 1897 ~ 1910 |
| 9 | 일제강점기 | 1910 ~ 1945 |
| 10 | 해방과 분단 | 1945 ~ 1950 |
| 11 | 6·25 전쟁 | 1950 ~ 1953 |
| 12 | 현대 대한민국 | 1953 ~ 현재 |

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) + TypeScript |
| 스타일링 | Tailwind CSS v4 |
| 콘텐츠 | MDX (next-mdx-remote v6) |
| 역사 지도 | react-simple-maps v3 |
| 폰트 | Noto Serif KR / Noto Sans KR (next/font/google) |
| 패키지 관리 | pnpm |
| 배포 | Vercel |

## 로컬 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 으로 접속합니다.

```bash
# 프로덕션 빌드
pnpm build

# 프로덕션 서버 시작
pnpm start
```

## 프로젝트 구조

```
├── app/                        # Next.js App Router 페이지
│   ├── page.tsx                # 홈 (타임라인 히어로)
│   ├── era/[slug]/page.tsx     # 시대 상세
│   ├── figure/[slug]/page.tsx  # 인물 상세
│   ├── figures/page.tsx        # 인물 도감
│   ├── timeline/page.tsx       # 인터랙티브 타임라인
│   └── map/page.tsx            # 역사 지도
│
├── components/                 # React 컴포넌트
│   ├── layout/                 # Header, Footer
│   ├── ui/                     # 공통 UI (EraCard, FigureCard, LevelSelector 등)
│   ├── mdx/                    # MDX 렌더링 (Level, 커스텀 컴포넌트)
│   ├── home/                   # 홈 전용 (EraHero, QuickLinks)
│   ├── era/                    # 시대 상세 전용
│   ├── figure/                 # 인물 상세 전용
│   ├── figures/                # 인물 도감 전용 (FigureGrid, FigureFilter)
│   ├── timeline/               # 타임라인 전용
│   └── map/                    # 지도 전용
│
├── content/                    # 정적 콘텐츠
│   ├── data/
│   │   ├── eras.json           # 12개 시대 메타데이터
│   │   ├── figures.json        # 10명 인물 메타데이터
│   │   └── events.json         # 30개 주요 사건
│   ├── eras/                   # 시대별 MDX (난이도별 섹션 포함)
│   └── figures/                # 인물별 MDX (난이도별 섹션 포함)
│
├── lib/                        # 데이터 로더 및 유틸리티
│   ├── eras.ts
│   ├── figures.ts
│   ├── events.ts
│   ├── content.ts              # MDX 파일 로딩
│   ├── difficulty-context.tsx  # 난이도 Context (DifficultyProvider)
│   └── roleIcons.ts
│
└── types/                      # TypeScript 타입 정의
    └── index.ts
```

## 콘텐츠 추가 방법

### 새 시대 콘텐츠 작성

`content/eras/[slug].mdx` 파일을 생성하고 아래 형식으로 작성합니다.

```mdx
---
era: [slug]
---

<Level difficulty="easy">
## [시대명]은 어떤 시대였을까요?
어린이 눈높이의 설명...
</Level>

<Level difficulty="normal">
## [시대명]의 역사
중고등학생 수준의 설명...
</Level>

<Level difficulty="advanced">
## [시대명]의 역사적 맥락과 평가
학술적 분석 및 사료 인용...
</Level>
```

### 새 인물 콘텐츠 작성

`content/figures/[slug].mdx` 파일을 동일한 형식으로 작성합니다. `content/data/figures.json`에도 인물 메타데이터를 추가해야 검색 및 필터에 노출됩니다.

## 라이선스

MIT
