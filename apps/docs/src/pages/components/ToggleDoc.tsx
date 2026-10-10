import { useState } from 'react'
import { Toggle } from 'veloce-ui'
import { Link } from 'react-router-dom'
import { ComponentDoc, Section, CodeBlock } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'States', id: 'states' },
]

export default function ToggleDoc() {
  const [bold, setBold] = useState(true)
  const [italic, setItalic] = useState(false)
  const [underline, setUnderline] = useState(false)

  return (
    <ComponentDoc
      slug="toggle"
      name="Toggle"
      description="A two-state press button. Use it for formatting toggles (bold, italic) or action toggles (mute, pin) — not for form data (use Switch for settings)."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'inline-flex', gap: 4, padding: 4, border: '1px solid var(--line)', borderRadius: 8, background: 'var(--bg-1)' }}>
            <Toggle pressed={bold} onPressedChange={setBold} aria-label="Bold">
              <b>B</b>
            </Toggle>
            <Toggle pressed={italic} onPressedChange={setItalic} aria-label="Italic">
              <i>I</i>
            </Toggle>
            <Toggle pressed={underline} onPressedChange={setUnderline} aria-label="Underline">
              <u>U</u>
            </Toggle>
          </div>
          <div
            style={{
              padding: '14px 16px', border: '1px solid var(--line)', borderRadius: 8,
              background: 'var(--bg-1)', fontSize: 14, color: 'var(--fg)', minWidth: 280,
              fontWeight: bold ? 600 : 400,
              fontStyle: italic ? 'italic' : 'normal',
              textDecoration: underline ? 'underline' : 'none',
            }}
          >
            The quick brown fox jumps over the lazy dog.
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Toggle }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">const</span> [bold, setBold] = useState(<span className="p">false</span>)
          {'\n\n'}
          <span className="p">&lt;</span>Toggle{'\n'}
          {'  '}<span className="p">pressed=</span>{'{'}bold{'}'}{'\n'}
          {'  '}<span className="p">onPressedChange=</span>{'{'}setBold{'}'}{'\n'}
          {'  '}<span className="p">aria-label=</span><span className="s">"Bold"</span>{'\n'}
          <span className="p">&gt;</span>B<span className="p">&lt;/</span>Toggle<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="states" title="States">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: 24, alignItems: 'center', justifyContent: 'start', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
            <Toggle>Default</Toggle>
            off
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
            <Toggle defaultPressed>Pressed</Toggle>
            on
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
            <Toggle variant="outline" defaultPressed>Outline</Toggle>
            outline
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
            <Toggle disabled>Locked</Toggle>
            disabled
          </div>
        </div>
      </Section>
      <Section id="customization" title="Customization">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <Toggle defaultPressed style={{ ['--vl-toggle-bg-pressed' as string]: 'oklch(0.65 0.22 12)', ['--vl-toggle-color-pressed' as string]: '#fff' }}>Red</Toggle>
            <Toggle defaultPressed variant="outline" style={{ ['--vl-toggle-border-pressed' as string]: 'oklch(0.72 0.16 155)', ['--vl-toggle-color-pressed' as string]: 'oklch(0.72 0.16 155)' }}>Emerald</Toggle>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>pressed-state overrides</span>
          </div>
          <CodeBlock>
            <span className="p">&lt;</span>Toggle defaultPressed{'\n'}
            {'  '}<span className="p">style=</span>{'{{'}{'\n'}
            {'    '}<span className="s">'--vl-toggle-bg-pressed'</span>: <span className="s">'oklch(0.65 0.22 12)'</span>,{'\n'}
            {'    '}<span className="s">'--vl-toggle-color-pressed'</span>: <span className="s">'#fff'</span>,{'\n'}
            {'  '}{'}}'}{'\n'}
            <span className="p">&gt;</span>Red<span className="p">&lt;/</span>Toggle<span className="p">&gt;</span>
          </CodeBlock>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-3)' }}>
            Tokens: <code>--vl-toggle-bg/-pressed</code>, <code>--vl-toggle-color/-pressed</code>, <code>--vl-toggle-border/-pressed</code>.
          </p>
        </div>
      </Section>
      <Section id="as-child" title="asChild composition">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Toggle asChild defaultPressed>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" defaultChecked style={{ accentColor: 'var(--ac)' }} />
              Toggle renders as a label wrapping a native checkbox
            </label>
          </Toggle>
          <CodeBlock>
            <span className="p">&lt;</span>Toggle asChild pressed={'{'}bold{'}'}<span className="p">&gt;</span>{'\n'}
            {'  '}<span className="p">&lt;</span>label<span className="p">&gt;</span><span className="p">&lt;</span>input type=<span className="s">"checkbox"</span> <span className="p">/&gt;</span> Bold<span className="p">&lt;/</span>label<span className="p">&gt;</span>{'\n'}
            <span className="p">&lt;/</span>Toggle<span className="p">&gt;</span>
          </CodeBlock>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-3)' }}>
            Pass <code>asChild</code> to render Toggle styles onto any element. See <Link to="/docs/customization#as-child" style={{ color: 'var(--ac-text)' }}>asChild docs</Link>.
          </p>
        </div>
      </Section>
    </ComponentDoc>
  )
}
