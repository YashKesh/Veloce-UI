import { useState } from 'react'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'States', id: 'states' },
]

function Toggle({ on, disabled, focus, onClick }: { on: boolean; disabled?: boolean; focus?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={onClick}
      className={`vl-switch${on ? ' vl-switch--on' : ''}${focus ? ' vl-switch--focus' : ''}`}
      style={{ display: 'block', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.45 : undefined }}
    >
      <span className="thumb" />
    </button>
  )
}

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
            <Toggle on={notify} onClick={() => setNotify((v) => !v)} />
            <span style={{ flex: 1 }}>Deploy notifications</span>
            <span className={`vl-badge ${notify ? 'vl-badge--accent' : 'vl-badge--outline'}`}>{notify ? 'On' : 'Off'}</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 13.5, color: 'var(--fg)' }}>
            <Toggle on={preview} onClick={() => setPreview((v) => !v)} />
            <span style={{ flex: 1 }}>Preview deployments</span>
            <span className={`vl-badge ${preview ? 'vl-badge--accent' : 'vl-badge--outline'}`}>{preview ? 'On' : 'Off'}</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 13.5, color: 'var(--fg-3)' }}>
            <Toggle on={false} disabled />
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
          {'  '}<span className="p">label=</span><span className="s">"Deploy notifications"</span>{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="states" title="States">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <span className="vl-switch" style={{ display: 'block' }}><span className="thumb" /></span>
            off
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <span className="vl-switch vl-switch--on" style={{ display: 'block' }}><span className="thumb" /></span>
            on
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <span className="vl-switch vl-switch--on vl-switch--focus" style={{ display: 'block' }}><span className="thumb" /></span>
            focus
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <span className="vl-switch" style={{ display: 'block', opacity: 0.45 }}><span className="thumb" /></span>
            disabled
          </div>
        </div>
      </Section>
    </ComponentDoc>
  )
}
