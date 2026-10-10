import { type ComponentProps, type ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface CTAProps extends Omit<ComponentProps<'section'>, 'title'> {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
}

/** Centered call-to-action band — "ready to ship?" bottom-of-page banner. */
export function CTA({ eyebrow, title, description, actions, className, style, ...rest }: CTAProps) {
  return (
    <section
      data-vl-cta=""
      className={cx('vl-cta', className)}
      style={{
        padding: '72px 24px',
        maxWidth: 1200,
        marginInline: 'auto',
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          padding: '56px 40px',
          borderRadius: 20,
          background: 'linear-gradient(135deg, color-mix(in oklch, var(--ac) 25%, var(--bg-1)), var(--bg-1))',
          border: '1px solid var(--ac-line)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 16,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: -80,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 420,
            height: 280,
            background: 'radial-gradient(50% 50% at 50% 50%, var(--ac) 0%, transparent 70%)',
            opacity: 0.25,
            pointerEvents: 'none',
          }}
        />
        {eyebrow && (
          <span
            style={{
              position: 'relative',
              fontSize: 12.5,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--ac-text)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {eyebrow}
          </span>
        )}
        <h2 style={{ position: 'relative', margin: 0, fontSize: 44, fontWeight: 600, letterSpacing: '-0.035em', color: 'var(--fg)', textWrap: 'balance' }}>
          {title}
        </h2>
        {description && (
          <p style={{ position: 'relative', margin: 0, fontSize: 16, lineHeight: 1.6, color: 'var(--fg-2)', maxWidth: 560 }}>
            {description}
          </p>
        )}
        {actions && <div style={{ position: 'relative', display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>{actions}</div>}
      </div>
    </section>
  )
}
