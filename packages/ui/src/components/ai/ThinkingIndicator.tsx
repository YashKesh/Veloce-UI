import { type ComponentProps } from 'react'
import { cx } from '../../utils/cx'

export interface ThinkingIndicatorProps extends ComponentProps<'span'> {
  /** Optional label like "Thinking…" or "Searching the web…" */
  label?: string
  /** Size variant. */
  size?: 'sm' | 'md'
}

/** Three-dot pulsing animation + optional label. Shown while the model is generating
 *  but hasn't started streaming yet, or during tool use. */
export function ThinkingIndicator({ label, size = 'md', className, style, ...rest }: ThinkingIndicatorProps) {
  const dot = size === 'sm' ? 5 : 6
  return (
    <span
      data-vl-thinking=""
      className={cx('vl-thinking', className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        fontSize: size === 'sm' ? 12 : 13.5,
        color: 'var(--fg-2)',
        fontFamily: 'inherit',
        ...style,
      }}
      {...rest}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            aria-hidden
            style={{
              width: dot,
              height: dot,
              borderRadius: '50%',
              background: 'var(--ac)',
              animation: 'vl-dots 1.3s ease-in-out infinite',
              animationDelay: `${i * 160}ms`,
            }}
          />
        ))}
      </span>
      {label && <span>{label}</span>}
    </span>
  )
}
