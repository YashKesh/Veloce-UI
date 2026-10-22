import { forwardRef, useImperativeHandle, type CSSProperties } from 'react'
import { cx } from '../../utils/cx'
import { DSA_COLORS, circularGraphLayout, shrinkSegment, type GraphEdgeInput, type GraphNodeInput } from './dsaCommon'
import { usePlayback, type PlaybackState } from './usePlayback'
import { PlaybackControls } from './PlaybackControls'

export interface DijkstraStep {
  dist: Record<string, number>
  prev: Record<string, string | null>
  visited: Set<string>
  current: string | null
  relaxed?: [string, string]
  caption: string
}

export interface DijkstraVisualizerHandle {
  playback: PlaybackState<DijkstraStep>
}

export interface DijkstraVisualizerProps {
  nodes: GraphNodeInput[]
  edges: (GraphEdgeInput & { weight: number })[]
  start: string
  intervalMs?: number
  autoPlay?: boolean
  width?: number
  height?: number
  showControls?: boolean
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

const INF = Infinity

function buildSteps(nodes: GraphNodeInput[], edges: (GraphEdgeInput & { weight: number })[], start: string): DijkstraStep[] {
  const steps: DijkstraStep[] = []
  const dist: Record<string, number> = {}
  const prev: Record<string, string | null> = {}
  const visited = new Set<string>()
  for (const n of nodes) { dist[n.id] = INF; prev[n.id] = null }
  dist[start] = 0

  const adj = new Map<string, { to: string; w: number }[]>()
  for (const n of nodes) adj.set(n.id, [])
  for (const e of edges) {
    adj.get(e.from)?.push({ to: e.to, w: e.weight })
    const asDirected = e.directed ?? false
    if (!asDirected) adj.get(e.to)?.push({ to: e.from, w: e.weight })
  }

  steps.push({ dist: { ...dist }, prev: { ...prev }, visited: new Set(visited), current: null, caption: `initialize distances; dist[${start}] = 0` })

  while (visited.size < nodes.length) {
    // Pick the unvisited node with smallest dist.
    let u: string | null = null
    let best = INF
    for (const n of nodes) {
      if (visited.has(n.id)) continue
      if (dist[n.id] < best) { best = dist[n.id]; u = n.id }
    }
    if (u == null || best === INF) break
    visited.add(u)
    steps.push({ dist: { ...dist }, prev: { ...prev }, visited: new Set(visited), current: u, caption: `pick unvisited min: ${u} (dist=${dist[u]})` })

    for (const { to, w } of adj.get(u) ?? []) {
      if (visited.has(to)) continue
      const nd = dist[u] + w
      if (nd < dist[to]) {
        dist[to] = nd
        prev[to] = u
        steps.push({
          dist: { ...dist },
          prev: { ...prev },
          visited: new Set(visited),
          current: u,
          relaxed: [u, to],
          caption: `relax ${u} → ${to}: dist[${to}] = ${nd}`,
        })
      }
    }
  }
  steps.push({ dist: { ...dist }, prev: { ...prev }, visited: new Set(visited), current: null, caption: 'done' })
  return steps
}

export const DijkstraVisualizer = forwardRef<DijkstraVisualizerHandle, DijkstraVisualizerProps>(function DijkstraVisualizer(
  {
    nodes,
    edges,
    start,
    intervalMs = 600,
    autoPlay = false,
    width = 400,
    height = 320,
    showControls = true,
    className,
    style,
    'aria-label': ariaLabel = 'Dijkstra shortest-path visualiser',
  },
  ref,
) {
  const playback = usePlayback<DijkstraStep>({
    buildSteps: () => buildSteps(nodes, edges, start),
    intervalMs,
    autoPlay,
    deps: [nodes, edges, start],
  })

  useImperativeHandle(ref, () => ({ playback }), [playback])

  // Node radius + reserved space below each circle for its distance chip
  // (16 px chip + 4 px gap). We fold that into the layout padding so no node
  // sits close enough to the viewport edge to clip its chip.
  const r = 20
  const CHIP_RESERVE = 24
  const padding = r + CHIP_RESERVE + 8
  const radius = Math.min(width, height) / 2 - padding
  const laid = circularGraphLayout(nodes, { cx: width / 2, cy: height / 2, radius })
  const nodeById = new Map(laid.map((n) => [n.id, n]))
  const { snapshot } = playback

  const nodeFill = (id: string) => {
    if (snapshot?.current === id) return DSA_COLORS.highlightFill
    if (snapshot?.visited.has(id)) return DSA_COLORS.visited
    return DSA_COLORS.nodeFill
  }
  const nodeStroke = (id: string) => {
    if (snapshot?.current === id) return DSA_COLORS.highlight
    if (snapshot?.visited.has(id)) return DSA_COLORS.visitedStroke
    return DSA_COLORS.nodeStroke
  }
  const edgeStroke = (from: string, to: string) => {
    const r0 = snapshot?.relaxed
    if (r0 && ((r0[0] === from && r0[1] === to) || (r0[0] === to && r0[1] === from))) return DSA_COLORS.highlight
    // Highlight the final shortest-path tree once a prev chain exists.
    if (snapshot?.prev[to] === from || snapshot?.prev[from] === to) return 'color-mix(in oklch, var(--ok) 60%, var(--bg-1))'
    return DSA_COLORS.edge
  }

  return (
    <div
      className={cx('vl-dijkstra-vis', className)}
      // Explicit width (SVG + gap + distance-table). Keeps the outer bounding box constant
      // across every step so caption-length changes never re-centre the component.
      style={{ display: 'flex', flexDirection: 'column', gap: 12, width: width + 14 + 160, maxWidth: '100%', ...style }}
      data-vl-dsa="dijkstra-visualizer"
    >
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', width: '100%' }}>
        <svg
          role="img"
          aria-label={ariaLabel}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ background: 'var(--bg-1)', border: `1px solid ${DSA_COLORS.nodeStroke}`, borderRadius: 'var(--r-md)', overflow: 'hidden', display: 'block' }}
        >
          {/* edges */}
          {edges.map((e, i) => {
            const a = nodeById.get(e.from)
            const b = nodeById.get(e.to)
            if (!a || !b) return null
            const [x1, y1, x2, y2] = shrinkSegment(a.x, a.y, b.x, b.y, r + 2, r + 2)
            const mx = (x1 + x2) / 2
            const my = (y1 + y2) / 2
            return (
              <g key={`e${i}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={edgeStroke(e.from, e.to)}
                  strokeWidth={1.5}
                  style={{ transition: 'stroke 320ms var(--ease-swift-out, ease-out), stroke-width 320ms var(--ease-swift-out, ease-out)' }}
                />
                <g>
                  <rect x={mx - 10} y={my - 8} width={20} height={14} rx={3} fill="var(--bg-1)" stroke={DSA_COLORS.nodeStroke} />
                  <text x={mx} y={my + 3} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--fg-2)">
                    {e.weight}
                  </text>
                </g>
              </g>
            )
          })}
          {/* nodes */}
          {laid.map((n) => {
            const dist = snapshot?.dist[n.id]
            const distText = dist === INF ? '∞' : String(dist ?? '∞')
            const isVisited = snapshot?.visited.has(n.id)
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
                  fontSize={14}
                  fontWeight={500}
                  fill={DSA_COLORS.nodeText}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {n.label ?? n.id}
                </text>
                {/* Distance chip sits BELOW the circle so it never clashes with the node letter. */}
                <g style={{ transition: 'opacity 220ms', opacity: dist == null || dist === INF ? 0.55 : 1 }}>
                  <rect
                    x={n.x - 14}
                    y={n.y + r + 4}
                    width={28}
                    height={16}
                    rx={8}
                    fill="var(--bg-1)"
                    stroke={isVisited ? DSA_COLORS.visitedStroke : DSA_COLORS.nodeStroke}
                    strokeWidth={1}
                    style={{ transition: 'stroke 220ms' }}
                  />
                  <text
                    x={n.x}
                    y={n.y + r + 12}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily="var(--font-mono)"
                    fontSize={10}
                    fill={isVisited ? DSA_COLORS.visitedStroke : 'var(--fg-2)'}
                    style={{ transition: 'fill 220ms' }}
                  >
                    {distText}
                  </text>
                </g>
              </g>
            )
          })}
        </svg>
        {/* Distance table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-2)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', gap: '4px 10px', padding: '8px 12px', border: `1px solid ${DSA_COLORS.nodeStroke}`, borderRadius: 'var(--r-sm)', background: 'var(--bg-1)' }}>
            <strong style={{ color: 'var(--fg-3)' }}>node</strong>
            <strong style={{ color: 'var(--fg-3)' }}>dist</strong>
            <strong style={{ color: 'var(--fg-3)' }}>prev</strong>
            {nodes.map((n) => (
              <>
                <span key={`k${n.id}`} style={{ color: snapshot?.visited.has(n.id) ? 'var(--ok)' : 'var(--fg)' }}>{n.id}</span>
                <span key={`d${n.id}`}>{snapshot?.dist[n.id] === INF ? '∞' : snapshot?.dist[n.id]}</span>
                <span key={`p${n.id}`} style={{ color: 'var(--fg-3)' }}>{snapshot?.prev[n.id] ?? '—'}</span>
              </>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 44, alignSelf: 'stretch', width: '100%' }}>
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
          {snapshot?.caption ?? ' '}
        </span>
      </div>
    </div>
  )
})
