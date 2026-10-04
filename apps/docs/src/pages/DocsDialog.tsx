import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { DocsShell, RightRail } from '../components/DocsShell'
import type { TocItem } from '../components/DocsShell'
import { useTheme } from '../theme'
import { DOCS_SIDEBAR } from '../docsNav'
import { Seo } from '../Seo'

const mono: CSSProperties = { fontFamily: 'var(--font-mono)' }

const TOC: TocItem[] = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Usage', id: 'usage' },
  { label: 'Props', id: 'props' },
  { label: 'Dialog.Content', id: 'props', sub: true },
  { label: 'Dialog.Trigger', id: 'props', sub: true },
  { label: 'Accessibility', id: 'accessibility' },
  { label: 'Motion spec', id: 'motion-spec' },
  { label: 'Examples', id: 'preview' },
]

function H2({ children }: { children: ReactNode }) {
  return <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>{children}</h2>
}

function MiniSwitch({ on }: { on: boolean }) {
  return (
    <span
      style={{
        position: 'relative', width: 28, height: 16, borderRadius: 999, display: 'inline-block',
        background: on ? 'var(--ac)' : 'var(--bg-3)',
        border: on ? 'none' : '1px solid var(--line-2)',
      }}
    >
      <span
        style={{
          position: 'absolute', top: on ? 2 : 1, left: on ? 14 : 1, width: 12, height: 12,
          borderRadius: '50%', background: on ? 'oklch(0.99 0 0)' : 'var(--fg-2)',
        }}
      />
    </span>
  )
}

function CopyButton({ text, style }: { text: string; style?: CSSProperties }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      style={{ ...mono, fontSize: 12.5, color: 'var(--fg-3)', ...style }}
      onClick={() => {
        navigator.clipboard?.writeText(text).catch(() => {})
        setCopied(true)
        setTimeout(() => setCopied(false), 1200)
      }}
    >
      {copied ? '✓ copied' : '⧉ copy'}
    </button>
  )
}

function UsageCode() {
  const p = { color: 'var(--fg-3)' }
  const s = { color: 'var(--ac-text)' }
  const id = { color: 'var(--fg)' }
  return (
    <pre
      className="vl-code"
      style={{ padding: '18px 20px', color: 'var(--fg-2)', margin: 0, border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg-1)', ...mono, fontSize: 13, lineHeight: 1.65, overflow: 'hidden' }}
    >
      <span style={p}>import</span> {'{ Dialog }'} <span style={p}>from</span> <span style={s}>"@/components/ui/dialog"</span>
      {'\n\n'}
      <span style={p}>&lt;</span><span style={id}>Dialog.Root</span><span style={p}>&gt;</span>
      {'\n  '}
      <span style={p}>&lt;</span><span style={id}>Dialog.Trigger</span> <span style={p}>asChild</span><span style={p}>&gt;&lt;</span><span style={id}>Button</span><span style={p}>&gt;</span>Invite<span style={p}>&lt;/</span><span style={id}>Button</span><span style={p}>&gt;&lt;/</span><span style={id}>Dialog.Trigger</span><span style={p}>&gt;</span>
      {'\n  '}
      <span style={p}>&lt;</span><span style={id}>Dialog.Content</span> <span style={p}>motion=</span><span style={s}>"scale-fade"</span> <span style={p}>size=</span><span style={s}>"md"</span><span style={p}>&gt;</span>
      {'\n    '}
      <span style={p}>&lt;</span><span style={id}>Dialog.Title</span><span style={p}>&gt;</span>Invite to acme-design<span style={p}>&lt;/</span><span style={id}>Dialog.Title</span><span style={p}>&gt;</span>
      {'\n    …\n  '}
      <span style={p}>&lt;/</span><span style={id}>Dialog.Content</span><span style={p}>&gt;</span>
      {'\n'}
      <span style={p}>&lt;/</span><span style={id}>Dialog.Root</span><span style={p}>&gt;</span>
    </pre>
  )
}

function PreviewStage({ scrub, replayKey }: { scrub: boolean; replayKey: number }) {
  const [t, setT] = useState(120)
  const [playing, setPlaying] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (playing) return
    const anim = cardRef.current?.getAnimations()[0]
    if (!anim) return
    if (scrub) {
      anim.pause()
      anim.currentTime = t
    } else {
      anim.playbackRate = 1
      anim.play()
    }
  }, [t, scrub, playing])

  useEffect(() => {
    if (!playing) return
    const anim = cardRef.current?.getAnimations()[0]
    if (!anim) {
      setPlaying(false)
      return
    }
    anim.currentTime = 0
    anim.playbackRate = 0.25
    anim.play()
    let raf = requestAnimationFrame(function tick() {
      setT(Math.min(200, Math.round(Number(anim.currentTime ?? 0))))
      raf = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(raf)
  }, [playing])

  return (
    <div
      key={replayKey}
      style={{
        position: 'relative', height: 420,
        background: 'radial-gradient(var(--line) 1px,transparent 1px) 0 0/16px 16px, var(--bg)',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'oklch(0 0 0/.55)', opacity: 0.85 }} />
      {/* dialog frozen mid-enter */}
      <div style={{ position: 'absolute', left: '50%', top: '50%', width: 440, transform: 'translate(-50%,-50%)' }}>
      <div
        ref={cardRef}
        onAnimationEnd={() => {
          if (playing) {
            setPlaying(false)
            setT(200)
          }
        }}
        style={{
          animation: 'vl-in .2s cubic-bezier(.16,1,.3,1) both',
          padding: 24, borderRadius: 12, background: 'var(--bg-2)',
          border: '1px solid var(--line-2)', boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.015em' }}>Invite to acme-design</div>
          <span style={{ color: 'var(--fg-3)', fontSize: 13 }}>✕</span>
        </div>
        <div style={{ marginTop: 6, fontSize: 13.5, lineHeight: 1.5, color: 'var(--fg-2)' }}>
          Teammates get access to all 14 projects. You can change roles later.
        </div>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-2)' }}>Email</div>
          <div
            style={{
              display: 'flex', alignItems: 'center', height: 38, padding: '0 12px', borderRadius: 8,
              border: '1px solid var(--line-2)', background: 'var(--bg-1)', fontSize: 14,
              boxShadow: '0 0 0 2px var(--bg-2), 0 0 0 4px var(--ac)',
            }}
          >
            mara@acme.co
            <span className="vl-caret" style={{ height: 16, marginLeft: 1 }} />
          </div>
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <span style={{ padding: '4px 10px', borderRadius: 6, background: 'var(--ac-soft)', color: 'var(--ac-text)', fontSize: 12.5, fontWeight: 500 }}>Editor ▾</span>
          <span style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid var(--line-2)', color: 'var(--fg-2)', fontSize: 12.5 }}>All projects ▾</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <span className="vl-btn vl-btn--md vl-btn--outline">Cancel</span>
          <span className="vl-btn vl-btn--md vl-btn--solid">Send invite</span>
        </div>
      </div>
      </div>
      {/* timeline scrubber */}
      {scrub && (
      <div
        style={{
          position: 'absolute', left: 16, right: 16, bottom: 14, display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 12px', borderRadius: 8, background: 'var(--bg-1)', border: '1px solid var(--line)',
          ...mono, fontSize: 11.5, color: 'var(--fg-2)',
        }}
      >
        <button
          aria-label="Play animation"
          onClick={() => {
            setT(0)
            setPlaying(true)
          }}
          style={{ color: 'var(--fg)', ...mono, fontSize: 11.5, padding: 0 }}
        >
          ▶
        </button>
        <span>0ms</span>
        <div style={{ position: 'relative', flex: 1, height: 4, borderRadius: 2, background: 'var(--bg-3)' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(t / 200) * 100}%`, borderRadius: 2, background: 'var(--ac)' }} />
          <div
            style={{
              position: 'absolute', left: `${(t / 200) * 100}%`, top: '50%', width: 12, height: 12, borderRadius: '50%',
              background: 'var(--fg)', transform: 'translate(-50%,-50%)', boxShadow: '0 0 0 3px var(--bg-1)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute', left: `${(t / 200) * 100}%`, top: -26, transform: 'translateX(-50%)',
              padding: '2px 6px', borderRadius: 4, background: 'var(--fg)', color: 'var(--bg)', fontSize: 10.5,
              pointerEvents: 'none',
            }}
          >
            {t}ms
          </div>
          <input
            type="range"
            min={0}
            max={200}
            value={t}
            aria-label="Scrub animation timeline"
            onChange={(e) => {
              setPlaying(false)
              setT(Number(e.target.value))
            }}
            style={{ position: 'absolute', left: 0, top: -10, width: '100%', height: 24, opacity: 0, cursor: 'pointer', margin: 0 }}
          />
        </div>
        <span>200ms</span>
        <span style={{ color: 'var(--fg-3)' }}>·</span>
        <span style={{ color: 'var(--ac-text)' }}>swift-out</span>
      </div>
      )}
    </div>
  )
}

const PROPS_GRID = '160px 240px 110px 1fr'
const PROPS_ROWS: { prop: string; type: string; def: string; desc: string }[] = [
  { prop: 'motion', type: '"scale-fade" | "slide-up" | "none"', def: '"scale-fade"', desc: 'Enter/exit choreography. Falls back to crossfade under reduced motion.' },
  { prop: 'size', type: '"sm" | "md" | "lg" | "full"', def: '"md"', desc: 'Max width: 400 / 480 / 640px, or viewport.' },
  { prop: 'dismissible', type: 'boolean', def: 'true', desc: 'Close on Escape and backdrop click.' },
  { prop: 'initialFocus', type: 'RefObject<HTMLElement>', def: '—', desc: 'Element to focus on open. Defaults to the first tabbable.' },
  { prop: 'onOpenChange', type: '(open: boolean) => void', def: '—', desc: 'Fires after the exit animation completes.' },
]

function CodeSpan({ children }: { children: ReactNode }) {
  return <span style={{ ...mono, fontSize: 12.5, color: 'var(--fg)' }}>{children}</span>
}

export default function DocsDialog() {
  const [tab, setTab] = useState<'preview' | 'code'>('preview')
  const [scrub, setScrub] = useState(true)
  const [replayKey, setReplayKey] = useState(0)
  const { reducedMotion, setReducedMotion } = useTheme()

  const rail = (
    <RightRail
      toc={TOC}
      footer={
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          style={{
            padding: 14, borderRadius: 9, border: '1px solid var(--line)',
            display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, color: 'var(--fg-2)',
          }}
        >
          <span style={{ color: 'var(--fg)', fontWeight: 500 }}>Edit on GitHub ↗</span>
          <span>Last updated 3 days ago</span>
        </a>
      }
    />
  )

  return (
    <DocsShell sidebar={DOCS_SIDEBAR} rail={rail}>
      <Seo
        title="Dialog"
        description="Modal dialog primitive. Portal-rendered, focus-trapped, scroll-locked, Esc-to-close. Composable Header, Body, Footer slots."
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* breadcrumb */}
        <div style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--fg-3)' }}>
          <span>Components</span><span>›</span><span>Overlays</span><span>›</span>
          <span style={{ color: 'var(--fg-2)' }}>Dialog</span>
        </div>

        {/* title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.03em' }}>Dialog</h1>
            <span style={{ ...mono, fontSize: 11.5, padding: '3px 8px', borderRadius: 6, border: '1px solid var(--line-2)', color: 'var(--fg-2)' }}>overlays</span>
            <span style={{ ...mono, fontSize: 11.5, padding: '3px 8px', borderRadius: 6, background: 'color-mix(in oklch,var(--ok) 15%,transparent)', color: 'var(--ok)' }}>a11y ✓ 14/14</span>
          </div>
          <p style={{ fontSize: 16, lineHeight: 1.55, color: 'var(--fg-2)', maxWidth: 640 }}>
            A modal window layered over the page. Traps focus, restores it on close, and enters with a
            scale-fade composite that reads as weight, not bounce.
          </p>
          <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
            <a href="#props">API reference</a>
            <a href="https://www.radix-ui.com/primitives/docs/components/dialog" target="_blank" rel="noreferrer">Radix Dialog ↗</a>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/" target="_blank" rel="noreferrer">WAI-ARIA pattern ↗</a>
          </div>
        </div>

        {/* Ships-in-UI callout */}
        <div
          className="vl-callout"
          style={{
            background: 'color-mix(in oklch, var(--ac) 10%, transparent)',
            border: '1px solid color-mix(in oklch, var(--ac) 35%, transparent)',
            borderRadius: 'var(--r-md)',
            padding: '10px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            fontSize: 13.5,
          }}
        >
          <strong style={{ color: 'var(--fg)' }}>
            Ships in <code style={mono}>veloce-ui@0.1</code>
          </strong>
          <pre
            style={{
              margin: 0,
              padding: '6px 10px',
              background: 'var(--bg-1)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-sm)',
              ...mono,
              fontSize: 12.5,
              color: 'var(--fg)',
              overflow: 'auto',
            }}
          >{`import { Dialog } from "veloce-ui"`}</pre>
        </div>

        {/* preview panel */}
        <div id="preview" style={{ border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg-1)', scrollMarginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 44, padding: '0 8px 0 12px', borderBottom: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', gap: 2, fontSize: 13 }}>
              <button
                onClick={() => setTab('preview')}
                style={{
                  padding: '6px 12px', borderRadius: 7, fontSize: 13,
                  background: tab === 'preview' ? 'var(--bg-3)' : 'transparent',
                  color: tab === 'preview' ? 'var(--fg)' : 'var(--fg-2)',
                  fontWeight: tab === 'preview' ? 500 : 400,
                }}
              >
                Preview
              </button>
              <button
                onClick={() => setTab('code')}
                style={{
                  padding: '6px 12px', borderRadius: 7, fontSize: 13,
                  background: tab === 'code' ? 'var(--bg-3)' : 'transparent',
                  color: tab === 'code' ? 'var(--fg)' : 'var(--fg-2)',
                  fontWeight: tab === 'code' ? 500 : 400,
                }}
              >
                Code
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12.5, color: 'var(--fg-2)' }}>
              <button
                style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'inherit', fontSize: 12.5 }}
                onClick={() => setReducedMotion(!reducedMotion)}
              >
                <MiniSwitch on={reducedMotion} />Reduced motion
              </button>
              <button
                style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'inherit', fontSize: 12.5 }}
                onClick={() => setScrub(!scrub)}
              >
                <MiniSwitch on={scrub} />Scrub
              </button>
              <button
                aria-label="Replay"
                onClick={() => setReplayKey((k) => k + 1)}
                style={{ display: 'grid', placeItems: 'center', width: 28, height: 28, borderRadius: 6, border: '1px solid var(--line-2)', fontSize: 12 }}
              >
                ↻
              </button>
            </div>
          </div>
          {tab === 'preview' ? (
            <PreviewStage scrub={scrub} replayKey={replayKey} />
          ) : (
            <div style={{ padding: 16 }}>
              <UsageCode />
            </div>
          )}
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px', borderTop: '1px solid var(--line)', ...mono, fontSize: 12.5, color: 'var(--fg-2)',
            }}
          >
            <span><span style={{ color: 'var(--fg-3)' }}>$</span> npx veloce add dialog</span>
            <CopyButton text="npx veloce add dialog" />
          </div>
        </div>

        {/* usage */}
        <div id="usage" style={{ display: 'flex', flexDirection: 'column', gap: 12, scrollMarginTop: 20 }}>
          <H2>Usage</H2>
          <UsageCode />
        </div>

        {/* props */}
        <div id="props" style={{ display: 'flex', flexDirection: 'column', gap: 12, scrollMarginTop: 20 }}>
          <H2>
            Props <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--fg-3)', marginLeft: 6 }}>Dialog.Content</span>
          </H2>
          <div style={{ border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden', fontSize: 13.5 }}>
            <div
              style={{
                display: 'grid', gridTemplateColumns: PROPS_GRID, padding: '10px 16px',
                background: 'var(--bg-1)', borderBottom: '1px solid var(--line)',
                ...mono, fontSize: 11, letterSpacing: '.06em', color: 'var(--fg-3)',
              }}
            >
              <span>PROP</span><span>TYPE</span><span>DEFAULT</span><span>DESCRIPTION</span>
            </div>
            {PROPS_ROWS.map((r, i) => (
              <div
                key={r.prop}
                style={{
                  display: 'grid', gridTemplateColumns: PROPS_GRID, padding: '12px 16px',
                  borderBottom: i < PROPS_ROWS.length - 1 ? '1px solid var(--line)' : undefined,
                  alignItems: 'baseline',
                }}
              >
                <span style={{ ...mono, color: 'var(--ac-text)' }}>{r.prop}</span>
                <span style={{ ...mono, fontSize: 12.5, color: 'var(--fg-2)' }}>{r.type}</span>
                <span style={{ ...mono, fontSize: 12.5, color: 'var(--fg-2)' }}>{r.def}</span>
                <span style={{ color: 'var(--fg-2)' }}>{r.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* accessibility */}
        <div id="accessibility" style={{ display: 'flex', flexDirection: 'column', gap: 12, scrollMarginTop: 20 }}>
          <H2>Accessibility</H2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ padding: '18px 20px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg-1)', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5, lineHeight: 1.5, color: 'var(--fg-2)' }}>
              <div style={{ fontWeight: 600, color: 'var(--fg)', fontSize: 14 }}>Keyboard</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 14px', alignItems: 'center' }}>
                <kbd className="vl-kbd" style={{ fontSize: 11.5, padding: '2px 6px', color: 'var(--fg)', justifySelf: 'start', background: 'transparent' }}>Esc</kbd>
                <span>Closes the dialog, returns focus to trigger</span>
                <kbd className="vl-kbd" style={{ fontSize: 11.5, padding: '2px 6px', color: 'var(--fg)', justifySelf: 'start', background: 'transparent' }}>Tab</kbd>
                <span>Cycles within content; focus is trapped</span>
                <kbd className="vl-kbd" style={{ fontSize: 11.5, padding: '2px 6px', color: 'var(--fg)', justifySelf: 'start', background: 'transparent' }}>⇧ Tab</kbd>
                <span>Cycles backwards</span>
              </div>
            </div>
            <div style={{ padding: '18px 20px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg-1)', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5, lineHeight: 1.5, color: 'var(--fg-2)' }}>
              <div style={{ fontWeight: 600, color: 'var(--fg)', fontSize: 14 }}>ARIA</div>
              <div>
                Renders <CodeSpan>role="dialog"</CodeSpan> with <CodeSpan>aria-modal="true"</CodeSpan>. Title and
                Description wire <CodeSpan>aria-labelledby</CodeSpan> / <CodeSpan>aria-describedby</CodeSpan>{' '}
                automatically. Background content is <CodeSpan>inert</CodeSpan>.
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex', gap: 14, padding: '16px 18px', borderRadius: 10,
              border: '1px solid var(--ac-line)', background: 'var(--ac-soft)',
              fontSize: 13.5, lineHeight: 1.55, color: 'var(--fg-2)',
            }}
          >
            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--ac)', color: 'var(--ac-fg)', display: 'grid', placeItems: 'center', fontSize: 13, flexShrink: 0 }}>◐</div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--fg)' }}>Reduced motion is built in</div>
              Under <CodeSpan>prefers-reduced-motion: reduce</CodeSpan> the scale, translate and blur composites are
              dropped. Dialog crossfades in 120ms — fast enough to feel instant, slow enough to avoid a flash. No
              config required.
            </div>
          </div>
        </div>

        {/* motion spec */}
        <div id="motion-spec" style={{ display: 'flex', flexDirection: 'column', gap: 12, scrollMarginTop: 20 }}>
          <H2>Motion spec</H2>
          <div style={{ border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden', background: 'var(--bg-1)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
              {[
                { k: 'ENTER', t: '--vl-dur-200 · --vl-ease-swift-out', d: 'opacity 0→1 · scale .96→1 · translateY 6→0 · blur 4→0px' },
                { k: 'EXIT', t: '--vl-dur-150 · --vl-ease-exit', d: 'opacity 1→0 · scale 1→.98 · no blur (cheaper on exit)' },
                { k: 'BACKDROP', t: '--vl-dur-250 · linear', d: 'opacity 0→.55 · leads content by 0ms, trails on exit by 50ms' },
              ].map((c, i) => (
                <div key={c.k} style={{ padding: '18px 20px', borderRight: i < 2 ? '1px solid var(--line)' : undefined, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ ...mono, fontSize: 11, letterSpacing: '.06em', color: 'var(--fg-3)' }}>{c.k}</div>
                  <div style={{ ...mono, fontSize: 13, color: 'var(--ac-text)' }}>{c.t}</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}>{c.d}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--line)', ...mono, fontSize: 12.5, color: 'var(--fg-2)', display: 'flex', gap: 24 }}>
              <span><span style={{ color: 'var(--fg-3)' }}>swift-out</span> cubic-bezier(.16, 1, .3, 1)</span>
              <span><span style={{ color: 'var(--fg-3)' }}>exit</span> cubic-bezier(.4, 0, 1, 1)</span>
              <span style={{ marginLeft: 'auto', color: 'var(--fg-3)' }}>compiles to 2 transitions · 0 kB JS</span>
            </div>
          </div>
        </div>
      </div>
    </DocsShell>
  )
}
