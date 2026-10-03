import type { CSSProperties, ReactNode } from 'react'
import { DocsShell } from '../components/DocsShell'
import { DOCS_SIDEBAR } from '../docsNav'

const mono: CSSProperties = { fontFamily: 'var(--font-mono)' }

/* ---------- shared card anatomy ---------- */

const dotGrid: CSSProperties = {
  height: 170,
  background: 'radial-gradient(var(--line) 1px,transparent 1px) 0 0/14px 14px',
}

function PrimitiveCard({
  name,
  chip,
  copy,
  api,
  stage,
  plainStage,
}: {
  name: string
  chip: string
  copy: ReactNode
  api?: string
  stage: ReactNode
  plainStage?: boolean
}) {
  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-1)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={plainStage ? { height: 170, background: 'var(--bg)' } : dotGrid}>{stage}</div>
      <div style={{ padding: '14px 16px', borderTop: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14.5, fontWeight: 600 }}>{name}</span>
          <span style={{ ...mono, fontSize: 11, color: 'var(--ac-text)' }}>{chip}</span>
        </div>
        <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--fg-2)' }}>{copy}</div>
        {api && (
          <pre style={{ ...mono, margin: 0, marginTop: 4, fontSize: 11.5, lineHeight: 1.5, color: 'var(--fg-3)', whiteSpace: 'pre-wrap' }}>{api}</pre>
        )}
      </div>
    </div>
  )
}

function Code({ children }: { children: ReactNode }) {
  return <code style={{ ...mono, fontSize: 12, color: 'var(--fg)' }}>{children}</code>
}

/* ---------- demo stages ---------- */

function PresenceStage() {
  const row: CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8,
    background: 'var(--bg-2)', border: '1px solid var(--line-2)', fontSize: 13,
  }
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8, padding: '0 28px' }}>
      <div style={row}>
        <span style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--ac)', color: 'var(--ac-fg)', fontSize: 9, fontWeight: 700, display: 'inline-grid', placeItems: 'center', flexShrink: 0 }}>✓</span>
        Run tests
      </div>
      <div style={{ ...row, opacity: 0.35, transform: 'scale(.97) translateX(6px)', filter: 'blur(.5px)' }}>
        <span style={{ width: 16, height: 16, borderRadius: 4, border: '1px solid var(--line-2)', background: 'var(--bg)', flexShrink: 0 }} />
        Lint
        <span style={{ ...mono, fontSize: 10.5, color: 'var(--fg-3)', marginLeft: 'auto' }}>exiting · 150ms</span>
      </div>
      <div style={row}>
        <span style={{ width: 16, height: 16, borderRadius: 4, border: '1px solid var(--line-2)', background: 'var(--bg)', flexShrink: 0 }} />
        Type-check
      </div>
    </div>
  )
}

function StaggerStage() {
  const members: { name: string; role: string; avatar: string; style?: CSSProperties }[] = [
    { name: 'Mara Kessler', role: 'Owner', avatar: 'oklch(0.55 0.12 292)' },
    { name: 'Jonas Lind', role: 'Editor', avatar: 'oklch(0.6 0.12 200)', style: { opacity: 0.85, transform: 'translateY(2px)' } },
    { name: 'Amara Reyes', role: 'Editor', avatar: 'oklch(0.62 0.12 40)', style: { opacity: 0.55, transform: 'translateY(5px) scale(.99)', filter: 'blur(.6px)' } },
    { name: 'Theo Brandt', role: 'Viewer', avatar: 'var(--bg-3)', style: { opacity: 0.2, transform: 'translateY(8px) scale(.97)', filter: 'blur(2px)' } },
  ]
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8, padding: '0 28px' }}>
      {members.map((m) => (
        <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 12px', borderRadius: 7, background: 'var(--bg-2)', border: '1px solid var(--line-2)', fontSize: 12.5, ...m.style }}>
          <span style={{ width: 22, height: 22, borderRadius: '50%', background: m.avatar, flexShrink: 0 }} />
          <span style={{ flex: 1 }}>{m.name}</span>
          <span style={{ fontSize: 11, color: 'var(--fg-3)' }}>{m.role}</span>
        </div>
      ))}
    </div>
  )
}

function NumberFlowStage() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 44, fontWeight: 600, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
        <span style={{ fontSize: 26, color: 'var(--fg-3)', marginRight: 4 }}>$</span>
        124,
        <span style={{ display: 'inline-block', height: '1em', overflow: 'hidden', filter: 'blur(.5px)' }}>
          <span style={{ display: 'block', animation: 'vl-roll 2.4s cubic-bezier(.16,1,.3,1) infinite' }}>
            <span style={{ display: 'block', height: '1em' }}>5</span>
            <span style={{ display: 'block', height: '1em' }}>6</span>
            <span style={{ display: 'block', height: '1em' }}>7</span>
          </span>
        </span>
        20
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ ...mono, fontSize: 11.5, padding: '2px 7px', borderRadius: 999, background: 'color-mix(in oklch,var(--ok) 15%,transparent)', color: 'var(--ok)', fontVariantNumeric: 'tabular-nums' }}>▲ 2.9%</span>
        <span style={{ fontSize: 12.5, color: 'var(--fg-3)' }}>vs last month</span>
      </div>
    </div>
  )
}

function LayoutGroupStage() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22 }}>
      {/* segmented control with mid-flight pill */}
      <div style={{ position: 'relative', display: 'flex', padding: 3, borderRadius: 9, background: 'var(--bg-2)', border: '1px solid var(--line)', fontSize: 13 }}>
        <span style={{ position: 'absolute', top: 3, bottom: 3, left: 88, width: 96, borderRadius: 6, background: 'var(--bg)', boxShadow: 'var(--shadow-sm)', transform: 'scaleX(1.12)', transformOrigin: 'left' }} />
        {['Overview', 'Usage', 'Billing', 'Members'].map((t) => (
          <span key={t} style={{ position: 'relative', padding: '6px 14px', color: t === 'Billing' ? 'var(--fg)' : 'var(--fg-3)', fontWeight: t === 'Billing' ? 500 : undefined }}>{t}</span>
        ))}
      </div>
      {/* underline tabs with stretching bar */}
      <div style={{ position: 'relative', display: 'flex', gap: 4, borderBottom: '1px solid var(--line)', fontSize: 13 }}>
        {['Preview', 'Code', 'Props'].map((t) => (
          <span key={t} style={{ padding: '6px 12px', color: t === 'Props' ? 'var(--fg)' : 'var(--fg-3)', fontWeight: t === 'Props' ? 500 : undefined }}>{t}</span>
        ))}
        <span style={{ position: 'absolute', left: 96, width: 80, bottom: -1, height: 2, borderRadius: 1, background: 'var(--ac)', transform: 'scaleX(1.25)', transformOrigin: 'left', opacity: 0.9 }} />
      </div>
    </div>
  )
}

function CollapseStage() {
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', padding: '0 28px' }}>
      <div style={{ width: '100%', border: '1px solid var(--line-2)', borderRadius: 9, background: 'var(--bg)', fontSize: 13 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderBottom: '1px solid var(--line-2)' }}>
          Does it ship JS?
          <span style={{ color: 'var(--fg-3)' }}>⌄</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', fontWeight: 500 }}>
          How do I theme it?
          <span style={{ color: 'var(--ac-text)', display: 'inline-block', transform: 'rotate(120deg)' }}>⌄</span>
        </div>
        <div style={{ position: 'relative', height: 34, overflow: 'hidden', padding: '0 12px' }}>
          <div style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--fg-2)', transform: 'translateY(-6px)', opacity: 0.7 }}>
            Override CSS variables on any ancestor. Tokens cascade, so a card can carry its own accent.
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent,var(--bg))', pointerEvents: 'none' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderTop: '1px solid var(--line-2)', color: 'var(--fg-2)' }}>
          Is it tree-shakeable?
          <span style={{ color: 'var(--fg-3)' }}>⌄</span>
        </div>
      </div>
    </div>
  )
}

function ReorderStage() {
  const row: CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8,
    background: 'var(--bg-2)', border: '1px solid var(--line-2)', fontSize: 13,
  }
  const grip: CSSProperties = { color: 'var(--fg-3)', letterSpacing: '-2px' }
  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6, padding: '0 28px' }}>
      <div style={row}>
        <span style={grip}>⋮⋮</span>
        Install dependencies
      </div>
      <div style={{ height: 38, borderRadius: 8, border: '1px dashed var(--ac-line)', background: 'var(--ac-soft)' }} />
      <div style={row}>
        <span style={grip}>⋮⋮</span>
        Run migrations
      </div>
      <div style={{ ...row, position: 'absolute', left: 36, right: 20, top: 58, transform: 'scale(1.03) rotate(-1deg)', boxShadow: 'var(--shadow-lg),0 0 0 1px var(--ac-line)' }}>
        <span style={{ ...grip, color: 'var(--ac-text)' }}>⋮⋮</span>
        Build
        <span style={{ ...mono, fontSize: 10.5, color: 'var(--fg-3)', marginLeft: 'auto' }}>dragging</span>
      </div>
    </div>
  )
}

function RevealStage() {
  const tiles: CSSProperties[] = [
    { border: '1px solid var(--line)' },
    { border: '1px solid var(--line)' },
    { border: '1px solid var(--ac-line)', opacity: 0.8, transform: 'translateY(6px) scale(.98)' },
    { opacity: 0.4, transform: 'translateY(10px) scale(.96)', filter: 'blur(1px)' },
    { opacity: 0, transform: 'translateY(14px)' },
    { opacity: 0, transform: 'translateY(14px)' },
  ]
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', padding: '0 28px' }}>
      <div style={{ position: 'relative', width: '100%', height: 130, border: '1px solid var(--line-2)', borderRadius: 9, background: 'var(--bg)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, alignContent: 'start' }}>
          {tiles.map((t, i) => (
            <div key={i} style={{ height: 40, borderRadius: 6, background: 'var(--bg-2)', ...t }} />
          ))}
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 76, borderTop: '1px dashed var(--ac)', opacity: 0.7 }} />
        <span style={{ position: 'absolute', right: 8, top: 80, ...mono, fontSize: 10, color: 'var(--ac-text)' }}>viewport · threshold .2</span>
        <span style={{ position: 'absolute', right: 4, top: 8, width: 4, height: 40, borderRadius: 2, background: 'var(--line-2)' }} />
      </div>
    </div>
  )
}

function MorphStage() {
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', height: 34, padding: '0 13px', borderRadius: 8, background: 'var(--ac)', color: 'var(--ac-fg)', fontSize: 13, fontWeight: 500 }}>New project</span>
      <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>→</span>
      <span style={{ width: 110, height: 70, borderRadius: 10, border: '1.5px solid var(--ac-line)', background: 'var(--ac-soft)', opacity: 0.7 }} />
      <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>→</span>
      <div style={{ width: 150, padding: 10, borderRadius: 11, background: 'var(--bg-2)', border: '1px solid var(--line-2)', boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
        <span style={{ fontWeight: 600 }}>New project</span>
        <span style={{ height: 26, borderRadius: 6, border: '1px solid var(--line-2)', background: 'var(--bg)' }} />
        <span style={{ height: 22, width: 60, borderRadius: 6, background: 'var(--ac)', alignSelf: 'flex-end' }} />
      </div>
    </div>
  )
}

function HooksStage() {
  const kw: CSSProperties = { color: 'var(--fg-3)' }
  const hook: CSSProperties = { color: 'var(--ac-text)' }
  return (
    <div style={{ height: 170, padding: '18px 20px', background: 'var(--bg)', ...mono, fontSize: 12, lineHeight: 1.6, color: 'var(--fg-2)', boxSizing: 'border-box' }}>
      <div><span style={kw}>const</span> reduced = <span style={hook}>useMotionPreference</span>()</div>
      <div><span style={kw}>const</span> ref = <span style={hook}>useAnimationEnd</span>(onDone)</div>
      <div><span style={kw}>const</span> t = <span style={hook}>useMotionTokens</span>() <span style={kw}>{'// { dur, ease }'}</span></div>
      <div style={{ marginTop: 6, paddingTop: 8, borderTop: '1px solid var(--line)' }}>
        <div><span style={hook}>motion</span>(<span style={{ color: 'var(--ok)' }}>"scale-fade"</span>, {'{ dur: '}<span style={{ color: 'var(--fg)' }}>200</span>{' }'})</div>
        <div>→ <span style={{ color: 'var(--ok)' }}>"vl-enter vl-scale-fade [--vl-dur:200ms]"</span></div>
      </div>
    </div>
  )
}

/* ---------- choreography timeline ---------- */

const trackBg: CSSProperties = {
  position: 'relative',
  height: 22,
  background: 'repeating-linear-gradient(90deg, var(--line) 0 1px, transparent 1px 25%)',
}

function ChoreographyPanel() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', border: '1px solid var(--line-2)', borderRadius: 14, background: 'var(--bg-1)', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(500px 180px at 100% 0%,var(--ac-soft),transparent 70%)', pointerEvents: 'none' }} />
      {/* header */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' }}>Choreography: opening a dialog with a form</h2>
          <span style={{ fontSize: 13, color: 'var(--fg-3)' }}>How the primitives compose. Total perceived time 280ms; nothing waits for anything else to finish.</span>
        </div>
        <span style={{ ...mono, fontSize: 11.5, color: 'var(--fg-3)', whiteSpace: 'nowrap' }}>0 — 400ms</span>
      </div>
      {/* grid */}
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '150px 1fr', gap: '8px 16px', fontSize: 12.5, alignItems: 'center' }}>
        {/* ruler */}
        <span />
        <div style={{ position: 'relative', height: 14, ...mono, fontSize: 10, color: 'var(--fg-3)' }}>
          <span style={{ position: 'absolute', left: 0 }}>0</span>
          <span style={{ position: 'absolute', left: '25%' }}>100</span>
          <span style={{ position: 'absolute', left: '50%' }}>200</span>
          <span style={{ position: 'absolute', left: '75%' }}>300</span>
          <span style={{ position: 'absolute', right: 0 }}>400ms</span>
        </div>
        {/* Backdrop */}
        <span style={{ color: 'var(--fg-2)' }}>Backdrop <span style={{ ...mono, color: 'var(--fg-3)' }}>· linear</span></span>
        <div style={trackBg}>
          <span style={{ position: 'absolute', top: 3, bottom: 3, borderRadius: 4, left: 0, width: '62.5%', background: 'var(--fg-3)', opacity: 0.5 }} />
        </div>
        {/* Dialog */}
        <span style={{ color: 'var(--fg-2)' }}>Dialog <span style={{ ...mono, color: 'var(--fg-3)' }}>· Presence</span></span>
        <div style={trackBg}>
          <span style={{ position: 'absolute', top: 3, bottom: 3, borderRadius: 4, left: 0, width: '50%', background: 'var(--ac)' }} />
        </div>
        {/* Fields */}
        <span style={{ color: 'var(--fg-2)' }}>Fields <span style={{ ...mono, color: 'var(--fg-3)' }}>· Stagger 40</span></span>
        <div style={trackBg}>
          <span style={{ position: 'absolute', top: 3, bottom: 3, borderRadius: 4, left: '20%', width: '50%', background: 'color-mix(in oklch,var(--ac) 70%,var(--bg-3))' }} />
          <span style={{ position: 'absolute', top: 8, bottom: 8, borderRadius: 3, left: '30%', width: '50%', background: 'color-mix(in oklch,var(--ac) 50%,var(--bg-3))' }} />
          <span style={{ position: 'absolute', top: 9, bottom: 9, borderRadius: 3, left: '40%', width: '50%', background: 'color-mix(in oklch,var(--ac) 35%,var(--bg-3))' }} />
        </div>
        {/* Focus ring */}
        <span style={{ color: 'var(--fg-2)' }}>Focus ring <span style={{ ...mono, color: 'var(--fg-3)' }}>· 150ms</span></span>
        <div style={trackBg}>
          <span style={{ position: 'absolute', top: 3, bottom: 3, borderRadius: 4, left: '45%', width: '37.5%', border: '1.5px solid var(--ac)', background: 'var(--ac-soft)', boxSizing: 'border-box' }} />
        </div>
        {/* Trigger */}
        <span style={{ color: 'var(--fg-2)' }}>Trigger <span style={{ ...mono, color: 'var(--fg-3)' }}>· press 100ms</span></span>
        <div style={trackBg}>
          <span style={{ position: 'absolute', top: 3, bottom: 3, borderRadius: 4, left: 0, width: '25%', background: 'var(--bg-3)', border: '1px solid var(--line-2)', boxSizing: 'border-box' }} />
        </div>
        {/* marker row */}
        <span />
        <div style={{ position: 'relative', height: 18 }}>
          <span style={{ position: 'absolute', left: '70%', top: 0, bottom: 0, borderLeft: '1px dashed var(--fg-2)' }} />
          <span style={{ position: 'absolute', left: '70%', top: 1, transform: 'translateX(8px)', ...mono, fontSize: 10.5, color: 'var(--fg-2)', whiteSpace: 'nowrap' }}>280ms · interactive</span>
        </div>
      </div>
      {/* footer notes */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', gap: 16, ...mono, fontSize: 11.5, color: 'var(--fg-3)' }}>
        <span>reduced motion: every bar collapses to a 120ms crossfade at t=0</span>
        <span style={{ textAlign: 'right' }}>exit reverses in 150ms; fields don't stagger on the way out</span>
      </div>
    </div>
  )
}

/* ---------- page ---------- */

export default function MotionUtilitiesShowcase() {
  return (
    <DocsShell sidebar={DOCS_SIDEBAR} wide>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* breadcrumb */}
        <div style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--fg-3)' }}>
          <span>Docs</span><span>›</span><span>Motion</span><span>›</span>
          <span style={{ color: 'var(--fg-2)' }}>Utilities</span>
        </div>

        {/* page header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="vl-eyebrow">MOTION UTILITIES · @veloce/motion</div>
            <h1 style={{ margin: 0, fontSize: 36, fontWeight: 600, letterSpacing: '-0.035em' }}>Nine primitives, zero animation runtime</h1>
          </div>
          <div style={{ ...mono, fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.7, textAlign: 'right', whiteSpace: 'nowrap' }}>
            each utility compiles to CSS transitions / @keyframes
            <br />
            JS only for mount timing, measurement and preference
          </div>
        </div>

        {/* primitive grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          <PrimitiveCard
            name="Presence"
            chip="exit 150ms"
            stage={<PresenceStage />}
            copy={<>Keeps a child mounted through its exit animation. Fires <Code>onExitComplete</Code>.</>}
            api={'<Presence show={visible} motion="scale-fade">'}
          />
          <PrimitiveCard
            name="Stagger"
            chip="gap 40ms · cap 8"
            stage={<StaggerStage />}
            copy="Offsets children's enter by index. Items past the cap animate together so long lists never feel slow."
            api={'<Stagger gap={40} max={8}>{rows.map(…)}</Stagger>'}
          />
          <PrimitiveCard
            name="NumberFlow"
            chip="250ms settle"
            stage={<NumberFlowStage />}
            copy={<>Digits roll independently; separators and currency stay put. Uses <Code>Intl.NumberFormat</Code>.</>}
            api={'<NumberFlow value={mrr} format="currency" />'}
          />
          <PrimitiveCard
            name="LayoutGroup"
            chip="200ms swift-out"
            stage={<LayoutGroupStage />}
            copy={<>Shared indicators travel between siblings. Stretches mid-flight (the 'rubber' frame shown) — never overshoots.</>}
            api={'<LayoutGroup id="tabs"> … <Indicator layoutId="pill" />'}
          />
          <PrimitiveCard
            name="Collapse"
            chip="height 250ms settle"
            stage={<CollapseStage />}
            copy={<>Animates to <Code>height: auto</Code> via one measurement. Content fades 60ms behind the box. Chevron rotates on the same curve.</>}
            api={'<Collapse open={open}>…</Collapse>'}
          />
          <PrimitiveCard
            name="Reorder"
            chip="lift 120ms · drop 250ms"
            stage={<ReorderStage />}
            copy="Pointer + keyboard (space, ↑↓) sorting. Siblings slide out of the way with LayoutGroup; the lifted item tilts 1°."
            api={'<Reorder.Group values={steps} onReorder={set}>'}
          />
          <PrimitiveCard
            name="Reveal"
            chip="once · 200ms"
            stage={<RevealStage />}
            copy="IntersectionObserver toggles a class; the enter itself is CSS. Plays once by default so scrolling back never re-animates."
            api={'<Reveal threshold={0.2} stagger={40}>'}
          />
          <PrimitiveCard
            name="Morph"
            chip="350ms settle"
            stage={<MorphStage />}
            copy={<>Trigger becomes the surface: shared <Code>layoutId</Code>, radius and color interpolate, content crossfades at 60%.</>}
            api={'<Morph.Trigger layoutId="np"> · <Morph.Content layoutId="np">'}
          />
          <PrimitiveCard
            name="Hooks & helpers"
            chip="1.1 kB gz"
            plainStage
            stage={<HooksStage />}
            copy={<>Preference, completion and token access for the rare case CSS can't express it. <Code>motion()</Code> returns class names — works with any styling layer.</>}
          />
        </div>

        <ChoreographyPanel />
      </div>
    </DocsShell>
  )
}
