import { type ComponentProps, type ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface HeroProps extends Omit<ComponentProps<'section'>, 'title'> {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** Primary + optional secondary CTAs. */
  cta?: ReactNode
  /** Right-side slot — screenshot, illustration, chart. If omitted, content centers. */
  media?: ReactNode
  /** Supporting line below CTAs (e.g. "No credit card · 14-day trial"). */
  foot?: ReactNode
}

/** Hero section — eyebrow + headline + description + CTAs + optional media.
 *  Auto-switches between centered (no media) and split (with media) layouts. */
export function Hero({ eyebrow, title, description, cta, media, foot, className, style, ...rest }: HeroProps) {
  const split = Boolean(media)
  return (
    <section
      data-vl-hero=""
      data-layout={split ? 'split' : 'centered'}
      className={cx('vl-hero', className)}
      style={{
        padding: '72px 24px',
        display: 'grid',
        gridTemplateColumns: split ? 'minmax(0, 1fr) minmax(0, 1fr)' : 'minmax(0, 1fr)',
        gap: 56,
        alignItems: 'center',
        maxWidth: 1200,
        marginInline: 'auto',
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, textAlign: split ? 'left' : 'center', alignItems: split ? 'flex-start' : 'center' }}>
        {eyebrow && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 12px 4px 6px',
              borderRadius: 999,
              border: '1px solid var(--ac-line)',
              background: 'var(--ac-soft)',
              color: 'var(--ac-text)',
              fontSize: 12.5,
              fontWeight: 500,
            }}
          >
            {eyebrow}
          </span>
        )}
        <h1
          style={{
            margin: 0,
            fontSize: split ? 52 : 68,
            lineHeight: 1,
            letterSpacing: '-0.045em',
            fontWeight: 600,
            color: 'var(--fg)',
            textWrap: 'balance',
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            style={{
              margin: 0,
              fontSize: 18,
              lineHeight: 1.55,
              color: 'var(--fg-2)',
              maxWidth: 560,
              textWrap: 'pretty',
            }}
          >
            {description}
          </p>
        )}
        {cta && <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>{cta}</div>}
        {foot && <div style={{ fontSize: 12.5, color: 'var(--fg-3)' }}>{foot}</div>}
      </div>
      {media && <div style={{ display: 'flex', justifyContent: 'center' }}>{media}</div>}
    </section>
  )
}
