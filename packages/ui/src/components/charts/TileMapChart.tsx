import { forwardRef, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface TileDatum {
  id: string
  label: string
  value: number
  row: number
  col: number
}

export interface TileMapChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: TileDatum[]
  width?: number
  height?: number
  className?: string
  style?: CSSProperties
}

const LEGEND_H = 34

export const TileMapChart = forwardRef<SVGSVGElement, TileMapChartProps>(function TileMapChart(
  { data, width = 520, height = 320, className, style, ...rest },
  ref,
) {
  if (!data || data.length === 0) {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        data-vl-chart="tile-map"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const maxCol = Math.max(...data.map((d) => d.col))
  const maxRow = Math.max(...data.map((d) => d.row))
  const cols = maxCol + 1
  const rows = maxRow + 1

  const values = data.map((d) => d.value)
  const minV = Math.min(...values)
  const maxV = Math.max(...values)
  const span = maxV - minV || 1

  const pad = 8
  const gridH = height - LEGEND_H - pad
  const cell = Math.max(
    8,
    Math.min((width - pad * 2) / cols, (gridH - pad) / rows),
  )
  const tileGap = 4
  const tile = cell - tileGap
  const gridW = cell * cols
  const offsetX = (width - gridW) / 2
  const offsetY = pad

  // Sequential scale: 15%..90% accent mixed with bg-3.
  const fillFor = (v: number) => {
    const t = (v - minV) / span
    const p = Math.round(15 + t * 75)
    return `color-mix(in oklch, var(--ac) ${p}%, var(--bg-3))`
  }

  const legendY = height - LEGEND_H + 10
  const legendW = Math.min(220, width - pad * 2)
  const legendX = (width - legendW) / 2
  const stops = 8

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="tile-map"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {data.map((d, i) => {
        const x = offsetX + d.col * cell + tileGap / 2
        const y = offsetY + d.row * cell + tileGap / 2
        const abbr = d.label.length > 4 ? d.label.slice(0, 3).toUpperCase() : d.label
        const showValue = tile >= 28
        return (
          <g key={`tile-${i}`}>
            <rect x={x} y={y} width={tile} height={tile} rx={4} fill={fillFor(d.value)}>
              <title>{`${d.label}: ${d.value}`}</title>
            </rect>
            <text
              x={x + tile / 2}
              y={y + tile / 2 - (showValue ? 4 : 0)}
              fill="var(--fg)"
              fontSize={Math.min(12, Math.max(9, tile * 0.3))}
              fontWeight={600}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {abbr}
            </text>
            {showValue && (
              <text
                x={x + tile / 2}
                y={y + tile / 2 + 10}
                fill="var(--fg-3)"
                fontSize={9}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {d.value}
              </text>
            )}
          </g>
        )
      })}

      <g>
        {Array.from({ length: stops }, (_, i) => {
          const t = i / (stops - 1)
          const p = Math.round(15 + t * 75)
          const sw = legendW / stops
          return (
            <rect
              key={`leg-${i}`}
              x={legendX + i * sw}
              y={legendY}
              width={sw}
              height={8}
              fill={`color-mix(in oklch, var(--ac) ${p}%, var(--bg-3))`}
            />
          )
        })}
        <text x={legendX} y={legendY + 22} fill="var(--fg-3)" fontSize={10} textAnchor="start">
          {minV}
        </text>
        <text
          x={legendX + legendW}
          y={legendY + 22}
          fill="var(--fg-3)"
          fontSize={10}
          textAnchor="end"
        >
          {maxV}
        </text>
      </g>
    </svg>
  )
})
