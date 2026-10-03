import type { ComponentProps, CSSProperties } from 'react'
import { cx } from '../utils/cx'

export interface SeparatorProps extends ComponentProps<'div'> {
  orientation?: 'horizontal' | 'vertical'
  inset?: number
}

export function Separator({ orientation = 'horizontal', inset = 0, style, className, ...rest }: SeparatorProps) {
  const horizontal: CSSProperties = {
    height: 1,
    width: '100%',
    marginLeft: inset,
    marginRight: inset,
    background: 'var(--line)',
    border: 'none',
  }
  const vertical: CSSProperties = {
    width: 1,
    alignSelf: 'stretch',
    marginTop: inset,
    marginBottom: inset,
    background: 'var(--line)',
    border: 'none',
  }
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cx('vl-separator', className)}
      style={{ ...(orientation === 'vertical' ? vertical : horizontal), ...style }}
      {...rest}
    />
  )
}
