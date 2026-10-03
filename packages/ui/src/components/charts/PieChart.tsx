import { forwardRef, useId, type CSSProperties, type ReactNode, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface PieChartDatum {
  label: string
  value: number
  color?: string
}

export interface PieChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: PieChartDatum[]
  size?: number
  /** When > 0, renders a donut with the given inner radius in pixels. */
  innerRadius?: number
  /** Gap between slices, in degrees. */
  padAngle?: number
  /** Starting angle in degrees. -90 (default) begins at 12 o'clock. */
  startAngle?: number
  /** Optional big centre text (donut mode). */
  centerLabel?: ReactNode
  /** Optional caption under the centre label. */
  centerSublabel?: ReactNode
  /** Show slice labels at mid-arc. */
  showLabels?: boolean
  className?: string
  style?: CSSProperties
}

// Accent-family palette (matches the site's chart language): accent → mixed with bg-3.
const PALETTE = [
  'var(--ac)',
  'color-mix(in oklch, var(--ac) 60%, var(--bg-3))',
  'color-mix(in oklch, var(--ac) 35%, var(--bg-3))',
  'color-mix(in oklch, var(--fg) 20%, var(--bg-3))',
  'color-mix(in oklch, var(--ac) 85%, var(--fg))',
]

function polar(ox: number, oy: number, r: number, angleRad: number) {
  return { x: ox + r * Math.cos(angleRad), y: oy + r * Math.sin(angleRad) }
}

/** Thick-stroke arc centred on radius r — rendered via stroke-width to produce a ring sector. */
function arcStroke(ox: number, oy: number, r: number, a0: number, a1: number): string {
  const [x0, y0] = [ox + r * Math.cos(a0), oy + r * Math.sin(a0)]
  const [x1, y1] = [ox + r * Math.cos(a1), oy + r * Math.sin(a1)]
  const large = a1 - a0 > Math.PI ? 1 : 0
  return `M${x0} ${y0}A${r} ${r} 0 ${large} 1 ${x1} ${y1}`
}

/** Filled sector (pie slice) from centre out. */
function sectorPath(ox: number, oy: number, r: number, a0: number, a1: number): string {
  const [x0, y0] = [ox + r * Math.cos(a0), oy + r * Math.sin(a0)]
  const [x1, y1] = [ox + r * Math.cos(a1), oy + r * Math.sin(a1)]
  const large = a1 - a0 > Math.PI ? 1 : 0
  return `M${ox} ${oy}L${x0} ${y0}A${r} ${r} 0 ${large} 1 ${x1} ${y1}Z`
}

export const PieChart = forwardRef<SVGSVGElement, PieChartProps>(function PieChart(
  {
    data,
    size = 220,
    innerRadius = 0,
    padAngle = 1,
    startAngle = -90,
    centerLabel,
    centerSublabel,
    showLabels = false,
    className,
    style,
    ...rest
  },
  ref,
) {
  const uid = useId().replace(/:/g, '')
  void uid

  if (!data || data.length === 0) {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        data-vl-chart="pie"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const total = data.reduce((s, d) => s + Math.max(0, d.value), 0) || 1
  const ox = size / 2
  const oy = size / 2
  const pad = 6 // outer breathing room
  const rOuter = size / 2 - pad
  const isDonut = innerRadius > 0
  // For donut mode: render as thick-stroke arcs on the mid-radius. Stroke width = ring thickness.
  const ringMid = (rOuter + Math.min(innerRadius, rOuter - 4)) / 2
  const ringWidth = rOuter - Math.min(innerRadius, rOuter - 4)
  const padRad = (padAngle * Math.PI) / 180
  const start0 = (startAngle * Math.PI) / 180

  let acc = start0

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      data-vl-chart="pie"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {data.map((d, i) => {
        const frac = Math.max(0, d.value) / total
        const sweep = frac * Math.PI * 2
        const a0 = acc + padRad / 2
        const a1 = acc + sweep - padRad / 2
        acc += sweep
        if (a1 <= a0) return null
        const color = d.color ?? PALETTE[i % PALETTE.length]
        if (isDonut) {
          return (
            <path
              key={i}
              d={arcStroke(ox, oy, ringMid, a0, a1)}
              stroke={color}
              strokeWidth={ringWidth}
              fill="none"
              strokeLinecap="butt"
            >
              <title>{`${d.label}: ${d.value}`}</title>
            </path>
          )
        }
        return (
          <path key={i} d={sectorPath(ox, oy, rOuter, a0, a1)} fill={color} stroke="var(--bg-1)" strokeWidth={1}>
            <title>{`${d.label}: ${d.value}`}</title>
          </path>
        )
      })}

      {/* Thin outer separator ring — matches the website's chart language */}
      {isDonut && (
        <circle cx={ox} cy={oy} r={rOuter + 1} fill="none" stroke="var(--bg-1)" strokeWidth={2} />
      )}

      {showLabels &&
        data.map((d, i) => {
          // Recompute midpoints independently of the render loop above
          const starts = data.slice(0, i).reduce((s, x) => s + (Math.max(0, x.value) / total) * Math.PI * 2, start0)
          const frac = Math.max(0, d.value) / total
          if (frac < 0.03) return null
          const mid = starts + (frac * Math.PI * 2) / 2
          const lr = isDonut ? ringMid : rOuter * 0.65
          const p = polar(ox, oy, lr, mid)
          return (
            <text
              key={`l-${i}`}
              x={p.x}
              y={p.y}
              fill="var(--fg)"
              fontSize={11}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {d.label}
            </text>
          )
        })}

      {isDonut && (centerLabel != null || centerSublabel != null) && (
        <g>
          {centerLabel != null && (
            <text
              x={ox}
              y={centerSublabel != null ? oy - 2 : oy}
              fill="var(--fg)"
              fontSize={Math.round(size * 0.14)}
              fontWeight={600}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {centerLabel}
            </text>
          )}
          {centerSublabel != null && (
            <text
              x={ox}
              y={oy + Math.round(size * 0.08)}
              fill="var(--fg-3)"
              fontSize={11}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {centerSublabel}
            </text>
          )}
        </g>
      )}
    </svg>
  )
})
