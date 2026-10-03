import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Variants', id: 'variants' },
]

function Alert({
  tone, title, body, dismissible,
}: { tone: 'info' | 'success' | 'warning' | 'error'; title: string; body: string; dismissible?: boolean }) {
  const styles: Record<string, { border: string; bg: string; iconBg: string; iconColor: string; icon: string }> = {
    info: {
      border: '1px solid var(--ac-line)',
      bg: 'var(--ac-soft)',
      iconBg: 'var(--ac)',
      iconColor: '#fff',
      icon: '!',
    },
    success: {
      border: '1px solid color-mix(in oklab, var(--ok) 35%, transparent)',
      bg: 'color-mix(in oklab, var(--ok) 10%, transparent)',
      iconBg: 'var(--ok)',
      iconColor: 'oklch(0.15 0 0)',
      icon: '✓',
    },
    warning: {
      border: '1px solid color-mix(in oklab, var(--warn) 35%, transparent)',
      bg: 'color-mix(in oklab, var(--warn) 10%, transparent)',
      iconBg: 'var(--warn)',
      iconColor: 'oklch(0.15 0 0)',
      icon: '!',
    },
    error: {
      border: '1px solid color-mix(in oklab, var(--err) 40%, transparent)',
      bg: 'color-mix(in oklab, var(--err) 10%, transparent)',
      iconBg: 'var(--err)',
      iconColor: '#fff',
      icon: '!',
    },
  }
  const s = styles[tone]
  return (
    <div style={{ display: 'flex', gap: 12, padding: '12px 14px', border: s.border, background: s.bg, borderRadius: 9, alignItems: 'flex-start' }}>
      <span style={{ width: 18, height: 18, borderRadius: '50%', background: s.iconBg, color: s.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
        {s.icon}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fg)' }}>{title}</span>
        <span style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}>{body}</span>
      </div>
      {dismissible && (
        <button type="button" aria-label="Dismiss" style={{ background: 'none', border: 'none', color: 'var(--fg-3)', cursor: 'pointer', fontSize: 13, padding: 2, lineHeight: 1 }}>
          ✕
        </button>
      )}
    </div>
  )
}

export default function AlertDoc() {
  return (
    <ComponentDoc
      slug="alert"
      name="Alert"
      description="Alerts are static by design — only dismissal animates (fade 150ms)."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 440 }}>
          <Alert tone="info" title="Heads up" body="A new CLI version is available. Run veloce upgrade to update." />
          <Alert tone="success" title="Deployment live" body="veloce-docs deployed to production in 34s." dismissible />
          <Alert tone="warning" title="Approaching limit" body="You've used 87% of your build minutes this cycle." />
          <Alert tone="error" title="Build failed" body="Module not found: '@/components/ui/sheet' at line 3." />
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Alert }'} <span className="p">from</span> <span className="s">"@/components/ui/alert"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Alert{'\n'}
          {'  '}<span className="p">variant=</span><span className="s">"success"</span>{'\n'}
          {'  '}<span className="p">title=</span><span className="s">"Deployment live"</span>{'\n'}
          {'  '}<span className="p">onDismiss=</span>{'{'}() <span className="p">=&gt;</span> setVisible(<span className="p">false</span>){'}'}{'\n'}
          <span className="p">&gt;</span>{'\n'}
          {'  '}veloce-docs deployed to production in 34s.{'\n'}
          <span className="p">&lt;/</span>Alert<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="variants" title="Variants">
        <div className="vl-panel" style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'auto auto 1fr', gap: '12px 28px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-2)', alignItems: 'center' }}>
          <span style={{ color: 'var(--fg-3)' }}>variant</span>
          <span style={{ color: 'var(--fg-3)' }}>token</span>
          <span style={{ color: 'var(--fg-3)' }}>use case</span>

          <span style={{ color: 'var(--ac-text)' }}>info</span>
          <span>--ac-line / --ac-soft</span>
          <span>Neutral context, product news, tips</span>

          <span style={{ color: 'var(--ok)' }}>success</span>
          <span>--ok</span>
          <span>Confirmed actions, completed deploys</span>

          <span style={{ color: 'var(--warn)' }}>warning</span>
          <span>--warn</span>
          <span>Limits, deprecations, risky actions</span>

          <span style={{ color: 'var(--err)' }}>error</span>
          <span>--err</span>
          <span>Failures that block the user's task</span>
        </div>
      </Section>
    </ComponentDoc>
  )
}
