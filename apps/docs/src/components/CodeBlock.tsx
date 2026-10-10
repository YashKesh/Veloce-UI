import { useState, type CSSProperties, type ReactNode } from 'react'

/**
 * CodeBlock — docs <pre> block with a built-in copy button.
 *
 * - Pass a plain string via `code` to make the copy button exact.
 * - Pass JSX via `children` for syntax-highlighted content (copy falls back to
 *   DOM textContent).
 */
export interface CodeBlockProps {
  code?: string
  children?: ReactNode
  /** Language label shown in the top-left (e.g. "tsx", "bash"). Optional. */
  lang?: string
  /** Override max height; defaults to none (expand to content). */
  maxHeight?: number | string
  className?: string
  style?: CSSProperties
}

const monoFont: CSSProperties = { fontFamily: 'var(--font-mono)' }

export function CodeBlock({ code, children, lang, maxHeight, className, style }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  async function copy(e: React.MouseEvent<HTMLButtonElement>) {
    const btn = e.currentTarget
    let text = code ?? ''
    if (!text) {
      // Extract plain text from the rendered <pre> as a fallback.
      const pre = btn.parentElement?.querySelector('pre')
      text = pre?.innerText ?? ''
    }
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      // ignore — clipboard may be unavailable (sandbox / insecure context)
    }
  }

  return (
    <div
      data-vl-codeblock=""
      className={className}
      style={{ position: 'relative', ...style }}
    >
      {lang && (
        <span
          style={{
            position: 'absolute', top: 10, left: 14, fontSize: 10.5,
            color: 'var(--fg-3)', fontFamily: 'var(--font-mono)',
            letterSpacing: '0.08em', textTransform: 'uppercase', zIndex: 1,
            pointerEvents: 'none',
          }}
        >{lang}</span>
      )}
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Copied' : 'Copy code'}
        style={{
          position: 'absolute', top: 8, right: 8, zIndex: 2,
          padding: '4px 10px', fontSize: 11.5, borderRadius: 6,
          border: '1px solid var(--line-2)',
          background: copied ? 'color-mix(in oklch, var(--ok) 15%, var(--bg-1))' : 'var(--bg-1)',
          color: copied ? 'var(--ok)' : 'var(--fg-2)',
          cursor: 'pointer', fontFamily: 'inherit',
          transition: 'background 150ms, color 150ms',
        }}
      >
        {copied ? '✓ Copied' : 'Copy'}
      </button>
      <pre
        style={{
          ...monoFont,
          margin: 0,
          padding: lang ? '28px 16px 14px' : '14px 16px',
          background: 'var(--bg-1)',
          border: '1px solid var(--line)',
          borderRadius: 10,
          fontSize: 12.5,
          color: 'var(--fg)',
          lineHeight: 1.55,
          overflow: 'auto',
          maxHeight,
          whiteSpace: 'pre',
        }}
      >
        {children ?? code}
      </pre>
    </div>
  )
}
