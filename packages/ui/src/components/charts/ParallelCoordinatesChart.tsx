import { SERIES_PALETTE as PALETTE } from './palette'
import { forwardRef, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface ParallelDimension {
  key: string
  label: string
  min?: number
  max?: number
}

export interface ParallelCoordinatesChartProps
  extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  dimensions: ParallelDimension[]
  data: Record<string, number>[]
  /** Optional dimension key whose value tints each line along the accent palette. */
  colorKey?: string
  width?: number
  height?: number
  className?: string
  style?: CSSProperties
}

const PAD_L = 40
const PAD_R = 40
const PAD_T = 28
const PAD_B = 28

export const ParallelCoordinatesChart = forwardRef<SVGSVGElement, ParallelCoordinatesChartProps>(
  function ParallelCoordinatesChart(
    { dimensions, data, colorKey, width = 480, height = 280, className, style, ...rest },
    ref,
  ) {
    if (!dimensions || dimensions.length === 0 || !data || data.length === 0) {
      return (
        <svg
          ref={ref}
          width={width}
          height={height}
          data-vl-chart="parallel-coordinates"
          className={cx('vl-chart', className)}
          style={style}
          {...rest}
        />
      )
    }

    const innerW = width - PAD_L - PAD_R
    const innerH = height - PAD_T - PAD_B
    const dims = dimensions.map((dim) => {
      const vals = data.map((row) => row[dim.key] ?? 0)
      const min = dim.min ?? Math.min(...vals)
      const max = dim.max ?? Math.max(...vals)
      return { ...dim, min, max, span: max - min || 1 }
    })

    const dimCount = dims.length
    const xFor = (i: number) => (dimCount === 1 ? PAD_L + innerW / 2 : PAD_L + (innerW * i) / (dimCount - 1))
    const yFor = (di: number, v: number) => {
      const d = dims[di]
      return PAD_T + innerH - ((v - d.min) / d.span) * innerH
    }

    const colorDim = colorKey ? dims.find((d) => d.key === colorKey) : undefined

    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        data-vl-chart="parallel-coordinates"
        className={cx('vl-chart', className)}
        style={{ fontFamily: 'var(--font-sans)', ...style }}
        {...rest}
      >
        {dims.map((d, i) => {
          const x = xFor(i)
          return (
            <g key={d.key}>
              <line x1={x} x2={x} y1={PAD_T} y2={height - PAD_B} stroke="var(--line)" strokeWidth={1} />
              <text x={x} y={PAD_T - 12} fill="var(--fg-2)" fontSize={11} textAnchor="middle">
                {d.label}
              </text>
              <text
                x={x}
                y={PAD_T - 2}
                fill="var(--fg-3)"
                fontSize={9}
                textAnchor="middle"
              >
                {Number(d.max.toFixed(2))}
              </text>
              <text
                x={x}
                y={height - PAD_B + 12}
                fill="var(--fg-3)"
                fontSize={9}
                textAnchor="middle"
              >
                {Number(d.min.toFixed(2))}
              </text>
            </g>
          )
        })}

        {data.map((row, ri) => {
          let color = 'var(--ac)'
          if (colorDim) {
            const frac = ((row[colorDim.key] ?? colorDim.min) - colorDim.min) / colorDim.span
            color = PALETTE[Math.min(PALETTE.length - 1, Math.floor(frac * PALETTE.length))]
          }
          const points = dims.map((_, di) => `${xFor(di)},${yFor(di, row[dims[di].key] ?? 0)}`).join(' ')
          return (
            <polyline
              key={ri}
              points={points}
              fill="none"
              stroke={color}
              strokeWidth={1.5}
              strokeOpacity={0.4}
            >
              <title>{dims.map((d) => `${d.label}: ${row[d.key] ?? 0}`).join('  ')}</title>
            </polyline>
          )
        })}
      </svg>
    )
  },
)
