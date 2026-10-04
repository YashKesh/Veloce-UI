import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import { useLocation } from 'react-router-dom'
import { DocsShell, RightRail } from '../components/DocsShell'
import type { TocItem } from '../components/DocsShell'
import { DOCS_SIDEBAR } from '../docsNav'
import { Seo } from '../Seo'

const mono: CSSProperties = { fontFamily: 'var(--font-mono)' }

const TOC: TocItem[] = [
  { label: 'Four rules', id: 'four-rules', active: true },
  { label: 'Anatomy of an enter', id: 'anatomy' },
  { label: 'Write it once', id: 'write-once' },
  { label: 'Reduced motion', id: 'reduced' },
]

const RULES = [
  { n: '01', title: 'Fast in, faster out', body: 'Enters take 200ms, exits 150ms. Nothing the user dismisses should linger.' },
  { n: '02', title: "Composite, don't bounce", body: 'Weight comes from opacity + scale + blur arriving together, not from overshoot.' },
  { n: '03', title: 'Origin is where you clicked', body: 'Menus and popovers scale from their trigger; dialogs from center. Never from nowhere.' },
  { n: '04', title: 'Loops are for waiting only', body: 'Spinners, skeletons and indeterminate progress are the only things that repeat.' },
]

const FRAMES: { t: string; style: CSSProperties; final?: boolean }[] = [
  { t: '0ms', style: { opacity: 0, transform: 'translateY(8px) scale(.96)' } },
  { t: '40ms', style: { opacity: 0.35, transform: 'translateY(6px) scale(.965)', filter: 'blur(3px)' } },
  { t: '80ms', style: { opacity: 0.7, transform: 'translateY(3px) scale(.98)', filter: 'blur(1.2px)' } },
  { t: '120ms', style: { opacity: 0.92, transform: 'translateY(1px) scale(.993)', filter: 'blur(.3px)' } },
  { t: '200ms', style: { border: '1px solid var(--ac-line)', boxShadow: 'var(--shadow-md)' }, final: true },
]

const CHANNELS = [
  { label: 'opacity', width: '100%', opacity: 1 },
  { label: 'scale', width: '100%', opacity: 0.7 },
  { label: 'translateY', width: '80%', opacity: 0.55 },
  { label: 'blur', width: '60%', opacity: 0.4 },
]

export default function DocsMotion() {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [hash])

  return (
    <DocsShell sidebar={DOCS_SIDEBAR} rail={<RightRail toc={TOC} />}>
      <Seo
        title="Motion system"
        description="Veloce UI's five easing curves, five durations, and reduced-motion rules — the vocabulary every component speaks."
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* heading */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="vl-eyebrow">Motion system</div>
          <h1 style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.03em' }}>Motion that feels like mass</h1>
          <p style={{ fontSize: 16, lineHeight: 1.55, color: 'var(--fg-2)' }}>
            Four rules. Every component in the library follows them, and every token on the next page exists to
            enforce them.
          </p>
        </div>

        {/* rule cards */}
        <div id="four-rules" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, scrollMarginTop: 20 }}>
          {RULES.map((r) => (
            <div
              key={r.n}
              style={{
                padding: '18px 20px', border: '1px solid var(--line)', borderRadius: 10,
                background: 'var(--bg-1)', display: 'flex', flexDirection: 'column', gap: 8,
              }}
            >
              <span style={{ ...mono, fontSize: 11, color: 'var(--ac-text)' }}>{r.n}</span>
              <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>{r.title}</span>
              <span style={{ fontSize: 13.5, lineHeight: 1.5, color: 'var(--fg-2)' }}>{r.body}</span>
            </div>
          ))}
        </div>

        {/* anatomy of an enter */}
        <div id="anatomy" style={{ display: 'flex', flexDirection: 'column', gap: 12, scrollMarginTop: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Anatomy of an enter</h2>
          <div
            style={{
              border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-1)',
              padding: 24, display: 'flex', flexDirection: 'column', gap: 18,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-end', height: 120, padding: '0 8px' }}>
              {FRAMES.map((f) => (
                <div key={f.t} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 72, height: 48, borderRadius: 8, background: 'var(--bg-2)',
                      border: '1px solid var(--line-2)', ...f.style,
                    }}
                  />
                  <span style={{ ...mono, fontSize: 11, color: f.final ? 'var(--ac-text)' : 'var(--fg-3)' }}>{f.t}</span>
                </div>
              ))}
            </div>
            <div
              style={{
                display: 'grid', gridTemplateColumns: '90px 1fr', gap: '8px 16px',
                ...mono, fontSize: 12, color: 'var(--fg-2)', alignItems: 'center',
              }}
            >
              {CHANNELS.map((c) => (
                <div key={c.label} style={{ display: 'contents' }}>
                  <span style={{ color: 'var(--fg-3)' }}>{c.label}</span>
                  <div style={{ position: 'relative', height: 6, borderRadius: 3, background: 'var(--bg-3)' }}>
                    <div
                      style={{
                        position: 'absolute', left: 0, top: 0, bottom: 0, width: c.width,
                        borderRadius: 3, background: 'var(--ac)', opacity: c.opacity,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--fg-2)' }}>
              Blur resolves first (60%), then translate (80%); opacity and scale carry the full 200ms. The staggered
              finish is what reads as “landing”.
            </div>
          </div>
        </div>

        {/* write it once */}
        <div id="write-once" style={{ display: 'flex', flexDirection: 'column', gap: 12, scrollMarginTop: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Write it once</h2>
          <pre
            className="vl-code"
            style={{ padding: '18px 20px', color: 'var(--fg-2)', margin: 0 }}
          >
            <span className="p">{'/* motion.css — generated by veloce init */'}</span>
            {'\n'}
            <span style={{ color: 'var(--fg)' }}>.vl-enter</span> {'{'}
            {'\n  animation: '}
            <span className="s">vl-scale-fade</span> <span className="s">var(--vl-dur-200)</span>{' '}
            <span className="s">var(--vl-ease-swift-out)</span> both;
            {'\n}'}
            {'\n'}
            <span style={{ color: 'var(--fg)' }}>@media</span> (prefers-reduced-motion: reduce) {'{'}
            {'\n  '}
            <span style={{ color: 'var(--fg)' }}>.vl-enter</span> {'{ animation: '}
            <span className="s">vl-fade</span> <span className="s">var(--vl-dur-100)</span> linear both; {'}'}
            {'\n}'}
          </pre>
        </div>

        {/* reduced motion callout */}
        <div
          id="reduced"
          style={{
            scrollMarginTop: 20,
            display: 'flex', gap: 14, padding: '16px 18px', borderRadius: 10,
            border: '1px solid var(--ac-line)', background: 'var(--ac-soft)',
            fontSize: 13.5, lineHeight: 1.55, color: 'var(--fg-2)',
          }}
        >
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--ac)', color: 'var(--ac-fg)', display: 'grid', placeItems: 'center', fontSize: 13, flexShrink: 0 }}>◐</div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--fg)' }}>Reduced motion is a first-class preset</div>
            Every token has a reduced counterpart.{' '}
            <span style={{ ...mono, fontSize: 12.5, color: 'var(--fg)' }}>useMotionPreference()</span> exposes the
            same value to JS for anything CSS can't express.
          </div>
        </div>
      </div>
    </DocsShell>
  )
}
