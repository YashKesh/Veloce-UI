import { useState, type ComponentProps, type ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface CitationProps extends Omit<ComponentProps<'a'>, 'children'> {
  /** Number shown in the badge. */
  index: number
  /** Source URL. */
  href: string
  /** Title shown in the hover tooltip. */
  title?: string
  /** Short summary / snippet shown in the tooltip. */
  snippet?: ReactNode
  /** Publication / domain source label. */
  source?: ReactNode
}

/** Inline numbered citation badge with a hover-reveal source card.
 *  Pattern used by Perplexity, ChatGPT with browsing, Claude Projects. */
export function Citation({ index, href, title, snippet, source, className, style, ...rest }: CitationProps) {
  const [hover, setHover] = useState(false)
  return (
    <span
      style={{ position: 'relative', display: 'inline-block', verticalAlign: 'super', lineHeight: 1 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        data-vl-citation=""
        className={cx('vl-citation', className)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 16,
          height: 16,
          padding: '0 5px',
          borderRadius: 3,
          background: 'var(--vl-citation-bg, var(--ac-soft))',
          color: 'var(--vl-citation-color, var(--ac-text))',
          fontSize: 10,
          fontWeight: 500,
          fontFamily: 'var(--font-mono)',
          textDecoration: 'none',
          marginLeft: 2,
          transition: 'background 150ms',
          ...style,
        }}
        {...rest}
      >
        {index}
      </a>
      {hover && (title || snippet) && (
        <span
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 6px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 260,
            padding: '10px 12px',
            borderRadius: 8,
            background: 'var(--bg-2)',
            border: '1px solid var(--line-2)',
            boxShadow: 'var(--shadow-md)',
            fontSize: 12,
            lineHeight: 1.5,
            color: 'var(--fg)',
            zIndex: 50,
            textAlign: 'left',
            verticalAlign: 'baseline',
            animation: 'vl-in .15s cubic-bezier(.16,1,.3,1) both',
          }}
        >
          {source && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ac-text)', marginBottom: 2 }}>
              {source}
            </div>
          )}
          {title && <div style={{ fontWeight: 500, marginBottom: 4 }}>{title}</div>}
          {snippet && <div style={{ color: 'var(--fg-2)' }}>{snippet}</div>}
        </span>
      )}
    </span>
  )
}
