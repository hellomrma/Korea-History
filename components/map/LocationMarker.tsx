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
  capital: { icon: '🏛', color: '#1d4ed8' },
  battle:  { icon: '⚔️', color: '#dc2626' },
  site:    { icon: '📍', color: '#525252' },
}

export default function LocationMarker({ marker }: { marker: MarkerData }) {
  const [open, setOpen] = useState(false)
  const { color } = typeConfig[marker.type]

  return (
    <g role="button" aria-label={marker.name} onClick={() => setOpen(!open)} style={{ cursor: 'pointer' }}>
      <circle r={8} fill={color} stroke="white" strokeWidth={2} />
      {open && (
        <foreignObject x={10} y={-40} width={160} height={90}>
          <div className="bg-surface rounded-lg p-2 shadow-lg text-xs border border-border">
            <p className="font-bold text-text">{marker.name}</p>
            <p className="text-muted mt-0.5 leading-relaxed">{marker.description}</p>
          </div>
        </foreignObject>
      )}
    </g>
  )
}

export type { MarkerData }
