import type { ComponentProps, CSSProperties } from 'react'
import { cx } from '../utils/cx'

export type SkeletonVariant = 'text' | 'block' | 'circle'

export interface SkeletonProps extends ComponentProps<'span'> {
  width?: number | string
  height?: number | string
  radius?: number
  variant?: SkeletonVariant
}

export function Skeleton({
  width,
  height,
  radius = 6,
  variant = 'block',
  style,
  className,
  ...rest
}: SkeletonProps) {
  let w: number | string | undefined = width
  let h: number | string | undefined = height
  let r: number | string = radius

  if (variant === 'text') {
    h = h ?? '0.9em'
    w = w ?? '100%'
    r = 4
  } else if (variant === 'circle') {
    const d = w ?? h ?? 32
    w = d
    h = d
    r = '50%'
  } else {
    w = w ?? '100%'
    h = h ?? 16
  }

  const s: CSSProperties = {
    display: 'inline-block',
    width: w,
    height: h,
    borderRadius: r,
    background: 'linear-gradient(90deg, var(--bg-3) 25%, var(--line-2) 50%, var(--bg-3) 75%) 0 0 / 200% 100%',
    animation: 'vl-shimmer 1.6s linear infinite',
    verticalAlign: 'middle',
  }
  return (
    <span
      aria-hidden="true"
      aria-busy="true"
      className={cx('vl-skeleton', className)}
      style={{ ...s, ...style }}
      {...rest}
    />
  )
}
