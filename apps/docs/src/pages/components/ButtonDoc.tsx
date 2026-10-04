import type { ReactNode } from 'react'
import { Button } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Variants & sizes', id: 'variants' },
]

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
      <span className="vl-label" style={{ width: 64 }}>{label}</span>
      {children}
    </div>
  )
}

export default function ButtonDoc() {
  return (
    <ComponentDoc
      slug="button"
      name="Button"
      description="Triggers an action. Five variants across three sizes, with press feedback that scales to 0.97 in 120ms."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
          <Button data-testid="veloce-ui-button" variant="primary">Deploy</Button>
          <button className="vl-btn vl-btn--md vl-btn--soft">Deploy</button>
          <button className="vl-btn vl-btn--md vl-btn--outline">Deploy</button>
          <button className="vl-btn vl-btn--md vl-btn--ghost">Deploy</button>
          <button className="vl-btn vl-btn--md vl-btn--destructive">Delete</button>
          <span className="vl-btn vl-btn--md vl-btn--solid" style={{ boxShadow: 'none', opacity: 0.85 }}>
            <span className="vl-spinner" style={{ width: 14, height: 14, borderColor: 'var(--ac-fg)', borderRightColor: 'transparent' }} />
            Deploying
          </span>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Button }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">export function</span> Actions() {'{'}
          {'\n  '}<span className="p">return</span> ({'\n'}
          {'    '}<span className="p">&lt;&gt;</span>{'\n'}
          {'      '}<span className="p">&lt;</span>Button <span className="p">variant=</span><span className="s">"solid"</span> <span className="p">size=</span><span className="s">"md"</span><span className="p">&gt;</span>Deploy<span className="p">&lt;/</span>Button<span className="p">&gt;</span>{'\n'}
          {'      '}<span className="p">&lt;</span>Button <span className="p">variant=</span><span className="s">"soft"</span> <span className="p">size=</span><span className="s">"lg"</span><span className="p">&gt;</span>Preview<span className="p">&lt;/</span>Button<span className="p">&gt;</span>{'\n'}
          {'      '}<span className="p">&lt;</span>Button <span className="p">variant=</span><span className="s">"outline"</span> loading<span className="p">&gt;</span>Saving<span className="p">&lt;/</span>Button<span className="p">&gt;</span>{'\n'}
          {'    '}<span className="p">&lt;/&gt;</span>{'\n'}
          {'  '})
          {'\n'}{'}'}
        </>
      }
    >
      <Section id="variants" title="Variants & sizes">
        <div
          className="vl-panel"
          style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}
        >
          <Row label="sm · 30">
            <button className="vl-btn vl-btn--sm vl-btn--solid">Deploy</button>
            <button className="vl-btn vl-btn--sm vl-btn--soft">Deploy</button>
            <button className="vl-btn vl-btn--sm vl-btn--outline">Deploy</button>
            <button className="vl-btn vl-btn--sm vl-btn--ghost">Deploy</button>
          </Row>
          <Row label="md · 36">
            <button className="vl-btn vl-btn--md vl-btn--solid">Deploy</button>
            <button className="vl-btn vl-btn--md vl-btn--soft">Deploy</button>
            <button className="vl-btn vl-btn--md vl-btn--outline">Deploy</button>
            <button className="vl-btn vl-btn--md vl-btn--ghost">Deploy</button>
          </Row>
          <Row label="lg · 44">
            <button className="vl-btn vl-btn--lg vl-btn--solid">Deploy</button>
            <button className="vl-btn vl-btn--lg vl-btn--soft">Deploy</button>
            <button className="vl-btn vl-btn--lg vl-btn--outline">Deploy</button>
            <button className="vl-btn vl-btn--lg vl-btn--ghost">Deploy</button>
          </Row>
          <Row label="states">
            <span
              className="vl-btn vl-btn--md vl-btn--solid"
              style={{ transform: 'scale(.97)', boxShadow: 'inset 0 1px 2px oklch(0 0 0/.3)' }}
            >
              Pressed
            </span>
            <span className="vl-btn vl-btn--md vl-btn--solid vl-btn--focus">Focused</span>
            <span className="vl-btn vl-btn--md vl-btn--solid" style={{ opacity: 0.85 }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 13,
                  height: 13,
                  borderRadius: '50%',
                  border: '2px solid var(--ac-fg)',
                  borderRightColor: 'transparent',
                  animation: 'vl-spin .7s linear infinite',
                }}
              />
              Deploying
            </span>
            <span className="vl-btn vl-btn--md vl-btn--outline" style={{ padding: '0 14px 0 12px' }}>
              <span style={{ fontSize: 13 }}>↗</span>With icon
            </span>
            <button className="vl-btn vl-btn--md vl-btn--disabled" disabled>Disabled</button>
            <button className="vl-btn vl-btn--md vl-btn--destructive">Destructive</button>
          </Row>
        </div>
      </Section>
    </ComponentDoc>
  )
}
