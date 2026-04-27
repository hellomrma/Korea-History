'use client'
import { useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import EraSelector from './EraSelector'
import LocationMarker, { type MarkerData } from './LocationMarker'
import type { Era } from '@/types'

const GEO_URL = 'https://raw.githubusercontent.com/southkorea/southkorea-maps/master/kostat/2012/json/skorea-provinces-2012-simple.json'

const eraMarkers: Record<string, MarkerData[]> = {
  gojoseon: [
    { id: 'asadal', name: '아사달', coordinates: [125.7, 38.9], description: '고조선의 수도로 추정되는 지역', type: 'capital' },
  ],
  'three-kingdoms': [
    { id: 'pyongyang', name: '평양', coordinates: [125.7, 39.0], description: '고구려 후기 수도', type: 'capital' },
    { id: 'hanseong', name: '한성', coordinates: [127.0, 37.6], description: '백제 초기 수도', type: 'capital' },
    { id: 'gyeongju', name: '경주', coordinates: [129.2, 35.8], description: '신라의 수도', type: 'capital' },
  ],
  joseon: [
    { id: 'hanyang', name: '한양', coordinates: [126.98, 37.57], description: '조선의 수도 (지금의 서울)', type: 'capital' },
    { id: 'myeongryang', name: '명량', coordinates: [126.3, 34.6], description: '1597년 명량해전 격전지', type: 'battle' },
  ],
  'korean-war': [
    { id: 'incheon', name: '인천', coordinates: [126.7, 37.45], description: '1950년 인천상륙작전', type: 'battle' },
    { id: 'seoul', name: '서울', coordinates: [126.98, 37.57], description: '전쟁 중 수도 서울', type: 'capital' },
  ],
  modern: [
    { id: 'seoul', name: '서울', coordinates: [126.98, 37.57], description: '대한민국 수도', type: 'capital' },
  ],
}

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/

export default function HistoryMap({ eras }: { eras: Era[] }) {
  const [selectedEra, setSelectedEra] = useState('joseon')
  const markers = eraMarkers[selectedEra] ?? []
  const currentEra = eras.find((e) => e.slug === selectedEra)
  const safeColor = currentEra && HEX_COLOR.test(currentEra.color) ? currentEra.color : '#d1c4a8'

  return (
    <div>
      <EraSelector eras={eras} selectedSlug={selectedEra} onChange={setSelectedEra} />
      {currentEra && (
        <p className="text-center text-sm text-gray-600 mb-6">
          <span className="font-bold" style={{ color: safeColor }}>{currentEra.name}</span>
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
                  fill={safeColor}
                  stroke="#fff"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none', opacity: 0.8 },
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
      <p className="text-xs text-center text-gray-400 mt-3">마커를 클릭하면 설명이 나타납니다</p>
    </div>
  )
}
