import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { cx } from '../../utils/cx'
import { LineChart, type LineChartProps } from './LineChart'

export interface LiveLineChartHandle {
  push: (value: number) => void
  pause: () => void
  resume: () => void
  reset: () => void
  clear: () => void
}

export interface LiveLineChartProps
  extends Omit<LineChartProps, 'data' | 'width' | 'height'> {
  /** Max number of points kept in the ring buffer. Default 60. */
  maxPoints?: number
  /**
   * Optional source. If provided, LiveLineChart will call this every `intervalMs`
   * and append the result to the buffer. If omitted, you push manually via the ref.
   */
  source?: () => number
  intervalMs?: number
  width?: number
  height?: number
  /** Starting values. Length must be ≤ maxPoints. */
  initial?: number[]
  /** Format for the auto-generated label (defaults to index). */
  labelFor?: (i: number, timestampMs: number) => string
  defaultPaused?: boolean
  /** Show pause/resume toggle. Default true. */
  showControls?: boolean
}

/** Decimate an array to `target` points via even sampling. */
export function decimate(data: number[], target: number): number[] {
  if (data.length <= target || target <= 0) return data
  const out: number[] = []
  const step = data.length / target
  for (let i = 0; i < target; i++) {
    out.push(data[Math.floor(i * step)])
  }
  return out
}

export const LiveLineChart = forwardRef<LiveLineChartHandle, LiveLineChartProps>(
  function LiveLineChart(
    {
      maxPoints = 60,
      source,
      intervalMs = 1000,
      width = 480,
      height = 220,
      initial = [],
      labelFor,
      defaultPaused = false,
      showControls = true,
      className,
      style,
      ...lineProps
    },
    ref,
  ) {
    const [buffer, setBuffer] = useState<number[]>(() => initial.slice(-maxPoints))
    const [paused, setPaused] = useState(defaultPaused)
    const timestampStart = useRef<number>(Date.now())
    const indexCounter = useRef<number>(initial.length)

    const push = useCallback(
      (value: number) => {
        setBuffer((prev) => {
          const next = prev.length >= maxPoints ? prev.slice(1) : prev.slice()
          next.push(value)
          indexCounter.current += 1
          return next
        })
      },
      [maxPoints],
    )

    const pause = useCallback(() => setPaused(true), [])
    const resume = useCallback(() => setPaused(false), [])
    const clear = useCallback(() => {
      setBuffer([])
      indexCounter.current = 0
    }, [])
    const reset = useCallback(() => {
      setBuffer(initial.slice(-maxPoints))
      indexCounter.current = initial.length
    }, [initial, maxPoints])

    useImperativeHandle(ref, () => ({ push, pause, resume, reset, clear }), [push, pause, resume, reset, clear])

    useEffect(() => {
      if (!source || paused) return
      const id = window.setInterval(() => push(source()), intervalMs)
      return () => window.clearInterval(id)
    }, [source, paused, intervalMs, push])

    const data = buffer.map((value, i) => {
      const absIdx = indexCounter.current - buffer.length + i
      const ts = timestampStart.current + absIdx * intervalMs
      return { label: labelFor ? labelFor(absIdx, ts) : String(absIdx + 1), value }
    })

    const wrap: CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      width,
      ...style,
    }

    const btn: CSSProperties = {
      height: 26,
      padding: '0 10px',
      fontSize: 12,
      fontFamily: 'var(--font-sans)',
      borderRadius: 'var(--r-sm)',
      border: '1px solid var(--line-2)',
      background: 'var(--bg-2)',
      color: 'var(--fg-2)',
      cursor: 'pointer',
    }

    return (
      <div className={cx('vl-live-chart', className)} style={wrap}>
        <LineChart {...lineProps} data={data} width={width} height={height} showDots={false} />
        {showControls && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end', fontSize: 12 }}>
            <span style={{ color: 'var(--fg-3)', marginRight: 'auto', fontFamily: 'var(--font-mono)' }}>
              {buffer.length} / {maxPoints}
              {paused ? ' · paused' : ' · live'}
            </span>
            <button type="button" style={btn} onClick={() => setPaused((p) => !p)}>
              {paused ? '▶ Resume' : '❚❚ Pause'}
            </button>
            <button type="button" style={btn} onClick={clear}>
              Clear
            </button>
          </div>
        )}
      </div>
    )
  },
)
