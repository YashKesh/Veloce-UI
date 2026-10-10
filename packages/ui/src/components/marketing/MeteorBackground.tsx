import { useMemo, type ComponentProps } from 'react'
import { cx } from '../../utils/cx'

export interface MeteorBackgroundProps extends ComponentProps<'div'> {
  /** How many meteors to render. Default 20. */
  count?: number
  /** Base color of meteor trails. Defaults to --ac. */
  color?: string
}

/** CSS-only shooting-star background effect. Positions `count` meteors with
 *  randomized delays and durations so the stream feels organic. */
export function MeteorBackground({ count = 20, color = 'var(--ac)', className, style, ...rest }: MeteorBackgroundProps) {
  const meteors = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        key: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 4 + Math.random() * 5,
      })),
    [count],
  )
  return (
    <div
      aria-hidden
      data-vl-meteor-bg=""
      className={cx('vl-meteor-bg', className)}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style,
      }}
      {...rest}
    >
      {meteors.map((m) => (
        <span
          key={m.key}
          style={{
            position: 'absolute',
            top: `${m.top}%`,
            left: `${m.left}%`,
            width: 2,
            height: 2,
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 0 1px color-mix(in oklch, ${color} 40%, transparent)`,
            animation: `vl-meteor ${m.duration}s linear ${m.delay}s infinite`,
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              width: 60,
              height: 1,
              background: `linear-gradient(90deg, ${color}, transparent)`,
              transform: 'translateY(-50%) rotate(-45deg)',
              transformOrigin: 'left center',
            }}
          />
        </span>
      ))}
      <style>{`
        @keyframes vl-meteor {
          0% { transform: translate(0, 0); opacity: 0 }
          10% { opacity: 1 }
          100% { transform: translate(-500px, 500px); opacity: 0 }
        }
      `}</style>
    </div>
  )
}
