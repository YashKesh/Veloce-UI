import { forwardRef, type ComponentProps, type CSSProperties } from 'react'
import { cx } from '../utils/cx'

export interface PaginationProps extends Omit<ComponentProps<'nav'>, 'onChange'> {
  page: number
  pageCount: number
  onPageChange?: (page: number) => void
  siblingCount?: number
}

function pageItems(page: number, total: number, sib = 1): (number | 'ellipsis')[] {
  const items: (number | 'ellipsis')[] = []
  const first = 1
  const last = total
  if (total <= 7) {
    for (let i = 1; i <= total; i++) items.push(i)
    return items
  }
  const left = Math.max(page - sib, first + 1)
  const right = Math.min(page + sib, last - 1)
  items.push(first)
  if (left > first + 1) items.push('ellipsis')
  for (let i = left; i <= right; i++) items.push(i)
  if (right < last - 1) items.push('ellipsis')
  items.push(last)
  return items
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { page, pageCount, onPageChange, siblingCount = 1, className, style, ...rest },
  ref,
) {
  const btn: CSSProperties = {
    minWidth: 30,
    height: 30,
    padding: '0 8px',
    border: '1px solid var(--vl-pagination-border, var(--line))',
    borderRadius: 'var(--r-sm)',
    background: 'var(--vl-pagination-bg, var(--bg-1))',
    color: 'var(--vl-pagination-fg, var(--fg))',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    fontSize: 13,
  }
  const activeBtn: CSSProperties = {
    ...btn,
    background: 'var(--vl-pagination-bg, var(--ac))',
    color: 'var(--vl-pagination-fg, var(--ac-fg))',
    border: '1px solid var(--vl-pagination-border, var(--ac))',
  }
  const items = pageItems(page, pageCount, siblingCount)
  const go = (p: number) => {
    if (p < 1 || p > pageCount || p === page) return
    onPageChange?.(p)
  }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(page - 1) }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(page + 1) }
  }
  return (
    <nav
      ref={ref}
      aria-label="Pagination"
      data-vl-pagination=""
      className={cx('vl-pagination', className)}
      onKeyDown={onKey}
      style={{ display: 'inline-flex', gap: 4, alignItems: 'center', ...style }}
      {...rest}
    >
      <button
        type="button"
        aria-label="Previous page"
        data-vl-pagination-prev=""
        style={{ ...btn, opacity: page <= 1 ? 0.5 : 1, cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
        disabled={page <= 1}
        onClick={() => go(page - 1)}
      >
        ‹
      </button>
      {items.map((it, i) =>
        it === 'ellipsis' ? (
          <span key={`e${i}`} aria-hidden style={{ padding: '0 4px', color: 'var(--fg-3)' }}>…</span>
        ) : (
          <button
            key={it}
            type="button"
            data-vl-pagination-page=""
            aria-current={it === page ? 'page' : undefined}
            style={it === page ? activeBtn : btn}
            onClick={() => go(it)}
          >
            {it}
          </button>
        ),
      )}
      <button
        type="button"
        aria-label="Next page"
        data-vl-pagination-next=""
        style={{ ...btn, opacity: page >= pageCount ? 0.5 : 1, cursor: page >= pageCount ? 'not-allowed' : 'pointer' }}
        disabled={page >= pageCount}
        onClick={() => go(page + 1)}
      >
        ›
      </button>
    </nav>
  )
})
