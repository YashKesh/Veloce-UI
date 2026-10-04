import type { CSSProperties, ReactNode } from 'react'
import { DocsShell } from '../../components/DocsShell'
import { DOCS_SIDEBAR } from '../../docsNav'
import { Seo } from '../../Seo'

const mono: CSSProperties = { fontFamily: 'var(--font-mono)' }
const h2: CSSProperties = { margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' }
const p: CSSProperties = { fontSize: 14.5, lineHeight: 1.65, color: 'var(--fg-2)', margin: 0 }
const sec: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 8 }

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={sec}>
      <h2 style={h2}>{title}</h2>
      {children}
    </section>
  )
}

export default function TermsPage() {
  return (
    <DocsShell sidebar={DOCS_SIDEBAR}>
      <Seo
        title="Terms of service"
        description="The terms that govern your use of the Veloce UI documentation site and the veloce-ui npm package."
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--fg-3)' }}>
          <span>Legal</span><span>›</span>
          <span style={{ color: 'var(--fg-2)' }}>Terms</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h1 style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.03em', margin: 0 }}>Terms of service</h1>
          <p style={{ ...mono, fontSize: 12, color: 'var(--fg-3)', margin: 0 }}>Last updated: 2025-10-02</p>
          <p style={p}>
            This document is a template outlining the terms under which CodeLoom offers Veloce UI. It is not
            legal advice.
          </p>
        </div>

        <Section title="Acceptance">
          <p style={p}>
            By downloading, installing, or using Veloce UI you agree to these terms. If you disagree, do not
            use the software.
          </p>
        </Section>
        <Section title="License">
          <p style={p}>
            The open-source portions of Veloce UI are released under the MIT license. Commercial add-ons
            (Pro components, Figma kits, enterprise support) are offered under a separate commercial
            license referenced in each product page.
          </p>
        </Section>
        <Section title="Prohibited uses">
          <p style={p}>
            You may not use Veloce UI to build applications that violate applicable law, infringe third-party
            rights, or redistribute the Pro components in violation of their license.
          </p>
        </Section>
        <Section title="Attribution">
          <p style={p}>
            Attribution is appreciated but not required for the MIT-licensed code. Commercial licenses may
            impose their own attribution rules.
          </p>
        </Section>
        <Section title="Warranty disclaimer">
          <p style={p}>
            Veloce UI is provided “as is” without warranty of any kind, express or implied, including but
            not limited to merchantability or fitness for a particular purpose.
          </p>
        </Section>
        <Section title="Limitation of liability">
          <p style={p}>
            To the maximum extent permitted by law, CodeLoom is not liable for any indirect, incidental, or
            consequential damages arising from the use of Veloce UI.
          </p>
        </Section>
        <Section title="Governing law">
          <p style={p}>
            These terms are governed by the laws of India. Disputes are subject to the exclusive
            jurisdiction of the courts of Bengaluru, Karnataka.
          </p>
        </Section>
        <Section title="Changes">
          <p style={p}>
            We may update these terms. Material changes will be announced at least 14 days before taking
            effect; continued use after the effective date constitutes acceptance.
          </p>
        </Section>
        <Section title="Contact">
          <p style={p}>
            Email <a href="mailto:legal@codeloomdevv.co.in" style={{ ...mono, color: 'var(--ac-text)' }}>legal@codeloomdevv.co.in</a>.
          </p>
        </Section>
      </div>
    </DocsShell>
  )
}
