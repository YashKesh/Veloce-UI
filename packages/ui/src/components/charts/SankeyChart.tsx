import { SERIES_PALETTE as ACCENTS } from './palette'
import { forwardRef, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface SankeyNode {
  id: string
  label: string
}

export interface SankeyLink {
  source: string
  target: string
  value: number
}

export interface SankeyChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  nodes: SankeyNode[]
  links: SankeyLink[]
  width?: number
  height?: number
  className?: string
  style?: CSSProperties
}

const PAD = 14
const NODE_W = 14
const GAP = 8

export const SankeyChart = forwardRef<SVGSVGElement, SankeyChartProps>(function SankeyChart(
  { nodes, links, width = 520, height = 320, className, style, ...rest },
  ref,
) {
  if (!nodes || nodes.length === 0 || !links || links.length === 0) {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        data-vl-chart="sankey"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const idx = new Map<string, number>()
  nodes.forEach((n, i) => idx.set(n.id, i))
  const valid = links.filter((l) => idx.has(l.source) && idx.has(l.target) && l.value > 0)

  // Depth = longest path from any root (node with no incoming links).
  const incoming = new Map<string, SankeyLink[]>()
  const outgoing = new Map<string, SankeyLink[]>()
  nodes.forEach((n) => {
    incoming.set(n.id, [])
    outgoing.set(n.id, [])
  })
  valid.forEach((l) => {
    outgoing.get(l.source)!.push(l)
    incoming.get(l.target)!.push(l)
  })

  const depth = new Map<string, number>()
  const computeDepth = (id: string, seen: Set<string>): number => {
    if (depth.has(id)) return depth.get(id)!
    const ins = incoming.get(id)!
    if (ins.length === 0 || seen.has(id)) {
      depth.set(id, 0)
      return 0
    }
    const next = new Set(seen)
    next.add(id)
    const d = 1 + Math.max(...ins.map((l) => computeDepth(l.source, next)))
    depth.set(id, d)
    return d
  }
  nodes.forEach((n) => computeDepth(n.id, new Set()))

  const maxDepth = Math.max(...nodes.map((n) => depth.get(n.id)!))
  const columns: SankeyNode[][] = Array.from({ length: maxDepth + 1 }, () => [])
  nodes.forEach((n) => columns[depth.get(n.id)!].push(n))

  const innerH = height - PAD * 2
  const colSpan = maxDepth > 0 ? (width - PAD * 2 - NODE_W) / maxDepth : 0

  const nodeValue = (id: string) => {
    const inSum = incoming.get(id)!.reduce((s, l) => s + l.value, 0)
    const outSum = outgoing.get(id)!.reduce((s, l) => s + l.value, 0)
    return Math.max(inSum, outSum, 0)
  }

  // Scale: tallest column drives value->pixel ratio so everything fits.
  let valuePerPx = 0
  columns.forEach((col) => {
    const sum = col.reduce((s, n) => s + nodeValue(n.id), 0)
    const avail = innerH - GAP * Math.max(0, col.length - 1)
    if (sum > 0) valuePerPx = Math.max(valuePerPx, sum / Math.max(1, avail))
  })
  if (valuePerPx === 0) valuePerPx = 1

  interface Box {
    x: number
    y: number
    h: number
  }
  const box = new Map<string, Box>()
  columns.forEach((col, c) => {
    const heights = col.map((n) => Math.max(2, nodeValue(n.id) / valuePerPx))
    const totalH = heights.reduce((s, h) => s + h, 0) + GAP * Math.max(0, col.length - 1)
    let y = PAD + (innerH - totalH) / 2
    const x = PAD + c * colSpan
    col.forEach((n, i) => {
      box.set(n.id, { x, y, h: heights[i] })
      y += heights[i] + GAP
    })
  })

  // Track used offset at each node's edges for stacking ribbons.
  const outOff = new Map<string, number>()
  const inOff = new Map<string, number>()

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="sankey"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {valid.map((l, i) => {
        const sb = box.get(l.source)!
        const tb = box.get(l.target)!
        const w = l.value / valuePerPx
        const so = outOff.get(l.source) ?? 0
        const to = inOff.get(l.target) ?? 0
        outOff.set(l.source, so + w)
        inOff.set(l.target, to + w)
        const x0 = sb.x + NODE_W
        const x1 = tb.x
        const y0 = sb.y + so + w / 2
        const y1 = tb.y + to + w / 2
        const mx = (x0 + x1) / 2
        const d = `M${x0} ${y0}C${mx} ${y0} ${mx} ${y1} ${x1} ${y1}`
        const color = ACCENTS[idx.get(l.source)! % ACCENTS.length]
        return (
          <path
            key={`link-${i}`}
            d={d}
            stroke={color}
            strokeWidth={Math.max(1, w)}
            fill="none"
            strokeOpacity={0.4}
          >
            <title>{`${l.source} -> ${l.target}: ${l.value}`}</title>
          </path>
        )
      })}

      {nodes.map((n, i) => {
        const b = box.get(n.id)!
        const isLast = depth.get(n.id)! === maxDepth
        return (
          <g key={`node-${i}`}>
            <rect x={b.x} y={b.y} width={NODE_W} height={b.h} rx={2} fill="var(--ac)">
              <title>{`${n.label}: ${nodeValue(n.id)}`}</title>
            </rect>
            <text
              x={isLast ? b.x - 6 : b.x + NODE_W + 6}
              y={b.y + b.h / 2}
              fill="var(--fg)"
              fontSize={11}
              textAnchor={isLast ? 'end' : 'start'}
              dominantBaseline="middle"
            >
              {n.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
})
