import { useState } from 'react'
import { Skeleton, Avatar, Button } from 'veloce-ui'
import { ComponentDoc, Section, CodeBlock } from '../../components/ComponentDoc'

function CardSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <Skeleton variant="circle" width={40} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Skeleton height={12} radius={4} width="46%" />
          <Skeleton height={10} radius={4} width="68%" />
        </div>
      </div>
      <Skeleton height={96} radius={9} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Skeleton height={10} radius={4} width="92%" />
        <Skeleton height={10} radius={4} width="84%" />
        <Skeleton height={10} radius={4} width="58%" />
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <Skeleton height={32} width={96} radius={8} />
        <Skeleton height={32} width={72} radius={8} />
      </div>
    </div>
  )
}

function CardLoaded() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <Avatar name="Mara Kim" size={40} />
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
        <Button size="sm" variant="primary">View deploy</Button>
        <Button size="sm" variant="outline">Logs</Button>
      </div>
    </div>
  )
}

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
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
        <Button size="sm" variant="outline" onClick={() => setLoaded((l) => !l)}>
          {loaded ? 'Show skeleton' : 'Load content'}
        </Button>
      </div>
      <div className="vl-card" style={{ padding: '20px 22px', background: 'var(--bg-1)', border: '1px solid var(--line)', borderRadius: 12 }}>
        {loaded ? <CardLoaded /> : <CardSkeleton />}
      </div>
    </div>
  )

  const usage = (
    <>
      <span className="p">import</span> {'{'} Skeleton {'}'} <span className="p">from</span> <span className="s">"veloce-ui"</span>{'\n'}
      {'\n'}
      {'{'}isLoading <span className="p">?</span> ({'\n'}
      {'  '}<span className="p">{'<'}</span>Skeleton variant=<span className="s">"circle"</span> width=<span className="p">{'{'}</span>40<span className="p">{'}'}</span> <span className="p">{'/>'}</span>{'\n'}
      ) <span className="p">:</span> ({'\n'}
      {'  '}<span className="p">{'<'}</span>Avatar name=<span className="s">"Mara Kim"</span> <span className="p">{'/>'}</span>{'\n'}
      ){'}'}
    </>
  )

  return (
    <ComponentDoc
      slug="skeleton"
      name="Skeleton"
      description="Shimmering placeholders that mirror the layout of incoming content. Static under prefers-reduced-motion."
      preview={preview}
      usage={usage}
      toc={TOC}
    >
      <Section id="shapes" title="Shapes">
        <div className="vl-stage--sm" style={{ border: '1px solid var(--line)', borderRadius: 12, padding: 28, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20 }}>
          <Skeleton variant="circle" width={40} />
          <Skeleton variant="text" width={160} />
          <Skeleton height={32} width={96} radius={8} />
          <Skeleton height={88} width={140} radius={9} />
          <span className="vl-label">circle · text · button · media</span>
        </div>
        <CodeBlock>
          <span className="p">{'<'}</span>Skeleton variant=<span className="s">"circle"</span> width=<span className="p">{'{'}</span>40<span className="p">{'}'}</span> <span className="p">{'/>'}</span>{'\n'}
          <span className="p">{'<'}</span>Skeleton variant=<span className="s">"text"</span> width=<span className="s">"46%"</span> <span className="p">{'/>'}</span>{'\n'}
          <span className="p">{'<'}</span>Skeleton height=<span className="p">{'{'}</span>96<span className="p">{'}'}</span> radius=<span className="p">{'{'}</span>9<span className="p">{'}'}</span> <span className="p">{'/>'}</span>
        </CodeBlock>
      </Section>
    </ComponentDoc>
  )
}
