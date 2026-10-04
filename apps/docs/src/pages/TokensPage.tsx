import type { CSSProperties } from 'react'
import { SiteHeader } from '../components/SiteHeader'
import { Seo } from '../Seo'

const mono: CSSProperties = { fontFamily: 'var(--font-mono)' }

/* ---------- 12-step OKLCH ramps (exact algorithm from spec B) ---------- */
const L = [0.98, 0.95, 0.91, 0.86, 0.8, 0.73, 0.66, 0.58, 0.5, 0.42, 0.32, 0.2]

interface RampStep { n: number; l: string; css: string; dot: string; mark: string }
interface Ramp { name: string; hue: number; chroma: string; steps: RampStep[] }

function ramp(name: string, hue: number, c: number, solidIndex: number): Ramp {
  return {
    name,
    hue,
    chroma: c.toFixed(3),
    steps: L.map((l, i) => {
      const ch = c < 0.02 ? c : c * (0.25 + 0.75 * Math.sin((Math.PI * i) / 11))
      const isSolid = i === solidIndex
      return {
        n: i + 1,
        l: l.toFixed(2),
        css: `oklch(${l} ${ch.toFixed(3)} ${hue})`,
        dot: isSolid ? '●' : '',
        mark: l > 0.6 ? 'oklch(0.2 0 0)' : 'oklch(0.98 0 0)',
      }
    }),
  }
}

// solid step index per spec: neutral 0 · violet 7 · lime 2 · cyan 4
const RAMPS = [ramp('neutral', 260, 0.008, 0), ramp('violet', 292, 0.26, 7), ramp('lime', 128, 0.22, 2), ramp('cyan', 205, 0.14, 4)]

const SPACING = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16].map((n) => ({
  n,
  px: `${n * 4}px`,
  w: `${Math.min(100, ((n * 4) / 64) * 100)}%`,
}))

/* ---------- easing curves ---------- */
interface Curve { name: string; dur: string; use: string; bezier: string; p1x: number; p1y: number; p2x: number; p2y: number; path: string }
function bez(name: string, dur: string, b: [number, number, number, number], use: string): Curve {
  const [x1, y1, x2, y2] = b
  return {
    name,
    dur,
    use,
    bezier: `cubic-bezier(${b.join(', ')})`,
    p1x: x1 * 100,
    p1y: 100 - y1 * 100,
    p2x: x2 * 100,
    p2y: 100 - y2 * 100,
    path: `M0 100 C ${x1 * 100} ${100 - y1 * 100} ${x2 * 100} ${100 - y2 * 100} 100 0`,
  }
}
const CURVES = [
  bez('swift-out', '200ms', [0.16, 1, 0.3, 1], 'Enters. Ease-out-expo: arrives fast, lands soft. Dialogs, menus, toasts.'),
  bez('settle', '250ms', [0.22, 1, 0.36, 1], 'Layout and thumb moves. Slightly longer tail — reads as mass without overshoot.'),
  bez('exit', '150ms', [0.4, 0, 1, 1], 'Exits. Ease-in: accelerates away, gets out of the way. Never blur on exit.'),
  bez('press', '100ms', [0.2, 0, 0, 1], 'Press and color changes. Near-linear start, quick resolve. scale .97.'),
]

const ALIASES = [
  ['--vl-canvas', 'neutral.12'],
  ['--vl-surface', 'neutral.11'],
  ['--vl-accent', 'accent.solid'],
  ['--vl-ring', 'accent.solid / 2px offset'],
]

const DURATIONS = [
  ['--dur-100', 'press, color'],
  ['--dur-150', 'exit, ring'],
  ['--dur-200', 'enter'],
  ['--dur-250', 'layout, height'],
  ['--dur-350', 'page, sheet'],
]

const RADII: { r: number; label: string; accent?: boolean }[] = [
  { r: 4, label: 'xs · 4' },
  { r: 6, label: 'sm · 6' },
  { r: 8, label: 'md · 8', accent: true },
  { r: 10, label: 'lg · 10' },
  { r: 14, label: 'xl · 14' },
  { r: 999, label: 'full · 999' },
]

const cornerSample = (r: number): CSSProperties => ({
  width: 72,
  height: 72,
  borderRadius: r,
  border: '1px solid var(--line-2)',
  background: 'var(--bg-2)',
  borderTopColor: 'var(--ac)',
  borderLeftColor: 'var(--ac)',
})

const panel: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: 24,
  border: '1px solid var(--line)',
  borderRadius: 12,
  background: 'var(--bg-1)',
}

const typeRow: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '120px 1fr',
  padding: '12px 0',
  borderBottom: '1px solid var(--line)',
  alignItems: 'baseline',
}

export default function TokensPage() {
  return (
    <div>
      <Seo
        title="Design tokens"
        description="OKLCH color scales, spacing, radii, shadows, typography, and motion tokens that drive every Veloce UI component."
      />
      <SiteHeader />
      <div style={{ padding: '56px 64px', display: 'flex', flexDirection: 'column', gap: 40 }}>
        {/* header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 24, borderBottom: '1px solid var(--line-2)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ ...mono, fontSize: 12, letterSpacing: '.08em', color: 'var(--ac-text)' }}>VELOCE UI · TOKEN SPEC · v1.0</div>
            <h1 style={{ margin: 0, fontSize: 44, fontWeight: 600, letterSpacing: '-0.04em' }}>Design tokens</h1>
          </div>
          <div style={{ ...mono, display: 'grid', gridTemplateColumns: 'auto auto', gap: '4px 24px', fontSize: 12, color: 'var(--fg-3)', textAlign: 'right' }}>
            <span>COLOR SPACE</span><span style={{ color: 'var(--fg)' }}>OKLCH</span>
            <span>STEPS</span><span style={{ color: 'var(--fg)' }}>12 / scale</span>
            <span>BASE UNIT</span><span style={{ color: 'var(--fg)' }}>4px</span>
            <span>RADIUS</span><span style={{ color: 'var(--fg)' }}>8–10px</span>
          </div>
        </div>

        {/* color scales */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Color scales</h2>
            <span style={{ fontSize: 13, color: 'var(--fg-3)' }}>
              Step 1 = lightest surface, step 12 = darkest ink. Dark mode reads the scale in reverse. ● marks the solid step.
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {RAMPS.map((r) => (
              <div key={r.name} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 20, alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, textTransform: 'capitalize' }}>{r.name}</span>
                  <span style={{ ...mono, fontSize: 11.5, color: 'var(--fg-3)' }}>h {r.hue} · c {r.chroma}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 6 }}>
                  {r.steps.map((s) => (
                    <div key={s.n} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ height: 56, borderRadius: 8, background: s.css, border: '1px solid oklch(0.5 0 0/.15)', display: 'grid', placeItems: 'center', fontSize: 12, color: s.mark }}>
                        {s.dot}
                      </div>
                      <div style={{ ...mono, display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--fg-3)' }}>
                        <span style={{ color: 'var(--fg-2)' }}>{s.n}</span>
                        <span>L {s.l}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ ...mono, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, fontSize: 12 }}>
            {ALIASES.map(([a, v]) => (
              <div key={a} style={{ padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 9, display: 'flex', justifyContent: 'space-between', color: 'var(--fg-2)' }}>
                <span>{a}</span>
                <span style={{ color: 'var(--fg)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* spacing / radius / elevation */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32 }}>
          {/* spacing */}
          <div style={panel}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h2 className="vl-h2" style={{ margin: 0 }}>Spacing</h2>
              <span style={{ ...mono, fontSize: 11.5, color: 'var(--fg-3)' }}>4px base</span>
            </div>
            <div style={{ ...mono, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
              {SPACING.map((s) => (
                <div key={s.n} style={{ display: 'grid', gridTemplateColumns: '58px 1fr 40px', gap: 12, alignItems: 'center', color: 'var(--fg-2)' }}>
                  <span>--sp-{s.n}</span>
                  <div>
                    <div style={{ height: 14, borderRadius: 3, background: 'var(--ac)', width: s.w }} />
                  </div>
                  <span style={{ textAlign: 'right', color: 'var(--fg-3)' }}>{s.px}</span>
                </div>
              ))}
            </div>
          </div>
          {/* radius */}
          <div style={panel}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h2 className="vl-h2" style={{ margin: 0 }}>Radius</h2>
              <span style={{ ...mono, fontSize: 11.5, color: 'var(--fg-3)' }}>md is the default</span>
            </div>
            <div style={{ ...mono, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, fontSize: 11.5, color: 'var(--fg-2)' }}>
              {RADII.map((x) => (
                <div key={x.label} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                  {x.accent ? (
                    <div style={{ width: 72, height: 72, borderRadius: 8, border: '1px solid var(--ac)', background: 'var(--ac-soft)' }} />
                  ) : (
                    <div style={cornerSample(x.r)} />
                  )}
                  <span style={x.accent ? { color: 'var(--ac-text)' } : undefined}>{x.label}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--fg-3)' }}>
              Nested radius rule: inner = outer − padding. A 10px card with 4px padding holds 6px children.
            </div>
          </div>
          {/* elevation */}
          <div style={panel}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h2 className="vl-h2" style={{ margin: 0 }}>Elevation</h2>
              <span style={{ ...mono, fontSize: 11.5, color: 'var(--fg-3)' }}>shadow + border pair</span>
            </div>
            <div style={{ ...mono, display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14, padding: 12, borderRadius: 10, background: 'var(--bg-2)', fontSize: 11.5, color: 'var(--fg-2)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ height: 64, borderRadius: 9, background: 'var(--bg-1)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-sm)' }} />
                <span>sm · 0 1 2</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ height: 64, borderRadius: 9, background: 'var(--bg-1)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-md)' }} />
                <span>md · 0 4 12</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ height: 64, borderRadius: 9, background: 'var(--bg-1)', border: '1px solid var(--line-2)', boxShadow: 'var(--shadow-lg)' }} />
                <span>lg · 0 16 40</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ height: 64, borderRadius: 9, background: 'var(--bg-1)', border: '1px solid var(--line-2)', boxShadow: 'var(--shadow-lg),0 0 0 1px var(--ac-line),0 0 24px -4px var(--ac-soft)' }} />
                <span style={{ color: 'var(--ac-text)' }}>focus · lg + ring glow</span>
              </div>
            </div>
            <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--fg-3)' }}>
              Dark mode leans on borders and inset highlights; shadows only carry ambient depth.
            </div>
          </div>
        </div>

        {/* motion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 28, border: '1px solid var(--line-2)', borderRadius: 14, background: 'var(--bg-1)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(600px 200px at 100% 0%,var(--ac-soft),transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Motion tokens</h2>
              <span style={{ fontSize: 13, color: 'var(--fg-3)' }}>
                Fast and physical. Composites of opacity, scale, translate and blur — never spring overshoot.
              </span>
            </div>
            <span style={{ ...mono, fontSize: 11.5, color: 'var(--fg-3)' }}>durations · 100 / 150 / 200 / 250 / 350ms</span>
          </div>
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
            {CURVES.map((c) => (
              <div key={c.name} style={{ padding: 18, border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em' }}>{c.name}</span>
                  <span style={{ ...mono, fontSize: 12, color: 'var(--ac-text)' }}>{c.dur}</span>
                </div>
                <svg viewBox="-4 -4 108 108" style={{ width: '100%', height: 120, overflow: 'visible' }}>
                  <line x1="0" y1="100" x2="100" y2="100" stroke="var(--line-2)" strokeWidth="1" />
                  <line x1="0" y1="0" x2="0" y2="100" stroke="var(--line-2)" strokeWidth="1" />
                  <line x1="0" y1="100" x2="100" y2="0" stroke="var(--line)" strokeWidth="1" strokeDasharray="3 3" />
                  <path d={c.path} fill="none" stroke="var(--ac)" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx={c.p1x} cy={c.p1y} r="2.5" fill="var(--fg-3)" />
                  <circle cx={c.p2x} cy={c.p2y} r="2.5" fill="var(--fg-3)" />
                </svg>
                <div style={{ ...mono, fontSize: 11.5, color: 'var(--fg-2)' }}>{c.bezier}</div>
                <div style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--fg-3)' }}>{c.use}</div>
              </div>
            ))}
          </div>
          <div style={{ ...mono, position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10, fontSize: 12 }}>
            {DURATIONS.map(([d, use]) => (
              <div key={d} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', color: 'var(--fg-2)' }}>
                <span>{d}</span>
                <span style={{ color: 'var(--fg-3)' }}>{use}</span>
              </div>
            ))}
          </div>
        </div>

        {/* type + focus ring */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 className="vl-h2" style={{ margin: 0 }}>
              Type scale <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--fg-3)', marginLeft: 6 }}>Geist · tracking tightens as size grows</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--line)' }}>
              <div style={typeRow}>
                <span style={{ ...mono, fontSize: 11.5, color: 'var(--fg-3)' }}>display · 76 / -4.5</span>
                <span style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-0.045em', lineHeight: 1 }}>Components that move.</span>
              </div>
              <div style={typeRow}>
                <span style={{ ...mono, fontSize: 11.5, color: 'var(--fg-3)' }}>h1 · 36 / -3</span>
                <span style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.1 }}>Dialog</span>
              </div>
              <div style={typeRow}>
                <span style={{ ...mono, fontSize: 11.5, color: 'var(--fg-3)' }}>h2 · 22 / -2</span>
                <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Accessibility</span>
              </div>
              <div style={typeRow}>
                <span style={{ ...mono, fontSize: 11.5, color: 'var(--fg-3)' }}>body · 14 / 0</span>
                <span style={{ fontSize: 14, color: 'var(--fg-2)' }}>Traps focus, restores it on close, and enters with a scale-fade composite.</span>
              </div>
              <div style={typeRow}>
                <span style={{ ...mono, fontSize: 11.5, color: 'var(--fg-3)' }}>mono · 13 / 0</span>
                <span style={{ ...mono, fontSize: 13, color: 'var(--fg-2)' }}>npx veloce add dialog</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 className="vl-h2" style={{ margin: 0 }}>
              Focus ring <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--fg-3)', marginLeft: 6 }}>2px offset · 2px accent · 150ms</span>
            </h2>
            <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24, padding: 28, border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-1)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', height: 36, padding: '0 14px', borderRadius: 9, background: 'var(--ac)', color: 'var(--ac-fg)', fontSize: 14, fontWeight: 500, boxShadow: '0 0 0 2px var(--bg-1),0 0 0 4px var(--ac)' }}>
                Solid
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', height: 36, padding: '0 14px', borderRadius: 9, border: '1px solid var(--line-2)', fontSize: 14, fontWeight: 500, boxShadow: '0 0 0 2px var(--bg-1),0 0 0 4px var(--ac)' }}>
                Outline
              </span>
              <span style={{ position: 'relative', width: 38, height: 22, borderRadius: 999, background: 'var(--ac)', display: 'block', boxShadow: '0 0 0 2px var(--bg-1),0 0 0 4px var(--ac)' }}>
                <span style={{ position: 'absolute', top: 2, left: 18, width: 18, height: 18, borderRadius: '50%', background: 'oklch(0.99 0 0)' }} />
              </span>
              <span style={{ width: 18, height: 18, borderRadius: 5, background: 'var(--ac)', color: 'var(--ac-fg)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, boxShadow: '0 0 0 2px var(--bg-1),0 0 0 4px var(--ac)' }}>
                ✓
              </span>
              <a href="#focus" style={{ fontSize: 14, borderRadius: 4, boxShadow: '0 0 0 2px var(--bg-1),0 0 0 4px var(--ac)', padding: '0 2px' }}>
                Inline link
              </a>
              <div style={{ ...mono, width: '100%', fontSize: 11.5, color: 'var(--fg-3)', lineHeight: 1.6 }}>
                box-shadow: 0 0 0 2px var(--vl-surface), 0 0 0 4px var(--vl-accent)
                <br />
                Ring color is the solid accent step for every accent — contrast against both canvases ≥ 3:1.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
