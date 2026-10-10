import { Badge } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Variants', id: 'variants' },
]

export default function BadgeDoc() {
  return (
    <ComponentDoc
      slug="badge"
      name="Badge"
      description="A small status label. Static — no motion by design: badges are read at a glance and should never pulse, shimmer, or animate in."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            <Badge tone="accent">Beta</Badge>
            <Badge tone="ok">Live</Badge>
            <Badge tone="err">Failed</Badge>
            <Badge tone="warn">Preview</Badge>
            <Badge variant="outline">Draft</Badge>
            <Badge tone="neutral">v1.0</Badge>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            <Badge tone="ok" variant="soft">Operational</Badge>
            <Badge tone="warn" variant="soft">Degraded</Badge>
            <Badge tone="err" variant="soft">Down</Badge>
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Badge }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Badge <span className="p">tone=</span><span className="s">"ok"</span><span className="p">&gt;</span>Live<span className="p">&lt;/</span>Badge<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;</span>Badge <span className="p">tone=</span><span className="s">"accent"</span> <span className="p">variant=</span><span className="s">"soft"</span><span className="p">&gt;</span>Beta<span className="p">&lt;/</span>Badge<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="variants" title="Variants">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: 'repeat(5, auto)', gap: '20px 24px', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
          <span>tone →</span>
          <span>neutral</span><span>accent</span><span>ok</span><span>warn</span>
          <span>solid</span>
          <Badge tone="neutral" variant="solid">Draft</Badge>
          <Badge tone="accent" variant="solid">Beta</Badge>
          <Badge tone="ok" variant="solid">Live</Badge>
          <Badge tone="warn" variant="solid">Soon</Badge>
          <span>soft</span>
          <Badge tone="neutral" variant="soft">Draft</Badge>
          <Badge tone="accent" variant="soft">Beta</Badge>
          <Badge tone="ok" variant="soft">Live</Badge>
          <Badge tone="warn" variant="soft">Soon</Badge>
          <span>outline</span>
          <Badge tone="neutral" variant="outline">Draft</Badge>
          <Badge tone="accent" variant="outline">Beta</Badge>
          <Badge tone="ok" variant="outline">Live</Badge>
          <Badge tone="warn" variant="outline">Soon</Badge>
        </div>
      </Section>
    </ComponentDoc>
  )
}
