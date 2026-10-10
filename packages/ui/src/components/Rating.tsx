import { forwardRef, useState, type CSSProperties } from 'react'
import { cx } from '../utils/cx'

export interface RatingProps {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  max?: number
  size?: number
  readOnly?: boolean
  disabled?: boolean
  color?: string
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

export const Rating = forwardRef<HTMLDivElement, RatingProps>(function Rating(
  {
    value,
    defaultValue = 0,
    onValueChange,
    max = 5,
    size = 20,
    readOnly,
    disabled,
    color = 'var(--warn)',
    className,
    style,
    'aria-label': ariaLabel = 'Rating',
  },
  ref,
) {
  const [internal, setInternal] = useState(defaultValue)
  const [hover, setHover] = useState<number | null>(null)
  const current = value ?? internal
  const show = hover ?? current
  const interactive = !readOnly && !disabled

  const set = (next: number) => {
    if (!interactive) return
    if (value === undefined) setInternal(next)
    onValueChange?.(next)
  }

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={ariaLabel}
      className={cx('vl-rating', className)}
      style={{
        display: 'inline-flex',
        gap: 2,
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
      onMouseLeave={() => setHover(null)}
    >
      {Array.from({ length: max }).map((_, i) => {
        const idx = i + 1
        const filled = show >= idx
        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={current === idx}
            aria-label={`${idx} of ${max}`}
            disabled={disabled}
            onMouseEnter={() => interactive && setHover(idx)}
            onClick={() => set(idx)}
            style={{
              width: size + 4,
              height: size + 4,
              padding: 0,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              cursor: interactive ? 'pointer' : 'default',
              color: filled ? color : 'var(--bg-3)',
              fontSize: size,
              lineHeight: 1,
            }}
          >
            ★
          </button>
        )
      })}
    </div>
  )
})
