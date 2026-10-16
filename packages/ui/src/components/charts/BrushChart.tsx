import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as RPointerEvent,
} from 'react'
import { cx } from '../../utils/cx'
import { LineChart, type LineChartProps, type LineChartSeries } from './LineChart'

export interface BrushRange {
  from: number
  to: number
}

export interface BrushChartProps
  extends Omit<LineChartProps, 'data' | 'width' | 'height'> {
  data: { label: string; value: number }[]
  series?: LineChartSeries[]
  width?: number
  /** Main chart height (overview strip is drawn below, 48px tall). */
  height?: number
  /** Controlled range (indices into `data`). */
  range?: BrushRange
  defaultRange?: BrushRange
  onRangeChange?: (range: BrushRange) => void
  overviewHeight?: number
  overviewColor?: string
}

const OVERVIEW_PAD_L = 40
const OVERVIEW_PAD_R = 12

export const BrushChart = forwardRef<HTMLDivElement, BrushChartProps>(function BrushChart(
  {
    data,
    series,
    width = 560,
    height = 240,
    range,
    defaultRange,
    onRangeChange,
    overviewHeight = 48,
    overviewColor,
    className,
    style,
    ...lineProps
  },
  ref,
) {
  const n = data.length
  const seed: BrushRange = defaultRange ?? { from: 0, to: Math.max(0, n - 1) }
  const [internal, setInternal] = useState<BrushRange>(seed)
  const current = range ?? internal

  const commit = useCallback(
    (next: BrushRange) => {
      const clamped = {
        from: Math.max(0, Math.min(n - 1, Math.min(next.from, next.to))),
        to: Math.max(0, Math.min(n - 1, Math.max(next.from, next.to))),
      }
      if (range === undefined) setInternal(clamped)
      onRangeChange?.(clamped)
    },
    [n, onRangeChange, range],
  )

  // Clamp internal range if `data` length changes.
  useEffect(() => {
    if (range !== undefined) return
    setInternal((r) => ({
      from: Math.min(r.from, Math.max(0, n - 1)),
      to: Math.min(r.to, Math.max(0, n - 1)),
    }))
  }, [n, range])

  // Slice data + series by the current range.
  const sliced = data.slice(current.from, current.to + 1)
  const slicedSeries = series?.map((s) => ({
    ...s,
    data: s.data.slice(current.from, current.to + 1),
  }))

  /* ── Overview strip ──────────────────────────────────────── */

  const stripRef = useRef<HTMLDivElement | null>(null)
  const stripW = width

  const flat = (series && series.length > 0 ? series.flatMap((s) => s.data) : data.map((d) => d.value))
  const yMin = Math.min(...flat, 0)
  const yMax = Math.max(...flat, 1)

  const innerW = stripW - OVERVIEW_PAD_L - OVERVIEW_PAD_R
  const xFor = (i: number) =>
    OVERVIEW_PAD_L + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW)
  const pxToIndex = (clientX: number) => {
    const rect = stripRef.current?.getBoundingClientRect()
    if (!rect) return 0
    const x = Math.max(0, Math.min(innerW, clientX - rect.left - OVERVIEW_PAD_L))
    return Math.round((x / innerW) * (n - 1))
  }

  type Drag = { kind: 'from' | 'to' | 'move'; startFrom: number; startTo: number; startIdx: number } | null
  const [drag, setDrag] = useState<Drag>(null)

  const onDown = (kind: 'from' | 'to' | 'move') => (e: RPointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const target = e.currentTarget
    target.setPointerCapture?.(e.pointerId)
    const startIdx = pxToIndex(e.clientX)
    setDrag({ kind, startFrom: current.from, startTo: current.to, startIdx })
  }

  // Track drag with window listeners so release outside the strip still works.
  useEffect(() => {
    if (!drag) return
    const onMove = (e: PointerEvent) => {
      const idx = pxToIndex(e.clientX)
      const delta = idx - drag.startIdx
      if (drag.kind === 'from') commit({ from: idx, to: drag.startTo })
      else if (drag.kind === 'to') commit({ from: drag.startFrom, to: idx })
      else {
        const span = drag.startTo - drag.startFrom
        const nextFrom = Math.max(0, Math.min(n - 1 - span, drag.startFrom + delta))
        commit({ from: nextFrom, to: nextFrom + span })
      }
    }
    const onUp = () => setDrag(null)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag])

  const onStripDown = (e: RPointerEvent<HTMLDivElement>) => {
    // Click-and-drag to create a new selection
    e.preventDefault()
    const target = e.currentTarget
    target.setPointerCapture?.(e.pointerId)
    const start = pxToIndex(e.clientX)
    commit({ from: start, to: start })
    setDrag({ kind: 'to', startFrom: start, startTo: start, startIdx: start })
  }

  const fromX = xFor(current.from)
  const toX = xFor(current.to)
  const selLeft = Math.min(fromX, toX)
  const selWidth = Math.max(2, Math.abs(toX - fromX))

  /* ── Overview mini chart path ────────────────────────────── */

  const miniPath = (() => {
    if (n === 0) return ''
    const innerH = overviewHeight - 10
    const yFor = (v: number) => 5 + innerH - ((v - yMin) / (yMax - yMin || 1)) * innerH
    return data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(d.value)}`)
      .join(' ')
  })()

  const wrap: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    width,
    ...style,
  }
  const strip: CSSProperties = {
    position: 'relative',
    width,
    height: overviewHeight,
    cursor: 'crosshair',
    userSelect: 'none',
    touchAction: 'none',
  }
  const sel: CSSProperties = {
    position: 'absolute',
    left: selLeft,
    top: 0,
    width: selWidth,
    height: overviewHeight,
    background: 'color-mix(in oklch, var(--ac) 15%, transparent)',
    border: '1px solid var(--ac)',
    borderRadius: 2,
    cursor: 'grab',
    boxSizing: 'border-box',
  }
  const handle = (side: 'left' | 'right'): CSSProperties => ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    [side]: -4,
    width: 8,
    cursor: 'ew-resize',
    background: 'transparent',
  })

  return (
    <div ref={ref} className={cx('vl-brush-chart', className)} style={wrap}>
      <LineChart
        {...lineProps}
        data={sliced}
        series={slicedSeries}
        width={width}
        height={height}
      />

      <div ref={stripRef} style={strip} onPointerDown={onStripDown}>
        <svg
          width={width}
          height={overviewHeight}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          <rect x={OVERVIEW_PAD_L} y={0} width={innerW} height={overviewHeight} fill="var(--bg-2)" rx={2} />
          <path d={miniPath} fill="none" stroke={overviewColor ?? 'var(--fg-3)'} strokeWidth={1.25} />
        </svg>
        <div style={sel} onPointerDown={onDown('move')}>
          <div style={handle('left')} onPointerDown={onDown('from')} />
          <div style={handle('right')} onPointerDown={onDown('to')} />
        </div>
      </div>
    </div>
  )
})
