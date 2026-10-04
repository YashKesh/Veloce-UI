import { useState } from 'react'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Card variant', id: 'cards' },
]

const PLANS = [
  { id: 'hobby', label: 'Hobby', price: '$0/mo' },
  { id: 'pro', label: 'Pro', price: '$20/mo' },
  { id: 'enterprise', label: 'Enterprise', price: 'Custom' },
]

function Dot({ selected, disabled, focused }: { selected: boolean; disabled?: boolean; focused?: boolean }) {
  return (
    <span
      style={{
        width: 18, height: 18, borderRadius: '50%', flexShrink: 0, boxSizing: 'border-box',
        border: disabled
          ? '1px solid var(--line)'
          : selected
            ? '5px solid var(--ac)'
            : '1px solid var(--line-2)',
        background: disabled ? 'var(--bg-2)' : 'var(--bg)',
        boxShadow: focused ? '0 0 0 2px var(--bg-1), 0 0 0 4px var(--ac)' : undefined,
        transition: 'border 150ms, box-shadow 150ms',
      }}
    />
  )
}

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
        <div role="radiogroup" style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 280 }}>
          {PLANS.map((p) => {
            const selected = p.id === plan
            return (
              <div
                key={p.id}
                role="radio"
                aria-checked={selected}
                onClick={() => setPlan(p.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '9px 10px',
                  borderRadius: 8, cursor: 'pointer', fontSize: 13.5,
                  color: selected ? 'var(--fg)' : 'var(--fg-2)',
                }}
              >
                <Dot selected={selected} />
                <span style={{ flex: 1 }}>{p.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>{p.price}</span>
              </div>
            )
          })}
          <div
            role="radio"
            aria-checked={false}
            aria-disabled
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '9px 10px',
              borderRadius: 8, cursor: 'not-allowed', fontSize: 13.5,
              color: 'var(--fg-3)',
            }}
          >
            <Dot selected={false} disabled />
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              On-prem
              <span
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, padding: '1px 6px',
                  borderRadius: 999, border: '1px solid var(--line-2)', color: 'var(--fg-3)',
                }}
              >
                Pro
              </span>
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>Contact us</span>
          </div>
        </div>
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
          <div role="radiogroup" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {PLANS.map((p) => {
              const selected = p.id === cardPlan
              return (
                <div
                  key={p.id}
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setCardPlan(p.id)}
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
                    <Dot selected={selected} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>{p.price}</span>
                </div>
              )
            })}
          </div>
        </div>
      </Section>
    </ComponentDoc>
  )
}
