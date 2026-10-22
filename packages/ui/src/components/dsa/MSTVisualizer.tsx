import { forwardRef, useImperativeHandle, type CSSProperties } from 'react'
import { cx } from '../../utils/cx'
import { DSA_COLORS, circularGraphLayout, shrinkSegment, type GraphEdgeInput, type GraphNodeInput } from './dsaCommon'
import { usePlayback, type PlaybackState } from './usePlayback'
import { PlaybackControls } from './PlaybackControls'

export type MSTAlgorithm = 'kruskal' | 'prim'

export interface MSTStep {
  /** Set of edge indices currently in the MST. */
  mst: Set<number>
  /** Edge being considered this step. */
  considering?: number
  /** Rejected (would form cycle). */
  rejected?: number
  totalWeight: number
  caption: string
}

export interface MSTVisualizerHandle {
  playback: PlaybackState<MSTStep>
}

export interface MSTVisualizerProps {
  nodes: GraphNodeInput[]
  edges: (GraphEdgeInput & { weight: number })[]
  algorithm?: MSTAlgorithm
  startNode?: string
  intervalMs?: number
  autoPlay?: boolean
  width?: number
  height?: number
  showControls?: boolean
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

/* ─── Step builders ─────────────────────────────────────────────────────── */

function kruskalSteps(nodes: GraphNodeInput[], edges: (GraphEdgeInput & { weight: number })[]): MSTStep[] {
  const sorted = edges.map((e, i) => ({ ...e, i })).sort((a, b) => a.weight - b.weight)
  const parent: Record<string, string> = {}
  for (const n of nodes) parent[n.id] = n.id
  const find = (x: string): string => (parent[x] === x ? x : (parent[x] = find(parent[x])))
  const union = (a: string, b: string) => {
    const ra = find(a), rb = find(b)
    if (ra === rb) return false
    parent[ra] = rb
    return true
  }

  const mst = new Set<number>()
  let total = 0
  const steps: MSTStep[] = [{ mst: new Set(), totalWeight: 0, caption: 'sorted edges by weight; MST empty' }]
  for (const e of sorted) {
    const added = union(e.from, e.to)
    if (added) {
      mst.add(e.i)
      total += e.weight
      steps.push({ mst: new Set(mst), considering: e.i, totalWeight: total, caption: `+ edge ${e.from}–${e.to} (${e.weight})` })
    } else {
      steps.push({ mst: new Set(mst), rejected: e.i, totalWeight: total, caption: `skip ${e.from}–${e.to} (would cycle)` })
    }
    if (mst.size === nodes.length - 1) break
  }
  steps.push({ mst: new Set(mst), totalWeight: total, caption: `MST complete; total = ${total}` })
  return steps
}

function primSteps(nodes: GraphNodeInput[], edges: (GraphEdgeInput & { weight: number })[], startId: string): MSTStep[] {
  const inTree = new Set<string>([startId])
  const mst = new Set<number>()
  let total = 0
  const steps: MSTStep[] = [{ mst: new Set(), totalWeight: 0, caption: `start Prim at ${startId}` }]

  while (inTree.size < nodes.length) {
    // Find min-weight edge crossing the cut.
    let best = -1
    let bestWeight = Infinity
    edges.forEach((e, i) => {
      const aIn = inTree.has(e.from), bIn = inTree.has(e.to)
      if (aIn !== bIn && e.weight < bestWeight) { bestWeight = e.weight; best = i }
    })
    if (best < 0) break
    const e = edges[best]
    mst.add(best)
    total += e.weight
    inTree.add(e.from); inTree.add(e.to)
    steps.push({ mst: new Set(mst), considering: best, totalWeight: total, caption: `+ cross-cut edge ${e.from}–${e.to} (${e.weight})` })
  }
  steps.push({ mst: new Set(mst), totalWeight: total, caption: `MST complete; total = ${total}` })
  return steps
}

export const MSTVisualizer = forwardRef<MSTVisualizerHandle, MSTVisualizerProps>(function MSTVisualizer(
  {
    nodes,
    edges,
    algorithm = 'kruskal',
    startNode,
    intervalMs = 500,
    autoPlay = false,
    width = 380,
    height = 320,
    showControls = true,
    className,
    style,
    'aria-label': ariaLabel = 'Minimum spanning tree visualiser',
  },
  ref,
) {
  const start = startNode ?? nodes[0]?.id ?? ''
  const playback = usePlayback<MSTStep>({
    buildSteps: () => (algorithm === 'kruskal' ? kruskalSteps(nodes, edges) : primSteps(nodes, edges, start)),
    intervalMs,
    autoPlay,
    deps: [nodes, edges, algorithm, start],
  })

  useImperativeHandle(ref, () => ({ playback }), [playback])

  const r = 20
  const laid = circularGraphLayout(nodes, { cx: width / 2, cy: height / 2, radius: Math.min(width, height) / 2 - (r + 20) })
  const nodeById = new Map(laid.map((n) => [n.id, n]))
  const { snapshot } = playback

  return (
    <div
      className={cx('vl-mst-vis', className)}
      style={{ display: 'flex', flexDirection: 'column', gap: 10, width, maxWidth: '100%', ...style }}
      data-vl-dsa="mst-visualizer"
      data-algorithm={algorithm}
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
        {edges.map((e, i) => {
          const a = nodeById.get(e.from)
          const b = nodeById.get(e.to)
          if (!a || !b) return null
          const [x1, y1, x2, y2] = shrinkSegment(a.x, a.y, b.x, b.y, r + 2, r + 2)
          const mx = (x1 + x2) / 2
          const my = (y1 + y2) / 2
          const isMst = snapshot?.mst.has(i)
          const isConsidering = snapshot?.considering === i
          const isRejected = snapshot?.rejected === i
          return (
            <g key={`e${i}`}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isMst ? DSA_COLORS.visitedStroke : isConsidering ? DSA_COLORS.highlight : isRejected ? 'var(--err)' : DSA_COLORS.edge}
                strokeWidth={isMst || isConsidering ? 2.2 : 1.2}
                strokeDasharray={isRejected ? '4 3' : undefined}
                style={{ transition: 'stroke 220ms, stroke-width 220ms' }}
              />
              <g>
                <rect x={mx - 10} y={my - 8} width={20} height={14} rx={3} fill="var(--bg-1)" stroke={DSA_COLORS.nodeStroke} />
                <text x={mx} y={my + 3} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--fg-2)">{e.weight}</text>
              </g>
            </g>
          )
        })}
        {laid.map((n) => (
          <g key={n.id}>
            <circle
              cx={n.x}
              cy={n.y}
              r={r}
              fill={DSA_COLORS.nodeFill}
              stroke={DSA_COLORS.nodeStroke}
              strokeWidth={1.5}
            />
            <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle" fontFamily="var(--font-mono)" fontSize={13} fill={DSA_COLORS.nodeText}>
              {n.label ?? n.id}
            </text>
          </g>
        ))}
      </svg>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 44, alignSelf: 'stretch', width: '100%', position: 'relative' }}>
        {showControls && <PlaybackControls state={playback} />}
        <span
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: 11,
            color: 'var(--fg-2)',
            fontFamily: 'var(--font-mono)',
            textAlign: 'right',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          weight: <strong style={{ color: 'var(--ok)' }}>{snapshot?.totalWeight ?? 0}</strong>
          {snapshot?.caption && <span style={{ color: 'var(--fg-3)' }}> · {snapshot.caption}</span>}
        </span>
      </div>
    </div>
  )
})
