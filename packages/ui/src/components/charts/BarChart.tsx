import { forwardRef, useId, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface BarChartSeries {
  label: string
  data: number[]
  color?: string
}

export interface BarChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: { label: string; value: number }[]
  series?: BarChartSeries[]
  width?: number
  height?: number
  barGap?: number
  groupGap?: number
  showGrid?: boolean
  showValues?: boolean
  color?: string
  yFormat?: (n: number) => string
  className?: string
  style?: CSSProperties
}

const PAD_L = 40
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

// Rounded top rect path
function roundedTopRect(x: number, y: number, w: number, h: number, r: number): string {
  const rr = Math.max(0, Math.min(r, w / 2, h))
  return `M ${x} ${y + h} L ${x} ${y + rr} Q ${x} ${y} ${x + rr} ${y} L ${x + w - rr} ${y} Q ${x + w} ${y} ${x + w} ${y + rr} L ${x + w} ${y + h} Z`
}

export const BarChart = forwardRef<SVGSVGElement, BarChartProps>(function BarChart(
  {
    data,
    series,
    width = 480,
    height = 220,
    barGap = 4,
    groupGap = 16,
    showGrid = true,
    showValues = false,
    color = 'var(--ac)',
    yFormat,
    className,
    style,
    ...rest
  },
  ref,
) {
  const uid = useId().replace(/:/g, '')

  if (!data || data.length === 0) {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        data-vl-chart="bar"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const labels = data.map((d) => d.label)
  const allSeries: BarChartSeries[] =
    series && series.length > 0
      ? series
      : [{ label: 'value', data: data.map((d) => d.value), color }]

  const flat = allSeries.flatMap((s) => s.data)
  const dataMax = Math.max(...flat, 1)
  const dataMin = Math.min(...flat, 0)
  const ticks = niceTicks(dataMin, dataMax, 4)
  const yMin = ticks[0]
  const yMax = ticks[ticks.length - 1]

  const innerW = width - PAD_L - PAD_R
  const innerH = height - PAD_T - PAD_B
  const n = labels.length
  const seriesCount = allSeries.length

  const groupW = (innerW - groupGap * (n - 1)) / n
  const barW = Math.max(2, (groupW - barGap * (seriesCount - 1)) / seriesCount)

  const yFor = (v: number) => PAD_T + innerH - ((v - yMin) / (yMax - yMin || 1)) * innerH
  const baseY = yFor(Math.max(0, yMin))

  const fmt = yFormat ?? ((n: number) => String(n))

  void uid

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="bar"
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
              {fmt(t)}
            </text>
          </g>
        ))}

      {labels.map((l, i) => {
        const gx = PAD_L + i * (groupW + groupGap)
        return (
          <text
            key={i}
            x={gx + groupW / 2}
            y={height - PAD_B + 16}
            fill="var(--fg-3)"
            fontSize={12}
            textAnchor="middle"
          >
            {l}
          </text>
        )
      })}

      {labels.map((_, i) => {
        const gx = PAD_L + i * (groupW + groupGap)
        return (
          <g key={i}>
            {allSeries.map((s, si) => {
              const v = s.data[i] ?? 0
              const c = s.color ?? color
              const y = yFor(v)
              const h = Math.abs(baseY - y)
              const bx = gx + si * (barW + barGap)
              const by = Math.min(y, baseY)
              return (
                <g key={si}>
                  <path d={roundedTopRect(bx, by, barW, h, 4)} fill={c} />
                  {showValues && (
                    <text
                      x={bx + barW / 2}
                      y={by - 6}
                      fill="var(--fg)"
                      fontSize={11}
                      textAnchor="middle"
                    >
                      {fmt(v)}
                    </text>
                  )}
                </g>
              )
            })}
          </g>
        )
      })}
    </svg>
  )
})
