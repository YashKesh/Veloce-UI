import { useState } from 'react'
import { RadioGroup, Radio } from 'veloce-ui'
import { Link } from 'react-router-dom'
import { ComponentDoc, Section, CodeBlock } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Card variant', id: 'cards' },
]

const PLANS = [
  { id: 'hobby', label: 'Hobby', price: '$0/mo' },
  { id: 'pro', label: 'Pro', price: '$20/mo' },
  { id: 'enterprise', label: 'Enterprise', price: 'Custom' },
]

export default function RadioDoc() {
  const [plan, setPlan] = useState('pro')
  const [cardPlan, setCardPlan] = useState('hobby')

  return (
    <ComponentDoc
      slug="radio"
      name="Radio"
      description="Pick exactly one option from a small set. The selected circle fills with a thick accent ring over 150ms."
      toc={TOC}
      preview={
        <RadioGroup value={plan} onValueChange={setPlan} style={{ minWidth: 280 }}>
          {PLANS.map((p) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 10px', fontSize: 13.5 }}>
              <Radio value={p.id} label={<span style={{ flex: 1 }}>{p.label}</span>} />
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>{p.price}</span>
            </div>
          ))}
        </RadioGroup>
      }
      usage={
        <>
          <span className="p">import</span> {'{ RadioGroup, Radio }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">const</span> [plan, setPlan] = useState(<span className="s">"pro"</span>)
          {'\n\n'}
          <span className="p">&lt;</span>RadioGroup <span className="p">value=</span>{'{'}plan{'}'} <span className="p">onValueChange=</span>{'{'}setPlan{'}'}<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Radio <span className="p">value=</span><span className="s">"hobby"</span><span className="p">&gt;</span>Hobby<span className="p">&lt;/</span>Radio<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Radio <span className="p">value=</span><span className="s">"pro"</span><span className="p">&gt;</span>Pro<span className="p">&lt;/</span>Radio<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Radio <span className="p">value=</span><span className="s">"enterprise"</span><span className="p">&gt;</span>Enterprise<span className="p">&lt;/</span>Radio<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;/</span>RadioGroup<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="cards" title="Card variant">
        <div className="vl-panel" style={{ padding: '24px 28px' }}>
          <RadioGroup value={cardPlan} onValueChange={setCardPlan} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {PLANS.map((p) => {
              const selected = p.id === cardPlan
              return (
                <label
                  key={p.id}
                  style={{
                    display: 'flex', flexDirection: 'column', gap: 8, padding: '14px 16px',
                    borderRadius: 10, cursor: 'pointer',
                    border: selected ? '1px solid var(--ac)' : '1px solid var(--line-2)',
                    background: selected ? 'var(--ac-soft)' : 'var(--bg)',
                    transition: 'border-color 150ms, background 150ms',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--fg)' }}>{p.label}</span>
                    <Radio value={p.id} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>{p.price}</span>
                </label>
              )
            })}
          </RadioGroup>
        </div>
      </Section>
      <Section id="customization" title="Customization">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <RadioGroup value="b" style={{ display: 'flex', gap: 18 }}>
            <Radio value="a" label="Default" />
            <Radio value="b" label="Rose dot" style={{ ['--vl-radio-dot' as string]: 'var(--err)', ['--vl-radio-border-checked' as string]: 'var(--err)' }} />
            <Radio value="c" label="Emerald" style={{ ['--vl-radio-dot' as string]: 'oklch(0.72 0.16 155)', ['--vl-radio-border-checked' as string]: 'oklch(0.72 0.16 155)' }} />
          </RadioGroup>
          <CodeBlock>
            <span className="p">&lt;</span>Radio value=<span className="s">"b"</span>{'\n'}
            {'  '}<span className="p">style=</span>{'{{'}{'\n'}
            {'    '}<span className="s">'--vl-radio-dot'</span>: <span className="s">'var(--err)'</span>,{'\n'}
            {'    '}<span className="s">'--vl-radio-border-checked'</span>: <span className="s">'var(--err)'</span>,{'\n'}
            {'  '}{'}}'}{'\n'}
            <span className="p">/&gt;</span>
          </CodeBlock>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-3)' }}>
            Tokens: <code>--vl-radio-bg</code>, <code>--vl-radio-border/-checked</code>, <code>--vl-radio-dot</code>, <code>--vl-radio-ring</code>. See <Link to="/docs/customization" style={{ color: 'var(--ac-text)' }}>/docs/customization</Link>.
          </p>
        </div>
      </Section>
    </ComponentDoc>
  )
}
