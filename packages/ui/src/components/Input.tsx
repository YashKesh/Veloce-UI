import { forwardRef, type ComponentProps, type CSSProperties, type ReactNode } from 'react'
import { cx } from '../utils/cx'

export type InputVariant = 'default' | 'ghost'
export type InputSize = 'sm' | 'md'

export interface InputProps extends Omit<ComponentProps<'input'>, 'size' | 'prefix'> {
  variant?: InputVariant
  size?: InputSize
  invalid?: boolean
  prefix?: ReactNode
  suffix?: ReactNode
}

const sizeMap: Record<InputSize, { h: number; fs: number; pad: number }> = {
  sm: { h: 30, fs: 13, pad: 10 },
  md: { h: 36, fs: 14, pad: 12 },
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { variant = 'default', size = 'md', invalid, prefix, suffix, style, className, ...rest },
  ref,
) {
  const s = sizeMap[size]
  const defaultBg = variant === 'ghost' ? 'transparent' : 'var(--bg-2)'
  const defaultBorder = invalid ? 'var(--err)' : variant === 'ghost' ? 'transparent' : 'var(--line-2)'
  const wrap: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    height: s.h,
    padding: `0 ${s.pad}px`,
    borderRadius: 'var(--r-md)',
    background: `var(--vl-input-bg, ${defaultBg})`,
    border: `1px solid var(--vl-input-border, ${defaultBorder})`,
    boxShadow: 'var(--vl-input-ring, none)',
    color: 'var(--vl-input-color, var(--fg))',
    fontFamily: 'var(--font-sans)',
    fontSize: s.fs,
    transition: 'border-color 150ms var(--ease-swift-out)',
  }
  const input: CSSProperties = {
    flex: 1,
    minWidth: 0,
    height: '100%',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'inherit',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    padding: 0,
  }
  return (
    <span
      data-vl-input=""
      data-variant={variant}
      data-size={size}
      data-invalid={invalid ? '' : undefined}
      className={cx('vl-input', className)}
      style={{ ...wrap, ...style }}
    >
      {prefix && <span style={{ color: 'var(--fg-3)', display: 'inline-flex' }}>{prefix}</span>}
      <input ref={ref} style={input} aria-invalid={invalid || undefined} {...rest} />
      {suffix && <span style={{ color: 'var(--fg-3)', display: 'inline-flex' }}>{suffix}</span>}
    </span>
  )
})
