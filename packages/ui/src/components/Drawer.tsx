import { useEffect, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../utils/cx'

export interface DrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  side?: 'bottom' | 'top'
  title?: string
  description?: string
  snapPoints?: number[]
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

/** Mobile-first bottom (or top) drawer. Simplified vaul-style sheet without drag physics. */
export function Drawer({
  open,
  onOpenChange,
  side = 'bottom',
  title,
  description,
  children,
  className,
  style,
}: DrawerProps) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onOpenChange])

  if (!open || typeof document === 'undefined') return null

  const panel: CSSProperties = side === 'bottom'
    ? {
        position: 'fixed',
        left: 0, right: 0, bottom: 0,
        maxHeight: '85vh',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        animation: 'vl-drawer-up 250ms cubic-bezier(.22,1,.36,1) both',
      }
    : {
        position: 'fixed',
        left: 0, right: 0, top: 0,
        maxHeight: '85vh',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        animation: 'vl-drawer-down 250ms cubic-bezier(.22,1,.36,1) both',
      }

  return createPortal(
    <>
      <div
        onClick={() => onOpenChange(false)}
        style={{ position: 'fixed', inset: 0, background: 'oklch(0 0 0/.45)', zIndex: 999, animation: 'vl-fade-in 200ms both' }}
      />
      <div
        role="dialog"
        aria-modal
        aria-label={title}
        className={cx('vl-drawer', className)}
        style={{
          zIndex: 1000,
          background: 'var(--bg-1)',
          border: '1px solid var(--line)',
          boxShadow: 'var(--shadow-lg)',
          color: 'var(--fg)',
          display: 'flex',
          flexDirection: 'column',
          ...panel,
          ...style,
        }}
      >
        {side === 'bottom' && (
          <span style={{ alignSelf: 'center', width: 36, height: 4, borderRadius: 2, background: 'var(--line-2)', marginTop: 10 }} />
        )}
        {(title || description) && (
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)' }}>
            {title && <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg)' }}>{title}</div>}
            {description && <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 2 }}>{description}</div>}
          </div>
        )}
        <div style={{ padding: '12px 20px', overflow: 'auto' }}>{children}</div>
      </div>
      <style>{`
        @keyframes vl-drawer-up { from { transform: translateY(100%) } to { transform: translateY(0) } }
        @keyframes vl-drawer-down { from { transform: translateY(-100%) } to { transform: translateY(0) } }
        @keyframes vl-fade-in { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </>,
    document.body,
  )
}
