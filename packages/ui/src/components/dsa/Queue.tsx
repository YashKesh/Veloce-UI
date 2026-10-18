import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { cx } from '../../utils/cx'
import { DSA_COLORS, SIZE_PX, type DsaSize } from './dsaCommon'

export type QueueVariant = 'fifo' | 'deque'

export interface QueueHandle<T> {
  enqueue: (value: T) => void
  dequeue: () => T | undefined
  /** Deque only: push to the front. */
  pushFront: (value: T) => void
  /** Deque only: pop from the back. */
  popBack: () => T | undefined
  peek: () => T | undefined
  clear: () => void
  snapshot: () => T[]
}

export interface QueueProps<T = string | number> {
  data?: T[]
  defaultData?: T[]
  variant?: QueueVariant
  size?: DsaSize
  maxVisible?: number
  renderNode?: (value: T, index: number, isFront: boolean, isBack: boolean) => ReactNode
  onChange?: (next: T[]) => void
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

export const Queue = forwardRef(function Queue<T>(
  {
    data,
    defaultData,
    variant = 'fifo',
    size = 'md',
    maxVisible = 7,
    renderNode,
    onChange,
    className,
    style,
    'aria-label': ariaLabel = 'Queue',
  }: QueueProps<T>,
  ref: React.Ref<QueueHandle<T>>,
) {
  const [internal, setInternal] = useState<T[]>(() => data ?? defaultData ?? [])
  const queue = data ?? internal

  useEffect(() => {
    if (data !== undefined) setInternal(data)
  }, [data])

  const commit = useCallback(
    (next: T[]) => {
      if (data === undefined) setInternal(next)
      onChange?.(next)
    },
    [data, onChange],
  )

  useImperativeHandle(
    ref,
    () => ({
      enqueue: (v: T) => commit([...queue, v]),
      dequeue: () => {
        const front = queue[0]
        commit(queue.slice(1))
        return front
      },
      pushFront: (v: T) => commit([v, ...queue]),
      popBack: () => {
        const back = queue[queue.length - 1]
        commit(queue.slice(0, -1))
        return back
      },
      peek: () => queue[0],
      clear: () => commit([]),
      snapshot: () => queue.slice(),
    }),
    [queue, commit],
  )

  const s = SIZE_PX[size]
  const nodeW = s.node * 1.6
  const nodeH = s.node * 0.9

  const visible = queue.slice(0, maxVisible)
  const trimmed = queue.length - visible.length

  const outer: CSSProperties = {
    display: 'inline-flex',
    flexDirection: 'column',
    gap: 10,
    fontFamily: 'var(--font-sans)',
    ...style,
  }

  const container: CSSProperties = {
    display: 'inline-flex',
    gap: 2,
    padding: 10,
    borderRadius: 'var(--r-md)',
    background: 'var(--bg-1)',
    border: `1px dashed ${DSA_COLORS.nodeStroke}`,
    alignItems: 'center',
    position: 'relative',
    minHeight: nodeH + 20,
    minWidth: nodeW + 20,
  }

  const labelRow: CSSProperties = {
    display: 'inline-flex',
    justifyContent: 'space-between',
    width: '100%',
    fontSize: 10,
    color: 'var(--fg-3)',
    fontFamily: 'var(--font-mono)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    padding: '0 4px',
  }

  const frame = (isFront: boolean, isBack: boolean): CSSProperties => ({
    width: nodeW,
    height: nodeH,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: s.font,
    color: DSA_COLORS.nodeText,
    background: isFront || isBack ? DSA_COLORS.highlightFill : DSA_COLORS.nodeFill,
    border: `1px solid ${isFront || isBack ? DSA_COLORS.highlight : DSA_COLORS.nodeStroke}`,
    transition: 'background 180ms, border-color 180ms',
    animation: isBack ? 'vl-queue-in 240ms var(--ease-swift-out, ease-out)' : undefined,
  })

  return (
    <div className={cx('vl-queue', className)} style={outer} role="list" aria-label={ariaLabel} data-vl-dsa="queue" data-variant={variant}>
      <style>{`
        @keyframes vl-queue-in {
          from { transform: translateX(10px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
      <div style={labelRow}>
        <span>front</span>
        <span>back</span>
      </div>
      <div style={container}>
        {visible.map((v, i) => {
          const isFront = i === 0
          const isBack = i === visible.length - 1
          return (
            <div
              key={`${i}-${String(v)}`}
              role="listitem"
              style={frame(isFront, isBack)}
            >
              {renderNode ? renderNode(v, i, isFront, isBack) : String(v)}
            </div>
          )
        })}
        {trimmed > 0 && (
          <div style={{ fontSize: 10, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', padding: '0 6px' }}>
            +{trimmed}
          </div>
        )}
        {queue.length === 0 && (
          <div style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', padding: '0 10px' }}>
            empty
          </div>
        )}
      </div>
    </div>
  )
}) as <T>(
  p: QueueProps<T> & { ref?: React.Ref<QueueHandle<T>> },
) => React.ReactElement
