import { forwardRef, useRef, useState, type CSSProperties } from 'react'
import { cx } from '../utils/cx'

export interface PinInputProps {
  length?: number
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onComplete?: (value: string) => void
  /** Only accept digits (default) or any character. */
  type?: 'numeric' | 'alphanumeric'
  mask?: boolean
  disabled?: boolean
  invalid?: boolean
  autoFocus?: boolean
  className?: string
  style?: CSSProperties
}

export const PinInput = forwardRef<HTMLDivElement, PinInputProps>(function PinInput(
  {
    length = 6,
    value,
    defaultValue = '',
    onValueChange,
    onComplete,
    type = 'numeric',
    mask,
    disabled,
    invalid,
    autoFocus,
    className,
    style,
  },
  ref,
) {
  const [internal, setInternal] = useState(defaultValue)
  const current = value ?? internal
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const update = (next: string) => {
    const trimmed = next.slice(0, length)
    if (value === undefined) setInternal(trimmed)
    onValueChange?.(trimmed)
    if (trimmed.length === length) onComplete?.(trimmed)
  }

  const isAllowed = (ch: string) =>
    type === 'numeric' ? /^\d$/.test(ch) : /^[a-zA-Z0-9]$/.test(ch)

  const handleChange = (idx: number, raw: string) => {
    const chars = raw.split('').filter(isAllowed)
    if (!chars.length) return
    const arr = current.split('')
    for (let i = 0; i < chars.length && idx + i < length; i++) {
      arr[idx + i] = chars[i]
    }
    const next = arr.join('').slice(0, length)
    update(next)
    const nextIdx = Math.min(idx + chars.length, length - 1)
    refs.current[nextIdx]?.focus()
  }

  const handleKey = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (current[idx]) {
        const arr = current.split('')
        arr[idx] = ''
        update(arr.join(''))
      } else if (idx > 0) {
        refs.current[idx - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      refs.current[idx - 1]?.focus()
    } else if (e.key === 'ArrowRight' && idx < length - 1) {
      refs.current[idx + 1]?.focus()
    }
  }

  return (
    <div
      ref={ref}
      className={cx('vl-pin-input', className)}
      style={{ display: 'inline-flex', gap: 8, ...style }}
    >
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(node) => { refs.current[i] = node }}
          type={mask ? 'password' : 'text'}
          inputMode={type === 'numeric' ? 'numeric' : 'text'}
          autoComplete="one-time-code"
          maxLength={1}
          disabled={disabled}
          autoFocus={autoFocus && i === 0}
          value={current[i] ?? ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={(e) => {
            e.preventDefault()
            handleChange(i, e.clipboardData.getData('text'))
          }}
          style={{
            width: 42,
            height: 48,
            textAlign: 'center',
            fontSize: 20,
            fontFamily: 'var(--font-mono)',
            background: 'var(--bg)',
            color: 'var(--fg)',
            border: `1px solid ${invalid ? 'var(--err)' : 'var(--line-2)'}`,
            borderRadius: 8,
            outline: 'none',
            padding: 0,
          }}
          aria-label={`Digit ${i + 1} of ${length}`}
        />
      ))}
    </div>
  )
})
