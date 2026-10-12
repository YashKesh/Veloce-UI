import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'veloce-ui'
import { ComponentDoc, Section, CodeBlock } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
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
          <Button variant="outline">Deploy</Button>
          <Button variant="ghost">Deploy</Button>
          <Button variant="destructive">Delete</Button>
          <Button variant="primary" disabled>Deploying…</Button>
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
          style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18, border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-1)' }}
        >
          <Row label="sm">
            <Button variant="primary" size="sm">Deploy</Button>
            <Button variant="outline" size="sm">Deploy</Button>
            <Button variant="ghost" size="sm">Deploy</Button>
            <Button variant="destructive" size="sm">Delete</Button>
          </Row>
          <Row label="md">
            <Button variant="primary">Deploy</Button>
            <Button variant="outline">Deploy</Button>
            <Button variant="ghost">Deploy</Button>
            <Button variant="destructive">Delete</Button>
          </Row>
          <Row label="lg">
            <Button variant="primary" size="lg">Deploy</Button>
            <Button variant="outline" size="lg">Deploy</Button>
            <Button variant="ghost" size="lg">Deploy</Button>
            <Button variant="destructive" size="lg">Delete</Button>
          </Row>
          <Row label="states">
            <Button variant="primary" disabled>Disabled</Button>
            <Button variant="outline" disabled>Disabled</Button>
            <Button variant="primary" style={{ opacity: 0.9 }}>
              <span
                aria-hidden
                style={{
                  display: 'inline-block',
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  border: '2px solid currentColor',
                  borderRightColor: 'transparent',
                  animation: 'vl-spin .7s linear infinite',
                  marginRight: 8,
                  verticalAlign: '-2px',
                }}
              />
              Deploying
            </Button>
            <Button variant="outline">
              <span style={{ fontSize: 13, marginRight: 6 }}>↗</span>With icon
            </Button>
          </Row>
        </div>
      </Section>
      <Section id="customization" title="Customization">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Button style={{ ['--vl-btn-bg' as string]: 'oklch(0.65 0.22 12)' } as React.CSSProperties}>Rose</Button>
            <Button style={{ ['--vl-btn-bg' as string]: 'oklch(0.72 0.16 155)' } as React.CSSProperties}>Emerald</Button>
            <Button style={{ ['--vl-btn-bg' as string]: '#000', ['--vl-btn-fg' as string]: '#fff' } as React.CSSProperties}>Monochrome</Button>
          </div>
          <CodeBlock>
            <span className="p">&lt;</span>Button{'\n'}
            {'  '}<span className="p">style=</span>{'{{'}{'\n'}
            {'    '}<span className="s">'--vl-btn-bg'</span>: <span className="s">'oklch(0.65 0.22 12)'</span>,{'\n'}
            {'    '}<span className="s">'--vl-btn-fg'</span>: <span className="s">'#fff'</span>,{'\n'}
            {'  '}{'}}'}{'\n'}
            <span className="p">&gt;</span>Rose<span className="p">&lt;/</span>Button<span className="p">&gt;</span>
          </CodeBlock>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-3)' }}>
            Tokens: <code>--vl-btn-bg</code>, <code>--vl-btn-fg</code>.
          </p>
        </div>
      </Section>
      <Section id="as-child" title="asChild composition">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <Button asChild variant="primary">
              <Link to="/docs/customization">Internal link (react-router)</Link>
            </Button>
            <Button asChild variant="outline">
              <a href="https://github.com" target="_blank" rel="noreferrer">External anchor ↗</a>
            </Button>
          </div>
          <CodeBlock>
            <span className="p">import</span> {'{ Link }'} <span className="p">from</span> <span className="s">"react-router-dom"</span>{'\n\n'}
            <span className="p">&lt;</span>Button asChild variant=<span className="s">"primary"</span><span className="p">&gt;</span>{'\n'}
            {'  '}<span className="p">&lt;</span>Link to=<span className="s">"/docs"</span><span className="p">&gt;</span>Read the docs<span className="p">&lt;/</span>Link<span className="p">&gt;</span>{'\n'}
            <span className="p">&lt;/</span>Button<span className="p">&gt;</span>
          </CodeBlock>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-3)' }}>
            Pass <code>asChild</code> to render Button styles onto any element — no wrapper div, no lost semantics. See <Link to="/docs/customization#as-child" style={{ color: 'var(--ac-text)' }}>asChild docs</Link>.
          </p>
        </div>
      </Section>
    </ComponentDoc>
  )
}
