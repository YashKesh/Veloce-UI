import { forwardRef, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface BulletChartDatum {
  label: string
  value: number
  target: number
  /** Ascending qualitative range bounds; the last entry is the max. */
  ranges: number[]
}

export interface BulletChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: BulletChartDatum[]
  width?: number
  height?: number
  className?: string
  style?: CSSProperties
}

const PAD_L = 90
const PAD_R = 16
const PAD_T = 12
const PAD_B = 12
const ROW_GAP = 14

// Range bands shade from darker (poor) to lighter (good).
const bandFill = (i: number, n: number) => {
  const pct = n <= 1 ? 50 : 20 + (i / (n - 1)) * 55
  return `color-mix(in oklch, var(--fg-3) ${Math.round(pct)}%, var(--bg-3))`
}

export const BulletChart = forwardRef<SVGSVGElement, BulletChartProps>(function BulletChart(
  { data, width = 480, height = 220, className, style, ...rest },
  ref,
) {
  if (!data || data.length === 0) {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        data-vl-chart="bullet"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const innerW = width - PAD_L - PAD_R
  const innerH = height - PAD_T - PAD_B
  const rowH = (innerH - ROW_GAP * (data.length - 1)) / data.length
  const barH = Math.max(6, rowH * 0.42)

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="bullet"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {data.map((d, i) => {
        const y = PAD_T + i * (rowH + ROW_GAP)
        const cy = y + rowH / 2
        const max = d.ranges[d.ranges.length - 1] || Math.max(d.value, d.target, 1)
        const xFor = (v: number) => PAD_L + (Math.max(0, Math.min(v, max)) / (max || 1)) * innerW
        const bands = d.ranges.map((r, ri) => ({ lo: ri === 0 ? 0 : d.ranges[ri - 1], hi: r }))
        return (
          <g key={i}>
            {bands.map((b, bi) => (
              <rect
                key={bi}
                x={xFor(b.lo)}
                y={y}
                width={Math.max(0, xFor(b.hi) - xFor(b.lo))}
                height={rowH}
                fill={bandFill(bi, bands.length)}
              />
            ))}
            <rect
              x={PAD_L}
              y={cy - barH / 2}
              width={Math.max(0, xFor(d.value) - PAD_L)}
              height={barH}
              rx={2}
              fill="var(--ac)"
            >
              <title>{`${d.label}: ${d.value} (target ${d.target})`}</title>
            </rect>
            <line
              x1={xFor(d.target)}
              x2={xFor(d.target)}
              y1={y + 1}
              y2={y + rowH - 1}
              stroke="var(--fg)"
              strokeWidth={2}
            />
            <text
              x={PAD_L - 8}
              y={cy}
              fill="var(--fg)"
              fontSize={12}
              textAnchor="end"
              dominantBaseline="middle"
            >
              {d.label}
            </text>
            <text
              x={xFor(d.value) + 4}
              y={cy}
              fill="var(--fg-2)"
              fontSize={10}
              dominantBaseline="middle"
            >
              {d.value}
            </text>
          </g>
        )
      })}
    </svg>
  )
})
