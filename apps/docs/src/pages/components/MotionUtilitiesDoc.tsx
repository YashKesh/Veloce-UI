import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Presence, Stagger, NumberFlow } from 'veloce-ui'
import { CodeBlock, ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Presence', id: 'presence' },
  { label: 'Stagger', id: 'stagger' },
  { label: 'NumberFlow', id: 'numberflow' },
]

const btnStyle = {
  padding: '6px 14px', borderRadius: 8, fontSize: 12.5, cursor: 'pointer',
  background: 'var(--bg-1)', color: 'var(--fg-2)', border: '1px solid var(--line)',
  alignSelf: 'flex-start',
} as const

const noteStyle = {
  fontSize: 13.5, lineHeight: 1.55, color: 'var(--fg-2)',
} as const

function PresenceDemo() {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', minHeight: 64 }}>
      <button type="button" style={btnStyle} onClick={() => setOpen((o) => !o)}>
        {open ? 'Unmount' : 'Mount'}
      </button>
      <Presence show={open}>
        <div className="vl-panel" style={{ padding: '12px 16px', fontSize: 12.5, color: 'var(--fg-2)', width: 210, border: '1px solid var(--line)', borderRadius: 8 }}>
          Mounted with a 200ms enter. Exits over 150ms, then unmounts.
        </div>
      </Presence>
    </div>
  )
}

function StaggerDemo() {
  const [run, setRun] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <button type="button" style={btnStyle} onClick={() => setRun((n) => n + 1)}>Replay</button>
      <div style={{ width: 210 }}>
        <Stagger key={run} gap={60}>
          {['Deployments', 'Analytics', 'Logs', 'Settings'].map((label) => (
            <div
              key={label}
              style={{
                padding: '7px 12px', border: '1px solid var(--line)', borderRadius: 7,
                background: 'var(--bg-1)', fontSize: 12.5, color: 'var(--fg-2)',
                marginBottom: 6,
              }}
            >
              {label}
            </div>
          ))}
        </Stagger>
      </div>
    </div>
  )
}

function NumberFlowDemo() {
  const [target, setTarget] = useState(1240)
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
      <button type="button" style={btnStyle} onClick={() => setTarget(Math.floor(Math.random() * 9000) + 500)}>
        Randomize
      </button>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 28, color: 'var(--fg)', fontVariantNumeric: 'tabular-nums' }}>
        <NumberFlow value={target} />
      </span>
    </div>
  )
}

function PreviewLabel({ children }: { children: string }) {
  return <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>{children}</span>
}

export default function MotionUtilitiesDoc() {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [hash])

  return (
    <ComponentDoc
      slug="motion-utilities"
      name="Motion utilities"
      description="Three JS helpers for what CSS can't express — exit animations, stagger choreography and value tweening. Each respects prefers-reduced-motion."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, minWidth: 340 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <PreviewLabel>{'<Presence>'}</PreviewLabel>
            <PresenceDemo />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <PreviewLabel>{'<Stagger gap={60}>'}</PreviewLabel>
            <StaggerDemo />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <PreviewLabel>{'<NumberFlow>'}</PreviewLabel>
            <NumberFlowDemo />
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Presence, Stagger, NumberFlow }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
        </>
      }
    >
      <Section id="presence" title="Presence">
        <p style={noteStyle}>
          CSS can animate an element in, but can't keep it mounted while it animates out.{' '}
          <code>&lt;Presence&gt;</code> watches the <code>show</code> prop, plays the exit choreography (150ms), and only then unmounts.
        </p>
        <div className="vl-panel" style={{ padding: '22px 24px' }}>
          <PresenceDemo />
        </div>
        <CodeBlock>
          <span className="p">&lt;</span>Presence <span className="p">show=</span>{'{'}open{'}'}<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Card <span className="p">/&gt;</span>{'\n'}
          <span className="p">&lt;/</span>Presence<span className="p">&gt;</span>
        </CodeBlock>
      </Section>

      <Section id="stagger" title="Stagger">
        <p style={noteStyle}>
          Offsets each child's enter animation by a fixed gap — lists land as a wave instead of a block. Default gap 60ms.
        </p>
        <div className="vl-panel" style={{ padding: '22px 24px' }}>
          <StaggerDemo />
        </div>
        <CodeBlock>
          <span className="p">&lt;</span>Stagger <span className="p">gap=</span>{'{'}60{'}'}<span className="p">&gt;</span>{'\n'}
          {'  '}{'{'}items.map((item) <span className="p">=&gt;</span> <span className="p">&lt;</span>Row <span className="p">key=</span>{'{'}item.id{'}'} <span className="p">/&gt;</span>){'}'}{'\n'}
          <span className="p">&lt;/</span>Stagger<span className="p">&gt;</span>
        </CodeBlock>
      </Section>

      <Section id="numberflow" title="NumberFlow">
        <p style={noteStyle}>
          Tweens between numeric values with an eased count and tabular numerals, so digits don't jitter horizontally.
        </p>
        <div className="vl-panel" style={{ padding: '22px 24px' }}>
          <NumberFlowDemo />
        </div>
        <CodeBlock>
          <span className="p">&lt;</span>NumberFlow <span className="p">value=</span>{'{'}revenue{'}'} <span className="p">/&gt;</span>
        </CodeBlock>
      </Section>
    </ComponentDoc>
  )
}
