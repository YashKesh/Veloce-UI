import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../utils/cx'

interface MenuCtx {
  open: boolean
  setOpen: (o: boolean) => void
  triggerRef: React.MutableRefObject<HTMLElement | null>
  contentRef: React.MutableRefObject<HTMLDivElement | null>
}
const Ctx = createContext<MenuCtx | null>(null)

export interface DropdownMenuProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: ReactNode
}

function DropdownRoot({ open: controlledOpen, defaultOpen, onOpenChange, children }: DropdownMenuProps) {
  const [uncontrolled, setUncontrolled] = useState(!!defaultOpen)
  const open = controlledOpen ?? uncontrolled
  const setOpen = (o: boolean) => {
    if (controlledOpen === undefined) setUncontrolled(o)
    onOpenChange?.(o)
  }
  const triggerRef = useRef<HTMLElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (contentRef.current?.contains(t)) return
      if (triggerRef.current?.contains(t)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        ;(triggerRef.current as HTMLElement | null)?.focus?.()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return <Ctx.Provider value={{ open, setOpen, triggerRef, contentRef }}>{children}</Ctx.Provider>
}

function Trigger({ children }: { children: ReactElement }) {
  const ctx = useContext(Ctx)
  const child = Children.only(children)
  if (!isValidElement(child)) return children
  const triggerProps: any = {
    ref: (el: HTMLElement) => {
      if (ctx) ctx.triggerRef.current = el
      const r = (child as any).ref
      if (typeof r === 'function') r(el)
      else if (r) r.current = el
    },
    onClick: (e: any) => {
      ;(child.props as any).onClick?.(e)
      if (!e.defaultPrevented) ctx?.setOpen(!ctx.open)
    },
    'aria-expanded': ctx?.open,
    'aria-haspopup': 'menu',
    'data-vl-dropdown-trigger': '',
  }
  return cloneElement(child, triggerProps)
}

export interface DropdownContentProps extends ComponentProps<'div'> {
  side?: 'top' | 'bottom'
  align?: 'start' | 'center' | 'end'
}

function Content({ children, className, style, side = 'bottom', align = 'start', ...rest }: DropdownContentProps) {
  const ctx = useContext(Ctx)
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (!ctx?.open) return
    const el = ctx.triggerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const y = side === 'bottom' ? rect.bottom + 4 : rect.top - 4
    let x = rect.left
    if (align === 'center') x = rect.left + rect.width / 2
    else if (align === 'end') x = rect.right
    setCoords({ x, y })
  }, [ctx?.open, side, align])

  useEffect(() => {
    if (!ctx?.open) return
    const t = window.setTimeout(() => {
      const first = ctx.contentRef.current?.querySelector<HTMLElement>('[data-vl-dropdown-item]:not([aria-disabled="true"])')
      first?.focus()
    }, 0)
    return () => window.clearTimeout(t)
  }, [ctx?.open])

  if (!ctx?.open || !coords || typeof document === 'undefined') return null

  const transform =
    align === 'center'
      ? `translate(-50%, ${side === 'top' ? '-100%' : '0'})`
      : align === 'end'
        ? `translate(-100%, ${side === 'top' ? '-100%' : '0'})`
        : `translate(0, ${side === 'top' ? '-100%' : '0'})`

  const panel: CSSProperties = {
    position: 'fixed',
    left: coords.x,
    top: coords.y,
    transform,
    background: 'var(--bg-1)',
    border: '1px solid var(--line)',
    borderRadius: 'var(--r-md)',
    boxShadow: 'var(--shadow-md)',
    padding: 4,
    color: 'var(--fg)',
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    minWidth: 160,
    zIndex: 1100,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    ...style,
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const items = Array.from(
      ctx.contentRef.current?.querySelectorAll<HTMLElement>('[data-vl-dropdown-item]:not([aria-disabled="true"])') ?? [],
    )
    if (!items.length) return
    const i = items.findIndex((it) => it === document.activeElement)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      items[(i + 1) % items.length]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      items[(i - 1 + items.length) % items.length]?.focus()
    } else if (e.key === 'Home') {
      e.preventDefault()
      items[0]?.focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      items[items.length - 1]?.focus()
    }
  }

  return createPortal(
    <div
      ref={(el) => {
        if (ctx) ctx.contentRef.current = el
      }}
      role="menu"
      data-vl-dropdown-content=""
      className={cx('vl-dropdown__content', className)}
      style={panel}
      onKeyDown={onKeyDown}
      {...rest}
    >
      {children}
    </div>,
    document.body,
  )
}

export interface DropdownItemProps extends ComponentProps<'button'> {
  disabled?: boolean
  onSelect?: () => void
}

function Item({ children, className, style, disabled, onSelect, onClick, onKeyDown, ...rest }: DropdownItemProps) {
  const ctx = useContext(Ctx)
  const base: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 10px',
    border: 'none',
    background: 'var(--vl-dropdown-item-bg, transparent)',
    textAlign: 'left',
    cursor: disabled ? 'not-allowed' : 'pointer',
    color: disabled ? 'var(--fg-3)' : 'var(--fg)',
    borderRadius: 'var(--r-sm)',
    fontFamily: 'inherit',
    fontSize: 14,
    outline: 'none',
    ...style,
  }
  const activate = () => {
    if (disabled) return
    onSelect?.()
    ctx?.setOpen(false)
  }
  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      aria-disabled={disabled || undefined}
      data-vl-dropdown-item=""
      className={cx('vl-dropdown__item', className)}
      style={base}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) activate()
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (!e.defaultPrevented && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          activate()
        }
      }}
      {...rest}
    >
      {children}
    </button>
  )
}

function Separator({ className, style, ...rest }: ComponentProps<'div'>) {
  return (
    <div
      role="separator"
      data-vl-dropdown-separator=""
      className={cx('vl-dropdown__separator', className)}
      style={{ height: 1, background: 'var(--line)', margin: '4px 0', ...style }}
      {...rest}
    />
  )
}

export const DropdownMenu = Object.assign(DropdownRoot, { Trigger, Content, Item, Separator })
