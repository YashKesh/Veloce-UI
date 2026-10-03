import { forwardRef, useId, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface CandleChartDatum {
  label: string
  open: number
  high: number
  low: number
  close: number
}

export interface CandleChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: CandleChartDatum[]
  width?: number
  height?: number
  showGrid?: boolean
  upColor?: string
  downColor?: string
  className?: string
  style?: CSSProperties
}

const PAD_L = 44
const PAD_R = 12
const PAD_T = 12
const PAD_B = 28

function niceTicks(min: number, max: number, count = 4): number[] {
  if (min === max) return [min, min + 1]
  const range = max - min
  const step = Math.pow(10, Math.floor(Math.log10(range / count)))
  const err = (count * step) / range
  let s = step
  if (err <= 0.15) s = step * 10
  else if (err <= 0.35) s = step * 5
  else if (err <= 0.75) s = step * 2
  const tMin = Math.floor(min / s) * s
  const tMax = Math.ceil(max / s) * s
  const ticks: number[] = []
  for (let v = tMin; v <= tMax + s / 2; v += s) ticks.push(Number(v.toFixed(10)))
  return ticks
}

export const CandleChart = forwardRef<SVGSVGElement, CandleChartProps>(function CandleChart(
  {
    data,
    width = 540,
    height = 260,
    showGrid = true,
    upColor = 'var(--ok)',
    downColor = 'var(--err)',
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
        width={width}
        height={height}
        data-vl-chart="candle"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const highs = data.map((d) => d.high)
  const lows = data.map((d) => d.low)
  const ticks = niceTicks(Math.min(...lows), Math.max(...highs), 4)
  const yMin = ticks[0]
  const yMax = ticks[ticks.length - 1]

  const innerW = width - PAD_L - PAD_R
  const innerH = height - PAD_T - PAD_B
  const n = data.length

  const slot = innerW / n
  const candleW = Math.max(2, slot * 0.6)

  const yFor = (v: number) => PAD_T + innerH - ((v - yMin) / (yMax - yMin || 1)) * innerH

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="candle"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {showGrid &&
        ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={PAD_L}
              x2={width - PAD_R}
              y1={yFor(t)}
              y2={yFor(t)}
              stroke="var(--line)"
              strokeDasharray="2 4"
              strokeWidth={1}
            />
            <text
              x={PAD_L - 8}
              y={yFor(t)}
              fill="var(--fg-3)"
              fontSize={12}
              textAnchor="end"
              dominantBaseline="middle"
            >
              {t}
            </text>
          </g>
        ))}

      {data.map((d, i) => {
        const cx0 = PAD_L + slot * i + slot / 2
        const up = d.close >= d.open
        const c = up ? upColor : downColor
        const bodyTop = yFor(Math.max(d.open, d.close))
        const bodyBot = yFor(Math.min(d.open, d.close))
        const bodyH = Math.max(1, bodyBot - bodyTop)
        return (
          <g key={i}>
            <line
              x1={cx0}
              x2={cx0}
              y1={yFor(d.high)}
              y2={yFor(d.low)}
              stroke={c}
              strokeWidth={1}
            />
            <rect
              x={cx0 - candleW / 2}
              y={bodyTop}
              width={candleW}
              height={bodyH}
              fill={c}
              rx={1}
            >
              <title>{`${d.label}  O:${d.open} H:${d.high} L:${d.low} C:${d.close}`}</title>
            </rect>
            <text
              x={cx0}
              y={height - PAD_B + 16}
              fill="var(--fg-3)"
              fontSize={11}
              textAnchor="middle"
            >
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
})
