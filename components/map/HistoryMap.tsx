'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import EraSelector from './EraSelector'
import LocationMarker, { type MarkerData } from './LocationMarker'
import type { Era, HistoryEvent, Figure } from '@/types'

const GEO_URL = '/data/korea-provinces.json'

const eraMarkers: Record<string, MarkerData[]> = {
  gojoseon: [
    { id: 'asadal', name: '아사달', coordinates: [125.7, 38.9], description: '고조선의 수도로 추정되는 지역 (현 북한 평양 일대)', type: 'capital' },
    { id: 'wanggeomseong', name: '왕검성', coordinates: [125.7, 38.8], description: '고조선의 수도, 기원전 108년 한나라에 의해 함락', type: 'capital' },
    { id: 'daedong', name: '대동강 유역', coordinates: [126.0, 38.5], description: '고조선 청동기 문화의 중심지, 비파형 동검 출토 지역', type: 'site' },
    { id: 'incheon-gojoseon', name: '미추홀 일대', coordinates: [126.7, 37.4], description: '고조선 영향권 남방 거점', type: 'site' },
  ],
  'proto-three-kingdoms': [
    { id: 'wirye-seoul', name: '위례성(서울)', coordinates: [127.0, 37.5], description: '온조왕이 세운 백제의 첫 수도 (현 서울·하남 일대)', type: 'capital' },
    { id: 'saro-gyeongju', name: '서라벌(경주)', coordinates: [129.2, 35.8], description: '박혁거세가 세운 신라(사로국)의 수도', type: 'capital' },
    { id: 'geumgwan-gimhae', name: '금관가야(김해)', coordinates: [128.9, 35.2], description: '김수로왕이 건국한 금관가야의 수도, 철기 문화의 중심', type: 'capital' },
    { id: 'daegaya-goryeong', name: '대가야(고령)', coordinates: [128.3, 35.7], description: '가야 연맹의 중심 대가야, 고령 지산동 고분군 소재지', type: 'site' },
    { id: 'mahan-iksan', name: '마한(익산 일대)', coordinates: [127.0, 35.9], description: '마한 소국들이 산재하던 전라도·충청도 지역', type: 'site' },
    { id: 'nakdong-gaya', name: '낙동강 하류(가야 권역)', coordinates: [128.6, 35.5], description: '가야 연맹이 번성하던 낙동강 하류 지역, 독자적 철 생산', type: 'site' },
  ],
  'three-kingdoms': [
    { id: 'pyongyang-gog', name: '평양성(고구려 수도)', coordinates: [125.7, 39.0], description: '427년 장수왕이 천도한 고구려 후기 수도', type: 'capital' },
    { id: 'hanseong-baekje', name: '한성·위례(백제)', coordinates: [127.0, 37.5], description: '백제 초기 수도, 475년 고구려 장수왕에 함락', type: 'capital' },
    { id: 'ungjin-gongju', name: '웅진(공주)', coordinates: [127.1, 36.5], description: '한성 함락 후 백제가 천도한 두 번째 수도', type: 'capital' },
    { id: 'sabi-buyeo', name: '사비(부여)', coordinates: [126.9, 36.3], description: '538년 이후 백제의 수도, 660년 백제 멸망지', type: 'capital' },
    { id: 'gyeongju-silla', name: '경주(금성, 신라)', coordinates: [129.2, 35.8], description: '신라의 천년 수도 금성, 선덕여왕·김유신·김춘추의 활동지', type: 'capital' },
    { id: 'hwangsanbeol', name: '황산벌(논산)', coordinates: [127.1, 36.2], description: '660년 계백 5천 결사대와 신라 5만 군대의 결전지', type: 'battle' },
    { id: 'ansi-pyeongannam', name: '안시성', coordinates: [125.1, 40.6], description: '645년 당 태종의 대군을 막아낸 고구려 요새 (88일 항전)', type: 'battle' },
    { id: 'gijbelpo-secheon', name: '기벌포(서천)', coordinates: [126.7, 36.1], description: '676년 신라가 당나라 수군을 물리친 나당전쟁 마지막 전투지', type: 'battle' },
    { id: 'chamseonggwan', name: '첨성대(경주)', coordinates: [129.22, 35.84], description: '선덕여왕 때 건립된 동양 최고(最古) 천문대', type: 'site' },
  ],
  'unified-silla': [
    { id: 'gyeongju-unified', name: '경주(통일신라 수도)', coordinates: [129.2, 35.8], description: '삼국통일 후 통일신라의 수도, 최전성기 인구 100만', type: 'capital' },
    { id: 'bulguksa', name: '불국사·석굴암(경주)', coordinates: [129.33, 35.79], description: '751년 창건, 신라 불교 예술의 정수 (유네스코 세계유산)', type: 'site' },
    { id: 'cheonghaejin', name: '청해진(완도)', coordinates: [126.75, 34.32], description: '828년 장보고가 설치한 해상 기지, 동아시아 해상무역 장악', type: 'site' },
    { id: 'haeinsa', name: '해인사(합천)', coordinates: [128.1, 35.8], description: '신라 말 창건, 훗날 팔만대장경을 보관한 사찰', type: 'site' },
    { id: 'hwangnyongsa', name: '황룡사터(경주)', coordinates: [129.22, 35.83], description: '신라 최대 사찰 황룡사지, 9층 목탑 터 (몽골 침입 때 소실)', type: 'site' },
    { id: 'seongdeokdaewang-beopjong', name: '에밀레종(경주)', coordinates: [129.21, 35.82], description: '771년 주조된 성덕대왕신종, 신라 범종 예술의 최고 걸작', type: 'site' },
  ],
  balhae: [
    { id: 'sanggyeong', name: '상경용천부(발해 수도)', coordinates: [129.5, 44.5], description: '발해의 수도 상경 (현 중국 헤이룽장성, 지도 범위 밖)', type: 'capital' },
    { id: 'hamheung-south', name: '남해부(함흥 일대)', coordinates: [127.8, 39.9], description: '발해 남경 남해부, 신라와의 국경 지역', type: 'site' },
    { id: 'cheongjin-east', name: '동경용원부(청진 일대)', coordinates: [129.8, 41.8], description: '발해 동경, 동해안 교역 거점', type: 'site' },
    { id: 'silla-balhae-border', name: '발해-신라 경계 (원산 일대)', coordinates: [127.5, 39.2], description: '발해와 신라의 국경선, 두 나라 간 교통로(발해도)가 있었음', type: 'site' },
  ],
  goryeo: [
    { id: 'gaeseong', name: '개성(고려 수도)', coordinates: [126.55, 37.97], description: '918~1392년 고려의 수도 (현 북한 개성)', type: 'capital' },
    { id: 'gwiju-battle', name: '귀주(구성)', coordinates: [125.4, 40.0], description: '1019년 강감찬 귀주대첩 현장, 거란 10만 대군 격파', type: 'battle' },
    { id: 'ganghwa-island', name: '강화도', coordinates: [126.44, 37.73], description: '1232~1270년 대몽항쟁기 고려 임시 수도, 팔만대장경 제작지', type: 'capital' },
    { id: 'haeinsa-goryeo', name: '해인사(합천)', coordinates: [128.1, 35.8], description: '팔만대장경(1236~1251년 제작, 80,000여 장) 보관 사찰 (유네스코)', type: 'site' },
    { id: 'jikji-cheongju', name: '청주 흥덕사 터', coordinates: [127.47, 36.63], description: '1377년 세계 최고(最古) 금속활자본 직지심체요절 인쇄 장소', type: 'site' },
    { id: 'cheoingu-happo', name: '합포(창원)', coordinates: [128.68, 35.21], description: '1274·1281년 여원연합군 일본 정벌 출항지', type: 'battle' },
    { id: 'cheoin-fortress', name: '처인성(용인)', coordinates: [127.2, 37.2], description: '1232년 몽골 장수 살리타이를 사살한 처인성 전투지', type: 'battle' },
    { id: 'sambyeolcho-jeju', name: '제주도(삼별초)', coordinates: [126.5, 33.4], description: '삼별초가 최후 항전한 거점, 1273년 여몽연합군에 진압', type: 'battle' },
  ],
  joseon: [
    { id: 'hanyang', name: '한양(경복궁)', coordinates: [126.98, 37.58], description: '1394년 천도한 조선의 수도, 경복궁·창덕궁 소재지', type: 'capital' },
    { id: 'suwon-hwaseong', name: '수원 화성', coordinates: [127.01, 37.29], description: '정조가 1796년 완성한 계획 도시 수원의 성곽 (유네스코)', type: 'site' },
    { id: 'jeonju-joseon', name: '전주', coordinates: [127.14, 35.82], description: '조선 왕실 이씨의 본향, 동학농민운동 전주화약 체결지', type: 'site' },
    { id: 'myeongryang', name: '명량해협(진도)', coordinates: [126.32, 34.62], description: '1597년 이순신이 13척으로 133척을 격파한 명량해전', type: 'battle' },
    { id: 'hansando', name: '한산도(통영)', coordinates: [128.5, 34.82], description: '1592년 이순신 한산대첩, 학익진으로 왜군 섬멸', type: 'battle' },
    { id: 'haengju', name: '행주산성(고양)', coordinates: [126.82, 37.62], description: '1593년 권율 행주대첩, 민관군 합심 승리', type: 'battle' },
    { id: 'noryang', name: '노량(남해)', coordinates: [127.92, 34.93], description: '1598년 이순신 장군이 전사한 마지막 해전', type: 'battle' },
    { id: 'jinju-fortress', name: '진주성', coordinates: [128.08, 35.19], description: '1592·1593년 두 차례 진주성 전투, 논개 의거', type: 'battle' },
    { id: 'namhansanseong', name: '남한산성(광주)', coordinates: [127.19, 37.48], description: '1636년 병자호란 때 인조가 45일 항전한 산성 (유네스코)', type: 'battle' },
    { id: 'dosan-seowon', name: '도산서원(안동)', coordinates: [128.75, 36.74], description: '이황이 세운 서원, 조선 성리학의 성지', type: 'site' },
    { id: 'changdeokgung', name: '창덕궁(서울)', coordinates: [126.99, 37.58], description: '조선의 이궁, 후원(비원)으로 유명한 유네스코 세계유산', type: 'site' },
    { id: 'jeju-exile', name: '제주도(유배지)', coordinates: [126.5, 33.4], description: '추사 김정희 등 많은 학자·정치인이 유배된 섬', type: 'site' },
  ],
  daehan: [
    { id: 'deoksugung', name: '덕수궁(경운궁)', coordinates: [126.975, 37.565], description: '고종이 대한제국 선포(1897) 후 황궁으로 사용, 을사조약 체결 장소', type: 'capital' },
    { id: 'hwangdan-altar', name: '환구단(서울)', coordinates: [126.98, 37.56], description: '1897년 고종이 황제 즉위식을 거행한 천제단', type: 'site' },
    { id: 'incheon-jemulpo', name: '인천(제물포)', coordinates: [126.63, 37.47], description: '1883년 개항, 서양 문물 유입의 관문, 청일전쟁 해전 발생지', type: 'site' },
    { id: 'ugeumchi', name: '우금치(공주)', coordinates: [127.1, 36.4], description: '1894년 동학농민군이 관군·일본군에 패한 우금치 전투지', type: 'battle' },
    { id: 'jeonju-donghak', name: '전주(동학농민운동)', coordinates: [127.14, 35.82], description: '1894년 동학농민군이 점령하고 전주화약을 체결한 곳', type: 'battle' },
    { id: 'busan-russo-japan', name: '부산(러일전쟁)', coordinates: [129.0, 35.1], description: '러일전쟁 당시 일본군 병참 거점, 일제 경제 침투의 교두보', type: 'site' },
  ],
  'japanese-rule': [
    { id: 'gyeongseong', name: '경성(서울)', coordinates: [126.98, 37.57], description: '일제강점기 식민지 수도, 조선총독부·서대문형무소 소재지', type: 'capital' },
    { id: 'tapgol-park', name: '탑골공원(서울)', coordinates: [126.992, 37.573], description: '1919년 3월 1일 독립선언 낭독 후 만세운동이 시작된 장소', type: 'site' },
    { id: 'seodaemun-prison', name: '서대문형무소', coordinates: [126.957, 37.572], description: '일제가 독립운동가를 수감·고문한 형무소, 유관순 순국지', type: 'site' },
    { id: 'aunae-market', name: '아우내장터(천안)', coordinates: [127.22, 36.8], description: '1919년 유관순이 만세운동을 이끈 장터', type: 'site' },
    { id: 'gwangju-student', name: '광주(학생독립운동)', coordinates: [126.85, 35.16], description: '1929년 광주학생독립운동 발원지', type: 'site' },
    { id: 'busan-forcedlabor', name: '부산(강제징용 출발지)', coordinates: [129.0, 35.1], description: '일제의 강제 징용·징병으로 조선인이 끌려간 주요 항구', type: 'site' },
    { id: 'cheongju-newspaper', name: '청주(동아일보)', coordinates: [127.47, 36.63], description: '일제강점기 문화통치 시기 언론 항일 운동의 거점 지역', type: 'site' },
  ],
  liberation: [
    { id: 'seoul-liberation', name: '서울(광복)', coordinates: [126.98, 37.57], description: '1945년 8월 15일 광복, 건국준비위원회 결성지', type: 'capital' },
    { id: 'pyeongyang-38', name: '38선(파주)', coordinates: [126.9, 37.92], description: '미소 분할 점령의 경계선 38선, 남북 분단의 상징', type: 'site' },
    { id: 'jeju-43', name: '제주도(4·3사건)', coordinates: [126.5, 33.4], description: '1948년 제주 4·3사건, 3만여 명의 제주 도민이 희생', type: 'battle' },
    { id: 'incheon-liberation', name: '인천', coordinates: [126.7, 37.45], description: '미군 진주 거점, 해방 후 귀환 동포·미군 상륙지', type: 'site' },
  ],
  'korean-war': [
    { id: 'seoul-war', name: '서울', coordinates: [126.98, 37.57], description: '전쟁 중 4번 주인이 바뀐 수도, 최대 격전지', type: 'capital' },
    { id: 'incheon-landing', name: '인천상륙작전', coordinates: [126.63, 37.47], description: '1950년 9월 15일 맥아더의 인천상륙작전으로 전세 역전', type: 'battle' },
    { id: 'nakdong-line', name: '낙동강 방어선', coordinates: [128.7, 35.8], description: '1950년 8~9월 유엔군·국군 최후 방어선, 여기서 무너지면 패전', type: 'battle' },
    { id: 'panmunjom', name: '판문점', coordinates: [126.68, 37.95], description: '1953년 7월 27일 정전협정 체결 장소, 현재도 남북 접경지', type: 'site' },
    { id: 'geoje-pow', name: '거제도(포로수용소)', coordinates: [128.62, 34.88], description: '6·25 전쟁 포로 수용소, 포로 폭동 사건 발생지', type: 'site' },
    { id: 'chuncheon-front', name: '화천(중부전선)', coordinates: [127.7, 38.1], description: '치열한 고지전이 벌어진 중부 전선, 파로호 전투 일대', type: 'battle' },
    { id: 'busan-wartime', name: '부산(임시수도)', coordinates: [129.0, 35.1], description: '1950년 피란민 150만 모인 전시 임시수도, 국제시장', type: 'capital' },
  ],
  modern: [
    { id: 'seoul-modern', name: '서울', coordinates: [126.98, 37.57], description: '대한민국 수도, 1988 서울올림픽 개최지', type: 'capital' },
    { id: 'gwangju-518', name: '광주(5·18)', coordinates: [126.85, 35.16], description: '1980년 5·18 민주화운동, 전남도청 항쟁 (유네스코 기록유산)', type: 'battle' },
    { id: 'ulsan-industry', name: '울산(현대공업)', coordinates: [129.3, 35.5], description: '경제개발 시대 중화학공업의 메카, 현대자동차·조선소', type: 'site' },
    { id: 'pohang-steel', name: '포항제철', coordinates: [129.36, 36.0], description: '1973년 가동, 한국 철강 산업 기반 (POSCO)', type: 'site' },
    { id: 'gumi-electronics', name: '구미(전자산업)', coordinates: [128.34, 36.12], description: '1970년대 전자·섬유 산업 단지, 한국 수출 주도 성장의 거점', type: 'site' },
    { id: 'busan-modern', name: '부산', coordinates: [129.0, 35.1], description: '한국 제2도시, 2002 한일월드컵 도시, 국제영화제 개최지', type: 'site' },
    { id: 'jeju-modern', name: '제주도', coordinates: [126.5, 33.4], description: '유네스코 세계자연유산(2007), 관광 중심지', type: 'site' },
  ],
}

const categoryColors: Record<string, string> = {
  '정치': '#3b82f6', '문화': '#22c55e', '전쟁': '#ef4444',
  '과학': '#8b5cf6', '인물': '#f59e0b',
}

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/

export default function HistoryMap({
  eras,
  events,
  figures,
}: {
  eras: Era[]
  events: HistoryEvent[]
  figures: Figure[]
}) {
  const [selectedEra, setSelectedEra] = useState('joseon')
  const [activeTab, setActiveTab] = useState<'events' | 'figures' | 'places'>('events')

  const markers = eraMarkers[selectedEra] ?? []
  const currentEra = eras.find((e) => e.slug === selectedEra)
  const safeColor = currentEra && HEX_COLOR.test(currentEra.color) ? currentEra.color : '#2563eb'

  const eraEvents = useMemo(
    () => events.filter((e) => e.era === selectedEra),
    [events, selectedEra]
  )
  const eraFigures = useMemo(
    () => figures.filter((f) => f.era === selectedEra),
    [figures, selectedEra]
  )

  return (
    <div>
      <EraSelector eras={eras} selectedSlug={selectedEra} onChange={setSelectedEra} />

      {currentEra && (
        <p className="text-sm text-muted mb-8 max-w-2xl leading-relaxed">
          <span className="font-semibold text-text">{currentEra.name}</span>
          {' '}— {currentEra.summary}
        </p>
      )}

      {/* 지도 + 사이드패널 */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 지도 */}
        <div className="flex-shrink-0 lg:w-[420px]">
          <div className="bg-surface border border-border overflow-hidden">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 2800, center: [127.8, 36.2] }}
              width={420}
              height={560}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={safeColor}
                      fillOpacity={0.18}
                      stroke={safeColor}
                      strokeWidth={0.6}
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none', fillOpacity: 0.3 },
                        pressed: { outline: 'none' },
                      }}
                    />
                  ))
                }
              </Geographies>
              {markers.map((marker) => (
                <Marker key={marker.id} coordinates={marker.coordinates}>
                  <LocationMarker marker={marker} />
                </Marker>
              ))}
            </ComposableMap>
          </div>
          <p className="text-xs text-subtle mt-3">마커를 클릭하면 설명이 나타납니다</p>
        </div>

        {/* 사이드패널 */}
        <div className="flex-1 min-w-0">
          {/* 탭 */}
          <div className="flex border-b border-border mb-6">
            {(
              [
                { id: 'events', label: `사건 (${eraEvents.length})` },
                { id: 'figures', label: `인물 (${eraFigures.length})` },
                { id: 'places', label: `장소 (${markers.length})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-1 mr-6 py-3 text-sm border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? 'border-text text-text'
                    : 'border-transparent text-muted hover:text-text'
                }`}
                aria-pressed={activeTab === tab.id}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 사건 탭 */}
          {activeTab === 'events' && (
            <div className="overflow-y-auto max-h-[500px] pr-1">
              {eraEvents.length === 0 ? (
                <p className="text-subtle text-sm py-4">이 시대의 사건 데이터가 없습니다</p>
              ) : (
                <div className="divide-y divide-border">
                  {eraEvents.map((ev) => {
                    const yearLabel = ev.year < 0 ? `기원전 ${Math.abs(ev.year)}년` : `${ev.year}년`
                    return (
                      <div key={ev.id} className="py-4">
                        <div className="flex items-baseline gap-3 mb-1.5">
                          <span className="text-xs text-subtle border border-border px-1.5 py-0.5">
                            {ev.category}
                          </span>
                          <p className="text-xs text-muted tabular-nums">{yearLabel}</p>
                        </div>
                        <p className="text-sm font-semibold text-text tracking-tight mb-1">{ev.title}</p>
                        <p className="text-xs text-muted leading-relaxed">{ev.summary}</p>
                        {ev.figures.length > 0 && (
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                            {ev.figures.map((slug) => {
                              const fig = figures.find((f) => f.slug === slug)
                              if (!fig) return null
                              return (
                                <Link
                                  key={slug}
                                  href={`/figure/${slug}`}
                                  className="text-xs text-text border-b border-text pb-px hover:text-point hover:border-point"
                                >
                                  {fig.name}
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* 인물 탭 */}
          {activeTab === 'figures' && (
            <div className="overflow-y-auto max-h-[500px] pr-1">
              {eraFigures.length === 0 ? (
                <p className="text-subtle text-sm py-4">이 시대의 인물 데이터가 없습니다</p>
              ) : (
                <div className="divide-y divide-border">
                  {eraFigures.map((fig) => {
                    const birthLabel = fig.birth === null ? '?' : (fig.birth < 0 ? `기원전 ${Math.abs(fig.birth)}` : `${fig.birth}`)
                    const deathLabel = fig.death === null ? '미상' : (fig.death < 0 ? `기원전 ${Math.abs(fig.death)}` : `${fig.death}`)
                    return (
                      <Link
                        key={fig.slug}
                        href={`/figure/${fig.slug}`}
                        className="block py-4 group"
                      >
                        <p className="text-xs text-muted tabular-nums mb-1">{birthLabel}~{deathLabel}</p>
                        <p className="text-sm font-semibold text-text tracking-tight group-hover:text-point">{fig.name}</p>
                        <p className="text-xs text-muted">{fig.role}</p>
                        <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1.5">
                          {fig.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs text-subtle">#{tag}</span>
                          ))}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* 장소 탭 */}
          {activeTab === 'places' && (
            <div className="overflow-y-auto max-h-[500px] pr-1">
              {markers.length === 0 ? (
                <p className="text-subtle text-sm py-4">이 시대의 장소 데이터가 없습니다</p>
              ) : (
                <div className="divide-y divide-border">
                  {markers.map((m) => {
                    const typeLabel = { capital: '수도·왕도', battle: '전쟁·전투', site: '유적·유물' }[m.type]
                    return (
                      <div key={m.id} className="py-4">
                        <p className="text-xs text-subtle mb-1">{typeLabel}</p>
                        <p className="text-sm font-semibold text-text tracking-tight mb-1">{m.name}</p>
                        <p className="text-xs text-muted leading-relaxed">{m.description}</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
