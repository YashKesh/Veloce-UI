import { useState } from 'react'
import { AlertDialog } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Tones', id: 'tones' },
]

export default function AlertDialogDoc() {
  const [destroy, setDestroy] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [confirmedCount, setConfirmedCount] = useState(0)

  return (
    <ComponentDoc
      slug="alert-dialog"
      name="AlertDialog"
      description="A blocking confirmation dialog. Use for destructive or irreversible actions where a plain Dialog would be too soft. Focus starts on the confirm button."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={() => setDestroy(true)}
            style={{
              padding: '8px 14px', borderRadius: 8, background: 'var(--err)',
              color: 'oklch(0.99 0 0)', fontSize: 13.5, fontWeight: 500,
              cursor: 'pointer', border: '1px solid transparent',
            }}
          >
            Delete workspace
          </button>
          <span style={{ fontSize: 12.5, color: 'var(--fg-3)' }}>
            Try Esc, click outside, or either button.
          </span>
          <AlertDialog
            open={destroy}
            onOpenChange={setDestroy}
            title="Delete workspace?"
            description="This permanently removes acme-design and its 14 projects. This can't be undone."
            confirmLabel="Delete"
            cancelLabel="Keep workspace"
            tone="destructive"
            onConfirm={() => setConfirmedCount((n) => n + 1)}
          />
          {confirmedCount > 0 && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ac-text)' }}>
              deleted {confirmedCount}×
            </span>
          )}
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ AlertDialog }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>AlertDialog{'\n'}
          {'  '}<span className="p">open=</span>{'{'}open{'}'}{'\n'}
          {'  '}<span className="p">onOpenChange=</span>{'{'}setOpen{'}'}{'\n'}
          {'  '}<span className="p">title=</span><span className="s">"Delete workspace?"</span>{'\n'}
          {'  '}<span className="p">description=</span><span className="s">"This can't be undone."</span>{'\n'}
          {'  '}<span className="p">tone=</span><span className="s">"destructive"</span>{'\n'}
          {'  '}<span className="p">onConfirm=</span>{'{'}handleDelete{'}'}{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="tones" title="Tones">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', gap: 14 }}>
          <button
            onClick={() => setConfirm(true)}
            style={{
              padding: '8px 14px', borderRadius: 8, background: 'var(--ac)', color: 'var(--ac-fg)',
              fontSize: 13.5, fontWeight: 500, cursor: 'pointer', border: '1px solid transparent',
            }}
          >
            Confirm change
          </button>
          <AlertDialog
            open={confirm}
            onOpenChange={setConfirm}
            title="Switch to Pro plan?"
            description="You'll be billed $20/mo starting today. You can cancel anytime."
            confirmLabel="Upgrade"
          />
        </div>
      </Section>
    </ComponentDoc>
  )
}
