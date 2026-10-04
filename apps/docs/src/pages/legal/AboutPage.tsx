import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { DocsShell } from '../../components/DocsShell'
import { DOCS_SIDEBAR } from '../../docsNav'
import { Seo } from '../../Seo'

const h2: CSSProperties = { margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' }
const p: CSSProperties = { fontSize: 14.5, lineHeight: 1.65, color: 'var(--fg-2)', margin: 0 }
const sec: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 8 }

function Section({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return (
    <section id={id} style={sec}>
      <h2 style={h2}>{title}</h2>
      {children}
    </section>
  )
}

const PRINCIPLES: [string, string][] = [
  ['Motion-first', 'Every interaction has a chosen curve, duration, and reason — motion is a design primitive, not decoration. Reduced-motion is respected everywhere.'],
  ['Zero-runtime', 'Components ship as plain React + CSS. No animation library, no CSS-in-JS runtime, no hydration cost beyond what React itself needs.'],
  ['Accessibility by default', 'Keyboard support, ARIA roles, focus rings, and prefers-reduced-motion are baked in — not bolted on later.'],
  ['Overridable without hacks', 'Library CSS lives inside @layer veloce-ui. Your own CSS beats it without !important. Inline style/className always wins.'],
]

export default function AboutPage() {
  return (
    <DocsShell sidebar={DOCS_SIDEBAR}>
      <Seo
        title="About"
        description="The story behind Veloce UI — a solo-authored motion-first React 19 component library. Why it exists, who built it, and how it's maintained."
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          '@id': 'https://veloceui.codeloomdevv.co.in/about#yashkesh',
          name: 'YashKesh',
          alternateName: 'Yash Kesharwani',
          url: 'https://github.com/YashKesh',
          jobTitle: 'Software Engineer · Open-source maintainer',
          knowsAbout: ['React', 'TypeScript', 'UI libraries', 'CSS', 'OKLCH color space', 'Web animation', 'Design systems'],
          sameAs: [
            'https://github.com/YashKesh',
            'https://www.npmjs.com/~yashkesh',
          ],
          creator: {
            '@type': 'SoftwareApplication',
            name: 'veloce-ui',
            url: 'https://www.npmjs.com/package/veloce-ui',
          },
        })}</script>
      </Helmet>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--fg-3)' }}>
          <span>Company</span><span>›</span>
          <span style={{ color: 'var(--fg-2)' }}>About</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h1 style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.03em', margin: 0 }}>About Veloce UI</h1>
          <p style={p}>
            Veloce UI is a motion-first React 19 component library. 36 primitives, 13 chart types, and a full-featured
            data grid, shipped as a single npm package with zero runtime animation cost. It is open-source under the
            MIT license and maintained by one person.
          </p>
        </div>

        <Section title="Why it exists" id="why">
          <p style={p}>
            Every React component library I used felt like a trade-off. Headless libraries (Radix, React Aria) got
            accessibility and interaction right but shipped no motion or styling. Styled libraries (Material UI,
            Chakra, Mantine) covered everything but added runtime cost from the style engine and never quite
            committed to motion as a first-class concern. shadcn/ui split the difference — copy source into your
            app, style it with Tailwind — but you own every component forever and the motion story was still "add
            framer-motion yourself."
          </p>
          <p style={p}>
            Veloce UI is a specific take: motion built into every primitive with a shared vocabulary (five
            easings, five durations, prefers-reduced-motion respected), styling via a plain CSS cascade layer so
            your overrides beat the library without <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13.5 }}>!important</code>,
            tokens defined in OKLCH so three accent palettes work without hand-tuning per shade, and distribution
            as one dependency rather than copy-paste.
          </p>
        </Section>

        <Section title="Principles" id="principles">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
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

        <Section title="Maintainer" id="maintainer">
          <div style={{
            display: 'flex', gap: 16, alignItems: 'center',
            padding: '18px 20px', border: '1px solid var(--line)', background: 'var(--bg-1)', borderRadius: 10,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--ac-soft)', color: 'var(--ac-text)',
              display: 'grid', placeItems: 'center',
              fontSize: 22, fontWeight: 600,
            }}>Y</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>YashKesh</div>
              <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>Software engineer. Builds UI libraries, developer tools, and the occasional product.</div>
              <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: 13 }}>
                <a href="https://github.com/YashKesh" target="_blank" rel="noreferrer" style={{ color: 'var(--ac-text)' }}>GitHub</a>
                <a href="https://www.npmjs.com/~yashkesh" target="_blank" rel="noreferrer" style={{ color: 'var(--ac-text)' }}>npm</a>
                <a href="https://github.com/YashKesh/Veloce-UI/issues" target="_blank" rel="noreferrer" style={{ color: 'var(--ac-text)' }}>Report an issue</a>
              </div>
            </div>
          </div>
        </Section>

        <Section title="How it's maintained" id="maintenance">
          <p style={p}>
            Veloce UI is a solo project. Expect patch releases weekly through v1.0, then stability thereafter.
            Breaking API changes go in major versions with migration notes. Bug reports go to{' '}
            <a href="https://github.com/YashKesh/Veloce-UI/issues" style={{ color: 'var(--ac-text)' }}>GitHub Issues</a> —
            I triage them personally. There is no commercial tier, no paid add-ons, no "Pro" version. The library
            is MIT and will stay MIT.
          </p>
        </Section>

        <Section title="Honest limitations" id="limitations">
          <p style={p}>
            At v0.1, the library is production-usable but new. Things to know before you depend on it:
          </p>
          <ul style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--fg-2)', paddingLeft: 20, margin: 0 }}>
            <li>Requires React 19 — older versions are not supported.</li>
            <li>Requires evergreen browsers that support <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>color-mix(in oklch, …)</code> (Chrome 111+, Firefox 113+, Safari 16.4+). Older browsers see unstyled accents.</li>
            <li>No RTL audit yet — components render fine but a formal pass is pending.</li>
            <li>Accessibility coverage is thorough but not independently audited. Report anything you find.</li>
            <li>DataGrid virtualization is row-only, not cell-level. 100k rows works; 50 very wide columns might not.</li>
          </ul>
        </Section>

        <Section title="Get in touch" id="contact">
          <p style={p}>
            Bug or feature request? Open a{' '}
            <a href="https://github.com/YashKesh/Veloce-UI/issues" style={{ color: 'var(--ac-text)' }}>GitHub issue</a>.
            Everything else: <Link to="/contact" style={{ color: 'var(--ac-text)' }}>Contact →</Link>.
          </p>
        </Section>
      </div>
    </DocsShell>
  )
}
