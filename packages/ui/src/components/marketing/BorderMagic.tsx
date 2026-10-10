import { type ComponentProps, type ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface BorderMagicProps extends ComponentProps<'button'> {
  children: ReactNode
  /** Rotation duration. Default 3s. */
  duration?: number
}

/** Button with an animated rotating gradient border (Aceternity "Border magic" effect).
 *  Pure CSS — no Framer Motion. */
export function BorderMagic({ children, duration = 3, className, style, ...rest }: BorderMagicProps) {
  return (
    <button
      data-vl-border-magic=""
      className={cx('vl-border-magic', className)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        padding: 1,
        borderRadius: 999,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        overflow: 'hidden',
        isolation: 'isolate',
        ...style,
      }}
      {...rest}
    >
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: -40,
          background: `conic-gradient(from 0deg, transparent 0deg, var(--ac) 60deg, transparent 120deg)`,
          animation: `vl-border-magic-spin ${duration}s linear infinite`,
          zIndex: 0,
        }}
      />
      <span
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 20px',
          borderRadius: 999,
          background: 'var(--bg-1)',
          color: 'var(--fg)',
          fontSize: 14,
          fontWeight: 500,
          fontFamily: 'inherit',
        }}
      >
        {children}
      </span>
      <style>{`
        @keyframes vl-border-magic-spin {
          to { transform: rotate(360deg) }
        }
      `}</style>
    </button>
  )
}
