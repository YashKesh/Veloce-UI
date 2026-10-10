import { type ComponentProps, type ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface BentoCellProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Column span on desktop (out of 6). */
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6
  /** Row span. */
  rowSpan?: 1 | 2 | 3
  title?: ReactNode
  description?: ReactNode
  /** Visual element (chart, image, mock) rendered above the title. */
  media?: ReactNode
  /** Highlight with the accent border. */
  featured?: boolean
}

/** Container for Bento tiles. Uses a 6-column grid; cells set colSpan to compose asymmetric layouts. */
export function BentoGrid({ className, style, children, ...rest }: ComponentProps<'div'>) {
  return (
    <div
      data-vl-bento-grid=""
      className={cx('vl-bento-grid', className)}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
        gridAutoRows: 'minmax(200px, auto)',
        gap: 12,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

export function BentoCell({ colSpan = 2, rowSpan = 1, title, description, media, featured, className, style, children, ...rest }: BentoCellProps) {
  return (
    <div
      data-vl-bento-cell=""
      data-featured={featured ? '' : undefined}
      className={cx('vl-bento-cell', className)}
      style={{
        position: 'relative',
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 20,
        borderRadius: 14,
        border: featured ? '1px solid var(--ac-line)' : '1px solid var(--line)',
        background: featured
          ? 'linear-gradient(135deg, color-mix(in oklch, var(--ac) 10%, var(--bg-1)), var(--bg-1))'
          : 'var(--bg-1)',
        overflow: 'hidden',
        transition: 'background 150ms, border-color 150ms',
        ...style,
      }}
      {...rest}
    >
      {media && <div style={{ marginBottom: 'auto' }}>{media}</div>}
      {title && (
        <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.015em', color: 'var(--fg)' }}>
          {title}
        </div>
      )}
      {description && (
        <div style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--fg-2)' }}>{description}</div>
      )}
      {children}
    </div>
  )
}

BentoGrid.Cell = BentoCell
