import { forwardRef, type ComponentProps, type ReactNode } from 'react'
import { cx } from '../../utils/cx'

export type AgentStatus = 'idle' | 'thinking' | 'typing' | 'tool' | 'error'

export interface AgentAvatarProps extends ComponentProps<'div'> {
  name?: string
  /** Avatar glyph or image. If omitted, uses first letter of name. */
  glyph?: ReactNode
  /** Status indicator shown as a dot in the corner. */
  status?: AgentStatus
  size?: number
}

const statusColor: Record<AgentStatus, string> = {
  idle: 'var(--fg-3)',
  thinking: 'var(--warn)',
  typing: 'var(--ac)',
  tool: 'var(--ac-text)',
  error: 'var(--err)',
}

/** Agent avatar with a status indicator — idle / thinking / typing / tool-use / error.
 *  Thinking + typing pulse; error is solid. Ideal for multi-agent chat UIs. */
export const AgentAvatar = forwardRef<HTMLDivElement, AgentAvatarProps>(function AgentAvatar(
  { name = 'Assistant', glyph, status = 'idle', size = 32, className, style, ...rest },
  ref,
) {
  const letter = typeof glyph === 'string' ? glyph : name[0]?.toUpperCase() ?? 'A'
  const indicator = Math.max(6, Math.floor(size * 0.28))
  const pulse = status === 'thinking' || status === 'typing'
  return (
    <div
      ref={ref}
      data-vl-agent-avatar=""
      data-status={status}
      className={cx('vl-agent-avatar', className)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'var(--vl-agent-avatar-bg, color-mix(in oklch, var(--ac) 25%, var(--bg-3)))',
        color: 'var(--vl-agent-avatar-color, var(--fg))',
        fontSize: Math.floor(size * 0.42),
        fontWeight: 600,
        flexShrink: 0,
        ...style,
      }}
      aria-label={name}
      {...rest}
    >
      {typeof glyph !== 'string' && glyph ? glyph : letter}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          right: -1,
          bottom: -1,
          width: indicator,
          height: indicator,
          borderRadius: '50%',
          background: statusColor[status],
          border: '2px solid var(--bg)',
          animation: pulse ? 'vl-dots 1.3s ease-in-out infinite' : undefined,
        }}
      />
    </div>
  )
})
