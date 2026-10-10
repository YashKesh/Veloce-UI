import { type ComponentProps, type ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface PricingTier {
  name: string
  price: ReactNode
  /** Period after the price (e.g. "/mo"). */
  period?: string
  description?: ReactNode
  features: ReactNode[]
  cta?: ReactNode
  /** Highlights this tier with the accent border. */
  featured?: boolean
  badge?: ReactNode
}

export interface PricingTableProps extends Omit<ComponentProps<'section'>, 'title'> {
  heading?: ReactNode
  intro?: ReactNode
  tiers: PricingTier[]
}

export function PricingTable({ heading, intro, tiers, className, style, ...rest }: PricingTableProps) {
  return (
    <section
      data-vl-pricing-table=""
      className={cx('vl-pricing-table', className)}
      style={{ padding: '72px 24px', maxWidth: 1200, marginInline: 'auto', ...style }}
      {...rest}
    >
      {(heading || intro) && (
        <div style={{ textAlign: 'center', maxWidth: 640, marginInline: 'auto', marginBottom: 48, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {heading && <h2 style={{ margin: 0, fontSize: 36, fontWeight: 600, letterSpacing: '-0.025em' }}>{heading}</h2>}
          {intro && <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: 'var(--fg-2)' }}>{intro}</p>}
        </div>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${tiers.length}, minmax(0, 1fr))`,
          gap: 16,
        }}
      >
        {tiers.map((t, i) => (
          <div
            key={i}
            data-featured={t.featured ? '' : undefined}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              padding: 28,
              borderRadius: 16,
              border: t.featured ? '1px solid var(--ac)' : '1px solid var(--line)',
              background: t.featured ? 'color-mix(in oklch, var(--ac) 6%, var(--bg-1))' : 'var(--bg-1)',
              boxShadow: t.featured ? '0 0 0 1px var(--ac-line), var(--shadow-md)' : undefined,
            }}
          >
            {t.badge && (
              <span
                style={{
                  position: 'absolute',
                  top: -11,
                  left: 20,
                  padding: '2px 10px',
                  borderRadius: 999,
                  background: 'var(--ac)',
                  color: 'var(--ac-fg)',
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                }}
              >
                {t.badge}
              </span>
            )}
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--fg-2)' }}>{t.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}>
                <span style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-0.035em', color: 'var(--fg)' }}>{t.price}</span>
                {t.period && <span style={{ fontSize: 14, color: 'var(--fg-3)' }}>{t.period}</span>}
              </div>
              {t.description && <div style={{ marginTop: 8, fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.5 }}>{t.description}</div>}
            </div>
            {t.cta && <div>{t.cta}</div>}
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {t.features.map((f, j) => (
                <li key={j} style={{ display: 'flex', gap: 10, fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--ok)', flexShrink: 0, marginTop: 2 }}>✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
