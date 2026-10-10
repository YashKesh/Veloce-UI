import { ToastProvider, useToast, Button } from 'veloce-ui'
import { ComponentDoc, Section, CodeBlock } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Tones', id: 'tones' },
  { label: 'Behavior', id: 'behavior' },
]

function ToastButtons() {
  const toast = useToast()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button variant="outline" onClick={() => toast({ title: 'Saved', description: 'Draft stored locally.' })}>
          Neutral
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast({
              tone: 'ok',
              title: 'Deployed to production',
              description: 'v1.0.4 is live in 14 regions · 38s',
              action: { label: 'View', onClick: () => alert('deploy page') },
            })
          }
        >
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast({
              tone: 'warn',
              title: 'Approaching bandwidth limit',
              description: '82% of the 1 TB included this cycle',
            })
          }
        >
          Warning
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast({
              tone: 'err',
              title: 'Build failed',
              description: "Type error in app/layout.tsx:42",
              action: { label: 'Logs', onClick: () => alert('log viewer') },
            })
          }
        >
          Error
        </Button>
      </div>
      <Button
        variant="ghost"
        onClick={() => {
          toast.dismissAll()
        }}
      >
        Dismiss all
      </Button>
      <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>Toasts stack bottom-right · hover to pause auto-dismiss</span>
    </div>
  )
}

export default function ToastDoc() {
  return (
    <ComponentDoc
      slug="toast"
      name="Toast"
      description="Ephemeral notifications that stack from the corner, pause on hover, and announce politely to screen readers."
      toc={TOC}
      preview={
        <>
          <ToastProvider position="bottom-right" />
          <ToastButtons />
        </>
      }
      usage={
        <>
          <span className="p">import</span> {'{ ToastProvider, useToast }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="g">// Mount once at the root of your app</span>{'\n'}
          <span className="p">&lt;</span>ToastProvider position=<span className="s">"bottom-right"</span> <span className="p">/&gt;</span>
          {'\n\n'}
          <span className="g">// Then inside any component</span>{'\n'}
          <span className="p">const</span> toast = useToast(){'\n'}
          toast({'{ tone: '}<span className="s">"ok"</span>{', title: '}<span className="s">"Saved"</span>{' }'})
        </>
      }
    >
      <Section id="tones" title="Tones">
        <div className="vl-panel" style={{ padding: '20px 24px' }}>
          <CodeBlock>
            toast(<span className="s">"Saved"</span>){'\n'}
            toast({'{ tone: '}<span className="s">"ok"</span>{', title: '}<span className="s">"Domain verified"</span>{' }'}){'\n'}
            toast({'{ tone: '}<span className="s">"warn"</span>{', title: '}<span className="s">"Approaching limit"</span>{' }'}){'\n'}
            toast({'{ tone: '}<span className="s">"err"</span>{', title: '}<span className="s">"Build failed"</span>{' }'})
          </CodeBlock>
        </div>
      </Section>
      <Section id="behavior" title="Behavior">
        <div className="vl-panel" style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 28px', fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.55 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg)' }}>Region</span>
          <span>Toasts render bottom-right by default. Pass <code>position</code> to the provider to move them.</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg)' }}>Dismiss</span>
          <span>Each toast returns an id. Call <code>toast.dismiss(id)</code> or <code>toast.dismissAll()</code>.</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg)' }}>A11y</span>
          <span>The region is <code>aria-live="polite"</code> — announced without interrupting.</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg)' }}>Timers</span>
          <span>Auto-dismiss pauses while the pointer is over the stack.</span>
        </div>
      </Section>
    </ComponentDoc>
  )
}
