import { forwardRef, type ComponentProps, type CSSProperties, type ReactNode } from 'react'
import { cx } from '../utils/cx'

export interface ContainerProps extends ComponentProps<'div'> {
  /** Max content width in px, or any CSS length string. Default 1120. */
  maxWidth?: number | string
  /** Horizontal padding. Default 24 px. */
  padX?: number | string
}

/** Centres content and caps line length. Zero-runtime: compiles to a padded, max-width flex column. */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { maxWidth = 1120, padX = 24, className, style, children, ...rest },
  ref,
) {
  const mw = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth
  const px = typeof padX === 'number' ? `${padX}px` : padX
  const base: CSSProperties = {
    width: '100%',
    maxWidth: mw,
    marginInline: 'auto',
    paddingInline: px,
    boxSizing: 'border-box',
    ...style,
  }
  return (
    <div ref={ref} className={cx('vl-container', className)} data-vl-container="" style={base} {...rest}>
      {children}
    </div>
  )
})

export interface GridProps extends ComponentProps<'div'> {
  /** Equal-width column count, or a custom template string. Default 2. */
  cols?: number | string
  /** Gap between items (both axes). Default 16. */
  gap?: number | string
  /** Row gap override. */
  rowGap?: number | string
  /** Column gap override. */
  colGap?: number | string
  /** Min child width for auto-fit mode. When set, cols is ignored. */
  minItemWidth?: number | string
}

/** Equal-width columns with a fixed gutter. Set minItemWidth for responsive auto-fit. */
export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { cols = 2, gap = 16, rowGap, colGap, minItemWidth, className, style, children, ...rest },
  ref,
) {
  const g = typeof gap === 'number' ? `${gap}px` : gap
  const template = minItemWidth != null
    ? `repeat(auto-fit, minmax(${typeof minItemWidth === 'number' ? `${minItemWidth}px` : minItemWidth}, 1fr))`
    : typeof cols === 'number'
      ? `repeat(${cols}, minmax(0, 1fr))`
      : cols
  const base: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: template,
    gap: g,
    ...(rowGap != null ? { rowGap: typeof rowGap === 'number' ? `${rowGap}px` : rowGap } : null),
    ...(colGap != null ? { columnGap: typeof colGap === 'number' ? `${colGap}px` : colGap } : null),
    ...style,
  }
  return (
    <div ref={ref} className={cx('vl-grid', className)} data-vl-grid="" style={base} {...rest}>
      {children}
    </div>
  )
})

export type StackDirection = 'column' | 'row'
export type StackAlign = 'start' | 'center' | 'end' | 'stretch'
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'

export interface StackProps extends ComponentProps<'div'> {
  direction?: StackDirection
  gap?: number | string
  align?: StackAlign
  justify?: StackJustify
  wrap?: boolean
}

const alignMap: Record<StackAlign, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
}
const justifyMap: Record<StackJustify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
}

/** Vertical rhythm without margin hacks. Compiles to display:flex with a gap. */
export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  { direction = 'column', gap = 12, align, justify, wrap, className, style, children, ...rest },
  ref,
) {
  const g = typeof gap === 'number' ? `${gap}px` : gap
  const base: CSSProperties = {
    display: 'flex',
    flexDirection: direction,
    gap: g,
    ...(align ? { alignItems: alignMap[align] } : null),
    ...(justify ? { justifyContent: justifyMap[justify] } : null),
    ...(wrap ? { flexWrap: 'wrap' } : null),
    ...style,
  }
  return (
    <div ref={ref} className={cx('vl-stack', className)} data-vl-stack="" data-direction={direction} style={base} {...rest}>
      {children}
    </div>
  )
})

export interface AspectRatioProps extends ComponentProps<'div'> {
  /** CSS aspect-ratio value. Accepts "16/9", "1 / 1", a number (w/h), or "4 / 3". Default "16 / 9". */
  ratio?: number | string
  children?: ReactNode
}

/** Locks children to a given aspect ratio — media, embeds, maps. */
export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(function AspectRatio(
  { ratio = '16 / 9', className, style, children, ...rest },
  ref,
) {
  const value = typeof ratio === 'number' ? String(ratio) : ratio
  const base: CSSProperties = {
    position: 'relative',
    width: '100%',
    aspectRatio: value,
    ...style,
  }
  return (
    <div ref={ref} className={cx('vl-aspect', className)} data-vl-aspect="" style={base} {...rest}>
      {children}
    </div>
  )
})
