import { type ComponentProps } from 'react'
import { cx } from '../../utils/cx'

export interface TokenCounterProps extends ComponentProps<'div'> {
  tokens: number
  limit?: number
  /** Price per 1k tokens — if set, renders cost in USD alongside. */
  pricePer1k?: number
  /** Shortens large counts (1234 → 1.2k). Default true. */
  compact?: boolean
}

function fmt(n: number, compact: boolean): string {
  if (!compact) return n.toLocaleString()
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

/** Mini usage pill — "tokens / limit · $cost". Color shifts to warn/err as usage approaches limit. */
export function TokenCounter({ tokens, limit, pricePer1k, compact = true, className, style, ...rest }: TokenCounterProps) {
  const pct = limit ? tokens / limit : 0
  const tone = pct >= 0.95 ? 'var(--err)' : pct >= 0.8 ? 'var(--warn)' : 'var(--fg-3)'
  const cost = pricePer1k != null ? (tokens / 1000) * pricePer1k : null
  return (
    <div
      data-vl-token-counter=""
      className={cx('vl-token-counter', className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 8px',
        borderRadius: 999,
        border: '1px solid var(--line)',
        background: 'var(--bg-1)',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: tone,
        fontVariantNumeric: 'tabular-nums',
        ...style,
      }}
      {...rest}
    >
      <span style={{ color: 'var(--fg)' }}>{fmt(tokens, compact)}</span>
      {limit != null && <span>/ {fmt(limit, compact)}</span>}
      <span style={{ color: 'var(--fg-3)' }}>tok</span>
      {cost != null && (
        <>
          <span style={{ color: 'var(--line-2)' }}>·</span>
          <span style={{ color: 'var(--fg-2)' }}>${cost.toFixed(cost < 0.01 ? 4 : cost < 1 ? 3 : 2)}</span>
        </>
      )}
    </div>
  )
}
