import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { cx } from '../../utils/cx'
import { DSA_COLORS, SIZE_PX, type DsaSize } from './dsaCommon'

export type LinkedListVariant = 'singly' | 'doubly'

export interface LinkedListHandle<T> {
  push: (value: T) => void
  unshift: (value: T) => void
  insert: (index: number, value: T) => void
  remove: (index: number) => void
  pop: () => void
  shift: () => void
  highlight: (index: number | null) => void
  snapshot: () => T[]
}

export interface LinkedListProps<T = string | number> {
  data?: T[]
  defaultData?: T[]
  variant?: LinkedListVariant
  size?: DsaSize
  /** Index of the currently highlighted node (controlled). */
  highlighted?: number | null
  /** Render a null-terminator cell at the tail. Default true. */
  showNull?: boolean
  /** Node renderer. Receives value + index + highlight state. */
  renderNode?: (value: T, index: number, highlighted: boolean) => ReactNode
  onChange?: (next: T[]) => void
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

export const LinkedList = forwardRef(function LinkedList<T>(
  {
    data,
    defaultData,
    variant = 'singly',
    size = 'md',
    highlighted: highlightedProp,
    showNull = true,
    renderNode,
    onChange,
    className,
    style,
    'aria-label': ariaLabel = 'Linked list',
  }: LinkedListProps<T>,
  ref: React.Ref<LinkedListHandle<T>>,
) {
  const [internal, setInternal] = useState<T[]>(() => data ?? defaultData ?? [])
  const list = data ?? internal
  const [innerHl, setInnerHl] = useState<number | null>(null)
  const hl = highlightedProp !== undefined ? highlightedProp : innerHl

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
      push: (v: T) => commit([...list, v]),
      unshift: (v: T) => commit([v, ...list]),
      insert: (i: number, v: T) => {
        const next = list.slice()
        next.splice(Math.max(0, Math.min(list.length, i)), 0, v)
        commit(next)
      },
      remove: (i: number) => {
        if (i < 0 || i >= list.length) return
        const next = list.slice()
        next.splice(i, 1)
        commit(next)
      },
      pop: () => commit(list.slice(0, -1)),
      shift: () => commit(list.slice(1)),
      highlight: (i: number | null) => setInnerHl(i),
      snapshot: () => list.slice(),
    }),
    [list, commit],
  )

  const s = SIZE_PX[size]
  const nodeW = s.node * 1.8
  const nodeH = s.node
  const gap = s.gap

  // Layout
  const items = useMemo(() => {
    const out: { x: number; value: T | null; isNull: boolean; index: number }[] = []
    let x = 0
    list.forEach((v, i) => {
      out.push({ x, value: v, isNull: false, index: i })
      x += nodeW + gap
    })
    if (showNull) out.push({ x, value: null, isNull: true, index: list.length })
    return out
  }, [list, nodeW, gap, showNull])

  const width = items.length === 0 ? 2 * nodeW : items[items.length - 1].x + nodeW
  const height = nodeH + 20

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cx('vl-linked-list', className)}
      style={{ fontFamily: 'var(--font-sans)', overflow: 'visible', ...style }}
      data-vl-dsa="linked-list"
      data-variant={variant}
    >
      <defs>
        <marker id={`vl-ll-arr-${variant}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" fill={DSA_COLORS.edge} />
        </marker>
      </defs>

      {/* Edges */}
      {items.map((item, i) => {
        if (i === items.length - 1) return null
        const next = items[i + 1]
        const y = nodeH / 2 + 10
        return (
          <g key={`e${i}`}>
            {/* forward arrow (singly) */}
            <line
              x1={item.x + nodeW}
              y1={y - (variant === 'doubly' ? 4 : 0)}
              x2={next.x - 2}
              y2={y - (variant === 'doubly' ? 4 : 0)}
              stroke={DSA_COLORS.edge}
              strokeWidth={1.5}
              markerEnd={`url(#vl-ll-arr-${variant})`}
            />
            {variant === 'doubly' && !next.isNull && (
              <line
                x1={next.x}
                y1={y + 4}
                x2={item.x + nodeW + 2}
                y2={y + 4}
                stroke={DSA_COLORS.edge}
                strokeWidth={1.5}
                markerEnd={`url(#vl-ll-arr-${variant})`}
              />
            )}
          </g>
        )
      })}

      {/* Nodes */}
      {items.map((item) => {
        const isHl = !item.isNull && item.index === hl
        if (item.isNull) {
          return (
            <g key={`n-null`} transform={`translate(${item.x}, 10)`}>
              <rect
                width={nodeW}
                height={nodeH}
                rx={6}
                fill="transparent"
                stroke={DSA_COLORS.edge}
                strokeDasharray="3 3"
                strokeWidth={1}
              />
              <text x={nodeW / 2} y={nodeH / 2} textAnchor="middle" dominantBaseline="middle" fill={DSA_COLORS.edge} fontSize={s.font}>
                null
              </text>
            </g>
          )
        }
        return (
          <g key={`n${item.index}`} transform={`translate(${item.x}, 10)`}>
            <rect
              width={nodeW}
              height={nodeH}
              rx={6}
              fill={isHl ? DSA_COLORS.highlightFill : DSA_COLORS.nodeFill}
              stroke={isHl ? DSA_COLORS.highlight : DSA_COLORS.nodeStroke}
              strokeWidth={isHl ? 1.75 : 1}
              style={{ transition: 'fill 180ms, stroke 180ms' }}
            />
            {/* Divider for pointer cell */}
            <line
              x1={nodeW * 0.65}
              y1={0}
              x2={nodeW * 0.65}
              y2={nodeH}
              stroke={isHl ? DSA_COLORS.highlight : DSA_COLORS.nodeStroke}
              strokeWidth={1}
              opacity={0.5}
            />
            {renderNode ? (
              <foreignObject x={0} y={0} width={nodeW * 0.65} height={nodeH}>
                <div
                  style={{
                    width: '100%', height: '100%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-sans)', fontSize: s.font, color: DSA_COLORS.nodeText,
                  }}
                >
                  {renderNode(item.value!, item.index, isHl)}
                </div>
              </foreignObject>
            ) : (
              <text
                x={nodeW * 0.325}
                y={nodeH / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={s.font}
                fontFamily="var(--font-mono)"
                fill={DSA_COLORS.nodeText}
              >
                {String(item.value)}
              </text>
            )}
            {/* Pointer dot */}
            <circle cx={nodeW * 0.825} cy={nodeH / 2} r={2.5} fill={DSA_COLORS.edge} />
          </g>
        )
      })}
    </svg>
  )
}) as <T>(
  p: LinkedListProps<T> & { ref?: React.Ref<LinkedListHandle<T>> },
) => React.ReactElement
