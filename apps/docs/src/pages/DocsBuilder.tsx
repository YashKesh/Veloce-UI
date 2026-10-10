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
  { label: 'Launch the builder', id: 'launch' },
  { label: 'Palette', id: 'palette' },
  { label: 'Canvas & rows', id: 'canvas' },
  { label: 'Inspector', id: 'inspector' },
  { label: 'Code export', id: 'export' },
  { label: 'Extending the palette', id: 'extend' },
]

function Code({ children }: { children: string }) {
  return <CodeBlock lang="tsx" code={children} />
}

function H2({ children, id }: { children: React.ReactNode; id: string }) {
  return <h2 id={id} style={{ margin: '0 0 10px', fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', scrollMarginTop: 20 }}>{children}</h2>
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: '0 0 14px', fontSize: 14.5, lineHeight: 1.6, color: 'var(--fg-2)' }}>{children}</p>
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 20, padding: '12px 0', borderTop: '1px solid var(--line)' }}>
      <div style={{ ...mono, fontSize: 12.5, color: 'var(--ac-text)' }}>{label}</div>
      <div style={{ fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.55 }}>{children}</div>
    </div>
  )
}

export default function DocsBuilder() {
  return (
    <DocsShell sidebar={DOCS_SIDEBAR} rail={<RightRail toc={TOC} />}>
      <Seo
        title="Dashboard builder"
        description="Visual drag-and-drop dashboard assembler built on veloce-ui primitives. Pick components from the palette, arrange them in a 12-column grid, edit props live, export working JSX."
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 820 }}>
        <div>
          <div style={{ ...mono, fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tool</div>
          <h1 style={{ margin: '6px 0 10px', fontSize: 36, fontWeight: 600, letterSpacing: '-0.025em' }}>Dashboard builder</h1>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: 'var(--fg-2)' }}>
            A visual canvas for composing dashboards from the veloce-ui primitives you already know. Drag a chart, a stat
            card, a table — arrange them in a 12-column grid, edit their props on the right, then copy the generated JSX
            and drop it into your app.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <Link to="/builder"><Button variant="primary">Open the builder →</Button></Link>
            <Link to="/dashboards"><Button variant="ghost">Browse pre-built blueprints</Button></Link>
          </div>
        </div>

        <section>
          <H2 id="what">What it is</H2>
          <P>
            The builder lives at <code style={mono}>/builder</code>. It's a three-pane editor — <strong>Palette</strong> on
            the left, <strong>Canvas</strong> in the middle, <strong>Inspector</strong> on the right. Everything you drop
            renders using real veloce-ui components, so the preview is pixel-identical to what you'll ship.
          </P>
          <P>
            There is no runtime dependency: the output of the builder is plain React + <code style={mono}>veloce-ui</code>
            imports. You can delete the builder and keep the dashboard.
          </P>
        </section>

        <section>
          <H2 id="launch">Launch the builder</H2>
          <P>Visit <Link to="/builder" style={{ color: 'var(--ac-text)' }}>/builder</Link> on this site to try it, or embed it in your own app — the builder ships as a packaged component:</P>
          <Code>{`import { DashboardBuilder } from 'veloce-ui'

export default function AdminBuilder() {
  return <DashboardBuilder style={{ minHeight: 600 }} />
}`}</Code>
          <P>Common props:</P>
          <div style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '4px 16px', background: 'var(--bg-1)' }}>
            <Row label="initialRows"><code style={mono}>DashboardBuilderRow[]</code> — seed the canvas with your own layout. Omit to use the default demo.</Row>
            <Row label="onChange"><code style={mono}>(rows) =&gt; void</code> — fires on every edit, re-order, add or delete. Persist this to localStorage or your database.</Row>
            <Row label="hideToolbar"><code style={mono}>boolean</code> — remove the top toolbar when embedding inside your own chrome.</Row>
          </div>
        </section>

        <section>
          <H2 id="palette">Palette (23 widgets)</H2>
          <P>Widgets are grouped by category. Drag any card from the palette onto the canvas.</P>
          <div style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '4px 16px', background: 'var(--bg-1)' }}>
            <Row label="Metric">Stat card (label + value + delta)</Row>
            <Row label="Chart">Area, Line, Bar, Pie, Gauge, Sparkline</Row>
            <Row label="Data">Progress, Badge, Avatar, Button, Table, Card</Row>
            <Row label="Form">Input, Textarea, Select, Checkbox, Switch, Slider</Row>
            <Row label="Layout">Heading, Text, Divider, Spacer</Row>
          </div>
          <P>Every widget uses the same import path your app uses: <code style={mono}>import {`{ AreaChart }`} from 'veloce-ui'</code>. The builder is just a convenience wrapper.</P>
        </section>

        <section>
          <H2 id="canvas">Canvas, sections &amp; re-ordering</H2>
          <P>
            The canvas is a stack of <strong>sections</strong> (rows). Each section is a 12-column CSS grid. Every widget has a
            <code style={mono}> span </code> prop (1–12) that controls how many columns it occupies.
          </P>
          <P>Three drag targets:</P>
          <div style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '4px 16px', background: 'var(--bg-1)' }}>
            <Row label="Empty row space">Drop a palette item here to <strong>add</strong> it; drop an existing widget to <strong>move</strong> it to the end.</Row>
            <Row label="On another widget">Drop here to insert <strong>before</strong> the target. Works for re-order within a row and across rows.</Row>
            <Row label="&quot;+ Drop here&quot; strip">Creates a new section (row) at the bottom of the canvas.</Row>
          </div>
          <P>
            Section headers are editable — click the "<strong>＋ add section title</strong>" button or an existing title to rename.
            Use "Remove row" to delete a whole section.
          </P>
          <P>Click any widget to select it (shows an accent ring + a <strong>×</strong> delete button).</P>
        </section>

        <section>
          <H2 id="inspector">Inspector</H2>
          <P>
            The right pane edits the selected widget's props live. Every change is reflected in the canvas <em>and</em>
            the exported code immediately. Common controls:
          </P>
          <div style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '4px 16px', background: 'var(--bg-1)' }}>
            <Row label="Column span">A 1–12 slider — every widget</Row>
            <Row label="Text props">label, value, delta, heading text, button label</Row>
            <Row label="Size props">chart height, gauge/pie size, sparkline height</Row>
            <Row label="Tone / variant">badge tone, button variant, delta direction</Row>
          </div>
        </section>

        <section>
          <H2 id="export">Code export</H2>
          <P>
            Click <strong>{'{ } View code'}</strong> in the toolbar — a <strong>side panel</strong> slides in from the right with
            the generated JSX. The output is a complete, standalone React component. You can paste it into any
            Vite / Next.js / Remix / Astro project that already has <code style={mono}>veloce-ui</code> installed.
          </P>
          <Code>{`import {
  AreaChart, LineChart, BarChart, PieChart, GaugeChart, SparklineChart,
  Progress, Badge, Avatar, Button, Table,
} from 'veloce-ui'

const data = [{ label: 'Jan', value: 40 }, …]

export default function Dashboard() {
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 12 }}>
        <div style={{ gridColumn: 'span 3' }}>
          <div style={{ padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg-1)' }}>
            <div style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase' }}>Revenue</div>
            <div style={{ fontSize: 24, fontWeight: 600 }}>$142k</div>
          </div>
        </div>
        {/* …more widgets… */}
      </div>
    </div>
  )
}`}</Code>
          <P>
            The <code style={mono}>Copy</code> button beside <strong>Generated JSX</strong> puts the code on your clipboard.
          </P>
        </section>

        <section>
          <H2 id="extend">Extending the palette</H2>
          <P>
            The builder source lives at <code style={mono}>packages/ui/src/components/DashboardBuilder.tsx</code>. Fork or
            vendor it to add your own widget — four edits:
          </P>
          <div style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '4px 16px', background: 'var(--bg-1)' }}>
            <Row label="1. PALETTE">
              Add a <code style={mono}>PaletteItem</code> entry with <code style={mono}>kind</code>, <code style={mono}>label</code>, <code style={mono}>category</code> and sensible <code style={mono}>defaults</code>.
            </Row>
            <Row label="2. RenderWidget">Add a <code style={mono}>case</code> to the switch that returns the actual component with props from <code style={mono}>w.props</code>.</Row>
            <Row label="3. widgetToJsx">Return a stringified JSX fragment so the <strong>View code</strong> exporter knows how to serialize it.</Row>
            <Row label="4. (optional) renderPropEditors">Add inspector inputs for the widget's editable props.</Row>
          </div>
          <P>
            Treat it as a starting point, not a black box.
          </P>
        </section>
      </div>
    </DocsShell>
  )
}
