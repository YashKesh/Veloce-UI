import {
  forwardRef,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { cx } from '../utils/cx'

export interface SidebarProps {
  width?: number
  footer?: ReactNode
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export interface SidebarGroupProps {
  title?: string
  defaultOpen?: boolean
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

export interface SidebarSectionProps {
  title: string
  defaultOpen?: boolean
  badge?: ReactNode
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

export interface SidebarItemProps extends ComponentProps<'a'> {
  active?: boolean
  disabled?: boolean
  chip?: ReactNode
  icon?: ReactNode
}

export interface SidebarSubProps extends ComponentProps<'button'> {
  active?: boolean
}

export interface SidebarFooterProps {
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

/* -------------------------- helpers -------------------------- */

function moveItemFocus(root: HTMLElement | null, dir: 1 | -1) {
  if (!root) return
  const items = Array.from(
    root.querySelectorAll<HTMLElement>(
      '[data-vl-sidebar-item]:not([aria-disabled="true"]),[data-vl-sidebar-sub]:not(:disabled),[data-vl-sidebar-section-trigger]:not(:disabled),[data-vl-sidebar-group-trigger]:not(:disabled)',
    ),
  )
  if (!items.length) return
  const i = items.findIndex((el) => el === document.activeElement)
  const nextIndex = i === -1 ? (dir === 1 ? 0 : items.length - 1) : (i + dir + items.length) % items.length
  items[nextIndex]?.focus()
}

/* -------------------------- Root -------------------------- */

const SidebarRoot = forwardRef<HTMLElement, SidebarProps>(function SidebarRoot(
  { width = 264, footer, className, style, children },
  ref,
) {
  const rootRef = useRef<HTMLElement | null>(null)
  const setRef = (el: HTMLElement | null) => {
    rootRef.current = el
    if (typeof ref === 'function') ref(el)
    else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = el
  }
  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      moveItemFocus(rootRef.current, 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      moveItemFocus(rootRef.current, -1)
    }
  }
  return (
    <nav
      ref={setRef}
      aria-label="Secondary"
      data-vl-sidebar=""
      className={cx('vl-sidebar', className)}
      onKeyDown={onKeyDown}
      style={{
        width,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <ul
        data-vl-sidebar-list=""
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          margin: 0,
          padding: '8px 0',
          listStyle: 'none',
          flex: 1,
          overflowY: 'auto',
        }}
      >
        {children}
      </ul>
      {footer ? (
        <div
          data-vl-sidebar-footer=""
          style={{
            padding: 12,
          }}
        >
          {footer}
        </div>
      ) : null}
    </nav>
  )
})

/* -------------------------- Group -------------------------- */

const Group = forwardRef<HTMLLIElement, SidebarGroupProps>(function Group(
  { title, defaultOpen = true, children, className, style },
  ref,
) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <li
      ref={ref}
      data-vl-sidebar-group=""
      data-state={open ? 'open' : 'closed'}
      className={cx('vl-sidebar__group', className)}
      style={{ display: 'flex', flexDirection: 'column', ...style }}
    >
      {title ? (
        <button
          type="button"
          data-vl-sidebar-group-trigger=""
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 10px 6px 10px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--fg-3)',
            textAlign: 'left',
          }}
        >
          <span aria-hidden style={{ fontSize: 9 }}>{open ? '⌄' : '›'}</span>
          <span>{title}</span>
        </button>
      ) : null}
      {open ? (
        <ul
          data-vl-sidebar-group-list=""
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            margin: 0,
            padding: 0,
            listStyle: 'none',
          }}
        >
          {children}
        </ul>
      ) : null}
    </li>
  )
})

/* -------------------------- Section -------------------------- */

const Section = forwardRef<HTMLLIElement, SidebarSectionProps>(function Section(
  { title, defaultOpen = false, badge, children, className, style },
  ref,
) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <li
      ref={ref}
      data-vl-sidebar-section=""
      data-state={open ? 'open' : 'closed'}
      className={cx('vl-sidebar__section', className)}
      style={{ display: 'flex', flexDirection: 'column', ...style }}
    >
      <button
        type="button"
        data-vl-sidebar-section-trigger=""
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 10px',
          margin: '0 6px',
          borderRadius: 7,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
          fontSize: 13,
          color: 'var(--fg-2)',
          textAlign: 'left',
          width: 'calc(100% - 12px)',
        }}
      >
        <span aria-hidden style={{ fontSize: 10, color: 'var(--fg-3)', width: 10 }}>
          {open ? '⌄' : '›'}
        </span>
        <span style={{ flex: 1 }}>{title}</span>
        {badge ? <span data-vl-sidebar-section-badge="">{badge}</span> : null}
      </button>
      {open ? (
        <ul
          data-vl-sidebar-section-list=""
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            margin: 0,
            padding: 0,
            listStyle: 'none',
          }}
        >
          {children}
        </ul>
      ) : null}
    </li>
  )
})

/* -------------------------- Item -------------------------- */

const Item = forwardRef<HTMLAnchorElement, SidebarItemProps>(function Item(
  { active, disabled, chip, icon, children, className, style, onClick, ...rest },
  ref,
) {
  return (
    <li style={{ display: 'flex' }}>
      <a
        ref={ref}
        data-vl-sidebar-item=""
        data-active={active ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        aria-current={active ? 'page' : undefined}
        aria-disabled={disabled ? true : undefined}
        tabIndex={disabled ? -1 : undefined}
        className={cx('vl-sidebar__item', className)}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault()
            return
          }
          onClick?.(e)
        }}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 10px',
          margin: '0 6px',
          borderRadius: 7,
          fontSize: 13,
          textDecoration: 'none',
          color: `var(--vl-sidebar-item-fg, ${active ? 'var(--ac-text)' : 'var(--fg-2)'})`,
          background: `var(--vl-sidebar-item-bg, ${active ? 'var(--ac-soft)' : 'transparent'})`,
          borderLeft: active ? '2px solid var(--ac)' : '2px solid transparent',
          fontWeight: active ? 500 : 400,
          ...style,
        }}
        {...rest}
      >
        {icon ? (
          <span data-vl-sidebar-item-icon="" aria-hidden style={{ display: 'inline-flex', width: 16, justifyContent: 'center' }}>
            {icon}
          </span>
        ) : null}
        <span style={{ flex: 1 }}>{children}</span>
        {chip ? (
          <span data-vl-sidebar-item-chip="" style={{ display: 'inline-flex' }}>
            {chip}
          </span>
        ) : null}
      </a>
    </li>
  )
})

/* -------------------------- Sub -------------------------- */

const Sub = forwardRef<HTMLButtonElement, SidebarSubProps>(function Sub(
  { active, className, style, children, ...rest },
  ref,
) {
  return (
    <li style={{ display: 'flex' }}>
      <button
        ref={ref}
        type="button"
        data-vl-sidebar-sub=""
        data-active={active ? '' : undefined}
        aria-current={active ? 'page' : undefined}
        className={cx('vl-sidebar__sub', className)}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '4px 10px 4px 32px',
          margin: '0 6px',
          borderRadius: 7,
          fontSize: 12,
          textAlign: 'left',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: active ? 'var(--ac-text)' : 'var(--fg-3)',
          fontFamily: 'var(--font-sans)',
          ...style,
        }}
        {...rest}
      >
        {children}
      </button>
    </li>
  )
})

/* -------------------------- Footer -------------------------- */

const Footer = forwardRef<HTMLDivElement, SidebarFooterProps>(function Footer(
  { children, className, style },
  ref,
) {
  return (
    <div
      ref={ref}
      data-vl-sidebar-footer-inner=""
      className={cx('vl-sidebar__footer', className)}
      style={{
        borderTop: '1px solid var(--line)',
        padding: 12,
        ...style,
      }}
    >
      {children}
    </div>
  )
})

export const Sidebar = Object.assign(SidebarRoot, {
  Group,
  Section,
  Item,
  Sub,
  Footer,
})
