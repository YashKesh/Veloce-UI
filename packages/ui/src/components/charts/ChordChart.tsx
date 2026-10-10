import { SERIES_PALETTE as PALETTE } from './palette'
import { forwardRef, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface ChordChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  matrix: number[][]
  labels: string[]
  size?: number
  colors?: string[]
  className?: string
  style?: CSSProperties
}

function polar(ox: number, oy: number, r: number, a: number) {
  return { x: ox + r * Math.cos(a), y: oy + r * Math.sin(a) }
}

function arcPath(ox: number, oy: number, r: number, a0: number, a1: number): string {
  const p0 = polar(ox, oy, r, a0)
  const p1 = polar(ox, oy, r, a1)
  const large = a1 - a0 > Math.PI ? 1 : 0
  return `M${p0.x} ${p0.y}A${r} ${r} 0 ${large} 1 ${p1.x} ${p1.y}`
}

export const ChordChart = forwardRef<SVGSVGElement, ChordChartProps>(function ChordChart(
  { matrix, labels, size = 320, colors, className, style, ...rest },
  ref,
) {
  const n = matrix?.length ?? 0
  const total = matrix ? matrix.reduce((s, row) => s + row.reduce((a, b) => a + Math.max(0, b), 0), 0) : 0

  if (!matrix || n === 0 || total <= 0) {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        data-vl-chart="chord"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const pal = colors && colors.length > 0 ? colors : PALETTE
  const ox = size / 2
  const oy = size / 2
  const rOuter = size / 2 - 28
  const rArc = rOuter + 6
  const rRibbon = rOuter - 2
  const gap = 0.04 // radians between groups

  const rowSums = matrix.map((row) => row.reduce((s, v) => s + Math.max(0, v), 0))
  const grandTotal = rowSums.reduce((s, v) => s + v, 0) || 1
  const totalGap = gap * n
  const available = Math.PI * 2 - totalGap

  // Start angle per group.
  const groupStart: number[] = []
  let acc = -Math.PI / 2
  for (let i = 0; i < n; i++) {
    groupStart[i] = acc
    acc += (rowSums[i] / grandTotal) * available + gap
  }
  const groupAngle = (i: number) => (rowSums[i] / grandTotal) * available

  // Sub-angle offsets within each group for each ribbon end.
  const subOff: number[] = new Array(n).fill(0)
  const endOff = (i: number, cellValue: number) => {
    const a0 = groupStart[i] + (subOff[i] / Math.max(1, rowSums[i])) * groupAngle(i)
    subOff[i] += Math.max(0, cellValue)
    const a1 = groupStart[i] + (subOff[i] / Math.max(1, rowSums[i])) * groupAngle(i)
    return { a0, a1 }
  }

  const ribbons: { i: number; j: number; a0: number; a1: number; b0: number; b1: number; value: number }[] = []
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      const v = Math.max(0, matrix[i][j]) + (i === j ? 0 : Math.max(0, matrix[j][i]))
      if (v <= 0) continue
      const si = endOff(i, Math.max(0, matrix[i][j]))
      const sj = i === j ? si : endOff(j, Math.max(0, matrix[j][i]))
      ribbons.push({ i, j, a0: si.a0, a1: si.a1, b0: sj.a0, b1: sj.a1, value: v })
    }
  }

  const ribbonPath = (a0: number, a1: number, b0: number, b1: number): string => {
    const p0 = polar(ox, oy, rRibbon, a0)
    const p1 = polar(ox, oy, rRibbon, a1)
    const q0 = polar(ox, oy, rRibbon, b0)
    const q1 = polar(ox, oy, rRibbon, b1)
    const largeA = a1 - a0 > Math.PI ? 1 : 0
    const largeB = b1 - b0 > Math.PI ? 1 : 0
    return (
      `M${p0.x} ${p0.y}` +
      `A${rRibbon} ${rRibbon} 0 ${largeA} 1 ${p1.x} ${p1.y}` +
      `Q${ox} ${oy} ${q0.x} ${q0.y}` +
      `A${rRibbon} ${rRibbon} 0 ${largeB} 1 ${q1.x} ${q1.y}` +
      `Q${ox} ${oy} ${p0.x} ${p0.y}Z`
    )
  }

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      data-vl-chart="chord"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {ribbons.map((r, k) => (
        <path
          key={`ribbon-${k}`}
          d={ribbonPath(r.a0, r.a1, r.b0, r.b1)}
          fill={pal[r.i % pal.length]}
          fillOpacity={0.45}
          stroke="none"
        >
          <title>{`${labels[r.i] ?? r.i} ↔ ${labels[r.j] ?? r.j}: ${r.value}`}</title>
        </path>
      ))}

      {Array.from({ length: n }, (_, i) => {
        const a0 = groupStart[i]
        const a1 = a0 + groupAngle(i)
        const mid = (a0 + a1) / 2
        const lp = polar(ox, oy, rArc + 12, mid)
        const anchor = Math.cos(mid) > 0.01 ? 'start' : Math.cos(mid) < -0.01 ? 'end' : 'middle'
        return (
          <g key={`group-${i}`}>
            <path
              d={arcPath(ox, oy, rArc, a0, a1)}
              stroke={pal[i % pal.length]}
              strokeWidth={8}
              fill="none"
              strokeLinecap="butt"
            >
              <title>{`${labels[i] ?? i}: ${rowSums[i]}`}</title>
            </path>
            <text
              x={lp.x}
              y={lp.y}
              fill="var(--fg)"
              fontSize={11}
              textAnchor={anchor}
              dominantBaseline="middle"
            >
              {labels[i] ?? String(i)}
            </text>
          </g>
        )
      })}
    </svg>
  )
})
