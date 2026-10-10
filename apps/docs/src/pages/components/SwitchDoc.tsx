import { useState } from 'react'
import { Switch } from 'veloce-ui'
import { ComponentDoc, Section, CodeBlock } from '../../components/ComponentDoc'
import { Link } from 'react-router-dom'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'States', id: 'states' },
]

export default function SwitchDoc() {
  const [notify, setNotify] = useState(true)
  const [preview, setPreview] = useState(false)
  return (
    <ComponentDoc
      slug="switch"
      name="Switch"
      description="A binary toggle. The thumb settles over 180ms while the track color transitions in 150ms."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 300 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 13.5, color: 'var(--fg)' }}>
            <Switch checked={notify} onCheckedChange={setNotify} />
            <span style={{ flex: 1 }}>Deploy notifications</span>
            <span className={`vl-badge ${notify ? 'vl-badge--accent' : 'vl-badge--outline'}`}>{notify ? 'On' : 'Off'}</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 13.5, color: 'var(--fg)' }}>
            <Switch checked={preview} onCheckedChange={setPreview} />
            <span style={{ flex: 1 }}>Preview deployments</span>
            <span className={`vl-badge ${preview ? 'vl-badge--accent' : 'vl-badge--outline'}`}>{preview ? 'On' : 'Off'}</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 13.5, color: 'var(--fg-3)' }}>
            <Switch checked={false} disabled />
            <span style={{ flex: 1 }}>Auto-rollback</span>
            <span className="vl-badge vl-badge--outline">Pro</span>
          </label>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Switch }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">const</span> [enabled, setEnabled] = useState(<span className="p">true</span>)
          {'\n\n'}
          <span className="p">&lt;</span>Switch{'\n'}
          {'  '}<span className="p">checked=</span>{'{'}enabled{'}'}{'\n'}
          {'  '}<span className="p">onCheckedChange=</span>{'{'}setEnabled{'}'}{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="states" title="States">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 28, alignItems: 'center', justifyContent: 'start', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
            <Switch checked={false} />
            off
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
            <Switch checked />
            on
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
            <Switch checked disabled />
            disabled
          </div>
        </div>
      </Section>
      <Section id="customization" title="Customization">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <Switch
              checked
              style={{
                ['--vl-switch-track-on' as string]: 'oklch(0.65 0.22 12)',
                ['--vl-switch-thumb' as string]: '#fff',
              }}
            />
            <Switch
              checked
              style={{
                ['--vl-switch-track-on' as string]: 'oklch(0.72 0.16 155)',
              }}
            />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>per-instance token overrides</span>
          </div>
          <CodeBlock>
            <span className="p">&lt;</span>Switch{'\n'}
            {'  '}<span className="p">style=</span>{'{{'}{'\n'}
            {'    '}<span className="s">'--vl-switch-track-on'</span>: <span className="s">'oklch(0.65 0.22 12)'</span>,{'\n'}
            {'    '}<span className="s">'--vl-switch-thumb'</span>: <span className="s">'#fff'</span>,{'\n'}
            {'  '}{'}}'}{'\n'}
            <span className="p">/&gt;</span>
          </CodeBlock>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-3)' }}>
            Tokens: <code>--vl-switch-track-on/off</code>, <code>--vl-switch-border-on/off</code>, <code>--vl-switch-thumb</code>. See <Link to="/docs/customization" style={{ color: 'var(--ac-text)' }}>/docs/customization</Link> for the full table.
          </p>
        </div>
      </Section>
    </ComponentDoc>
  )
}
