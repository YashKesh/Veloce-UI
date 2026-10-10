import { forwardRef, type ComponentProps, type CSSProperties } from 'react'
import { cx } from '../utils/cx'

export type SwitchSize = 'sm' | 'md'

export interface SwitchProps extends Omit<ComponentProps<'button'>, 'onChange'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  size?: SwitchSize
  disabled?: boolean
}

const sizes = {
  sm: { w: 28, h: 16, thumb: 12 },
  md: { w: 36, h: 20, thumb: 16 },
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { checked = false, onCheckedChange, size = 'md', disabled, className, style, ...rest },
  ref,
) {
  const s = sizes[size]
  const onKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      if (!disabled) onCheckedChange?.(!checked)
    } else if (e.key === 'ArrowRight') {
      if (!disabled) onCheckedChange?.(true)
    } else if (e.key === 'ArrowLeft') {
      if (!disabled) onCheckedChange?.(false)
    }
  }
  const track: CSSProperties = {
    position: 'relative',
    width: s.w,
    height: s.h,
    borderRadius: s.h,
    padding: 0,
    background: checked
      ? 'var(--vl-switch-track-on, var(--vl-switch-bg, var(--ac)))'
      : 'var(--vl-switch-track-off, var(--vl-switch-bg, var(--bg-2)))',
    border: `1px solid ${checked
      ? 'var(--vl-switch-border-on, var(--vl-switch-border, var(--ac)))'
      : 'var(--vl-switch-border-off, var(--vl-switch-border, var(--line-2)))'}`,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.55 : 1,
    display: 'inline-block',
    verticalAlign: 'middle',
    ...style,
  }
  const thumbLeft = checked ? s.w - s.thumb - 2 : 2
  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      data-vl-switch=""
      data-size={size}
      data-checked={checked ? '' : undefined}
      className={cx('vl-switch', className)}
      onClick={() => !disabled && onCheckedChange?.(!checked)}
      onKeyDown={onKey}
      style={track}
      {...rest}
    >
      <span
        data-vl-switch-thumb=""
        aria-hidden
        style={{
          position: 'absolute',
          top: (s.h - s.thumb) / 2,
          left: thumbLeft,
          width: s.thumb,
          height: s.thumb,
          borderRadius: '50%',
          background: 'var(--vl-switch-thumb, #fff)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
        }}
      />
    </button>
  )
})
