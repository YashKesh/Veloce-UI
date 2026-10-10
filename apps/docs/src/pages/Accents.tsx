import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../theme'
import { SiteHeader } from '../components/SiteHeader'
import { Seo } from '../Seo'
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
  {
    label: 'D — DEEP BLUE',
    accent: 'blue',
    css: 'oklch(0.62 0.19 255)',
    vars: {
      '--ac': 'oklch(0.62 0.19 255)',
      '--ac-h': 'oklch(0.67 0.19 255)',
      '--ac-fg': 'oklch(0.99 0.01 255)',
      '--ac-text': 'oklch(0.78 0.14 255)',
    } as CSSProperties,
    blurb: 'Classic, trustworthy data-blue. The safe default for dashboards; white text on solid.',
    steps: rampSteps(255, 0.2),
  },
  {
    label: 'E — EMERALD',
    accent: 'emerald',
    css: 'oklch(0.72 0.16 155)',
    vars: {
      '--ac': 'oklch(0.72 0.16 155)',
      '--ac-h': 'oklch(0.77 0.16 155)',
      '--ac-fg': 'oklch(0.2 0.05 155)',
      '--ac-text': 'oklch(0.82 0.14 155)',
    } as CSSProperties,
    blurb: 'Growth and positive-trend green, calmer than lime. Reads well on white; dark text on solid.',
    steps: rampSteps(155, 0.16),
  },
  {
    label: 'F — AMBER',
    accent: 'amber',
    css: 'oklch(0.83 0.16 70)',
    vars: {
      '--ac': 'oklch(0.83 0.16 70)',
      '--ac-h': 'oklch(0.88 0.16 70)',
      '--ac-fg': 'oklch(0.25 0.06 70)',
      '--ac-text': 'oklch(0.85 0.15 70)',
    } as CSSProperties,
    blurb: 'Warm and energetic, high visibility on both canvases. Dark text on solid.',
    steps: rampSteps(70, 0.16),
  },
  {
    label: 'G — ROSE',
    accent: 'rose',
    css: 'oklch(0.65 0.22 12)',
    vars: {
      '--ac': 'oklch(0.65 0.22 12)',
      '--ac-h': 'oklch(0.7 0.22 12)',
      '--ac-fg': 'oklch(0.99 0.01 12)',
      '--ac-text': 'oklch(0.78 0.16 12)',
    } as CSSProperties,
    blurb: 'Bold and attention-grabbing without being alarm-red. White text on solid.',
    steps: rampSteps(12, 0.22),
  },
]

export default function Accents() {
  const { accent, setAccent } = useTheme()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Seo
        title="Accents"
        description="Seven accent palettes — Violet, Lime, Cyan, Blue, Emerald, Amber, Rose — rendered against every component so you can preview before you theme."
      />
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
