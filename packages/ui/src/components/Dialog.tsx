import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { cx } from '../utils/cx'

export interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

function DialogHeader({ style, className, children, ...rest }: ComponentProps<'div'>) {
  return (
    <div
      className={cx('vl-dialog__header', className)}
      style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--line)',
        fontWeight: 600,
        color: 'var(--fg)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

function DialogBody({ style, className, children, ...rest }: ComponentProps<'div'>) {
  return (
    <div
      className={cx('vl-dialog__body', className)}
      style={{
        padding: '16px 20px',
        color: 'var(--fg-2)',
        fontSize: 14,
        lineHeight: 1.5,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

function DialogFooter({ style, className, children, ...rest }: ComponentProps<'div'>) {
  return (
    <div
      className={cx('vl-dialog__footer', className)}
      style={{
        padding: '12px 20px',
        borderTop: '1px solid var(--line)',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 8,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

const DialogRoot = forwardRef<HTMLDivElement, DialogProps>(function DialogRoot(
  { open, onOpenChange, title, description, children, className, style: userStyle },
  ref,
) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const reactId = useId()
  const titleId = `vl-dialog-title-${reactId}`
  const descId = `vl-dialog-desc-${reactId}`

  const setPanelRef = (el: HTMLDivElement | null) => {
    panelRef.current = el
    if (typeof ref === 'function') ref(el)
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el
  }

  useEffect(() => {
    if (!open) return
    const prevOverflow = typeof document !== 'undefined' ? document.body.style.overflow : ''
    if (typeof document !== 'undefined') document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onOpenChange(false)
      }
    }
    window.addEventListener('keydown', onKey)

    const t = window.setTimeout(() => {
      const panel = panelRef.current
      if (!panel) return
      const focusable = panel.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      ;(focusable ?? panel).focus()
    }, 0)

    return () => {
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
      if (typeof document !== 'undefined') document.body.style.overflow = prevOverflow
    }
  }, [open, onOpenChange])

  if (!open) return null

  const overlay: CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'var(--vl-dialog-overlay, oklch(0 0 0 / 0.55))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'vl-in 180ms var(--ease-swift-out)',
  }
  const panel: CSSProperties = {
    background: 'var(--vl-dialog-bg, var(--bg-1))',
    border: `1px solid var(--vl-dialog-border, var(--line))`,
    borderRadius: 'var(--vl-dialog-radius, var(--r-xl))',
    boxShadow: 'var(--vl-dialog-shadow, var(--shadow-lg))',
    minWidth: 320,
    maxWidth: 'min(560px, calc(100vw - 32px))',
    maxHeight: 'calc(100vh - 32px)',
    overflow: 'auto',
    color: 'var(--fg)',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
  }

  return (
    <div
      role="presentation"
      style={overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false)
      }}
    >
      <div
        ref={setPanelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        data-vl-dialog=""
        className={cx('vl-dialog', className)}
        style={{ ...panel, ...userStyle }}
      >
        {(title || description) && (
          <DialogHeader>
            {title && <div id={titleId}>{title}</div>}
            {description && (
              <div
                id={descId}
                style={{ fontWeight: 400, color: 'var(--fg-2)', fontSize: 13, marginTop: 4 }}
              >
                {description}
              </div>
            )}
          </DialogHeader>
        )}
        {children}
      </div>
    </div>
  )
})

export const Dialog = Object.assign(DialogRoot, {
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
})
