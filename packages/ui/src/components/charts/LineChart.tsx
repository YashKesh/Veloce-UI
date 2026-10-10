import { forwardRef, useId, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface LineChartSeries {
  label: string
  data: number[]
  color?: string
}

export interface LineChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: { label: string; value: number }[]
  series?: LineChartSeries[]
  width?: number
  height?: number
  showGrid?: boolean
  showDots?: boolean
  strokeWidth?: number
  color?: string
  smooth?: boolean
  curve?: 'linear' | 'spline' | 'step'
  yFormat?: (n: number) => string
  className?: string
  style?: CSSProperties
}

const PAD_L = 40
const PAD_R = 12
const PAD_T = 12
const PAD_B = 28

function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]
    const p1 = points[i + 1]
    const mx = (p0.x + p1.x) / 2
    d += ` Q ${mx} ${p0.y} ${mx} ${(p0.y + p1.y) / 2}`
    d += ` Q ${mx} ${p1.y} ${p1.x} ${p1.y}`
  }
  return d
}

function linearPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return ''
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
}

function stepPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return ''
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const mx = (points[i - 1].x + points[i].x) / 2
    d += ` L ${mx} ${points[i - 1].y} L ${mx} ${points[i].y} L ${points[i].x} ${points[i].y}`
  }
  return d
}

function niceTicks(min: number, max: number, count = 4): number[] {
  if (min === max) return [min]
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

export const LineChart = forwardRef<SVGSVGElement, LineChartProps>(function LineChart(
  {
    data,
    series,
    width = 480,
    height = 220,
    showGrid = true,
    showDots = true,
    strokeWidth = 2,
    color = 'var(--ac)',
    smooth = true,
    curve,
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
        data-vl-chart="line"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const labels = data.map((d) => d.label)
  const allSeries: LineChartSeries[] =
    series && series.length > 0
      ? series
      : [{ label: 'value', data: data.map((d) => d.value), color }]

  const flat = allSeries.flatMap((s) => s.data)
  const dataMin = Math.min(...flat, 0)
  const dataMax = Math.max(...flat, 1)
  const ticks = niceTicks(dataMin, dataMax, 4)
  const yMin = ticks[0]
  const yMax = ticks[ticks.length - 1]

  const innerW = width - PAD_L - PAD_R
  const innerH = height - PAD_T - PAD_B
  const n = labels.length
  const xFor = (i: number) => PAD_L + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW)
  const yFor = (v: number) => PAD_T + innerH - ((v - yMin) / (yMax - yMin || 1)) * innerH

  const fmt = yFormat ?? ((n: number) => String(n))
  const resolvedCurve = curve ?? (smooth ? 'spline' : 'linear')
  const pathFor = (pts: { x: number; y: number }[]) =>
    resolvedCurve === 'spline' ? smoothPath(pts) : resolvedCurve === 'step' ? stepPath(pts) : linearPath(pts)

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="line"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      <defs>
        {allSeries.map((s, si) => {
          const c = s.color ?? color
          return (
            <linearGradient key={si} id={`vl-line-${uid}-${si}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={c} stopOpacity="0.18" />
              <stop offset="100%" stopColor={c} stopOpacity="0" />
            </linearGradient>
          )
        })}
      </defs>

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

      {labels.map((l, i) => (
        <text
          key={i}
          x={xFor(i)}
          y={height - PAD_B + 16}
          fill="var(--fg-3)"
          fontSize={12}
          textAnchor="middle"
        >
          {l}
        </text>
      ))}

      {allSeries.map((s, si) => {
        const pts = s.data.map((v, i) => ({ x: xFor(i), y: yFor(v) }))
        const c = s.color ?? color
        const d = pathFor(pts)
        const area = `${d} L ${pts[pts.length - 1].x} ${PAD_T + innerH} L ${pts[0].x} ${
          PAD_T + innerH
        } Z`
        return (
          <g key={si}>
            <path d={area} fill={`url(#vl-line-${uid}-${si})`} />
            <path d={d} fill="none" stroke={c} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            {showDots &&
              pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={3} fill="var(--bg-1)" stroke={c} strokeWidth={strokeWidth} />
              ))}
          </g>
        )
      })}
    </svg>
  )
})
