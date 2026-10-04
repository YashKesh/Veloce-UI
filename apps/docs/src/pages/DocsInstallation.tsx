import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { DocsShell, RightRail } from '../components/DocsShell'
import type { TocItem } from '../components/DocsShell'
import { DOCS_SIDEBAR } from '../docsNav'
import { Seo } from '../Seo'

const mono: CSSProperties = { fontFamily: 'var(--font-mono)' }

const TOC: TocItem[] = [
  { label: 'Initialise', id: 'step-1', active: true },
  { label: 'Answer three questions', id: 'step-2' },
  { label: 'Add components', id: 'step-3' },
  { label: 'Use them', id: 'step-4' },
  { label: 'Migrating from shadcn', id: 'migrate' },
]

const FRAMEWORKS = ['Next.js', 'Vite', 'Remix', 'Astro', 'Manual'] as const
type Pm = 'pnpm' | 'npm' | 'bun'
const PM_CMDS: Record<Pm, { init: string; add: string }> = {
  pnpm: { init: 'pnpm dlx veloce@latest init', add: 'pnpm dlx veloce add button dialog command' },
  npm: { init: 'npx veloce@latest init', add: 'npx veloce add button dialog command' },
  bun: { init: 'bunx veloce@latest init', add: 'bunx veloce add button dialog command' },
}

function Code({ children }: { children: ReactNode }) {
  return <span style={{ ...mono, fontSize: 13, color: 'var(--fg)' }}>{children}</span>
}

function PmCodeBlock({ command }: { command: (pm: Pm) => string }) {
  const [pm, setPm] = useState<Pm>('pnpm')
  const [copied, setCopied] = useState(false)
  return (
    <div className="vl-code" style={{ borderRadius: 10 }}>
      <div style={{ display: 'flex', padding: '0 6px', borderBottom: '1px solid var(--line)' }}>
        {(['pnpm', 'npm', 'bun'] as Pm[]).map((p) => (
          <button
            key={p}
            onClick={() => setPm(p)}
            style={{
              padding: '8px 10px', ...mono, fontSize: 11.5,
              color: pm === p ? 'var(--fg)' : 'var(--fg-3)',
              borderBottom: pm === p ? '2px solid var(--ac)' : '2px solid transparent',
            }}
          >
            {p}
          </button>
        ))}
        <button
          aria-label="Copy command"
          onClick={() => {
            navigator.clipboard?.writeText(command(pm)).catch(() => {})
            setCopied(true)
            setTimeout(() => setCopied(false), 1200)
          }}
          style={{ marginLeft: 'auto', padding: '8px 10px', ...mono, fontSize: 11.5, color: 'var(--fg-3)' }}
        >
          {copied ? '✓' : '⧉'}
        </button>
      </div>
      <pre style={{ padding: '14px 16px', fontSize: 13, lineHeight: 1.6, color: 'var(--fg)', margin: 0 }}>
        <span className="p">$</span> {command(pm)}
      </pre>
    </div>
  )
}

function Step({
  badge, accent, title, children, last, id,
}: { badge: string; accent?: boolean; title: string; children: ReactNode; last?: boolean; id?: string }) {
  return (
    <div id={id} style={{ position: 'relative', padding: `0 0 ${last ? 0 : 28}px 32px`, display: 'flex', flexDirection: 'column', gap: 10, scrollMarginTop: 20 }}>
      <span
        style={{
          position: 'absolute', left: -15, top: 0, width: 28, height: 28, borderRadius: '50%',
          background: accent ? 'var(--ac)' : 'var(--bg)',
          color: accent ? 'var(--ac-fg)' : 'var(--fg)',
          border: accent ? 'none' : '1px solid var(--line-2)',
          display: 'grid', placeItems: 'center',
          ...(accent ? { fontSize: 12, fontWeight: 700 } : { ...mono, fontSize: 12, fontWeight: 600 }),
        }}
      >
        {badge}
      </span>
      <h2 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.015em', lineHeight: '28px' }}>{title}</h2>
      {children}
    </div>
  )
}

const HASH_FRAMEWORK: Record<string, (typeof FRAMEWORKS)[number]> = {
  '#frameworks': 'Next.js',
  '#frameworks-vite': 'Vite',
  '#frameworks-remix': 'Remix',
  '#frameworks-astro': 'Astro',
}

export default function DocsInstallation() {
  const [framework, setFramework] = useState<(typeof FRAMEWORKS)[number]>('Next.js')
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const fw = HASH_FRAMEWORK[hash]
    if (fw) {
      setFramework(fw)
    }
    const target = fw ? 'frameworks' : hash.slice(1)
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hash])

  return (
    <DocsShell sidebar={DOCS_SIDEBAR} rail={<RightRail toc={TOC} />}>
      <Seo
        title="Installation"
        description="Install veloce-ui from npm in a React 19 project. Zero config, SSR-safe, ships ESM + CJS + TypeScript types."
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* breadcrumb */}
        <div style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--fg-3)' }}>
          <span>Docs</span><span>›</span><span>Getting started</span><span>›</span>
          <span style={{ color: 'var(--fg-2)' }}>Installation</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h1 style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.03em' }}>Installation</h1>
          <p style={{ fontSize: 16, lineHeight: 1.55, color: 'var(--fg-2)' }}>
            Veloce copies components into your project — you own the code. The CLI wires tokens, fonts and the
            motion layer once; each component is one command after that.
          </p>
        </div>

        {/* framework tabs */}
        <div
          id="frameworks"
          style={{
            scrollMarginTop: 20,
            display: 'flex', padding: 3, borderRadius: 9, background: 'var(--bg-1)',
            border: '1px solid var(--line)', fontSize: 13, alignSelf: 'flex-start',
          }}
        >
          {FRAMEWORKS.map((f) => (
            <button
              key={f}
              onClick={() => setFramework(f)}
              style={{
                padding: '6px 14px', borderRadius: 6, fontSize: 13,
                background: framework === f ? 'var(--bg-3)' : 'transparent',
                color: framework === f ? 'var(--fg)' : 'var(--fg-2)',
                fontWeight: framework === f ? 500 : 400,
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* numbered timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--line)', marginLeft: 14 }}>
          <Step badge="1" title="Initialise" id="step-1">
            <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--fg-2)' }}>
              Creates <Code>veloce.json</Code>, installs Geist, and writes the token layer to{' '}
              <Code>app/globals.css</Code>.
            </p>
            <PmCodeBlock command={(pm) => PM_CMDS[pm].init} />
          </Step>

          <Step badge="2" title="Answer three questions" id="step-2">
            <div
              className="vl-code"
              style={{ borderRadius: 10, padding: '14px 16px', fontSize: 13, lineHeight: 1.75, color: 'var(--fg-2)' }}
            >
              <div><span style={{ color: 'var(--ac-text)' }}>?</span> Accent color › <span style={{ color: 'var(--fg)' }}>violet</span> <span style={{ color: 'var(--fg-3)' }}>(violet · lime · cyan · custom)</span></div>
              <div><span style={{ color: 'var(--ac-text)' }}>?</span> Default color scheme › <span style={{ color: 'var(--fg)' }}>system</span></div>
              <div><span style={{ color: 'var(--ac-text)' }}>?</span> Motion preset › <span style={{ color: 'var(--fg)' }}>standard</span> <span style={{ color: 'var(--fg-3)' }}>(standard · snappy · minimal)</span></div>
              <div style={{ color: 'var(--ok)', marginTop: 6 }}>✓ Wrote 4 files · tokens, fonts, motion layer, cn()</div>
            </div>
          </Step>

          <Step badge="3" title="Add components" id="step-3">
            <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--fg-2)' }}>
              Dependencies between components resolve automatically — adding <Code>command</Code> also brings{' '}
              <Code>dialog</Code> and <Code>input</Code>.
            </p>
            <PmCodeBlock command={(pm) => PM_CMDS[pm].add} />
          </Step>

          <Step badge="✓" accent title="Use them" last id="step-4">
            <pre
              className="vl-code"
              style={{ borderRadius: 10, padding: '14px 16px', fontSize: 13, lineHeight: 1.65, color: 'var(--fg-2)', margin: 0 }}
            >
              <span className="p">import</span> {'{ Button }'} <span className="p">from</span>{' '}
              <span className="s">"@/components/ui/button"</span>
              {'\n\n'}
              <span className="p">&lt;</span><span style={{ color: 'var(--fg)' }}>Button</span>{' '}
              <span className="p">variant=</span><span className="s">"soft"</span>{' '}
              <span className="p">size=</span><span className="s">"lg"</span><span className="p">&gt;</span>
              Deploy<span className="p">&lt;/</span><span style={{ color: 'var(--fg)' }}>Button</span><span className="p">&gt;</span>
            </pre>
          </Step>
        </div>

        {/* info callout */}
        <div
          id="migrate"
          style={{
            scrollMarginTop: 20,
            display: 'flex', gap: 14, padding: '16px 18px', borderRadius: 10,
            border: '1px solid var(--line)', background: 'var(--bg-1)',
            fontSize: 13.5, lineHeight: 1.55, color: 'var(--fg-2)',
          }}
        >
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--bg-3)', display: 'grid', placeItems: 'center', fontSize: 13, flexShrink: 0, color: 'var(--fg)' }}>i</div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--fg)' }}>Already on shadcn/ui?</div>
            Veloce components share the same file layout and{' '}
            <span style={{ ...mono, fontSize: 12.5, color: 'var(--fg)' }}>cn()</span> helper. Run{' '}
            <span style={{ ...mono, fontSize: 12.5, color: 'var(--fg)' }}>veloce migrate</span> to swap components
            one at a time and keep your overrides.
          </div>
        </div>

        {/* prev / next */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13.5 }}>
          <Link to="/" style={{ padding: '14px 16px', border: '1px solid var(--line)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 4, color: 'inherit' }}>
            <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>← Previous</span>
            <span style={{ fontWeight: 500, color: 'var(--fg)' }}>Introduction</span>
          </Link>
          <Link to="/docs/tokens" style={{ padding: '14px 16px', border: '1px solid var(--line)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'right', color: 'inherit' }}>
            <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>Next →</span>
            <span style={{ fontWeight: 500, color: 'var(--fg)' }}>Theming</span>
          </Link>
        </div>
      </div>
    </DocsShell>
  )
}
