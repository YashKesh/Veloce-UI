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

export default function PrivacyPage() {
  return (
    <DocsShell sidebar={DOCS_SIDEBAR}>
      <Seo
        title="Privacy policy"
        description="How Veloce UI collects, uses, and protects your data when you use our documentation site and components."
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--fg-3)' }}>
          <span>Legal</span><span>›</span>
          <span style={{ color: 'var(--fg-2)' }}>Privacy</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h1 style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.03em', margin: 0 }}>Privacy policy</h1>
          <p style={{ ...mono, fontSize: 12, color: 'var(--fg-3)', margin: 0 }}>Last updated: 2025-10-02</p>
          <p style={p}>
            This policy is a template outlining how CodeLoom handles personal data on the Veloce UI website
            and related services. It is not legal advice.
          </p>
        </div>

        <Section title="Overview">
          <p style={p}>
            We collect the minimum data needed to run the site, deliver updates, and improve the product.
            We do not sell personal data.
          </p>
        </Section>
        <Section title="What we collect">
          <p style={p}>
            Account email (if you sign up), payment metadata (processed by Polar/Stripe — we never see card
            numbers), and aggregated usage events (page views, feature clicks) tied to a rotating session id.
          </p>
        </Section>
        <Section title="How we use it">
          <p style={p}>
            To authenticate you, deliver digital goods and license keys, debug issues, and prioritise roadmap
            work. We retain operational logs for 90 days.
          </p>
        </Section>
        <Section title="Cookies">
          <p style={p}>
            A single first-party cookie stores your theme preference. No tracking cookies are set by default.
          </p>
        </Section>
        <Section title="Analytics">
          <p style={p}>
            Analytics are first-party; we do not embed Google Analytics, Meta Pixel, or similar third-party
            trackers.
          </p>
        </Section>
        <Section title="Your rights (GDPR & CCPA)">
          <p style={p}>
            You may request access, correction, export, or deletion of your personal data at any time by
            emailing <span style={mono}>privacy@codeloomdevv.co.in</span>. We will respond within 30 days.
          </p>
        </Section>
        <Section title="International transfers">
          <p style={p}>
            Our infrastructure is hosted in multiple regions. Where data crosses borders we rely on Standard
            Contractual Clauses with sub-processors.
          </p>
        </Section>
        <Section title="Children">
          <p style={p}>Veloce UI is not directed at children under 13 and we do not knowingly collect their data.</p>
        </Section>
        <Section title="Changes">
          <p style={p}>Material changes to this policy will be announced on the site at least 14 days before taking effect.</p>
        </Section>
        <Section title="Contact">
          <p style={p}>
            Email <a href="mailto:privacy@codeloomdevv.co.in" style={{ ...mono, color: 'var(--ac-text)' }}>privacy@codeloomdevv.co.in</a>.
          </p>
        </Section>
      </div>
    </DocsShell>
  )
}
