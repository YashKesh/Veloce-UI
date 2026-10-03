import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { DocsShell } from '../components/DocsShell'
import { DOCS_SIDEBAR } from '../docsNav'

// ---------- Series color ramp (used literally per spec) ----------
const AC = 'var(--ac)'
const MIX60 = 'color-mix(in oklch,var(--ac) 60%,var(--bg-3))'
const MIX35 = 'color-mix(in oklch,var(--ac) 35%,var(--bg-3))'
const NEUTRAL = 'var(--fg-3)'

// ---------- Shared chart math (mirrors the artboard script) ----------
/** Bars: per bar `M{20+i*70+11+off} {200−h}h22v{h}h-22z` with h=v/120*180 */
function rects(arr: number[], off: number): string {
  return arr
    .map((v, i) => {
      const h = (v / 120) * 180
      return `M${20 + i * 70 + 11 + off} ${(200 - h).toFixed(1)}h22v${h.toFixed(1)}h-22z`
    })
    .join(' ')
}

/** Donut: circumference C=2π·54; dash="len (C−len)", offset=−(cumulative previous len) */
const C = 2 * Math.PI * 54
function donutArcs(pcts: number[]): Array<{ dash: string; offset: string }> {
  let cum = 0
  return pcts.map((p) => {
    const len = (p / 100) * C
    const arc = { dash: `${len.toFixed(2)} ${(C - len).toFixed(2)}`, offset: (-cum).toFixed(2) }
    cum += len
    return arc
  })
}

/** Sparkline (viewBox 0 0 100 32): x=i*(100/(n−1)), y=30−(v−min)/(max−min)*26 */
function sparkPath(arr: number[]): string {
  const min = Math.min(...arr)
  const max = Math.max(...arr)
  return arr
    .map((v, i) => {
      const x = i * (100 / (arr.length - 1))
      const y = 30 - ((v - min) / (max - min)) * 26
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
}

// ---------- Literal data arrays (from the artboard script) ----------
const barsA = [64, 72, 58, 90, 84, 102, 96, 118] // Production, offset 0
const barsB = [40, 46, 52, 48, 60, 66, 72, 80] // Preview, offset 26
const donut = [46, 27, 17, 10]
const spark1 = [12, 14, 13, 18, 17, 22, 21, 26, 30]
const spark2 = [40, 38, 41, 37, 35, 36, 33, 31, 30]
const spark3 = [5, 9, 7, 12, 10, 14, 13, 15, 19]

// Heatmap intensity matrix (hour 0→23). 'ac' = plain var(--ac); 'ac*' = var(--ac) + hover ring.
type HeatCell = number | 'ac' | 'ac*'
const HEATMAP: Array<{ day: string; cells: HeatCell[] }> = [
  { day: 'Mon', cells: [8, 6, 5, 5, 8, 14, 26, 42, 62, 78, 88, 'ac', 84, 90, 94, 82, 66, 50, 40, 34, 28, 20, 14, 10] },
  { day: 'Tue', cells: [7, 5, 4, 5, 9, 16, 30, 48, 68, 84, 92, 96, 86, 92, 'ac*', 88, 70, 54, 42, 36, 30, 22, 15, 10] },
  { day: 'Wed', cells: [7, 5, 4, 5, 8, 15, 28, 46, 66, 80, 90, 94, 84, 90, 96, 84, 68, 52, 40, 34, 28, 20, 14, 9] },
  { day: 'Thu', cells: [8, 6, 5, 6, 9, 16, 30, 50, 70, 86, 94, 'ac', 88, 92, 96, 86, 70, 54, 42, 36, 30, 22, 16, 10] },
  { day: 'Fri', cells: [7, 5, 4, 5, 8, 14, 26, 44, 62, 76, 84, 88, 78, 80, 82, 70, 54, 40, 30, 26, 22, 16, 12, 8] },
  { day: 'Sat', cells: [5, 4, 3, 3, 4, 6, 10, 16, 22, 28, 32, 34, 32, 34, 36, 32, 28, 24, 22, 20, 18, 14, 10, 6] },
  { day: 'Sun', cells: [4, 3, 3, 3, 4, 5, 8, 12, 18, 24, 28, 30, 30, 32, 34, 32, 30, 28, 26, 24, 20, 14, 10, 6] },
]

const mono: CSSProperties = { fontFamily: 'var(--font-mono)' }

const card: CSSProperties = {
  border: '1px solid var(--line)',
  borderRadius: 12,
  background: 'var(--bg-1)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}

function CardHeader({ title, sub, right }: { title: string; sub: string; right?: ReactNode }) {
  return (
    <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 12.5, color: 'var(--fg-3)' }}>{sub}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {right}
        <span style={{ color: 'var(--fg-3)' }}>⋯</span>
      </div>
    </div>
  )
}

function Sparkline({ data, stroke }: { data: number[]; stroke: string }) {
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" style={{ width: '100%', height: 36, overflow: 'visible', display: 'block' }}>
      <path d={sparkPath(data)} fill="none" stroke={stroke} strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function KpiCard({ label, delta, deltaColor, value, unit, spark, sparkStroke }: {
  label: string
  delta: string
  deltaColor: string
  value: string
  unit?: string
  spark: number[]
  sparkStroke: string
}) {
  return (
    <div style={{ padding: '18px 20px', border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-1)', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--fg-2)' }}>
        <span>{label}</span>
        <span style={{ color: deltaColor, fontVariantNumeric: 'tabular-nums' }}>{delta}</span>
      </div>
      <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
        {value}
        {unit ? <span style={{ fontSize: 16, color: 'var(--fg-3)', fontWeight: 500, marginLeft: 2 }}>{unit}</span> : null}
      </div>
      <Sparkline data={spark} stroke={sparkStroke} />
    </div>
  )
}

export default function ChartsPage() {
  const arcs = donutArcs(donut)
  const donutColors = [AC, MIX60, MIX35, NEUTRAL]
  const weekLabels = ['W32', 'W33', 'W34', 'W35', 'W36', 'W37', 'W38', 'W39']

  return (
    <DocsShell sidebar={DOCS_SIDEBAR} wide>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* breadcrumb */}
        <div style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--fg-3)' }}>
          <span>Components</span><span>›</span><span>Charts</span><span>›</span>
          <span style={{ color: 'var(--fg-2)' }}>Overview</span>
        </div>

        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 20, borderBottom: '1px solid var(--line-2)' }}>
          <div>
            <div style={{ ...mono, fontSize: 12, letterSpacing: '0.08em', color: 'var(--ac-text)' }}>VELOCE CHARTS · 1.1</div>
            <h1 style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.035em', margin: 0 }}>One palette, one motion, eight chart types</h1>
            <Link to="/charts/catalogue" style={{ ...mono, fontSize: 12, color: 'var(--ac-text)', textDecoration: 'none', display: 'inline-block', marginTop: 6 }}>
              Browse the full catalogue →
            </Link>
          </div>
          <div style={{ ...mono, fontSize: 12, color: 'var(--fg-3)', textAlign: 'right', lineHeight: 1.7 }}>
            series colors: accent → accent 60% → accent 35% → neutral
            <br />
            categorical fallback: hue-rotated at equal L/C
          </div>
        </div>

        {/* Row 1 — KPI cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          <KpiCard label="Weekly active users" delta="+12.4%" deltaColor="var(--ok)" value="48,210" spark={spark1} sparkStroke="var(--ac)" />
          <KpiCard label="p95 latency" delta="−18ms" deltaColor="var(--ok)" value="142" unit="ms" spark={spark2} sparkStroke="var(--fg-3)" />
          <KpiCard label="Error rate" delta="+0.3pp" deltaColor="var(--err)" value="1.9" unit="%" spark={spark3} sparkStroke="var(--err)" />
          {/* Gauge card */}
          <div style={{ padding: '18px 20px', border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-1)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--fg-2)' }}>
              <span>Build minutes</span>
              <span style={{ ...mono, fontSize: 11.5, color: 'var(--fg-3)' }}>gauge</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'conic-gradient(var(--ac) 0 68%,var(--bg-3) 68% 100%)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--bg-1)', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  68%
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 12.5, color: 'var(--fg-2)' }}>
                <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--fg)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>4,080</span>
                <span>of 6,000 included</span>
                <span style={{ color: 'var(--fg-3)' }}>resets in 11 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 — grouped bars + donut */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
          {/* Grouped bar chart */}
          <div style={card}>
            <CardHeader
              title="Deployments per week"
              sub="Production vs preview · last 8 weeks"
              right={
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12.5, color: 'var(--fg-2)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: AC }} />Production
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: MIX35 }} />Preview
                  </span>
                </div>
              }
            />
            <div style={{ padding: '16px 18px 10px' }}>
              <svg viewBox="0 0 600 220" style={{ width: '100%', display: 'block', overflow: 'visible' }}>
                <line x1={20} y1={200} x2={580} y2={200} stroke="var(--line-2)" />
                {[140, 80, 20].map((y) => (
                  <line key={y} x1={20} y1={y} x2={580} y2={y} stroke="var(--line)" strokeDasharray="2 4" />
                ))}
                <path d={rects(barsB, 26)} fill={MIX35} />
                <path d={rects(barsA, 0)} fill={AC} />
                <rect x="521" y="14" width="58" height="192" rx="6" fill="var(--fg)" fillOpacity=".05" />
                {([[203, '0'], [83, '80'], [23, '120']] as Array<[number, string]>).map(([y, t]) => (
                  <text key={t} x={586} y={y} fontSize={10} fill="var(--fg-3)" style={mono}>{t}</text>
                ))}
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 26px 0 22px', ...mono, fontSize: 10.5, color: 'var(--fg-3)' }}>
                {weekLabels.map((w) => (
                  <span key={w} style={w === 'W39' ? { color: 'var(--fg)' } : undefined}>{w}</span>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 'auto', padding: '10px 18px', borderTop: '1px solid var(--line)', ...mono, fontSize: 11, color: 'var(--fg-3)', display: 'flex', justifyContent: 'space-between' }}>
              <span>bars grow from baseline · 400ms settle · stagger 30ms</span>
              <span>hover: siblings dim to 60%, 150ms</span>
            </div>
          </div>

          {/* Donut */}
          <div style={card}>
            <CardHeader title="Traffic by source" sub="30 days · 1.24M sessions" />
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 20, alignItems: 'center', padding: '20px 18px', flex: 1 }}>
              <div style={{ position: 'relative', width: 150, height: 150 }}>
                <svg width={150} height={150} viewBox="0 0 150 150" style={{ transform: 'rotate(-90deg)', display: 'block' }}>
                  <circle cx={75} cy={75} r={54} fill="none" stroke="var(--bg-3)" strokeWidth={18} />
                  {arcs.map((a, i) => (
                    <circle key={i} cx={75} cy={75} r={54} fill="none" stroke={donutColors[i]} strokeWidth={18} strokeDasharray={a.dash} strokeDashoffset={a.offset} />
                  ))}
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>46%</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3 }}>Organic</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 13 }}>
                {([
                  ['Organic search', '571k', '46%', AC, true],
                  ['Direct', '335k', '27%', MIX60, false],
                  ['Referral', '211k', '17%', MIX35, false],
                  ['Social', '124k', '10%', NEUTRAL, false],
                ] as Array<[string, string, string, string, boolean]>).map(([label, sessions, pct, swatch, hovered]) => (
                  <div
                    key={label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      ...(hovered ? { padding: '6px 8px', margin: '0 -8px', borderRadius: 7, background: 'var(--bg-2)' } : {}),
                    }}
                  >
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: swatch, flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{label}</span>
                    <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--fg-3)' }}>{sessions}</span>
                    <span style={{ fontVariantNumeric: 'tabular-nums', width: 36, textAlign: 'right', fontWeight: hovered ? 500 : undefined }}>{pct}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 'auto', padding: '10px 18px', borderTop: '1px solid var(--line)', ...mono, fontSize: 11, color: 'var(--fg-3)' }}>
              arcs sweep clockwise 500ms · hovered arc offsets 4px · legend row is the a11y table
            </div>
          </div>
        </div>

        {/* Row 3 — heatmap + loading + empty */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 16 }}>
          {/* Heatmap */}
          <div style={card}>
            <CardHeader
              title="Request volume"
              sub="Heatmap · hour × weekday"
              right={
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, ...mono, fontSize: 10.5, color: 'var(--fg-3)' }}>
                  <span>low</span>
                  <span style={{ width: 80, height: 8, borderRadius: 4, background: 'linear-gradient(90deg,var(--bg-3),var(--ac))' }} />
                  <span>high</span>
                </div>
              }
            />
            <div style={{ padding: '16px 18px', display: 'grid', gridTemplateColumns: '34px 1fr', gap: 6, ...mono, fontSize: 10.5, color: 'var(--fg-3)' }}>
              <div style={{ display: 'grid', gridTemplateRows: 'repeat(7,18px)', gap: 3, alignItems: 'center' }}>
                {HEATMAP.map((r) => (
                  <span key={r.day}>{r.day}</span>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24,1fr)', gridTemplateRows: 'repeat(7,18px)', gap: 3 }}>
                {HEATMAP.flatMap((r) =>
                  r.cells.map((c, h) => (
                    <div
                      key={`${r.day}-${h}`}
                      style={{
                        borderRadius: 3,
                        background: c === 'ac' || c === 'ac*' ? 'var(--ac)' : `color-mix(in oklch,var(--ac) ${c}%,var(--bg-3))`,
                        ...(c === 'ac*' ? { boxShadow: '0 0 0 2px var(--bg-1),0 0 0 3px var(--fg)' } : {}),
                      }}
                    />
                  )),
                )}
              </div>
              <div />
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 2 }}>
                <span>00</span>
                <span>06</span>
                <span>12</span>
                <span>18</span>
                <span>23</span>
              </div>
            </div>
          </div>

          {/* Loading */}
          <div style={card}>
            <CardHeader title="Loading" sub="Skeleton keeps axes; series shimmer" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 18, gap: 10 }}>
              <div style={{ flex: 1, minHeight: 140, borderBottom: '1px solid var(--line-2)', borderLeft: '1px solid var(--line-2)', position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: 8,
                    right: 8,
                    bottom: 10,
                    height: '60%',
                    borderRadius: 8,
                    background: 'linear-gradient(90deg,var(--bg-3) 25%,var(--line-2) 50%,var(--bg-3) 75%) 0 0/200% 100%',
                    animation: 'vl-shimmer 1.6s linear infinite',
                    clipPath: 'polygon(0 90%,15% 70%,30% 78%,45% 50%,60% 58%,75% 30%,90% 38%,100% 10%,100% 100%,0 100%)',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} style={{ width: 24, height: 8, borderRadius: 4, background: 'var(--bg-3)' }} />
                ))}
              </div>
            </div>
          </div>

          {/* Empty & error */}
          <div style={card}>
            <CardHeader title="Empty & error" sub="Axes stay, message replaces series" />
            <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: 18 }}>
              <div style={{ maxWidth: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--bg-3)', display: 'grid', placeItems: 'center', color: 'var(--fg-3)', fontSize: 15 }}>∿</div>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>No data for this range</div>
                <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--fg-2)' }}>Try the last 30 days, or connect a source.</div>
                <span style={{ display: 'inline-flex', alignItems: 'center', height: 30, padding: '0 11px', borderRadius: 7, background: 'var(--ac-soft)', color: 'var(--ac-text)', fontSize: 12.5, fontWeight: 500 }}>
                  Last 30 days
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DocsShell>
  )
}
