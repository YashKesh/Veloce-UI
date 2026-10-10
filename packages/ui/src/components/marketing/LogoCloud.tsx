import { type ComponentProps, type ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface LogoCloudProps extends ComponentProps<'section'> {
  heading?: ReactNode
  logos: ReactNode[]
  /** Scroll the logos infinitely. */
  marquee?: boolean
  /** Marquee speed in seconds (lower = faster). Default 40. */
  speed?: number
}

/** Logo wall / scrolling marquee of customer or integration logos. */
export function LogoCloud({ heading, logos, marquee, speed = 40, className, style, ...rest }: LogoCloudProps) {
  const list = marquee ? [...logos, ...logos] : logos
  return (
    <section
      data-vl-logo-cloud=""
      className={cx('vl-logo-cloud', className)}
      style={{ padding: '48px 24px', maxWidth: 1200, marginInline: 'auto', ...style }}
      {...rest}
    >
      {heading && (
        <div style={{ textAlign: 'center', fontSize: 12.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 24 }}>
          {heading}
        </div>
      )}
      <div
        style={{
          overflow: 'hidden',
          maskImage: marquee ? 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)' : undefined,
          WebkitMaskImage: marquee ? 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)' : undefined,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 48,
            justifyContent: marquee ? 'flex-start' : 'center',
            flexWrap: marquee ? 'nowrap' : 'wrap',
            width: marquee ? 'max-content' : undefined,
            animation: marquee ? `vl-marquee ${speed}s linear infinite` : undefined,
            color: 'var(--fg-2)',
            opacity: 0.75,
          }}
        >
          {list.map((logo, i) => (
            <div key={i} style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.015em', whiteSpace: 'nowrap' }}>
              {logo}
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes vl-marquee {
          from { transform: translateX(0) }
          to { transform: translateX(-50%) }
        }
      `}</style>
    </section>
  )
}
