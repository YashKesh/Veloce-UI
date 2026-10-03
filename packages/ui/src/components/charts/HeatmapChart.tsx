import { forwardRef, useId, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface HeatmapChartDatum {
  x: string | number
  y: string | number
  value: number
}

export interface HeatmapChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: HeatmapChartDatum[]
  width?: number
  height?: number
  color?: string
  className?: string
  style?: CSSProperties
}

const PAD_L = 56
const PAD_R = 12
const PAD_T = 12
const PAD_B = 32

export const HeatmapChart = forwardRef<SVGSVGElement, HeatmapChartProps>(function HeatmapChart(
  { data, width = 540, height = 260, color = 'var(--ac)', className, style, ...rest },
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
        data-vl-chart="heatmap"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const xKeys: (string | number)[] = []
  const yKeys: (string | number)[] = []
  const xSeen = new Set<string>()
  const ySeen = new Set<string>()
  for (const d of data) {
    const xk = String(d.x)
    const yk = String(d.y)
    if (!xSeen.has(xk)) {
      xSeen.add(xk)
      xKeys.push(d.x)
    }
    if (!ySeen.has(yk)) {
      ySeen.add(yk)
      yKeys.push(d.y)
    }
  }

  const vMin = Math.min(...data.map((d) => d.value))
  const vMax = Math.max(...data.map((d) => d.value))
  const range = vMax - vMin || 1

  const innerW = width - PAD_L - PAD_R
  const innerH = height - PAD_T - PAD_B
  const cellW = innerW / xKeys.length
  const cellH = innerH / yKeys.length

  const map = new Map<string, number>()
  for (const d of data) map.set(`${d.x}|${d.y}`, d.value)

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="heatmap"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {yKeys.map((yk, yi) => (
        <text
          key={`y-${yi}`}
          x={PAD_L - 8}
          y={PAD_T + yi * cellH + cellH / 2}
          fill="var(--fg-3)"
          fontSize={11}
          textAnchor="end"
          dominantBaseline="middle"
        >
          {String(yk)}
        </text>
      ))}

      {xKeys.map((xk, xi) => (
        <text
          key={`x-${xi}`}
          x={PAD_L + xi * cellW + cellW / 2}
          y={height - PAD_B + 16}
          fill="var(--fg-3)"
          fontSize={11}
          textAnchor="middle"
        >
          {String(xk)}
        </text>
      ))}

      {yKeys.map((yk, yi) =>
        xKeys.map((xk, xi) => {
          const v = map.get(`${xk}|${yk}`)
          if (v === undefined) return null
          const t = (v - vMin) / range
          const pct = Math.round(Math.max(0, Math.min(1, t)) * 100)
          const fill = `color-mix(in oklch, ${color} ${pct}%, transparent)`
          return (
            <rect
              key={`c-${xi}-${yi}`}
              x={PAD_L + xi * cellW + 1}
              y={PAD_T + yi * cellH + 1}
              width={Math.max(0, cellW - 2)}
              height={Math.max(0, cellH - 2)}
              rx={3}
              fill={fill}
            >
              <title>{`${xk}, ${yk}: ${v}`}</title>
            </rect>
          )
        }),
      )}
    </svg>
  )
})
