import {
  createContext,
  forwardRef,
  useContext,
  useRef,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { cx } from '../utils/cx'

interface RadioGroupCtx {
  value?: string
  onValueChange?: (v: string) => void
  name?: string
  disabled?: boolean
}
const Ctx = createContext<RadioGroupCtx | null>(null)

export interface RadioGroupProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  value?: string
  onValueChange?: (v: string) => void
  name?: string
  disabled?: boolean
  orientation?: 'horizontal' | 'vertical'
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { value, onValueChange, name, disabled, orientation = 'vertical', className, style, children, ...rest },
  ref,
) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const setRef = (el: HTMLDivElement | null) => {
    rootRef.current = el
    if (typeof ref === 'function') ref(el)
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight']
    if (!keys.includes(e.key)) return
    e.preventDefault()
    const root = rootRef.current
    if (!root) return
    const inputs = Array.from(root.querySelectorAll<HTMLInputElement>('input[type="radio"]:not(:disabled)'))
    if (!inputs.length) return
    const focused = document.activeElement as HTMLElement
    const i = inputs.findIndex((inp) => inp === focused)
    const dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1
    const next = inputs[(i + dir + inputs.length) % inputs.length]
    next.focus()
    next.click()
  }
  return (
    <Ctx.Provider value={{ value, onValueChange, name, disabled }}>
      <div
        ref={setRef}
        role="radiogroup"
        data-vl-radio-group=""
        className={cx('vl-radio-group', className)}
        onKeyDown={onKeyDown}
        style={{
          display: 'inline-flex',
          flexDirection: orientation === 'vertical' ? 'column' : 'row',
          gap: 10,
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    </Ctx.Provider>
  )
})

export interface RadioProps extends Omit<ComponentProps<'input'>, 'type' | 'onChange' | 'value'> {
  value: string
  label?: ReactNode
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { value, label, disabled, className, style, ...rest },
  ref,
) {
  const ctx = useContext(Ctx)
  const checked = ctx?.value === value
  const isDisabled = disabled || ctx?.disabled
  const wrapper: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.55 : 1,
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    color: 'var(--fg)',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    ...style,
  }
  return (
    <label className={cx('vl-radio', className)} data-vl-radio="" data-checked={checked ? '' : undefined} style={wrapper}>
      <input
        ref={ref}
        type="radio"
        name={ctx?.name}
        value={value}
        checked={checked}
        disabled={isDisabled}
        onChange={() => ctx?.onValueChange?.(value)}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1, height: 1, margin: 0, padding: 0, border: 0, appearance: 'none', WebkitAppearance: 'none' }}
        {...rest}
      />
      <span
        data-vl-radio-box=""
        aria-hidden
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: 'var(--vl-radio-bg, var(--bg))',
          border: `1.5px solid var(--vl-radio-border, ${checked ? 'var(--ac)' : 'color-mix(in oklch, var(--fg) 28%, transparent)'})`,
          boxShadow: 'var(--vl-radio-ring, none)',
          color: 'var(--ac)',
        }}
      >
        {checked && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'currentColor' }} />}
      </span>
      {label != null && <span>{label}</span>}
    </label>
  )
})
