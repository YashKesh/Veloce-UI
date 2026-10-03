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

interface TabsCtx {
  value: string
  onValueChange?: (v: string) => void
}

const Ctx = createContext<TabsCtx | null>(null)

export interface TabsProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  value: string
  onValueChange?: (v: string) => void
  children?: ReactNode
}

const TabsRoot = forwardRef<HTMLDivElement, TabsProps>(function TabsRoot(
  { value, onValueChange, className, style, children, ...rest },
  ref,
) {
  return (
    <Ctx.Provider value={{ value, onValueChange }}>
      <div
        ref={ref}
        data-vl-tabs=""
        className={cx('vl-tabs', className)}
        style={style}
        {...rest}
      >
        {children}
      </div>
    </Ctx.Provider>
  )
})

const List = forwardRef<HTMLDivElement, ComponentProps<'div'>>(function TabsList(
  { className, style, children, ...rest },
  ref,
) {
  const listRef = useRef<HTMLDivElement | null>(null)
  const setRef = (el: HTMLDivElement | null) => {
    listRef.current = el
    if (typeof ref === 'function') ref(el)
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el
  }
  const onKey = (e: React.KeyboardEvent) => {
    const keys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End']
    if (!keys.includes(e.key)) return
    const triggers = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[data-vl-tabs-trigger]:not(:disabled)') ?? [],
    )
    if (!triggers.length) return
    const i = triggers.findIndex((t) => t === document.activeElement)
    let next = i
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1 + triggers.length) % triggers.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + triggers.length) % triggers.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = triggers.length - 1
    e.preventDefault()
    triggers[next]?.focus()
    triggers[next]?.click()
  }
  return (
    <div
      ref={setRef}
      role="tablist"
      data-vl-tabs-list=""
      className={cx('vl-tabs__list', className)}
      onKeyDown={onKey}
      style={{
        display: 'flex',
        gap: 8,
        borderBottom: '1px solid var(--line)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
})

export interface TabsTriggerProps extends Omit<ComponentProps<'button'>, 'value'> {
  value: string
}

const Trigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(function Trigger(
  { value, className, style, children, onClick, ...rest },
  ref,
) {
  const ctx = useContext(Ctx)
  const selected = ctx?.value === value
  const base: CSSProperties = {
    position: 'relative',
    padding: '8px 14px',
    background: 'var(--vl-tabs-bg, transparent)',
    color: `var(--vl-tabs-fg, ${selected ? 'var(--fg)' : 'var(--fg-2)'})`,
    border: 0,
    borderBottom: `2px solid var(--vl-tabs-indicator, ${selected ? 'var(--ac)' : 'transparent'})`,
    marginBottom: -1,
    fontSize: 13.5,
    fontWeight: 500,
    fontFamily: 'var(--font-sans)',
    cursor: 'pointer',
    ...style,
  }
  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      data-vl-tabs-trigger=""
      data-state={selected ? 'active' : 'inactive'}
      className={cx('vl-tabs__trigger', className)}
      style={base}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) ctx?.onValueChange?.(value)
      }}
      {...rest}
    >
      {children}
    </button>
  )
})

export interface TabsContentProps extends Omit<ComponentProps<'div'>, 'value'> {
  value: string
}

const Content = forwardRef<HTMLDivElement, TabsContentProps>(function Content(
  { value, className, style, children, ...rest },
  ref,
) {
  const ctx = useContext(Ctx)
  if (ctx?.value !== value) return null
  return (
    <div
      ref={ref}
      role="tabpanel"
      data-vl-tabs-content=""
      className={cx('vl-tabs__content', className)}
      style={{ padding: '14px 0', ...style }}
      {...rest}
    >
      {children}
    </div>
  )
})

export const Tabs = Object.assign(TabsRoot, { List, Trigger, Content })
