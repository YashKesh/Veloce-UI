import { type ComponentProps, type ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface Testimonial {
  quote: ReactNode
  author: string
  role?: string
  avatar?: ReactNode
}

export interface TestimonialWallProps extends Omit<ComponentProps<'section'>, 'title'> {
  heading?: ReactNode
  intro?: ReactNode
  testimonials: Testimonial[]
  /** Columns on desktop. Default 3. */
  columns?: 2 | 3
}

/** Grid of testimonial cards — social proof section. */
export function TestimonialWall({ heading, intro, testimonials, columns = 3, className, style, ...rest }: TestimonialWallProps) {
  return (
    <section
      data-vl-testimonial-wall=""
      className={cx('vl-testimonial-wall', className)}
      style={{ padding: '72px 24px', maxWidth: 1200, marginInline: 'auto', ...style }}
      {...rest}
    >
      {(heading || intro) && (
        <div style={{ textAlign: 'center', maxWidth: 640, marginInline: 'auto', marginBottom: 48, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {heading && <h2 style={{ margin: 0, fontSize: 36, fontWeight: 600, letterSpacing: '-0.025em' }}>{heading}</h2>}
          {intro && <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: 'var(--fg-2)' }}>{intro}</p>}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: 16 }}>
        {testimonials.map((t, i) => (
          <figure
            key={i}
            style={{
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              padding: 24,
              borderRadius: 14,
              border: '1px solid var(--line)',
              background: 'var(--bg-1)',
            }}
          >
            <blockquote style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: 'var(--fg)' }}>
              "{t.quote}"
            </blockquote>
            <figcaption style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto' }}>
              {t.avatar && (
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'var(--bg-3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--fg)',
                    flexShrink: 0,
                  }}
                >
                  {t.avatar}
                </span>
              )}
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--fg)' }}>{t.author}</div>
                {t.role && <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>{t.role}</div>}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
