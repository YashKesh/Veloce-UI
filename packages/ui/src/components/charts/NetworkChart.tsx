import { SERIES_PALETTE as PALETTE } from './palette'
import { forwardRef, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface NetworkNode {
  id: string
  label: string
  group?: string
  value?: number
}

export interface NetworkLink {
  source: string
  target: string
  value?: number
}

export interface NetworkChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  nodes: NetworkNode[]
  links: NetworkLink[]
  width?: number
  height?: number
  className?: string
  style?: CSSProperties
}

export const NetworkChart = forwardRef<SVGSVGElement, NetworkChartProps>(function NetworkChart(
  { nodes, links, width = 520, height = 320, className, style, ...rest },
  ref,
) {
  if (!nodes || nodes.length === 0) {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        data-vl-chart="network"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const idx = new Map<string, number>()
  nodes.forEach((n, i) => idx.set(n.id, i))
  const validLinks = (links ?? []).filter((l) => idx.has(l.source) && idx.has(l.target))

  // Degree for radius fallback.
  const degree = new Map<string, number>()
  nodes.forEach((n) => degree.set(n.id, 0))
  validLinks.forEach((l) => {
    degree.set(l.source, (degree.get(l.source) ?? 0) + 1)
    degree.set(l.target, (degree.get(l.target) ?? 0) + 1)
  })

  // Deterministic layout: concentric circles grouped by `group`.
  const groups: string[] = []
  nodes.forEach((n) => {
    const g = n.group ?? '_'
    if (!groups.includes(g)) groups.push(g)
  })
  const groupIndex = new Map<string, number>()
  groups.forEach((g, i) => groupIndex.set(g, i))

  const ox = width / 2
  const oy = height / 2
  const maxR = Math.min(width, height) / 2 - 36
  const ringCount = groups.length
  const byGroup = new Map<string, NetworkNode[]>()
  groups.forEach((g) => byGroup.set(g, []))
  nodes.forEach((n) => byGroup.get(n.group ?? '_')!.push(n))

  const pos = new Map<string, { x: number; y: number }>()
  groups.forEach((g, gi) => {
    const members = byGroup.get(g)!
    const r = ringCount === 1 ? maxR : maxR * ((gi + 1) / ringCount)
    const count = members.length
    members.forEach((m, mi) => {
      const a = (mi / Math.max(1, count)) * Math.PI * 2 - Math.PI / 2 + gi * 0.35
      pos.set(m.id, { x: ox + r * Math.cos(a), y: oy + r * Math.sin(a) })
    })
  })

  const radiusFor = (n: NetworkNode) => {
    const base = n.value != null ? n.value : (degree.get(n.id) ?? 0) + 1
    return Math.max(4, Math.min(16, 4 + Math.sqrt(base) * 2.4))
  }

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="network"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {validLinks.map((l, i) => {
        const a = pos.get(l.source)!
        const b = pos.get(l.target)!
        return (
          <line
            key={`edge-${i}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="var(--line-2)"
            strokeWidth={Math.max(1, l.value ?? 1)}
          />
        )
      })}

      {nodes.map((n, i) => {
        const p = pos.get(n.id)!
        const r = radiusFor(n)
        const color = PALETTE[(groupIndex.get(n.group ?? '_') ?? 0) % PALETTE.length]
        const right = p.x >= ox
        return (
          <g key={`node-${i}`}>
            <circle cx={p.x} cy={p.y} r={r} fill={color} stroke="var(--bg-1)" strokeWidth={1}>
              <title>{`${n.label}${n.value != null ? `: ${n.value}` : ''}`}</title>
            </circle>
            <text
              x={right ? p.x + r + 4 : p.x - r - 4}
              y={p.y}
              fill="var(--fg)"
              fontSize={10}
              textAnchor={right ? 'start' : 'end'}
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
