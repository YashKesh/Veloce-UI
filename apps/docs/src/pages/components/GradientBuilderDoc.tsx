import { useState } from 'react'
import { GradientBuilder, type GradientValue } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

export default function GradientBuilderDoc() {
  const [css, setCss] = useState<string>('linear-gradient(90deg, #3b82f6 0.0%, #8b5cf6 100.0%)')

  return (
    <ComponentDoc
      slug="gradient-builder"
      name="GradientBuilder"
      description="Multi-stop gradient editor. Linear, radial, and conic types with draggable stops, per-stop ColorInput, angle slider, and copy-to-clipboard export in CSS, Tailwind arbitrary value, or OKLCH-only CSS. Reuses the Color pack's parser and swatch primitives."
      preview={
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
          <GradientBuilder
            defaultValue={{
              type: 'linear',
              angle: 135,
              stops: [
                { color: '#ef4444', position: 0 },
                { color: '#f59e0b', position: 50 },
                { color: '#3b82f6', position: 100 },
              ],
            }}
            onChange={(_v: GradientValue, cssString: string) => setCss(cssString)}
          />
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: 'var(--r-md)',
              background: css,
              border: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'flex-end',
              padding: 12,
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              textShadow: '0 1px 2px rgba(0,0,0,0.4)',
            }}
          >
            live output →
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ GradientBuilder }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>GradientBuilder{'\n'}
          {'  '}<span className="p">defaultValue=</span>{'{{'}{'\n'}
          {'    '}type: <span className="s">"linear"</span>,{'\n'}
          {'    '}angle: 135,{'\n'}
          {'    '}stops: [{'\n'}
          {'      '}{'{'} color: <span className="s">"#ef4444"</span>, position: 0 {'}'},{'\n'}
          {'      '}{'{'} color: <span className="s">"#3b82f6"</span>, position: 100 {'}'},{'\n'}
          {'    '}],{'\n'}
          {'  '}{'}}'}{'\n'}
          {'  '}<span className="p">onChange=</span>{'{'}(v, css) =&gt; console.log(css){'}'}{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="types" title="Gradient types">
        <p style={{ color: 'var(--fg-2)', margin: 0 }}>
          Switch between <code>linear</code>, <code>radial</code>, and <code>conic</code> types.
          The angle slider is hidden for radial since center-radius is implied.
        </p>
        <div className="vl-panel" style={{ padding: 20, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <GradientBuilder
            defaultValue={{
              type: 'radial',
              angle: 0,
              stops: [
                { color: '#10b981', position: 0 },
                { color: '#064e3b', position: 100 },
              ],
            }}
            previewHeight={120}
          />
          <GradientBuilder
            defaultValue={{
              type: 'conic',
              angle: 0,
              stops: [
                { color: '#ef4444', position: 0 },
                { color: '#f59e0b', position: 33 },
                { color: '#10b981', position: 66 },
                { color: '#3b82f6', position: 100 },
              ],
            }}
            previewHeight={120}
            formats={['css']}
          />
        </div>
      </Section>

      <Section id="interactions" title="Interactions">
        <div className="vl-panel" style={{ padding: '16px 20px', fontSize: 13.5, color: 'var(--fg-2)' }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><strong>Click the track</strong> to add a new stop at the clicked position</li>
            <li><strong>Drag a pip</strong> to re-position any stop</li>
            <li>The <strong>active stop</strong> (last clicked) can be edited via the ColorInput + position field</li>
            <li>You can add / remove stops down to a minimum of 2</li>
          </ul>
        </div>
      </Section>

      <Section id="api" title="API">
        <div className="vl-panel" style={{ padding: '16px 20px', fontSize: 13.5, color: 'var(--fg-2)' }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><code>value / defaultValue</code> — <code>{'{ type, angle, stops: [{ color, position }] }'}</code></li>
            <li><code>onChange(value, cssString)</code> — fires with every edit</li>
            <li><code>formats</code> — restrict export tabs to <code>css</code> | <code>tailwind</code> | <code>oklch</code></li>
            <li><code>previewHeight</code> — top preview height in px (default 160)</li>
          </ul>
        </div>
      </Section>
    </ComponentDoc>
  )
}
