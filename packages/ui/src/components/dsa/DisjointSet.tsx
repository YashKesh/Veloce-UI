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

export interface DisjointSetHandle {
  union: (a: string, b: string) => void
  find: (a: string) => string
  connected: (a: string, b: string) => boolean
  reset: () => void
  snapshot: () => { parent: Record<string, string>; rank: Record<string, number> }
}

export interface DisjointSetProps {
  /** Element ids. Each element starts as its own set. */
  items: string[]
  /** Initial unions to seed the structure. */
  initialUnions?: [string, string][]
  size?: DsaSize
  /** Use union by rank + path compression. Default true. */
  byRank?: boolean
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

interface State {
  parent: Record<string, string>
  rank: Record<string, number>
}

function initialState(items: string[]): State {
  const parent: Record<string, string> = {}
  const rank: Record<string, number> = {}
  for (const i of items) {
    parent[i] = i
    rank[i] = 0
  }
  return { parent, rank }
}

function find(state: State, x: string, compress = true): string {
  let cur = x
  const path: string[] = []
  while (state.parent[cur] !== cur) {
    path.push(cur)
    cur = state.parent[cur]
  }
  if (compress) for (const p of path) state.parent[p] = cur
  return cur
}

function unionOp(state: State, a: string, b: string, byRank: boolean): boolean {
  const ra = find(state, a)
  const rb = find(state, b)
  if (ra === rb) return false
  if (byRank) {
    if (state.rank[ra] < state.rank[rb]) state.parent[ra] = rb
    else if (state.rank[ra] > state.rank[rb]) state.parent[rb] = ra
    else {
      state.parent[rb] = ra
      state.rank[ra] += 1
    }
  } else {
    state.parent[ra] = rb
  }
  return true
}

export const DisjointSet = forwardRef<DisjointSetHandle, DisjointSetProps>(function DisjointSet(
  {
    items,
    initialUnions = [],
    size = 'md',
    byRank = true,
    className,
    style,
    'aria-label': ariaLabel = 'Disjoint set',
  },
  ref,
) {
  const [state, setState] = useState<State>(() => {
    const init = initialState(items)
    for (const [a, b] of initialUnions) unionOp(init, a, b, byRank)
    return { parent: { ...init.parent }, rank: { ...init.rank } }
  })

  useEffect(() => {
    const init = initialState(items)
    for (const [a, b] of initialUnions) unionOp(init, a, b, byRank)
    setState({ parent: { ...init.parent }, rank: { ...init.rank } })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.join(','), byRank])

  useImperativeHandle(
    ref,
    () => ({
      union: (a: string, b: string) => {
        setState((prev) => {
          const next: State = { parent: { ...prev.parent }, rank: { ...prev.rank } }
          unionOp(next, a, b, byRank)
          return next
        })
      },
      find: (a: string) => {
        const next: State = { parent: { ...state.parent }, rank: { ...state.rank } }
        const root = find(next, a, true)
        setState(next)
        return root
      },
      connected: (a: string, b: string) => {
        const next: State = { parent: { ...state.parent }, rank: { ...state.rank } }
        return find(next, a, false) === find(next, b, false)
      },
      reset: () => setState(initialState(items)),
      snapshot: () => ({ parent: { ...state.parent }, rank: { ...state.rank } }),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, items, byRank],
  )

  // Group items by root.
  const roots = useMemo(() => {
    const groups: Record<string, string[]> = {}
    const read: State = { parent: { ...state.parent }, rank: { ...state.rank } }
    for (const id of items) {
      const r = find(read, id, false)
      if (!groups[r]) groups[r] = []
      groups[r].push(id)
    }
    return Object.entries(groups).map(([root, children]) => ({ root, children }))
  }, [state, items])

  const s = SIZE_PX[size]
  const r = s.node / 2

  return (
    <div
      className={cx('vl-disjoint-set', className)}
      role="list"
      aria-label={ariaLabel}
      style={{
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        fontFamily: 'var(--font-sans)',
        padding: 12,
        border: `1px dashed ${DSA_COLORS.nodeStroke}`,
        borderRadius: 'var(--r-md)',
        background: 'var(--bg-1)',
        ...style,
      }}
      data-vl-dsa="disjoint-set"
    >
      {roots.map(({ root, children }) => {
        const nonRoot = children.filter((c) => c !== root)
        return (
          <div key={root} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div
              title={`rank ${state.rank[root]}`}
              style={{
                width: r * 2,
                height: r * 2,
                borderRadius: '50%',
                background: 'color-mix(in oklch, var(--ac) 15%, var(--bg-2))',
                border: `1.5px solid ${DSA_COLORS.highlight}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: s.font,
                color: DSA_COLORS.nodeText,
                position: 'relative',
              }}
            >
              {root}
              <span style={{ position: 'absolute', top: -8, right: -8, fontSize: 9, background: 'var(--bg-1)', color: 'var(--fg-3)', padding: '1px 4px', borderRadius: 6, border: `1px solid ${DSA_COLORS.nodeStroke}`, fontFamily: 'var(--font-mono)' }}>
                r{state.rank[root]}
              </span>
            </div>
            {nonRoot.length > 0 && (
              <>
                <svg width={2} height={14}>
                  <line x1={1} y1={0} x2={1} y2={14} stroke={DSA_COLORS.edge} strokeWidth={1} />
                </svg>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center', maxWidth: r * 2 * 3 + 24 }}>
                  {nonRoot.map((c) => (
                    <div
                      key={c}
                      style={{
                        width: r * 1.6,
                        height: r * 1.6,
                        borderRadius: '50%',
                        background: DSA_COLORS.nodeFill,
                        border: `1px solid ${DSA_COLORS.nodeStroke}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-mono)',
                        fontSize: s.font - 1,
                        color: DSA_COLORS.nodeText,
                      }}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
})
