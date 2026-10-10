import { forwardRef, useId, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export type SparklineChartType = 'line' | 'bar' | 'status'

export interface SparklineChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: number[]
  width?: number
  height?: number
  color?: string
  /** Rendering kind. `line` draws a smooth path + soft fill; `bar` draws one bar per value;
   *  `status` draws a row of colored cells (positive / negative / zero). */
  type?: SparklineChartType
  /** Dot on the last point (line only). */
  endMarker?: boolean
  /** Split colour above/below this value. `line`/`bar` only. */
  baseline?: number
  /** Makes the sparkline self-describing instead of decorative. */
  label?: string
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
    type = 'line',
    endMarker = true,
    baseline,
    label,
    showDot,
    strokeWidth = 1.5,
    className,
    style,
    ...rest
  },
  ref,
) {
  const uid = useId().replace(/:/g, '')
  const negColor = 'var(--err)'
  const zeroColor = 'var(--fg-3)'

  const a11y = label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': true as const }

  if (!data || data.length === 0) {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        data-vl-chart="sparkline"
        data-vl-sparkline-type={type}
        className={cx('vl-chart', className)}
        style={style}
        {...a11y}
        {...rest}
      />
    )
  }

  const n = data.length

  // ── BAR ───────────────────────────────────────────────────────────────────
  if (type === 'bar') {
    const min = Math.min(...data, baseline ?? 0)
    const max = Math.max(...data, baseline ?? 0)
    const range = max - min || 1
    const gap = Math.max(1, Math.min(2, Math.floor(width / (n * 3))))
    const barW = Math.max(1, (width - gap * (n - 1)) / n)
    const zeroY = baseline != null
      ? height - ((baseline - min) / range) * height
      : height
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        data-vl-chart="sparkline"
        data-vl-sparkline-type="bar"
        className={cx('vl-chart', className)}
        style={style}
        {...a11y}
        {...rest}
      >
        {data.map((v, i) => {
          const x = i * (barW + gap)
          const y = height - ((v - min) / range) * height
          const topY = Math.min(y, zeroY)
          const h = Math.max(1, Math.abs(y - zeroY))
          const fill = baseline != null && v < baseline ? negColor : color
          return <rect key={i} x={x} y={topY} width={barW} height={h} fill={fill} rx={0.5} />
        })}
      </svg>
    )
  }

  // ── STATUS ────────────────────────────────────────────────────────────────
  if (type === 'status') {
    const gap = Math.max(1, Math.min(2, Math.floor(width / (n * 3))))
    const cellW = Math.max(2, (width - gap * (n - 1)) / n)
    const ref0 = baseline ?? 0
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        data-vl-chart="sparkline"
        data-vl-sparkline-type="status"
        className={cx('vl-chart', className)}
        style={style}
        {...a11y}
        {...rest}
      >
        {data.map((v, i) => {
          const x = i * (cellW + gap)
          const fill = v > ref0 ? color : v < ref0 ? negColor : zeroColor
          return <rect key={i} x={x} y={0} width={cellW} height={height} fill={fill} rx={1} />
        })}
      </svg>
    )
  }

  // ── LINE (default) ────────────────────────────────────────────────────────
  const min = Math.min(...data)
  const max = Math.max(...data)
  const pad = strokeWidth + 1
  const innerW = width - pad * 2
  const innerH = height - pad * 2
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
  const showEnd = (showDot ?? endMarker) === true

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="sparkline"
      data-vl-sparkline-type="line"
      className={cx('vl-chart', className)}
      style={style}
      {...a11y}
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
      {showEnd && (
        <circle cx={last.x} cy={last.y} r={strokeWidth + 1} fill={color} />
      )}
    </svg>
  )
})
