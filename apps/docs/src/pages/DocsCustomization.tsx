import { useState, type CSSProperties } from 'react'
import { Button, Switch, Checkbox, Card } from 'veloce-ui'
import { DocsShell, RightRail } from '../components/DocsShell'
import { DOCS_SIDEBAR } from '../docsNav'
import { Seo } from '../Seo'

const mono: CSSProperties = { fontFamily: 'var(--font-mono)' }

const TOC = [
  { label: 'Three layers', id: 'three-layers', active: true },
  { label: 'className + style', id: 'className' },
  { label: 'CSS variables', id: 'css-vars' },
  { label: 'Component tokens', id: 'component-tokens' },
  { label: 'asChild composition', id: 'as-child' },
  { label: 'Writing your own', id: 'wrap' },
]

function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre
      style={{
        ...mono,
        margin: 0,
        padding: '14px 16px',
        background: 'var(--bg-1)',
        border: '1px solid var(--line)',
        borderRadius: 10,
        fontSize: 12.5,
        color: 'var(--fg)',
        overflow: 'auto',
        lineHeight: 1.55,
      }}
    >
      {children}
    </pre>
  )
}

function H2({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <h2 id={id} style={{ margin: '0 0 10px', fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', scrollMarginTop: 20 }}>
      {children}
    </h2>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: '0 0 14px', fontSize: 14.5, lineHeight: 1.6, color: 'var(--fg-2)' }}>{children}</p>
}

export default function DocsCustomization() {
  const [on, setOn] = useState(true)
  return (
    <DocsShell sidebar={DOCS_SIDEBAR} rail={<RightRail toc={TOC} />}>
      <Seo
        title="Customization"
        description="Three layers of customization in veloce-ui: className/style, CSS variables, and per-component tokens. Plus asChild composition for polymorphism without wrappers."
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 820 }}>
        <div>
          <div style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--fg-3)', marginBottom: 10 }}>
            <span>Docs</span>
            <span>›</span>
            <span style={{ color: 'var(--fg-2)' }}>Customization</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 40, fontWeight: 600, letterSpacing: '-0.035em' }}>Customization</h1>
          <p style={{ margin: '12px 0 0', fontSize: 17, lineHeight: 1.55, color: 'var(--fg-2)' }}>
            Three layers you can reach for — from a one-off style override to a site-wide theme swap. Pick the one that matches the scope.
          </p>
        </div>

        <section id="three-layers" style={{ scrollMarginTop: 20 }}>
          <H2 id="three-layers">The three layers</H2>
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px 24px', alignItems: 'baseline', fontSize: 14 }}>
            <code style={{ ...mono, color: 'var(--ac-text)', fontSize: 12.5 }}>className / style</code>
            <span style={{ color: 'var(--fg-2)', lineHeight: 1.55 }}>
              Instance override. Reach for this when you need to tweak one place.
            </span>
            <code style={{ ...mono, color: 'var(--ac-text)', fontSize: 12.5 }}>CSS variables</code>
            <span style={{ color: 'var(--fg-2)', lineHeight: 1.55 }}>
              Theme-level change. Override <code>--ac</code>, <code>--bg</code>, <code>--c-0..5</code> and every component picks it up.
            </span>
            <code style={{ ...mono, color: 'var(--ac-text)', fontSize: 12.5 }}>Component tokens</code>
            <span style={{ color: 'var(--fg-2)', lineHeight: 1.55 }}>
              Per-component slots like <code>--vl-switch-track-on</code>. Change one slot of one component without touching the rest.
            </span>
          </div>
        </section>

        <section id="className" style={{ scrollMarginTop: 20 }}>
          <H2 id="className">1 · className + style (instance override)</H2>
          <P>Every component accepts <code>className</code>, <code>style</code>, and spreads arbitrary HTML attributes onto its root element. Styles merge with internals — you can override anything.</P>
          <Code>{`<Button style={{ borderRadius: 999 }}>Pill button</Button>

<Switch className="my-switch" style={{ transform: 'scale(1.4)' }} />`}</Code>
          <div style={{ marginTop: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
            <Button variant="primary" style={{ borderRadius: 999, paddingInline: 20 }}>Pill button</Button>
            <Switch checked={on} onCheckedChange={setOn} style={{ transform: 'scale(1.4)', transformOrigin: 'left center' }} />
          </div>
        </section>

        <section id="css-vars" style={{ scrollMarginTop: 20 }}>
          <H2 id="css-vars">2 · CSS variables (site-wide theme)</H2>
          <P>Every visual property goes through CSS variables. Change them anywhere — <code>:root</code>, a scoped class, or a parent element — and components inside that scope restyle automatically.</P>
          <Code>{`:root {
  --ac: oklch(0.65 0.2 150);         /* site accent → emerald */
  --bg: oklch(0.98 0.005 60);        /* page background */
  --c-0: var(--ac);                  /* chart series primary */
  --c-1: oklch(0.6 0.15 220);        /* chart series secondary */
}

/* Scoped: this section looks totally different */
.marketing {
  --ac: oklch(0.65 0.22 12);
  --bg-1: oklch(0.98 0.01 60);
}`}</Code>
          <P>
            Theming is a one-liner. The <a href="/accents" style={{ color: 'var(--ac-text)' }}>Accents page</a> and <a href="/docs/tokens" style={{ color: 'var(--ac-text)' }}>Tokens page</a> list every variable you can override.
          </P>
        </section>

        <section id="component-tokens" style={{ scrollMarginTop: 20 }}>
          <H2 id="component-tokens">3 · Component tokens (one slot of one component)</H2>
          <P>Each primitive exposes <code>--vl-&lt;name&gt;-&lt;slot&gt;</code> variables so you can restyle just one slot without touching the overall theme. Set them inline, in a class, or on <code>:root</code> for a global repaint.</P>
          <Code>{`/* Make switches purple without touching the rest of the design */
.my-brand-switch {
  --vl-switch-track-on: oklch(0.55 0.22 300);
  --vl-switch-track-off: oklch(0.95 0.02 300);
  --vl-switch-thumb: #fff;
}

/* Inline on a specific instance */
<Checkbox style={{ '--vl-checkbox-bg-checked': 'var(--err)' }} checked />`}</Code>
          <div style={{ marginTop: 14, display: 'flex', gap: 14, alignItems: 'center' }}>
            <Switch
              checked
              style={{
                ['--vl-switch-track-on' as string]: 'oklch(0.55 0.22 300)',
                ['--vl-switch-thumb' as string]: '#fff',
              }}
            />
            <Checkbox
              checked
              style={{
                ['--vl-checkbox-bg-checked' as string]: 'var(--err)',
                ['--vl-checkbox-border-checked' as string]: 'var(--err)',
              }}
            />
            <span style={{ ...mono, fontSize: 12, color: 'var(--fg-3)' }}>per-instance repaint</span>
          </div>
          <H3>Tokens available today</H3>
          <P>Each exposes a small set of slot variables. Common pattern: <code>bg</code>, <code>border</code>, <code>color</code>, plus state suffixes like <code>-on</code>, <code>-pressed</code>, <code>-checked</code>.</P>
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '10px 24px', fontSize: 13, lineHeight: 1.6 }}>
            <code style={{ ...mono, color: 'var(--ac-text)' }}>Button</code>
            <span style={{ ...mono, color: 'var(--fg-2)', fontSize: 12 }}>--vl-btn-bg · --vl-btn-fg</span>
            <code style={{ ...mono, color: 'var(--ac-text)' }}>Switch</code>
            <span style={{ ...mono, color: 'var(--fg-2)', fontSize: 12 }}>--vl-switch-track-on/off · --vl-switch-border-on/off · --vl-switch-thumb</span>
            <code style={{ ...mono, color: 'var(--ac-text)' }}>Checkbox</code>
            <span style={{ ...mono, color: 'var(--fg-2)', fontSize: 12 }}>--vl-checkbox-bg/-checked · --vl-checkbox-border/-checked · --vl-checkbox-check · --vl-checkbox-ring</span>
            <code style={{ ...mono, color: 'var(--ac-text)' }}>Radio</code>
            <span style={{ ...mono, color: 'var(--fg-2)', fontSize: 12 }}>--vl-radio-bg · --vl-radio-border/-checked · --vl-radio-dot · --vl-radio-ring</span>
            <code style={{ ...mono, color: 'var(--ac-text)' }}>Input / Textarea / Select</code>
            <span style={{ ...mono, color: 'var(--fg-2)', fontSize: 12 }}>--vl-{'<name>'}-bg · -border · -ring · -color</span>
            <code style={{ ...mono, color: 'var(--ac-text)' }}>Toggle</code>
            <span style={{ ...mono, color: 'var(--fg-2)', fontSize: 12 }}>--vl-toggle-bg/-pressed · --vl-toggle-color/-pressed · --vl-toggle-border/-pressed</span>
            <code style={{ ...mono, color: 'var(--ac-text)' }}>Card</code>
            <span style={{ ...mono, color: 'var(--fg-2)', fontSize: 12 }}>--vl-card-bg · --vl-card-border · --vl-card-radius · --vl-card-shadow · --vl-card-color</span>
            <code style={{ ...mono, color: 'var(--ac-text)' }}>Dialog</code>
            <span style={{ ...mono, color: 'var(--fg-2)', fontSize: 12 }}>--vl-dialog-bg · --vl-dialog-border · --vl-dialog-radius · --vl-dialog-shadow · --vl-dialog-overlay</span>
            <code style={{ ...mono, color: 'var(--ac-text)' }}>Tooltip</code>
            <span style={{ ...mono, color: 'var(--fg-2)', fontSize: 12 }}>--vl-tooltip-bg · --vl-tooltip-color</span>
            <code style={{ ...mono, color: 'var(--ac-text)' }}>Slider</code>
            <span style={{ ...mono, color: 'var(--fg-2)', fontSize: 12 }}>--vl-slider-track · --vl-slider-fill · --vl-slider-thumb · --vl-slider-thumb-border</span>
            <code style={{ ...mono, color: 'var(--ac-text)' }}>Progress</code>
            <span style={{ ...mono, color: 'var(--fg-2)', fontSize: 12 }}>--vl-progress-track · --vl-progress-fill</span>
          </div>
        </section>

        <section id="as-child" style={{ scrollMarginTop: 20 }}>
          <H2 id="as-child">asChild composition</H2>
          <P>Instead of wrapping a <code>&lt;Button&gt;</code> in a <code>&lt;Link&gt;</code> and losing the button's semantics (or styles), pass <code>asChild</code>. Props and styles merge onto the child element.</P>
          <Code>{`import { Button } from 'veloce-ui'
import { Link } from 'react-router-dom'

// Button renders as an <a>, keeping the button styling
<Button asChild variant="primary">
  <Link to="/docs">Read the docs</Link>
</Button>

// Toggle renders as a label wrapping a checkbox
<Toggle asChild pressed={bold}>
  <label><input type="checkbox" /> Bold</label>
</Toggle>`}</Code>
          <P>
            Available on <code>Button</code> and <code>Toggle</code> today. Any other component you want it on, use the standalone <a href="/components/slot" style={{ color: 'var(--ac-text)' }}><code>&lt;Slot&gt;</code></a> primitive.
          </P>
        </section>

        <section id="wrap" style={{ scrollMarginTop: 20 }}>
          <H2 id="wrap">Writing your own</H2>
          <P>Compose primitives into app-specific components. Keep the veloce component as the inner leaf; add your own layout, state, and tokens outside.</P>
          <Code>{`import { Card, Badge, Button } from 'veloce-ui'

export function DeployCard({ project, status, onDeploy }) {
  return (
    <Card elevated style={{ '--vl-card-bg': 'var(--bg)' }}>
      <Card.Header>
        {project.name}
        <Badge tone={status === 'live' ? 'ok' : 'warn'}>{status}</Badge>
      </Card.Header>
      <Card.Body>{project.description}</Card.Body>
      <Card.Footer>
        <Button variant="primary" onClick={onDeploy}>Deploy</Button>
      </Card.Footer>
    </Card>
  )
}`}</Code>
          <div style={{ marginTop: 14 }}>
            <Card elevated style={{ maxWidth: 420 }}>
              <Card.Header>
                veloce-docs
                <span style={{ padding: '2px 10px', borderRadius: 999, background: 'color-mix(in oklch, var(--ok) 15%, transparent)', color: 'var(--ok)', fontSize: 11 }}>LIVE</span>
              </Card.Header>
              <Card.Body>Docs site composed from veloce primitives — no custom CSS needed for the shell.</Card.Body>
              <Card.Footer>
                <Button variant="primary" size="sm">Open</Button>
                <Button variant="ghost" size="sm">Logs</Button>
              </Card.Footer>
            </Card>
          </div>
        </section>
      </div>
    </DocsShell>
  )
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 style={{ margin: '24px 0 8px', fontSize: 17, fontWeight: 600, letterSpacing: '-0.015em' }}>{children}</h3>
}
