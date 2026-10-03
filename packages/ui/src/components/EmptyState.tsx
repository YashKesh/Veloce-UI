import { forwardRef, type ComponentProps, type ReactNode } from 'react'
import { cx } from '../utils/cx'

export interface EmptyStateProps extends Omit<ComponentProps<'div'>, 'title'> {
  title?: ReactNode
  description?: ReactNode
  icon?: ReactNode
  action?: ReactNode
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { title, description, icon, action, className, style, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-vl-empty-state=""
      className={cx('vl-empty-state', className)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 32,
        border: '1px dashed var(--line)',
        borderRadius: 'var(--r-lg)',
        background: 'var(--bg-1)',
        color: 'var(--fg)',
        fontFamily: 'var(--font-sans)',
        gap: 10,
        ...style,
      }}
      {...rest}
    >
      {icon && (
        <div data-vl-empty-state-icon="" style={{ color: 'var(--fg-3)', fontSize: 28 }}>
          {icon}
        </div>
      )}
      {title && (
        <div data-vl-empty-state-title="" style={{ fontWeight: 600, fontSize: 16 }}>
          {title}
        </div>
      )}
      {description && (
        <div data-vl-empty-state-desc="" style={{ color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.5, maxWidth: 420 }}>
          {description}
        </div>
      )}
      {children}
      {action && <div data-vl-empty-state-action="" style={{ marginTop: 6 }}>{action}</div>}
    </div>
  )
})
