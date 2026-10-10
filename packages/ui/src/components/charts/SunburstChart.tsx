import { SERIES_PALETTE as PALETTE } from './palette'
import { forwardRef, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface SunburstNode {
  name: string
  value?: number
  color?: string
  children?: SunburstNode[]
}

export interface SunburstChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: SunburstNode
  size?: number
  className?: string
  style?: CSSProperties
}

interface Arc {
  name: string
  value: number
  depth: number
  a0: number
  a1: number
  color: string
}

/** Sum leaf values up the tree. */
function nodeValue(node: SunburstNode): number {
  if (node.children && node.children.length > 0) {
    return node.children.reduce((s, c) => s + nodeValue(c), 0)
  }
  return Math.max(0, node.value ?? 0)
}

function lighten(base: string, depth: number): string {
  if (depth <= 1) return base
  const pct = Math.max(25, 100 - depth * 22)
  return `color-mix(in oklch, ${base} ${pct}%, var(--bg-3))`
}

/** Ring sector between two radii. */
function ringSector(ox: number, oy: number, rIn: number, rOut: number, a0: number, a1: number): string {
  const x0 = ox + rOut * Math.cos(a0)
  const y0 = oy + rOut * Math.sin(a0)
  const x1 = ox + rOut * Math.cos(a1)
  const y1 = oy + rOut * Math.sin(a1)
  const x2 = ox + rIn * Math.cos(a1)
  const y2 = oy + rIn * Math.sin(a1)
  const x3 = ox + rIn * Math.cos(a0)
  const y3 = oy + rIn * Math.sin(a0)
  const large = a1 - a0 > Math.PI ? 1 : 0
  return `M${x0} ${y0}A${rOut} ${rOut} 0 ${large} 1 ${x1} ${y1}L${x2} ${y2}A${rIn} ${rIn} 0 ${large} 0 ${x3} ${y3}Z`
}

export const SunburstChart = forwardRef<SVGSVGElement, SunburstChartProps>(function SunburstChart(
  { data, size = 300, className, style, ...rest },
  ref,
) {
  if (!data || !data.children || data.children.length === 0) {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        data-vl-chart="sunburst"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const ox = size / 2
  const oy = size / 2
  const pad = 6
  const rMax = size / 2 - pad

  // Determine max depth to size the rings.
  function maxDepth(node: SunburstNode, d: number): number {
    if (!node.children || node.children.length === 0) return d
    return Math.max(...node.children.map((c) => maxDepth(c, d + 1)))
  }
  const depth = Math.max(1, maxDepth(data, 0))
  const ringW = rMax / depth

  const arcs: Arc[] = []
  function walk(node: SunburstNode, d: number, a0: number, a1: number, branchColor: string) {
    if (d > 0) {
      arcs.push({ name: node.name, value: nodeValue(node), depth: d, a0, a1, color: lighten(branchColor, d) })
    }
    if (!node.children || node.children.length === 0) return
    const total = node.children.reduce((s, c) => s + nodeValue(c), 0) || 1
    let acc = a0
    node.children.forEach((c, i) => {
      const span = (nodeValue(c) / total) * (a1 - a0)
      const col = d === 0 ? (c.color ?? PALETTE[i % PALETTE.length]) : branchColor
      walk(c, d + 1, acc, acc + span, col)
      acc += span
    })
  }
  walk(data, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2, PALETTE[0])

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      data-vl-chart="sunburst"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {arcs.map((arc, i) => {
        const rIn = (arc.depth - 1) * ringW
        const rOut = arc.depth * ringW
        if (arc.a1 - arc.a0 < 0.004) return null
        return (
          <path key={i} d={ringSector(ox, oy, rIn, rOut, arc.a0, arc.a1)} fill={arc.color} stroke="var(--bg-1)" strokeWidth={1}>
            <title>{`${arc.name}: ${arc.value}`}</title>
          </path>
        )
      })}
    </svg>
  )
})
