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

export interface DsaStackHandle<T> {
  push: (value: T) => void
  pop: () => T | undefined
  peek: () => T | undefined
  clear: () => void
  snapshot: () => T[]
}

export interface DsaStackProps<T = string | number> {
  data?: T[]
  defaultData?: T[]
  size?: DsaSize
  /** Max number of visible frames before the stack scrolls. Default 8. */
  maxVisible?: number
  renderNode?: (value: T, index: number, isTop: boolean) => ReactNode
  onChange?: (next: T[]) => void
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

export const DsaStack = forwardRef(function DsaStack<T>(
  {
    data,
    defaultData,
    size = 'md',
    maxVisible = 8,
    renderNode,
    onChange,
    className,
    style,
    'aria-label': ariaLabel = 'Stack',
  }: DsaStackProps<T>,
  ref: React.Ref<DsaStackHandle<T>>,
) {
  const [internal, setInternal] = useState<T[]>(() => data ?? defaultData ?? [])
  const stack = data ?? internal

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
      push: (v: T) => commit([...stack, v]),
      pop: () => {
        const top = stack[stack.length - 1]
        commit(stack.slice(0, -1))
        return top
      },
      peek: () => stack[stack.length - 1],
      clear: () => commit([]),
      snapshot: () => stack.slice(),
    }),
    [stack, commit],
  )

  const s = SIZE_PX[size]
  const nodeW = s.node * 2.2
  const nodeH = s.node * 0.95

  // Top of stack is drawn at the top of the visual.
  const visible = stack.slice(-maxVisible)
  const trimmed = stack.length - visible.length

  const containerStyle: CSSProperties = {
    display: 'inline-flex',
    flexDirection: 'column',
    gap: 2,
    padding: 10,
    borderRadius: 'var(--r-md)',
    background: 'var(--bg-1)',
    border: `1px dashed ${DSA_COLORS.nodeStroke}`,
    minHeight: nodeH + 24,
    minWidth: nodeW + 20,
    alignItems: 'center',
    position: 'relative',
    fontFamily: 'var(--font-sans)',
    ...style,
  }

  const topLabel: CSSProperties = {
    position: 'absolute',
    top: -8,
    right: 10,
    padding: '2px 6px',
    fontSize: 10,
    background: 'var(--bg-1)',
    color: 'var(--fg-3)',
    fontFamily: 'var(--font-mono)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  }

  const bottomLabel: CSSProperties = {
    position: 'absolute',
    bottom: -8,
    left: 10,
    padding: '2px 6px',
    fontSize: 10,
    background: 'var(--bg-1)',
    color: 'var(--fg-3)',
    fontFamily: 'var(--font-mono)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  }

  const frame = (isTop: boolean): CSSProperties => ({
    width: nodeW,
    height: nodeH,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: s.font,
    color: DSA_COLORS.nodeText,
    background: isTop ? DSA_COLORS.highlightFill : DSA_COLORS.nodeFill,
    border: `1px solid ${isTop ? DSA_COLORS.highlight : DSA_COLORS.nodeStroke}`,
    transition: 'background 180ms, border-color 180ms, transform 180ms',
    animation: isTop ? 'vl-dsa-stack-pop 220ms var(--ease-swift-out, ease-out)' : undefined,
  })

  return (
    <div
      role="list"
      aria-label={ariaLabel}
      className={cx('vl-dsa-stack', className)}
      style={containerStyle}
      data-vl-dsa="stack"
    >
      <style>{`
        @keyframes vl-dsa-stack-pop {
          from { transform: translateY(-6px); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
      `}</style>
      <span style={topLabel}>top</span>
      {trimmed > 0 && (
        <div style={{ fontSize: 10, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>
          +{trimmed} hidden
        </div>
      )}
      {visible
        .slice()
        .reverse()
        .map((v, i) => {
          const originalIdx = stack.length - 1 - i
          const isTop = i === 0
          return (
            <div
              key={`${originalIdx}-${String(v)}`}
              role="listitem"
              style={frame(isTop)}
            >
              {renderNode ? renderNode(v, originalIdx, isTop) : String(v)}
            </div>
          )
        })}
      {stack.length === 0 && (
        <div style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', padding: '8px 0' }}>
          empty
        </div>
      )}
      <span style={bottomLabel}>base</span>
    </div>
  )
}) as <T>(
  p: DsaStackProps<T> & { ref?: React.Ref<DsaStackHandle<T>> },
) => React.ReactElement
