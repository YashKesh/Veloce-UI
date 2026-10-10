import { useState } from 'react'
import { Rating } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

export default function RatingDoc() {
  const [value, setValue] = useState(4)
  return (
    <ComponentDoc
      slug="rating"
      name="Rating"
      description="Star rating control. Click to set a value, hover to preview. Pass readOnly for display-only."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <Rating value={value} onValueChange={setValue} max={5} size={28} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>{value} / 5</span>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Rating }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Rating <span className="p">value=</span>{'{'}value{'}'} <span className="p">onValueChange=</span>{'{'}setValue{'}'} <span className="p">max=</span>{'{'}5{'}'} <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="variants" title="Variants">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 24, alignItems: 'center', justifyContent: 'start', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
            <Rating defaultValue={3} />
            default
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
            <Rating defaultValue={5} readOnly />
            readonly
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
            <Rating defaultValue={4} size={14} />
            small
          </div>
        </div>
      </Section>
    </ComponentDoc>
  )
}
