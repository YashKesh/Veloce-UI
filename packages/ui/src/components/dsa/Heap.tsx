import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { cx } from '../../utils/cx'
import { DSA_COLORS, SIZE_PX, type DsaSize } from './dsaCommon'

export type HeapKind = 'min' | 'max'

export interface HeapHandle {
  insert: (value: number) => Promise<void>
  extract: () => Promise<number | undefined>
  reset: () => void
  snapshot: () => number[]
  stop: () => void
}

export interface HeapProps {
  data?: number[]
  defaultData?: number[]
  kind?: HeapKind
  size?: DsaSize
  intervalMs?: number
  onChange?: (next: number[]) => void
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

/* ─── Pure heap helpers (array-based binary heap) ───────────────────────── */

const parent = (i: number) => Math.floor((i - 1) / 2)
const left = (i: number) => 2 * i + 1
const right = (i: number) => 2 * i + 2

function swap(a: number[], i: number, j: number) {
  ;[a[i], a[j]] = [a[j], a[i]]
}

/** Yields each (array, highlightedIdx) snapshot as the value bubbles up. */
function* siftUpSteps(a: number[], i: number, cmp: (x: number, y: number) => boolean): Generator<[number[], number]> {
  yield [a.slice(), i]
  while (i > 0) {
    const p = parent(i)
    if (cmp(a[i], a[p])) {
      swap(a, i, p)
      i = p
      yield [a.slice(), i]
    } else break
  }
}

function* siftDownSteps(a: number[], i: number, cmp: (x: number, y: number) => boolean): Generator<[number[], number]> {
  yield [a.slice(), i]
  const n = a.length
  while (true) {
    const l = left(i), r = right(i)
    let best = i
    if (l < n && cmp(a[l], a[best])) best = l
    if (r < n && cmp(a[r], a[best])) best = r
    if (best === i) break
    swap(a, i, best)
    i = best
    yield [a.slice(), i]
  }
}

/* ─── Component ─────────────────────────────────────────────────────────── */

export const Heap = forwardRef<HeapHandle, HeapProps>(function Heap(
  {
    data,
    defaultData,
    kind = 'min',
    size = 'md',
    intervalMs = 400,
    onChange,
    className,
    style,
    'aria-label': ariaLabel = 'Binary heap',
  },
  ref,
) {
  const [internal, setInternal] = useState<number[]>(() => data ?? defaultData ?? [])
  const heap = data ?? internal
  const [highlight, setHighlight] = useState<number | null>(null)
  const stopRef = useRef(false)

  useEffect(() => {
    if (data !== undefined) setInternal(data)
  }, [data])

  const commit = (next: number[]) => {
    if (data === undefined) setInternal(next)
    onChange?.(next)
  }

  const cmp = kind === 'min' ? (x: number, y: number) => x < y : (x: number, y: number) => x > y

  const runSteps = async (initial: number[], gen: Generator<[number[], number]>) => {
    stopRef.current = false
    let last = initial
    for (const [arr, idx] of gen) {
      if (stopRef.current) break
      last = arr
      commit(arr)
      setHighlight(idx)
      await new Promise((r) => setTimeout(r, intervalMs))
    }
    setHighlight(null)
    return last
  }

  useImperativeHandle(
    ref,
    () => ({
      async insert(value: number) {
        const next = [...heap, value]
        commit(next)
        await runSteps(next, siftUpSteps(next, next.length - 1, cmp))
      },
      async extract() {
        if (heap.length === 0) return undefined
        const top = heap[0]
        const next = heap.slice()
        const last = next.pop()!
        if (next.length > 0) {
          next[0] = last
          commit(next)
          await runSteps(next, siftDownSteps(next, 0, cmp))
        } else {
          commit([])
        }
        return top
      },
      reset: () => commit(defaultData ?? []),
      snapshot: () => heap.slice(),
      stop: () => { stopRef.current = true },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [heap, cmp, intervalMs],
  )

  useEffect(() => () => { stopRef.current = true }, [])

  /* ─── Layout: array indices mapped to complete-tree positions ──────── */
  const s = SIZE_PX[size]
  const r = s.node / 2
  const n = heap.length
  const depth = n === 0 ? 0 : Math.floor(Math.log2(n)) + 1
  const bottomW = Math.pow(2, Math.max(0, depth - 1))
  const canvasW = Math.max(120, bottomW * (r * 2 + 24))
  const canvasH = depth * (r * 2 + 32) + r * 2
  const nodePos = useMemo(() => {
    return heap.map((_, i) => {
      const d = Math.floor(Math.log2(i + 1))
      const posInLevel = i - (Math.pow(2, d) - 1)
      const nodesInLevel = Math.pow(2, d)
      const x = (canvasW / (nodesInLevel + 1)) * (posInLevel + 1)
      const y = r + d * (r * 2 + 32)
      return { x, y }
    })
  }, [heap, canvasW, r])

  if (n === 0) {
    return (
      <div
        className={cx('vl-heap', className)}
        style={{
          width: 180, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px dashed ${DSA_COLORS.nodeStroke}`, borderRadius: 8, color: DSA_COLORS.edge,
          fontSize: 12, fontFamily: 'var(--font-mono)', ...style,
        }}
      >
        empty heap
      </div>
    )
  }

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      width={canvasW}
      height={canvasH}
      viewBox={`0 0 ${canvasW} ${canvasH}`}
      className={cx('vl-heap', className)}
      style={{ fontFamily: 'var(--font-sans)', overflow: 'visible', ...style }}
      data-vl-dsa="heap"
      data-kind={kind}
    >
      {/* edges */}
      {heap.map((_, i) => {
        if (i === 0) return null
        const p = parent(i)
        const a = nodePos[p]
        const b = nodePos[i]
        return (
          <line
            key={`e${i}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={highlight === i || highlight === p ? DSA_COLORS.highlight : DSA_COLORS.edge}
            strokeWidth={1.25}
            style={{ transition: 'stroke 180ms' }}
          />
        )
      })}
      {/* nodes */}
      {heap.map((v, i) => {
        const pos = nodePos[i]
        const isHl = highlight === i
        const isRoot = i === 0
        return (
          <g key={`n${i}`} style={{ transition: 'transform 220ms var(--ease-swift-out, ease-out)' }}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={r}
              fill={isHl ? DSA_COLORS.highlightFill : isRoot ? 'color-mix(in oklch, var(--ac) 10%, var(--bg-2))' : DSA_COLORS.nodeFill}
              stroke={isHl ? DSA_COLORS.highlight : isRoot ? DSA_COLORS.highlight : DSA_COLORS.nodeStroke}
              strokeWidth={isHl || isRoot ? 1.75 : 1}
              style={{ transition: 'fill 180ms, stroke 180ms' }}
            />
            <text
              x={pos.x}
              y={pos.y - 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={s.font}
              fontFamily="var(--font-mono)"
              fontWeight={isRoot ? 600 : 400}
              fill={DSA_COLORS.nodeText}
            >
              {v}
            </text>
            <text
              x={pos.x}
              y={pos.y + r + 10}
              textAnchor="middle"
              fontSize={9}
              fontFamily="var(--font-mono)"
              fill={DSA_COLORS.edge}
            >
              [{i}]
            </text>
          </g>
        )
      })}
    </svg>
  )
})
