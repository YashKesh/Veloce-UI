import { type ComponentProps, type ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface Feature {
  icon?: ReactNode
  title: ReactNode
  description: ReactNode
  href?: string
}

export interface FeatureGridProps extends Omit<ComponentProps<'section'>, 'title'> {
  heading?: ReactNode
  intro?: ReactNode
  features: Feature[]
  /** Columns on desktop. Default 3. */
  columns?: 2 | 3 | 4
}

/** Marketing feature grid — eyebrow + icon tiles + description. */
export function FeatureGrid({ heading, intro, features, columns = 3, className, style, ...rest }: FeatureGridProps) {
  return (
    <section
      data-vl-feature-grid=""
      className={cx('vl-feature-grid', className)}
      style={{
        padding: '72px 24px',
        maxWidth: 1200,
        marginInline: 'auto',
        ...style,
      }}
      {...rest}
    >
      {(heading || intro) && (
        <div style={{ textAlign: 'center', maxWidth: 640, marginInline: 'auto', marginBottom: 48, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {heading && (
            <h2 style={{ margin: 0, fontSize: 36, fontWeight: 600, letterSpacing: '-0.025em', color: 'var(--fg)' }}>
              {heading}
            </h2>
          )}
          {intro && (
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: 'var(--fg-2)' }}>{intro}</p>
          )}
        </div>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: 20,
        }}
      >
        {features.map((f, i) => (
          <a
            key={i}
            href={f.href ?? '#'}
            onClick={(e) => !f.href && e.preventDefault()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              padding: 24,
              borderRadius: 14,
              border: '1px solid var(--line)',
              background: 'var(--bg-1)',
              color: 'var(--fg)',
              textDecoration: 'none',
              transition: 'background 150ms, border-color 150ms, transform 150ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--ac-line)'
              e.currentTarget.style.background = 'var(--bg-2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--line)'
              e.currentTarget.style.background = 'var(--bg-1)'
            }}
          >
            {f.icon && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  background: 'var(--ac-soft)',
                  color: 'var(--ac-text)',
                  fontSize: 18,
                }}
              >
                {f.icon}
              </span>
            )}
            <div style={{ fontSize: 15.5, fontWeight: 600, letterSpacing: '-0.01em' }}>{f.title}</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--fg-2)' }}>{f.description}</div>
          </a>
        ))}
      </div>
    </section>
  )
}
