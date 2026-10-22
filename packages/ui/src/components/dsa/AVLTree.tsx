import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  type CSSProperties,
} from 'react'
import { cx } from '../../utils/cx'
import { DSA_COLORS, SIZE_PX, layoutBinaryTree, type DsaSize, type TreeNodeInput } from './dsaCommon'

/* ─── Pure AVL algorithm (immutable; returns new root each op) ──────────── */

interface AvlNode {
  value: number
  height: number
  left: AvlNode | null
  right: AvlNode | null
}

const h = (n: AvlNode | null) => (n ? n.height : 0)
const bf = (n: AvlNode | null) => (n ? h(n.left) - h(n.right) : 0)

function node(value: number, left: AvlNode | null = null, right: AvlNode | null = null): AvlNode {
  return { value, left, right, height: 1 + Math.max(h(left), h(right)) }
}

function rotateRight(y: AvlNode): AvlNode {
  const x = y.left!
  return node(x.value, x.left, node(y.value, x.right, y.right))
}
function rotateLeft(x: AvlNode): AvlNode {
  const y = x.right!
  return node(y.value, node(x.value, x.left, y.left), y.right)
}

function balance(n: AvlNode): AvlNode {
  const b = bf(n)
  if (b > 1 && bf(n.left) >= 0) return rotateRight(n)
  if (b > 1 && bf(n.left) < 0) return rotateRight(node(n.value, rotateLeft(n.left!), n.right))
  if (b < -1 && bf(n.right) <= 0) return rotateLeft(n)
  if (b < -1 && bf(n.right) > 0) return rotateLeft(node(n.value, n.left, rotateRight(n.right!)))
  return n
}

function insert(n: AvlNode | null, v: number): AvlNode {
  if (!n) return node(v)
  if (v < n.value) return balance(node(n.value, insert(n.left, v), n.right))
  if (v > n.value) return balance(node(n.value, n.left, insert(n.right, v)))
  return n
}

function toInput(n: AvlNode | null): TreeNodeInput<string> | null {
  if (!n) return null
  const label = `${n.value}·${bf(n) > 0 ? '+' : ''}${bf(n)}`
  return { value: label, left: toInput(n.left) ?? undefined, right: toInput(n.right) ?? undefined }
}

/* ─── Component ─────────────────────────────────────────────────────────── */

export interface AVLTreeHandle {
  insert: (value: number) => void
  remove: (value: number) => void
  reset: () => void
  snapshot: () => number[]
}

export interface AVLTreeProps {
  values?: number[]
  defaultValues?: number[]
  size?: DsaSize
  /** Show balance factor badge after each value. Default true. */
  showBalance?: boolean
  onChange?: (next: number[]) => void
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

export const AVLTree = forwardRef<AVLTreeHandle, AVLTreeProps>(function AVLTree(
  {
    values,
    defaultValues,
    size = 'md',
    showBalance = true,
    onChange,
    className,
    style,
    'aria-label': ariaLabel = 'AVL tree',
  },
  ref,
) {
  const [internal, setInternal] = useState<number[]>(() => values ?? defaultValues ?? [])
  const list = values ?? internal

  useEffect(() => {
    if (values !== undefined) setInternal(values)
  }, [values])

  const commit = (next: number[]) => {
    if (values === undefined) setInternal(next)
    onChange?.(next)
  }

  // Build the AVL tree fresh from `list` on every render — small lists only.
  const root = useMemo(() => {
    let r: AvlNode | null = null
    for (const v of list) r = insert(r, v)
    return r
  }, [list])

  useImperativeHandle(
    ref,
    () => ({
      insert: (v) => commit([...list, v]),
      remove: (v) => {
        // Remove ALL occurrences in input (AVL only stores one copy anyway).
        commit(list.filter((x) => x !== v))
      },
      reset: () => commit(defaultValues ?? []),
      snapshot: () => list.slice(),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [list],
  )

  const s = SIZE_PX[size]
  const r = s.node / 2
  const xg = r * 2 + 20
  const yg = r * 2 + 40

  const asInput = useMemo(() => toInput(root), [root])

  const { nodes, width, height } = useMemo(
    () => layoutBinaryTree(asInput, { xGap: xg, yGap: yg, originX: r + 10, originY: r + 10 }),
    [asInput, xg, yg, r],
  )

  if (!root) {
    return (
      <div
        className={cx('vl-avl-tree', className)}
        style={{
          width: 200, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px dashed ${DSA_COLORS.nodeStroke}`, borderRadius: 8, color: DSA_COLORS.edge,
          fontSize: 12, fontFamily: 'var(--font-mono)', ...style,
        }}
      >
        empty AVL tree
      </div>
    )
  }

  const W = Math.max(width + r * 2 + 20, 200)
  const H = height + r * 2 + 20

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className={cx('vl-avl-tree', className)}
      style={{ fontFamily: 'var(--font-sans)', overflow: 'visible', ...style }}
      data-vl-dsa="avl-tree"
    >
      {/* edges */}
      {nodes.map((n, i) => (
        <g key={`e${i}`}>
          {n.left && <line x1={n.x} y1={n.y} x2={n.left.x} y2={n.left.y} stroke={DSA_COLORS.edge} strokeWidth={1.25} style={{ transition: 'all 220ms' }} />}
          {n.right && <line x1={n.x} y1={n.y} x2={n.right.x} y2={n.right.y} stroke={DSA_COLORS.edge} strokeWidth={1.25} style={{ transition: 'all 220ms' }} />}
        </g>
      ))}
      {/* nodes */}
      {nodes.map((n, i) => {
        const [valueStr, balStr] = n.value.split('·')
        return (
          <g key={`n${i}`} style={{ transition: 'transform 300ms var(--ease-swift-out, ease-out)' }}>
            <circle
              cx={n.x}
              cy={n.y}
              r={r}
              fill={DSA_COLORS.nodeFill}
              stroke={DSA_COLORS.nodeStroke}
              strokeWidth={1}
              style={{ transition: 'fill 220ms, stroke 220ms' }}
            />
            <text
              x={n.x}
              y={n.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={s.font}
              fontFamily="var(--font-mono)"
              fill={DSA_COLORS.nodeText}
            >
              {valueStr}
            </text>
            {showBalance && (
              <g>
                <rect
                  x={n.x + r - 4}
                  y={n.y - r - 2}
                  width={22}
                  height={14}
                  rx={3}
                  fill="var(--bg-1)"
                  stroke={Math.abs(Number(balStr)) >= 1 ? DSA_COLORS.highlight : DSA_COLORS.nodeStroke}
                />
                <text
                  x={n.x + r - 4 + 11}
                  y={n.y - r + 5}
                  textAnchor="middle"
                  fontSize={9}
                  fontFamily="var(--font-mono)"
                  fill={Math.abs(Number(balStr)) >= 1 ? DSA_COLORS.highlight : 'var(--fg-3)'}
                >
                  {balStr}
                </text>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
})
