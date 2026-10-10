import { Tooltip, TooltipProvider, Button } from 'veloce-ui'
import { Link } from 'react-router-dom'
import { ComponentDoc, Section, CodeBlock } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Timing', id: 'timing' },
]

export default function TooltipDoc() {
  return (
    <ComponentDoc
      slug="tooltip"
      name="Tooltip"
      description="A label that identifies a control on hover or focus. Rises 4px into place over 150ms; disappears instantly on leave."
      toc={TOC}
      preview={
        <TooltipProvider openDelay={300}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <Tooltip content="Copy link">
                <Button variant="outline" size="sm" aria-label="Copy link">⛓</Button>
              </Tooltip>
              <Tooltip content="Share with teammates">
                <Button variant="outline" size="sm" aria-label="Share">↗</Button>
              </Tooltip>
              <Tooltip content="Open in new tab" side="bottom">
                <Button variant="outline" size="sm" aria-label="Open">↑</Button>
              </Tooltip>
            </div>
            <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>Hover or tab to any button</span>
          </div>
        </TooltipProvider>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Tooltip, TooltipProvider }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>TooltipProvider<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Tooltip <span className="p">content=</span><span className="s">"Copy link"</span><span className="p">&gt;</span>{'\n'}
          {'    '}<span className="p">&lt;</span>Button <span className="p">aria-label=</span><span className="s">"Copy"</span><span className="p">&gt;</span>⛓<span className="p">&lt;/</span>Button<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;/</span>Tooltip<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;/</span>TooltipProvider<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="timing" title="Timing">
        <div className="vl-panel" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--fg-2)', margin: 0 }}>
            Tooltips wait 500ms before opening so casual pointer travel never flashes labels, then close with no
            delay the moment the pointer or focus leaves. Once one tooltip is open, siblings open instantly —
            the delay is shared across the group.
          </p>
          <div
            style={{
              display: 'grid', gridTemplateColumns: 'auto auto 1fr', columnGap: 24, rowGap: 8,
              fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)',
            }}
          >
            <span style={{ color: 'var(--fg-2)' }}>event</span>
            <span style={{ color: 'var(--fg-2)' }}>delay</span>
            <span style={{ color: 'var(--fg-2)' }}>motion</span>
            <span>open</span><span style={{ color: 'var(--ac-text)' }}>500ms</span><span>rise 150ms</span>
            <span>close</span><span style={{ color: 'var(--ac-text)' }}>0ms</span><span>instant</span>
            <span>sibling open</span><span style={{ color: 'var(--ac-text)' }}>0ms</span><span>rise 150ms</span>
          </div>
        </div>
      </Section>
      <Section id="customization" title="Customization">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ margin: 0, fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.55 }}>
            Tooltips render through a React portal, so tokens must be set at a scope that includes <code>document.body</code> — usually <code>:root</code> or a class on <code>html</code>.
          </p>
          <CodeBlock>
            <span className="p">:root</span> {'{'}{'\n'}
            {'  '}<span className="s">--vl-tooltip-bg</span>: <span className="s">var(--ac)</span>;{'\n'}
            {'  '}<span className="s">--vl-tooltip-color</span>: <span className="s">var(--ac-fg)</span>;{'\n'}
            {'}'}
          </CodeBlock>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-3)' }}>
            Tokens: <code>--vl-tooltip-bg</code>, <code>--vl-tooltip-color</code>. See <Link to="/docs/customization" style={{ color: 'var(--ac-text)' }}>/docs/customization</Link>.
          </p>
        </div>
      </Section>
    </ComponentDoc>
  )
}
