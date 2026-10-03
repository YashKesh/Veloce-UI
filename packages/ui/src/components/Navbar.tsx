import {
  forwardRef,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { cx } from '../utils/cx'

export interface NavbarProps {
  height?: 48 | 56 | 64
  sticky?: boolean
  variant?: 'app' | 'marketing' | 'transparent'
  announcement?: ReactNode
  blur?: boolean
  border?: boolean
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export interface NavbarBrandProps {
  href?: string
  logo?: ReactNode
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

export interface NavbarNavProps {
  align?: 'start' | 'center'
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

export interface NavbarLinkProps extends ComponentProps<'a'> {
  active?: boolean
  disabled?: boolean
  chip?: ReactNode
}

export interface NavbarActionsProps {
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

const NavbarRoot = forwardRef<HTMLElement, NavbarProps>(function NavbarRoot(
  {
    height = 56,
    sticky = true,
    variant = 'app',
    announcement,
    blur = false,
    border = true,
    className,
    style,
    children,
  },
  ref,
) {
  const headerStyle: CSSProperties = {
    ...(sticky
      ? { position: 'sticky', top: 0, zIndex: 50 }
      : {}),
    ...style,
  }
  const barStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    height,
    padding: '0 16px',
    width: '100%',
    boxSizing: 'border-box',
    ...(blur
      ? {
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }
      : {}),
  }

  return (
    <header
      ref={ref}
      data-vl-navbar=""
      data-variant={variant}
      data-height={height}
      data-sticky={sticky ? '' : undefined}
      data-blur={blur ? '' : undefined}
      data-border={border ? '' : undefined}
      className={cx('vl-navbar', className)}
      style={headerStyle}
    >
      {announcement ? (
        <div
          role="status"
          data-vl-navbar-announcement=""
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            minHeight: 32,
            padding: '0 16px',
            fontSize: 12.5,
          }}
        >
          {announcement}
        </div>
      ) : null}
      <nav
        aria-label="Main"
        data-vl-navbar-bar=""
        style={barStyle}
      >
        {children}
      </nav>
    </header>
  )
})

const Brand = forwardRef<HTMLElement, NavbarBrandProps>(function Brand(
  { href, logo, children, className, style },
  ref,
) {
  const inner = (
    <>
      {logo ? (
        <span data-vl-navbar-brand-logo="" style={{ display: 'inline-flex', alignItems: 'center' }}>
          {logo}
        </span>
      ) : null}
      {children ? (
        <span data-vl-navbar-brand-name="" style={{ fontWeight: 600, fontSize: 14 }}>
          {children}
        </span>
      ) : null}
    </>
  )
  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    textDecoration: 'none',
    color: 'var(--fg)',
    ...style,
  }
  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        data-vl-navbar-brand=""
        className={cx('vl-navbar__brand', className)}
        style={base}
      >
        {inner}
      </a>
    )
  }
  return (
    <span
      ref={ref as React.Ref<HTMLSpanElement>}
      data-vl-navbar-brand=""
      className={cx('vl-navbar__brand', className)}
      style={base}
    >
      {inner}
    </span>
  )
})

const Nav = forwardRef<HTMLUListElement, NavbarNavProps>(function Nav(
  { align = 'start', children, className, style },
  ref,
) {
  return (
    <ul
      ref={ref}
      data-vl-navbar-nav=""
      data-align={align}
      className={cx('vl-navbar__nav', className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        margin: 0,
        padding: 0,
        listStyle: 'none',
        ...(align === 'center' ? { justifyContent: 'center', flex: 1 } : { marginLeft: 10 }),
        ...style,
      }}
    >
      {children}
    </ul>
  )
})

const Link = forwardRef<HTMLAnchorElement, NavbarLinkProps>(function Link(
  { active, disabled, chip, children, className, style, onClick, ...rest },
  ref,
) {
  return (
    <li style={{ display: 'inline-flex' }}>
      <a
        ref={ref}
        data-vl-navbar-link=""
        data-active={active ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        aria-current={active ? 'page' : undefined}
        aria-disabled={disabled ? true : undefined}
        tabIndex={disabled ? -1 : undefined}
        className={cx('vl-navbar__link', className)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          borderRadius: 7,
          fontSize: 13,
          textDecoration: 'none',
          background: `var(--vl-navbar-link-bg, ${active ? 'var(--ac-soft)' : 'transparent'})`,
          color: `var(--vl-navbar-link-fg, ${active ? 'var(--ac-text)' : 'var(--fg-2)'})`,
          border: `1px solid ${active ? 'color-mix(in oklch, var(--ac) 35%, transparent)' : 'transparent'}`,
          ...style,
        }}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault()
            return
          }
          onClick?.(e)
        }}
        {...rest}
      >
        <span>{children}</span>
        {chip ? (
          <span data-vl-navbar-link-chip="" style={{ display: 'inline-flex' }}>
            {chip}
          </span>
        ) : null}
      </a>
    </li>
  )
})

const Actions = forwardRef<HTMLDivElement, NavbarActionsProps>(function Actions(
  { children, className, style },
  ref,
) {
  return (
    <div
      ref={ref}
      data-vl-navbar-actions=""
      className={cx('vl-navbar__actions', className)}
      style={{
        marginLeft: 'auto',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        ...style,
      }}
    >
      {children}
    </div>
  )
})

export const Navbar = Object.assign(NavbarRoot, {
  Brand,
  Nav,
  Link,
  Actions,
})
