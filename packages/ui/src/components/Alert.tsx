import { forwardRef, type ComponentProps, type CSSProperties, type ReactNode } from 'react'
import { cx } from '../utils/cx'

export type AlertTone = 'info' | 'ok' | 'warn' | 'err'

export interface AlertProps extends ComponentProps<'div'> {
  tone?: AlertTone
  title?: string
  onDismiss?: () => void
  children?: ReactNode
}

const toneColor: Record<AlertTone, string> = {
  info: 'var(--ac)',
  ok: 'var(--ok)',
  warn: 'var(--warn)',
  err: 'var(--err)',
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { tone = 'info', title, onDismiss, children, style, className, ...rest },
  ref,
) {
  const color = toneColor[tone]
  const styles: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '12px 14px',
    borderRadius: 'var(--r-md)',
    background: `color-mix(in oklch, ${color} 10%, var(--bg-1))`,
    border: `1px solid color-mix(in oklch, ${color} 40%, transparent)`,
    color: 'var(--fg)',
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    lineHeight: 1.5,
  }
  return (
    <div
      ref={ref}
      role="alert"
      data-vl-alert=""
      data-tone={tone}
      className={cx('vl-alert', className)}
      style={{ ...styles, ...style }}
      {...rest}
    >
      <span
        aria-hidden
        style={{ width: 4, alignSelf: 'stretch', background: color, borderRadius: 2, flex: '0 0 auto' }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontWeight: 600, color: 'var(--fg)', marginBottom: 2 }}>{title}</div>}
        <div style={{ color: 'var(--fg-2)' }}>{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          data-vl-alert-close=""
          style={{
            background: 'var(--vl-alert-close-bg, transparent)',
            border: 'none',
            color: 'var(--vl-alert-close-fg, var(--fg-3))',
            cursor: 'pointer',
            fontSize: 14,
            padding: 2,
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      )}
    </div>
  )
})
