import { useState } from 'react'
import { ToggleGroup } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Modes', id: 'modes' },
]

export default function ToggleGroupDoc() {
  const [align, setAlign] = useState('left')
  const [formats, setFormats] = useState<string[]>(['bold'])

  return (
    <ComponentDoc
      slug="toggle-group"
      name="Toggle group"
      description="A set of two-state buttons — single-select for exclusive choices, multiple for compounding ones."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
          <ToggleGroup type="single" value={align} onValueChange={setAlign}>
            <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
            <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
            <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
          </ToggleGroup>
          <ToggleGroup type="multiple" value={formats} onValueChange={setFormats}>
            <ToggleGroup.Item value="bold" style={{ fontWeight: 700 }}>B</ToggleGroup.Item>
            <ToggleGroup.Item value="italic" style={{ fontStyle: 'italic' }}>I</ToggleGroup.Item>
            <ToggleGroup.Item value="underline" style={{ textDecoration: 'underline' }}>U</ToggleGroup.Item>
          </ToggleGroup>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
            align: {align} · formats: [{formats.join(', ') || '—'}]
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ ToggleGroup }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">const</span> [align, setAlign] = useState(<span className="s">"left"</span>)
          {'\n\n'}
          <span className="p">&lt;</span>ToggleGroup <span className="p">type=</span><span className="s">"single"</span> <span className="p">value=</span>{'{'}align{'}'} <span className="p">onValueChange=</span>{'{'}setAlign{'}'}<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>ToggleGroup.Item <span className="p">value=</span><span className="s">"left"</span><span className="p">&gt;</span>Left<span className="p">&lt;/</span>ToggleGroup.Item<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>ToggleGroup.Item <span className="p">value=</span><span className="s">"center"</span><span className="p">&gt;</span>Center<span className="p">&lt;/</span>ToggleGroup.Item<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>ToggleGroup.Item <span className="p">value=</span><span className="s">"right"</span><span className="p">&gt;</span>Right<span className="p">&lt;/</span>ToggleGroup.Item<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;/</span>ToggleGroup<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="modes" title="Modes">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16, fontSize: 13.5, lineHeight: 1.6, color: 'var(--fg-2)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ac-text)' }}>type="single"</span>
            <span>Exactly one item is active at a time — clicking another item moves the selection. Ideal for mutually exclusive choices like text alignment.</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ac-text)' }}>type="multiple"</span>
            <span>Any number of items can be active, each toggling independently. Ideal for compounding options like bold, italic, and underline.</span>
          </div>
        </div>
      </Section>
    </ComponentDoc>
  )
}
