import {
  forwardRef,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cx } from '../../utils/cx'

export interface PromptInputProps extends Omit<ComponentProps<'div'>, 'onSubmit'> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Called when the user hits Enter (not Shift+Enter) or clicks Send. */
  onSubmit?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  loading?: boolean
  /** Max rows the textarea will grow to before scrolling. Default 8. */
  maxRows?: number
  /** Optional slot rendered left of the send button (e.g. model picker, attachment icons). */
  leftSlot?: ReactNode
  /** Replace the default send button entirely. */
  rightSlot?: ReactNode
}

/** Multi-line prompt input with auto-grow, Enter-to-submit, and slots for a model picker,
 *  attachment buttons, token counters, etc. */
export const PromptInput = forwardRef<HTMLTextAreaElement, PromptInputProps>(function PromptInput(
  {
    value,
    defaultValue,
    onValueChange,
    onSubmit,
    placeholder = 'Ask anything…',
    disabled,
    loading,
    maxRows = 8,
    leftSlot,
    rightSlot,
    className,
    style,
    ...rest
  },
  ref,
) {
  const [internal, setInternal] = useState(defaultValue ?? '')
  const current = value ?? internal
  const taRef = useRef<HTMLTextAreaElement | null>(null)

  const setValueBoth = (next: string) => {
    if (value === undefined) setInternal(next)
    onValueChange?.(next)
  }

  const submit = () => {
    const trimmed = current.trim()
    if (!trimmed || disabled || loading) return
    onSubmit?.(trimmed)
    if (value === undefined) setInternal('')
    requestAnimationFrame(() => taRef.current?.focus())
  }

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const onInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget
    setValueBoth(el.value)
    el.style.height = 'auto'
    const lineHeight = 20
    const padding = 24
    const maxH = maxRows * lineHeight + padding
    el.style.height = `${Math.min(el.scrollHeight, maxH)}px`
  }

  const container: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: 10,
    borderRadius: 'var(--vl-prompt-radius, 14px)',
    background: 'var(--vl-prompt-bg, var(--bg-1))',
    border: `1px solid var(--vl-prompt-border, var(--line-2))`,
    boxShadow: 'var(--vl-prompt-shadow, var(--shadow-sm))',
    transition: 'border-color 150ms var(--ease-swift-out), box-shadow 150ms var(--ease-swift-out)',
    ...style,
  }

  return (
    <div
      data-vl-prompt-input=""
      className={cx('vl-prompt-input', className)}
      style={container}
      {...rest}
    >
      <textarea
        ref={(node) => {
          taRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
        }}
        value={current}
        onChange={onInput}
        onKeyDown={onKey}
        placeholder={placeholder}
        disabled={disabled || loading}
        rows={1}
        style={{
          resize: 'none',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          color: 'var(--fg)',
          fontFamily: 'inherit',
          fontSize: 14,
          lineHeight: 1.5,
          padding: '6px 8px',
          width: '100%',
          minHeight: 28,
          maxHeight: `${maxRows * 20 + 24}px`,
          overflowY: 'auto',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>{leftSlot}</div>
        <div style={{ flex: 1 }} />
        {rightSlot ?? (
          <button
            type="button"
            onClick={submit}
            disabled={disabled || loading || !current.trim()}
            aria-label="Send"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: 8,
              border: 'none',
              background: current.trim() && !disabled && !loading ? 'var(--ac)' : 'var(--bg-3)',
              color: current.trim() && !disabled && !loading ? 'var(--ac-fg)' : 'var(--fg-3)',
              cursor: current.trim() && !disabled && !loading ? 'pointer' : 'not-allowed',
              fontSize: 15,
              transition: 'background 150ms, color 150ms',
            }}
          >
            {loading ? (
              <span
                aria-hidden
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  border: '1.5px solid currentColor',
                  borderRightColor: 'transparent',
                  animation: 'vl-spin 0.7s linear infinite',
                }}
              />
            ) : (
              '↑'
            )}
          </button>
        )}
      </div>
    </div>
  )
})
