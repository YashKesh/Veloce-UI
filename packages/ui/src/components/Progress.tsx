import { forwardRef, type ComponentProps, type CSSProperties } from 'react'
import { cx } from '../utils/cx'

export interface ProgressProps extends ComponentProps<'div'> {
  value?: number
  max?: number
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value, max = 100, className, style, ...rest },
  ref,
) {
  const isIndet = value === undefined || value === null
  const clamped = isIndet ? 0 : Math.max(0, Math.min(max, value as number))
  const pct = (clamped / max) * 100
  const track: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: 6,
    borderRadius: 999,
    background: 'var(--bg-2)',
    overflow: 'hidden',
    ...style,
  }
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuenow={isIndet ? undefined : clamped}
      aria-valuemin={0}
      aria-valuemax={max}
      data-vl-progress=""
      data-indeterminate={isIndet ? '' : undefined}
      className={cx('vl-progress', className)}
      style={track}
      {...rest}
    >
      <span
        data-vl-progress-bar=""
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: isIndet ? '40%' : `${pct}%`,
          background: 'var(--ac)',
          borderRadius: 999,
          transition: isIndet ? undefined : 'width 200ms var(--ease-swift-out)',
          animation: isIndet ? 'vl-indet 1.4s ease-in-out infinite' : undefined,
        }}
      />
    </div>
  )
})
