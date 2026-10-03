import {
  createContext,
  forwardRef,
  useContext,
  useRef,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { cx } from '../utils/cx'

type AccordionType = 'single' | 'multiple'

interface AccordionCtx {
  type: AccordionType
  value: string | string[] | undefined
  onValueChange?: (v: any) => void
}
const Ctx = createContext<AccordionCtx | null>(null)

interface ItemCtx {
  value: string
  open: boolean
  toggle: () => void
}
const ItemCtxC = createContext<ItemCtx | null>(null)

interface SingleProps {
  type: 'single'
  value?: string
  onValueChange?: (v: string) => void
}
interface MultipleProps {
  type: 'multiple'
  value?: string[]
  onValueChange?: (v: string[]) => void
}

export type AccordionProps = (SingleProps | MultipleProps) & Omit<ComponentProps<'div'>, 'onChange'>

const AccordionRoot = forwardRef<HTMLDivElement, AccordionProps>(function AccordionRoot(
  props,
  ref,
) {
  const { type, value, onValueChange, className, style, children, ...rest } = props as any
  const rootRef = useRef<HTMLDivElement | null>(null)
  const setRef = (el: HTMLDivElement | null) => {
    rootRef.current = el
    if (typeof ref === 'function') ref(el)
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el
  }
  const onKey = (e: React.KeyboardEvent) => {
    const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End']
    if (!keys.includes(e.key)) return
    const triggers = Array.from(
      rootRef.current?.querySelectorAll<HTMLButtonElement>('[data-vl-accordion-trigger]:not(:disabled)') ?? [],
    )
    if (!triggers.length) return
    const i = triggers.findIndex((t) => t === document.activeElement)
    let next = i
    if (e.key === 'ArrowDown') next = (i + 1) % triggers.length
    else if (e.key === 'ArrowUp') next = (i - 1 + triggers.length) % triggers.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = triggers.length - 1
    e.preventDefault()
    triggers[next]?.focus()
  }
  return (
    <Ctx.Provider value={{ type, value, onValueChange }}>
      <div
        ref={setRef}
        data-vl-accordion=""
        data-type={type}
        className={cx('vl-accordion', className)}
        onKeyDown={onKey}
        style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--line)', ...style }}
        {...rest}
      >
        {children}
      </div>
    </Ctx.Provider>
  )
})

export interface AccordionItemProps extends Omit<ComponentProps<'div'>, 'value'> {
  value: string
  disabled?: boolean
  children?: ReactNode
}

const Item = forwardRef<HTMLDivElement, AccordionItemProps>(function Item(
  { value, className, style, children, disabled, ...rest },
  ref,
) {
  const ctx = useContext(Ctx)
  const open =
    ctx?.type === 'single' ? ctx?.value === value : Array.isArray(ctx?.value) && ctx.value.includes(value)
  const toggle = () => {
    if (disabled) return
    if (ctx?.type === 'single') {
      ctx?.onValueChange?.(open ? '' : value)
    } else if (ctx?.type === 'multiple') {
      const cur = Array.isArray(ctx.value) ? ctx.value : []
      ctx?.onValueChange?.(open ? cur.filter((v) => v !== value) : [...cur, value])
    }
  }
  return (
    <ItemCtxC.Provider value={{ value, open, toggle }}>
      <div
        ref={ref}
        data-vl-accordion-item=""
        data-state={open ? 'open' : 'closed'}
        className={cx('vl-accordion__item', className)}
        style={{ borderBottom: '1px solid var(--line)', ...style }}
        {...rest}
      >
        {children}
      </div>
    </ItemCtxC.Provider>
  )
})

const Trigger = forwardRef<HTMLButtonElement, ComponentProps<'button'>>(function Trigger(
  { className, style, children, onClick, ...rest },
  ref,
) {
  const ic = useContext(ItemCtxC)
  const base: CSSProperties = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    padding: '12px 4px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--vl-accordion-fg, var(--fg))',
    textAlign: 'left',
    ...style,
  }
  return (
    <button
      ref={ref}
      type="button"
      data-vl-accordion-trigger=""
      aria-expanded={ic?.open}
      className={cx('vl-accordion__trigger', className)}
      style={base}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) ic?.toggle()
      }}
      {...rest}
    >
      <span>{children}</span>
      <span aria-hidden style={{ transition: 'transform 180ms var(--ease-swift-out)', transform: ic?.open ? 'rotate(180deg)' : 'none', fontSize: 12, color: 'var(--fg-3)' }}>▾</span>
    </button>
  )
})

const Content = forwardRef<HTMLDivElement, ComponentProps<'div'>>(function Content(
  { className, style, children, ...rest },
  ref,
) {
  const ic = useContext(ItemCtxC)
  if (!ic?.open) return null
  return (
    <div
      ref={ref}
      data-vl-accordion-content=""
      role="region"
      className={cx('vl-accordion__content', className)}
      style={{ padding: '0 4px 12px', color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.5, ...style }}
      {...rest}
    >
      {children}
    </div>
  )
})

export const Accordion = Object.assign(AccordionRoot, { Item, Trigger, Content })
