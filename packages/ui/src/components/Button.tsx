import { forwardRef, type ComponentProps, type ReactNode, type CSSProperties } from 'react'
import { cx } from '../utils/cx'

export type ButtonVariant = 'primary' | 'ghost' | 'outline' | 'destructive'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const sizeStyles: Record<ButtonSize, CSSProperties> = {
  sm: { height: 30, padding: '0 12px', fontSize: 13, borderRadius: 'var(--r-md)' },
  md: { height: 36, padding: '0 16px', fontSize: 14, borderRadius: 'var(--r-md)' },
  lg: { height: 44, padding: '0 20px', fontSize: 15, borderRadius: 'var(--r-lg)' },
}

// Colors use CSS-variable indirection so inline styles still read live from the
// layered CSS on hover/active/focus. The fallback inside var() is the DEFAULT
// variant color — this makes the component resilient to aggressive consumer
// resets like `button { background: none }` because inline styles always beat
// un-layered CSS. The layered CSS only updates `--vl-btn-*` on state changes.
const variantAttrs: Record<ButtonVariant, { bg: string; fg: string; border: string }> = {
  primary: {
    bg: 'var(--vl-btn-bg, var(--ac))',
    fg: 'var(--vl-btn-fg, var(--ac-fg))',
    border: 'var(--vl-btn-border, transparent)',
  },
  ghost: {
    bg: 'var(--vl-btn-bg, transparent)',
    fg: 'var(--vl-btn-fg, var(--fg))',
    border: 'var(--vl-btn-border, transparent)',
  },
  outline: {
    bg: 'var(--vl-btn-bg, transparent)',
    fg: 'var(--vl-btn-fg, var(--fg))',
    border: 'var(--vl-btn-border, var(--line-2))',
  },
  destructive: {
    bg: 'var(--vl-btn-bg, var(--err))',
    fg: 'var(--vl-btn-fg, oklch(0.98 0.01 25))',
    border: 'var(--vl-btn-border, transparent)',
  },
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, style, disabled, className, ...rest },
  ref,
) {
  const v = variantAttrs[variant]
  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontFamily: 'var(--font-sans)',
    fontWeight: 500,
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.55 : isLoading ? 0.85 : 1,
    whiteSpace: 'nowrap',
    userSelect: 'none',
    outline: 'none',
    background: v.bg,
    color: v.fg,
    border: `1px solid ${v.border}`,
    ...sizeStyles[size],
    ...style,
  }
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      data-vl-btn=""
      data-variant={variant}
      data-size={size}
      className={cx('vl-btn', className)}
      style={base}
      {...rest}
    >
      {isLoading ? (
        <span
          aria-hidden
          style={{
            width: 13,
            height: 13,
            borderRadius: '50%',
            border: '1.5px solid currentColor',
            borderRightColor: 'transparent',
            animation: 'vl-spin 0.7s linear infinite',
          }}
        />
      ) : leftIcon}
      {children}
      {rightIcon}
    </button>
  )
})
