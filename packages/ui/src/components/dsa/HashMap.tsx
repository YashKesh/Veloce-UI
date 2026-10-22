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

export interface HashMapEntry {
  key: string
  value: string | number
}

export interface HashMapHandle {
  put: (key: string, value: string | number) => void
  get: (key: string) => string | number | undefined
  remove: (key: string) => void
  clear: () => void
  snapshot: () => HashMapEntry[]
}

export interface HashMapProps {
  entries?: HashMapEntry[]
  defaultEntries?: HashMapEntry[]
  /** Number of buckets. Default 7 (prime for better distribution). */
  buckets?: number
  /** Custom hash function; default is a simple djb2. */
  hashFn?: (key: string, buckets: number) => number
  size?: DsaSize
  onChange?: (next: HashMapEntry[]) => void
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

const defaultHash = (key: string, buckets: number) => {
  let h = 5381
  for (let i = 0; i < key.length; i++) h = ((h << 5) + h + key.charCodeAt(i)) | 0
  return Math.abs(h) % buckets
}

export const HashMap = forwardRef<HashMapHandle, HashMapProps>(function HashMap(
  {
    entries,
    defaultEntries,
    buckets = 7,
    hashFn = defaultHash,
    size = 'md',
    onChange,
    className,
    style,
    'aria-label': ariaLabel = 'Hash map',
  },
  ref,
) {
  const [internal, setInternal] = useState<HashMapEntry[]>(() => entries ?? defaultEntries ?? [])
  const list = entries ?? internal
  const [highlightBucket, setHighlightBucket] = useState<number | null>(null)
  const [highlightKey, setHighlightKey] = useState<string | null>(null)
  const flashTimer = useRef<number | null>(null)

  useEffect(() => {
    if (entries !== undefined) setInternal(entries)
  }, [entries])

  const commit = (next: HashMapEntry[]) => {
    if (entries === undefined) setInternal(next)
    onChange?.(next)
  }

  const flash = (bucket: number, key?: string) => {
    setHighlightBucket(bucket)
    setHighlightKey(key ?? null)
    if (flashTimer.current) window.clearTimeout(flashTimer.current)
    flashTimer.current = window.setTimeout(() => {
      setHighlightBucket(null)
      setHighlightKey(null)
    }, 900)
  }

  useImperativeHandle(
    ref,
    () => ({
      put: (key, value) => {
        const existingIdx = list.findIndex((e) => e.key === key)
        const next = existingIdx >= 0 ? list.map((e, i) => (i === existingIdx ? { key, value } : e)) : [...list, { key, value }]
        commit(next)
        flash(hashFn(key, buckets), key)
      },
      get: (key) => {
        flash(hashFn(key, buckets), key)
        return list.find((e) => e.key === key)?.value
      },
      remove: (key) => {
        commit(list.filter((e) => e.key !== key))
        flash(hashFn(key, buckets))
      },
      clear: () => commit([]),
      snapshot: () => list.slice(),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [list, buckets, hashFn],
  )

  // Group entries into buckets.
  const bucketLists = useMemo(() => {
    const out: HashMapEntry[][] = Array.from({ length: buckets }, () => [])
    for (const e of list) out[hashFn(e.key, buckets)].push(e)
    return out
  }, [list, buckets, hashFn])

  const s = SIZE_PX[size]
  const slotH = s.node * 0.9
  const chipH = Math.max(22, s.node * 0.72)

  const loadFactor = (list.length / buckets).toFixed(2)

  return (
    <div
      className={cx('vl-hashmap', className)}
      role="grid"
      aria-label={ariaLabel}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        gap: 10,
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      data-vl-dsa="hashmap"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        <span>buckets</span>
        <span>load factor {loadFactor}</span>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        rowGap: 4,
        padding: 10,
        border: `1px solid ${DSA_COLORS.nodeStroke}`,
        borderRadius: 'var(--r-md)',
        background: 'var(--bg-1)',
      }}>
        {bucketLists.map((bucket, i) => {
          const isHl = highlightBucket === i
          return (
            <>
              <div
                key={`idx${i}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: slotH,
                  borderRight: `1px solid ${DSA_COLORS.nodeStroke}`,
                  background: isHl ? DSA_COLORS.highlightFill : 'transparent',
                  color: isHl ? DSA_COLORS.highlight : 'var(--fg-3)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  transition: 'background 220ms, color 220ms',
                  borderRadius: '4px 0 0 4px',
                }}
              >
                {i}
              </div>
              <div
                key={`row${i}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '0 10px',
                  height: slotH,
                  background: isHl ? DSA_COLORS.highlightFill : 'transparent',
                  transition: 'background 220ms',
                  borderRadius: '0 4px 4px 0',
                }}
              >
                {bucket.length === 0 ? (
                  <span style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>—</span>
                ) : (
                  bucket.map((e, j) => {
                    const chipHl = highlightKey === e.key
                    return (
                      <span
                        key={e.key}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '0 10px',
                          height: chipH,
                          borderRadius: chipH / 2,
                          border: `1px solid ${chipHl ? DSA_COLORS.highlight : DSA_COLORS.nodeStroke}`,
                          background: chipHl ? DSA_COLORS.highlightFill : DSA_COLORS.nodeFill,
                          fontSize: s.font - 1,
                          fontFamily: 'var(--font-mono)',
                          color: DSA_COLORS.nodeText,
                          transition: 'background 220ms, border-color 220ms',
                          position: 'relative',
                        }}
                      >
                        <strong style={{ fontWeight: 500 }}>{e.key}</strong>
                        <span style={{ color: 'var(--fg-3)' }}>→</span>
                        <span>{String(e.value)}</span>
                        {j < bucket.length - 1 && (
                          <span style={{ position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-3)', fontSize: 10 }}>
                            →
                          </span>
                        )}
                      </span>
                    )
                  })
                )}
              </div>
            </>
          )
        })}
      </div>
    </div>
  )
})
