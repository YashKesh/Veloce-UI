import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  type CSSProperties,
} from 'react'
import { cx } from '../../utils/cx'
import { DSA_COLORS, SIZE_PX, type DsaSize } from './dsaCommon'

export type SegmentTreeOp = 'sum' | 'min' | 'max'

const REDUCERS: Record<SegmentTreeOp, (a: number, b: number) => number> = {
  sum: (a, b) => a + b,
  min: (a, b) => Math.min(a, b),
  max: (a, b) => Math.max(a, b),
}
const IDENTITY: Record<SegmentTreeOp, number> = { sum: 0, min: Infinity, max: -Infinity }

export interface SegmentTreeHandle {
  update: (index: number, value: number) => void
  query: (l: number, r: number) => number
  reset: () => void
  snapshot: () => number[]
}

export interface SegmentTreeProps {
  data?: number[]
  defaultData?: number[]
  op?: SegmentTreeOp
  size?: DsaSize
  /** Currently highlighted range [l, r] (controlled). */
  queryRange?: [number, number] | null
  onChange?: (next: number[]) => void
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

/* ─── Pure segment-tree ops over an array-backed tree ───────────────────── */

function build(data: number[], op: SegmentTreeOp): number[] {
  const n = data.length
  const tree = new Array(4 * Math.max(1, n)).fill(IDENTITY[op])
  const r = REDUCERS[op]
  const rec = (i: number, l: number, h: number) => {
    if (l === h) { tree[i] = data[l]; return }
    const m = (l + h) >> 1
    rec(2 * i + 1, l, m)
    rec(2 * i + 2, m + 1, h)
    tree[i] = r(tree[2 * i + 1], tree[2 * i + 2])
  }
  if (n > 0) rec(0, 0, n - 1)
  return tree
}

function queryVisit(l: number, h: number, ql: number, qh: number): [number[], boolean] {
  // Returns path of tree indices visited for the pedagogical highlight.
  // Not used for value calculation (we return the actual aggregate separately).
  const path: number[] = []
  const rec = (i: number, lo: number, hi: number) => {
    if (qh < lo || hi < ql) return
    path.push(i)
    if (ql <= lo && hi <= qh) return
    const m = (lo + hi) >> 1
    rec(2 * i + 1, lo, m)
    rec(2 * i + 2, m + 1, hi)
  }
  rec(0, l, h)
  return [path, path.length > 0]
}

function queryValue(tree: number[], op: SegmentTreeOp, n: number, ql: number, qh: number): number {
  const r = REDUCERS[op]
  const rec = (i: number, lo: number, hi: number): number => {
    if (qh < lo || hi < ql) return IDENTITY[op]
    if (ql <= lo && hi <= qh) return tree[i]
    const m = (lo + hi) >> 1
    return r(rec(2 * i + 1, lo, m), rec(2 * i + 2, m + 1, hi))
  }
  return n > 0 ? rec(0, 0, n - 1) : IDENTITY[op]
}

/* ─── Layout: array indices mapped to complete tree positions ───────────── */

function nodePositions(treeLen: number, data: number[]): { present: number[]; depth: number; perNode: { x: number; y: number; depth: number }[] } {
  // Mark which indices actually contribute to the current range.
  const present: boolean[] = new Array(treeLen).fill(false)
  const rec = (i: number, l: number, h: number) => {
    if (i >= treeLen) return
    present[i] = true
    if (l === h) return
    const m = (l + h) >> 1
    rec(2 * i + 1, l, m)
    rec(2 * i + 2, m + 1, h)
  }
  if (data.length > 0) rec(0, 0, data.length - 1)
  // Count depth
  let maxD = 0
  for (let i = 0; i < treeLen; i++) {
    if (!present[i]) continue
    const d = Math.floor(Math.log2(i + 1))
    if (d > maxD) maxD = d
  }
  const positions: { x: number; y: number; depth: number }[] = new Array(treeLen).fill(null).map(() => ({ x: 0, y: 0, depth: 0 }))
  return { present: Array.from({ length: treeLen }, (_, i) => (present[i] ? i : -1)).filter((v) => v >= 0), depth: maxD, perNode: positions }
}

/* ─── Component ─────────────────────────────────────────────────────────── */

export const SegmentTree = forwardRef<SegmentTreeHandle, SegmentTreeProps>(function SegmentTree(
  {
    data,
    defaultData,
    op = 'sum',
    size = 'md',
    queryRange = null,
    onChange,
    className,
    style,
    'aria-label': ariaLabel = 'Segment tree',
  },
  ref,
) {
  const [internal, setInternal] = useState<number[]>(() => data ?? defaultData ?? [])
  const arr = data ?? internal
  const [innerQuery, setInnerQuery] = useState<[number, number] | null>(null)
  const activeRange = queryRange ?? innerQuery

  useEffect(() => {
    if (data !== undefined) setInternal(data)
  }, [data])

  const commit = (next: number[]) => {
    if (data === undefined) setInternal(next)
    onChange?.(next)
  }

  const tree = useMemo(() => build(arr, op), [arr, op])
  const n = arr.length

  useImperativeHandle(
    ref,
    () => ({
      update: (index: number, value: number) => {
        if (index < 0 || index >= arr.length) return
        const next = arr.slice()
        next[index] = value
        commit(next)
      },
      query: (l: number, r: number) => {
        setInnerQuery([l, r])
        return queryValue(tree, op, n, l, r)
      },
      reset: () => { setInnerQuery(null); commit(defaultData ?? []) },
      snapshot: () => arr.slice(),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [arr, tree, op],
  )

  const s = SIZE_PX[size]
  const r = s.node / 2 + 2
  const { present } = useMemo(() => nodePositions(tree.length, arr), [tree.length, arr])

  // Build depth map + bottom-level width
  const perLevel = useMemo(() => {
    const groups: Record<number, number[]> = {}
    for (const i of present) {
      const d = Math.floor(Math.log2(i + 1))
      if (!groups[d]) groups[d] = []
      groups[d].push(i)
    }
    return groups
  }, [present])

  const depths = Object.keys(perLevel).map(Number).sort((a, b) => a - b)
  const maxDepth = depths.length ? Math.max(...depths) : 0
  const widestLevel = Math.max(1, ...depths.map((d) => perLevel[d].length))
  const W = Math.max(220, widestLevel * (r * 2 + 20))
  const H = (maxDepth + 1) * (r * 2 + 40) + r + 20

  // Map each tree index → position.
  const posMap = useMemo(() => {
    const out = new Map<number, { x: number; y: number }>()
    for (const d of depths) {
      const list = perLevel[d]
      list.forEach((idx, k) => {
        const x = (W / (list.length + 1)) * (k + 1)
        const y = r + d * (r * 2 + 40)
        out.set(idx, { x, y })
      })
    }
    return out
  }, [perLevel, depths, W, r])

  // Compute highlight set from queryRange.
  const highlightedTreeIdx = useMemo(() => {
    if (!activeRange) return new Set<number>()
    const [l, h] = activeRange
    if (n === 0) return new Set<number>()
    const [path] = queryVisit(0, n - 1, l, h)
    return new Set(path)
  }, [activeRange, n])

  if (n === 0) {
    return (
      <div
        className={cx('vl-segment-tree', className)}
        style={{
          width: 200, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px dashed ${DSA_COLORS.nodeStroke}`, borderRadius: 8, color: DSA_COLORS.edge,
          fontSize: 12, fontFamily: 'var(--font-mono)', ...style,
        }}
      >
        empty segment tree
      </div>
    )
  }

  // Draw ranges on each node: find [lo,hi] for index i.
  const rangeOf = (idx: number): [number, number] => {
    // Walk from root tracking (l,h)
    let i = 0, l = 0, h = n - 1
    while (i !== idx) {
      const m = (l + h) >> 1
      if (idx === 2 * i + 1 || inLeft(idx, i)) { i = 2 * i + 1; h = m }
      else { i = 2 * i + 2; l = m + 1 }
    }
    return [l, h]
  }
  const inLeft = (target: number, parent: number): boolean => {
    // Return true if target is in the left subtree of parent.
    const l = 2 * parent + 1
    let cur = target
    while (cur > l) {
      cur = (cur - 1) >> 1
      if (cur === l) return true
      if (cur === parent) return false
    }
    return cur === l
  }

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className={cx('vl-segment-tree', className)}
      style={{ fontFamily: 'var(--font-sans)', overflow: 'visible', ...style }}
      data-vl-dsa="segment-tree"
      data-op={op}
    >
      {/* edges */}
      {Array.from(posMap.entries()).map(([i, p]) => {
        if (i === 0) return null
        const parentPos = posMap.get((i - 1) >> 1)
        if (!parentPos) return null
        const parentIdx = (i - 1) >> 1
        const isHl = highlightedTreeIdx.has(i) && highlightedTreeIdx.has(parentIdx)
        return (
          <line
            key={`e${i}`}
            x1={parentPos.x}
            y1={parentPos.y}
            x2={p.x}
            y2={p.y}
            stroke={isHl ? DSA_COLORS.highlight : DSA_COLORS.edge}
            strokeWidth={1.25}
            style={{ transition: 'stroke 180ms' }}
          />
        )
      })}
      {/* nodes */}
      {Array.from(posMap.entries()).map(([i, p]) => {
        const [l, h] = rangeOf(i)
        const isHl = highlightedTreeIdx.has(i)
        return (
          <g key={`n${i}`}>
            <circle
              cx={p.x}
              cy={p.y}
              r={r}
              fill={isHl ? DSA_COLORS.highlightFill : DSA_COLORS.nodeFill}
              stroke={isHl ? DSA_COLORS.highlight : DSA_COLORS.nodeStroke}
              strokeWidth={isHl ? 1.75 : 1}
              style={{ transition: 'fill 180ms, stroke 180ms' }}
            />
            <text
              x={p.x}
              y={p.y - 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={s.font - 1}
              fontFamily="var(--font-mono)"
              fontWeight={500}
              fill={DSA_COLORS.nodeText}
            >
              {tree[i]}
            </text>
            <text
              x={p.x}
              y={p.y + r + 10}
              textAnchor="middle"
              fontSize={9}
              fontFamily="var(--font-mono)"
              fill={isHl ? DSA_COLORS.highlight : DSA_COLORS.edge}
            >
              [{l}, {h}]
            </text>
          </g>
        )
      })}
    </svg>
  )
})
