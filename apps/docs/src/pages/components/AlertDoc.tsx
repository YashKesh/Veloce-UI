import { useState } from 'react'
import { Alert } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Tones', id: 'tones' },
]

export default function AlertDoc() {
  const [visible, setVisible] = useState(true)

  return (
    <ComponentDoc
      slug="alert"
      name="Alert"
      description="A static status callout. Only dismissal animates (fade 150ms)."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 440 }}>
          <Alert tone="info" title="Heads up">A new CLI version is available. Run <code>veloce upgrade</code> to update.</Alert>
          {visible && (
            <Alert tone="ok" title="Deployment live" onDismiss={() => setVisible(false)}>
              veloce-docs deployed to production in 34s.
            </Alert>
          )}
          <Alert tone="warn" title="Approaching limit">You've used 87% of your build minutes this cycle.</Alert>
          <Alert tone="err" title="Build failed">Module not found: <code>'@/components/ui/sheet'</code> at line 3.</Alert>
          {!visible && (
            <button
              onClick={() => setVisible(true)}
              style={{ alignSelf: 'flex-start', fontSize: 12.5, color: 'var(--ac-text)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Restore dismissed alert
            </button>
          )}
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Alert }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Alert{'\n'}
          {'  '}<span className="p">tone=</span><span className="s">"ok"</span>{'\n'}
          {'  '}<span className="p">title=</span><span className="s">"Deployment live"</span>{'\n'}
          {'  '}<span className="p">onDismiss=</span>{'{'}() <span className="p">=&gt;</span> setVisible(<span className="p">false</span>){'}'}{'\n'}
          <span className="p">&gt;</span>{'\n'}
          {'  '}veloce-docs deployed to production in 34s.{'\n'}
          <span className="p">&lt;/</span>Alert<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="tones" title="Tones">
        <div className="vl-panel" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Alert tone="info" title="info">Neutral context, product news, tips.</Alert>
          <Alert tone="ok" title="ok">Confirmed actions, completed deploys.</Alert>
          <Alert tone="warn" title="warn">Limits, deprecations, risky actions.</Alert>
          <Alert tone="err" title="err">Failures that block the user's task.</Alert>
        </div>
      </Section>
    </ComponentDoc>
  )
}
