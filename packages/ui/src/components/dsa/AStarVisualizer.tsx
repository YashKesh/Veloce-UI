import { forwardRef, useImperativeHandle, type CSSProperties } from 'react'
import { cx } from '../../utils/cx'
import { DSA_COLORS } from './dsaCommon'
import { usePlayback, type PlaybackState } from './usePlayback'
import { PlaybackControls } from './PlaybackControls'

export type AStarHeuristic = 'manhattan' | 'euclidean' | 'chebyshev'

export interface AStarStep {
  current: [number, number] | null
  open: Set<string>
  closed: Set<string>
  path?: [number, number][]
  caption: string
}

export interface AStarVisualizerHandle {
  playback: PlaybackState<AStarStep>
}

export interface AStarVisualizerProps {
  /** 2D grid: 0 = passable, 1 = wall. */
  grid: number[][]
  start: [number, number]
  goal: [number, number]
  heuristic?: AStarHeuristic
  /** Allow diagonal movement. Default false. */
  diagonal?: boolean
  intervalMs?: number
  autoPlay?: boolean
  cellSize?: number
  showControls?: boolean
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

const key = (r: number, c: number) => `${r},${c}`

function h(a: [number, number], b: [number, number], kind: AStarHeuristic): number {
  const dr = Math.abs(a[0] - b[0]), dc = Math.abs(a[1] - b[1])
  if (kind === 'manhattan') return dr + dc
  if (kind === 'euclidean') return Math.hypot(dr, dc)
  return Math.max(dr, dc)
}

function reconstruct(cameFrom: Map<string, string>, end: [number, number]): [number, number][] {
  const path: [number, number][] = [end]
  let cur = key(end[0], end[1])
  while (cameFrom.has(cur)) {
    const prev = cameFrom.get(cur)!
    const [r, c] = prev.split(',').map(Number)
    path.push([r, c])
    cur = prev
  }
  return path.reverse()
}

function buildSteps(grid: number[][], start: [number, number], goal: [number, number], heuristic: AStarHeuristic, diagonal: boolean): AStarStep[] {
  const steps: AStarStep[] = []
  const rows = grid.length
  const cols = grid[0]?.length ?? 0

  const open = new Map<string, number>() // id → fScore
  const closed = new Set<string>()
  const gScore = new Map<string, number>()
  const fScore = new Map<string, number>()
  const cameFrom = new Map<string, string>()

  const startKey = key(start[0], start[1])
  gScore.set(startKey, 0)
  fScore.set(startKey, h(start, goal, heuristic))
  open.set(startKey, fScore.get(startKey)!)

  steps.push({ current: null, open: new Set(open.keys()), closed: new Set(closed), caption: `start A* from (${start[0]},${start[1]})` })

  const neighbors = (r: number, c: number): [number, number][] => {
    const out: [number, number][] = []
    const deltas = diagonal
      ? [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]
      : [[-1, 0], [1, 0], [0, -1], [0, 1]]
    for (const [dr, dc] of deltas) {
      const nr = r + dr, nc = c + dc
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] !== 1) out.push([nr, nc])
    }
    return out
  }

  while (open.size > 0) {
    // Pick lowest-fScore in open.
    let bestKey: string | null = null
    let bestF = Infinity
    for (const [k, f] of open) if (f < bestF) { bestF = f; bestKey = k }
    if (!bestKey) break

    const [r, c] = bestKey.split(',').map(Number)
    steps.push({ current: [r, c], open: new Set(open.keys()), closed: new Set(closed), caption: `expand (${r},${c}) f=${bestF.toFixed(1)}` })

    if (r === goal[0] && c === goal[1]) {
      const path = reconstruct(cameFrom, goal)
      steps.push({ current: [r, c], open: new Set(open.keys()), closed: new Set(closed), path, caption: `reached goal; path length = ${path.length}` })
      return steps
    }

    open.delete(bestKey)
    closed.add(bestKey)

    for (const [nr, nc] of neighbors(r, c)) {
      const nk = key(nr, nc)
      if (closed.has(nk)) continue
      const tentativeG = (gScore.get(bestKey) ?? Infinity) + (nr !== r && nc !== c ? Math.SQRT2 : 1)
      if (tentativeG < (gScore.get(nk) ?? Infinity)) {
        cameFrom.set(nk, bestKey)
        gScore.set(nk, tentativeG)
        const f = tentativeG + h([nr, nc], goal, heuristic)
        fScore.set(nk, f)
        open.set(nk, f)
      }
    }
  }
  steps.push({ current: null, open: new Set(open.keys()), closed: new Set(closed), caption: 'no path found' })
  return steps
}

export const AStarVisualizer = forwardRef<AStarVisualizerHandle, AStarVisualizerProps>(function AStarVisualizer(
  {
    grid,
    start,
    goal,
    heuristic = 'manhattan',
    diagonal = false,
    intervalMs = 160,
    autoPlay = false,
    cellSize = 28,
    showControls = true,
    className,
    style,
    'aria-label': ariaLabel = 'A* pathfinding visualiser',
  },
  ref,
) {
  const playback = usePlayback<AStarStep>({
    buildSteps: () => buildSteps(grid, start, goal, heuristic, diagonal),
    intervalMs,
    autoPlay,
    deps: [grid, start, goal, heuristic, diagonal],
  })

  useImperativeHandle(ref, () => ({ playback }), [playback])

  const { snapshot } = playback
  const cols = grid[0]?.length ?? 0

  const cellBg = (r: number, c: number) => {
    const k = key(r, c)
    if (r === start[0] && c === start[1]) return 'color-mix(in oklch, var(--ac) 60%, var(--bg-1))'
    if (r === goal[0] && c === goal[1]) return 'color-mix(in oklch, var(--ok) 50%, var(--bg-1))'
    if (grid[r][c] === 1) return 'var(--fg-2)'
    if (snapshot?.path?.some(([pr, pc]) => pr === r && pc === c)) return 'color-mix(in oklch, var(--ok) 30%, var(--bg-1))'
    if (snapshot?.current && snapshot.current[0] === r && snapshot.current[1] === c) return DSA_COLORS.highlight
    if (snapshot?.closed.has(k)) return DSA_COLORS.visited
    if (snapshot?.open.has(k)) return 'color-mix(in oklch, var(--ac) 15%, var(--bg-1))'
    return 'var(--bg-1)'
  }

  return (
    <div
      className={cx('vl-astar-vis', className)}
      style={{ display: 'flex', flexDirection: 'column', gap: 10, width: cols * (cellSize + 1) + 13, maxWidth: '100%', ...style }}
      data-vl-dsa="astar-visualizer"
    >
      <div
        role="grid"
        aria-label={ariaLabel}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gap: 1,
          padding: 6,
          background: DSA_COLORS.nodeStroke,
          border: `1px solid ${DSA_COLORS.nodeStroke}`,
          borderRadius: 'var(--r-md)',
        }}
      >
        {grid.map((row, r) =>
          row.map((_, c) => (
            <div
              key={`${r}-${c}`}
              style={{
                width: cellSize,
                height: cellSize,
                background: cellBg(r, c),
                transition: 'background 160ms',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
              }}
            >
              {r === start[0] && c === start[1] ? 'S' : r === goal[0] && c === goal[1] ? 'G' : ''}
            </div>
          )),
        )}
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
