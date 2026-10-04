import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { ComponentDoc, Section, CodeBlock } from '../../components/ComponentDoc'

type Tone = 'ok' | 'err' | 'warn'

function Toast({
  tone, title, body, action, bar, style,
}: { tone: Tone; title: string; body: ReactNode; action?: ReactNode; bar?: string; style?: CSSProperties }) {
  const glyph = tone === 'ok' ? '✓' : '!'
  return (
    <div
      style={{
        position: 'relative', display: 'flex', gap: 12, width: 360, overflow: 'hidden',
        padding: '14px 16px', border: '1px solid var(--line-2)', borderRadius: 10,
        background: 'var(--bg-2)', boxShadow: 'var(--shadow-lg)',
        ...style,
      }}
    >
      <div
        style={{
          width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 600,
          background: `color-mix(in oklch, var(--${tone}) 20%, transparent)`,
          color: `var(--${tone})`,
        }}
      >
        {glyph}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--fg)' }}>{title}</div>
        <div style={{ fontSize: 12.5, color: 'var(--fg-3)', lineHeight: 1.5 }}>{body}</div>
      </div>
      {action}
      <span style={{ color: 'var(--fg-3)', fontSize: 12, alignSelf: 'center' }}>✕</span>
      {bar && (
        <div
          style={{
            position: 'absolute', left: 0, bottom: 0, height: 2,
            width: bar, background: `var(--${tone})`,
          }}
        />
      )}
    </div>
  )
}

const QUEUE: { tone: Tone; title: string; body: string }[] = [
  { tone: 'ok', title: 'Deployed to production', body: 'v1.0.4 is live in 14 regions · 38s' },
  { tone: 'warn', title: 'Approaching bandwidth limit', body: '82% of the 1 TB included this cycle' },
  { tone: 'ok', title: 'Invite sent', body: 'mara@acme.co can now view this project' },
  { tone: 'err', title: 'Build failed', body: "Type error in app/layout.tsx:42" },
]

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Variants', id: 'variants' },
  { label: 'Stacking', id: 'stacking' },
  { label: 'Behavior', id: 'behavior' },
]

const STACK_STYLES: CSSProperties[] = [
  {},
  { transform: 'translateY(-64px) scale(.96)', opacity: 0.8 },
  { transform: 'translateY(-124px) scale(.92)', opacity: 0.45, filter: 'blur(.6px)' },
]

export default function ToastDoc() {
  const [toasts, setToasts] = useState<{ id: number; tone: Tone; title: string; body: string }[]>([
    { id: 0, ...QUEUE[0] },
  ])
  const push = () => {
    setToasts((t) => {
      const next = QUEUE[t.length % QUEUE.length]
      return [...t, { id: Date.now(), ...next }].slice(-3)
    })
  }

  const preview = (
    <div style={{ position: 'relative', width: '100%', maxWidth: 560, height: 260 }}>
      <span className="vl-label" style={{ position: 'absolute', top: 0, left: 0 }}>
        region · bottom-right · max 3 · aria-live polite
      </span>
      <button className="vl-btn vl-btn--sm vl-btn--outline" style={{ position: 'absolute', top: -6, right: 0 }} onClick={push}>
        Push toast
      </button>
      <div style={{ position: 'absolute', right: 0, bottom: 0 }}>
        {toasts.map((t, i) => {
          const depth = toasts.length - 1 - i
          return (
            <Toast
              key={t.id}
              tone={t.tone}
              title={t.title}
              body={t.body}
              action={depth === 0 ? <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ac-text)', alignSelf: 'center' }}>View</span> : undefined}
              bar={depth === 0 ? '60%' : undefined}
              style={
                depth === 0
                  ? { transition: 'transform .18s' }
                  : {
                      position: 'absolute', right: 0, bottom: 0,
                      ...STACK_STYLES[Math.min(depth, 2)],
                      transition: 'transform .18s, opacity .18s',
                    }
              }
            />
          )
        })}
      </div>
    </div>
  )

  const usage = (
    <>
      <span className="p">import</span> {'{'} toast {'}'} <span className="p">from</span> <span className="s">"veloce-ui"</span>{'\n'}
      {'\n'}
      toast.success(<span className="s">"Deploy succeeded"</span>, {'{'} description: <span className="s">"main · 42s"</span> {'}'}){'\n'}
      toast.error(<span className="s">"Build failed"</span>, {'{'} action: {'{'} label: <span className="s">"View logs"</span>, onClick: viewLogs {'}'} {'}'}){'\n'}
      {'\n'}
      <span className="p">await</span> toast.promise(deploy(), {'{'}{'\n'}
      {'  '}loading: <span className="s">"Deploying…"</span>,{'\n'}
      {'  '}success: (d) <span className="p">{'=>'}</span> <span className="s">`Live in ${'{'}d.regions{'}'} regions`</span>,{'\n'}
      {'  '}error: <span className="s">"Deploy failed"</span>,{'\n'}
      {'}'})
    </>
  )

  return (
    <ComponentDoc
      slug="toast"
      name="Toast"
      description="Ephemeral notifications that stack from the corner, pause on hover, and morph in place with toast.promise. Announced politely to screen readers."
      preview={preview}
      usage={usage}
      toc={TOC}
    >
      <Section id="variants" title="Variants">
        <div className="vl-stage--sm" style={{ border: '1px solid var(--line)', borderRadius: 12, padding: 28, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
          <Toast tone="ok" title="Domain verified" body="veloce.app now points to this project" />
          <Toast tone="warn" title="Approaching bandwidth limit" body="82% of the 1 TB included this cycle" action={<span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ac-text)', alignSelf: 'center' }}>Upgrade</span>} />
          <Toast tone="err" title="Build failed" body="'Session' is not assignable to 'User'" action={<span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ac-text)', alignSelf: 'center' }}>Logs</span>} />
        </div>
        <CodeBlock>
          toast(<span className="s">"Saved"</span>){'\n'}
          toast.success(<span className="s">"Domain verified"</span>){'\n'}
          toast.warning(<span className="s">"Approaching bandwidth limit"</span>){'\n'}
          toast.error(<span className="s">"Build failed"</span>)
        </CodeBlock>
      </Section>
      <Section id="stacking" title="Stacking">
        <div style={{ position: 'relative', height: 240, border: '1px solid var(--line)', borderRadius: 12, padding: 24, overflow: 'hidden' }}>
          <span style={{ position: 'absolute', top: 16, left: 20, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
            stack 180ms
          </span>
          <div style={{ position: 'absolute', right: 24, bottom: 24 }}>
            <Toast
              tone="ok"
              title="Invite sent"
              body="mara@acme.co can now view this project"
              style={{ position: 'absolute', right: 0, bottom: 0, ...STACK_STYLES[2] }}
            />
            <Toast
              tone="warn"
              title="Approaching bandwidth limit"
              body="82% of the 1 TB included this cycle"
              style={{ position: 'absolute', right: 0, bottom: 0, ...STACK_STYLES[1] }}
            />
            <Toast
              tone="ok"
              title="Deployed to production"
              body="v1.0.4 is live in 14 regions · 38s"
              bar="60%"
              style={{ position: 'absolute', right: 0, bottom: 0 }}
            />
          </div>
        </div>
      </Section>
      <Section id="behavior" title="Behavior">
        <div className="vl-panel" style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 28px', fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.55 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg)' }}>Region</span>
          <span>Toasts render bottom-right with at most 3 visible; older toasts recede into the stack.</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg)' }}>Promise</span>
          <span><code style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5 }}>toast.promise</code> morphs loading → success in place — no dismiss-and-replace.</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg)' }}>A11y</span>
          <span>The region is <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5 }}>aria-live="polite"</code> — announced without interrupting.</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg)' }}>Timers</span>
          <span>Dismiss timers pause on hover and resume when the pointer leaves.</span>
        </div>
      </Section>
    </ComponentDoc>
  )
}
