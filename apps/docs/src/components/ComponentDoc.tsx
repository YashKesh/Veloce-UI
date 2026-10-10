import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { DocsShell, RightRail } from './DocsShell'
import type { TocItem } from './DocsShell'
import { DOCS_SIDEBAR, prevNext } from '../docsNav'
import { Seo } from '../Seo'

/** Slugs → the exported name(s) shipped by veloce-ui.
 * Any slug listed here renders the "Ships in veloce-ui@0.1" callout on its doc page. */
const SHIPPED_IN_UI: Record<string, string> = {
  button: 'Button',
  badge: 'Badge',
  chip: 'Chip',
  card: 'Card',
  avatar: 'Avatar',
  separator: 'Separator',
  input: 'Input',
  textarea: 'Textarea',
  spinner: 'Spinner',
  skeleton: 'Skeleton',
  alert: 'Alert',
  dialog: 'Dialog',
  checkbox: 'Checkbox',
  radio: 'Radio, RadioGroup',
  switch: 'Switch',
  select: 'Select',
  slider: 'Slider',
  'toggle-group': 'ToggleGroup',
  tabs: 'Tabs',
  progress: 'Progress',
  'empty-state': 'EmptyState',
  breadcrumbs: 'Breadcrumbs',
  pagination: 'Pagination',
  stepper: 'Stepper',
  accordion: 'Accordion',
  tooltip: 'Tooltip, TooltipProvider',
  popover: 'Popover',
  dropdown: 'DropdownMenu',
}

function ShipsCallout({ exportName }: { exportName: string }) {
  return (
    <div
      className="vl-callout"
      style={{
        background: 'color-mix(in oklch, var(--ac) 10%, transparent)',
        border: '1px solid color-mix(in oklch, var(--ac) 35%, transparent)',
        borderRadius: 'var(--r-md)',
        padding: '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        fontSize: 13.5,
      }}
    >
      <strong style={{ color: 'var(--fg)' }}>
        Ships in <code style={{ fontFamily: 'var(--font-mono)' }}>veloce-ui@0.1</code>
      </strong>
      <pre
        style={{
          margin: 0,
          padding: '6px 10px',
          background: 'var(--bg-1)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-sm)',
          fontFamily: 'var(--font-mono)',
          fontSize: 12.5,
          color: 'var(--fg)',
          overflow: 'auto',
        }}
      >{`import { ${exportName} } from "veloce-ui"`}</pre>
    </div>
  )
}

const TOC: TocItem[] = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
]

export function CodeBlock({ children }: { children: ReactNode }) {
  return (
    <pre
      className="vl-code"
      style={{ borderRadius: 10, padding: '14px 16px', fontSize: 13, lineHeight: 1.65, color: 'var(--fg-2)', margin: 0, overflowX: 'auto' }}
    >
      {children}
    </pre>
  )
}

export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <div id={id} style={{ display: 'flex', flexDirection: 'column', gap: 12, scrollMarginTop: 20 }}>
      <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>{title}</h2>
      {children}
    </div>
  )
}

export function ComponentDoc({
  slug, name, description, preview, usage, toc, children,
}: {
  slug: string
  name: string
  description: string
  /** rendered inside the dotted preview stage */
  preview: ReactNode
  /** code sample shown under Usage */
  usage: ReactNode
  toc?: TocItem[]
  /** extra sections after Usage */
  children?: ReactNode
}) {
  const { prev, next } = prevNext(slug)
  const shipped = SHIPPED_IN_UI[slug]
  return (
    <DocsShell sidebar={DOCS_SIDEBAR} rail={<RightRail toc={toc ?? TOC} />}>
      <Seo title={name} description={description} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--fg-3)' }}>
          <Link to="/components" style={{ color: 'inherit' }}>Components</Link>
          <span>›</span>
          <span style={{ color: 'var(--fg-2)' }}>{name}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h1 style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.03em' }}>{name}</h1>
          <p style={{ fontSize: 16, lineHeight: 1.55, color: 'var(--fg-2)' }}>{description}</p>
        </div>

        {shipped && <ShipsCallout exportName={shipped} />}

        <section id="preview" style={{ scrollMarginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Live example</h2>
          <div
            className="vl-stage"
            style={{
              borderRadius: 12, border: '1px solid var(--line)',
              minHeight: 260, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 40, flexWrap: 'wrap', gap: 20,
            }}
          >
            {preview}
          </div>
        </section>

        <Section id="install" title="Installation">
          <CodeBlock>
            <span className="p">import</span> {`{ ${shipped ?? name} }`} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          </CodeBlock>
        </Section>

        <Section id="usage" title="Usage">
          <CodeBlock>{usage}</CodeBlock>
        </Section>

        {children}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13.5 }}>
          {prev ? (
            <Link to={`/components/${prev.slug}`} style={{ padding: '14px 16px', border: '1px solid var(--line)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 4, color: 'inherit' }}>
              <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>← Previous</span>
              <span style={{ fontWeight: 500, color: 'var(--fg)' }}>{prev.label}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`/components/${next.slug}`} style={{ padding: '14px 16px', border: '1px solid var(--line)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'right', color: 'inherit' }}>
              <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>Next →</span>
              <span style={{ fontWeight: 500, color: 'var(--fg)' }}>{next.label}</span>
            </Link>
          ) : <span />}
        </div>
      </div>
    </DocsShell>
  )
}
