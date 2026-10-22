import { forwardRef, useImperativeHandle, type CSSProperties } from 'react'
import { cx } from '../../utils/cx'
import { DSA_COLORS } from './dsaCommon'
import { usePlayback, type PlaybackState } from './usePlayback'
import { PlaybackControls } from './PlaybackControls'

export type DPKind = 'lcs' | 'edit-distance' | 'knapsack'

export interface DPStep {
  table: (number | null)[][]
  /** The cell being filled this step. */
  current: [number, number] | null
  /** The cells referenced by the recurrence. */
  deps?: [number, number][]
  /** Cells belonging to the final back-trace path. */
  path?: [number, number][]
  caption: string
}

export interface DPTableHandle {
  playback: PlaybackState<DPStep>
}

export interface DPTableProps {
  kind: DPKind
  /** For LCS / edit-distance: two strings. For knapsack: pass {weights, values, capacity}. */
  a?: string
  b?: string
  weights?: number[]
  values?: number[]
  capacity?: number
  rowLabels?: string[]
  colLabels?: string[]
  intervalMs?: number
  autoPlay?: boolean
  cellSize?: number
  showControls?: boolean
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

/* ─── Step builders ─────────────────────────────────────────────────────── */

function lcsSteps(a: string, b: string): DPStep[] {
  const m = a.length, n = b.length
  const table: (number | null)[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(null))
  const steps: DPStep[] = [{ table: table.map((r) => r.slice()), current: null, caption: 'empty table (0-row/col implicit 0)' }]
  // Fill the base row and column with 0s.
  for (let i = 0; i <= m; i++) table[i][0] = 0
  for (let j = 0; j <= n; j++) table[0][j] = 0
  steps.push({ table: table.map((r) => r.slice()), current: null, caption: 'base case: empty prefix → 0' })

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const deps: [number, number][] = a[i - 1] === b[j - 1] ? [[i - 1, j - 1]] : [[i - 1, j], [i, j - 1]]
      if (a[i - 1] === b[j - 1]) table[i][j] = (table[i - 1][j - 1] ?? 0) + 1
      else table[i][j] = Math.max(table[i - 1][j] ?? 0, table[i][j - 1] ?? 0)
      steps.push({
        table: table.map((r) => r.slice()),
        current: [i, j],
        deps,
        caption: a[i - 1] === b[j - 1] ? `${a[i - 1]} == ${b[j - 1]} → ${table[i][j]}` : `max of neighbours → ${table[i][j]}`,
      })
    }
  }

  // Back-trace path.
  const path: [number, number][] = []
  let i = m, j = n
  while (i > 0 && j > 0) {
    path.push([i, j])
    if (a[i - 1] === b[j - 1]) { i--; j-- }
    else if ((table[i - 1][j] ?? 0) >= (table[i][j - 1] ?? 0)) i--
    else j--
  }
  steps.push({ table: table.map((r) => r.slice()), current: null, path, caption: `LCS length = ${table[m][n]}` })
  return steps
}

function editSteps(a: string, b: string): DPStep[] {
  const m = a.length, n = b.length
  const table: (number | null)[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(null))
  const steps: DPStep[] = [{ table: table.map((r) => r.slice()), current: null, caption: 'empty table' }]
  for (let i = 0; i <= m; i++) table[i][0] = i
  for (let j = 0; j <= n; j++) table[0][j] = j
  steps.push({ table: table.map((r) => r.slice()), current: null, caption: 'base case: distance to empty = length' })

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const same = a[i - 1] === b[j - 1]
      const deps: [number, number][] = same ? [[i - 1, j - 1]] : [[i - 1, j - 1], [i - 1, j], [i, j - 1]]
      if (same) table[i][j] = table[i - 1][j - 1]!
      else table[i][j] = 1 + Math.min(table[i - 1][j - 1]!, table[i - 1][j]!, table[i][j - 1]!)
      steps.push({ table: table.map((r) => r.slice()), current: [i, j], deps, caption: same ? `match ${a[i - 1]}` : `edit → ${table[i][j]}` })
    }
  }
  steps.push({ table: table.map((r) => r.slice()), current: null, caption: `edit distance = ${table[m][n]}` })
  return steps
}

function knapsackSteps(weights: number[], values: number[], capacity: number): DPStep[] {
  const n = weights.length
  const table: (number | null)[][] = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(null))
  const steps: DPStep[] = [{ table: table.map((r) => r.slice()), current: null, caption: 'empty table' }]
  for (let j = 0; j <= capacity; j++) table[0][j] = 0
  for (let i = 0; i <= n; i++) table[i][0] = 0
  steps.push({ table: table.map((r) => r.slice()), current: null, caption: 'base: no items / zero capacity → 0' })

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      const notTake = table[i - 1][w]!
      let value = notTake
      const deps: [number, number][] = [[i - 1, w]]
      if (weights[i - 1] <= w) {
        const take = values[i - 1] + table[i - 1][w - weights[i - 1]]!
        if (take > value) value = take
        deps.push([i - 1, w - weights[i - 1]])
      }
      table[i][w] = value
      steps.push({ table: table.map((r) => r.slice()), current: [i, w], deps, caption: `item ${i}, cap ${w} → ${value}` })
    }
  }
  steps.push({ table: table.map((r) => r.slice()), current: null, caption: `max value = ${table[n][capacity]}` })
  return steps
}

/* ─── Component ─────────────────────────────────────────────────────────── */

export const DPTable = forwardRef<DPTableHandle, DPTableProps>(function DPTable(
  {
    kind,
    a = '',
    b = '',
    weights = [2, 3, 4, 5],
    values = [3, 4, 5, 6],
    capacity = 8,
    rowLabels,
    colLabels,
    intervalMs = 300,
    autoPlay = false,
    cellSize = 36,
    showControls = true,
    className,
    style,
    'aria-label': ariaLabel = 'Dynamic programming table',
  },
  ref,
) {
  const playback = usePlayback<DPStep>({
    buildSteps: () => {
      if (kind === 'lcs') return lcsSteps(a, b)
      if (kind === 'edit-distance') return editSteps(a, b)
      return knapsackSteps(weights, values, capacity)
    },
    intervalMs,
    autoPlay,
    deps: [kind, a, b, weights.join(','), values.join(','), capacity],
  })

  useImperativeHandle(ref, () => ({ playback }), [playback])

  const { snapshot } = playback
  const table = snapshot?.table ?? [[]]
  const cols = table[0]?.length ?? 0

  const effectiveRowLabels = rowLabels ?? (kind === 'knapsack'
    ? ['∅', ...weights.map((w, i) => `${i + 1}:${values[i]}/${w}`)]
    : ['∅', ...a.split('')])
  const effectiveColLabels = colLabels ?? (kind === 'knapsack'
    ? Array.from({ length: capacity + 1 }, (_, j) => String(j))
    : ['∅', ...b.split('')])

  const cellBg = (i: number, j: number) => {
    if (snapshot?.path?.some(([pi, pj]) => pi === i && pj === j)) return 'color-mix(in oklch, var(--ok) 25%, var(--bg-1))'
    if (snapshot?.current && snapshot.current[0] === i && snapshot.current[1] === j) return DSA_COLORS.highlightFill
    if (snapshot?.deps?.some(([di, dj]) => di === i && dj === j)) return 'color-mix(in oklch, var(--ac) 10%, var(--bg-1))'
    return 'var(--bg-1)'
  }
  const cellBorder = (i: number, j: number) => {
    if (snapshot?.current && snapshot.current[0] === i && snapshot.current[1] === j) return DSA_COLORS.highlight
    return DSA_COLORS.nodeStroke
  }

  return (
    <div
      className={cx('vl-dp-table', className)}
      // Explicit width = row-label column + content cols + 2px gaps + 16px padding + 2px border.
      // Keeps outer bounding box constant between playback steps so caption changes can't
      // re-centre the component.
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        width: Math.round(cellSize / 1.5) + cols * cellSize + (cols + 1) * 2 + 18,
        maxWidth: '100%',
        ...style,
      }}
      data-vl-dsa="dp-table"
      data-kind={kind}
    >
      <div
        role="grid"
        aria-label={ariaLabel}
        style={{
          display: 'grid',
          gridTemplateColumns: `${cellSize / 1.5}px repeat(${cols}, ${cellSize}px)`,
          gap: 2,
          padding: 8,
          background: 'var(--bg-2)',
          border: `1px solid ${DSA_COLORS.nodeStroke}`,
          borderRadius: 'var(--r-md)',
        }}
      >
        {/* top-left corner */}
        <span />
        {Array.from({ length: cols }, (_, j) => (
          <span key={`c${j}`} style={{ textAlign: 'center', fontSize: 10, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>
            {effectiveColLabels[j] ?? j}
          </span>
        ))}
        {table.map((row, i) => (
          <>
            <span key={`r${i}`} style={{ fontSize: 10, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', textAlign: 'right', paddingRight: 4, alignSelf: 'center' }}>
              {effectiveRowLabels[i] ?? i}
            </span>
            {row.map((v, j) => (
              <div
                key={`${i}-${j}`}
                style={{
                  width: cellSize,
                  height: cellSize - 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: cellBg(i, j),
                  border: `1px solid ${cellBorder(i, j)}`,
                  borderRadius: 4,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: v == null ? 'var(--fg-3)' : DSA_COLORS.nodeText,
                  transition: 'background 180ms, border-color 180ms',
                }}
              >
                {v ?? '·'}
              </div>
            ))}
          </>
        ))}
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
