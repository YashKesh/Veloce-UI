import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CodeBlock, ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Presence', id: 'presence' },
  { label: 'Stagger', id: 'stagger' },
  { label: 'NumberFlow', id: 'numberflow' },
  { label: 'useMotionPreference', id: 'use-motion-preference' },
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
  const [closing, setClosing] = useState(false)

  const toggle = () => {
    if (open && !closing) {
      setClosing(true)
    } else if (!open) {
      setOpen(true)
    }
  }

  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', minHeight: 64 }}>
      <button type="button" style={btnStyle} onClick={toggle}>{open && !closing ? 'Unmount' : 'Mount'}</button>
      {open && (
        <div
          className="vl-panel"
          onAnimationEnd={() => {
            if (closing) {
              setClosing(false)
              setOpen(false)
            }
          }}
          style={{
            padding: '12px 16px', fontSize: 12.5, color: 'var(--fg-2)', width: 210,
            animation: closing
              ? 'vl-in .15s cubic-bezier(.4,0,1,1) reverse both'
              : 'vl-in .2s cubic-bezier(.16,1,.3,1) both',
          }}
        >
          {closing ? 'Exiting — 150ms, then unmount.' : 'Mounted with a 200ms enter.'}
        </div>
      )}
    </div>
  )
}

function StaggerDemo() {
  const [run, setRun] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <button type="button" style={btnStyle} onClick={() => setRun((n) => n + 1)}>Replay</button>
      <div key={run} style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 210 }}>
        {['Deployments', 'Analytics', 'Logs', 'Settings'].map((label, i) => (
          <div
            key={label}
            style={{
              padding: '7px 12px', border: '1px solid var(--line)', borderRadius: 7,
              background: 'var(--bg-1)', fontSize: 12.5, color: 'var(--fg-2)',
              animation: 'vl-in .35s cubic-bezier(.16,1,.3,1) both',
              animationDelay: i * 60 + 'ms',
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}

function NumberFlowDemo() {
  const [target, setTarget] = useState(1240)
  const [display, setDisplay] = useState(1240)
  const fromRef = useRef(1240)

  useEffect(() => {
    const from = fromRef.current
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 500)
      const eased = 1 - Math.pow(1 - t, 3)
      const value = Math.round(from + (target - from) * eased)
      setDisplay(value)
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        fromRef.current = target
      }
    }
    raf = requestAnimationFrame(tick)
    return () => {
      fromRef.current = target
      cancelAnimationFrame(raf)
    }
  }, [target])

  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
      <button type="button" style={btnStyle} onClick={() => setTarget(Math.floor(Math.random() * 9000) + 500)}>
        Randomize
      </button>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 28, color: 'var(--fg)', fontVariantNumeric: 'tabular-nums' }}>
        {display.toLocaleString()}
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
      description="Three JS helpers for what CSS can't express — exit animations, stagger choreography and value tweening. Each ships as an independent utility; each respects prefers-reduced-motion."
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
          <span className="p">import</span> {'{ Presence, Stagger, NumberFlow }'} <span className="p">from</span> <span className="s">"@/components/motion"</span>
        </>
      }
    >
      <Section id="presence" title="Presence">
        <p style={noteStyle}>
          CSS can animate an element in, but it can't keep it in the DOM while it animates out.{' '}
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--fg)' }}>&lt;Presence&gt;</code>{' '}
          watches its <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--fg)' }}>show</code> prop,
          plays the exit choreography (150ms, ease-in), and only then unmounts. Click Unmount below and watch the panel
          leave instead of vanishing.
        </p>
        <div className="vl-panel" style={{ padding: '22px 24px' }}>
          <PresenceDemo />
        </div>
        <CodeBlock>
          <span className="p">&lt;</span>Presence <span className="p">show=</span>{'{'}open{'}'} <span className="p">exit=</span><span className="s">"scale-fade"</span><span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Card <span className="p">/&gt;</span>{'\n'}
          <span className="p">&lt;/</span>Presence<span className="p">&gt;</span>
        </CodeBlock>
      </Section>

      <Section id="stagger" title="Stagger">
        <p style={noteStyle}>
          Offsets each child's enter animation by a fixed gap — lists land as a wave instead of a block. The default gap
          is 60ms; the four rules cap total choreography at 400ms, so long lists clamp automatically.
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
          Tweens between numeric values with an eased 500ms count and tabular numerals, so digits don't jitter
          horizontally. Under reduced motion the value snaps instantly.
        </p>
        <div className="vl-panel" style={{ padding: '22px 24px' }}>
          <NumberFlowDemo />
        </div>
        <CodeBlock>
          <span className="p">&lt;</span>NumberFlow <span className="p">value=</span>{'{'}revenue{'}'} <span className="p">duration=</span>{'{'}500{'}'} <span className="p">/&gt;</span>
        </CodeBlock>
      </Section>

      <Section id="use-motion-preference" title="useMotionPreference">
        <p style={noteStyle}>
          Every utility above respects this hook internally. It reads{' '}
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--fg)' }}>prefers-reduced-motion</code>{' '}
          plus the site-level override, and re-renders when either changes — use it to gate any custom animation you
          write yourself. When reduced motion is on, Presence unmounts instantly, Stagger drops its delays and
          NumberFlow snaps to the target value.
        </p>
        <CodeBlock>
          <span className="p">const</span> reduced <span className="p">=</span> useMotionPreference(){'\n'}
          {'\n'}
          <span className="p">&lt;</span>div <span className="p">style=</span>{'{{'} animation: reduced ? <span className="s">"none"</span> : <span className="s">"vl-in .2s both"</span> {'}}'} <span className="p">/&gt;</span>
        </CodeBlock>
      </Section>
    </ComponentDoc>
  )
}
