import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { DocsShell } from '../../components/DocsShell'
import { DOCS_SIDEBAR } from '../../docsNav'
import { Seo } from '../../Seo'

const h2: CSSProperties = { margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' }
const p: CSSProperties = { fontSize: 14.5, lineHeight: 1.65, color: 'var(--fg-2)', margin: 0 }
const sec: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 8 }

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={sec}>
      <h2 style={h2}>{title}</h2>
      {children}
    </section>
  )
}

const PRINCIPLES: [string, string][] = [
  ['Motion-first', 'Every interaction has a chosen curve, duration, and reason — motion is a design primitive, not decoration.'],
  ['Zero-runtime', 'Components ship as plain React + CSS variables. No style-engine runtime, no build-time magic.'],
  ['Accessibility by default', 'Keyboard support, ARIA, focus rings and reduced-motion are baked in — not patched later.'],
]

const TEAM: [string, string][] = [
  ['Yash K.', 'Founder · design & motion'],
  ['CodeLoom team', 'Engineering · documentation'],
]

export default function AboutPage() {
  return (
    <DocsShell sidebar={DOCS_SIDEBAR}>
      <Seo
        title="About"
        description="The story behind Veloce UI — a motion-first React component library built for teams who care about craft."
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--fg-3)' }}>
          <span>Company</span><span>›</span>
          <span style={{ color: 'var(--fg-2)' }}>About</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h1 style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.03em', margin: 0 }}>About Veloce UI</h1>
          <p style={p}>
            Veloce UI is built by the CodeLoom team to make motion-first interfaces easy. We ship the
            primitives, tokens, and reference docs we wished existed when we were building our own products.
          </p>
        </div>

        <Section title="Principles">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {PRINCIPLES.map(([title, body]) => (
              <div key={title} style={{
                border: '1px solid var(--line)', background: 'var(--bg-1)',
                borderRadius: 10, padding: '14px 16px',
              }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--fg-2)' }}>{body}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Team">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {TEAM.map(([name, role]) => (
              <div key={name} style={{
                border: '1px solid var(--line)', background: 'var(--bg-1)',
                borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', background: 'var(--ac-soft)',
                  color: 'var(--ac-text)', display: 'grid', placeItems: 'center', fontWeight: 600,
                }}>{name.charAt(0)}</div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--fg-3)' }}>{role}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Open source philosophy">
          <p style={p}>
            The core of Veloce UI is MIT-licensed and will stay that way. Pro components and Figma kits
            fund the roadmap and keep the open-source core maintained — we don't want donations, we want
            customers.
          </p>
        </Section>

        <Section title="Get in touch">
          <p style={p}>
            Want to talk licensing, enterprise support, or just say hello?{' '}
            <Link to="/contact" style={{ color: 'var(--ac-text)' }}>Contact us →</Link>
          </p>
        </Section>
      </div>
    </DocsShell>
  )
}
