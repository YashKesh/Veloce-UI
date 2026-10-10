import {
  Children,
  cloneElement,
  isValidElement,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react'
import { cx } from '../utils/cx'

export interface HoverCardProps {
  openDelay?: number
  closeDelay?: number
  children: ReactNode
}

export interface HoverCardTriggerProps {
  children: ReactElement
}

export interface HoverCardContentProps extends ComponentProps<'div'> {
  side?: 'top' | 'bottom'
  align?: 'start' | 'center' | 'end'
}

interface Ctx {
  open: boolean
  show: () => void
  hide: () => void
  anchorRef: React.MutableRefObject<HTMLElement | null>
}

import { createContext, useContext } from 'react'
const Context = createContext<Ctx | null>(null)
const useHoverCard = () => {
  const c = useContext(Context)
  if (!c) throw new Error('HoverCard subcomponents must be inside <HoverCard>')
  return c
}

function HoverCardRoot({ openDelay = 300, closeDelay = 150, children }: HoverCardProps) {
  const [open, setOpen] = useState(false)
  const openTimer = useRef<number | undefined>(undefined)
  const closeTimer = useRef<number | undefined>(undefined)
  const anchorRef = useRef<HTMLElement | null>(null)
  const show = () => {
    window.clearTimeout(closeTimer.current)
    openTimer.current = window.setTimeout(() => setOpen(true), openDelay)
  }
  const hide = () => {
    window.clearTimeout(openTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), closeDelay)
  }
  return (
    <Context.Provider value={{ open, show, hide, anchorRef }}>
      <span style={{ position: 'relative', display: 'inline-flex' }}>{children}</span>
    </Context.Provider>
  )
}

function Trigger({ children }: HoverCardTriggerProps) {
  const { show, hide, anchorRef } = useHoverCard()
  if (!isValidElement(children)) return <>{children}</>
  const only = Children.only(children) as ReactElement<Record<string, unknown>>
  const childProps = only.props as Record<string, unknown>
  const propsAdditions: Record<string, unknown> = {
    ref: (node: HTMLElement) => { anchorRef.current = node },
    onMouseEnter: (e: React.MouseEvent) => { (childProps.onMouseEnter as ((e: React.MouseEvent) => void) | undefined)?.(e); show() },
    onMouseLeave: (e: React.MouseEvent) => { (childProps.onMouseLeave as ((e: React.MouseEvent) => void) | undefined)?.(e); hide() },
    onFocus: (e: React.FocusEvent) => { (childProps.onFocus as ((e: React.FocusEvent) => void) | undefined)?.(e); show() },
    onBlur: (e: React.FocusEvent) => { (childProps.onBlur as ((e: React.FocusEvent) => void) | undefined)?.(e); hide() },
  }
  return cloneElement(only, propsAdditions)
}

function Content({ side = 'bottom', align = 'center', className, style, children, ...rest }: HoverCardContentProps) {
  const { open, show, hide } = useHoverCard()
  if (!open) return null
  const pos: CSSProperties = {
    position: 'absolute',
    [side === 'top' ? 'bottom' : 'top']: 'calc(100% + 8px)',
    left: align === 'start' ? 0 : align === 'end' ? 'auto' : '50%',
    right: align === 'end' ? 0 : 'auto',
    transform: align === 'center' ? 'translateX(-50%)' : 'none',
  }
  return (
    <div
      role="dialog"
      onMouseEnter={show}
      onMouseLeave={hide}
      className={cx('vl-hover-card', className)}
      style={{
        ...pos,
        zIndex: 50,
        minWidth: 220,
        padding: 14,
        borderRadius: 10,
        background: 'var(--bg-2)',
        border: '1px solid var(--line-2)',
        boxShadow: 'var(--shadow-md)',
        fontSize: 13,
        color: 'var(--fg)',
        animation: 'vl-in .18s cubic-bezier(.16,1,.3,1) both',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

export const HoverCard = Object.assign(HoverCardRoot, { Trigger, Content })
