import { forwardRef, type ComponentProps, type ReactNode } from 'react'
import { cx } from '../../utils/cx'

export type ChatRole = 'user' | 'assistant' | 'system' | 'tool'

export interface ChatMessageProps extends ComponentProps<'div'> {
  role: ChatRole
  /** Avatar element (initials, image, icon). Defaults to a tinted dot. */
  avatar?: ReactNode
  /** Author name shown above the bubble. */
  name?: ReactNode
  /** Timestamp or metadata line next to the name. */
  meta?: ReactNode
  /** Pass true to render a streaming cursor at the end of content. */
  streaming?: boolean
}

const roleStyle: Record<ChatRole, { align: 'start' | 'end' | 'stretch'; bubbleBg: string; bubbleFg: string; borderColor: string }> = {
  user: {
    align: 'end',
    bubbleBg: 'var(--vl-chat-user-bg, var(--ac))',
    bubbleFg: 'var(--vl-chat-user-fg, var(--ac-fg))',
    borderColor: 'var(--vl-chat-user-border, transparent)',
  },
  assistant: {
    align: 'start',
    bubbleBg: 'var(--vl-chat-assistant-bg, var(--bg-1))',
    bubbleFg: 'var(--vl-chat-assistant-fg, var(--fg))',
    borderColor: 'var(--vl-chat-assistant-border, var(--line))',
  },
  system: {
    align: 'stretch',
    bubbleBg: 'var(--vl-chat-system-bg, color-mix(in oklch, var(--ac) 8%, transparent))',
    bubbleFg: 'var(--vl-chat-system-fg, var(--fg-2))',
    borderColor: 'var(--vl-chat-system-border, var(--ac-line))',
  },
  tool: {
    align: 'start',
    bubbleBg: 'var(--vl-chat-tool-bg, var(--bg-2))',
    bubbleFg: 'var(--vl-chat-tool-fg, var(--fg-2))',
    borderColor: 'var(--vl-chat-tool-border, var(--line))',
  },
}

export const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(function ChatMessage(
  { role, avatar, name, meta, streaming, children, className, style, ...rest },
  ref,
) {
  const s = roleStyle[role]
  const isUser = role === 'user'
  return (
    <div
      ref={ref}
      data-vl-chat-message=""
      data-role={role}
      className={cx('vl-chat-message', className)}
      style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        gap: 10,
        alignItems: 'flex-start',
        maxWidth: role === 'system' ? '100%' : '85%',
        marginLeft: s.align === 'end' ? 'auto' : undefined,
        marginRight: s.align === 'end' ? 0 : undefined,
        ...style,
      }}
      {...rest}
    >
      {role !== 'system' && (
        <span
          aria-hidden
          style={{
            flexShrink: 0,
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: isUser ? 'var(--ac)' : 'var(--bg-3)',
            color: isUser ? 'var(--ac-fg)' : 'var(--fg-2)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {avatar ?? (role === 'user' ? 'U' : role === 'tool' ? '⚙' : '✦')}
        </span>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
        {(name || meta) && (
          <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8, fontSize: 11.5, color: 'var(--fg-3)' }}>
            {name && <span style={{ color: 'var(--fg-2)', fontWeight: 500 }}>{name}</span>}
            {meta && <span>{meta}</span>}
          </div>
        )}
        <div
          data-vl-chat-bubble=""
          style={{
            padding: role === 'system' ? '8px 12px' : '10px 14px',
            borderRadius: role === 'system' ? 8 : 12,
            background: s.bubbleBg,
            color: s.bubbleFg,
            border: `1px solid ${s.borderColor}`,
            fontSize: 14,
            lineHeight: 1.5,
            fontFamily: 'inherit',
            maxWidth: '100%',
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          {children}
          {streaming && (
            <span
              aria-hidden
              style={{
                display: 'inline-block',
                width: 8,
                height: 14,
                marginLeft: 2,
                verticalAlign: 'text-bottom',
                background: 'currentColor',
                animation: 'vl-caret 1s step-end infinite',
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
})
