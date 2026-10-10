import type { CSSProperties, ReactNode } from 'react'
import { DocsShell, RightRail } from '../../components/DocsShell'
import { DOCS_SIDEBAR } from '../../docsNav'

const mono: CSSProperties = { fontFamily: 'var(--font-mono)' }

export interface ChartsShellToc {
  label: string
  active?: boolean
  /** Section element id to scroll to; defaults to a slug of the label. */
  id?: string
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

function HelpfulBox() {
  return (
    <div style={{ padding: 14, borderRadius: 9, border: '1px solid var(--line)', fontSize: 12.5, color: 'var(--fg-2)' }}>
      <div style={{ color: 'var(--fg)', fontWeight: 500, marginBottom: 10 }}>Was this page helpful?</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid var(--line-2)', color: 'inherit', fontSize: 12.5 }}>Yes</button>
        <button style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid var(--line-2)', color: 'inherit', fontSize: 12.5 }}>No</button>
      </div>
    </div>
  )
}

export function ChartsShell({ toc, children }: { toc: ChartsShellToc[]; children: ReactNode }) {
  const items = toc.map((t) => ({ label: t.label, active: t.active, id: t.id ?? slug(t.label) }))
  return (
    <DocsShell sidebar={DOCS_SIDEBAR} rail={<RightRail toc={items} footer={<HelpfulBox />} />}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>{children}</div>
    </DocsShell>
  )
}

export function ChartsBreadcrumb() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--ac-soft)', border: '1px solid var(--ac-line)', color: 'var(--ac-text)', fontSize: 12, display: 'inline-grid', placeItems: 'center' }}>◔</span>
      <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ac-text)' }}>Veloce Charts</span>
      <span style={{ color: 'var(--fg-3)' }}>/</span>
      <span style={{ fontSize: 13.5, color: 'var(--fg-2)' }}>Chart types</span>
    </div>
  )
}

export function ChartsTitle({ title, lead }: { title: ReactNode; lead: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h1 style={{ margin: 0, fontSize: 40, fontWeight: 600, letterSpacing: '-0.035em' }}>{title}</h1>
        <span style={{ ...mono, fontSize: 11.5, padding: '3px 8px', borderRadius: 6, background: 'color-mix(in oklch, var(--ok) 15%, transparent)', color: 'var(--ok)' }}>a11y ✓</span>
        <span style={{ ...mono, fontSize: 11.5, padding: '3px 8px', borderRadius: 6, border: '1px solid var(--line-2)', color: 'var(--fg-2)', whiteSpace: 'nowrap' }}>SVG · 0 kB runtime</span>
      </div>
      <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: 'var(--fg-2)', maxWidth: 720 }}>{lead}</p>
    </div>
  )
}

export default ChartsShell
