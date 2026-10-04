import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'

import { ComponentDoc, Section, CodeBlock } from '../../components/ComponentDoc'

const mono: CSSProperties = { fontFamily: 'var(--font-mono)' }

function Bar({ value }: { value: number }) {
  return (
    <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-3)' }}>
      <div style={{ height: 6, borderRadius: 3, background: 'var(--ac)', width: `${value}%`, transition: 'width 250ms var(--ease-settle, ease-out)' }} />
    </div>
  )
}

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Indeterminate', id: 'indeterminate' },
]

export default function ProgressDoc() {
  const [value, setValue] = useState(72)

  useEffect(() => {
    const t = setInterval(() => setValue((v) => (v >= 96 ? 12 : v + 7)), 900)
    return () => clearInterval(t)
  }, [])

  const preview = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, width: '100%', maxWidth: 480 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
          <span style={{ color: 'var(--fg-2)' }}>Uploading source maps</span>
          <span style={{ ...mono, fontVariantNumeric: 'tabular-nums', color: 'var(--fg-3)' }}>{value}%</span>
        </div>
        <Bar value={value} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: `conic-gradient(var(--ac) 0 ${value}%, var(--bg-3) 0)`, display: 'grid', placeItems: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bg-1)', display: 'grid', placeItems: 'center', ...mono, fontSize: 11, color: 'var(--fg-2)' }}>{value}%</div>
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} style={{ width: 28, height: 6, borderRadius: 3, background: value >= (i + 1) * (100 / 6) ? 'var(--ac)' : 'var(--bg-3)' }} />
          ))}
        </div>
        <span className="vl-label" style={{ marginLeft: 'auto' }}>circular · segmented</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <span className="vl-spinner" style={{ width: 14, height: 14, color: 'var(--fg-2)' }} />
        <span className="vl-spinner" style={{ width: 20, height: 20, color: 'var(--fg-2)' }} />
        <span className="vl-spinner" style={{ width: 28, height: 28, color: 'var(--ac)', borderWidth: 2.5 }} />
        <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--fg-2)', animation: `vl-dots 1.2s ${i * 0.2}s infinite` }} />
          ))}
        </span>
        <span className="vl-label" style={{ marginLeft: 'auto' }}>spinner 14 · 20 · 28 · dots</span>
      </div>
    </div>
  )

  const usage = (
    <>
      <span className="p">import</span> {'{'} Progress {'}'} <span className="p">from</span> <span className="s">"veloce-ui"</span>{'\n'}
      {'\n'}
      <span className="p">{'<'}</span>Progress value=<span className="p">{'{'}</span>72<span className="p">{'}'}</span> label=<span className="s">"Uploading source maps"</span> <span className="p">{'/>'}</span>{'\n'}
      <span className="p">{'<'}</span>Progress variant=<span className="s">"circular"</span> value=<span className="p">{'{'}</span>72<span className="p">{'}'}</span> size=<span className="p">{'{'}</span>56<span className="p">{'}'}</span> <span className="p">{'/>'}</span>{'\n'}
      <span className="p">{'<'}</span>Progress variant=<span className="s">"segmented"</span> segments=<span className="p">{'{'}</span>6<span className="p">{'}'}</span> value=<span className="p">{'{'}</span>72<span className="p">{'}'}</span> <span className="p">{'/>'}</span>
    </>
  )

  return (
    <ComponentDoc
      slug="progress"
      name="Progress"
      description="Determinate bars, circular rings, and segmented meters for known work — plus spinners and an indeterminate mode when duration is unknown. Width settles over 250ms."
      preview={preview}
      usage={usage}
      toc={TOC}
    >
      <Section id="indeterminate" title="Indeterminate">
        <div className="vl-stage--sm" style={{ border: '1px solid var(--line)', borderRadius: 12, padding: 28, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 12.5, color: 'var(--fg-2)' }}>Waiting for build agent…</span>
          <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-3)', position: 'relative', overflow: 'hidden', maxWidth: 420 }}>
            <div style={{ position: 'absolute', top: 0, height: 6, borderRadius: 3, background: 'var(--ac)', animation: 'vl-indet 1.4s cubic-bezier(.4,0,.2,1) infinite' }} />
          </div>
        </div>
        <CodeBlock>
          <span className="p">{'<'}</span>Progress indeterminate label=<span className="s">"Waiting for build agent…"</span> <span className="p">{'/>'}</span>
        </CodeBlock>
      </Section>
    </ComponentDoc>
  )
}
