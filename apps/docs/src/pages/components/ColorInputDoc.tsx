import { useState } from 'react'
import { ColorInput } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

export default function ColorInputDoc() {
  const [brand, setBrand] = useState('#8b5cf6')
  return (
    <ComponentDoc
      slug="color-input"
      name="ColorInput"
      description="Compact form field with an inline swatch trigger that opens a ColorPicker in a popover. Drop-in replacement for a text input when a color is required."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <ColorInput value={brand} onChange={(v) => setBrand(v.hex)} />
          <div
            style={{
              padding: '14px 20px',
              borderRadius: 'var(--r-md)',
              background: brand,
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              minWidth: 220,
              textAlign: 'center',
            }}
          >
            Brand color is {brand}
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ ColorInput }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>ColorInput{'\n'}
          {'  '}<span className="p">value=</span>{'{'}brand{'}'}{'\n'}
          {'  '}<span className="p">onChange=</span>{'{'}(v) =&gt; setBrand(v.hex){'}'}{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="sizes" title="Sizes">
        <div className="vl-panel" style={{ padding: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
          <ColorInput defaultValue="#ef4444" size="sm" />
          <ColorInput defaultValue="#22c55e" size="md" />
        </div>
      </Section>

      <Section id="formats" title="Display format">
        <p style={{ color: 'var(--fg-2)', margin: 0 }}>
          The field value is written back in the format you choose — handy when you want to
          persist OKLCH or HSL instead of HEX.
        </p>
        <div className="vl-panel" style={{ padding: 24, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <ColorInput defaultValue="rgb(239, 68, 68)" displayAs="rgb" />
          <ColorInput defaultValue="hsl(217, 91%, 60%)" displayAs="hsl" />
          <ColorInput defaultValue="oklch(0.6 0.2 250)" displayAs="oklch" />
        </div>
      </Section>

      <Section id="api" title="API">
        <div className="vl-panel" style={{ padding: '16px 20px', fontSize: 13.5, color: 'var(--fg-2)' }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><code>value / defaultValue</code> — any CSS color string</li>
            <li><code>onChange(ColorValue)</code> — emits normalized color on every edit</li>
            <li><code>displayAs</code> — format written to the text field</li>
            <li><code>size</code> — <code>sm</code> or <code>md</code> (default <code>md</code>)</li>
            <li><code>invalid</code> / <code>disabled</code> — form-field states</li>
            <li><code>pickerProps</code> — forwarded to the inner <code>ColorPicker</code></li>
          </ul>
        </div>
      </Section>
    </ComponentDoc>
  )
}
