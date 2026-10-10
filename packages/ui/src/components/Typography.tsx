import { forwardRef, type ComponentProps, type CSSProperties } from 'react'
import { cx } from '../utils/cx'

// ─── Kbd ─────────────────────────────────────────────────────────────────────
export interface KbdProps extends ComponentProps<'kbd'> {}

/** Keyboard-key badge. */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { className, style, children, ...rest },
  ref,
) {
  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 20,
    height: 20,
    padding: '0 5px',
    borderRadius: 5,
    border: '1px solid var(--line-2)',
    background: 'var(--bg-1)',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    lineHeight: 1,
    color: 'var(--fg-2)',
    boxShadow: '0 1px 0 var(--line-2), inset 0 -1px 0 var(--line)',
    ...style,
  }
  return (
    <kbd ref={ref} className={cx('vl-kbd', className)} style={base} {...rest}>
      {children}
    </kbd>
  )
})

// ─── Code ────────────────────────────────────────────────────────────────────
export interface CodeProps extends ComponentProps<'code'> {
  block?: boolean
}

/** Inline <code> by default. Pass `block` to render a padded block. */
export const Code = forwardRef<HTMLElement, CodeProps>(function Code(
  { block, className, style, children, ...rest },
  ref,
) {
  const base: CSSProperties = block
    ? {
        display: 'block',
        padding: '12px 14px',
        borderRadius: 8,
        background: 'var(--bg-1)',
        border: '1px solid var(--line)',
        fontFamily: 'var(--font-mono)',
        fontSize: 12.5,
        lineHeight: 1.6,
        color: 'var(--fg)',
        overflow: 'auto',
        ...style,
      }
    : {
        display: 'inline',
        padding: '0.15em 0.4em',
        borderRadius: 4,
        background: 'var(--bg-2)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.9em',
        color: 'var(--fg)',
        ...style,
      }
  return (
    <code ref={ref} className={cx(block ? 'vl-code-block' : 'vl-code', className)} style={base} {...rest}>
      {children}
    </code>
  )
})

// ─── Mark (highlight) ─────────────────────────────────────────────────────────
export interface MarkProps extends ComponentProps<'mark'> {}

/** Text highlight. Defaults to a soft accent tint. */
export const Mark = forwardRef<HTMLElement, MarkProps>(function Mark(
  { className, style, children, ...rest },
  ref,
) {
  const base: CSSProperties = {
    background: 'color-mix(in oklch, var(--ac) 25%, transparent)',
    color: 'var(--fg)',
    padding: '0 2px',
    borderRadius: 2,
    ...style,
  }
  return (
    <mark ref={ref} className={cx('vl-mark', className)} style={base} {...rest}>
      {children}
    </mark>
  )
})

// ─── Blockquote ───────────────────────────────────────────────────────────────
export interface BlockquoteProps extends ComponentProps<'blockquote'> {
  cite?: string
}

/** Styled block quote with a left accent rule. */
export const Blockquote = forwardRef<HTMLQuoteElement, BlockquoteProps>(function Blockquote(
  { className, style, children, cite, ...rest },
  ref,
) {
  const base: CSSProperties = {
    margin: 0,
    padding: '10px 0 10px 16px',
    borderLeft: '3px solid var(--ac)',
    fontSize: 15,
    lineHeight: 1.6,
    color: 'var(--fg-2)',
    ...style,
  }
  return (
    <blockquote ref={ref} className={cx('vl-blockquote', className)} style={base} cite={cite} {...rest}>
      {children}
      {cite && (
        <footer style={{ marginTop: 8, fontSize: 12.5, color: 'var(--fg-3)' }}>
          — <cite style={{ fontStyle: 'normal' }}>{cite}</cite>
        </footer>
      )}
    </blockquote>
  )
})
