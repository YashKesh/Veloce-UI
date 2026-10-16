import { ShadowBuilder } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

export default function ShadowBuilderDoc() {
  return (
    <ComponentDoc
      slug="shadow-builder"
      name="ShadowBuilder"
      description="Layered box-shadow editor. Add any number of layers, tweak offset / blur / spread / color / inset per layer, re-order with up/down, and copy the result as CSS, Tailwind arbitrary value, or a CSS variable declaration ready for your token system."
      preview={
        <ShadowBuilder
          defaultValue={[
            { x: 0, y: 1, blur: 3, spread: 0, color: 'rgba(0,0,0,0.08)', inset: false },
            { x: 0, y: 10, blur: 24, spread: -4, color: 'rgba(0,0,0,0.18)', inset: false },
          ]}
          cssVarName="--shadow-elevation-2"
        />
      }
      usage={
        <>
          <span className="p">import</span> {'{ ShadowBuilder }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>ShadowBuilder{'\n'}
          {'  '}<span className="p">defaultValue=</span>{'{['}{'\n'}
          {'    '}{'{'} x: 0, y: 1, blur: 3, spread: 0, color: <span className="s">"rgba(0,0,0,0.08)"</span>, inset: false {'}'},{'\n'}
          {'    '}{'{'} x: 0, y: 10, blur: 24, spread: -4, color: <span className="s">"rgba(0,0,0,0.18)"</span>, inset: false {'}'},{'\n'}
          {'  '}{']}'}{'\n'}
          {'  '}<span className="p">cssVarName=</span><span className="s">"--shadow-elevation-2"</span>{'\n'}
          {'  '}<span className="p">onChange=</span>{'{'}(layers, css) =&gt; console.log(css){'}'}{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="inset" title="Inset shadows">
        <p style={{ color: 'var(--fg-2)', margin: 0 }}>
          Toggle the <code>inset</code> checkbox per layer to render shadows inside the element —
          perfect for pressed-state buttons or inner glows.
        </p>
        <div className="vl-panel" style={{ padding: 20 }}>
          <ShadowBuilder
            defaultValue={[
              { x: 0, y: 2, blur: 4, spread: 0, color: 'rgba(0,0,0,0.15)', inset: true },
              { x: 0, y: -1, blur: 0, spread: 0, color: 'rgba(255,255,255,0.1)', inset: true },
            ]}
            formats={['css']}
          />
        </div>
      </Section>

      <Section id="api" title="API">
        <div className="vl-panel" style={{ padding: '16px 20px', fontSize: 13.5, color: 'var(--fg-2)' }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><code>value / defaultValue</code> — array of <code>{'{ x, y, blur, spread, color, inset }'}</code></li>
            <li><code>onChange(layers, cssString)</code> — fires on every edit</li>
            <li><code>cssVarName</code> — name used by the <strong>CSS var</strong> export tab (default <code>--vl-shadow</code>)</li>
            <li><code>formats</code> — restrict export tabs to <code>css</code> | <code>tailwind</code> | <code>cssVar</code></li>
            <li><code>previewBackground</code> — background colour of the sample card</li>
          </ul>
        </div>
      </Section>
    </ComponentDoc>
  )
}
