import { forwardRef, useId, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface SparklineChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: number[]
  width?: number
  height?: number
  color?: string
  showDot?: boolean
  strokeWidth?: number
  className?: string
  style?: CSSProperties
}

export const SparklineChart = forwardRef<SVGSVGElement, SparklineChartProps>(function SparklineChart(
  {
    data,
    width = 120,
    height = 28,
    color = 'var(--ac)',
    showDot = false,
    strokeWidth = 1.5,
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
        data-vl-chart="sparkline"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const pad = strokeWidth + 1
  const innerW = width - pad * 2
  const innerH = height - pad * 2
  const n = data.length
  const range = max - min || 1

  const pts = data.map((v, i) => ({
    x: pad + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW),
    y: pad + innerH - ((v - min) / range) * innerH,
  }))

  // Smooth with simple quadratic between midpoints
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i]
    const p1 = pts[i + 1]
    const mx = (p0.x + p1.x) / 2
    const my = (p0.y + p1.y) / 2
    d += ` Q ${p0.x} ${p0.y} ${mx} ${my}`
  }
  d += ` L ${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`

  const last = pts[pts.length - 1]

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="sparkline"
      className={cx('vl-chart', className)}
      style={style}
      {...rest}
    >
      <defs>
        <linearGradient id={`vl-spark-${uid}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${d} L ${last.x} ${height - pad} L ${pts[0].x} ${height - pad} Z`}
        fill={`url(#vl-spark-${uid})`}
      />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {showDot && (
        <circle cx={last.x} cy={last.y} r={strokeWidth + 1} fill={color} />
      )}
    </svg>
  )
})
