import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import './Landing.css'

const INSTALL_CMD = 'npx veloce add button'

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
  return (
    <div className="lp__counter">
      <div className="lp__counter-top">
        <span>GitHub stars</span>
        <span style={{ color: 'var(--ok)' }}>▲ 3.2%</span>
      </div>
      <div className="lp__counter-num">
        <span>12,4</span>
        <span className="lp__roll">
          <span className="lp__roll-track">
            <span className="lp__roll-digit">6</span>
            <span className="lp__roll-digit">7</span>
            <span className="lp__roll-digit">8</span>
          </span>
        </span>
        <span>2</span>
      </div>
      <div className="lp__ann" style={{ marginTop: 10, color: 'var(--fg-3)' }}>{'<NumberFlow />'} · 250ms settle</div>
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

export default function Landing() {
  return (
    <div className="lp">
      <div className="lp__bg" aria-hidden>
        <div className="lp__grid" />
        <div className="lp__glow lp__glow--tr" />
        <div className="lp__glow lp__glow--bl" />
        <div className="lp__orb lp__orb--a" />
        <div className="lp__orb lp__orb--b" />
      </div>
      <div className="lp__content">
        <SiteHeader height={64} />

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
              Accessible React components with signature motion built in. Every transition is pure CSS — no animation
              library, nothing shipped to the client but your UI.
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
              <span><strong>38</strong> components</span>
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
      </div>
      <SiteFooter />
    </div>
  )
}
