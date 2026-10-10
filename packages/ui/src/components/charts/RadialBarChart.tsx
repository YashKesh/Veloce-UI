import { SERIES_PALETTE as PALETTE } from './palette'
import { forwardRef, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface RadialBarChartDatum {
  label: string
  value: number
  color?: string
}

export interface RadialBarChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: RadialBarChartDatum[]
  max?: number
  size?: number
  /** Starting angle in degrees. -90 begins at 12 o'clock. */
  startAngle?: number
  /** Total sweep in degrees. */
  sweep?: number
  className?: string
  style?: CSSProperties
}

/** Arc path centred on radius r, swept via stroke-width. */
function arcStroke(ox: number, oy: number, r: number, a0: number, a1: number): string {
  const x0 = ox + r * Math.cos(a0)
  const y0 = oy + r * Math.sin(a0)
  const x1 = ox + r * Math.cos(a1)
  const y1 = oy + r * Math.sin(a1)
  const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0
  const dir = a1 >= a0 ? 1 : 0
  return `M${x0} ${y0}A${r} ${r} 0 ${large} ${dir} ${x1} ${y1}`
}

export const RadialBarChart = forwardRef<SVGSVGElement, RadialBarChartProps>(function RadialBarChart(
  { data, max, size = 260, startAngle = -90, sweep = 270, className, style, ...rest },
  ref,
) {
  if (!data || data.length === 0) {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        data-vl-chart="radial-bar"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const ox = size / 2
  const oy = size / 2
  const resolvedMax = max ?? Math.max(...data.map((d) => d.value), 1)
  const n = data.length
  const pad = 10
  const rOuter = size / 2 - pad
  const ringGap = 4
  const ringWidth = Math.max(4, (rOuter * 0.72) / n - ringGap)
  const a0 = (startAngle * Math.PI) / 180
  const sweepRad = (sweep * Math.PI) / 180

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      data-vl-chart="radial-bar"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {data.map((d, i) => {
        const r = rOuter - i * (ringWidth + ringGap)
        if (r <= ringWidth / 2) return null
        const frac = Math.max(0, Math.min(1, d.value / resolvedMax))
        const a1 = a0 + sweepRad
        const aVal = a0 + sweepRad * frac
        const color = d.color ?? PALETTE[i % PALETTE.length]
        return (
          <g key={i}>
            <path
              d={arcStroke(ox, oy, r, a0, a1)}
              stroke="var(--bg-3)"
              strokeWidth={ringWidth}
              fill="none"
              strokeLinecap="round"
            />
            {frac > 0 && (
              <path
                d={arcStroke(ox, oy, r, a0, aVal)}
                stroke={color}
                strokeWidth={ringWidth}
                fill="none"
                strokeLinecap="round"
              >
                <title>{`${d.label}: ${d.value}`}</title>
              </path>
            )}
            {(() => {
              // Place label in the ring's gap (opposite the sweep) so it never overlaps the arc.
              // For a full 360° ring, fall back to the arc start.
              const labelAngle = sweep >= 360 ? a0 : a0 + Math.PI + sweepRad / 2
              const lx = ox + r * Math.cos(labelAngle)
              const ly = oy + r * Math.sin(labelAngle)
              return (
                <text
                  x={lx}
                  y={ly}
                  fill="var(--fg-2)"
                  fontSize={10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {d.label}
                </text>
              )
            })()}
          </g>
        )
      })}
    </svg>
  )
})
