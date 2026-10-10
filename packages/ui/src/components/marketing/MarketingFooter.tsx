import { type ComponentProps, type ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface FooterColumn {
  title: string
  links: Array<{ label: ReactNode; href?: string }>
}

export interface MarketingFooterProps extends ComponentProps<'footer'> {
  brand?: ReactNode
  tagline?: ReactNode
  columns: FooterColumn[]
  copyright?: ReactNode
  social?: ReactNode
}

/** Standard marketing footer — brand + tagline + columns of links + copyright row. */
export function MarketingFooter({ brand, tagline, columns, copyright, social, className, style, ...rest }: MarketingFooterProps) {
  return (
    <footer
      data-vl-marketing-footer=""
      className={cx('vl-marketing-footer', className)}
      style={{
        borderTop: '1px solid var(--line)',
        background: 'var(--bg)',
        padding: '56px 24px 24px',
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          maxWidth: 1200,
          marginInline: 'auto',
          display: 'grid',
          gridTemplateColumns: `minmax(0, 1.5fr) repeat(${columns.length}, minmax(0, 1fr))`,
          gap: 40,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
          {brand && <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--fg)' }}>{brand}</div>}
          {tagline && <div style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--fg-2)' }}>{tagline}</div>}
        </div>
        {columns.map((col) => (
          <div key={col.title} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>
              {col.title}
            </div>
            {col.links.map((l, i) => (
              <a
                key={i}
                href={l.href ?? '#'}
                style={{ fontSize: 13.5, color: 'var(--fg-2)', textDecoration: 'none', lineHeight: 1.9 }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--fg)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--fg-2)' }}
              >
                {l.label}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div
        style={{
          maxWidth: 1200,
          marginInline: 'auto',
          marginTop: 40,
          paddingTop: 20,
          borderTop: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          fontSize: 12.5,
          color: 'var(--fg-3)',
          flexWrap: 'wrap',
        }}
      >
        <div>{copyright}</div>
        {social && <div style={{ display: 'flex', gap: 10 }}>{social}</div>}
      </div>
    </footer>
  )
}
