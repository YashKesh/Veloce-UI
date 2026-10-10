import { useMemo, useState, type CSSProperties } from 'react'
import { Button, Badge, Avatar, Progress, Input } from 'veloce-ui'
import { Seo } from '../Seo'
import { SiteHeader } from '../components/SiteHeader'
import { CodeBlock } from '../components/CodeBlock'

// =============================================================================
// Theme Studio — paste a hex (or pick a preset), get a full OKLCH ramp +
// copy-paste CSS variables that Veloce components consume.
// =============================================================================

// ---- Color utils (sRGB hex ↔ OKLCH) ------------------------------------------
// Minimal OKLCH implementation. Precision is fine for UI tokens.

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return null
  let h = m[1]
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const n = parseInt(h, 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}
function srgbToLinear(c: number): number { return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) }
function linearToSrgb(c: number): number { return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055 }
function rgbToOklch(r: number, g: number, b: number): [number, number, number] {
  const lr = srgbToLinear(r), lg = srgbToLinear(g), lb = srgbToLinear(b)
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)
  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
  const C = Math.sqrt(a * a + bb * bb)
  let H = Math.atan2(bb, a) * 180 / Math.PI
  if (H < 0) H += 360
  return [L, C, H]
}
function oklchToRgb(L: number, C: number, H: number): [number, number, number] {
  const h = H * Math.PI / 180
  const a = C * Math.cos(h), b = C * Math.sin(h)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b
  const l = l_ * l_ * l_, m = m_ * m_ * m_, s = s_ * s_ * s_
  const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const bb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
  return [linearToSrgb(r), linearToSrgb(g), linearToSrgb(bb)]
}
function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (x: number) => Math.max(0, Math.min(255, Math.round(x * 255)))
  const h = (n: number) => n.toString(16).padStart(2, '0')
  return `#${h(clamp(r))}${h(clamp(g))}${h(clamp(b))}`
}
function oklchStr(L: number, C: number, H: number, decimals = 3): string {
  const r = (n: number, d: number) => Number(n.toFixed(d))
  return `oklch(${r(L, decimals)} ${r(C, decimals)} ${r(H, 1)})`
}

// ---- Ramp generation ---------------------------------------------------------

interface Theme {
  mode: 'dark' | 'light'
  accentL: number
  accentC: number
  accentH: number
}

interface Token {
  name: string
  value: string
  swatch: string
  description: string
}

function buildTokens(theme: Theme): Token[] {
  const { mode, accentL, accentC, accentH } = theme
  const [ar, ag, ab] = oklchToRgb(accentL, accentC, accentH)
  const accentHex = rgbToHex(ar, ag, ab)

  // Hover: nudge L down (dark mode) or up (light mode) slightly
  const acH = oklchStr(mode === 'dark' ? accentL + 0.05 : accentL - 0.05, accentC, accentH)
  const acSoft = `color-mix(in oklch, ${oklchStr(accentL, accentC, accentH)} 15%, transparent)`
  const acLine = `color-mix(in oklch, ${oklchStr(accentL, accentC, accentH)} 40%, transparent)`
  const acText = oklchStr(mode === 'dark' ? Math.min(0.95, accentL + 0.15) : Math.max(0.25, accentL - 0.1), accentC * 0.95, accentH)
  const acFg = mode === 'dark' ? '#ffffff' : '#ffffff'

  // Backgrounds — same hue as accent for a cohesive tint but near-neutral chroma
  const bgSteps = mode === 'dark'
    ? [0.14, 0.18, 0.22, 0.26]
    : [0.985, 0.97, 0.95, 0.93]
  const fgSteps = mode === 'dark'
    ? [0.96, 0.78, 0.55]
    : [0.22, 0.4, 0.55]
  const lineSteps = mode === 'dark' ? [0.30, 0.36] : [0.88, 0.80]

  const bgC = Math.min(0.02, accentC * 0.1)

  const bg = oklchStr(bgSteps[0], bgC, accentH)
  const bg1 = oklchStr(bgSteps[1], bgC, accentH)
  const bg2 = oklchStr(bgSteps[2], bgC, accentH)
  const bg3 = oklchStr(bgSteps[3], bgC, accentH)
  const fg = oklchStr(fgSteps[0], 0.01, accentH)
  const fg2 = oklchStr(fgSteps[1], 0.01, accentH)
  const fg3 = oklchStr(fgSteps[2], 0.01, accentH)
  const line = oklchStr(lineSteps[0], bgC, accentH)
  const line2 = oklchStr(lineSteps[1], bgC, accentH)

  // Status colours — fixed hues, luminance tracks the mode
  const okL = mode === 'dark' ? 0.72 : 0.52
  const warnL = mode === 'dark' ? 0.78 : 0.55
  const errL = mode === 'dark' ? 0.65 : 0.50
  const infoL = mode === 'dark' ? 0.73 : 0.52

  const ok = oklchStr(okL, 0.17, 155)
  const warn = oklchStr(warnL, 0.17, 70)
  const err = oklchStr(errL, 0.22, 25)
  const info = oklchStr(infoL, 0.14, 240)

  return [
    { name: '--ac',      value: accentHex,                                  swatch: accentHex,                                  description: 'Primary accent — buttons, highlights, focus rings' },
    { name: '--ac-h',    value: acH,                                        swatch: oklchHexPreview(mode === 'dark' ? accentL + 0.05 : accentL - 0.05, accentC, accentH), description: 'Accent hover state' },
    { name: '--ac-soft', value: acSoft,                                     swatch: `color-mix(in oklch, ${accentHex} 15%, transparent)`, description: 'Accent fill at 15% — soft chips, badges' },
    { name: '--ac-line', value: acLine,                                     swatch: `color-mix(in oklch, ${accentHex} 40%, transparent)`, description: 'Accent border — selected rows' },
    { name: '--ac-text', value: acText,                                     swatch: oklchHexPreview(mode === 'dark' ? Math.min(0.95, accentL + 0.15) : Math.max(0.25, accentL - 0.1), accentC * 0.95, accentH), description: 'Text-safe accent — readable on bg' },
    { name: '--ac-fg',   value: acFg,                                       swatch: acFg,                                       description: 'Foreground on accent fills' },

    { name: '--bg',   value: bg,  swatch: oklchHexPreview(bgSteps[0], bgC, accentH), description: 'Page background' },
    { name: '--bg-1', value: bg1, swatch: oklchHexPreview(bgSteps[1], bgC, accentH), description: 'Card / panel background' },
    { name: '--bg-2', value: bg2, swatch: oklchHexPreview(bgSteps[2], bgC, accentH), description: 'Elevated surface' },
    { name: '--bg-3', value: bg3, swatch: oklchHexPreview(bgSteps[3], bgC, accentH), description: 'Hover / selected' },

    { name: '--fg',   value: fg,  swatch: oklchHexPreview(fgSteps[0], 0.01, accentH), description: 'Primary text' },
    { name: '--fg-2', value: fg2, swatch: oklchHexPreview(fgSteps[1], 0.01, accentH), description: 'Secondary text' },
    { name: '--fg-3', value: fg3, swatch: oklchHexPreview(fgSteps[2], 0.01, accentH), description: 'Muted / caption text' },

    { name: '--line',   value: line,  swatch: oklchHexPreview(lineSteps[0], bgC, accentH), description: 'Hairline divider' },
    { name: '--line-2', value: line2, swatch: oklchHexPreview(lineSteps[1], bgC, accentH), description: 'Interactive border' },

    { name: '--ok',   value: ok,   swatch: oklchHexPreview(okL, 0.17, 155),   description: 'Success state' },
    { name: '--warn', value: warn, swatch: oklchHexPreview(warnL, 0.17, 70),  description: 'Warning state' },
    { name: '--err',  value: err,  swatch: oklchHexPreview(errL, 0.22, 25),   description: 'Error state' },
    { name: '--info', value: info, swatch: oklchHexPreview(infoL, 0.14, 240), description: 'Info state' },
  ]
}

function oklchHexPreview(L: number, C: number, H: number): string {
  const [r, g, b] = oklchToRgb(L, C, H)
  return rgbToHex(r, g, b)
}

const PRESETS: { name: string; hex: string }[] = [
  { name: 'Violet',    hex: '#7c6bff' },
  { name: 'Cyan',      hex: '#06b6d4' },
  { name: 'Emerald',   hex: '#10b981' },
  { name: 'Amber',     hex: '#f59e0b' },
  { name: 'Rose',      hex: '#f43f5e' },
  { name: 'Blue',      hex: '#3b82f6' },
  { name: 'Fuchsia',   hex: '#d946ef' },
  { name: 'Lime',      hex: '#84cc16' },
  { name: 'Slate',     hex: '#64748b' },
]

export default function ThemeStudio() {
  const [hex, setHex] = useState('#7c6bff')
  const [mode, setMode] = useState<'dark' | 'light'>('dark')

  const theme: Theme = useMemo(() => {
    const rgb = hexToRgb(hex)
    if (!rgb) return { mode, accentL: 0.68, accentC: 0.19, accentH: 285 }
    const [L, C, H] = rgbToOklch(...rgb)
    return { mode, accentL: L, accentC: C, accentH: H }
  }, [hex, mode])

  const tokens = useMemo(() => buildTokens(theme), [theme])

  const css = useMemo(() => {
    const lines = [`:root[data-mode="${mode}"] {`]
    for (const t of tokens) lines.push(`  ${t.name}: ${t.value};`)
    lines.push('}')
    return lines.join('\n')
  }, [tokens, mode])

  // Preview style overrides — applied inline to a scoped preview wrapper
  const previewStyle: CSSProperties = Object.fromEntries(
    tokens.map((t) => [t.name, t.value])
  ) as CSSProperties

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Seo title="Theme studio" description="Paste any hex, get a full OKLCH-native Veloce theme — copy-paste CSS variables that cascade through every component." />
      <SiteHeader height={56} />

      <section style={{ padding: '48px 24px 24px', maxWidth: 1200, width: '100%', marginInline: 'auto' }}>
        <div style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', marginBottom: 10 }}>Theme studio</div>
        <h1 style={{ margin: 0, fontSize: 44, fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--fg)' }}>
          Pick a colour. Get a theme.
        </h1>
        <p style={{ margin: '14px 0 0', fontSize: 16, lineHeight: 1.6, color: 'var(--fg-2)', maxWidth: 640 }}>
          OKLCH-native ramps so every surface, text, and status colour stays in harmony. Paste a hex or pick a preset — then copy the generated CSS.
        </p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, padding: '0 24px 72px', maxWidth: 1200, width: '100%', marginInline: 'auto' }}>
        {/* Controls */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-1)', padding: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--fg-2)', marginBottom: 8 }}>Brand colour</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="color"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                style={{ width: 48, height: 36, padding: 0, border: '1px solid var(--line-2)', borderRadius: 7, background: 'var(--bg)', cursor: 'pointer' }}
              />
              <Input
                size="sm"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                placeholder="#7c6bff"
                style={{ flex: 1, fontFamily: 'var(--font-mono)' }}
              />
            </div>
            <div style={{ marginTop: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--fg-2)', marginBottom: 8 }}>Mode</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['dark', 'light'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    style={{
                      flex: 1, padding: '7px 10px', borderRadius: 7,
                      border: `1px solid ${mode === m ? 'var(--ac)' : 'var(--line-2)'}`,
                      background: mode === m ? 'color-mix(in oklch, var(--ac) 10%, transparent)' : 'var(--bg)',
                      color: 'var(--fg)', fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit',
                      textTransform: 'capitalize',
                    }}
                  >{m}</button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-1)', padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--fg-2)', marginBottom: 10 }}>Presets</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setHex(p.hex)}
                  title={p.name}
                  style={{
                    padding: 8, borderRadius: 7, border: `1px solid ${hex.toLowerCase() === p.hex.toLowerCase() ? 'var(--ac)' : 'var(--line-2)'}`,
                    background: 'var(--bg)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, fontFamily: 'inherit',
                  }}
                >
                  <span style={{ width: 24, height: 24, borderRadius: 6, background: p.hex, border: '1px solid var(--line)' }} />
                  <span style={{ fontSize: 11, color: 'var(--fg-3)' }}>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-1)', padding: 16 }}>
            <strong style={{ fontSize: 13, display: 'block', marginBottom: 10 }}>CSS to copy</strong>
            <CodeBlock lang="css" code={css} maxHeight={280} />
          </div>
        </aside>

        {/* Preview */}
        <main>
          <div className="vl-theme-preview" style={{ ...previewStyle, background: 'var(--bg)', color: 'var(--fg)', border: '1px solid var(--line)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minHeight: 600 }}>
            {/* Swatches */}
            <section>
              <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>Token palette</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 10 }}>
                {tokens.map((t) => (
                  <div key={t.name} style={{ padding: 10, border: '1px solid var(--line)', borderRadius: 8, background: 'var(--bg-1)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 6, background: t.swatch, border: '1px solid var(--line-2)', flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 11.5, fontFamily: 'var(--font-mono)', color: 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>{t.swatch}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Component preview */}
            <section>
              <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>Component preview</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                <PreviewCard title="Buttons">
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Button variant="primary">Primary</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="destructive">Delete</Button>
                  </div>
                </PreviewCard>

                <PreviewCard title="Badges">
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <Badge tone="accent" variant="soft">Accent</Badge>
                    <Badge tone="ok" variant="soft">OK</Badge>
                    <Badge tone="warn" variant="soft">Warn</Badge>
                    <Badge tone="err" variant="soft">Err</Badge>
                    <Badge tone="neutral" variant="soft">Neutral</Badge>
                  </div>
                </PreviewCard>

                <PreviewCard title="Avatars">
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <Avatar size="sm" name="Ada" />
                    <Avatar size="md" name="Alan" />
                    <Avatar size="lg" name="Grace" />
                  </div>
                </PreviewCard>

                <PreviewCard title="Progress">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Progress value={32} />
                    <Progress value={68} />
                    <Progress value={94} />
                  </div>
                </PreviewCard>

                <PreviewCard title="Input">
                  <Input size="sm" placeholder="your-email@domain.com" />
                </PreviewCard>

                <PreviewCard title="Typography">
                  <h4 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'var(--fg)' }}>Heading</h4>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-2)' }}>Body text at --fg-2</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--fg-3)' }}>Caption text at --fg-3</p>
                  <span style={{ fontSize: 13, color: 'var(--ac-text)' }}>Accent link →</span>
                </PreviewCard>
              </div>
            </section>

            {/* Mini dashboard mockup */}
            <section>
              <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>In context</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[['Revenue', '$142k', '+12%'], ['Active', '8,420', '+3%'], ['NPS', '68', '+4']].map(([lab, val, dlt], i) => (
                  <div key={i} style={{ padding: 14, border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg-1)' }}>
                    <div style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase' }}>{lab}</div>
                    <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--fg)', marginTop: 4 }}>{val}</div>
                    <div style={{ fontSize: 12, color: 'var(--ok)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>↑ {dlt}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

function PreviewCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: 14, border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg-1)' }}>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10, fontFamily: 'var(--font-mono)' }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>
    </div>
  )
}
