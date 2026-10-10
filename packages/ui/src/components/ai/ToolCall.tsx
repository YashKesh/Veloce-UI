import { useState, type ComponentProps, type ReactNode } from 'react'
import { cx } from '../../utils/cx'

export type ToolCallStatus = 'pending' | 'running' | 'success' | 'error'

export interface ToolCallProps extends ComponentProps<'div'> {
  name: string
  status?: ToolCallStatus
  /** Collapsible JSON args block. */
  args?: ReactNode
  /** Collapsible result/output block. */
  result?: ReactNode
  /** Open by default. */
  defaultOpen?: boolean
}

const statusMeta: Record<ToolCallStatus, { color: string; label: string }> = {
  pending: { color: 'var(--fg-3)', label: 'queued' },
  running: { color: 'var(--warn)', label: 'running' },
  success: { color: 'var(--ok)', label: 'done' },
  error: { color: 'var(--err)', label: 'failed' },
}

/** Collapsible tool/function call display — the "function_call" chrome in Claude / GPT UIs.
 *  Shows the tool name, status indicator, and expandable args + result blocks. */
export function ToolCall({
  name,
  status = 'success',
  args,
  result,
  defaultOpen = false,
  className,
  style,
  ...rest
}: ToolCallProps) {
  const [open, setOpen] = useState(defaultOpen)
  const s = statusMeta[status]

  return (
    <div
      data-vl-tool-call=""
      data-status={status}
      className={cx('vl-tool-call', className)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 10,
        border: '1px solid var(--line)',
        background: 'var(--bg-1)',
        overflow: 'hidden',
        fontSize: 13,
        ...style,
      }}
      {...rest}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          padding: '10px 12px',
          background: 'transparent',
          border: 'none',
          color: 'var(--fg)',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: 13,
          textAlign: 'left',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <span
            aria-hidden
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: s.color,
              flexShrink: 0,
              animation: status === 'running' ? 'vl-dots 1.2s ease-in-out infinite' : undefined,
            }}
          />
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--ac-text)' }}>{name}</code>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: s.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
        </span>
        <span style={{ color: 'var(--fg-3)', fontSize: 11, transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 150ms' }}>⌄</span>
      </button>
      {open && (args || result) && (
        <div style={{ borderTop: '1px solid var(--line)' }}>
          {args && (
            <div style={{ padding: '8px 12px', borderBottom: result ? '1px solid var(--line)' : undefined }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-3)', letterSpacing: '0.06em', marginBottom: 4 }}>INPUT</div>
              <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-2)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {args}
              </pre>
            </div>
          )}
          {result && (
            <div style={{ padding: '8px 12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-3)', letterSpacing: '0.06em', marginBottom: 4 }}>OUTPUT</div>
              <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-2)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {result}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
