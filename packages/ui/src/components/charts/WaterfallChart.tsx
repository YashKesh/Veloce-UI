import { forwardRef, useId, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface WaterfallChartDatum {
  label: string
  value: number
  type?: 'bar' | 'total'
}

export interface WaterfallChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: WaterfallChartDatum[]
  width?: number
  height?: number
  showGrid?: boolean
  showValues?: boolean
  className?: string
  style?: CSSProperties
}

const PAD_L = 44
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

export const WaterfallChart = forwardRef<SVGSVGElement, WaterfallChartProps>(function WaterfallChart(
  { data, width = 540, height = 260, showGrid = true, showValues = false, className, style, ...rest },
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
        data-vl-chart="waterfall"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  // Compute segments: for 'bar', start = running, end = running + value. For 'total', start = 0, end = sum-so-far.
  let running = 0
  const segs = data.map((d) => {
    if (d.type === 'total') {
      const start = 0
      const end = running
      return { start, end, running: end, isTotal: true, value: end, label: d.label }
    }
    const start = running
    const end = running + d.value
    running = end
    return { start, end, running, isTotal: false, value: d.value, label: d.label }
  })

  const allY = segs.flatMap((s) => [s.start, s.end, 0])
  const ticks = niceTicks(Math.min(...allY), Math.max(...allY), 4)
  const yMin = ticks[0]
  const yMax = ticks[ticks.length - 1]

  const innerW = width - PAD_L - PAD_R
  const innerH = height - PAD_T - PAD_B
  const n = data.length
  const slot = innerW / n
  const barW = Math.max(2, slot * 0.6)

  const yFor = (v: number) => PAD_T + innerH - ((v - yMin) / (yMax - yMin || 1)) * innerH

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="waterfall"
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

      {segs.map((s, i) => {
        const x = PAD_L + slot * i + (slot - barW) / 2
        const y0 = yFor(s.start)
        const y1 = yFor(s.end)
        const by = Math.min(y0, y1)
        const bh = Math.max(1, Math.abs(y1 - y0))
        let color = 'var(--ac)'
        if (!s.isTotal) color = s.end >= s.start ? 'var(--ok)' : 'var(--err)'
        const next = segs[i + 1]
        return (
          <g key={i}>
            <rect x={x} y={by} width={barW} height={bh} rx={2} fill={color}>
              <title>{`${s.label}: ${s.value}`}</title>
            </rect>
            {next && (
              <line
                x1={x + barW}
                x2={PAD_L + slot * (i + 1) + (slot - barW) / 2}
                y1={yFor(s.end)}
                y2={yFor(s.end)}
                stroke="var(--line)"
                strokeDasharray="3 3"
                strokeWidth={1}
              />
            )}
            {showValues && (
              <text
                x={x + barW / 2}
                y={by - 6}
                fill="var(--fg)"
                fontSize={11}
                textAnchor="middle"
              >
                {s.value}
              </text>
            )}
            <text
              x={PAD_L + slot * i + slot / 2}
              y={height - PAD_B + 16}
              fill="var(--fg-3)"
              fontSize={11}
              textAnchor="middle"
            >
              {s.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
})
