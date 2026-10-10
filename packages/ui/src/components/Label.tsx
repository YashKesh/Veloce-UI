import { forwardRef, type ComponentProps } from 'react'
import { cx } from '../utils/cx'

export interface LabelProps extends ComponentProps<'label'> {
  /** Shows an "optional" affordance after the children. */
  optional?: boolean
  /** Marks the field as required with an accent-colored asterisk. */
  required?: boolean
}

/** Form field label primitive. Applies veloce typography + aligns baseline with inputs.
 *  Pass `htmlFor` to associate with an input, or wrap the input inside. */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { children, optional, required, className, style, ...rest },
  ref,
) {
  return (
    <label
      ref={ref}
      data-vl-label=""
      className={cx('vl-label', className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--fg)',
        lineHeight: 1.4,
        ...style,
      }}
      {...rest}
    >
      {children}
      {required && (
        <span aria-hidden style={{ color: 'var(--ac-text)', fontWeight: 400 }}>*</span>
      )}
      {optional && !required && (
        <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--fg-3)' }}>(optional)</span>
      )}
    </label>
  )
})
