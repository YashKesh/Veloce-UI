import { forwardRef, Fragment, type ComponentProps, type ReactNode } from 'react'
import { cx } from '../utils/cx'

export interface BreadcrumbItem {
  label: ReactNode
  href?: string
}

export interface BreadcrumbsProps extends ComponentProps<'nav'> {
  items: BreadcrumbItem[]
  separator?: ReactNode
}

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { items, separator = '/', className, style, ...rest },
  ref,
) {
  return (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      data-vl-breadcrumbs=""
      className={cx('vl-breadcrumbs', className)}
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 13,
        color: 'var(--fg-2)',
        ...style,
      }}
      {...rest}
    >
      <ol style={{ display: 'inline-flex', alignItems: 'center', gap: 6, margin: 0, padding: 0, listStyle: 'none' }}>
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <Fragment key={i}>
              <li style={{ display: 'inline-flex', alignItems: 'center' }}>
                {item.href && !last ? (
                  <a
                    href={item.href}
                    data-vl-breadcrumbs-link=""
                    style={{ color: 'var(--vl-breadcrumbs-fg, var(--fg-2))', textDecoration: 'none' }}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span
                    aria-current={last ? 'page' : undefined}
                    data-vl-breadcrumbs-current={last ? '' : undefined}
                    style={{ color: last ? 'var(--fg)' : 'var(--fg-2)', fontWeight: last ? 500 : 400 }}
                  >
                    {item.label}
                  </span>
                )}
              </li>
              {!last && (
                <li aria-hidden style={{ color: 'var(--fg-3)' }}>
                  {separator}
                </li>
              )}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
})
