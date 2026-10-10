import { forwardRef, useEffect, useRef, type ComponentProps, type CSSProperties, type ReactNode } from 'react'
import { cx } from '../utils/cx'

export type CheckboxSize = 'sm' | 'md'

export interface CheckboxProps extends Omit<ComponentProps<'input'>, 'size' | 'onChange' | 'type'> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  indeterminate?: boolean
  size?: CheckboxSize
  invalid?: boolean
  label?: ReactNode
}

const sizeMap = { sm: 14, md: 16 } as const

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { checked, defaultChecked, onCheckedChange, indeterminate, size = 'md', invalid, label, disabled, className, style, id, ...rest },
  ref,
) {
  const innerRef = useRef<HTMLInputElement | null>(null)
  const setRef = (el: HTMLInputElement | null) => {
    innerRef.current = el
    if (typeof ref === 'function') ref(el)
    else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el
  }
  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = !!indeterminate
  }, [indeterminate])

  const dim = sizeMap[size]
  // Use a darker fallback (--bg) so the unchecked box reads clearly against the
  // common --bg-1 card background. Border uses --fg at low opacity so it stays
  // visible on both bg and bg-1 surfaces without needing a custom token.
  const defaultBorder = invalid ? 'var(--err)' : 'color-mix(in oklch, var(--fg) 28%, transparent)'
  const isActive = checked || indeterminate
  const box: CSSProperties = {
    width: dim,
    height: dim,
    borderRadius: 4,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    background: isActive
      ? 'var(--vl-checkbox-bg-checked, var(--vl-checkbox-bg, var(--ac)))'
      : 'var(--vl-checkbox-bg, var(--bg))',
    border: `1.5px solid ${isActive
      ? `var(--vl-checkbox-border-checked, var(--vl-checkbox-border, var(--ac)))`
      : `var(--vl-checkbox-border, ${defaultBorder})`}`,
    boxShadow: 'var(--vl-checkbox-ring, none)',
    color: 'var(--vl-checkbox-check, var(--ac-fg))',
    fontSize: dim - 4,
    transition: 'background 150ms var(--ease-swift-out), border-color 150ms var(--ease-swift-out)',
  }
  const wrapper: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.55 : 1,
    fontFamily: 'var(--font-sans)',
    fontSize: size === 'sm' ? 13 : 14,
    color: 'var(--fg)',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    ...style,
  }
  return (
    <label
      className={cx('vl-checkbox', className)}
      data-vl-checkbox=""
      data-size={size}
      data-invalid={invalid ? '' : undefined}
      style={wrapper}
    >
      <input
        ref={setRef}
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        id={id}
        aria-invalid={invalid || undefined}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1, height: 1, margin: 0, padding: 0, border: 0, appearance: 'none', WebkitAppearance: 'none' }}
        {...rest}
      />
      <span data-vl-checkbox-box="" style={box} aria-hidden>
        {indeterminate ? (
          <span style={{ width: dim - 6, height: 2, background: 'currentColor', borderRadius: 1 }} />
        ) : checked ? (
          <svg viewBox="0 0 16 16" width={dim - 4} height={dim - 4} aria-hidden>
            <path d="M3.5 8.5l3 3 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </span>
      {label != null && <span>{label}</span>}
    </label>
  )
})
