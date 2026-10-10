import { Card } from 'veloce-ui'
import { Link } from 'react-router-dom'
import { ComponentDoc, Section, CodeBlock } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Variants', id: 'variants' },
]

function DemoCard({
  title, meta, gradient, footer, elevated,
}: { title: string; meta: string; gradient: string; footer?: string; elevated?: boolean }) {
  return (
    <Card
      elevated={elevated}
      style={{ width: 210, overflow: 'hidden', cursor: 'pointer', padding: 0 }}
    >
      <div style={{ height: 62, background: gradient }} />
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fg)' }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>{meta}</div>
      </div>
      {footer && (
        <div style={{ padding: '9px 14px', borderTop: '1px solid var(--line)', fontSize: 12, color: 'var(--ac-text)', fontWeight: 500 }}>
          {footer}
        </div>
      )}
    </Card>
  )
}

export default function CardDoc() {
  return (
    <ComponentDoc
      slug="card"
      name="Card"
      description="A surface for grouped content. Padded container with border + optional elevation."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <DemoCard
            title="Edge Functions"
            meta="Deploy in 14 regions"
            gradient="linear-gradient(135deg,var(--ac-soft),var(--bg-3))"
            footer="View docs →"
            elevated
          />
          <DemoCard
            title="Analytics"
            meta="Realtime, privacy-first"
            gradient="linear-gradient(135deg,var(--bg-3),var(--ac-soft))"
            footer="Enable →"
          />
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Card }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Card <span className="p">elevated</span><span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>h3<span className="p">&gt;</span>Edge Functions<span className="p">&lt;/</span>h3<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>p<span className="p">&gt;</span>Deploy in 14 regions.<span className="p">&lt;/</span>p<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;/</span>Card<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="variants" title="Variants">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Card padding="sm" style={{ minHeight: 80 }}>Small padding</Card>
            padding="sm"
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Card padding="md" style={{ minHeight: 80 }}>Medium padding</Card>
            padding="md"
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Card padding="md" elevated style={{ minHeight: 80 }}>Elevated card</Card>
            elevated
          </div>
        </div>
      </Section>
      <Section id="customization" title="Customization">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card style={{ ['--vl-card-bg' as string]: 'color-mix(in oklch, var(--ok) 10%, var(--bg-1))', ['--vl-card-border' as string]: 'color-mix(in oklch, var(--ok) 40%, transparent)', ['--vl-card-radius' as string]: '16px', maxWidth: 420 }}>
            Branded card — bg + border + radius via tokens.
          </Card>
          <CodeBlock>
            <span className="p">&lt;</span>Card{'\n'}
            {'  '}<span className="p">style=</span>{'{{'}{'\n'}
            {'    '}<span className="s">'--vl-card-bg'</span>: <span className="s">'color-mix(in oklch, var(--ok) 10%, var(--bg-1))'</span>,{'\n'}
            {'    '}<span className="s">'--vl-card-border'</span>: <span className="s">'color-mix(in oklch, var(--ok) 40%, transparent)'</span>,{'\n'}
            {'    '}<span className="s">'--vl-card-radius'</span>: <span className="s">'16px'</span>,{'\n'}
            {'  '}{'}}'}{'\n'}
            <span className="p">&gt;</span>...<span className="p">&lt;/</span>Card<span className="p">&gt;</span>
          </CodeBlock>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-3)' }}>
            Tokens: <code>--vl-card-bg</code>, <code>-border</code>, <code>-radius</code>, <code>-shadow</code>, <code>-color</code>. Full table at <Link to="/docs/customization" style={{ color: 'var(--ac-text)' }}>/docs/customization</Link>.
          </p>
        </div>
      </Section>
    </ComponentDoc>
  )
}
