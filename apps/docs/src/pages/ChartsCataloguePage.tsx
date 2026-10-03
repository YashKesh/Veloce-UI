import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { DocsShell, RightRail } from '../components/DocsShell'
import { DOCS_SIDEBAR, CATALOGUE_SERIES } from '../docsNav'

const AC = 'var(--ac)'
const MIX75 = 'color-mix(in oklch,var(--ac) 75%,var(--bg-3))'
const MIX60 = 'color-mix(in oklch,var(--ac) 60%,var(--bg-3))'
const MIX50 = 'color-mix(in oklch,var(--ac) 50%,var(--bg-3))'
const MIX35 = 'color-mix(in oklch,var(--ac) 35%,var(--bg-3))'
const MIX30 = 'color-mix(in oklch,var(--ac) 30%,var(--bg-3))'

const mono: CSSProperties = { fontFamily: 'var(--font-mono)' }

// ---------- Shared catalogue-tile SVG math (viewBox 0 0 300 160, plot x10..290 y10..150) ----------
const f1 = (n: number) => n.toFixed(1)
const cx = (i: number, n: number) => 10 + i * (280 / (n - 1))
const cy = (v: number, mx: number) => 150 - (v / mx) * 140
const path = (arr: number[], mx: number) =>
  arr.map((v, i) => `${i === 0 ? 'M' : 'L'}${f1(cx(i, arr.length))} ${f1(cy(v, mx))}`).join(' ')

const S1 = [20, 26, 24, 32, 30, 38, 36, 44, 50, 48, 56, 60]
const S2 = [14, 16, 18, 17, 22, 24, 26, 25, 30, 33, 32, 36]
const top = S1.map((v, i) => v + S2[i])

const stackLine1 = path(S1, 100)
const stackLine2 = path(top, 100)
const stackLow = `${stackLine1} L290 150 L10 150 Z`
const stackHigh =
  top.map((v, i) => `${i === 0 ? 'M' : 'L'}${f1(cx(i, top.length))} ${f1(cy(v, 100))}`).join(' ') +
  ' ' +
  [...S1].reverse().map((v, i) => `L${f1(cx(S1.length - 1 - i, S1.length))} ${f1(cy(v, 100))}`).join(' ') +
  ' Z'

const stepVals = [30, 30, 48, 48, 42, 42, 66, 66, 60, 60, 84, 84]
const stepPath = stepVals
  .map((v, i) => {
    const x = 10 + Math.floor(i / 2) * (280 / 6) + (i % 2) * (280 / 6)
    return `${i === 0 ? 'M' : 'L'}${f1(x)} ${f1(cy(v, 100))}`
  })
  .join(' ')

const hb = [92, 74, 61, 38, 22]
const hbars = hb.map((v, i) => `M64 ${16 + i * 27} h${f1((v / 100) * 220)} v17 h-${f1((v / 100) * 220)} z`).join(' ')

const sb = [
  [30, 20, 12],
  [38, 22, 10],
  [26, 30, 14],
  [44, 18, 16],
  [40, 28, 12],
  [52, 24, 18],
]
const sbarsLayer = (k: number) =>
  sb
    .map((g, i) => {
      const x = 18 + i * 46
      const base = g.slice(0, k).reduce((a, b) => a + b, 0)
      const hgt = (g[k] / 100) * 140
      return `M${x} ${f1(150 - (base / 100) * 140 - hgt)} h28 v${f1(hgt)} h-28 z`
    })
    .join(' ')
const sbars0 = sbarsLayer(0)
const sbars1 = sbarsLayer(1)
const sbars2 = sbarsLayer(2)

let seed = 7
const rnd = () => {
  seed = (seed * 9301 + 49297) % 233280
  return seed / 233280
}
const scatterPts = Array.from({ length: 28 }, () => {
  const x = rnd()
  const y = Math.min(1, Math.max(0, x * 0.7 + rnd() * 0.35 - 0.1))
  return { x: 10 + x * 280, y: 150 - y * 140 }
})
const scatter = scatterPts
  .map((p) => `M${f1(p.x - 3.5)} ${f1(p.y)} a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0`)
  .join(' ')
const trend = `M10 ${f1(cy(12, 100))} L290 ${f1(cy(88, 100))}`

const radarPt = (v: number, i: number) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / 6
  return `${f1(150 + Math.cos(a) * 62 * v)},${f1(82 + Math.sin(a) * 62 * v)}`
}
const radarRing = (v: number) => Array.from({ length: 6 }, (_, i) => radarPt(v, i)).join(' ')
const rg0 = radarRing(1)
const rg1 = radarRing(0.66)
const rg2 = radarRing(0.33)
const radarAxes = Array.from({ length: 6 }, (_, i) => `M150 82 L${radarPt(1, i).replace(',', ' ')}`).join(' ')
const radarA = [0.9, 0.7, 0.8, 0.6, 0.85, 0.75].map((v, i) => radarPt(v, i)).join(' ')
const radarB = [0.5, 0.8, 0.45, 0.9, 0.4, 0.6].map((v, i) => radarPt(v, i)).join(' ')

const fun = [100, 64, 38, 21, 12]
const funnelStage = (i: number) => {
  const tw = (fun[i] / 100) * 260
  const bw = (fun[i + 1] / 100) * 260
  const y = 12 + i * 34
  return `M${f1(150 - tw / 2)} ${y} L${f1(150 + tw / 2)} ${y} L${f1(150 + bw / 2)} ${y + 30} L${f1(150 - bw / 2)} ${y + 30} Z`
}
const [f0, fA, fB, fC] = [funnelStage(0), funnelStage(1), funnelStage(2), funnelStage(3)]

const ohlc: Array<[number, number, number, number]> = [
  [40, 52, 36, 50], [50, 58, 46, 44], [44, 47, 38, 40], [40, 56, 39, 54], [54, 62, 50, 60],
  [60, 61, 48, 52], [52, 66, 50, 64], [64, 70, 60, 68], [68, 72, 58, 60], [60, 66, 55, 64],
  [64, 78, 62, 76], [76, 80, 70, 72], [72, 74, 64, 66], [66, 84, 65, 82],
]
let candleUp = ''
let candleDown = ''
ohlc.forEach(([o, hi, lo, c], i) => {
  const x = 14 + i * 20
  const wick = `M${x} ${f1(cy(hi, 100))} v${f1(cy(lo, 100) - cy(hi, 100))} `
  const body = `M${x - 5} ${f1(cy(Math.max(o, c), 100))} h10 v${f1(cy(Math.min(o, c), 100) - cy(Math.max(o, c), 100))} h-10 z `
  if (c >= o) candleUp += wick + body
  else candleDown += wick + body
})

const compBars = [48, 56, 44, 70, 66, 82, 78, 96]
  .map((v, i) => `M${20 + i * 35} ${f1(cy(v, 120))} h20 v${f1(150 - cy(v, 120))} h-20 z`)
  .join(' ')
const compLine = [22, 30, 28, 44, 42, 58, 60, 74]
  .map((v, i) => `${i === 0 ? 'M' : 'L'}${30 + i * 35} ${f1(cy(v, 120))}`)
  .join(' ')

const wfSteps = [
  { v: 60, d: 0 }, { v: 18, d: 1 }, { v: -12, d: -1 }, { v: 24, d: 1 }, { v: -8, d: -1 }, { v: 14, d: 1 },
]
let wfTot = ''
let wfPos = ''
let wfNeg = ''
let wfConn = ''
{
  let run = 0
  wfSteps.forEach((s, i) => {
    const from = s.d === 0 ? 0 : run
    run += s.v
    const to = run
    const x = 16 + i * 40
    const yTop = cy(Math.max(from, to), 120)
    const yBot = cy(Math.min(from, to), 120)
    const bar = `M${x} ${f1(yTop)} h26 v${f1(yBot - yTop)} h-26 z `
    if (i === 0) wfTot += bar
    else if (s.d > 0) wfPos += bar
    else wfNeg += bar
    wfConn += `M${x + 26} ${f1(cy(run, 120))} h14 `
  })
  wfTot += `M256 ${f1(cy(run, 120))} h26 v${f1(150 - cy(run, 120))} h-26 z`
}

const PC = 2 * Math.PI * 40
const pieArcs = (() => {
  let cum = 0
  return [38, 27, 20, 15].map((p) => {
    const len = (p / 100) * PC
    const a = { dash: `${len.toFixed(2)} ${(PC - len).toFixed(2)}`, offset: (-cum).toFixed(2) }
    cum += len
    return a
  })
})()

const GC = Math.PI * 70
const gaugeDash = `${(GC * 0.72).toFixed(2)} ${GC.toFixed(2)}`

const tm = [
  { name: 'Organic', pct: '38%', x: 10, y: 10, w: 150, h: 140 },
  { name: 'Direct', pct: '27%', x: 164, y: 10, w: 126, h: 72 },
  { name: 'Referral', pct: '20%', x: 164, y: 86, w: 70, h: 64 },
  { name: 'Social', pct: '9%', x: 238, y: 86, w: 52, h: 30 },
  { name: 'Email', pct: '6%', x: 238, y: 120, w: 52, h: 30 },
].map((t) => ({
  ...t,
  left: `${f1((t.x / 300) * 100)}%`,
  top: `${f1((t.y / 160) * 100)}%`,
  width: `${f1((t.w / 300) * 100)}%`,
  height: `${f1((t.h / 160) * 100)}%`,
}))

const spark = (arr: number[]) => {
  const min = Math.min(...arr)
  const max = Math.max(...arr)
  return arr
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${f1(i * (100 / (arr.length - 1)))} ${f1(30 - ((v - min) / (max - min)) * 26)}`)
    .join(' ')
}
const spark1 = spark([12, 14, 13, 18, 17, 22, 21, 26, 30])
const spark2 = spark([40, 38, 41, 37, 35, 36, 33, 31, 30])
const spark3 = spark([5, 9, 7, 12, 10, 14, 13, 15, 19])

const DC = 2 * Math.PI * 54
const donutArcs = (() => {
  let cum = 0
  return [46, 27, 17].map((p) => {
    const len = (p / 100) * DC
    const a = { dash: `${len.toFixed(2)} ${(DC - len).toFixed(2)}`, offset: (-cum).toFixed(2) }
    cum += len
    return a
  })
})()

const A = [42, 48, 45, 61, 58, 72, 69, 84, 91, 88, 104, 112]
const lineA = A.map((v, i) => `${i === 0 ? 'M' : 'L'}${f1(20 + i * (560 / (A.length - 1)))} ${f1(200 - (v / 120) * 180)}`).join(' ')

// ---------- Tile chrome ----------
const tileStyle: CSSProperties = {
  border: '1px solid var(--line)',
  borderRadius: 12,
  background: 'var(--bg-1)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}

const tileId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

function Tile({ name, chip, api, children, noSvg }: { name: string; chip: ReactNode; api: string; children: ReactNode; noSvg?: boolean }) {
  return (
    <div id={tileId(name)} style={{ ...tileStyle, scrollMarginTop: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '12px 14px 6px' }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>{name}</span>
        <span style={{ ...mono, fontSize: 10.5, color: 'var(--fg-3)' }}>{chip}</span>
      </div>
      {noSvg ? children : (
        <svg viewBox="0 0 300 160" style={{ width: '100%', height: 'auto', display: 'block', padding: '0 6px', boxSizing: 'border-box' }}>
          {children}
        </svg>
      )}
      <div style={{ marginTop: 'auto', padding: '8px 14px 12px', borderTop: '1px solid var(--line)', ...mono, fontSize: 11, color: 'var(--fg-3)' }}>
        {api}
      </div>
    </div>
  )
}

const Baseline = () => <line x1={10} y1={150} x2={290} y2={150} stroke="var(--line-2)" />
const Grid = ({ ys }: { ys: number[] }) => (
  <>
    {ys.map((y) => (
      <line key={y} x1={10} y1={y} x2={290} y2={y} stroke="var(--line)" strokeDasharray="2 4" />
    ))}
  </>
)

const IconBtn = ({ glyph, active }: { glyph: string; active?: boolean }) => (
  <span
    style={{
      width: 28, height: 28, borderRadius: 6, border: '1px solid var(--line-2)',
      display: 'grid', placeItems: 'center', fontSize: 13,
      ...(active ? { background: 'var(--bg-3)', color: 'var(--fg)' } : { color: 'var(--fg-2)' }),
    }}
  >
    {glyph}
  </span>
)

const CATALOGUE_TOC = [
  ...CATALOGUE_SERIES.map((s, i) => ({ ...s, active: i === 0 })),
  { label: 'Shared parts', id: 'shared-parts' },
  { label: 'Axes & grid', id: 'axes-grid', sub: true },
  { label: 'Legend', id: 'legend', sub: true },
  { label: 'Tooltip variants', id: 'tooltip-variants', sub: true },
  { label: 'Brush · zoom & pan', id: 'brush-zoom-pan', sub: true },
  { label: 'Toolbar & export', id: 'toolbar-export', sub: true },
  { label: 'Accessibility layer', id: 'accessibility-layer', sub: true },
]

export default function ChartsCataloguePage() {
  return (
    <DocsShell sidebar={DOCS_SIDEBAR} wide rail={<RightRail toc={CATALOGUE_TOC} />}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 20, borderBottom: '1px solid var(--line-2)' }}>
        <div>
          <div style={{ ...mono, fontSize: 12, letterSpacing: '0.08em', color: 'var(--ac-text)' }}>VELOCE CHARTS · CATALOGUE</div>
          <h1 style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.035em', margin: 0 }}>16 series types, one grammar</h1>
        </div>
        <div style={{ ...mono, fontSize: 12, color: 'var(--fg-3)', textAlign: 'right', lineHeight: 1.7 }}>
          {'<ChartContainer>'} + any mix of *Series children
          <br />
          same axes, tooltip, legend, brush and a11y layer everywhere
        </div>
      </div>

      {/* Series grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {/* 1 Line */}
        <Tile name="Line" chip="draw 600ms" api='<LineSeries curve="monotone" />'>
          <Baseline />
          <Grid ys={[80, 10]} />
          <path d={stackLine2} fill="none" stroke="var(--fg-3)" strokeWidth={2} />
          <path d={stackLine1} fill="none" stroke={AC} strokeWidth={2.5} strokeLinejoin="round" />
          <circle cx={290} cy={66} r={4} fill="var(--bg)" stroke={AC} strokeWidth={2.5} />
        </Tile>

        {/* 2 Area · stacked */}
        <Tile name="Area · stacked" chip="rise 500ms" api='<AreaSeries stackId="a" /> ×2'>
          <Baseline />
          <path d={stackHigh} fill={AC} opacity={0.28} />
          <path d={stackLow} fill={AC} opacity={0.6} />
          <path d={stackLine2} fill="none" stroke={AC} strokeWidth={1.5} opacity={0.7} />
          <path d={stackLine1} fill="none" stroke={AC} strokeWidth={2} />
        </Tile>

        {/* 3 Step */}
        <Tile name="Step" chip="draw 600ms" api='<LineSeries curve="step" /> + <ReferenceArea />'>
          <Baseline />
          <Grid ys={[80]} />
          <path d={stepPath} fill="none" stroke={AC} strokeWidth={2.5} />
          <rect x={196} y={10} width={47} height={140} fill={AC} fillOpacity={0.08} />
          <text x={200} y={22} fontSize={9} fill="var(--ac-text)" style={mono}>deploy</text>
        </Tile>

        {/* 4 Bar · horizontal */}
        <Tile name="Bar · horizontal" chip="grow 400ms · stagger 30" api='<BarSeries layout="horizontal" label="end" />'>
          {['Chrome', 'Safari', 'Firefox', 'Edge', 'Other'].map((n, i) => (
            <text key={n} x={56} y={29 + i * 27} fontSize={10} fill="var(--fg-2)" textAnchor="end">{n}</text>
          ))}
          <line x1={64} y1={10} x2={64} y2={150} stroke="var(--line-2)" />
          <path d={hbars} fill={AC} />
          <text x={270} y={29} fontSize={10} fill="var(--fg)" textAnchor="end" style={mono}>92k</text>
        </Tile>

        {/* 5 Bar · stacked */}
        <Tile name="Bar · stacked" chip="grow 400ms" api='<BarSeries stackId="b" radius="top" /> ×3'>
          <Baseline />
          <path d={sbars0} fill={AC} />
          <path d={sbars1} fill={MIX60} />
          <path d={sbars2} fill={MIX30} />
        </Tile>

        {/* 6 Composed */}
        <Tile name="Composed" chip="bars → line, 200ms offset" api='<BarSeries /> + <LineSeries yAxisId="right" />'>
          <Baseline />
          <path d={compBars} fill={MIX35} />
          <path d={compLine} fill="none" stroke={AC} strokeWidth={2.5} />
          <text x={292} y={14} fontSize={9} fill="var(--fg-3)" textAnchor="end" style={mono}>y₂ →</text>
        </Tile>

        {/* 7 Scatter */}
        <Tile name="Scatter" chip="pop 250ms · stagger 8" api='<ScatterSeries /> + <TrendLine method="linear" />'>
          <Baseline />
          <line x1={10} y1={10} x2={10} y2={150} stroke="var(--line-2)" />
          <path d={trend} fill="none" stroke="var(--fg-3)" strokeDasharray="4 4" strokeWidth={1.5} />
          <path d={scatter} fill={AC} opacity={0.75} stroke="var(--bg-1)" strokeWidth={1} />
        </Tile>

        {/* 8 Candlestick */}
        <Tile name="Candlestick" chip="wick → body, 300ms" api='<CandlestickSeries up="ok" down="err" />'>
          <Baseline />
          <Grid ys={[80]} />
          <path d={candleUp} fill="var(--ok)" stroke="var(--ok)" strokeWidth={1.5} />
          <path d={candleDown} fill="var(--err)" stroke="var(--err)" strokeWidth={1.5} />
        </Tile>

        {/* 9 Pie */}
        <Tile name="Pie" chip="sweep 500ms" api="<PieSeries padAngle={1} />" noSvg>
          <div style={{ display: 'flex', gap: 16, padding: '6px 14px', alignItems: 'center', flex: 1 }}>
            <svg width={120} height={120} viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
              {pieArcs.map((a, i) => (
                <circle key={i} cx={80} cy={80} r={40} fill="none" stroke={[AC, MIX60, MIX35, 'var(--fg-3)'][i]} strokeWidth={80} strokeDasharray={a.dash} strokeDashoffset={a.offset} />
              ))}
              <circle cx={80} cy={80} r={80} fill="none" stroke="var(--bg-1)" strokeWidth={2} />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--fg-2)', flex: 1 }}>
              {([['Pro', '38%', AC], ['Team', '27%', MIX60], ['Hobby', '20%', MIX35], ['Ent.', '15%', 'var(--fg-3)']] as Array<[string, string, string]>).map(([n, p, c]) => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
                  <span style={{ flex: 1 }}>{n}</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--fg)' }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </Tile>

        {/* 10 Radar */}
        <Tile name="Radar" chip="unfold from center 400ms" api="<RadarSeries /> ×2 + <PolarGrid levels={3} />">
          <polygon points={rg0} fill="none" stroke="var(--line-2)" />
          <polygon points={rg1} fill="none" stroke="var(--line)" />
          <polygon points={rg2} fill="none" stroke="var(--line)" />
          <path d={radarAxes} stroke="var(--line)" fill="none" />
          <polygon points={radarB} fill="var(--fg-3)" fillOpacity={0.2} stroke="var(--fg-3)" strokeWidth={1.5} />
          <polygon points={radarA} fill={AC} fillOpacity={0.25} stroke={AC} strokeWidth={2} />
          <text x={150} y={12} fontSize={9} fill="var(--fg-3)" textAnchor="middle">Speed</text>
          <text x={222} y={52} fontSize={9} fill="var(--fg-3)">A11y</text>
          <text x={222} y={122} fontSize={9} fill="var(--fg-3)">DX</text>
          <text x={150} y={156} fontSize={9} fill="var(--fg-3)" textAnchor="middle">Size</text>
          <text x={78} y={122} fontSize={9} fill="var(--fg-3)" textAnchor="end">Motion</text>
          <text x={78} y={52} fontSize={9} fill="var(--fg-3)" textAnchor="end">Theming</text>
        </Tile>

        {/* 11 Funnel */}
        <Tile name="Funnel" chip="cascade 60ms/stage" api='<FunnelSeries label="inside" />'>
          <path d={f0} fill={AC} />
          <path d={fA} fill={MIX75} />
          <path d={fB} fill={MIX50} />
          <path d={fC} fill={MIX30} />
          <text x={150} y={32} fontSize={10} fontWeight={600} fill="var(--ac-fg)" textAnchor="middle">Visited · 48.2k</text>
          <text x={150} y={66} fontSize={10} fontWeight={600} fill="var(--ac-fg)" textAnchor="middle">Signed up · 64%</text>
          <text x={150} y={100} fontSize={10} fontWeight={600} fill="var(--fg)" textAnchor="middle">Installed · 38%</text>
          <text x={150} y={134} fontSize={10} fontWeight={600} fill="var(--fg)" textAnchor="middle">Deployed · 21%</text>
        </Tile>

        {/* 12 Waterfall */}
        <Tile name="Waterfall" chip="left → right, 40ms" api='<WaterfallSeries total="end" />'>
          <Baseline />
          <path d={wfConn} stroke="var(--line-2)" strokeDasharray="2 2" fill="none" />
          <path d={wfTot} fill="var(--fg-2)" />
          <path d={wfPos} fill="var(--ok)" />
          <path d={wfNeg} fill="var(--err)" />
        </Tile>

        {/* 13 Treemap */}
        <Tile name="Treemap" chip="tiles scale-in 250ms" api='<TreemapSeries tile="squarify" />' noSvg>
          <div style={{ position: 'relative', aspectRatio: '300/160', margin: '0 6px' }}>
            {tm.map((t) => (
              <div
                key={t.name}
                style={{
                  position: 'absolute', left: t.left, top: t.top, width: t.width, height: t.height,
                  padding: '6px 8px', boxSizing: 'border-box', border: '2px solid var(--bg-1)', borderRadius: 6,
                  background: AC, fontSize: 11, fontWeight: 500, color: 'var(--ac-fg)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden',
                }}
              >
                <span>{t.name}</span>
                <span style={{ ...mono, fontSize: 10, opacity: 0.8 }}>{t.pct}</span>
              </div>
            ))}
          </div>
        </Tile>

        {/* 14 Gauge · arc */}
        <Tile name="Gauge · arc" chip="needle settle 600ms" api='<Gauge shape="arc" thresholds={[50,90]} />'>
          <path d="M80 130 A70 70 0 0 1 220 130" fill="none" stroke="var(--bg-3)" strokeWidth={16} strokeLinecap="round" />
          <path d="M80 130 A70 70 0 0 1 220 130" fill="none" stroke={AC} strokeWidth={16} strokeLinecap="round" strokeDasharray={gaugeDash} />
          <text x={150} y={118} fontSize={28} fontWeight={600} letterSpacing={-1} fill="var(--fg)" textAnchor="middle">72</text>
          <text x={150} y={134} fontSize={10} fill="var(--fg-3)" textAnchor="middle">Lighthouse perf</text>
          <text x={72} y={150} fontSize={9} fill="var(--fg-3)" style={mono}>0</text>
          <text x={228} y={150} fontSize={9} fill="var(--fg-3)" textAnchor="end" style={mono}>100</text>
        </Tile>

        {/* 15 Sparkline */}
        <Tile name="Sparkline" chip="inline · 300ms" api='<Sparkline type="line" | "bar" | "status" />' noSvg>
          <div style={{ padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5, flex: 1 }}>
            {([
              ['Requests', spark1, AC, '1.2M'],
              ['Latency', spark2, 'var(--fg-3)', '142ms'],
              ['Errors', spark3, 'var(--err)', '1.9%'],
            ] as Array<[string, string, string, string]>).map(([label, d, stroke, value]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 64, color: 'var(--fg-2)' }}>{label}</span>
                <svg viewBox="0 0 100 32" preserveAspectRatio="none" style={{ flex: 1, height: 22, display: 'block' }}>
                  <path d={d} fill="none" stroke={stroke} strokeWidth={2} vectorEffect="non-scaling-stroke" />
                </svg>
                <span style={{ width: 40, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 64, color: 'var(--fg-2)' }}>Uptime</span>
              <div style={{ flex: 1, display: 'flex', gap: 2 }}>
                {['ok', 'ok', 'ok', 'warn', 'ok', 'ok', 'err', 'ok', 'ok', 'ok', 'ok', 'ok'].map((s, i) => (
                  <span key={i} style={{ flex: 1, height: 14, borderRadius: 2, background: `var(--${s})` }} />
                ))}
              </div>
              <span style={{ width: 40, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>99.9%</span>
            </div>
          </div>
        </Tile>

        {/* 16 Heatmap · Donut */}
        <Tile
          name="Heatmap · Donut"
          chip={<Link to="/docs/charts/heatmap" style={{ color: 'var(--ac-text)', textDecoration: 'none' }}>see 4b</Link>}
          api="<HeatmapSeries /> · <PieSeries innerRadius={0.7} />"
          noSvg
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 14, padding: '6px 14px', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
              {[10, 30, 60, 100, 70, 40, 15, 8, 25, 55, 90, 65, 35, 12, 6, 18, 40, 60, 45, 22, 8].map((n, i) => (
                <div key={i} style={{ aspectRatio: '1', borderRadius: 2, background: n === 100 ? AC : `color-mix(in oklch,var(--ac) ${n}%,var(--bg-3))` }} />
              ))}
            </div>
            <svg width={84} height={84} viewBox="0 0 150 150" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={75} cy={75} r={54} fill="none" stroke="var(--bg-3)" strokeWidth={18} />
              {donutArcs.map((a, i) => (
                <circle key={i} cx={75} cy={75} r={54} fill="none" stroke={[AC, MIX60, MIX35][i]} strokeWidth={18} strokeDasharray={a.dash} strokeDashoffset={a.offset} />
              ))}
            </svg>
          </div>
        </Tile>
      </div>

      {/* Shared parts */}
      <div id="shared-parts" style={{ display: 'flex', alignItems: 'baseline', gap: 12, scrollMarginTop: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>Shared parts</h2>
        <span style={{ ...mono, fontSize: 11.5, color: 'var(--fg-3)' }}>identical across every series type</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginTop: -12 }}>
        {/* Axes & grid */}
        <Tile name="Axes & grid" chip="ticks fade 150ms on rescale" api='<XAxis scale="time" ticks="auto" /> <YAxis format="compact" label /> <ReferenceLine />'>
          <line x1={44} y1={10} x2={44} y2={130} stroke="var(--line-2)" />
          <line x1={44} y1={130} x2={290} y2={130} stroke="var(--line-2)" />
          <Grid ys={[70, 10]} />
          <text x={38} y={133} fontSize={9} fill="var(--fg-3)" textAnchor="end" style={mono}>0</text>
          <text x={38} y={73} fontSize={9} fill="var(--fg-3)" textAnchor="end" style={mono}>50k</text>
          <text x={38} y={13} fontSize={9} fill="var(--fg-3)" textAnchor="end" style={mono}>100k</text>
          {[44, 126, 208, 290].map((x, i) => (
            <g key={x}>
              <line x1={x} y1={130} x2={x} y2={135} stroke="var(--line-2)" />
              <text x={x} y={146} fontSize={9} fill={i === 3 ? 'var(--fg)' : 'var(--fg-3)'} textAnchor="middle" style={mono}>
                {['Jul', 'Aug', 'Sep', 'Oct'][i]}
              </text>
            </g>
          ))}
          <line x1={44} y1={46} x2={290} y2={46} stroke="var(--warn)" strokeDasharray="4 3" strokeWidth={1.5} />
          <text x={288} y={42} fontSize={9} fill="var(--warn)" textAnchor="end" style={mono}>target 70k</text>
          <text x={12} y={70} fontSize={9} fill="var(--fg-3)" textAnchor="middle" transform="rotate(-90 12 70)">Sessions</text>
        </Tile>

        {/* Legend */}
        <Tile name="Legend" chip="toggle · hover isolates" api='<Legend variant="chips" | "list" interactive />' noSvg>
          <div style={{ padding: '6px 14px 10px', display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12.5, flex: 1 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 26, padding: '0 9px', borderRadius: 999, border: '1px solid var(--line-2)', background: 'var(--bg-2)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: AC }} />Revenue
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 26, padding: '0 9px', borderRadius: 999, border: '1px solid var(--line-2)', background: 'var(--bg-2)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: MIX60 }} />Costs
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 26, padding: '0 9px', borderRadius: 999, border: '1px dashed var(--line-2)', background: 'var(--bg-2)', color: 'var(--fg-3)', textDecoration: 'line-through' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--bg-3)' }} />Refunds
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 26, padding: '0 9px', borderRadius: 999, border: '1px solid var(--line-2)', background: 'var(--bg-2)', boxShadow: '0 0 0 2px var(--bg-1),0 0 0 4px var(--ac)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--fg-3)' }} />Tax
              </span>
            </div>
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 14, height: 3, borderRadius: 2, background: AC }} />
                <span style={{ flex: 1 }}>Revenue</span>
                <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--fg-2)' }}>$88.0k</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.45 }}>
                <span style={{ width: 14, height: 3, borderRadius: 2, background: MIX60 }} />
                <span style={{ flex: 1 }}>Costs</span>
                <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--fg-2)' }}>$63.0k</span>
              </div>
              <div style={{ ...mono, fontSize: 10.5, color: 'var(--fg-3)' }}>hover row → other series dim to 45%, 150ms</div>
            </div>
          </div>
        </Tile>

        {/* Tooltip variants */}
        <Tile name="Tooltip variants" chip="follows pointer, 100ms lerp" api='<Tooltip variant="multi" | "minimal" render={fn} />' noSvg>
          <div style={{ padding: '6px 14px 10px', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-start', fontSize: 12, flex: 1 }}>
            <div style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--bg-2)', border: '1px solid var(--line-2)', boxShadow: 'var(--shadow-md)', minWidth: 120 }}>
              <div style={{ ...mono, fontSize: 10.5, color: 'var(--fg-3)', marginBottom: 5 }}>Oct 12</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: 2, background: AC }} />
                <span style={{ flex: 1, color: 'var(--fg-2)' }}>Revenue</span>
                <span style={{ fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>$3.1k</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: 2, background: 'var(--fg-3)' }} />
                <span style={{ flex: 1, color: 'var(--fg-2)' }}>Costs</span>
                <span style={{ fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>$2.2k</span>
              </div>
            </div>
            <span style={{ ...mono, padding: '4px 8px', borderRadius: 6, background: 'var(--fg)', color: 'var(--bg)', fontSize: 11, fontVariantNumeric: 'tabular-nums' }}>$3,104</span>
            <div style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--bg-2)', border: '1px solid var(--line-2)', boxShadow: 'var(--shadow-md)', minWidth: 130, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <span>Chrome</span>
                <span style={{ fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>92k</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: 'var(--bg-3)' }}>
                <div style={{ width: '78%', height: '100%', borderRadius: 2, background: AC }} />
              </div>
              <div style={{ ...mono, fontSize: 10.5, color: 'var(--fg-3)' }}>78% of total · ▲ 4.1%</div>
            </div>
            <div style={{ width: '100%', ...mono, fontSize: 10.5, color: 'var(--fg-3)' }}>multi-series · minimal · rich (custom render)</div>
          </div>
        </Tile>

        {/* Brush · zoom & pan */}
        <Tile name="Brush · zoom & pan" chip="rescale 250ms settle" api='<Brush height={30} /> · zoom={{ wheel: "alt", pinch: true }}'>
          <line x1={10} y1={100} x2={290} y2={100} stroke="var(--line-2)" />
          <path d={lineA} fill="none" stroke={AC} strokeWidth={4} transform="translate(0 0) scale(0.5 0.42)" />
          <rect x={10} y={118} width={280} height={30} rx={4} fill="var(--bg-2)" stroke="var(--line)" />
          <path d={lineA} fill="none" stroke="var(--fg-3)" strokeWidth={6} transform="translate(10 118) scale(0.4667 0.1364)" />
          <rect x={96} y={118} width={112} height={30} rx={4} fill={AC} fillOpacity={0.18} stroke={AC} />
          <rect x={93} y={124} width={6} height={18} rx={2} fill="var(--fg)" />
          <rect x={205} y={124} width={6} height={18} rx={2} fill="var(--fg)" />
          <text x={10} y={112} fontSize={9} fill="var(--fg-3)" style={mono}>Jun 4 – Aug 20</text>
          <text x={290} y={112} fontSize={9} fill="var(--fg-3)" textAnchor="end" style={mono}>⌥ + wheel · pinch · drag</text>
        </Tile>

        {/* Toolbar & export */}
        <Tile name="Toolbar & export" chip="menu unfold 180ms" api='<ChartToolbar export={["png","svg","csv"]} fullscreen />' noSvg>
          <div style={{ position: 'relative', minHeight: 236, padding: '6px 14px', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
              <IconBtn glyph="⊞" />
              <IconBtn glyph="⛶" />
              <IconBtn glyph="↓" active />
            </div>
            <div style={{ position: 'absolute', right: 14, top: 44, width: 190, padding: 4, borderRadius: 9, background: 'var(--bg-2)', border: '1px solid var(--line-2)', boxShadow: 'var(--shadow-lg)', fontSize: 12.5 }}>
              <div style={{ padding: '7px 9px', borderRadius: 6, background: 'var(--bg-3)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Download PNG</span>
                <span style={{ ...mono, fontSize: 10.5, color: 'var(--fg-3)' }}>2×</span>
              </div>
              <div style={{ padding: '7px 9px' }}>Download SVG</div>
              <div style={{ padding: '7px 9px' }}>Copy as image</div>
              <div style={{ height: 1, background: 'var(--line)', margin: '4px 0' }} />
              <div style={{ padding: '7px 9px' }}>Export CSV</div>
              <div style={{ padding: '7px 9px' }}>Copy data as JSON</div>
              <div style={{ height: 1, background: 'var(--line)', margin: '4px 0' }} />
              <div style={{ padding: '7px 9px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Show data table</span>
                <span style={{ ...mono, fontSize: 10.5, color: 'var(--fg-3)' }}>T</span>
              </div>
            </div>
          </div>
        </Tile>

        {/* Accessibility layer */}
        <Tile name="Accessibility layer" chip={<span style={{ color: 'var(--ok)' }}>WCAG 2.2 AA</span>} api='<ChartContainer a11y={{ table: "toggle", announce: true }} />' noSvg>
          <div style={{ padding: '6px 14px 10px', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5, lineHeight: 1.45, color: 'var(--fg-2)', flex: 1 }}>
            <div style={{ border: '1px solid var(--line)', borderRadius: 7, fontSize: 11.5, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '5px 9px', background: 'var(--bg-2)', ...mono, fontSize: 10, letterSpacing: '0.06em', color: 'var(--fg-3)' }}>
                <span>MONTH</span>
                <span style={{ textAlign: 'right' }}>REVENUE</span>
                <span style={{ textAlign: 'right' }}>COSTS</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '5px 9px', borderTop: '1px solid var(--line)', fontVariantNumeric: 'tabular-nums' }}>
                <span>Sep</span>
                <span style={{ textAlign: 'right' }}>$91.0k</span>
                <span style={{ textAlign: 'right' }}>$58.0k</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '5px 9px', borderTop: '1px solid var(--line)', fontVariantNumeric: 'tabular-nums', background: 'var(--ac-soft)', color: 'var(--fg)' }}>
                <span>Oct</span>
                <span style={{ textAlign: 'right' }}>$88.0k</span>
                <span style={{ textAlign: 'right' }}>$63.0k</span>
              </div>
            </div>
            <div>
              Visually-hidden {'<table>'} mirrors every series; toggle visible with <span style={mono}>T</span>. Keyboard: ← → point, ↑ ↓ series, Home/End. Live region announces "October, Revenue, 88 thousand".
            </div>
            <div style={{ ...mono, fontSize: 10.5, color: 'var(--fg-3)' }}>series colors pass 3:1 against canvas; patterns available via fill="pattern"</div>
          </div>
        </Tile>
      </div>
    </div>
    </DocsShell>
  )
}
