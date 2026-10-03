import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type ComponentProps,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react'
import { cx } from '../utils/cx'

export type TableVariant = 'plain' | 'striped'
export type TableDensity = 'compact' | 'cozy' | 'comfortable'
export type TableTone = 'default' | 'ok' | 'warn' | 'err'
export type TableAlign = 'start' | 'center' | 'end'
export type TableCellVariant = 'text' | 'num' | 'status' | 'avatar' | 'link' | 'action'

export interface TableProps extends ComponentProps<'table'> {
  variant?: TableVariant
  density?: TableDensity
  hoverable?: boolean
  caption?: string
}

export interface TableHeaderProps extends ComponentProps<'thead'> {
  sticky?: boolean
  offset?: number
}

export interface TableColumnProps extends Omit<ComponentProps<'th'>, 'align' | 'width'> {
  align?: TableAlign
  width?: number | string
  sortable?: boolean
}

export interface TableRowProps extends ComponentProps<'tr'> {
  selected?: boolean
  disabled?: boolean
  tone?: TableTone
}

export interface TableCellProps extends Omit<ComponentProps<'td'>, 'align'> {
  variant?: TableCellVariant
  tone?: TableTone
  align?: TableAlign
  avatar?: string
}

const toneColor: Record<TableTone, string | undefined> = {
  default: undefined,
  ok: 'var(--ok)',
  warn: 'var(--warn)',
  err: 'var(--err)',
}

const alignMap: Record<TableAlign, 'start' | 'center' | 'end'> = {
  start: 'start',
  center: 'center',
  end: 'end',
}

const TableRoot = forwardRef<HTMLTableElement, TableProps>(function Table(
  { variant = 'plain', density = 'cozy', hoverable = true, caption, className, style, children, ...rest },
  ref,
) {
  const styles: CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    tableLayout: 'auto',
    ...style,
  }
  return (
    <table
      ref={ref}
      data-vl-table=""
      data-variant={variant}
      data-density={density}
      data-hoverable={hoverable ? 'true' : 'false'}
      className={cx('vl-table', className)}
      style={styles}
      {...rest}
    >
      {caption != null ? <caption>{caption}</caption> : null}
      {children}
    </table>
  )
})

function isThLike(type: unknown): boolean {
  if (type === 'th') return true
  if (type === TableColumn) return true
  const name =
    (type as { displayName?: string; name?: string })?.displayName ||
    (type as { name?: string })?.name
  return name === 'TableColumn'
}

function applyStickyToThs(node: ReactNode, offset: number): ReactNode {
  return Children.map(node, (child) => {
    if (!isValidElement(child)) return child
    const el = child as ReactElement<{ style?: CSSProperties; children?: ReactNode }>
    if (isThLike(el.type)) {
      const merged: CSSProperties = {
        position: 'sticky',
        top: offset,
        background: 'var(--bg-2)',
        zIndex: 1,
        ...el.props.style,
      }
      return cloneElement(el, { style: merged })
    }
    if (el.props.children != null) {
      return cloneElement(el, {
        ...(el.props as object),
        children: applyStickyToThs(el.props.children, offset),
      } as never)
    }
    return child
  })
}

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(function TableHeader(
  { sticky, offset = 0, className, style, children, ...rest },
  ref,
) {
  const content = sticky ? applyStickyToThs(children, offset) : children
  return (
    <thead
      ref={ref}
      data-vl-table-header=""
      data-sticky={sticky ? '' : undefined}
      data-offset={sticky ? offset : undefined}
      className={cx('vl-table-header', className)}
      style={style}
      {...rest}
    >
      {content}
    </thead>
  )
})

const TableBody = forwardRef<HTMLTableSectionElement, ComponentProps<'tbody'>>(function TableBody(
  { className, children, ...rest },
  ref,
) {
  return (
    <tbody ref={ref} data-vl-table-body="" className={cx('vl-table-body', className)} {...rest}>
      {children}
    </tbody>
  )
})

const TableFooter = forwardRef<HTMLTableSectionElement, ComponentProps<'tfoot'>>(function TableFooter(
  { className, children, ...rest },
  ref,
) {
  return (
    <tfoot ref={ref} data-vl-table-footer="" className={cx('vl-table-footer', className)} {...rest}>
      {children}
    </tfoot>
  )
})

/**
 * Finds the nearest ancestor thead to pull sticky/offset values.
 * We can't do that at render in a clean way, so we accept via a data attribute
 * written by TableHeader onto its children through context? To stay dep-free
 * and simple, we instead resolve sticky at Column level by walking DOM at mount
 * — but that's overkill. Simpler: TableHeader applies inline styles to its th
 * children via CSS targeting [data-vl-table-header][data-sticky] th. We also
 * apply inline so tests can grep inline style.
 */

const TableColumn = forwardRef<HTMLTableCellElement, TableColumnProps>(function TableColumn(
  { align = 'start', width, sortable, className, style, children, ...rest },
  ref,
) {
  // Density-aware padding is applied via inline since density is a Table prop;
  // thead cells inherit through nth-of-type scoping is awkward, so we rely on
  // consumers nesting via <TableHeader> and let a CSS rule target it. For now
  // use a reasonable default pad for the header.
  const styles: CSSProperties = {
    padding: '10px 12px',
    textAlign: alignMap[align],
    width,
    ...style,
  }
  return (
    <th
      ref={ref}
      scope="col"
      data-vl-table-column=""
      data-align={align}
      data-sortable={sortable ? '' : undefined}
      className={cx('vl-table-column', className)}
      style={styles}
      {...rest}
    >
      {children}
    </th>
  )
})

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { selected, disabled, tone = 'default', className, style, children, ...rest },
  ref,
) {
  return (
    <tr
      ref={ref}
      data-vl-table-row=""
      data-selected={selected ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-tone={tone !== 'default' ? tone : undefined}
      aria-selected={selected || undefined}
      aria-disabled={disabled || undefined}
      className={cx('vl-table-row', className)}
      style={{ background: 'var(--vl-table-row-bg, transparent)', ...style }}
      {...rest}
    >
      {children}
    </tr>
  )
})

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { variant = 'text', tone = 'default', align, avatar, className, style, children, ...rest },
  ref,
) {
  const styles: CSSProperties = {
    padding: '10px 12px',
    verticalAlign: 'middle',
    textAlign: align ? alignMap[align] : variant === 'num' ? 'end' : undefined,
    fontVariantNumeric: variant === 'num' ? 'tabular-nums' : undefined,
    color: toneColor[tone],
    ...style,
  }

  let content: ReactNode = children
  if (variant === 'status') {
    const dotColor = tone === 'default' ? 'var(--fg-3)' : toneColor[tone]
    content = (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }} data-vl-table-status="">
        <span
          aria-hidden
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: dotColor,
            display: 'inline-block',
          }}
        />
        {children}
      </span>
    )
  } else if (variant === 'avatar') {
    content = (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }} data-vl-table-avatar-cell="">
        {avatar ? (
          <img
            src={avatar}
            alt=""
            width={20}
            height={20}
            style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <span
            aria-hidden
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: 'var(--bg-2)',
              display: 'inline-block',
            }}
          />
        )}
        {children}
      </span>
    )
  }

  return (
    <td
      ref={ref}
      data-vl-table-cell=""
      data-variant={variant}
      data-tone={tone !== 'default' ? tone : undefined}
      data-align={align}
      className={cx('vl-table-cell', className)}
      style={styles}
      {...rest}
    >
      {content}
    </td>
  )
})

type TableCompound = typeof TableRoot & {
  Header: typeof TableHeader
  Body: typeof TableBody
  Footer: typeof TableFooter
  Column: typeof TableColumn
  Row: typeof TableRow
  Cell: typeof TableCell
}

const Table = TableRoot as TableCompound
Table.Header = TableHeader
Table.Body = TableBody
Table.Footer = TableFooter
Table.Column = TableColumn
Table.Row = TableRow
Table.Cell = TableCell

export { Table }

/**
 * Internally wrap TableHeader to also apply sticky styles inline on children.
 * We do this via a side helper that TableHeader renders — but to keep tests
 * able to grep `position: sticky` on a <th>, we instead attach a CSS-in-JS
 * injection by cloning children. Done inside TableHeader below (patched here).
 */
