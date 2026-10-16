import { forwardRef, type ComponentProps, type CSSProperties } from 'react'
import { cx } from '../utils/cx'

export type ColorSwatchSize = 'sm' | 'md' | 'lg'
export type ColorSwatchShape = 'square' | 'circle'

export interface ColorSwatchProps extends Omit<ComponentProps<'span'>, 'color'> {
  color: string
  size?: ColorSwatchSize
  shape?: ColorSwatchShape
  /** Show checkered background behind translucent colors */
  showAlpha?: boolean
  /** Visual indicator — rendered as a border */
  active?: boolean
}

const sizeMap: Record<ColorSwatchSize, number> = { sm: 16, md: 22, lg: 32 }

/** 8×8 checker pattern as a data-URI so no network / build hooks required. */
const CHECKER =
  'repeating-conic-gradient(var(--line) 0% 25%, var(--bg-1) 0% 50%) 0 0 / 10px 10px'

export const ColorSwatch = forwardRef<HTMLSpanElement, ColorSwatchProps>(function ColorSwatch(
  { color, size = 'md', shape = 'square', showAlpha = true, active, className, style, ...rest },
  ref,
) {
  const px = sizeMap[size]
  const radius = shape === 'circle' ? '50%' : 'var(--r-sm)'
  const wrap: CSSProperties = {
    display: 'inline-block',
    width: px,
    height: px,
    borderRadius: radius,
    position: 'relative',
    background: showAlpha ? CHECKER : undefined,
    border: active
      ? '2px solid var(--ac)'
      : '1px solid color-mix(in oklch, var(--fg) 15%, transparent)',
    boxShadow: active ? '0 0 0 2px color-mix(in oklch, var(--ac) 25%, transparent)' : undefined,
    overflow: 'hidden',
    verticalAlign: 'middle',
    cursor: rest.onClick ? 'pointer' : undefined,
  }
  const fill: CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: color,
    borderRadius: 'inherit',
  }
  return (
    <span
      ref={ref}
      data-vl-swatch=""
      data-size={size}
      data-shape={shape}
      className={cx('vl-color-swatch', className)}
      style={{ ...wrap, ...style }}
      {...rest}
    >
      <span style={fill} />
    </span>
  )
})
