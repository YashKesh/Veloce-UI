import { SERIES_PALETTE as PALETTE } from './palette'
import { forwardRef, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface BumpSeries {
  label: string
  data: number[]
  color?: string
}

export interface BumpChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  series: BumpSeries[]
  periods: string[]
  width?: number
  height?: number
  className?: string
  style?: CSSProperties
}

const PAD_L = 90
const PAD_R = 90
const PAD_T = 16
const PAD_B = 28

export const BumpChart = forwardRef<SVGSVGElement, BumpChartProps>(function BumpChart(
  { series, periods, width = 520, height = 280, className, style, ...rest },
  ref,
) {
  if (!series || series.length === 0 || !periods || periods.length === 0) {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        data-vl-chart="bump"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const n = periods.length
  const maxRank = Math.max(1, ...series.flatMap((s) => s.data))
  const innerW = width - PAD_L - PAD_R
  const innerH = height - PAD_T - PAD_B

  const xFor = (i: number) => PAD_L + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW)
  const yFor = (rank: number) =>
    PAD_T + (maxRank === 1 ? innerH / 2 : ((rank - 1) / (maxRank - 1)) * innerH)

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="bump"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {periods.map((p, i) => (
        <g key={i}>
          <line
            x1={xFor(i)}
            x2={xFor(i)}
            y1={PAD_T}
            y2={PAD_T + innerH}
            stroke="var(--line)"
            strokeDasharray="2 4"
            strokeWidth={1}
          />
          <text
            x={xFor(i)}
            y={height - PAD_B + 16}
            fill="var(--fg-3)"
            fontSize={11}
            textAnchor="middle"
          >
            {p}
          </text>
        </g>
      ))}

      {series.map((s, si) => {
        const c = s.color ?? PALETTE[si % PALETTE.length]
        const pts = s.data.map((r, i) => ({ x: xFor(i), y: yFor(r) }))
        const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
        const first = pts[0]
        const last = pts[pts.length - 1]
        return (
          <g key={si}>
            <path
              d={d}
              fill="none"
              stroke={c}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title>{s.label}</title>
            </path>
            {pts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={4} fill="var(--bg-1)" stroke={c} strokeWidth={2} />
            ))}
            <text x={first.x - 8} y={first.y} fill={c} fontSize={11} textAnchor="end" dominantBaseline="middle">
              {s.label}
            </text>
            <text x={last.x + 8} y={last.y} fill={c} fontSize={11} textAnchor="start" dominantBaseline="middle">
              {s.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
})
