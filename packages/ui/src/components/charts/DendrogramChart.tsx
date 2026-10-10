import { forwardRef, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface DendroNode {
  name: string
  children?: DendroNode[]
}

export interface DendrogramChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: DendroNode
  width?: number
  height?: number
  className?: string
  style?: CSSProperties
}

interface Positioned {
  name: string
  depth: number
  x: number
  y: number
  isLeaf: boolean
  parent: Positioned | null
}

export const DendrogramChart = forwardRef<SVGSVGElement, DendrogramChartProps>(function DendrogramChart(
  { data, width = 520, height = 300, className, style, ...rest },
  ref,
) {
  if (!data) {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        data-vl-chart="dendrogram"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const PAD_L = 16
  const PAD_R = 90
  const PAD_T = 16
  const PAD_B = 16
  const innerW = width - PAD_L - PAD_R
  const innerH = height - PAD_T - PAD_B

  // Collect depth range and leaf count.
  let maxDepth = 0
  let leafCount = 0
  function measure(node: DendroNode, d: number) {
    maxDepth = Math.max(maxDepth, d)
    if (!node.children || node.children.length === 0) {
      leafCount++
      return
    }
    node.children.forEach((c) => measure(c, d + 1))
  }
  measure(data, 0)
  const depthSpan = Math.max(1, maxDepth)
  const leaves = Math.max(1, leafCount)

  const xFor = (d: number) => PAD_L + (d / depthSpan) * innerW
  let leafIndex = 0
  const nodes: Positioned[] = []

  function place(node: DendroNode, d: number, parent: Positioned | null): Positioned {
    const isLeaf = !node.children || node.children.length === 0
    const x = xFor(d)
    let y: number
    if (isLeaf) {
      y = PAD_T + (leaves === 1 ? innerH / 2 : (leafIndex / (leaves - 1)) * innerH)
      leafIndex++
      const self: Positioned = { name: node.name, depth: d, x, y, isLeaf, parent }
      nodes.push(self)
      return self
    }
    const self: Positioned = { name: node.name, depth: d, x, y: 0, isLeaf, parent }
    nodes.push(self)
    const kids = (node.children ?? []).map((c) => place(c, d + 1, self))
    self.y = kids.reduce((s, k) => s + k.y, 0) / kids.length
    return self
  }
  place(data, 0, null)

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="dendrogram"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {nodes.map((n, i) =>
        n.parent ? (
          <path
            key={`e-${i}`}
            d={`M${n.parent.x} ${n.parent.y}L${n.parent.x} ${n.y}L${n.x} ${n.y}`}
            fill="none"
            stroke="var(--line-2)"
            strokeWidth={1.5}
          />
        ) : null,
      )}
      {nodes.map((n, i) => (
        <g key={`n-${i}`}>
          <circle cx={n.x} cy={n.y} r={n.isLeaf ? 3 : 3.5} fill="var(--ac)">
            <title>{n.name}</title>
          </circle>
          {n.isLeaf && (
            <text x={n.x + 8} y={n.y} fill="var(--fg-2)" fontSize={11} dominantBaseline="middle">
              {n.name}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
})
