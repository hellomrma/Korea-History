declare module 'react-simple-maps' {
  import type { SVGProps, ReactNode, CSSProperties } from 'react'

  interface ProjectionConfig {
    scale?: number
    center?: [number, number]
  }
  interface ComposableMapProps {
    projection?: string
    projectionConfig?: ProjectionConfig
    width?: number
    height?: number
    children?: ReactNode
    style?: CSSProperties
    className?: string
  }
  export function ComposableMap(props: ComposableMapProps): JSX.Element

  interface GeographiesProps {
    geography: string | object
    children: (args: { geographies: Geography[] }) => ReactNode
  }
  interface Geography {
    rsmKey: string
    [key: string]: unknown
  }
  export function Geographies(props: GeographiesProps): JSX.Element

  interface GeographyProps extends SVGProps<SVGPathElement> {
    geography: Geography
    fill?: string
    stroke?: string
    strokeWidth?: number
    style?: { default?: CSSProperties; hover?: CSSProperties; pressed?: CSSProperties }
  }
  export function Geography(props: GeographyProps): JSX.Element

  interface MarkerProps {
    coordinates: [number, number]
    children?: ReactNode
    style?: { default?: CSSProperties; hover?: CSSProperties; pressed?: CSSProperties }
    className?: string
  }
  export function Marker(props: MarkerProps): JSX.Element
}
