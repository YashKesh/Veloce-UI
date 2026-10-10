import { forwardRef, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface HistogramChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height' | 'values'> {
  values: number[]
  bins?: number
  width?: number
  height?: number
  showGrid?: boolean
  className?: string
  style?: CSSProperties
}

const PAD_L = 40
const PAD_R = 12
const PAD_T = 12
const PAD_B = 32

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

export const HistogramChart = forwardRef<SVGSVGElement, HistogramChartProps>(function HistogramChart(
  { values, bins = 10, width = 480, height = 280, showGrid = true, className, style, ...rest },
  ref,
) {
  if (!values || values.length === 0) {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        data-vl-chart="histogram"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const min = Math.min(...values)
  const max = Math.max(...values)
  const binCount = Math.max(1, Math.floor(bins))
  const binW = (max - min || 1) / binCount

  const counts = new Array<number>(binCount).fill(0)
  for (const v of values) {
    let idx = Math.floor((v - min) / binW)
    if (idx >= binCount) idx = binCount - 1
    if (idx < 0) idx = 0
    counts[idx] += 1
  }

  const countMax = Math.max(...counts, 1)
  const yTicks = niceTicks(0, countMax, 4)
  const yMax = yTicks[yTicks.length - 1]

  const innerW = width - PAD_L - PAD_R
  const innerH = height - PAD_T - PAD_B

  const xFor = (v: number) => PAD_L + ((v - min) / (max - min || 1)) * innerW
  const yFor = (v: number) => PAD_T + innerH - (v / (yMax || 1)) * innerH

  const edgeTicks = niceTicks(min, max, 5)

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="histogram"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {showGrid &&
        yTicks.map((t, i) => (
          <g key={`y-${i}`}>
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

      {counts.map((c, i) => {
        const x0 = min + i * binW
        const x1 = x0 + binW
        const bx = xFor(x0)
        const bw = Math.max(1, xFor(x1) - bx)
        const by = yFor(c)
        const bh = Math.max(0, yFor(0) - by)
        return (
          <rect key={i} x={bx} y={by} width={bw} height={bh} fill="var(--ac)" stroke="var(--bg-1)" strokeWidth={1}>
            <title>{`[${Number(x0.toFixed(4))},${Number(x1.toFixed(4))}): ${c}`}</title>
          </rect>
        )
      })}

      {edgeTicks.map((t, i) => (
        <text
          key={`x-${i}`}
          x={xFor(t)}
          y={height - PAD_B + 16}
          fill="var(--fg-3)"
          fontSize={11}
          textAnchor="middle"
        >
          {t}
        </text>
      ))}
    </svg>
  )
})
