import { useState } from 'react'
import { ColorPicker, type ColorValue } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const SWATCHES = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#64748b',
]

export default function ColorPickerDoc() {
  const [color, setColor] = useState<ColorValue | null>(null)
  const hex = color?.hex ?? '#3b82f6'

  return (
    <ComponentDoc
      slug="color-picker"
      name="ColorPicker"
      description="Full-featured color picker with HEX, RGB/RGBA, HSL/HSLA, and OKLCH tabs. SV square, hue + alpha sliders, EyeDropper API, preset palette, and optional WCAG contrast badge. Zero-dependency, SSR-safe, OKLCH-native."
      preview={
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
          <ColorPicker
            defaultValue="#3b82f6"
            onChange={setColor}
            swatches={SWATCHES}
            contrastAgainst="#ffffff"
          />
          <div
            style={{
              width: 240,
              padding: 20,
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--line)',
              background: hex,
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              minHeight: 220,
            }}
          >
            <div style={{ fontSize: 11, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Output</div>
            <div style={{ fontSize: 18 }}>{hex}</div>
            {color && (
              <>
                <div>rgb({color.rgb.r}, {color.rgb.g}, {color.rgb.b})</div>
                <div>hsl({Math.round(color.hsl.h)}, {Math.round(color.hsl.s)}%, {Math.round(color.hsl.l)}%)</div>
                <div>oklch({color.oklch.l} {color.oklch.c} {Math.round(color.oklch.h)})</div>
                <div style={{ opacity: 0.8 }}>α {Math.round(color.alpha * 100)}%</div>
              </>
            )}
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ ColorPicker }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>ColorPicker{'\n'}
          {'  '}<span className="p">defaultValue=</span><span className="s">"#3b82f6"</span>{'\n'}
          {'  '}<span className="p">onChange=</span>{'{'}(v) =&gt; console.log(v.hex){'}'}{'\n'}
          {'  '}<span className="p">swatches=</span>{'{'}['#ef4444', '#3b82f6', '#22c55e']{'}'}{'\n'}
          {'  '}<span className="p">contrastAgainst=</span><span className="s">"#ffffff"</span>{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="formats" title="Format tabs">
        <p style={{ color: 'var(--fg-2)', margin: 0 }}>
          Four built-in output formats — HEX, RGB(A), HSL(A) and OKLCH. Internal state is HSL
          so hue stays stable at the top and bottom of the SV square.
        </p>
        <div className="vl-panel" style={{ padding: 24, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <ColorPicker defaultValue="#8b5cf6" format="oklch" size="sm" showAlpha={false} />
          <ColorPicker defaultValue="#10b981" format="rgb" size="sm" formats={['hex', 'rgb']} />
        </div>
      </Section>

      <Section id="eyedropper" title="EyeDropper">
        <p style={{ color: 'var(--fg-2)', margin: 0 }}>
          On Chromium browsers, the eyedropper button opens the native screen picker. On other
          browsers the button is hidden automatically.
        </p>
      </Section>

      <Section id="api" title="API">
        <div className="vl-panel" style={{ padding: '16px 20px', fontSize: 13.5, color: 'var(--fg-2)' }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><code>value / defaultValue</code> — any CSS color string (hex, rgb, hsl, oklch)</li>
            <li><code>onChange(ColorValue)</code> — fires with every edit, provides all four formats</li>
            <li><code>format</code> — initial active tab (<code>hex</code> | <code>rgb</code> | <code>hsl</code> | <code>oklch</code>)</li>
            <li><code>formats</code> — restrict visible tabs</li>
            <li><code>showAlpha</code> — hide/show the alpha slider and field</li>
            <li><code>showEyeDropper</code> — hide the EyeDropper button</li>
            <li><code>swatches</code> — array of preset colors</li>
            <li><code>contrastAgainst</code> — show a WCAG badge against this color</li>
            <li><code>size</code> — <code>sm</code> (180px) or <code>md</code> (220px)</li>
          </ul>
        </div>
      </Section>
    </ComponentDoc>
  )
}
