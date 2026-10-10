import { SERIES_PALETTE as PALETTE } from './palette'
import { forwardRef, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface SlopeChartDatum {
  label: string
  start: number
  end: number
  color?: string
}

export interface SlopeChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: SlopeChartDatum[]
  leftLabel?: string
  rightLabel?: string
  width?: number
  height?: number
  className?: string
  style?: CSSProperties
}

const PAD_T = 36
const PAD_B = 24
const AXIS_L = 110
const AXIS_R = 110

export const SlopeChart = forwardRef<SVGSVGElement, SlopeChartProps>(function SlopeChart(
  { data, leftLabel = 'Before', rightLabel = 'After', width = 480, height = 280, className, style, ...rest },
  ref,
) {
  if (!data || data.length === 0) {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        data-vl-chart="slope"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const all = data.flatMap((d) => [d.start, d.end])
  const vMin = Math.min(...all)
  const vMax = Math.max(...all)
  const span = vMax - vMin || 1

  const xLeft = AXIS_L
  const xRight = width - AXIS_R
  const innerH = height - PAD_T - PAD_B
  const yFor = (v: number) => PAD_T + innerH - ((v - vMin) / span) * innerH

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="slope"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      <line x1={xLeft} x2={xLeft} y1={PAD_T} y2={height - PAD_B} stroke="var(--line)" strokeWidth={1} />
      <line x1={xRight} x2={xRight} y1={PAD_T} y2={height - PAD_B} stroke="var(--line)" strokeWidth={1} />

      <text x={xLeft} y={PAD_T - 14} fill="var(--fg-2)" fontSize={12} textAnchor="middle">
        {leftLabel}
      </text>
      <text x={xRight} y={PAD_T - 14} fill="var(--fg-2)" fontSize={12} textAnchor="middle">
        {rightLabel}
      </text>

      {data.map((d, i) => {
        const c = d.color ?? PALETTE[i % PALETTE.length]
        const ys = yFor(d.start)
        const ye = yFor(d.end)
        return (
          <g key={i}>
            <line x1={xLeft} x2={xRight} y1={ys} y2={ye} stroke={c} strokeWidth={2}>
              <title>{`${d.label}: ${d.start} → ${d.end}`}</title>
            </line>
            <circle cx={xLeft} cy={ys} r={3.5} fill={c} />
            <circle cx={xRight} cy={ye} r={3.5} fill={c} />
            <text x={xLeft - 8} y={ys} fill="var(--fg-3)" fontSize={10} textAnchor="end" dominantBaseline="middle">
              {d.start}
            </text>
            <text
              x={xRight + 8}
              y={ye}
              fill="var(--fg)"
              fontSize={11}
              textAnchor="start"
              dominantBaseline="middle"
            >
              {`${d.label} ${d.end}`}
            </text>
          </g>
        )
      })}
    </svg>
  )
})
