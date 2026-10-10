import { SERIES_PALETTE as PALETTE } from './palette'
import { forwardRef, useId, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface TreemapChartDatum {
  label: string
  value: number
  color?: string
}

export interface TreemapChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: TreemapChartDatum[]
  width?: number
  height?: number
  padding?: number
  className?: string
  style?: CSSProperties
}

interface Rect {
  x: number
  y: number
  w: number
  h: number
}

interface Item {
  index: number
  value: number
}

function worstRatio(row: Item[], length: number, scale: number): number {
  if (row.length === 0) return Infinity
  const sum = row.reduce((s, i) => s + i.value, 0) * scale
  const rMin = Math.min(...row.map((i) => i.value * scale))
  const rMax = Math.max(...row.map((i) => i.value * scale))
  const l2 = length * length
  const sum2 = sum * sum
  return Math.max((l2 * rMax) / sum2, sum2 / (l2 * rMin))
}

function layoutRow(row: Item[], rect: Rect, horizontal: boolean, scale: number): { placed: { item: Item; rect: Rect }[]; remaining: Rect } {
  const sum = row.reduce((s, i) => s + i.value, 0) * scale
  const placed: { item: Item; rect: Rect }[] = []
  if (horizontal) {
    // row runs across the short side (width), each item takes full height-slice
    const rowH = sum / rect.w
    let x = rect.x
    for (const it of row) {
      const w = (it.value * scale) / rowH
      placed.push({ item: it, rect: { x, y: rect.y, w, h: rowH } })
      x += w
    }
    return { placed, remaining: { x: rect.x, y: rect.y + rowH, w: rect.w, h: rect.h - rowH } }
  } else {
    const rowW = sum / rect.h
    let y = rect.y
    for (const it of row) {
      const h = (it.value * scale) / rowW
      placed.push({ item: it, rect: { x: rect.x, y, w: rowW, h } })
      y += h
    }
    return { placed, remaining: { x: rect.x + rowW, y: rect.y, w: rect.w - rowW, h: rect.h } }
  }
}

function squarify(items: Item[], rect: Rect, scale: number): { item: Item; rect: Rect }[] {
  const result: { item: Item; rect: Rect }[] = []
  let remaining = { ...rect }
  let queue = [...items].sort((a, b) => b.value - a.value)

  while (queue.length > 0 && remaining.w > 0 && remaining.h > 0) {
    const horizontal = remaining.w >= remaining.h
    const length = horizontal ? remaining.w : remaining.h
    const row: Item[] = []
    let bestRatio = Infinity
    for (let i = 0; i < queue.length; i++) {
      const candidate = [...row, queue[i]]
      const ratio = worstRatio(candidate, length, scale)
      if (ratio <= bestRatio) {
        row.push(queue[i])
        bestRatio = ratio
      } else {
        break
      }
    }
    const { placed, remaining: newRem } = layoutRow(row, remaining, horizontal, scale)
    result.push(...placed)
    remaining = newRem
    queue = queue.slice(row.length)
  }
  return result
}

export const TreemapChart = forwardRef<SVGSVGElement, TreemapChartProps>(function TreemapChart(
  { data, width = 480, height = 300, padding = 2, className, style, ...rest },
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
        data-vl-chart="treemap"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const items: Item[] = data.map((d, i) => ({ index: i, value: Math.max(0, d.value) }))
  const total = items.reduce((s, i) => s + i.value, 0) || 1
  const area = width * height
  const scale = area / total

  const laidOut = squarify(items, { x: 0, y: 0, w: width, h: height }, scale)

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="treemap"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {laidOut.map(({ item, rect }, i) => {
        const d = data[item.index]
        const c = d.color ?? PALETTE[item.index % PALETTE.length]
        const px = rect.x + padding
        const py = rect.y + padding
        const pw = Math.max(0, rect.w - padding * 2)
        const ph = Math.max(0, rect.h - padding * 2)
        const showLabel = pw >= 40 && ph >= 24
        return (
          <g key={i}>
            <rect x={px} y={py} width={pw} height={ph} rx={3} fill={c}>
              <title>{`${d.label}: ${d.value}`}</title>
            </rect>
            {showLabel && (
              <>
                <text
                  x={px + 6}
                  y={py + 14}
                  fill="var(--fg)"
                  fontSize={12}
                  fontWeight={600}
                >
                  {d.label}
                </text>
                {ph >= 36 && (
                  <text x={px + 6} y={py + 28} fill="var(--fg-3)" fontSize={11}>
                    {d.value}
                  </text>
                )}
              </>
            )}
          </g>
        )
      })}
    </svg>
  )
})
