import { forwardRef, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface PyramidDatum {
  group: string
  left: number
  right: number
}

export interface PopulationPyramidChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: PyramidDatum[]
  leftLabel?: string
  rightLabel?: string
  width?: number
  height?: number
  showGrid?: boolean
  className?: string
  style?: CSSProperties
}

const PAD_L = 16
const PAD_R = 16
const PAD_T = 28
const PAD_B = 28
const CENTER_GAP = 52

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

export const PopulationPyramidChart = forwardRef<SVGSVGElement, PopulationPyramidChartProps>(
  function PopulationPyramidChart(
    { data, leftLabel = 'Left', rightLabel = 'Right', width = 480, height = 280, showGrid = true, className, style, ...rest },
    ref,
  ) {
    const rows = data ?? []

    if (rows.length === 0) {
      return (
        <svg
          ref={ref}
          width={width}
          height={height}
          data-vl-chart="population-pyramid"
          className={cx('vl-chart', className)}
          style={style}
          {...rest}
        />
      )
    }

    const maxVal = Math.max(...rows.flatMap((d) => [d.left, d.right]), 1)
    const ticks = niceTicks(0, maxVal, 3)
    const tMax = ticks[ticks.length - 1]

    const innerW = width - PAD_L - PAD_R
    const innerH = height - PAD_T - PAD_B
    const centerX = PAD_L + innerW / 2
    const sideW = (innerW - CENTER_GAP) / 2
    const leftEdge = centerX - CENTER_GAP / 2
    const rightEdge = centerX + CENTER_GAP / 2

    const n = rows.length
    const rowH = innerH / n
    const barH = Math.min(rowH * 0.7, 26)

    const leftFor = (v: number) => (v / (tMax || 1)) * sideW
    const rightFor = (v: number) => (v / (tMax || 1)) * sideW

    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        data-vl-chart="population-pyramid"
        className={cx('vl-chart', className)}
        style={{ fontFamily: 'var(--font-sans)', ...style }}
        {...rest}
      >
        {showGrid &&
          ticks.map((t, i) => {
            if (t === 0) return null
            const lx = leftEdge - leftFor(t)
            const rx = rightEdge + rightFor(t)
            return (
              <g key={`g-${i}`}>
                <line x1={lx} x2={lx} y1={PAD_T} y2={height - PAD_B} stroke="var(--line)" strokeDasharray="2 4" strokeWidth={1} />
                <line x1={rx} x2={rx} y1={PAD_T} y2={height - PAD_B} stroke="var(--line)" strokeDasharray="2 4" strokeWidth={1} />
                <text x={lx} y={height - PAD_B + 16} fill="var(--fg-3)" fontSize={10} textAnchor="middle">
                  {t}
                </text>
                <text x={rx} y={height - PAD_B + 16} fill="var(--fg-3)" fontSize={10} textAnchor="middle">
                  {t}
                </text>
              </g>
            )
          })}

        <text x={leftEdge} y={PAD_T - 12} fill="var(--fg-2)" fontSize={11} textAnchor="end" fontWeight={600}>
          {leftLabel}
        </text>
        <text x={rightEdge} y={PAD_T - 12} fill="var(--fg-2)" fontSize={11} textAnchor="start" fontWeight={600}>
          {rightLabel}
        </text>

        {rows.map((d, i) => {
          const cy = PAD_T + rowH * (i + 0.5)
          const by = cy - barH / 2
          const lw = leftFor(d.left)
          const rw = rightFor(d.right)
          return (
            <g key={i}>
              <rect x={leftEdge - lw} y={by} width={lw} height={barH} fill="color-mix(in oklch, var(--ac) 60%, var(--bg-3))">
                <title>{`${d.group} · ${leftLabel}: ${d.left}`}</title>
              </rect>
              <rect x={rightEdge} y={by} width={rw} height={barH} fill="var(--ac)">
                <title>{`${d.group} · ${rightLabel}: ${d.right}`}</title>
              </rect>
              <text x={centerX} y={cy} fill="var(--fg)" fontSize={10} textAnchor="middle" dominantBaseline="middle">
                {d.group}
              </text>
            </g>
          )
        })}
      </svg>
    )
  },
)
