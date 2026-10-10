import { forwardRef, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface DumbbellChartDatum {
  label: string
  start: number
  end: number
}

export interface DumbbellChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: DumbbellChartDatum[]
  startLabel?: string
  endLabel?: string
  width?: number
  height?: number
  dotRadius?: number
  showDelta?: boolean
  className?: string
  style?: CSSProperties
}

const PAD_L = 96
const PAD_R = 48
const PAD_T = 28
const PAD_B = 28
const ROW_GAP = 10

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

export const DumbbellChart = forwardRef<SVGSVGElement, DumbbellChartProps>(function DumbbellChart(
  {
    data,
    startLabel = 'Start',
    endLabel = 'End',
    width = 480,
    height = 280,
    dotRadius = 5,
    showDelta = true,
    className,
    style,
    ...rest
  },
  ref,
) {
  if (!data || data.length === 0) {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        data-vl-chart="dumbbell"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const all = data.flatMap((d) => [d.start, d.end])
  const ticks = niceTicks(Math.min(...all), Math.max(...all), 4)
  const vMin = ticks[0]
  const vMax = ticks[ticks.length - 1]
  const span = vMax - vMin || 1

  const innerW = width - PAD_L - PAD_R
  const innerH = height - PAD_T - PAD_B
  const n = data.length
  const rowH = (innerH - ROW_GAP * (n - 1)) / n
  const xFor = (v: number) => PAD_L + ((v - vMin) / span) * innerW

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="dumbbell"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {ticks.map((t, i) => (
        <g key={`t-${i}`}>
          <line
            x1={xFor(t)}
            x2={xFor(t)}
            y1={PAD_T}
            y2={height - PAD_B}
            stroke="var(--line)"
            strokeDasharray="2 4"
            strokeWidth={1}
          />
          <text
            x={xFor(t)}
            y={height - PAD_B + 16}
            fill="var(--fg-3)"
            fontSize={11}
            textAnchor="middle"
          >
            {t}
          </text>
        </g>
      ))}

      {/* Legend */}
      <g>
        <circle cx={PAD_L} cy={14} r={4} fill="var(--fg-3)" />
        <text x={PAD_L + 8} y={14} fill="var(--fg-2)" fontSize={11} dominantBaseline="middle">
          {startLabel}
        </text>
        <circle cx={PAD_L + 72} cy={14} r={4} fill="var(--ac)" />
        <text x={PAD_L + 80} y={14} fill="var(--fg-2)" fontSize={11} dominantBaseline="middle">
          {endLabel}
        </text>
      </g>

      {data.map((d, i) => {
        const cy = PAD_T + i * (rowH + ROW_GAP) + rowH / 2
        const xs = xFor(d.start)
        const xe = xFor(d.end)
        const delta = d.end - d.start
        return (
          <g key={`r-${i}`}>
            <line x1={xs} x2={xe} y1={cy} y2={cy} stroke="var(--line-2)" strokeWidth={2.5} />
            <circle cx={xs} cy={cy} r={dotRadius} fill="var(--fg-3)">
              <title>{`${d.label} ${startLabel}: ${d.start}`}</title>
            </circle>
            <circle cx={xe} cy={cy} r={dotRadius} fill="var(--ac)">
              <title>{`${d.label} ${endLabel}: ${d.end}`}</title>
            </circle>
            <text
              x={PAD_L - 10}
              y={cy}
              fill="var(--fg)"
              fontSize={11}
              textAnchor="end"
              dominantBaseline="middle"
            >
              {d.label}
            </text>
            {showDelta && (
              <text
                x={width - PAD_R + 6}
                y={cy}
                fill={delta >= 0 ? 'var(--ok)' : 'var(--err)'}
                fontSize={10}
                textAnchor="start"
                dominantBaseline="middle"
              >
                {delta >= 0 ? `+${delta}` : `${delta}`}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
})
