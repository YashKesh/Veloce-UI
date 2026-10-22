import { forwardRef, useImperativeHandle, type CSSProperties } from 'react'
import { cx } from '../../utils/cx'
import { DSA_COLORS, layeredGraphLayout, shrinkSegment, type GraphEdgeInput, type GraphNodeInput } from './dsaCommon'
import { usePlayback, type PlaybackState } from './usePlayback'
import { PlaybackControls } from './PlaybackControls'

export interface TopoStep {
  inDeg: Record<string, number>
  queue: string[]
  order: string[]
  current?: string
  caption: string
}

export interface TopologicalSortVisualizerHandle {
  playback: PlaybackState<TopoStep>
}

export interface TopologicalSortVisualizerProps {
  nodes: GraphNodeInput[]
  edges: GraphEdgeInput[]
  intervalMs?: number
  autoPlay?: boolean
  width?: number
  height?: number
  showControls?: boolean
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

function buildSteps(nodes: GraphNodeInput[], edges: GraphEdgeInput[]): TopoStep[] {
  const inDeg: Record<string, number> = {}
  const adj: Record<string, string[]> = {}
  for (const n of nodes) { inDeg[n.id] = 0; adj[n.id] = [] }
  for (const e of edges) {
    adj[e.from].push(e.to)
    inDeg[e.to] = (inDeg[e.to] ?? 0) + 1
  }

  const steps: TopoStep[] = []
  const queue: string[] = nodes.filter((n) => inDeg[n.id] === 0).map((n) => n.id)
  const order: string[] = []
  steps.push({ inDeg: { ...inDeg }, queue: queue.slice(), order: order.slice(), caption: `seed queue with in-degree-0 nodes: [${queue.join(', ')}]` })

  while (queue.length) {
    const u = queue.shift()!
    order.push(u)
    steps.push({ inDeg: { ...inDeg }, queue: queue.slice(), order: order.slice(), current: u, caption: `dequeue ${u}; append to order` })
    for (const v of adj[u]) {
      inDeg[v] -= 1
      if (inDeg[v] === 0) queue.push(v)
      steps.push({ inDeg: { ...inDeg }, queue: queue.slice(), order: order.slice(), current: u, caption: `decrement in-deg of ${v} → ${inDeg[v]}${inDeg[v] === 0 ? '; enqueue' : ''}` })
    }
  }

  if (order.length < nodes.length) {
    steps.push({ inDeg: { ...inDeg }, queue: queue.slice(), order: order.slice(), caption: `cycle detected — only ${order.length}/${nodes.length} ordered` })
  } else {
    steps.push({ inDeg: { ...inDeg }, queue: queue.slice(), order: order.slice(), caption: `topological order: [${order.join(' → ')}]` })
  }
  return steps
}

export const TopologicalSortVisualizer = forwardRef<TopologicalSortVisualizerHandle, TopologicalSortVisualizerProps>(function TopologicalSortVisualizer(
  {
    nodes,
    edges,
    intervalMs = 500,
    autoPlay = false,
    width = 520,
    height = 260,
    showControls = true,
    className,
    style,
    'aria-label': ariaLabel = 'Topological sort (Kahn) visualiser',
  },
  ref,
) {
  const playback = usePlayback<TopoStep>({
    buildSteps: () => buildSteps(nodes, edges),
    intervalMs,
    autoPlay,
    deps: [nodes, edges],
  })

  useImperativeHandle(ref, () => ({ playback }), [playback])

  const r = 20
  // originY leaves top room for the circle; yGap must leave room for the chip below.
  const laid = layeredGraphLayout(nodes, edges, { originX: 40, originY: 40, yGap: r * 2 + 36 })
  const nodeById = new Map(laid.map((n) => [n.id, n]))
  const { snapshot } = playback

  const nodeFill = (id: string) => {
    if (snapshot?.current === id) return DSA_COLORS.highlightFill
    if (snapshot?.order.includes(id)) return DSA_COLORS.visited
    if (snapshot?.queue.includes(id)) return 'color-mix(in oklch, var(--ac) 15%, var(--bg-1))'
    return DSA_COLORS.nodeFill
  }
  const nodeStroke = (id: string) => {
    if (snapshot?.current === id) return DSA_COLORS.highlight
    if (snapshot?.order.includes(id)) return DSA_COLORS.visitedStroke
    return DSA_COLORS.nodeStroke
  }

  return (
    <div
      className={cx('vl-topo-vis', className)}
      style={{ display: 'flex', flexDirection: 'column', gap: 10, width, maxWidth: '100%', ...style }}
      data-vl-dsa="topo-visualizer"
    >
      <svg
        role="img"
        aria-label={ariaLabel}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ background: 'var(--bg-1)', border: `1px solid ${DSA_COLORS.nodeStroke}`, borderRadius: 'var(--r-md)', overflow: 'hidden', display: 'block' }}
      >
        <defs>
          <marker id="vl-topo-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L10 5 L0 10 Z" fill={DSA_COLORS.edge} />
          </marker>
        </defs>
        {edges.map((e, i) => {
          const a = nodeById.get(e.from)
          const b = nodeById.get(e.to)
          if (!a || !b) return null
          const [x1, y1, x2, y2] = shrinkSegment(a.x, a.y, b.x, b.y, r + 2, r + 8)
          return (
            <line
              key={`e${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={DSA_COLORS.edge}
              strokeWidth={1.25}
              markerEnd="url(#vl-topo-arr)"
            />
          )
        })}
        {laid.map((n) => {
          const indeg = snapshot?.inDeg[n.id] ?? 0
          const inOrder = snapshot?.order.includes(n.id)
          return (
            <g key={n.id}>
              <circle
                cx={n.x}
                cy={n.y}
                r={r}
                fill={nodeFill(n.id)}
                stroke={nodeStroke(n.id)}
                strokeWidth={1.5}
                style={{ transition: 'fill 260ms var(--ease-swift-out, ease-out), stroke 260ms var(--ease-swift-out, ease-out)' }}
              />
              <text
                x={n.x}
                y={n.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={13}
                fontWeight={500}
                fill={DSA_COLORS.nodeText}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {n.label ?? n.id}
              </text>
              {/* In-degree chip below the circle so it never clashes with the node letter. */}
              <g style={{ transition: 'opacity 220ms', opacity: inOrder ? 0.35 : 1 }}>
                <rect
                  x={n.x - 18}
                  y={n.y + r + 4}
                  width={36}
                  height={16}
                  rx={8}
                  fill="var(--bg-1)"
                  stroke={indeg === 0 && !inOrder ? DSA_COLORS.highlight : DSA_COLORS.nodeStroke}
                  strokeWidth={1}
                  style={{ transition: 'stroke 220ms' }}
                />
                <text
                  x={n.x}
                  y={n.y + r + 12}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={10}
                  fontFamily="var(--font-mono)"
                  fill={indeg === 0 && !inOrder ? DSA_COLORS.highlight : 'var(--fg-3)'}
                  style={{ transition: 'fill 220ms' }}
                >
                  in={indeg}
                </text>
              </g>
            </g>
          )
        })}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-2)', minHeight: 44, alignSelf: 'stretch', width: '100%' }}>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <span style={{ color: 'var(--fg-3)' }}>queue:</span> [{snapshot?.queue.join(', ')}]
        </div>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <span style={{ color: 'var(--fg-3)' }}>order:</span> <strong style={{ color: 'var(--ok)' }}>{snapshot?.order.join(' → ')}</strong>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 44, alignSelf: 'stretch', width: '100%', position: 'relative' }}>
        {showControls && <PlaybackControls state={playback} />}
        <span
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: 11,
            color: 'var(--fg-3)',
            fontFamily: 'var(--font-mono)',
            textAlign: 'right',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {snapshot?.caption ?? ' '}
        </span>
      </div>
    </div>
  )
})
