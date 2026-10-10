import { useState } from 'react'
import { NumberInput } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

export default function NumberInputDoc() {
  const [qty, setQty] = useState(1)
  return (
    <ComponentDoc
      slug="number-input"
      name="NumberInput"
      description="A text field restricted to numbers, with increment/decrement buttons and arrow-key support. Clamps to min/max."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>Quantity</div>
          <NumberInput value={qty} onValueChange={setQty} min={0} max={99} step={1} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>value: {qty}</span>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ NumberInput }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>NumberInput <span className="p">value=</span>{'{'}qty{'}'} <span className="p">onValueChange=</span>{'{'}setQty{'}'} <span className="p">min=</span>{'{'}0{'}'} <span className="p">max=</span>{'{'}99{'}'} <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="variants" title="Variants">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <NumberInput defaultValue={10} prefix="$" />
          <NumberInput defaultValue={50} suffix="%" min={0} max={100} />
          <NumberInput defaultValue={5} size="sm" min={0} step={0.5} precision={1} />
        </div>
      </Section>
    </ComponentDoc>
  )
}
