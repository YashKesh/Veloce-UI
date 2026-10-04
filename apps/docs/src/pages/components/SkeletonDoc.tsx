import { useState } from 'react'
import { ComponentDoc, Section, CodeBlock } from '../../components/ComponentDoc'

const AV_HUES = ['oklch(0.55 0.12 292)', 'oklch(0.6 0.12 200)']

function CardSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <span className="vl-skeleton" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="vl-skeleton" style={{ height: 12, borderRadius: 4, width: '46%' }} />
          <span className="vl-skeleton" style={{ height: 10, borderRadius: 4, width: '68%' }} />
        </div>
      </div>
      <span className="vl-skeleton" style={{ height: 96, borderRadius: 9 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span className="vl-skeleton" style={{ height: 10, borderRadius: 4, width: '92%' }} />
        <span className="vl-skeleton" style={{ height: 10, borderRadius: 4, width: '84%' }} />
        <span className="vl-skeleton" style={{ height: 10, borderRadius: 4, width: '58%' }} />
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <span className="vl-skeleton" style={{ height: 32, width: 96, borderRadius: 8 }} />
        <span className="vl-skeleton" style={{ height: 32, width: 72, borderRadius: 8 }} />
      </div>
    </div>
  )
}

function CardLoaded() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <span style={{ width: 40, height: 40, borderRadius: '50%', background: AV_HUES[0], color: 'oklch(0.98 0 0)', display: 'inline-grid', placeItems: 'center', fontWeight: 600, fontSize: 14, flexShrink: 0 }}>MK</span>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600 }}>Mara Kim</span>
          <span style={{ fontSize: 12.5, color: 'var(--fg-3)' }}>Shipped v1.0.4 · 2m ago</span>
        </div>
      </div>
      <div style={{ height: 96, borderRadius: 9, background: 'var(--bg-3)', display: 'grid', placeItems: 'center', fontSize: 12, color: 'var(--fg-3)' }}>
        deploy-preview.png
      </div>
      <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--fg-2)', margin: 0 }}>
        Hotfix for the dialog focus trap — restores focus to the trigger after Escape. Rolled out to 14 regions.
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <span className="vl-btn vl-btn--sm vl-btn--solid">View deploy</span>
        <span className="vl-btn vl-btn--sm vl-btn--outline">Logs</span>
      </div>
    </div>
  )
}

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Shapes', id: 'shapes' },
]

export default function SkeletonDoc() {
  const [loaded, setLoaded] = useState(false)

  const preview = (
    <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="vl-label">shimmer 1.6s linear · crossfade 200ms · static under reduced motion</span>
        <button className="vl-btn vl-btn--sm vl-btn--outline" onClick={() => setLoaded((l) => !l)}>
          {loaded ? 'Show skeleton' : 'Load content'}
        </button>
      </div>
      <div className="vl-card" style={{ padding: '20px 22px', background: 'var(--bg-1)' }}>
        {loaded ? <CardLoaded /> : <CardSkeleton />}
      </div>
    </div>
  )

  const usage = (
    <>
      <span className="p">import</span> {'{'} Skeleton {'}'} <span className="p">from</span> <span className="s">"veloce-ui"</span>{'\n'}
      {'\n'}
      {'{'}isLoading <span className="p">?</span> (<span className="p">{'\n'}</span>
      {'  '}<span className="p">{'<'}</span>Skeleton className=<span className="s">"h-10 w-10 rounded-full"</span> <span className="p">{'/>'}</span>{'\n'}
      ) <span className="p">:</span> ({'\n'}
      {'  '}<span className="p">{'<'}</span>Avatar user=<span className="p">{'{'}</span>user<span className="p">{'}'}</span> <span className="p">{'/>'}</span>{'\n'}
      ){'}'}
    </>
  )

  return (
    <ComponentDoc
      slug="skeleton"
      name="Skeleton"
      description="Shimmering placeholders that mirror the layout of incoming content, then crossfade out in 200ms once data arrives. Rendered static under prefers-reduced-motion."
      preview={preview}
      usage={usage}
      toc={TOC}
    >
      <Section id="shapes" title="Shapes">
        <div className="vl-stage--sm" style={{ border: '1px solid var(--line)', borderRadius: 12, padding: 28, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20 }}>
          <span className="vl-skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }} />
          <span className="vl-skeleton" style={{ width: 160, height: 12, borderRadius: 4 }} />
          <span className="vl-skeleton" style={{ width: 96, height: 32, borderRadius: 8 }} />
          <span className="vl-skeleton" style={{ width: 140, height: 88, borderRadius: 9 }} />
          <span className="vl-label">circle · line · button · media</span>
        </div>
        <CodeBlock>
          <span className="p">{'<'}</span>Skeleton shape=<span className="s">"circle"</span> size=<span className="p">{'{'}</span>40<span className="p">{'}'}</span> <span className="p">{'/>'}</span>{'\n'}
          <span className="p">{'<'}</span>Skeleton shape=<span className="s">"line"</span> width=<span className="s">"46%"</span> <span className="p">{'/>'}</span>{'\n'}
          <span className="p">{'<'}</span>Skeleton shape=<span className="s">"rect"</span> height=<span className="p">{'{'}</span>96<span className="p">{'}'}</span> radius=<span className="p">{'{'}</span>9<span className="p">{'}'}</span> <span className="p">{'/>'}</span>
        </CodeBlock>
      </Section>
    </ComponentDoc>
  )
}
