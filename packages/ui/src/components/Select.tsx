import { forwardRef, type ComponentProps, type CSSProperties } from 'react'
import { cx } from '../utils/cx'

export type SelectSize = 'sm' | 'md'

export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

export interface SelectProps extends Omit<ComponentProps<'select'>, 'size' | 'onChange'> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  options: SelectOption[]
  size?: SelectSize
  invalid?: boolean
  placeholder?: string
}

const sizeMap = { sm: { h: 30, fs: 13, pad: 10 }, md: { h: 36, fs: 14, pad: 12 } }

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { value, defaultValue, onValueChange, options, size = 'md', invalid, placeholder, className, style, disabled, ...rest },
  ref,
) {
  const s = sizeMap[size]
  const wrap: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    position: 'relative',
    height: s.h,
    borderRadius: 'var(--r-md)',
    background: 'var(--vl-select-bg, var(--bg-2))',
    border: `1px solid var(--vl-select-border, ${invalid ? 'var(--err)' : 'var(--line-2)'})`,
    boxShadow: 'var(--vl-select-ring, none)',
    color: 'var(--vl-select-color, var(--fg))',
    fontFamily: 'var(--font-sans)',
    fontSize: s.fs,
    opacity: disabled ? 0.55 : 1,
    ...style,
  }
  const sel: CSSProperties = {
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'inherit',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    height: '100%',
    padding: `0 ${s.pad + 20}px 0 ${s.pad}px`,
    cursor: disabled ? 'not-allowed' : 'pointer',
  }
  return (
    <span
      data-vl-select=""
      data-size={size}
      data-invalid={invalid ? '' : undefined}
      className={cx('vl-select', className)}
      style={wrap}
    >
      <select
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        onChange={(e) => onValueChange?.(e.target.value)}
        style={sel}
        {...rest}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>
      <span
        aria-hidden
        style={{
          position: 'absolute',
          right: s.pad,
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          fontSize: 10,
          color: 'var(--fg-3)',
        }}
      >
        ▾
      </span>
    </span>
  )
})
