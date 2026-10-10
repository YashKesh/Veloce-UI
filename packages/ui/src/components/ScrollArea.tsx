import { forwardRef, type ComponentProps, type CSSProperties } from 'react'
import { cx } from '../utils/cx'

export interface ScrollAreaProps extends ComponentProps<'div'> {
  /** Overall scroll direction. */
  axis?: 'vertical' | 'horizontal' | 'both'
  /** Height of the viewport. */
  maxHeight?: number | string
  /** Width of the viewport. */
  maxWidth?: number | string
}

/** A styled scroll viewport with slim scrollbars. Uses native overflow + CSS scrollbar styling. */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { axis = 'vertical', maxHeight, maxWidth, className, style, children, ...rest },
  ref,
) {
  const overflow: CSSProperties =
    axis === 'horizontal'
      ? { overflowX: 'auto', overflowY: 'hidden' }
      : axis === 'both'
        ? { overflow: 'auto' }
        : { overflowY: 'auto', overflowX: 'hidden' }

  return (
    <div
      ref={ref}
      className={cx('vl-scroll-area', className)}
      data-vl-scroll-area={axis}
      style={{
        maxHeight,
        maxWidth,
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--line-2) transparent',
        ...overflow,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
})
