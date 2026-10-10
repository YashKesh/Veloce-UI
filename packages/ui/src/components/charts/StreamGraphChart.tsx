import { SERIES_PALETTE as PALETTE } from './palette'
import { forwardRef, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface StreamSeries {
  label: string
  data: number[]
  color?: string
}

export interface StreamGraphChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  series: StreamSeries[]
  labels?: string[]
  width?: number
  height?: number
  className?: string
  style?: CSSProperties
}

const PAD_L = 12
const PAD_R = 12
const PAD_T = 12
const PAD_B = 28

function smoothArea(top: { x: number; y: number }[], bottom: { x: number; y: number }[]): string {
  const line = (pts: { x: number; y: number }[]) => {
    let d = ''
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i]
      const p1 = pts[i + 1]
      const mx = (p0.x + p1.x) / 2
      d += ` Q ${mx} ${p0.y} ${mx} ${(p0.y + p1.y) / 2}`
      d += ` Q ${mx} ${p1.y} ${p1.x} ${p1.y}`
    }
    return d
  }
  let d = `M ${top[0].x} ${top[0].y}`
  d += line(top)
  d += ` L ${bottom[bottom.length - 1].x} ${bottom[bottom.length - 1].y}`
  const rev = [...bottom].reverse()
  d += line(rev)
  return d + ' Z'
}

export const StreamGraphChart = forwardRef<SVGSVGElement, StreamGraphChartProps>(
  function StreamGraphChart({ series, labels, width = 520, height = 280, className, style, ...rest }, ref) {
    if (!series || series.length === 0 || series.every((s) => s.data.length === 0)) {
      return (
        <svg
          ref={ref}
          width={width}
          height={height}
          data-vl-chart="stream-graph"
          className={cx('vl-chart', className)}
          style={style}
          {...rest}
        />
      )
    }

    const n = Math.max(...series.map((s) => s.data.length))
    const innerW = width - PAD_L - PAD_R
    const innerH = height - PAD_T - PAD_B

    const totals: number[] = []
    for (let i = 0; i < n; i++) {
      let t = 0
      for (const s of series) t += Math.abs(s.data[i] ?? 0)
      totals.push(t)
    }
    const maxTotal = Math.max(...totals, 1)

    const midY = PAD_T + innerH / 2
    const scale = innerH / maxTotal
    const xFor = (i: number) => PAD_L + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW)

    // Cumulative baselines starting at -sum/2
    const baselines: number[] = []
    for (let i = 0; i < n; i++) baselines.push(-totals[i] / 2)

    const cursor = [...baselines]

    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        data-vl-chart="stream-graph"
        className={cx('vl-chart', className)}
        style={{ fontFamily: 'var(--font-sans)', ...style }}
        {...rest}
      >
        {series.map((s, si) => {
          const c = s.color ?? PALETTE[si % PALETTE.length]
          const bottom: { x: number; y: number }[] = []
          const top: { x: number; y: number }[] = []
          for (let i = 0; i < n; i++) {
            const v = Math.abs(s.data[i] ?? 0)
            const b = cursor[i]
            const t = b + v
            bottom.push({ x: xFor(i), y: midY + b * scale })
            top.push({ x: xFor(i), y: midY + t * scale })
            cursor[i] = t
          }
          return (
            <path key={si} d={smoothArea(top, bottom)} fill={c} fillOpacity={0.85} stroke={c} strokeWidth={0.5}>
              <title>{s.label}</title>
            </path>
          )
        })}

        {labels &&
          labels.map((l, i) => (
            <text
              key={i}
              x={xFor(i)}
              y={height - PAD_B + 16}
              fill="var(--fg-3)"
              fontSize={11}
              textAnchor="middle"
            >
              {l}
            </text>
          ))}
      </svg>
    )
  },
)
