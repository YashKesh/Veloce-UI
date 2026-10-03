import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../utils/cx'

export interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  side?: 'right' | 'left' | 'top' | 'bottom'
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

function SheetHeader({ style, className, children, ...rest }: ComponentProps<'div'>) {
  return (
    <div
      className={cx('vl-sheet__header', className)}
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

function SheetBody({ style, className, children, ...rest }: ComponentProps<'div'>) {
  return (
    <div
      className={cx('vl-sheet__body', className)}
      style={{
        padding: '16px 20px',
        color: 'var(--fg-2)',
        fontSize: 14,
        lineHeight: 1.5,
        flex: 1,
        overflow: 'auto',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

function SheetFooter({ style, className, children, ...rest }: ComponentProps<'div'>) {
  return (
    <div
      className={cx('vl-sheet__footer', className)}
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

const sizeMap: Record<'sm' | 'md' | 'lg', number> = { sm: 320, md: 420, lg: 560 }

const SheetRoot = forwardRef<HTMLDivElement, SheetProps>(function SheetRoot(
  {
    open,
    onOpenChange,
    side = 'right',
    size = 'md',
    title,
    description,
    children,
    className,
    style: userStyle,
  },
  ref,
) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const prevFocusRef = useRef<HTMLElement | null>(null)
  const reactId = useId()
  const titleId = `vl-sheet-title-${reactId}`
  const descId = `vl-sheet-desc-${reactId}`

  const setPanelRef = (el: HTMLDivElement | null) => {
    panelRef.current = el
    if (typeof ref === 'function') ref(el)
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el
  }

  useEffect(() => {
    if (!open) return
    if (typeof document === 'undefined') return

    prevFocusRef.current = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onOpenChange(false)
      }
    }
    window.addEventListener('keydown', onKey)

    const onFocusIn = (e: FocusEvent) => {
      const panel = panelRef.current
      if (!panel) return
      if (e.target instanceof Node && !panel.contains(e.target)) {
        panel.focus()
      }
    }
    document.addEventListener('focusin', onFocusIn)

    const t = window.setTimeout(() => {
      panelRef.current?.focus()
    }, 0)

    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('focusin', onFocusIn)
      window.clearTimeout(t)
      document.body.style.overflow = prevOverflow
      const prev = prevFocusRef.current
      if (prev && typeof prev.focus === 'function') {
        try {
          prev.focus()
        } catch {
          /* ignore */
        }
      }
    }
  }, [open, onOpenChange])

  if (!open) return null
  if (typeof document === 'undefined') return null

  const sz = sizeMap[size]

  const panelStyle: CSSProperties = {
    position: 'fixed',
    background: 'var(--bg-1)',
    color: 'var(--fg)',
    fontFamily: 'var(--font-sans)',
    boxShadow: 'var(--shadow-lg)',
    display: 'flex',
    flexDirection: 'column',
    outline: 'none',
    zIndex: 1001,
    ...(side === 'right' && {
      top: 0,
      right: 0,
      bottom: 0,
      width: sz,
      maxWidth: 'calc(100vw - 32px)',
      borderLeft: '1px solid var(--line)',
    }),
    ...(side === 'left' && {
      top: 0,
      left: 0,
      bottom: 0,
      width: sz,
      maxWidth: 'calc(100vw - 32px)',
      borderRight: '1px solid var(--line)',
    }),
    ...(side === 'top' && {
      top: 0,
      left: 0,
      right: 0,
      height: sz,
      maxHeight: 'calc(100vh - 32px)',
      borderBottom: '1px solid var(--line)',
    }),
    ...(side === 'bottom' && {
      bottom: 0,
      left: 0,
      right: 0,
      height: sz,
      maxHeight: 'calc(100vh - 32px)',
      borderTop: '1px solid var(--line)',
    }),
    animation: `vl-in 220ms var(--ease-swift-out)`,
    transform: 'translate3d(0,0,0)',
    transition: 'transform 220ms var(--ease-swift-out)',
  }

  const backdropStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'oklch(0 0 0 / 0.55)',
    zIndex: 1000,
    animation: 'vl-in 180ms var(--ease-swift-out)',
  }

  return createPortal(
    <div data-vl-sheet="" data-side={side}>
      <div
        role="presentation"
        data-vl-sheet-backdrop=""
        style={backdropStyle}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onOpenChange(false)
        }}
      />
      <div
        ref={setPanelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        data-vl-sheet-panel=""
        data-side={side}
        data-size={size}
        className={cx('vl-sheet', className)}
        style={{ ...panelStyle, ...userStyle }}
      >
        {(title || description) && (
          <SheetHeader>
            {title && <div id={titleId}>{title}</div>}
            {description && (
              <div
                id={descId}
                style={{ fontWeight: 400, color: 'var(--fg-2)', fontSize: 13, marginTop: 4 }}
              >
                {description}
              </div>
            )}
          </SheetHeader>
        )}
        {children}
      </div>
    </div>,
    document.body,
  )
})

export const Sheet = Object.assign(SheetRoot, {
  Header: SheetHeader,
  Body: SheetBody,
  Footer: SheetFooter,
})
