import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { cx } from '../../utils/cx'
import { DSA_COLORS, SIZE_PX, layoutBinaryTree, type DsaSize, type TreeNodeInput } from './dsaCommon'

export type TraversalOrder = 'inorder' | 'preorder' | 'postorder' | 'levelorder'

export interface BinaryTreeHandle<T> {
  highlight: (predicate: ((v: T) => boolean) | null) => void
  highlightPath: (values: T[] | null) => void
  traverse: (order: TraversalOrder, intervalMs?: number) => Promise<void>
  stop: () => void
}

export interface BinaryTreeProps<T = string | number> {
  root: TreeNodeInput<T> | null
  size?: DsaSize
  /** Current highlighted values (controlled). */
  highlighted?: T[]
  /** Node radius override. */
  nodeRadius?: number
  xGap?: number
  yGap?: number
  renderNode?: (value: T, isHighlighted: boolean) => ReactNode
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

function flatten<T>(n: TreeNodeInput<T> | null | undefined, order: TraversalOrder, acc: T[] = []): T[] {
  if (!n) return acc
  if (order === 'preorder') {
    acc.push(n.value); flatten(n.left, order, acc); flatten(n.right, order, acc)
  } else if (order === 'inorder') {
    flatten(n.left, order, acc); acc.push(n.value); flatten(n.right, order, acc)
  } else if (order === 'postorder') {
    flatten(n.left, order, acc); flatten(n.right, order, acc); acc.push(n.value)
  } else {
    const q: (TreeNodeInput<T> | null | undefined)[] = [n]
    while (q.length) {
      const x = q.shift()
      if (!x) continue
      acc.push(x.value)
      q.push(x.left, x.right)
    }
  }
  return acc
}

export const BinaryTree = forwardRef(function BinaryTree<T>(
  {
    root,
    size = 'md',
    highlighted: highlightedProp,
    nodeRadius,
    xGap,
    yGap,
    renderNode,
    className,
    style,
    'aria-label': ariaLabel = 'Binary tree',
  }: BinaryTreeProps<T>,
  ref: React.Ref<BinaryTreeHandle<T>>,
) {
  const s = SIZE_PX[size]
  const r = nodeRadius ?? s.node / 2
  const xg = xGap ?? r * 2 + 20
  const yg = yGap ?? r * 2 + 36

  const { nodes, width, height } = useMemo(
    () => layoutBinaryTree(root, { xGap: xg, yGap: yg, originX: r + 6, originY: r + 6 }),
    [root, xg, yg, r],
  )

  const [innerHl, setInnerHl] = useState<Set<string> | null>(null)
  const hl = useMemo(() => {
    if (highlightedProp !== undefined) return new Set(highlightedProp.map((v) => String(v)))
    return innerHl
  }, [highlightedProp, innerHl])

  const stopRef = useRef(false)

  useImperativeHandle(
    ref,
    () => ({
      highlight: (predicate) => {
        if (!predicate) return setInnerHl(null)
        const set = new Set<string>()
        for (const n of nodes) if (predicate(n.value)) set.add(String(n.value))
        setInnerHl(set)
      },
      highlightPath: (values) => {
        if (!values) return setInnerHl(null)
        setInnerHl(new Set(values.map((v) => String(v))))
      },
      traverse: async (order, intervalMs = 450) => {
        stopRef.current = false
        const sequence = flatten(root, order)
        const acc: string[] = []
        for (const v of sequence) {
          if (stopRef.current) break
          acc.push(String(v))
          setInnerHl(new Set(acc))
          await new Promise((res) => setTimeout(res, intervalMs))
        }
      },
      stop: () => { stopRef.current = true },
    }),
    [nodes, root],
  )

  useEffect(() => () => { stopRef.current = true }, [])

  if (!root) {
    return (
      <svg width={120} height={60} className={cx('vl-binary-tree', className)} aria-label={ariaLabel}>
        <text x={60} y={30} textAnchor="middle" dominantBaseline="middle" fill={DSA_COLORS.edge} fontSize={12}>
          (empty tree)
        </text>
      </svg>
    )
  }

  const W = Math.max(width + r * 2, 120)
  const H = height + r * 2

  const nodeIsHl = (v: T) => (hl ? hl.has(String(v)) : false)

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className={cx('vl-binary-tree', className)}
      style={{ fontFamily: 'var(--font-sans)', overflow: 'visible', ...style }}
      data-vl-dsa="binary-tree"
    >
      {/* Edges */}
      {nodes.map((n, i) =>
        n.left || n.right ? (
          <g key={`e${i}`}>
            {n.left && (
              <line
                x1={n.x}
                y1={n.y}
                x2={n.left.x}
                y2={n.left.y}
                stroke={nodeIsHl(n.value) && nodeIsHl(n.left.value) ? DSA_COLORS.highlight : DSA_COLORS.edge}
                strokeWidth={1.25}
              />
            )}
            {n.right && (
              <line
                x1={n.x}
                y1={n.y}
                x2={n.right.x}
                y2={n.right.y}
                stroke={nodeIsHl(n.value) && nodeIsHl(n.right.value) ? DSA_COLORS.highlight : DSA_COLORS.edge}
                strokeWidth={1.25}
              />
            )}
          </g>
        ) : null,
      )}
      {/* Nodes */}
      {nodes.map((n, i) => {
        const isHl = nodeIsHl(n.value)
        return (
          <g key={`n${i}`}>
            <circle
              cx={n.x}
              cy={n.y}
              r={r}
              fill={isHl ? DSA_COLORS.highlightFill : DSA_COLORS.nodeFill}
              stroke={isHl ? DSA_COLORS.highlight : DSA_COLORS.nodeStroke}
              strokeWidth={isHl ? 1.75 : 1}
              style={{ transition: 'fill 180ms, stroke 180ms' }}
            />
            {renderNode ? (
              <foreignObject x={n.x - r} y={n.y - r} width={r * 2} height={r * 2}>
                <div
                  style={{
                    width: '100%', height: '100%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-sans)', fontSize: s.font, color: DSA_COLORS.nodeText,
                  }}
                >
                  {renderNode(n.value, isHl)}
                </div>
              </foreignObject>
            ) : (
              <text
                x={n.x}
                y={n.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={s.font}
                fontFamily="var(--font-mono)"
                fill={DSA_COLORS.nodeText}
              >
                {String(n.value)}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}) as <T>(
  p: BinaryTreeProps<T> & { ref?: React.Ref<BinaryTreeHandle<T>> },
) => React.ReactElement
