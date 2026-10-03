import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../theme'
import { SiteHeader } from '../components/SiteHeader'
import './Accents.css'

// 12-step OKLCH ramp — exact algorithm from the design spec (section B)
const L = [0.98, 0.95, 0.91, 0.86, 0.8, 0.73, 0.66, 0.58, 0.5, 0.42, 0.32, 0.2]

function rampSteps(hue: number, c: number): string[] {
  return L.map((l, i) => {
    const ch = c < 0.02 ? c : c * (0.25 + 0.75 * Math.sin((Math.PI * i) / 11))
    return `oklch(${l} ${ch.toFixed(3)} ${hue})`
  })
}

import type { Accent } from '../theme'

interface AccentCard {
  label: string
  accent: Accent
  css: string
  vars: CSSProperties
  blurb: string
  steps: string[]
}

const CARDS: AccentCard[] = [
  {
    label: 'A — ELECTRIC VIOLET',
    accent: 'violet',
    css: 'oklch(0.64 0.24 292)',
    vars: {
      '--ac': 'oklch(0.64 0.24 292)',
      '--ac-h': 'oklch(0.69 0.24 292)',
      '--ac-fg': 'oklch(0.99 0.01 292)',
      '--ac-text': 'oklch(0.78 0.17 292)',
    } as CSSProperties,
    blurb: 'Deep, technical, premium. Reads as “engineering tool” instantly; white text on solid.',
    steps: rampSteps(292, 0.26),
  },
  {
    label: 'B — SIGNAL LIME',
    accent: 'lime',
    css: 'oklch(0.90 0.21 128)',
    vars: {
      '--ac': 'oklch(0.9 0.21 128)',
      '--ac-h': 'oklch(0.94 0.21 128)',
      '--ac-fg': 'oklch(0.22 0.06 128)',
      '--ac-text': 'oklch(0.9 0.2 128)',
    } as CSSProperties,
    blurb: 'Loudest and most ownable. Highest contrast on near-black; dark text on solid.',
    steps: rampSteps(128, 0.22),
  },
  {
    label: 'C — PLASMA CYAN',
    accent: 'cyan',
    css: 'oklch(0.80 0.13 205)',
    vars: {
      '--ac': 'oklch(0.8 0.13 205)',
      '--ac-h': 'oklch(0.85 0.13 205)',
      '--ac-fg': 'oklch(0.2 0.05 205)',
      '--ac-text': 'oklch(0.82 0.12 205)',
    } as CSSProperties,
    blurb: 'Cool and calm, closest to the canvas tint. Most restrained; dark text on solid.',
    steps: rampSteps(205, 0.14),
  },
]

export default function Accents() {
  const { accent, setAccent } = useTheme()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <SiteHeader height={56} />
      <div className="acc">
      {CARDS.map((c) => (
        <div key={c.label} className="acc__card" style={c.vars}>
          <div className="acc__glow" />

          <div className="acc__row">
            <div className="acc__logo">
              <div className="acc__logo-mark">
                <div className="acc__logo-bar" />
              </div>
              <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.02em' }}>
                Veloce <span style={{ color: 'var(--fg-3)', fontWeight: 500 }}>UI</span>
              </span>
            </div>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="acc__css">{c.css}</span>
              <button
                onClick={() => setAccent(c.accent)}
                className="acc__btn acc__btn--soft"
                style={{ cursor: 'pointer' }}
              >
                {accent === c.accent ? '✓ Active' : 'Use this accent'}
              </button>
            </span>
          </div>

          <div className="acc__hero">
            <div className="acc__label">{c.label}</div>
            <div className="acc__h">
              Components that <span style={{ color: 'var(--ac-text)' }}>move</span>.
            </div>
            <div className="acc__blurb">{c.blurb}</div>
          </div>

          <div className="acc__btns">
            <Link to="/docs/installation" className="acc__btn acc__btn--solid">Read the docs</Link>
            <Link to="/components" className="acc__btn acc__btn--soft">Components</Link>
            <span className="acc__btn acc__btn--focus">Focus</span>
            <span className="acc__switch">
              <span className="acc__switch-thumb" />
            </span>
          </div>

          <div className="acc__toast">
            <div className="acc__toast-dot" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>Preview ready</div>
              <div style={{ fontSize: 12.5, color: 'var(--fg-3)' }}>
                pr-218 · <span style={{ color: 'var(--ac-text)' }}>veloce-docs.vercel.app</span>
              </div>
            </div>
          </div>

          <div className="acc__ramp">
            {c.steps.map((s) => (
              <div key={s} className="acc__step" style={{ background: s }} />
            ))}
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}
