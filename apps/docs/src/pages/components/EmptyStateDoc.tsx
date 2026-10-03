import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Anatomy', id: 'anatomy' },
]

export default function EmptyStateDoc() {
  return (
    <ComponentDoc
      slug="empty-state"
      name="Empty state"
      description="A placeholder for screens with nothing to show yet. On mount the content staggers in, 40ms apart."
      toc={TOC}
      preview={
        <div
          style={{
            width: '100%', maxWidth: 460, border: '1px dashed var(--line-2)', borderRadius: 12,
            background: 'var(--bg-1)',
            padding: '44px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 8, textAlign: 'center',
          }}
        >
          <span style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'var(--fg-2)', marginBottom: 6 }}>
            ▦
          </span>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>No deployments yet</span>
          <span style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.55, maxWidth: 260 }}>
            Push to a connected branch or create a deployment manually to see it here.
          </span>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button
              type="button"
              style={{
                height: 32, padding: '0 14px', borderRadius: 7, fontSize: 13, fontWeight: 500,
                fontFamily: 'inherit', background: 'var(--ac)', color: 'var(--ac-fg)',
                border: '1px solid var(--ac)', cursor: 'pointer',
              }}
            >
              Deploy now
            </button>
            <button type="button" className="vl-btn vl-btn--sm vl-btn--ghost">Read docs</button>
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ EmptyState }'} <span className="p">from</span> <span className="s">"@/components/ui/empty-state"</span>
          {'\n\n'}
          <span className="p">&lt;</span>EmptyState{'\n'}
          {'  '}<span className="p">icon=</span>{'{'}<span className="p">&lt;</span>GridIcon <span className="p">/&gt;</span>{'}'}{'\n'}
          {'  '}<span className="p">title=</span><span className="s">"No deployments yet"</span>{'\n'}
          {'  '}<span className="p">description=</span><span className="s">"Push to a connected branch to get started."</span>{'\n'}
          {'  '}<span className="p">action=</span>{'{'}<span className="p">&lt;</span>Button<span className="p">&gt;</span>Create deployment<span className="p">&lt;/</span>Button<span className="p">&gt;</span>{'}'}{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="anatomy" title="Anatomy">
        <div className="vl-panel" style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 28px', fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.55 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg)' }}>Icon</span>
          <span>Optional. One symbol in a 40px square — sets context, never decoration.</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg)' }}>Title</span>
          <span>State the fact plainly: "No deployments yet", not "Whoops!".</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg)' }}>Description</span>
          <span>One sentence explaining how the state resolves. Keep it under 100 characters.</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg)' }}>Actions</span>
          <span>One primary action, at most one ghost secondary. Never three.</span>
        </div>
      </Section>
    </ComponentDoc>
  )
}
