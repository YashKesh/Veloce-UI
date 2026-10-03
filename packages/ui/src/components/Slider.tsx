import { forwardRef, type ComponentProps, type CSSProperties } from 'react'
import { cx } from '../utils/cx'

export interface SliderProps extends Omit<ComponentProps<'input'>, 'type' | 'value' | 'defaultValue' | 'onChange'> {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { value, defaultValue, onValueChange, min = 0, max = 100, step = 1, className, style, disabled, ...rest },
  ref,
) {
  const current = value ?? defaultValue ?? min
  const pct = ((current - min) / (max - min)) * 100
  const inputStyle: CSSProperties = {
    appearance: 'none',
    WebkitAppearance: 'none',
    width: '100%',
    height: 20,
    background: 'transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.55 : 1,
    outline: 'none',
    ...style,
  }
  return (
    <input
      ref={ref}
      type="range"
      data-vl-slider=""
      className={cx('vl-slider', className)}
      min={min}
      max={max}
      step={step}
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
      onChange={(e) => onValueChange?.(Number(e.target.value))}
      style={{ ...inputStyle, ['--vl-slider-pct' as string]: `${pct}%` }}
      {...rest}
    />
  )
})
