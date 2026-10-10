import { type ComponentProps } from 'react'
import { cx } from '../../utils/cx'

export interface DiffLine {
  type: 'add' | 'remove' | 'context'
  content: string
}

export interface DiffViewerProps extends ComponentProps<'div'> {
  /** Either a raw unified diff string or a pre-parsed list of lines. */
  diff: string | DiffLine[]
  /** Filename to show as a header. */
  filename?: string
  /** Language label for the header (e.g. "ts", "py"). */
  language?: string
  /** Hide +/- gutter. */
  hideGutter?: boolean
}

function parseUnifiedDiff(src: string): DiffLine[] {
  return src
    .split('\n')
    .filter((l) => !l.startsWith('---') && !l.startsWith('+++') && !l.startsWith('@@') && !l.startsWith('diff '))
    .map((l) => {
      if (l.startsWith('+')) return { type: 'add' as const, content: l.slice(1) }
      if (l.startsWith('-')) return { type: 'remove' as const, content: l.slice(1) }
      return { type: 'context' as const, content: l.replace(/^ /, '') }
    })
}

/** Side-less unified diff viewer — the "proposed edit" chrome in agent / code-assist UIs.
 *  Pass a raw unified diff string or a pre-parsed line array. */
export function DiffViewer({
  diff,
  filename,
  language,
  hideGutter,
  className,
  style,
  ...rest
}: DiffViewerProps) {
  const lines = typeof diff === 'string' ? parseUnifiedDiff(diff) : diff
  const added = lines.filter((l) => l.type === 'add').length
  const removed = lines.filter((l) => l.type === 'remove').length

  return (
    <div
      data-vl-diff-viewer=""
      className={cx('vl-diff-viewer', className)}
      style={{
        border: '1px solid var(--line)',
        borderRadius: 10,
        background: 'var(--bg-1)',
        overflow: 'hidden',
        fontFamily: 'var(--font-mono)',
        fontSize: 12.5,
        ...style,
      }}
      {...rest}
    >
      {(filename || language) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            background: 'var(--bg-2)',
            borderBottom: '1px solid var(--line)',
            fontSize: 12,
            color: 'var(--fg-2)',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            {filename && <span style={{ color: 'var(--fg)', fontWeight: 500 }}>{filename}</span>}
            {language && <span style={{ fontSize: 10.5, padding: '1px 6px', borderRadius: 4, background: 'var(--bg-3)', color: 'var(--fg-3)' }}>{language}</span>}
          </span>
          <span style={{ display: 'inline-flex', gap: 8, fontSize: 11 }}>
            <span style={{ color: 'var(--ok)' }}>+{added}</span>
            <span style={{ color: 'var(--err)' }}>−{removed}</span>
          </span>
        </div>
      )}
      <div>
        {lines.map((line, i) => {
          const sign = line.type === 'add' ? '+' : line.type === 'remove' ? '−' : ' '
          const bg =
            line.type === 'add'
              ? 'color-mix(in oklch, var(--ok) 10%, transparent)'
              : line.type === 'remove'
                ? 'color-mix(in oklch, var(--err) 10%, transparent)'
                : 'transparent'
          const fg = line.type === 'context' ? 'var(--fg-2)' : line.type === 'add' ? 'var(--ok)' : 'var(--err)'
          return (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: hideGutter ? '1fr' : '28px 1fr',
                background: bg,
                color: fg,
                lineHeight: 1.5,
              }}
            >
              {!hideGutter && (
                <span
                  aria-hidden
                  style={{
                    textAlign: 'center',
                    userSelect: 'none',
                    color: line.type === 'context' ? 'var(--fg-3)' : fg,
                    padding: '1px 0',
                  }}
                >
                  {sign}
                </span>
              )}
              <span style={{ padding: '1px 10px 1px 4px', whiteSpace: 'pre' }}>{line.content || ' '}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
