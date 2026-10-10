import { SERIES_PALETTE as PALETTE } from './palette'
import { forwardRef, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface WaffleChartDatum {
  label: string
  value: number
  color?: string
}

export interface WaffleChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: WaffleChartDatum[]
  rows?: number
  cols?: number
  size?: number
  className?: string
  style?: CSSProperties
}

export const WaffleChart = forwardRef<SVGSVGElement, WaffleChartProps>(function WaffleChart(
  { data, rows = 10, cols = 10, size = 300, className, style, ...rest },
  ref,
) {
  if (!data || data.length === 0) {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        data-vl-chart="waffle"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const total = data.reduce((s, d) => s + Math.max(0, d.value), 0) || 1
  const totalCells = rows * cols

  // Distribute cells via largest-remainder so the grid sums exactly.
  const raw = data.map((d) => (Math.max(0, d.value) / total) * totalCells)
  const floored = raw.map((r) => Math.floor(r))
  let used = floored.reduce((s, v) => s + v, 0)
  const remainders = raw
    .map((r, i) => ({ i, frac: r - Math.floor(r) }))
    .sort((a, b) => b.frac - a.frac)
  let ri = 0
  while (used < totalCells && ri < remainders.length) {
    floored[remainders[ri].i]++
    used++
    ri++
  }

  // Build a flat colour map per cell.
  const cellColor: string[] = []
  data.forEach((d, i) => {
    const c = d.color ?? PALETTE[i % PALETTE.length]
    for (let k = 0; k < floored[i]; k++) cellColor.push(c)
  })

  const legendH = Math.min(data.length, 6) * 16 + 8
  const gridSize = size - legendH
  const gap = Math.max(1.5, gridSize * 0.012)
  const cell = (gridSize - gap * (cols - 1)) / cols
  const rx = Math.max(1.5, cell * 0.18)

  const cells: { x: number; y: number; color: string }[] = []
  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < cols; col++) {
      // Fill bottom-up, left-to-right so blocks read like a filling container.
      const idx = r * cols + col
      const color = cellColor[idx] ?? 'var(--bg-3)'
      const x = col * (cell + gap)
      const y = (rows - 1 - r) * (cell + gap)
      cells.push({ x, y, color })
    }
  }

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      data-vl-chart="waffle"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {cells.map((c, i) => (
        <rect key={i} x={c.x} y={c.y} width={cell} height={cell} rx={rx} fill={c.color} />
      ))}
      {data.slice(0, 6).map((d, i) => {
        const pct = Math.round((Math.max(0, d.value) / total) * 100)
        const ly = gridSize + 10 + i * 16
        return (
          <g key={`lg-${i}`}>
            <rect x={0} y={ly} width={10} height={10} rx={2} fill={d.color ?? PALETTE[i % PALETTE.length]} />
            <text x={16} y={ly + 9} fill="var(--fg-2)" fontSize={11}>
              {`${d.label} — ${pct}%`}
            </text>
          </g>
        )
      })}
    </svg>
  )
})
