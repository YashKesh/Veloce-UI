import { SERIES_PALETTE as PALETTE } from './palette'
import { forwardRef, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface MekkoSegment {
  label: string
  value: number
  color?: string
}

export interface MekkoColumn {
  label: string
  segments: MekkoSegment[]
}

export interface MarimekkoChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  columns: MekkoColumn[]
  width?: number
  height?: number
  className?: string
  style?: CSSProperties
}

export const MarimekkoChart = forwardRef<SVGSVGElement, MarimekkoChartProps>(function MarimekkoChart(
  { columns, width = 480, height = 300, className, style, ...rest },
  ref,
) {
  if (!columns || columns.length === 0) {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        data-vl-chart="marimekko"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const PAD_T = 8
  const PAD_B = 24
  const gap = 2
  const innerW = width
  const innerH = height - PAD_T - PAD_B

  const colTotals = columns.map((c) => c.segments.reduce((s, seg) => s + Math.max(0, seg.value), 0))
  const grand = colTotals.reduce((s, v) => s + v, 0) || 1

  let xCursor = 0
  const totalGap = gap * (columns.length - 1)
  const usableW = innerW - totalGap

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="marimekko"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {columns.map((col, ci) => {
        const colTotal = colTotals[ci] || 1
        const colW = (colTotal / grand) * usableW
        const x = xCursor
        xCursor += colW + gap
        let yCursor = PAD_T
        return (
          <g key={ci}>
            {col.segments.map((seg, si) => {
              const frac = Math.max(0, seg.value) / colTotal
              const h = frac * innerH
              const y = yCursor
              yCursor += h
              const color = seg.color ?? PALETTE[si % PALETTE.length]
              const pct = Math.round(frac * 100)
              const showPct = h >= 16 && colW >= 28
              return (
                <g key={si}>
                  <rect x={x} y={y} width={colW} height={Math.max(0, h - 0.5)} fill={color} stroke="var(--bg-1)" strokeWidth={0.5}>
                    <title>{`${col.label} · ${seg.label}: ${seg.value} (${pct}%)`}</title>
                  </rect>
                  {showPct && (
                    <text
                      x={x + colW / 2}
                      y={y + h / 2}
                      fill="var(--fg)"
                      fontSize={10}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {`${pct}%`}
                    </text>
                  )}
                </g>
              )
            })}
            <text
              x={x + colW / 2}
              y={height - PAD_B + 16}
              fill="var(--fg-3)"
              fontSize={11}
              textAnchor="middle"
            >
              {col.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
})
