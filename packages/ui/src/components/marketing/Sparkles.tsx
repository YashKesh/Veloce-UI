import { useMemo, type ComponentProps } from 'react'
import { cx } from '../../utils/cx'

export interface SparklesProps extends ComponentProps<'div'> {
  count?: number
  color?: string
  /** Sparkle size in pixels. Default 2. */
  size?: number
}

/** Twinkling dot-field background — the "AI magic" sparkle layer. CSS-only. */
export function Sparkles({ count = 40, color = 'var(--ac)', size = 2, className, style, ...rest }: SparklesProps) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        key: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 1.5 + Math.random() * 2.5,
        scale: 0.5 + Math.random() * 1.5,
      })),
    [count],
  )
  return (
    <div
      aria-hidden
      data-vl-sparkles=""
      className={cx('vl-sparkles', className)}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style,
      }}
      {...rest}
    >
      {dots.map((d) => (
        <span
          key={d.key}
          style={{
            position: 'absolute',
            top: `${d.top}%`,
            left: `${d.left}%`,
            width: size,
            height: size,
            borderRadius: '50%',
            background: color,
            transform: `scale(${d.scale})`,
            animation: `vl-sparkle ${d.duration}s ease-in-out ${d.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes vl-sparkle {
          0%, 100% { opacity: 0 }
          50% { opacity: 1 }
        }
      `}</style>
    </div>
  )
}
