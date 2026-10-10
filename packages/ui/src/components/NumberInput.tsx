import { forwardRef, useRef, useState, type ComponentProps, type CSSProperties } from 'react'
import { cx } from '../utils/cx'

export type NumberInputSize = 'sm' | 'md'

export interface NumberInputProps extends Omit<ComponentProps<'input'>, 'size' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'prefix'> {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  precision?: number
  size?: NumberInputSize
  invalid?: boolean
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

const sizeMap: Record<NumberInputSize, { h: number; fs: number }> = {
  sm: { h: 30, fs: 13 },
  md: { h: 36, fs: 14 },
}

function clamp(n: number, min?: number, max?: number): number {
  if (min != null && n < min) return min
  if (max != null && n > max) return max
  return n
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  {
    value,
    defaultValue,
    onValueChange,
    min,
    max,
    step = 1,
    precision,
    size = 'md',
    invalid,
    prefix,
    suffix,
    className,
    style,
    disabled,
    ...rest
  },
  ref,
) {
  const [internal, setInternal] = useState<number>(defaultValue ?? 0)
  const current = value ?? internal
  const inputRef = useRef<HTMLInputElement | null>(null)
  const s = sizeMap[size]

  const commit = (next: number) => {
    const clamped = clamp(next, min, max)
    const rounded = precision != null ? Number(clamped.toFixed(precision)) : clamped
    if (value === undefined) setInternal(rounded)
    onValueChange?.(rounded)
  }

  const bump = (dir: 1 | -1) => commit(current + step * dir)

  const btnStyle: CSSProperties = {
    width: 22,
    height: s.h - 2,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    color: 'var(--fg-2)',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: 10,
    padding: 0,
  }

  return (
    <div
      className={cx('vl-number-input', className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0,
        height: s.h,
        padding: '0 0 0 10px',
        border: `1px solid ${invalid ? 'var(--err)' : 'var(--line-2)'}`,
        borderRadius: 8,
        background: 'var(--bg)',
        fontSize: s.fs,
        color: 'var(--fg)',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {prefix && <span style={{ marginRight: 6, color: 'var(--fg-3)' }}>{prefix}</span>}
      <input
        ref={(node) => {
          inputRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
        }}
        type="number"
        value={Number.isFinite(current) ? current : ''}
        onChange={(e) => {
          const n = e.target.value === '' ? 0 : Number(e.target.value)
          if (Number.isFinite(n)) commit(n)
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp') { e.preventDefault(); bump(1) }
          else if (e.key === 'ArrowDown') { e.preventDefault(); bump(-1) }
        }}
        disabled={disabled}
        style={{
          flex: 1,
          minWidth: 0,
          height: '100%',
          padding: 0,
          background: 'transparent',
          color: 'inherit',
          fontSize: 'inherit',
          fontFamily: 'inherit',
          border: 'none',
          outline: 'none',
          MozAppearance: 'textfield',
        }}
        {...rest}
      />
      {suffix && <span style={{ margin: '0 6px', color: 'var(--fg-3)' }}>{suffix}</span>}
      <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--line)', height: s.h - 2 }}>
        <button type="button" aria-label="Increment" onClick={() => bump(1)} style={{ ...btnStyle, height: (s.h - 2) / 2 }} disabled={disabled}>▲</button>
        <button type="button" aria-label="Decrement" onClick={() => bump(-1)} style={{ ...btnStyle, height: (s.h - 2) / 2, borderTop: '1px solid var(--line)' }} disabled={disabled}>▼</button>
      </div>
    </div>
  )
})
