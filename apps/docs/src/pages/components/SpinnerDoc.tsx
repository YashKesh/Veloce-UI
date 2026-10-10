import { Spinner, Button } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'When to use', id: 'usage-notes' },
]

export default function SpinnerDoc() {
  return (
    <ComponentDoc
      slug="spinner"
      name="Spinner"
      description="An indeterminate loading indicator — a single 700ms rotation, linear, no easing tricks."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 36, alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <Spinner size={14} color="var(--fg-3)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>sm</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <Spinner size={20} color="var(--fg-2)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>md</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <Spinner size={28} color="var(--ac)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>lg</span>
            </div>
          </div>
          <Button variant="primary" disabled>
            <Spinner size={14} color="currentColor" />
            Deploying…
          </Button>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Spinner, Button }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Button <span className="p">disabled</span><span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Spinner <span className="p">size=</span>{'{'}14{'}'} <span className="p">/&gt;</span>{'\n'}
          {'  '}Deploying…{'\n'}
          <span className="p">&lt;/</span>Button<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="usage-notes" title="When to use">
        <div className="vl-panel" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.55 }}>
          <span><strong style={{ color: 'var(--fg)' }}>Spinner</strong> — unknown waits under 2 seconds, like a button submit or a quick fetch.</span>
          <span><strong style={{ color: 'var(--fg)' }}>Skeleton</strong> — content loads where layout is known ahead of time.</span>
          <span><strong style={{ color: 'var(--fg)' }}>Progress</strong> — whenever a percentage is actually known; never fake it.</span>
        </div>
      </Section>
    </ComponentDoc>
  )
}
