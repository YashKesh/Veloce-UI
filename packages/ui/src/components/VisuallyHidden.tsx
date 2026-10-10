import { forwardRef, type ComponentProps } from 'react'

export interface VisuallyHiddenProps extends ComponentProps<'span'> {}

const style: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
}

/** Hides content visually but keeps it accessible to screen readers. */
export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(function VisuallyHidden(
  { children, ...rest },
  ref,
) {
  return (
    <span ref={ref} style={{ ...style, ...rest.style }} {...rest}>
      {children}
    </span>
  )
})
