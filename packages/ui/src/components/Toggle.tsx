import { forwardRef, useState, type ComponentProps, type CSSProperties } from 'react'
import { cx } from '../utils/cx'
import { Slot } from './Slot'

export type ToggleSize = 'sm' | 'md' | 'lg'
export type ToggleVariant = 'default' | 'outline'

export interface ToggleProps extends Omit<ComponentProps<'button'>, 'onChange'> {
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  size?: ToggleSize
  variant?: ToggleVariant
  disabled?: boolean
  /** Render as the child element instead of a <button>. */
  asChild?: boolean
}

const sizes: Record<ToggleSize, CSSProperties> = {
  sm: { height: 28, padding: '0 10px', fontSize: 12.5, borderRadius: 6 },
  md: { height: 34, padding: '0 12px', fontSize: 13.5, borderRadius: 7 },
  lg: { height: 40, padding: '0 16px', fontSize: 14.5, borderRadius: 8 },
}

/** A two-state press button (like a bold/italic toggle). Not a Switch — Toggle is for
 *  on/off actions that don't carry data (e.g. "mute", "italic"). Use Switch for settings. */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  {
    pressed,
    defaultPressed = false,
    onPressedChange,
    size = 'md',
    variant = 'default',
    disabled,
    className,
    style,
    children,
    asChild,
    ...rest
  },
  ref,
) {
  const [internal, setInternal] = useState(defaultPressed)
  const isPressed = pressed ?? internal
  const toggle = () => {
    if (disabled) return
    const next = !isPressed
    if (pressed === undefined) setInternal(next)
    onPressedChange?.(next)
  }

  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    fontFamily: 'inherit',
    fontWeight: 500,
    letterSpacing: '-0.01em',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'background 150ms var(--ease-swift-out), color 150ms var(--ease-swift-out), border-color 150ms var(--ease-swift-out)',
    userSelect: 'none',
    ...sizes[size],
  }

  const defaultBg = isPressed
    ? variant === 'outline' ? 'var(--ac-soft)' : 'var(--bg-3)'
    : 'transparent'
  const defaultColor = isPressed ? 'var(--fg)' : 'var(--fg-2)'
  const defaultBorderColor =
    variant === 'outline'
      ? (isPressed ? 'var(--ac-line)' : 'var(--line-2)')
      : 'transparent'
  const bg = isPressed
    ? `var(--vl-toggle-bg-pressed, ${defaultBg})`
    : `var(--vl-toggle-bg, ${defaultBg})`
  const color = isPressed
    ? `var(--vl-toggle-color-pressed, ${defaultColor})`
    : `var(--vl-toggle-color, ${defaultColor})`
  const border = `1px solid ${isPressed
    ? `var(--vl-toggle-border-pressed, ${defaultBorderColor})`
    : `var(--vl-toggle-border, ${defaultBorderColor})`}`

  const commonProps = {
    'aria-pressed': isPressed,
    disabled,
    'data-vl-toggle': '',
    'data-pressed': isPressed ? '' : undefined,
    className: cx('vl-toggle', className),
    onClick: toggle,
    style: { ...base, background: bg, color, border, ...style },
    ...rest,
  }
  if (asChild) {
    return <Slot {...commonProps}>{children}</Slot>
  }
  return (
    <button ref={ref} type="button" {...commonProps}>
      {children}
    </button>
  )
})
