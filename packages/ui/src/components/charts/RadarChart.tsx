import { forwardRef, useId, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface RadarChartDatum {
  axis: string
  value: number
}

export interface RadarChartSeries {
  label: string
  data: number[]
  color?: string
}

export interface RadarChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: RadarChartDatum[]
  series?: RadarChartSeries[]
  size?: number
  max?: number
  levels?: number
  color?: string
  className?: string
  style?: CSSProperties
}

const PALETTE = [
  'var(--ac)',
  'color-mix(in oklch, var(--ac) 60%, var(--bg-3))',
  'color-mix(in oklch, var(--ac) 35%, var(--bg-3))',
  'color-mix(in oklch, var(--fg) 20%, var(--bg-3))',
  'color-mix(in oklch, var(--ac) 85%, var(--fg))',
]

export const RadarChart = forwardRef<SVGSVGElement, RadarChartProps>(function RadarChart(
  { data, series, size = 280, max, levels = 4, color = 'var(--ac)', className, style, ...rest },
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
        data-vl-chart="radar"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const axes = data.map((d) => d.axis)
  const n = axes.length

  const seriesList: RadarChartSeries[] =
    series && series.length > 0
      ? series
      : [{ label: 'value', data: data.map((d) => d.value), color }]

  const allValues = seriesList.flatMap((s) => s.data)
  const vMax = max ?? Math.max(...allValues, 1)

  const cx0 = size / 2
  const cy0 = size / 2
  const pad = 36
  const r = size / 2 - pad

  const angleFor = (i: number) => -Math.PI / 2 + (i / n) * Math.PI * 2
  const pointFor = (i: number, v: number) => {
    const a = angleFor(i)
    const rr = (v / vMax) * r
    return { x: cx0 + rr * Math.cos(a), y: cy0 + rr * Math.sin(a) }
  }

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      data-vl-chart="radar"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {/* Rings */}
      {Array.from({ length: levels }).map((_, li) => {
        const rr = (r * (li + 1)) / levels
        const pts = axes
          .map((_, i) => {
            const a = angleFor(i)
            return `${cx0 + rr * Math.cos(a)},${cy0 + rr * Math.sin(a)}`
          })
          .join(' ')
        return (
          <polygon
            key={li}
            points={pts}
            fill="none"
            stroke="var(--line)"
            strokeDasharray="2 4"
            strokeWidth={1}
          />
        )
      })}

      {/* Axis spokes */}
      {axes.map((_, i) => {
        const a = angleFor(i)
        return (
          <line
            key={i}
            x1={cx0}
            y1={cy0}
            x2={cx0 + r * Math.cos(a)}
            y2={cy0 + r * Math.sin(a)}
            stroke="var(--line)"
            strokeWidth={1}
          />
        )
      })}

      {/* Series polygons */}
      {seriesList.map((s, si) => {
        const c = s.color ?? PALETTE[si % PALETTE.length]
        const pts = s.data
          .map((v, i) => {
            const p = pointFor(i, v)
            return `${p.x},${p.y}`
          })
          .join(' ')
        return (
          <g key={si}>
            <polygon points={pts} fill={c} fillOpacity={0.2} stroke={c} strokeWidth={1.5} />
            {s.data.map((v, i) => {
              const p = pointFor(i, v)
              return <circle key={i} cx={p.x} cy={p.y} r={2.5} fill={c} />
            })}
          </g>
        )
      })}

      {/* Axis labels */}
      {axes.map((label, i) => {
        const a = angleFor(i)
        const lx = cx0 + (r + 14) * Math.cos(a)
        const ly = cy0 + (r + 14) * Math.sin(a)
        const anchor = Math.abs(Math.cos(a)) < 0.3 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end'
        return (
          <text
            key={i}
            x={lx}
            y={ly}
            fill="var(--fg-3)"
            fontSize={11}
            textAnchor={anchor}
            dominantBaseline="middle"
          >
            {label}
          </text>
        )
      })}
    </svg>
  )
})
