import { Fragment, type CSSProperties } from 'react'
import { DocsShell } from '../../components/DocsShell'
import { DOCS_SIDEBAR } from '../../docsNav'
import { Seo } from '../../Seo'

const mono: CSSProperties = { fontFamily: 'var(--font-mono)' }

const ROWS: [string, string][] = [
  ['General', 'hello@codeloomdevv.co.in'],
  ['Sales / Enterprise', 'sales@codeloomdevv.co.in'],
  ['Security', 'security@codeloomdevv.co.in'],
]

export default function ContactPage() {
  return (
    <DocsShell sidebar={DOCS_SIDEBAR}>
      <Seo
        title="Contact"
        description="Get in touch with the Veloce UI team — questions, bug reports, feature requests, and partnership inquiries."
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--fg-3)' }}>
          <span>Company</span><span>›</span>
          <span style={{ color: 'var(--fg-2)' }}>Contact</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h1 style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.03em', margin: 0 }}>Contact</h1>
          <p style={{ fontSize: 16, lineHeight: 1.55, color: 'var(--fg-2)', margin: 0 }}>
            Questions about Veloce UI, licensing, enterprise support, or Figma kits — reach us by email.
            We reply within one business day.
          </p>
        </div>

        <div style={{
          border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-1)',
          padding: '18px 20px', display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: 12, columnGap: 20,
          alignItems: 'baseline',
        }}>
          {ROWS.map(([label, email]) => (
            <Fragment key={label}>
              <div style={{ fontSize: 13.5, color: 'var(--fg-3)', fontWeight: 500 }}>{label}</div>
              <a href={`mailto:${email}`} style={{ ...mono, fontSize: 13.5, color: 'var(--ac-text)' }}>
                {email}
              </a>
            </Fragment>
          ))}
          <div style={{ fontSize: 13.5, color: 'var(--fg-3)', fontWeight: 500 }}>Response time</div>
          <div style={{ fontSize: 13.5, color: 'var(--fg-2)' }}>24 h on weekdays · 48 h on weekends</div>
        </div>

        <div style={{ display: 'flex', gap: 18, fontSize: 13.5, color: 'var(--fg-2)' }}>
          <a href="https://github.com" style={{ color: 'inherit' }}>GitHub ↗</a>
          <a href="#" style={{ color: 'inherit' }}>Discord ↗</a>
          <a href="#" style={{ color: 'inherit' }}>Twitter ↗</a>
        </div>
      </div>
    </DocsShell>
  )
}
