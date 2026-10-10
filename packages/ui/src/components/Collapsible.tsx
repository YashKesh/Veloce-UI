import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useState,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { cx } from '../utils/cx'

interface CollapsibleCtx {
  open: boolean
  setOpen: (open: boolean) => void
  disabled: boolean
  triggerId: string
  contentId: string
}

const Ctx = createContext<CollapsibleCtx | null>(null)
const useCollapsible = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('Collapsible subcomponents must be used inside <Collapsible>')
  return c
}

export interface CollapsibleProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  children?: ReactNode
}

/** A single open/close region. Lighter than Accordion when you only need one disclosure.
 *  Unlike Accordion, no multi-item context — just a trigger + content pair. */
const CollapsibleRoot = forwardRef<HTMLDivElement, CollapsibleProps>(function Collapsible(
  { open, defaultOpen = false, onOpenChange, disabled = false, className, style, children, ...rest },
  ref,
) {
  const [internal, setInternal] = useState(defaultOpen)
  const isOpen = open ?? internal
  const setOpen = (next: boolean) => {
    if (open === undefined) setInternal(next)
    onOpenChange?.(next)
  }
  const uid = useId().replace(/:/g, '')
  const triggerId = `vl-coll-t-${uid}`
  const contentId = `vl-coll-c-${uid}`

  return (
    <Ctx.Provider value={{ open: isOpen, setOpen, disabled, triggerId, contentId }}>
      <div
        ref={ref}
        data-vl-collapsible=""
        data-state={isOpen ? 'open' : 'closed'}
        className={cx('vl-collapsible', className)}
        style={style}
        {...rest}
      >
        {children}
      </div>
    </Ctx.Provider>
  )
})

export interface CollapsibleTriggerProps extends ComponentProps<'button'> {
  children?: ReactNode
}

const Trigger = forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(function CollapsibleTrigger(
  { className, style, onClick, children, ...rest },
  ref,
) {
  const { open, setOpen, disabled, triggerId, contentId } = useCollapsible()
  return (
    <button
      ref={ref}
      type="button"
      id={triggerId}
      aria-expanded={open}
      aria-controls={contentId}
      disabled={disabled}
      data-vl-collapsible-trigger=""
      data-state={open ? 'open' : 'closed'}
      className={cx('vl-collapsible__trigger', className)}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented && !disabled) setOpen(!open)
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: 0,
        background: 'none',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: 'inherit',
        font: 'inherit',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  )
})

export interface CollapsibleContentProps extends ComponentProps<'div'> {
  children?: ReactNode
}

const Content = forwardRef<HTMLDivElement, CollapsibleContentProps>(function CollapsibleContent(
  { className, style, children, ...rest },
  ref,
) {
  const { open, triggerId, contentId } = useCollapsible()
  const base: CSSProperties = {
    display: 'grid',
    gridTemplateRows: open ? '1fr' : '0fr',
    transition: 'grid-template-rows 220ms var(--ease-swift-out)',
    ...style,
  }
  return (
    <div
      ref={ref}
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      data-vl-collapsible-content=""
      data-state={open ? 'open' : 'closed'}
      className={cx('vl-collapsible__content', className)}
      hidden={!open}
      style={base}
      {...rest}
    >
      <div style={{ overflow: 'hidden' }}>{children}</div>
    </div>
  )
})

export const Collapsible = Object.assign(CollapsibleRoot, { Trigger, Content })
