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

interface PopoverCtx {
  open: boolean
  setOpen: (o: boolean) => void
  triggerRef: React.MutableRefObject<HTMLElement | null>
  contentRef: React.MutableRefObject<HTMLDivElement | null>
}
const Ctx = createContext<PopoverCtx | null>(null)

export interface PopoverProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: ReactNode
}

function PopoverRoot({ open: controlledOpen, defaultOpen, onOpenChange, children }: PopoverProps) {
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
      if (e.key === 'Escape') setOpen(false)
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

export interface PopoverTriggerProps {
  children: ReactElement
  asChild?: boolean
}

function Trigger({ children }: PopoverTriggerProps) {
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
    'aria-haspopup': 'dialog',
    'data-vl-popover-trigger': '',
  }
  return cloneElement(child, triggerProps)
}

export interface PopoverContentProps extends ComponentProps<'div'> {
  side?: 'top' | 'bottom'
  align?: 'start' | 'center' | 'end'
}

function Content({ children, className, style, side = 'bottom', align = 'start', ...rest }: PopoverContentProps) {
  const ctx = useContext(Ctx)
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (!ctx?.open) return
    const el = ctx.triggerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    let y = side === 'bottom' ? rect.bottom + 6 : rect.top - 6
    let x = rect.left
    if (align === 'center') x = rect.left + rect.width / 2
    else if (align === 'end') x = rect.right
    setCoords({ x, y })
  }, [ctx?.open, side, align])

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
    padding: 12,
    color: 'var(--fg)',
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    minWidth: 180,
    zIndex: 1100,
    ...style,
  }

  return createPortal(
    <div
      ref={(el) => {
        if (ctx) ctx.contentRef.current = el
      }}
      role="dialog"
      data-vl-popover-content=""
      data-side={side}
      className={cx('vl-popover__content', className)}
      style={panel}
      {...rest}
    >
      {children}
    </div>,
    document.body,
  )
}

export const Popover = Object.assign(PopoverRoot, { Trigger, Content })
