import { useState, type CSSProperties, type ReactNode } from 'react'
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
  'color-picker': 'ColorPicker',
  'color-input': 'ColorInput',
  'color-swatch': 'ColorSwatch',
  'contrast-checker': 'ContrastChecker',
  'gradient-builder': 'GradientBuilder',
  'shadow-builder': 'ShadowBuilder',
  'linked-list': 'LinkedList',
  'dsa-stack': 'DsaStack',
  'queue': 'Queue',
  'binary-tree': 'BinaryTree',
  'graph': 'Graph',
  'heap': 'Heap',
  'trie': 'Trie',
  'hash-map': 'HashMap',
  'disjoint-set': 'DisjointSet',
  'avl-tree': 'AVLTree',
  'segment-tree': 'SegmentTree',
  'sorting-visualizer': 'SortingVisualizer',
  'dijkstra-visualizer': 'DijkstraVisualizer',
  'dp-table': 'DPTable',
  'astar-visualizer': 'AStarVisualizer',
  'mst-visualizer': 'MSTVisualizer',
  'topological-sort-visualizer': 'TopologicalSortVisualizer',
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

export function CodeBlock({ children, downloadAs }: { children: ReactNode; downloadAs?: string }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 2, display: 'flex', gap: 6 }}>
        {downloadAs && <DownloadButton filename={downloadAs} />}
        <CopyButton />
      </div>
      <pre
        className="vl-code"
        style={{
          borderRadius: 10,
          padding: `14px ${downloadAs ? 120 : 72}px 14px 16px`,
          fontSize: 13,
          lineHeight: 1.65,
          color: 'var(--fg-2)',
          margin: 0,
          overflowX: 'auto',
        }}
      >
        {children}
      </pre>
    </div>
  )
}

const toolbarBtn = (active: boolean): CSSProperties => ({
  padding: '4px 10px',
  fontSize: 11.5,
  borderRadius: 6,
  border: '1px solid var(--line-2)',
  background: active ? 'color-mix(in oklch, var(--ok) 15%, var(--bg-1))' : 'var(--bg-1)',
  color: active ? 'var(--ok)' : 'var(--fg-2)',
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'background 150ms, color 150ms',
})

function readPreText(el: HTMLElement | null): string {
  const pre = el?.closest('div')?.querySelector('pre')
  return pre?.innerText ?? ''
}

function CopyButton() {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={(e) => {
        const text = readPreText(e.currentTarget)
        if (!text) return
        navigator.clipboard.writeText(text).then(
          () => {
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1400)
          },
          () => {},
        )
      }}
      aria-label={copied ? 'Copied' : 'Copy code'}
      style={toolbarBtn(copied)}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

function DownloadButton({ filename }: { filename: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      onClick={(e) => {
        const text = readPreText(e.currentTarget)
        if (!text) return
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        setDone(true)
        window.setTimeout(() => setDone(false), 1400)
      }}
      aria-label={`Download ${filename}`}
      style={toolbarBtn(done)}
    >
      {done ? '✓ Saved' : `↓ ${filename}`}
    </button>
  )
}

function StarterKitButton({ componentName, slug }: { componentName: string; slug: string }) {
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const onClick = async () => {
    if (busy) return
    setBusy(true)
    try {
      // Pull the Usage code out of the DOM at click time (keeps us format-agnostic).
      const section = document.getElementById('usage')
      const pre = section?.querySelector('pre')
      const usage = pre?.innerText ?? `<${componentName} />`

      // Dynamic import — jszip is only loaded when the user actually clicks.
      const { default: JSZip } = await import('jszip')
      const zip = new JSZip()

      zip.file(
        'App.tsx',
        `${usage.includes("import 'veloce-ui/styles.css'") ? '' : `import 'veloce-ui/styles.css'\n`}${usage}\n`,
      )
      zip.file(
        'package.json',
        JSON.stringify(
          {
            name: `veloce-ui-${slug}-starter`,
            private: true,
            version: '0.0.0',
            type: 'module',
            scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
            dependencies: {
              react: '^19.0.0',
              'react-dom': '^19.0.0',
              'veloce-ui': 'latest',
            },
            devDependencies: {
              '@vitejs/plugin-react': '^4.0.0',
              typescript: '^5.0.0',
              vite: '^6.0.0',
            },
          },
          null,
          2,
        ),
      )
      zip.file(
        'README.md',
        `# ${componentName} starter\n\nQuick-start project for the \`${componentName}\` component from [veloce-ui](https://www.npmjs.com/package/veloce-ui).\n\n## Run it\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\nOpen \`App.tsx\` to see the live sample. Full docs:\nhttps://veloceui.codeloomdevv.co.in/components/${slug}\n`,
      )

      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${slug}-starter.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setDone(true)
      window.setTimeout(() => setDone(false), 1800)
    } finally {
      setBusy(false)
    }
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      style={{
        padding: '6px 12px',
        fontSize: 12,
        borderRadius: 6,
        border: '1px solid var(--line-2)',
        background: done ? 'color-mix(in oklch, var(--ok) 15%, var(--bg-1))' : 'var(--bg-1)',
        color: done ? 'var(--ok)' : 'var(--fg-2)',
        cursor: busy ? 'wait' : 'pointer',
        fontFamily: 'inherit',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {done ? '✓ Downloaded' : busy ? 'Packing…' : '↓ Download starter kit (.zip)'}
    </button>
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: -8 }}>
            <StarterKitButton componentName={shipped ?? name} slug={slug} />
          </div>
          <CodeBlock downloadAs={`${slug}-example.tsx`}>{usage}</CodeBlock>
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
