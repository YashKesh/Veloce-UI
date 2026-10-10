import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AreaChart, Button, NumberFlow } from 'veloce-ui'
import { SiteHeader, REPO_OWNER, REPO_NAME, REPO_URL } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { useGithubStars } from '../useGithubStars'
import { Seo } from '../Seo'
import './Landing.css'

const INSTALL_CMD = 'npm install veloce-ui'

function CopyButton() {
  const [copied, setCopied] = useState(false)
  return (
    <button
      className="lp__copy"
      aria-label="Copy install command"
      onClick={() => {
        navigator.clipboard.writeText(INSTALL_CMD).then(() => {
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1500)
        })
      }}
    >
      {copied ? '✓' : '⧉'}
    </button>
  )
}

function ToastStack() {
  return (
    <div className="lp__toast-stack">
      <div className="lp__toast lp__toast--n2">
        <div className="lp__toast-dot" style={{ background: 'var(--fg-3)' }} />
        <div>
          <div className="lp__toast-title">Build queued</div>
          <div className="lp__toast-body">Waiting for runner</div>
        </div>
      </div>
      <div className="lp__toast lp__toast--n1">
        <div className="lp__toast-dot" style={{ background: 'var(--ac)' }} />
        <div>
          <div className="lp__toast-title">Preview ready</div>
          <div className="lp__toast-body">pr-218 · veloce-docs.vercel.app</div>
        </div>
      </div>
      <div className="lp__toast lp__toast--top">
        <div
          className="lp__toast-dot"
          style={{ background: 'var(--ok)', boxShadow: '0 0 0 3px color-mix(in oklch,var(--ok) 25%,transparent)' }}
        />
        <div style={{ flex: 1 }}>
          <div className="lp__toast-title">Deploy succeeded</div>
          <div className="lp__toast-body">main · 42s · 3 routes revalidated</div>
        </div>
        <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>✕</span>
      </div>
      <div className="lp__ann" style={{ position: 'absolute', left: 0, top: -22, color: 'var(--ac-text)' }}>
        toast · stagger 40ms · swift-out
      </div>
    </div>
  )
}

function NumberFlowCard() {
  const { stars, loading } = useGithubStars(REPO_OWNER, REPO_NAME)
  return (
    <div className="lp__counter">
      <div className="lp__counter-top">
        <span>GitHub stars</span>
        <span style={{ color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
          {REPO_OWNER}/{REPO_NAME}
        </span>
      </div>
      <div className="lp__counter-num" style={{ minHeight: '1em' }}>
        {stars != null ? (
          <NumberFlow value={stars} />
        ) : loading ? (
          <span style={{ color: 'var(--fg-3)' }}>—</span>
        ) : (
          <span style={{ color: 'var(--fg-3)' }}>0</span>
        )}
      </div>
      <div className="lp__ann" style={{ marginTop: 10, color: 'var(--fg-3)' }}>{'<NumberFlow />'} · 500ms ease-out</div>
    </div>
  )
}

function DialogMidOpen() {
  return (
    <div className="lp__dialog-frame">
      <div className="lp__dialog-backdrop" />
      <div className="lp__dialog-page">
        <div style={{ height: 12, borderRadius: 4, background: 'var(--bg-3)', width: '60%' }} />
        <div />
        <div style={{ height: 80, borderRadius: 8, background: 'var(--bg-2)' }} />
        <div style={{ height: 80, borderRadius: 8, background: 'var(--bg-2)' }} />
      </div>
      <div className="lp__dialog">
        <div className="lp__dialog-title">Delete workspace?</div>
        <div className="lp__dialog-desc">
          This permanently removes <span style={{ color: 'var(--fg)' }}>acme-design</span> and its 14 projects. This
          can't be undone.
        </div>
        <div className="lp__dialog-foot">
          <span className="lp__mini-btn" style={{ border: '1px solid var(--line-2)' }}>Cancel</span>
          <span className="lp__mini-btn" style={{ background: 'var(--err)', color: 'oklch(0.99 0 0)' }}>Delete</span>
        </div>
      </div>
      <div className="lp__ann" style={{ position: 'absolute', right: 14, bottom: 12, color: 'var(--fg-2)' }}>
        t = 120ms / 200ms
      </div>
    </div>
  )
}

function ControlsCluster() {
  return (
    <div className="lp__controls">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5 }}>
        <span className="vl-switch vl-switch--on" style={{ display: 'block' }}>
          <span className="thumb" />
        </span>
        Reduced motion
      </div>
      <div className="lp__controls-divider" />
      <span className="lp__focus-btn">Continue</span>
      <div className="lp__ann" style={{ color: 'var(--fg-3)' }}>:focus-visible</div>
    </div>
  )
}

const PILLARS = [
  {
    eyebrow: '01 — MOTION-FIRST',
    title: 'Every component has a choreography',
    body: 'Enter, exit, press and hover states are designed as a system — 150–250ms, ease-out-expo in, ease-in out.',
  },
  {
    eyebrow: '02 — ACCESSIBILITY-COMPLETE',
    title: "Focus rings you'd want to show off",
    body: 'Keyboard nav, ARIA wiring, focus management and prefers-reduced-motion — not an add-on, the default.',
  },
  {
    eyebrow: '03 — ZERO-RUNTIME',
    title: 'CSS does the moving',
    body: 'No animation library, no layout thrash, no hydration cost. Motion tokens compile to plain transitions and @keyframes.',
  },
]

const MOBILE_NAV = [
  { label: 'Docs', to: '/docs/installation' },
  { label: 'Components', to: '/components' },
  { label: 'Dashboards', to: '/dashboards' },
  { label: 'Charts', to: '/charts/catalogue' },
  { label: 'Motion', to: '/docs/motion' },
  { label: 'Tokens', to: '/docs/tokens' },
  { label: 'Accents', to: '/accents' },
]

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])
  if (!open) return null
  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'oklch(0 0 0/.55)', zIndex: 150 }}
      />
      <div
        style={{
          position: 'fixed', top: 0, bottom: 0, left: 0, width: 280, zIndex: 151,
          background: 'var(--bg)', borderRight: '1px solid var(--line)',
          display: 'flex', flexDirection: 'column', padding: '20px 18px',
          animation: 'vl-in .2s cubic-bezier(.16,1,.3,1) both',
        }}
      >
        <div className="vl-label" style={{ fontSize: 11, letterSpacing: '0.08em', color: 'var(--fg-3)', margin: '6px 4px 12px' }}>
          NAVIGATE
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {MOBILE_NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={onClose}
              style={{
                display: 'block', padding: '10px 10px', borderRadius: 7,
                fontSize: 14, color: 'var(--fg)',
              }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--line)' }}>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'block', padding: '10px 10px', borderRadius: 7, fontSize: 14, color: 'var(--fg-2)' }}
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </>
  )
}

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="lp">
      <Seo
        title={undefined}
        description="Motion-first React 19 component library. 36 primitives, 13 charts, OKLCH-themed, zero runtime, SSR-safe. Install with npm i veloce-ui."
        canonical="https://veloceui.codeloomdevv.co.in/"
      />
      <div className="lp__bg" aria-hidden>
        <div className="lp__wash" />
        <div className="lp__grid" />
        <div className="lp__glow lp__glow--tr" />
        <div className="lp__glow lp__glow--bl" />
        <div className="lp__orb lp__orb--a" />
        <div className="lp__orb lp__orb--b" />
        <div className="lp__orb lp__orb--c" />
      </div>
      <div className="lp__content">
        <SiteHeader height={64} onMenu={() => setMenuOpen((o) => !o)} />
        <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />

        <div className="lp__hero">
          <div className="lp__left">
            <div className="lp__pill">
              <span className="lp__pill-v">v1.0</span>
              Zero-runtime motion, now stable
            </div>
            <h1 className="lp__h1">
              Components that <span style={{ color: 'var(--ac-text)' }}>move</span>.
            </h1>
            <p className="lp__sub">
              60+ primitives, 40 charts, 14 dashboards, plus a drag-and-drop builder and an OKLCH theme studio.
              Every transition is pure CSS — no animation library, nothing shipped to the client but your UI.
            </p>
            <div className="lp__cta-row">
              <div className="lp__install">
                <span style={{ color: 'var(--fg-3)' }}>$</span>
                <span style={{ whiteSpace: 'nowrap' }}>{INSTALL_CMD}</span>
                <CopyButton />
              </div>
              <Link to="/docs/installation" className="lp__docs-btn">
                Read the docs
              </Link>
            </div>
            <div className="lp__stats">
              <span><strong>60+</strong> primitives + <strong>40</strong> charts</span>
              <span><strong>0 kB</strong> animation runtime</span>
              <span><strong>WCAG 2.2 AA</strong> across the board</span>
            </div>
          </div>

          <div className="lp__collage">
            <ToastStack />
            <NumberFlowCard />
            <DialogMidOpen />
            <ControlsCluster />
          </div>
        </div>

        <div className="lp__pillars">
          {PILLARS.map((p) => (
            <div key={p.eyebrow} className="lp__pillar">
              <div className="lp__pillar-eyebrow">{p.eyebrow}</div>
              <div className="lp__pillar-title">{p.title}</div>
              <div className="lp__pillar-body">{p.body}</div>
            </div>
          ))}
        </div>

        <WhatsInside />
        <DashboardsCTA />
        <WhyZeroRuntime />
        <ThemingShowcase />
        <FinalCTA />
      </div>
      <SiteFooter />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Extended landing sections
// ─────────────────────────────────────────────────────────────────────────────

const INSIDE_CARDS = [
  { label: 'Primitives', count: '60+', body: 'Button, Dialog, Select, DataGrid, Form — everything a product app needs.', to: '/components', tag: 'Core' },
  { label: 'Charts', count: '40', body: 'From Line to Sankey, Sunburst to WordCloud. Hand-rolled SVG, zero dep.', to: '/charts/catalogue', tag: 'Data viz' },
  { label: 'AI components', count: '10', body: 'ChatMessage, StreamingText, PromptInput, ToolCall, Citation.', to: '/components/chat-message', tag: 'For LLM apps' },
  { label: 'Marketing blocks', count: '13', body: 'Hero, Pricing, FeatureGrid, BentoGrid, BorderMagic, MeteorBackground.', to: '/components/marketing-blocks', tag: 'Zero-runtime wow' },
  { label: 'Dashboards', count: '14', body: 'SaaS, analytics, admin, CRM, inbox, marketing landing — full pages, copy-paste.', to: '/dashboards', tag: 'Blueprints' },
  { label: 'Dashboard builder', count: '1', body: 'Drag components onto a canvas, edit props live, export working JSX.', to: '/builder', tag: 'NEW · visual editor' },
  { label: 'Theme studio', count: '∞', body: 'Paste a hex → OKLCH-native CSS vars. Dark + light. Copy-paste.', to: '/theme', tag: 'NEW · OKLCH' },
  { label: 'Themes', count: '7×2', body: '7 accents · dark + light mode. Everything reads from one CSS variable.', to: '/accents', tag: 'OKLCH tokens' },
]

function WhatsInside() {
  return (
    <section style={{ padding: '96px 48px 48px', maxWidth: 1200, marginInline: 'auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, letterSpacing: '0.08em', color: 'var(--ac-text)', textTransform: 'uppercase', marginBottom: 10 }}>
          What's in the box
        </div>
        <h2 style={{ margin: 0, fontSize: 44, fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--fg)' }}>
          Everything, in one install.
        </h2>
        <p style={{ margin: '12px auto 0', maxWidth: 600, fontSize: 16, lineHeight: 1.55, color: 'var(--fg-2)' }}>
          Six categories, one import path. Mix and match — all themed, all accessible, all SSR-safe.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {INSIDE_CARDS.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            style={{
              display: 'flex', flexDirection: 'column', gap: 10,
              padding: 24, borderRadius: 14,
              border: '1px solid var(--line)', background: 'var(--bg-1)',
              color: 'var(--fg)', textDecoration: 'none',
              transition: 'border-color 150ms, transform 150ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--ac-line)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--line)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--ac-text)', fontVariantNumeric: 'tabular-nums' }}>
                {c.count}
              </span>
              <span style={{ fontSize: 15, fontWeight: 500 }}>{c.label}</span>
            </div>
            <div style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--fg-2)' }}>{c.body}</div>
            <div style={{ marginTop: 'auto', paddingTop: 8, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-3)', letterSpacing: '0.03em' }}>
              {c.tag}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function DashboardsCTA() {
  const data = Array.from({ length: 24 }, (_, i) => ({
    label: `${i}`,
    value: 20 + Math.sin(i * 0.4) * 8 + i * 1.6,
  }))
  return (
    <section style={{ padding: '72px 48px', maxWidth: 1200, marginInline: 'auto' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          gap: 48,
          alignItems: 'center',
          padding: '48px',
          borderRadius: 20,
          border: '1px solid var(--ac-line)',
          background: 'linear-gradient(135deg, color-mix(in oklch, var(--ac) 10%, var(--bg-1)), var(--bg-1))',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }}>
          <span style={{ display: 'inline-flex', alignSelf: 'flex-start', padding: '3px 10px', borderRadius: 999, background: 'var(--ac)', color: 'var(--ac-fg)', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.03em' }}>
            NEW
          </span>
          <h2 style={{ margin: 0, fontSize: 40, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            Dashboards, not components.
          </h2>
          <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6, color: 'var(--fg-2)', maxWidth: 480 }}>
            Veloce is the first UI kit to ship full admin pages. SaaS metrics, analytics, finance, DevOps — each a single <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13.5 }}>.tsx</code> file you copy and wire to your API. Everyone else ships LEGO. We ship the Death Star.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <Link to="/dashboards" className="lp__docs-btn">
              Browse 7 blueprints
            </Link>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ padding: 14, border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg)', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', marginBottom: 10 }}>
              <span>revenue · last 24h</span>
              <span style={{ color: 'var(--ok)' }}>+18%</span>
            </div>
            <AreaChart data={data} height={180} smooth yFormat={(n) => `$${Math.round(n)}k`} />
          </div>
        </div>
      </div>
    </section>
  )
}

function WhyZeroRuntime() {
  const comparisons = [
    { lib: 'Veloce UI', bundle: '0 kB', bg: 'var(--ok)', fg: 'oklch(0.15 0 0)' },
    { lib: 'Framer Motion', bundle: '42 kB', bg: 'var(--warn)', fg: 'oklch(0.15 0 0)' },
    { lib: 'Motion One', bundle: '18 kB', bg: 'var(--warn)', fg: 'oklch(0.15 0 0)' },
    { lib: 'react-spring', bundle: '32 kB', bg: 'var(--warn)', fg: 'oklch(0.15 0 0)' },
  ]
  return (
    <section style={{ padding: '72px 48px', maxWidth: 1200, marginInline: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, letterSpacing: '0.08em', color: 'var(--ac-text)', textTransform: 'uppercase' }}>
            Zero-runtime motion
          </div>
          <h2 style={{ margin: 0, fontSize: 38, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Every animation. Zero JavaScript.
          </h2>
          <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6, color: 'var(--fg-2)', maxWidth: 480 }}>
            Transitions, keyframes, and composite effects all compile to pure CSS. Your bundle doesn't carry a 40 kB animation runtime. It renders during SSR, hydrates with no mismatch, and respects <code style={{ fontFamily: 'var(--font-mono)' }}>prefers-reduced-motion</code> by default.
          </p>
          <div style={{ fontSize: 13.5, color: 'var(--fg-3)', lineHeight: 1.6, marginTop: 4 }}>
            For the three cases CSS can't express — enter/exit choreography, staggered reveals, number tweening — we ship small JS helpers (<code style={{ fontFamily: 'var(--font-mono)' }}>&lt;Presence&gt;</code>, <code style={{ fontFamily: 'var(--font-mono)' }}>&lt;Stagger&gt;</code>, <code style={{ fontFamily: 'var(--font-mono)' }}>&lt;NumberFlow&gt;</code>). Total runtime cost: under 2 kB.
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 11.5, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.03em', marginBottom: 4 }}>
            motion runtime · bundled size (gzipped)
          </div>
          {comparisons.map((c) => {
            const kb = parseFloat(c.bundle)
            const pct = Math.max(4, (kb / 42) * 100)
            return (
              <div key={c.lib} style={{ display: 'grid', gridTemplateColumns: '140px 1fr auto', gap: 12, alignItems: 'center', fontSize: 13 }}>
                <span style={{ color: c.lib === 'Veloce UI' ? 'var(--fg)' : 'var(--fg-2)', fontWeight: c.lib === 'Veloce UI' ? 500 : 400 }}>
                  {c.lib}
                </span>
                <div style={{ height: 10, borderRadius: 5, background: 'var(--bg-2)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, borderRadius: 5, background: c.bg, transition: 'width 400ms var(--ease-swift-out)' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg)', minWidth: 48, textAlign: 'right' }}>
                  {c.bundle}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const ACCENT_SWATCHES: Array<{ id: string; color: string }> = [
  { id: 'violet', color: 'oklch(0.64 0.24 292)' },
  { id: 'blue', color: 'oklch(0.62 0.19 255)' },
  { id: 'cyan', color: 'oklch(0.8 0.13 205)' },
  { id: 'emerald', color: 'oklch(0.72 0.16 155)' },
  { id: 'lime', color: 'oklch(0.9 0.21 128)' },
  { id: 'amber', color: 'oklch(0.83 0.16 70)' },
  { id: 'rose', color: 'oklch(0.65 0.22 12)' },
]

function ThemingShowcase() {
  return (
    <section style={{ padding: '72px 48px', maxWidth: 1200, marginInline: 'auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, letterSpacing: '0.08em', color: 'var(--ac-text)', textTransform: 'uppercase', marginBottom: 10 }}>
          Themed by default
        </div>
        <h2 style={{ margin: 0, fontSize: 38, fontWeight: 600, letterSpacing: '-0.03em' }}>
          Seven accents. Two modes. One line.
        </h2>
        <p style={{ margin: '12px auto 0', maxWidth: 580, fontSize: 15.5, lineHeight: 1.55, color: 'var(--fg-2)' }}>
          Set <code style={{ fontFamily: 'var(--font-mono)' }}>data-accent="emerald"</code> on <code style={{ fontFamily: 'var(--font-mono)' }}>&lt;html&gt;</code> and every button, chart, chip and badge restyles instantly — OKLCH tokens do the math.
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
        {ACCENT_SWATCHES.map((a) => (
          <div key={a.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: a.color, boxShadow: `0 8px 24px -8px ${a.color}` }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>{a.id}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Link to="/accents" style={{ fontSize: 13.5, color: 'var(--ac-text)' }}>
          Preview all 14 combos →
        </Link>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section style={{ padding: '72px 48px 96px', maxWidth: 1200, marginInline: 'auto' }}>
      <div
        style={{
          padding: '56px 32px',
          borderRadius: 20,
          border: '1px solid var(--line)',
          background: 'var(--bg-1)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <span aria-hidden style={{ position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)', width: 500, height: 300, background: 'radial-gradient(50% 50% at 50% 50%, var(--ac) 0%, transparent 70%)', opacity: 0.25, pointerEvents: 'none' }} />
        <h2 style={{ position: 'relative', margin: 0, fontSize: 42, fontWeight: 600, letterSpacing: '-0.035em', textWrap: 'balance' }}>
          Ship the next thing in weeks, not quarters.
        </h2>
        <p style={{ position: 'relative', margin: '16px auto 0', maxWidth: 540, fontSize: 15.5, lineHeight: 1.6, color: 'var(--fg-2)' }}>
          Everything above is MIT-licensed. No sign-up, no paywall, no "pro" components held hostage.
        </p>
        <div style={{ position: 'relative', display: 'flex', gap: 10, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, height: 48, padding: '0 20px', borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--line-2)', fontFamily: 'var(--font-mono)', fontSize: 14 }}>
            <span style={{ color: 'var(--fg-3)' }}>$</span> npm install veloce-ui
          </div>
          <Link to="/docs/installation">
            <Button variant="primary" size="lg">Read the docs →</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
