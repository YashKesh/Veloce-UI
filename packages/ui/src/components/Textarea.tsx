import { forwardRef, useCallback, useEffect, useRef, type ComponentProps, type CSSProperties } from 'react'
import { cx } from '../utils/cx'

export type TextareaSize = 'sm' | 'md'

export interface TextareaProps extends Omit<ComponentProps<'textarea'>, 'size'> {
  size?: TextareaSize
  invalid?: boolean
  autoResize?: boolean
}

const sizeMap: Record<TextareaSize, { fs: number; pad: string }> = {
  sm: { fs: 13, pad: '8px 10px' },
  md: { fs: 14, pad: '10px 12px' },
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { size = 'md', invalid, autoResize, style, className, onChange, ...rest },
  ref,
) {
  const localRef = useRef<HTMLTextAreaElement | null>(null)
  const setRef = useCallback(
    (el: HTMLTextAreaElement | null) => {
      localRef.current = el
      if (typeof ref === 'function') ref(el)
      else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = el
    },
    [ref],
  )

  const resize = useCallback(() => {
    const el = localRef.current
    if (!el || !autoResize) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [autoResize])

  useEffect(() => {
    if (autoResize) resize()
  }, [autoResize, resize])

  const s = sizeMap[size]
  const styles: CSSProperties = {
    display: 'block',
    width: '100%',
    minHeight: 72,
    padding: s.pad,
    fontSize: s.fs,
    fontFamily: 'var(--font-sans)',
    color: 'var(--fg)',
    background: 'var(--vl-textarea-bg, var(--bg-2))',
    border: `1px solid var(--vl-textarea-border, ${invalid ? 'var(--err)' : 'var(--line-2)'})`,
    boxShadow: 'var(--vl-textarea-ring, none)',
    borderRadius: 'var(--r-md)',
    outline: 'none',
    resize: autoResize ? 'none' : 'vertical',
    lineHeight: 1.5,
    boxSizing: 'border-box',
  }
  return (
    <textarea
      ref={setRef}
      data-vl-textarea=""
      data-invalid={invalid ? '' : undefined}
      aria-invalid={invalid || undefined}
      className={cx('vl-textarea', className)}
      onChange={(e) => {
        onChange?.(e)
        if (autoResize) resize()
      }}
      style={{ ...styles, ...style }}
      {...rest}
    />
  )
})
