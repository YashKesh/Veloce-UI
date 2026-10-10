import { type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'veloce-ui'
import { DocsShell, RightRail } from '../components/DocsShell'
import { CodeBlock } from '../components/CodeBlock'
import { DOCS_SIDEBAR } from '../docsNav'
import { Seo } from '../Seo'

const mono: CSSProperties = { fontFamily: 'var(--font-mono)' }

const TOC = [
  { label: 'What it is', id: 'what', active: true },
  { label: 'How to use it', id: 'use' },
  { label: 'Tokens generated', id: 'tokens' },
  { label: 'OKLCH, briefly', id: 'oklch' },
  { label: 'Dark & light modes', id: 'modes' },
  { label: 'Shipping to your app', id: 'ship' },
]

function Code({ children, lang = 'tsx' }: { children: string; lang?: string }) {
  return <CodeBlock lang={lang} code={children} />
}

function H2({ children, id }: { children: React.ReactNode; id: string }) {
  return <h2 id={id} style={{ margin: '0 0 10px', fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', scrollMarginTop: 20 }}>{children}</h2>
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: '0 0 14px', fontSize: 14.5, lineHeight: 1.6, color: 'var(--fg-2)' }}>{children}</p>
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 20, padding: '12px 0', borderTop: '1px solid var(--line)' }}>
      <div style={{ ...mono, fontSize: 12.5, color: 'var(--ac-text)' }}>{label}</div>
      <div style={{ fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.55 }}>{children}</div>
    </div>
  )
}

export default function DocsThemeStudio() {
  return (
    <DocsShell sidebar={DOCS_SIDEBAR} rail={<RightRail toc={TOC} />}>
      <Seo
        title="Theme studio"
        description="Paste any hex, get a complete OKLCH-native Veloce theme. Generates accent, backgrounds, text, borders, and status colours as copy-paste CSS variables."
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 820 }}>
        <div>
          <div style={{ ...mono, fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tool</div>
          <h1 style={{ margin: '6px 0 10px', fontSize: 36, fontWeight: 600, letterSpacing: '-0.025em' }}>Theme studio</h1>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: 'var(--fg-2)' }}>
            Paste any hex colour, pick dark or light mode — the studio generates a complete, perceptually-uniform
            OKLCH palette and a copy-paste CSS block that drops into any Veloce project. Every component on your
            page updates in real time as you tweak the input.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <Link to="/theme"><Button variant="primary">Open the studio →</Button></Link>
            <Link to="/docs/tokens"><Button variant="ghost">Read about tokens</Button></Link>
          </div>
        </div>

        <section>
          <H2 id="what">What it is</H2>
          <P>
            Most "theme generators" sample a hex, nudge the HSL lightness up or down, and ship. The results look flat
            and the hover state fights the primary. Veloce's studio uses <strong>OKLCH</strong> — a perceptually-uniform
            colour space — so when you shift the lightness, the colour actually <em>looks</em> brighter without changing hue.
          </P>
          <P>
            The studio is a thin UI on top of a 100-line colour utility. It generates ~20 CSS variables that every
            Veloce component reads from. Change them once, and buttons, badges, charts, dashboards all follow.
          </P>
        </section>

        <section>
          <H2 id="use">How to use it</H2>
          <div style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '4px 16px', background: 'var(--bg-1)' }}>
            <Row label="1. Pick a colour">Use the colour picker, type a hex (<code style={mono}>#7c6bff</code>), or click a preset.</Row>
            <Row label="2. Choose mode">Toggle between dark and light — the ramp recomputes automatically.</Row>
            <Row label="3. Preview">Scroll the right panel — Button / Badge / Progress / Avatar / Input / mini stat cards render using the new palette.</Row>
            <Row label="4. Copy the CSS">Click <strong>Copy</strong> in the <em>CSS to copy</em> card. Paste into your global stylesheet.</Row>
          </div>
        </section>

        <section>
          <H2 id="tokens">Tokens generated</H2>
          <P>
            Every token is a plain CSS custom property. Veloce components reference them directly — no CSS-in-JS runtime,
            no theme context, no re-renders.
          </P>
          <div style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '4px 16px', background: 'var(--bg-1)' }}>
            <Row label="--ac">Primary accent — buttons, highlights, focus rings</Row>
            <Row label="--ac-h">Hover state — luminance-shifted sibling of <code style={mono}>--ac</code></Row>
            <Row label="--ac-soft">15% accent fill — chips, selected rows</Row>
            <Row label="--ac-line">40% accent border — selected state</Row>
            <Row label="--ac-text">Readable accent — guaranteed contrast on <code style={mono}>--bg</code></Row>
            <Row label="--ac-fg">Foreground on accent fills (usually white)</Row>
            <Row label="--bg / --bg-1..3">Page / card / elevated / hover surfaces</Row>
            <Row label="--fg / --fg-2 / --fg-3">Primary / secondary / muted text</Row>
            <Row label="--line / --line-2">Hairline divider / interactive border</Row>
            <Row label="--ok --warn --err --info">Status colours (fixed hues, mode-aware luminance)</Row>
          </div>
        </section>

        <section>
          <H2 id="oklch">OKLCH, briefly</H2>
          <P>
            OKLCH stands for <strong>L</strong>ightness, <strong>C</strong>hroma, <strong>H</strong>ue — in a space tuned
            to match how human eyes perceive brightness. Compared to HSL:
          </P>
          <div style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '4px 16px', background: 'var(--bg-1)' }}>
            <Row label="HSL lightness">Numeric. Yellow at L=50% looks blinding; blue at L=50% looks almost black.</Row>
            <Row label="OKLCH lightness">Perceptual. L=0.5 means roughly the same visual brightness for every hue.</Row>
          </div>
          <P>
            Practical consequence: a 10-point luminance shift gives a consistent, predictable "step" — which is exactly
            what you want for hover states, surface elevations, and ramp construction.
          </P>
        </section>

        <section>
          <H2 id="modes">Dark &amp; light modes</H2>
          <P>
            The studio generates the ramp for one mode at a time. In your app, scope the two blocks under
            <code style={mono}> :root[data-mode="dark"] </code> and <code style={mono}> :root[data-mode="light"] </code>
            and toggle a single attribute on <code style={mono}>&lt;html&gt;</code>:
          </P>
          <Code>{`// Toggle mode
document.documentElement.setAttribute('data-mode', 'light')`}</Code>
        </section>

        <section>
          <H2 id="ship">Shipping to your app</H2>
          <P>
            Drop the generated CSS into your global stylesheet (e.g. <code style={mono}>index.css</code> or
            <code style={mono}> globals.css</code>) <em>after</em> the Veloce stylesheet import. Your custom tokens
            override the defaults because they come later in the cascade.
          </P>
          <Code>{`/* globals.css */
@import 'veloce-ui/styles.css';

/* From Theme Studio */
:root[data-mode="dark"] {
  --ac: #7c6bff;
  --ac-h: oklch(0.73 0.19 285);
  --bg: oklch(0.14 0.004 285);
  /* …etc… */
}

:root[data-mode="light"] {
  --ac: #5a48d9;
  /* …etc… */
}`}</Code>
          <P>
            That's the whole integration. No React provider, no JS bundle size, no theme object to thread through props.
          </P>
        </section>
      </div>
    </DocsShell>
  )
}
