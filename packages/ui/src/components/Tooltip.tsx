import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

interface TooltipProviderCtx {
  openDelay: number
  closeDelay: number
}
const Ctx = createContext<TooltipProviderCtx>({ openDelay: 400, closeDelay: 100 })

export interface TooltipProviderProps {
  openDelay?: number
  closeDelay?: number
  children?: ReactNode
}

export function TooltipProvider({ openDelay = 400, closeDelay = 100, children }: TooltipProviderProps) {
  return <Ctx.Provider value={{ openDelay, closeDelay }}>{children}</Ctx.Provider>
}

export interface TooltipProps {
  content: ReactNode
  children: ReactElement
  side?: 'top' | 'bottom'
  openDelay?: number
  closeDelay?: number
  defaultOpen?: boolean
}

export function Tooltip({ content, children, side = 'top', openDelay, closeDelay, defaultOpen }: TooltipProps) {
  const ctx = useContext(Ctx)
  const [open, setOpen] = useState(!!defaultOpen)
  const [coords, setCoords] = useState<{ x: number; y: number; placement: 'top' | 'bottom' } | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const openTimer = useRef<number | null>(null)
  const closeTimer = useRef<number | null>(null)
  const id = useId()
  const oDelay = openDelay ?? ctx.openDelay
  const cDelay = closeDelay ?? ctx.closeDelay

  const compute = () => {
    const el = triggerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    let placement: 'top' | 'bottom' = side
    const estHeight = 32
    if (placement === 'top' && rect.top < estHeight + 10) placement = 'bottom'
    const y = placement === 'top' ? rect.top - 8 : rect.bottom + 8
    setCoords({ x: rect.left + rect.width / 2, y, placement })
  }

  const show = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    openTimer.current = window.setTimeout(() => {
      compute()
      setOpen(true)
    }, oDelay)
  }
  const hide = () => {
    if (openTimer.current) window.clearTimeout(openTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), cDelay)
  }

  useEffect(() => () => {
    if (openTimer.current) window.clearTimeout(openTimer.current)
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
  }, [])

  const child = Children.only(children)
  if (!isValidElement(child)) return children

  const triggerProps: any = {
    ref: (el: HTMLElement) => {
      triggerRef.current = el
      const r = (child as any).ref
      if (typeof r === 'function') r(el)
      else if (r) r.current = el
    },
    onMouseEnter: (e: any) => {
      ;(child.props as any).onMouseEnter?.(e)
      show()
    },
    onMouseLeave: (e: any) => {
      ;(child.props as any).onMouseLeave?.(e)
      hide()
    },
    onFocus: (e: any) => {
      ;(child.props as any).onFocus?.(e)
      show()
    },
    onBlur: (e: any) => {
      ;(child.props as any).onBlur?.(e)
      hide()
    },
    'aria-describedby': open ? id : undefined,
  }

  const trigger = cloneElement(child, triggerProps)

  const tip =
    open && coords && typeof document !== 'undefined'
      ? createPortal(
          <div
            role="tooltip"
            id={id}
            data-vl-tooltip=""
            data-side={coords.placement}
            style={{
              position: 'fixed',
              left: coords.x,
              top: coords.y,
              transform: `translate(-50%, ${coords.placement === 'top' ? '-100%' : '0'})`,
              background: 'var(--vl-tooltip-bg, var(--fg))',
              color: 'var(--vl-tooltip-color, var(--bg))',
              padding: '6px 10px',
              borderRadius: 'var(--r-sm)',
              fontFamily: 'var(--font-sans)',
              fontSize: 12,
              lineHeight: 1.3,
              pointerEvents: 'none',
              zIndex: 1200,
              whiteSpace: 'nowrap',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {content}
          </div>,
          document.body,
        )
      : null

  return (
    <>
      {trigger}
      {tip}
    </>
  )
}
