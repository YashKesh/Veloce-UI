import { EmptyState, Button } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Anatomy', id: 'anatomy' },
]

export default function EmptyStateDoc() {
  return (
    <ComponentDoc
      slug="empty-state"
      name="Empty state"
      description="A placeholder for screens with nothing to show yet."
      toc={TOC}
      preview={
        <div style={{ width: '100%', maxWidth: 460 }}>
          <EmptyState
            icon={
              <span style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-3)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'var(--fg-2)' }}>
                ▦
              </span>
            }
            title="No deployments yet"
            description="Push to a connected branch or create a deployment manually to see it here."
            action={
              <div style={{ display: 'flex', gap: 10 }}>
                <Button variant="primary">Deploy now</Button>
                <Button variant="ghost">Read docs</Button>
              </div>
            }
          />
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ EmptyState, Button }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>EmptyState{'\n'}
          {'  '}<span className="p">icon=</span>{'{'}<span className="p">&lt;</span>GridIcon <span className="p">/&gt;</span>{'}'}{'\n'}
          {'  '}<span className="p">title=</span><span className="s">"No deployments yet"</span>{'\n'}
          {'  '}<span className="p">description=</span><span className="s">"Push to a connected branch to get started."</span>{'\n'}
          {'  '}<span className="p">action=</span>{'{'}<span className="p">&lt;</span>Button<span className="p">&gt;</span>Deploy now<span className="p">&lt;/</span>Button<span className="p">&gt;</span>{'}'}{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="anatomy" title="Anatomy">
        <div className="vl-panel" style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 28px', fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.55 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg)' }}>icon</span>
          <span>Optional. One symbol in a 40px square — sets context, never decoration.</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg)' }}>title</span>
          <span>State the fact plainly: "No deployments yet", not "Whoops!".</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg)' }}>description</span>
          <span>One sentence explaining how the state resolves. Keep it under 100 characters.</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg)' }}>action</span>
          <span>One primary action, at most one ghost secondary. Never three.</span>
        </div>
      </Section>
    </ComponentDoc>
  )
}
