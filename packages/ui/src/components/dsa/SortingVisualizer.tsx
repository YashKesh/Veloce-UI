import { forwardRef, useImperativeHandle, useMemo, type CSSProperties } from 'react'
import { cx } from '../../utils/cx'
import { DSA_COLORS } from './dsaCommon'
import { usePlayback, type PlaybackState } from './usePlayback'
import { PlaybackControls } from './PlaybackControls'

export type SortAlgorithm = 'bubble' | 'selection' | 'insertion' | 'quick' | 'merge'

export interface SortStep {
  arr: number[]
  /** Indices being compared / examined this step. */
  compare?: number[]
  /** Indices being swapped. */
  swap?: number[]
  /** Indices now in their final position. */
  done?: number[]
  /** Short description for the step. */
  caption?: string
}

export interface SortingVisualizerHandle {
  playback: PlaybackState<SortStep>
}

export interface SortingVisualizerProps {
  data?: number[]
  defaultData?: number[]
  algorithm?: SortAlgorithm
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

function bubbleSteps(input: number[]): SortStep[] {
  const a = input.slice()
  const steps: SortStep[] = [{ arr: a.slice(), caption: 'start' }]
  const n = a.length
  const done = new Set<number>()
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      steps.push({ arr: a.slice(), compare: [j, j + 1], done: Array.from(done), caption: `compare ${a[j]} and ${a[j + 1]}` })
      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        steps.push({ arr: a.slice(), swap: [j, j + 1], done: Array.from(done), caption: `swap` })
      }
    }
    done.add(n - 1 - i)
  }
  steps.push({ arr: a.slice(), done: Array.from({ length: n }, (_, i) => i), caption: 'sorted' })
  return steps
}

function selectionSteps(input: number[]): SortStep[] {
  const a = input.slice()
  const steps: SortStep[] = [{ arr: a.slice(), caption: 'start' }]
  const n = a.length
  const done = new Set<number>()
  for (let i = 0; i < n; i++) {
    let min = i
    for (let j = i + 1; j < n; j++) {
      steps.push({ arr: a.slice(), compare: [min, j], done: Array.from(done), caption: `min so far = ${a[min]}, compare with ${a[j]}` })
      if (a[j] < a[min]) min = j
    }
    if (min !== i) {
      ;[a[i], a[min]] = [a[min], a[i]]
      steps.push({ arr: a.slice(), swap: [i, min], done: Array.from(done), caption: `swap min into position ${i}` })
    }
    done.add(i)
  }
  steps.push({ arr: a.slice(), done: Array.from({ length: n }, (_, i) => i), caption: 'sorted' })
  return steps
}

function insertionSteps(input: number[]): SortStep[] {
  const a = input.slice()
  const steps: SortStep[] = [{ arr: a.slice(), caption: 'start' }]
  for (let i = 1; i < a.length; i++) {
    const key = a[i]
    let j = i - 1
    steps.push({ arr: a.slice(), compare: [i], caption: `pick key = ${key}` })
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j]
      steps.push({ arr: a.slice(), swap: [j, j + 1], caption: `shift ${a[j + 1]} right` })
      j--
    }
    a[j + 1] = key
    steps.push({ arr: a.slice(), swap: [j + 1], caption: `insert key at ${j + 1}` })
  }
  steps.push({ arr: a.slice(), done: Array.from({ length: a.length }, (_, i) => i), caption: 'sorted' })
  return steps
}

function quickSteps(input: number[]): SortStep[] {
  const a = input.slice()
  const steps: SortStep[] = [{ arr: a.slice(), caption: 'start' }]
  const done = new Set<number>()
  function part(lo: number, hi: number) {
    const pivot = a[hi]
    let i = lo - 1
    for (let j = lo; j < hi; j++) {
      steps.push({ arr: a.slice(), compare: [j, hi], done: Array.from(done), caption: `pivot = ${pivot}; test ${a[j]}` })
      if (a[j] <= pivot) {
        i++
        if (i !== j) {
          ;[a[i], a[j]] = [a[j], a[i]]
          steps.push({ arr: a.slice(), swap: [i, j], done: Array.from(done), caption: `swap` })
        }
      }
    }
    ;[a[i + 1], a[hi]] = [a[hi], a[i + 1]]
    steps.push({ arr: a.slice(), swap: [i + 1, hi], done: Array.from(done), caption: `pivot to position ${i + 1}` })
    done.add(i + 1)
    return i + 1
  }
  function sort(lo: number, hi: number) {
    if (lo >= hi) {
      if (lo === hi) done.add(lo)
      return
    }
    const p = part(lo, hi)
    sort(lo, p - 1)
    sort(p + 1, hi)
  }
  sort(0, a.length - 1)
  steps.push({ arr: a.slice(), done: Array.from({ length: a.length }, (_, i) => i), caption: 'sorted' })
  return steps
}

function mergeSteps(input: number[]): SortStep[] {
  const a = input.slice()
  const steps: SortStep[] = [{ arr: a.slice(), caption: 'start' }]
  function merge(lo: number, mid: number, hi: number) {
    const left = a.slice(lo, mid + 1)
    const right = a.slice(mid + 1, hi + 1)
    let i = 0, j = 0, k = lo
    while (i < left.length && j < right.length) {
      steps.push({ arr: a.slice(), compare: [lo + i, mid + 1 + j], caption: `merge: compare ${left[i]} vs ${right[j]}` })
      if (left[i] <= right[j]) a[k++] = left[i++]
      else a[k++] = right[j++]
      steps.push({ arr: a.slice(), swap: [k - 1], caption: `write at ${k - 1}` })
    }
    while (i < left.length) { a[k++] = left[i++]; steps.push({ arr: a.slice(), swap: [k - 1], caption: `drain left` }) }
    while (j < right.length) { a[k++] = right[j++]; steps.push({ arr: a.slice(), swap: [k - 1], caption: `drain right` }) }
  }
  function sort(lo: number, hi: number) {
    if (lo >= hi) return
    const mid = (lo + hi) >> 1
    sort(lo, mid)
    sort(mid + 1, hi)
    merge(lo, mid, hi)
  }
  sort(0, a.length - 1)
  steps.push({ arr: a.slice(), done: Array.from({ length: a.length }, (_, i) => i), caption: 'sorted' })
  return steps
}

const BUILDERS: Record<SortAlgorithm, (a: number[]) => SortStep[]> = {
  bubble: bubbleSteps,
  selection: selectionSteps,
  insertion: insertionSteps,
  quick: quickSteps,
  merge: mergeSteps,
}

/* ─── Component ─────────────────────────────────────────────────────────── */

export const SortingVisualizer = forwardRef<SortingVisualizerHandle, SortingVisualizerProps>(function SortingVisualizer(
  {
    data,
    defaultData,
    algorithm = 'bubble',
    intervalMs = 220,
    autoPlay = false,
    width = 480,
    height = 220,
    showControls = true,
    className,
    style,
    'aria-label': ariaLabel = 'Sorting algorithm visualiser',
  },
  ref,
) {
  const source = data ?? defaultData ?? [8, 3, 1, 7, 4, 6, 2, 5]

  const playback = usePlayback<SortStep>({
    buildSteps: () => BUILDERS[algorithm](source),
    intervalMs,
    autoPlay,
    deps: [algorithm, source.join(',')],
  })

  useImperativeHandle(ref, () => ({ playback }), [playback])

  const { snapshot } = playback
  const arr = snapshot?.arr ?? source
  const max = Math.max(...arr, 1)

  const barW = useMemo(() => (width - (arr.length + 1) * 4) / arr.length, [width, arr.length])

  const barFill = (i: number) => {
    if (snapshot?.swap?.includes(i)) return DSA_COLORS.highlight
    if (snapshot?.compare?.includes(i)) return 'color-mix(in oklch, var(--ac) 60%, var(--bg-2))'
    if (snapshot?.done?.includes(i)) return DSA_COLORS.visitedStroke
    return DSA_COLORS.nodeStroke
  }

  return (
    <div
      className={cx('vl-sorting-vis', className)}
      style={{ display: 'flex', flexDirection: 'column', gap: 10, width, maxWidth: '100%', ...style }}
      data-vl-dsa="sorting-visualizer"
      data-algorithm={algorithm}
    >
      <svg
        role="img"
        aria-label={ariaLabel}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ background: 'var(--bg-1)', border: `1px solid ${DSA_COLORS.nodeStroke}`, borderRadius: 'var(--r-md)' }}
      >
        {arr.map((v, i) => {
          const h = (v / max) * (height - 36)
          const x = 4 + i * (barW + 4)
          const y = height - 20 - h
          return (
            <g key={i} style={{ transition: 'transform 180ms var(--ease-swift-out, ease-out)' }}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx={3}
                fill={barFill(i)}
                stroke={snapshot?.compare?.includes(i) ? DSA_COLORS.highlight : 'none'}
                strokeWidth={snapshot?.compare?.includes(i) ? 1 : 0}
                style={{ transition: 'fill 180ms, y 220ms' }}
              />
              <text
                x={x + barW / 2}
                y={height - 6}
                textAnchor="middle"
                fontSize={10}
                fontFamily="var(--font-mono)"
                fill="var(--fg-3)"
              >
                {v}
              </text>
            </g>
          )
        })}
      </svg>
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
