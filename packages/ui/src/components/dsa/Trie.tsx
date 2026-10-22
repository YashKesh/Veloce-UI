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

export interface TrieHandle {
  insert: (word: string) => void
  remove: (word: string) => void
  search: (word: string) => void
  startsWith: (prefix: string) => void
  reset: () => void
  snapshot: () => string[]
}

export interface TrieProps {
  words?: string[]
  defaultWords?: string[]
  size?: DsaSize
  /** Current highlighted character path (controlled). */
  highlightedPrefix?: string
  onChange?: (next: string[]) => void
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

interface TrieNode {
  ch: string
  isWord: boolean
  children: Map<string, TrieNode>
}

interface LaidTrieNode {
  id: string
  ch: string
  isWord: boolean
  depth: number
  parent?: LaidTrieNode
  x: number
  y: number
  pathSoFar: string
}

function buildTrie(words: string[]): TrieNode {
  const root: TrieNode = { ch: '', isWord: false, children: new Map() }
  for (const w of words) {
    let cur = root
    for (const c of w) {
      if (!cur.children.has(c)) cur.children.set(c, { ch: c, isWord: false, children: new Map() })
      cur = cur.children.get(c)!
    }
    cur.isWord = true
  }
  return root
}

function layoutTrie(root: TrieNode, xGap: number, yGap: number): { nodes: LaidTrieNode[]; width: number; height: number } {
  // In-order style: each leaf gets a column; parents sit above the mid-point of their children.
  const nodes: LaidTrieNode[] = []
  let col = 0
  function walk(n: TrieNode, depth: number, path: string, parent?: LaidTrieNode): LaidTrieNode {
    const laid: LaidTrieNode = {
      id: path || 'root',
      ch: n.ch,
      isWord: n.isWord,
      depth,
      parent,
      x: 0,
      y: depth * yGap + 12,
      pathSoFar: path,
    }
    nodes.push(laid)
    const kids = Array.from(n.children.values()).sort((a, b) => a.ch.localeCompare(b.ch))
    if (kids.length === 0) {
      laid.x = col * xGap + xGap / 2
      col += 1
      return laid
    }
    const laidKids = kids.map((k) => walk(k, depth + 1, path + k.ch, laid))
    laid.x = (laidKids[0].x + laidKids[laidKids.length - 1].x) / 2
    return laid
  }
  walk(root, 0, '')
  const maxDepth = Math.max(0, ...nodes.map((n) => n.depth))
  return {
    nodes,
    width: Math.max(col * xGap, xGap),
    height: (maxDepth + 1) * yGap + 24,
  }
}

export const Trie = forwardRef<TrieHandle, TrieProps>(function Trie(
  {
    words,
    defaultWords,
    size = 'md',
    highlightedPrefix,
    onChange,
    className,
    style,
    'aria-label': ariaLabel = 'Trie',
  },
  ref,
) {
  const [internal, setInternal] = useState<string[]>(() => words ?? defaultWords ?? [])
  const list = words ?? internal
  const [innerHl, setInnerHl] = useState<string>('')
  const hl = highlightedPrefix ?? innerHl

  useEffect(() => {
    if (words !== undefined) setInternal(words)
  }, [words])

  const commit = (next: string[]) => {
    if (words === undefined) setInternal(next)
    onChange?.(next)
  }

  useImperativeHandle(
    ref,
    () => ({
      insert: (word: string) => {
        if (!word) return
        if (list.includes(word)) return
        commit([...list, word])
      },
      remove: (word: string) => {
        commit(list.filter((w) => w !== word))
      },
      search: (word: string) => {
        // Highlight the full path for the word if it exists.
        const root = buildTrie(list)
        let cur = root
        let acc = ''
        for (const c of word) {
          if (!cur.children.has(c)) break
          cur = cur.children.get(c)!
          acc += c
        }
        setInnerHl(acc)
      },
      startsWith: (prefix: string) => setInnerHl(prefix),
      reset: () => setInnerHl(''),
      snapshot: () => list.slice(),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [list],
  )

  const s = SIZE_PX[size]
  const r = s.node / 2
  const xGap = r * 2 + 14
  const yGap = r * 2 + 32

  const trie = useMemo(() => buildTrie(list), [list])
  const { nodes, width, height } = useMemo(() => layoutTrie(trie, xGap, yGap), [trie, xGap, yGap])

  if (list.length === 0) {
    return (
      <div
        className={cx('vl-trie', className)}
        style={{
          width: 200, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px dashed ${DSA_COLORS.nodeStroke}`, borderRadius: 8, color: DSA_COLORS.edge,
          fontSize: 12, fontFamily: 'var(--font-mono)', ...style,
        }}
      >
        empty trie
      </div>
    )
  }

  const W = Math.max(width + r * 2 + 20, 160)
  const H = height + r * 2

  const isHl = (path: string) => hl.length > 0 && path !== '' && hl.startsWith(path)

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className={cx('vl-trie', className)}
      style={{ fontFamily: 'var(--font-sans)', overflow: 'visible', ...style }}
      data-vl-dsa="trie"
    >
      {/* edges */}
      {nodes.map((n, i) =>
        n.parent ? (
          <line
            key={`e${i}`}
            x1={n.parent.x}
            y1={n.parent.y}
            x2={n.x}
            y2={n.y}
            stroke={isHl(n.pathSoFar) ? DSA_COLORS.highlight : DSA_COLORS.edge}
            strokeWidth={1.25}
            style={{ transition: 'stroke 180ms' }}
          />
        ) : null,
      )}
      {/* nodes */}
      {nodes.map((n, i) => {
        const hlNow = n.pathSoFar !== '' && isHl(n.pathSoFar)
        return (
          <g key={`n${i}`}>
            <circle
              cx={n.x}
              cy={n.y}
              r={r}
              fill={hlNow ? DSA_COLORS.highlightFill : DSA_COLORS.nodeFill}
              stroke={hlNow ? DSA_COLORS.highlight : n.isWord ? 'var(--ok)' : DSA_COLORS.nodeStroke}
              strokeWidth={hlNow || n.isWord ? 1.75 : 1}
              style={{ transition: 'fill 180ms, stroke 180ms' }}
            />
            {n.isWord && (
              <circle cx={n.x} cy={n.y} r={r - 4} fill="none" stroke="var(--ok)" strokeWidth={0.75} opacity={0.5} />
            )}
            <text
              x={n.x}
              y={n.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={s.font}
              fontFamily="var(--font-mono)"
              fill={DSA_COLORS.nodeText}
            >
              {n.depth === 0 ? '•' : n.ch}
            </text>
          </g>
        )
      })}
    </svg>
  )
})
