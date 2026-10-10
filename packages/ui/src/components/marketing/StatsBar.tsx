import { type ComponentProps, type ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface Stat {
  value: ReactNode
  label: ReactNode
  caption?: ReactNode
}

export interface StatsBarProps extends ComponentProps<'section'> {
  stats: Stat[]
}

/** Big-number row — "100k users · 14 regions · 99.99% uptime". */
export function StatsBar({ stats, className, style, ...rest }: StatsBarProps) {
  return (
    <section
      data-vl-stats-bar=""
      className={cx('vl-stats-bar', className)}
      style={{ padding: '48px 24px', maxWidth: 1200, marginInline: 'auto', ...style }}
      {...rest}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))`,
          gap: 24,
          padding: '28px 32px',
          borderRadius: 14,
          border: '1px solid var(--line)',
          background: 'var(--bg-1)',
        }}
      >
        {stats.map((s, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--fg)', fontVariantNumeric: 'tabular-nums' }}>
              {s.value}
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>{s.label}</div>
            {s.caption && <div style={{ fontSize: 11.5, color: 'var(--fg-3)' }}>{s.caption}</div>}
          </div>
        ))}
      </div>
    </section>
  )
}
