import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Button } from 'veloce-ui'
import { DocsShell, RightRail } from '../components/DocsShell'
import type { TocItem } from '../components/DocsShell'
import { COMPONENTS, DOCS_SIDEBAR } from '../docsNav'

const mono: CSSProperties = { fontFamily: 'var(--font-mono)' }

const TOC: TocItem[] = [
  { label: 'Install', id: 'install' },
  { label: 'Import styles', id: 'styles' },
  { label: 'Hello world', id: 'hello' },
  { label: 'Customizing', id: 'customize' },
  { label: 'Theming tokens', id: 'tokens' },
  { label: 'Dark mode', id: 'dark-mode' },
  { label: 'Components', id: 'components' },
  { label: 'Changelog', id: 'changelog' },
]

function Pre({ children }: { children: string }) {
  return (
    <pre
      style={{
        margin: '12px 0',
        padding: '12px 16px',
        background: 'var(--bg-1)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-md)',
        overflow: 'auto',
        ...mono,
        fontSize: 13,
        color: 'var(--fg)',
        lineHeight: 1.55,
      }}
    >
      {children}
    </pre>
  )
}

function H2({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} style={{ fontSize: 22, fontWeight: 600, color: 'var(--fg)', margin: '28px 0 10px', letterSpacing: '-0.01em' }}>
      {children}
    </h2>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: '8px 0', color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.6 }}>{children}</p>
}

export default function Usage() {
  return (
    <DocsShell sidebar={DOCS_SIDEBAR} rail={<RightRail toc={TOC} />}>
      <h1 style={{ fontSize: 36, fontWeight: 650, letterSpacing: '-0.015em', margin: 0, color: 'var(--fg)' }}>
        Usage
      </h1>
      <P>
        Everything you need to start using <code style={mono}>veloce-ui</code> in a React 19+ app.
      </P>

      <H2 id="install">Install</H2>
      <P>
        Install the package. React and React DOM are peer dependencies.
      </P>
      <Pre>{`npm i veloce-ui
# peers (if not already)
npm i react react-dom`}</Pre>

      <H2 id="styles">Import styles</H2>
      <P>
        Import the stylesheet once at your app's entry (<code style={mono}>main.tsx</code>, <code style={mono}>_app.tsx</code>, or
        <code style={mono}>layout.tsx</code>). It's packaged in a CSS cascade layer so your own un-layered CSS always wins.
      </P>
      <Pre>{`import "veloce-ui/styles.css"`}</Pre>

      <H2 id="hello">Hello world</H2>
      <P>Button + Alert, no setup beyond those two lines.</P>
      <Pre>{`import { Button, Alert } from "veloce-ui"

export function Hello() {
  return (
    <div>
      <Alert tone="info" title="Welcome">Veloce UI is ready to use.</Alert>
      <Button>Get started</Button>
    </div>
  )
}`}</Pre>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 10 }}>
        <Alert tone="info" title="Welcome" style={{ flex: 1 }}>Veloce UI is ready to use.</Alert>
        <Button>Get started</Button>
      </div>

      <H2 id="customize">Customizing</H2>
      <P>Three ways to shape a component — pick the one that matches your intent.</P>
      <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr', marginTop: 6 }}>
        <div>
          <strong style={{ color: 'var(--fg)' }}>1. <code style={mono}>style</code> prop</strong>
          <P>One-off tweak. Inline styles always win.</P>
          <Pre>{`<Button style={{ borderRadius: 20 }}>Pill</Button>`}</Pre>
        </div>
        <div>
          <strong style={{ color: 'var(--fg)' }}>2. <code style={mono}>className</code> prop</strong>
          <P>Compose with your utility CSS or design system.</P>
          <Pre>{`<Button className="my-cta">Save</Button>`}</Pre>
        </div>
        <div>
          <strong style={{ color: 'var(--fg)' }}>3. Plain CSS</strong>
          <P>
            Veloce ships inside <code style={mono}>@layer veloce-ui</code>. Any un-layered CSS beats it without
            <code style={mono}> !important</code>.
          </P>
          <Pre>{`/* your app.css */
.vl-btn { font-weight: 600; }`}</Pre>
        </div>
      </div>

      <H2 id="tokens">Theming tokens</H2>
      <P>Redefine the OKLCH tokens in your <code style={mono}>:root</code> to rebrand globally.</P>
      <Pre>{`:root {
  --ac: oklch(0.72 0.17 220);  /* accent */
  --ac-h: oklch(0.65 0.17 220); /* accent hover */
  --bg: oklch(0.98 0 0);
  --fg: oklch(0.2 0 0);
  --line: oklch(0.9 0 0);
}`}</Pre>

      <H2 id="dark-mode">Dark mode</H2>
      <P>
        Toggle themes by setting <code style={mono}>data-theme</code> on <code style={mono}>&lt;html&gt;</code>. Veloce's
        token file includes <code style={mono}>[data-theme="light"]</code> and <code style={mono}>[data-theme="dark"]</code> blocks.
      </P>
      <Pre>{`document.documentElement.setAttribute("data-theme", "dark")`}</Pre>

      <H2 id="components">Components</H2>
      <P>Every primitive shipped in v0.1.</P>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 10,
        margin: '12px 0',
      }}>
        {COMPONENTS.map((c) => (
          <Link
            key={c.slug}
            to={`/components/${c.slug}`}
            style={{
              display: 'block',
              padding: '10px 12px',
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-md)',
              background: 'var(--bg-1)',
              color: 'var(--fg)',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {c.label}
          </Link>
        ))}
      </div>

      <H2 id="changelog">Changelog</H2>
      <ul style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.6, paddingLeft: 20 }}>
        <li><strong style={{ color: 'var(--fg)' }}>v0.1</strong> — 12 primitives: Button, Badge, Chip, Card, Avatar, Separator, Input, Textarea, Spinner, Skeleton, Alert, Dialog.</li>
        <li><strong style={{ color: 'var(--fg)' }}>v0.1.x</strong> — Form controls (Checkbox, Radio, Switch, Select, Slider, ToggleGroup, Tabs), feedback (Progress, EmptyState), navigation (Breadcrumbs, Pagination, Stepper, Accordion), and overlays (Tooltip, Popover, DropdownMenu).</li>
        <li><strong style={{ color: 'var(--fg)' }}>v0.2</strong> — Roadmap: Sheet, Toast, Command palette, Table, Data grid, Navbar, Sidebar, Charts.</li>
      </ul>
    </DocsShell>
  )
}
