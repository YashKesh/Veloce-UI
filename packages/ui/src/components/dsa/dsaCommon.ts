/**
 * Shared types + layout math for Data-Structure visual components.
 * Zero-dep. All math is pure functions suitable for SSR.
 */

export type DsaSize = 'sm' | 'md' | 'lg'

export const SIZE_PX: Record<DsaSize, { node: number; font: number; gap: number }> = {
  sm: { node: 32, font: 12, gap: 20 },
  md: { node: 40, font: 14, gap: 28 },
  lg: { node: 52, font: 16, gap: 36 },
}

/** Standard colors used across every DSA visual (OKLCH-themed). */
export const DSA_COLORS = {
  nodeFill: 'var(--bg-2)',
  nodeStroke: 'var(--line-2)',
  nodeText: 'var(--fg)',
  edge: 'var(--fg-3)',
  highlight: 'var(--ac)',
  highlightFill: 'color-mix(in oklch, var(--ac) 20%, var(--bg-1))',
  visited: 'color-mix(in oklch, var(--ok) 25%, var(--bg-1))',
  visitedStroke: 'var(--ok)',
}

/* ─── Tree layout (Reingold–Tilford, simplified) ────────────────────────── */

export interface TreeNodeInput<T> {
  value: T
  left?: TreeNodeInput<T> | null
  right?: TreeNodeInput<T> | null
}

export interface LaidTreeNode<T> {
  value: T
  x: number
  y: number
  depth: number
  parent?: LaidTreeNode<T>
  left?: LaidTreeNode<T>
  right?: LaidTreeNode<T>
}

export interface TreeLayoutOptions {
  xGap?: number
  yGap?: number
  nodeSize?: number
  originX?: number
  originY?: number
}

/**
 * Simple O(n) tree layout: in-order x-position (ensures no overlaps for binary trees),
 * depth-based y-position. Not full Reingold–Tilford (which minimises width) but good
 * enough for pedagogical trees up to a few dozen nodes.
 */
export function layoutBinaryTree<T>(
  root: TreeNodeInput<T> | null,
  opts: TreeLayoutOptions = {},
): { nodes: LaidTreeNode<T>[]; width: number; height: number } {
  const xGap = opts.xGap ?? 56
  const yGap = opts.yGap ?? 70
  const originX = opts.originX ?? 0
  const originY = opts.originY ?? 0
  if (!root) return { nodes: [], width: 0, height: 0 }

  const nodes: LaidTreeNode<T>[] = []
  let col = 0
  let maxDepth = 0

  function walk(n: TreeNodeInput<T>, depth: number, parent?: LaidTreeNode<T>): LaidTreeNode<T> {
    const laid: LaidTreeNode<T> = { value: n.value, x: 0, y: originY + depth * yGap, depth, parent }
    nodes.push(laid)
    maxDepth = Math.max(maxDepth, depth)
    if (n.left) laid.left = walk(n.left, depth + 1, laid)
    laid.x = originX + col * xGap
    col += 1
    if (n.right) laid.right = walk(n.right, depth + 1, laid)
    return laid
  }
  walk(root, 0)

  const width = col * xGap
  const height = (maxDepth + 1) * yGap
  return { nodes, width, height }
}

/* ─── Graph layout (circular / radial) ──────────────────────────────────── */

export interface GraphNodeInput {
  id: string
  label?: string
  /** Explicit coordinates (if provided, skips auto-layout). */
  x?: number
  y?: number
}

export interface GraphEdgeInput {
  from: string
  to: string
  weight?: number | string
  directed?: boolean
}

export interface LaidGraphNode extends GraphNodeInput {
  x: number
  y: number
}

/** Position nodes evenly around a circle. Deterministic, SSR-safe. */
export function circularGraphLayout(
  nodes: GraphNodeInput[],
  opts: { radius?: number; cx?: number; cy?: number } = {},
): LaidGraphNode[] {
  const r = opts.radius ?? 110
  const cx = opts.cx ?? 160
  const cy = opts.cy ?? 160
  const n = nodes.length
  if (n === 0) return []
  if (n === 1) return [{ ...nodes[0], x: nodes[0].x ?? cx, y: nodes[0].y ?? cy }]
  return nodes.map((node, i) => {
    if (node.x != null && node.y != null) return { ...node, x: node.x, y: node.y }
    const theta = (i / n) * Math.PI * 2 - Math.PI / 2
    return { ...node, x: cx + r * Math.cos(theta), y: cy + r * Math.sin(theta) }
  })
}

/** Position nodes in topologically-sorted horizontal layers (good for DAGs). */
export function layeredGraphLayout(
  nodes: GraphNodeInput[],
  edges: GraphEdgeInput[],
  opts: { originX?: number; originY?: number; xGap?: number; yGap?: number } = {},
): LaidGraphNode[] {
  const originX = opts.originX ?? 60
  const originY = opts.originY ?? 60
  const xGap = opts.xGap ?? 120
  const yGap = opts.yGap ?? 80

  const indeg = new Map<string, number>(nodes.map((n) => [n.id, 0]))
  const out = new Map<string, string[]>(nodes.map((n) => [n.id, []]))
  for (const e of edges) {
    indeg.set(e.to, (indeg.get(e.to) ?? 0) + 1)
    out.get(e.from)?.push(e.to)
  }

  const layer = new Map<string, number>()
  const queue: string[] = []
  for (const [id, d] of indeg) if (d === 0) { queue.push(id); layer.set(id, 0) }
  while (queue.length) {
    const id = queue.shift()!
    const l = layer.get(id)!
    for (const to of out.get(id) ?? []) {
      layer.set(to, Math.max(layer.get(to) ?? 0, l + 1))
      const nd = (indeg.get(to) ?? 1) - 1
      indeg.set(to, nd)
      if (nd === 0) queue.push(to)
    }
  }

  // Group by layer, assign positions.
  const byLayer = new Map<number, string[]>()
  for (const n of nodes) {
    const l = layer.get(n.id) ?? 0
    if (!byLayer.has(l)) byLayer.set(l, [])
    byLayer.get(l)!.push(n.id)
  }
  const pos = new Map<string, { x: number; y: number }>()
  for (const [l, ids] of byLayer) {
    ids.forEach((id, i) => {
      pos.set(id, { x: originX + l * xGap, y: originY + i * yGap })
    })
  }
  return nodes.map((n) => {
    const p = pos.get(n.id) ?? { x: originX, y: originY }
    return { ...n, x: n.x ?? p.x, y: n.y ?? p.y }
  })
}

/* ─── Arrow helpers for SVG edges ───────────────────────────────────────── */

/** Shorten a line segment at both ends so arrowheads don't overlap node circles. */
export function shrinkSegment(
  x1: number, y1: number, x2: number, y2: number, rStart: number, rEnd: number,
): [number, number, number, number] {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const ux = dx / len
  const uy = dy / len
  return [x1 + ux * rStart, y1 + uy * rStart, x2 - ux * rEnd, y2 - uy * rEnd]
}
