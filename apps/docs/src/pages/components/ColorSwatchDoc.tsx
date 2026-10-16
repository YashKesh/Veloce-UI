import { ColorSwatch } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const PALETTE = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
]

export default function ColorSwatchDoc() {
  return (
    <ComponentDoc
      slug="color-swatch"
      name="ColorSwatch"
      description="Primitive readonly chip that displays a color. Automatically renders a checkered background behind translucent values. Used as the trigger inside ColorInput and the preset chips inside ColorPicker."
      preview={
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {PALETTE.map((c) => (
            <ColorSwatch key={c} color={c} size="lg" />
          ))}
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ ColorSwatch }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>ColorSwatch <span className="p">color=</span><span className="s">"#3b82f6"</span> <span className="p">size=</span><span className="s">"md"</span> <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="sizes-shapes" title="Sizes & shapes">
        <div className="vl-panel" style={{ padding: 24, display: 'flex', gap: 20, alignItems: 'center' }}>
          <ColorSwatch color="#3b82f6" size="sm" />
          <ColorSwatch color="#3b82f6" size="md" />
          <ColorSwatch color="#3b82f6" size="lg" />
          <span style={{ width: 1, height: 32, background: 'var(--line)' }} />
          <ColorSwatch color="#8b5cf6" size="lg" shape="circle" />
          <ColorSwatch color="#22c55e" size="lg" shape="circle" />
        </div>
      </Section>

      <Section id="alpha" title="Alpha channel">
        <p style={{ color: 'var(--fg-2)', margin: 0 }}>
          Translucent colors reveal a checker pattern automatically. Set <code>showAlpha=false</code> to
          suppress it.
        </p>
        <div className="vl-panel" style={{ padding: 24, display: 'flex', gap: 10, alignItems: 'center' }}>
          <ColorSwatch color="rgba(239, 68, 68, 1)" size="lg" />
          <ColorSwatch color="rgba(239, 68, 68, 0.6)" size="lg" />
          <ColorSwatch color="rgba(239, 68, 68, 0.3)" size="lg" />
          <ColorSwatch color="rgba(239, 68, 68, 0.1)" size="lg" />
        </div>
      </Section>

      <Section id="active" title="Active state">
        <p style={{ color: 'var(--fg-2)', margin: 0 }}>
          Pass <code>active</code> for a highlighted border — ColorPicker uses this on the matching
          swatch.
        </p>
        <div className="vl-panel" style={{ padding: 24, display: 'flex', gap: 10, alignItems: 'center' }}>
          {PALETTE.map((c, i) => (
            <ColorSwatch key={c} color={c} size="lg" active={i === 3} />
          ))}
        </div>
      </Section>
    </ComponentDoc>
  )
}
