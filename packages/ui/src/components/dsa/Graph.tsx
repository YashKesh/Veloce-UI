import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { cx } from '../../utils/cx'
import {
  DSA_COLORS,
  SIZE_PX,
  circularGraphLayout,
  layeredGraphLayout,
  shrinkSegment,
  type DsaSize,
  type GraphEdgeInput,
  type GraphNodeInput,
} from './dsaCommon'

export type GraphLayout = 'circular' | 'layered'
export type GraphAlgorithm = 'bfs' | 'dfs'

export interface GraphHandle {
  highlight: (ids: string[] | null) => void
  run: (algorithm: GraphAlgorithm, start: string, intervalMs?: number) => Promise<string[]>
  stop: () => void
}

export interface GraphProps {
  nodes: GraphNodeInput[]
  edges: GraphEdgeInput[]
  /** Default edge direction: directed draws arrowheads; undirected omits them. */
  directed?: boolean
  layout?: GraphLayout
  size?: DsaSize
  /** Current highlighted node ids (controlled). */
  highlighted?: string[]
  /** Overall SVG size in px. */
  width?: number
  height?: number
  onNodeClick?: (id: string) => void
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

function buildAdj(edges: GraphEdgeInput[], directed: boolean): Map<string, string[]> {
  const m = new Map<string, string[]>()
  for (const e of edges) {
    if (!m.has(e.from)) m.set(e.from, [])
    m.get(e.from)!.push(e.to)
    const asDirected = e.directed ?? directed
    if (!asDirected) {
      if (!m.has(e.to)) m.set(e.to, [])
      m.get(e.to)!.push(e.from)
    }
  }
  return m
}

export const Graph = forwardRef<GraphHandle, GraphProps>(function Graph(
  {
    nodes,
    edges,
    directed = false,
    layout = 'circular',
    size = 'md',
    highlighted: highlightedProp,
    width = 360,
    height = 320,
    onNodeClick,
    className,
    style,
    'aria-label': ariaLabel = 'Graph',
  },
  ref,
) {
  const s = SIZE_PX[size]
  const r = s.node / 2

  const laid = useMemo(() => {
    if (layout === 'layered') return layeredGraphLayout(nodes, edges, { originX: r + 20, originY: r + 20 })
    return circularGraphLayout(nodes, { cx: width / 2, cy: height / 2, radius: Math.min(width, height) / 2 - r - 12 })
  }, [nodes, edges, layout, width, height, r])

  const nodeById = useMemo(() => new Map(laid.map((n) => [n.id, n])), [laid])

  const [innerHl, setInnerHl] = useState<Set<string> | null>(null)
  const hl = useMemo(() => {
    if (highlightedProp !== undefined) return new Set(highlightedProp)
    return innerHl
  }, [highlightedProp, innerHl])

  const stopRef = useRef(false)

  const bfs = useCallback(
    (start: string): string[] => {
      const adj = buildAdj(edges, directed)
      const seen = new Set<string>([start])
      const order: string[] = [start]
      const q: string[] = [start]
      while (q.length) {
        const u = q.shift()!
        for (const v of adj.get(u) ?? []) {
          if (!seen.has(v)) {
            seen.add(v)
            order.push(v)
            q.push(v)
          }
        }
      }
      return order
    },
    [edges, directed],
  )

  const dfs = useCallback(
    (start: string): string[] => {
      const adj = buildAdj(edges, directed)
      const seen = new Set<string>()
      const order: string[] = []
      const walk = (u: string) => {
        if (seen.has(u)) return
        seen.add(u)
        order.push(u)
        for (const v of adj.get(u) ?? []) walk(v)
      }
      walk(start)
      return order
    },
    [edges, directed],
  )

  useImperativeHandle(
    ref,
    () => ({
      highlight: (ids) => setInnerHl(ids ? new Set(ids) : null),
      run: async (algorithm, start, intervalMs = 450) => {
        stopRef.current = false
        const order = algorithm === 'bfs' ? bfs(start) : dfs(start)
        const seen: string[] = []
        for (const id of order) {
          if (stopRef.current) break
          seen.push(id)
          setInnerHl(new Set(seen))
          await new Promise((res) => setTimeout(res, intervalMs))
        }
        return order
      },
      stop: () => { stopRef.current = true },
    }),
    [bfs, dfs],
  )

  useEffect(() => () => { stopRef.current = true }, [])

  const idHl = (id: string) => (hl ? hl.has(id) : false)

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cx('vl-graph', className)}
      style={{ fontFamily: 'var(--font-sans)', overflow: 'visible', ...style }}
      data-vl-dsa="graph"
      data-layout={layout}
    >
      <defs>
        <marker id="vl-graph-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" fill={DSA_COLORS.edge} />
        </marker>
      </defs>
      {/* Edges */}
      {edges.map((e, i) => {
        const a = nodeById.get(e.from)
        const b = nodeById.get(e.to)
        if (!a || !b) return null
        const [x1, y1, x2, y2] = shrinkSegment(a.x, a.y, b.x, b.y, r + 2, r + 6)
        const isDirected = e.directed ?? directed
        const isHl = idHl(e.from) && idHl(e.to)
        const mx = (x1 + x2) / 2
        const my = (y1 + y2) / 2
        return (
          <g key={`e${i}`}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isHl ? DSA_COLORS.highlight : DSA_COLORS.edge}
              strokeWidth={isHl ? 1.75 : 1.25}
              markerEnd={isDirected ? 'url(#vl-graph-arrow)' : undefined}
              style={{ transition: 'stroke 180ms, stroke-width 180ms' }}
            />
            {e.weight != null && (
              <g>
                <rect
                  x={mx - 10}
                  y={my - 8}
                  width={20}
                  height={14}
                  rx={3}
                  fill="var(--bg-1)"
                  stroke={DSA_COLORS.nodeStroke}
                />
                <text
                  x={mx}
                  y={my}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fill="var(--fg-2)"
                >
                  {String(e.weight)}
                </text>
              </g>
            )}
          </g>
        )
      })}
      {/* Nodes */}
      {laid.map((n) => {
        const isHl = idHl(n.id)
        return (
          <g
            key={n.id}
            style={{ cursor: onNodeClick ? 'pointer' : undefined }}
            onClick={() => onNodeClick?.(n.id)}
          >
            <circle
              cx={n.x}
              cy={n.y}
              r={r}
              fill={isHl ? DSA_COLORS.highlightFill : DSA_COLORS.nodeFill}
              stroke={isHl ? DSA_COLORS.highlight : DSA_COLORS.nodeStroke}
              strokeWidth={isHl ? 1.75 : 1}
              style={{ transition: 'fill 180ms, stroke 180ms' }}
            />
            <text
              x={n.x}
              y={n.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="var(--font-mono)"
              fontSize={s.font}
              fill={DSA_COLORS.nodeText}
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {n.label ?? n.id}
            </text>
          </g>
        )
      })}
    </svg>
  )
})
