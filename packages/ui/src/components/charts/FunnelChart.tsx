import { forwardRef, useId, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface FunnelChartDatum {
  label: string
  value: number
  color?: string
}

export interface FunnelChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: FunnelChartDatum[]
  width?: number
  height?: number
  gap?: number
  className?: string
  style?: CSSProperties
}

const PALETTE = [
  'var(--ac)',
  'color-mix(in oklch, var(--ac) 70%, var(--bg-3))',
  'color-mix(in oklch, var(--ac) 50%, var(--bg-3))',
  'color-mix(in oklch, var(--ac) 35%, var(--bg-3))',
  'color-mix(in oklch, var(--ac) 20%, var(--bg-3))',
]

export const FunnelChart = forwardRef<SVGSVGElement, FunnelChartProps>(function FunnelChart(
  { data, width = 420, height = 260, gap = 6, className, style, ...rest },
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
        data-vl-chart="funnel"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const PAD_T = 8
  const PAD_B = 8
  const LABEL_W = 90
  const VALUE_W = 56
  const innerH = height - PAD_T - PAD_B
  const n = data.length
  const stageH = (innerH - gap * (n - 1)) / n

  const maxVal = Math.max(...data.map((d) => d.value), 1)
  const centerX = LABEL_W + (width - LABEL_W - VALUE_W) / 2
  const maxHalf = (width - LABEL_W - VALUE_W) / 2 - 4

  const widthFor = (v: number) => (v / maxVal) * maxHalf

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="funnel"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {data.map((d, i) => {
        const y0 = PAD_T + i * (stageH + gap)
        const y1 = y0 + stageH
        const w0 = widthFor(d.value)
        const next = data[i + 1]
        const w1 = next ? widthFor(next.value) : w0 * 0.9
        const c = d.color ?? PALETTE[i % PALETTE.length]
        const path = `M ${centerX - w0} ${y0} L ${centerX + w0} ${y0} L ${centerX + w1} ${y1} L ${centerX - w1} ${y1} Z`
        return (
          <g key={i}>
            <path d={path} fill={c}>
              <title>{`${d.label}: ${d.value}`}</title>
            </path>
            <text
              x={LABEL_W - 10}
              y={y0 + stageH / 2}
              fill="var(--fg)"
              fontSize={12}
              textAnchor="end"
              dominantBaseline="middle"
            >
              {d.label}
            </text>
            <text
              x={width - VALUE_W + 10}
              y={y0 + stageH / 2}
              fill="var(--fg-3)"
              fontSize={12}
              textAnchor="start"
              dominantBaseline="middle"
            >
              {d.value}
            </text>
          </g>
        )
      })}
    </svg>
  )
})
