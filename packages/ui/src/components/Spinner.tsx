import type { ComponentProps, CSSProperties } from 'react'
import { cx } from '../utils/cx'

export interface SpinnerProps extends ComponentProps<'span'> {
  size?: number
  color?: string
}

export function Spinner({ size = 16, color, style, className, ...rest }: SpinnerProps) {
  const s: CSSProperties = {
    display: 'inline-block',
    width: size,
    height: size,
    borderRadius: '50%',
    border: '1.5px solid currentColor',
    borderRightColor: 'transparent',
    animation: 'vl-spin 0.7s linear infinite',
    color: color ?? 'var(--ac)',
    verticalAlign: 'middle',
    boxSizing: 'border-box',
  }
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cx('vl-spinner', className)}
      style={{ ...s, ...style }}
      {...rest}
    />
  )
}
