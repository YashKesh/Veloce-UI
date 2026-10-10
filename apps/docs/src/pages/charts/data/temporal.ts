// Anatomy pages for temporal charts: stream-graph, bump, gantt, horizon.
import {
  makePage, tree, grid, sh, tx, yl, circ, rect,
  code, open, selfc, close,
  AC, AC60, AC35, N, mix,
  X, f, L, R, T, B, W, MONTHS,
  type ChartPage,
} from '../chartsData'

// ── Stream graph ─────────────────────────────────────────────────────────────
// Traffic sources over 8 months, stacked on a centred silhouette baseline.
const SG: number[][] = [
  [20, 24, 28, 30, 34, 40, 44, 50], // Organic
  [14, 16, 15, 20, 22, 24, 23, 28], // Referral
  [8, 10, 12, 11, 14, 16, 18, 20], // Social
]
const SGn = 8
const sgTotals = Array.from({ length: SGn }, (_, i) => SG.reduce((a, s) => a + s[i], 0))
const sgMax = Math.max(...sgTotals)
// Build a centred band for series si given running lower baselines.
const sgBand = (si: number): string => {
  const lo: number[] = [], hi: number[] = []
  for (let i = 0; i < SGn; i++) {
    let base = -sgTotals[i] / 2
    for (let k = 0; k < si; k++) base += SG[k][i]
    lo.push(base)
    hi.push(base + SG[si][i])
  }
  // Map silhouette offset (-max/2..+max/2) into plot band via Y with offset max.
  const yFor = (off: number) => T + ((B - T) / 2) + (off / sgMax) * (B - T)
  const topEdge = hi.map((v, i) => `${i ? 'L' : 'M'}${f(X(i, SGn))} ${f(yFor(v))}`).join(' ')
  const botEdge = [...lo].reverse().map((v, i) => `L${f(X(SGn - 1 - i, SGn))} ${f(yFor(v))}`).join('')
  return `${topEdge}${botEdge}Z`
}

const streamGraph = makePage({
  id: 'stream-graph', name: 'Stream graph',
  tagline: 'Stacked bands flowing around a centred silhouette baseline. Each StreamSeries fills a smooth ribbon whose thickness encodes its value; the stack re-centres every column so totals read as an organic river.',
  tree: tree(
    [
      ['∿', 'StreamSeries', 'organic', 'active', 'series-0'],
      ['∿', 'StreamSeries', 'referral', 'focus', 'series-1'],
      ['∿', 'StreamSeries', 'social', '', 'series-2'],
    ],
    [['▭', 'Tooltip', 1], ['≡', 'Legend']],
  ),
  shapes: [
    ...grid(),
    sh(sgBand(0), { fill: AC, op: 0.85, stroke: AC, sw: 0.5, role: 'series-0' }),
    sh(sgBand(1), { fill: AC60, op: 0.85, stroke: AC60, sw: 0.5, role: 'series-1' }),
    sh(sgBand(2), { fill: AC35, op: 0.85, stroke: AC35, sw: 0.5, role: 'series-2' }),
  ],
  texts: yl(sgMax, (v) => (v ? v + 'k' : '0')),
  xlabels: MONTHS.slice(0, SGn),
  tip: {
    left: '58.0%',
    title: 'Jun 2026',
    rows: [
      { c: AC, l: 'Organic', v: '40k' },
      { c: AC60, l: 'Referral', v: '24k' },
      { c: AC35, l: 'Social', v: '16k' },
    ],
    fl: 'Total', fv: '80k', fc: 'var(--fg)',
  },
  legend: [{ c: AC, l: 'Organic' }, { c: AC60, l: 'Referral' }, { c: AC35, l: 'Social' }],
  note: 'ribbons rise 500ms swift-out',
  code: code([
    open('StreamGraphChart', [['series', '{sources}', false], ['labels', '{months}', false]]),
    selfc('StreamSeries', [['label', '"Organic"'], ['data', '{organic}', false]]),
    selfc('StreamSeries', [['label', '"Referral"'], ['data', '{referral}', false]]),
    close('StreamGraphChart'),
  ]),
  variants: [
    ['Silhouette', 'Default — the stack centres on a zero baseline so growth flows both ways.'],
    ['Wiggle', 'stackOffset minimises band slope for calmer edges on volatile data.'],
    ['Stacked', 'Pin the baseline to the bottom for a conventional stacked area.'],
  ],
  motion: [
    ['ENTER', '--dur-500 · swift-out', 'each ribbon grows from the silhouette midline outward via clip-path'],
    ['HOVER', '--dur-100 · linear', 'hovered band lifts to full opacity; siblings dim to 0.5'],
    ['REDUCED', '--dur-120 · linear', 'final frame crossfades in without the flow animation'],
  ],
  a11y: 'Each StreamSeries is a labelled region with a <title> for screen readers. Column totals are announced after the parts: "June, Organic 40 thousand, Referral 24 thousand, Social 16 thousand, total 80 thousand".',
  props: [
    ['series', 'StreamSeries[]', '—', 'Bands to stack. Each has label, data[] and optional color.'],
    ['labels', 'string[]', '—', 'X-axis tick labels, one per timestep.'],
    ['width', 'number', '520', 'SVG width in px; height derives from the viewBox.'],
    ['height', 'number', '280', 'SVG height in px.'],
  ],
})

// ── Bump chart ───────────────────────────────────────────────────────────────
// League standings (rank, 1=top) over 6 matchdays for 3 teams.
const BP = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6']
const BPn = BP.length
const RANK: number[][] = [
  [3, 2, 1, 1, 2, 1], // Arsenal
  [1, 1, 2, 3, 1, 2], // City
  [2, 3, 3, 2, 3, 3], // Spurs
]
const bpMaxRank = 3
// y maps rank 1..maxRank across the plot; rank 1 at top.
const bpY = (rank: number) => T + ((rank - 1) / (bpMaxRank - 1)) * (B - T)
const bpLine = (data: number[]) =>
  data.map((r, i) => `${i ? 'L' : 'M'}${f(X(i, BPn))} ${f(bpY(r))}`).join(' ')

const bumpShapes: import('../chartsData').ChartPage['shapes'] = [
  ...grid(),
  sh(bpLine(RANK[0]), { stroke: AC, sw: 2.5, lc: 'round', role: 'series-0' }),
  sh(bpLine(RANK[1]), { stroke: AC60, sw: 2.5, lc: 'round', role: 'series-1' }),
  sh(bpLine(RANK[2]), { stroke: AC35, sw: 2.5, lc: 'round', role: 'series-2' }),
]
RANK.forEach((data, si) => {
  const col = si === 0 ? AC : si === 1 ? AC60 : AC35
  data.forEach((r, i) => {
    bumpShapes.push(sh(circ(X(i, BPn), bpY(r), 4), { fill: 'var(--bg-1)', stroke: col, sw: 2, role: `series-${si}` }))
  })
})

const bump = makePage({
  id: 'bump', name: 'Bump chart',
  tagline: 'Ranking lines over time. Each BumpSeries traces a position through every timestep, with a node marking each rank; crossings make overtakes and tumbles immediately legible.',
  tree: tree(
    [
      ['●', 'BumpSeries', 'arsenal', 'active', 'series-0'],
      ['●', 'BumpSeries', 'city', 'focus', 'series-1'],
      ['●', 'BumpSeries', 'spurs', '', 'series-2'],
    ],
    [['▭', 'Tooltip', 1]],
  ),
  shapes: bumpShapes,
  texts: [
    tx(576, bpY(1) + 3, '#1', { role: 'yaxis' }),
    tx(576, bpY(2) + 3, '#2', { role: 'yaxis' }),
    tx(576, bpY(3) + 3, '#3', { role: 'yaxis' }),
  ],
  xlabels: BP,
  tip: {
    left: '46.0%',
    title: 'Matchday 4',
    rows: [
      { c: AC, l: 'Arsenal', v: '#1' },
      { c: AC60, l: 'City', v: '#3' },
      { c: AC35, l: 'Spurs', v: '#2' },
    ],
    fl: 'Movers', fv: 'City ↓2', fc: 'var(--fg)',
  },
  legend: [{ c: AC, l: 'Arsenal' }, { c: AC60, l: 'City' }, { c: AC35, l: 'Spurs' }],
  note: 'lines draw 500ms swift-out',
  code: code([
    open('BumpChart', [['series', '{teams}', false], ['periods', '{matchdays}', false]]),
    selfc('BumpSeries', [['label', '"Arsenal"'], ['data', '{ranks}', false]]),
    close('BumpChart'),
  ]),
  variants: [
    ['Rank', 'Default — y is discrete rank; rows are evenly spaced regardless of value gaps.'],
    ['Value bump', 'Scale y by the underlying metric so lead sizes show, not just order.'],
    ['Highlighted', 'Dim all but one series on hover to follow a single contender.'],
  ],
  motion: [
    ['ENTER', '--dur-500 · swift-out', 'each line draws left-to-right; nodes pop 0→1 as the path reaches them'],
    ['HOVER', '--dur-100 · linear', 'hovered line thickens and lifts; siblings fade to 0.4'],
    ['REDUCED', '--dur-120 · linear', 'final frame crossfades in without the draw'],
  ],
  a11y: 'Each BumpSeries is a labelled path with a <title>. Rank changes are announced per step: "Matchday 4, Arsenal number 1, City number 3, down 2".',
  props: [
    ['series', 'BumpSeries[]', '—', 'Ranking lines. Each has label, data[] of ranks and optional color.'],
    ['periods', 'string[]', '—', 'Timestep labels along the x-axis.'],
    ['width', 'number', '520', 'SVG width in px.'],
    ['height', 'number', '280', 'SVG height in px.'],
  ],
})

// ── Gantt chart ──────────────────────────────────────────────────────────────
// Project timeline, 4 tasks across a 12-unit span, stacked in rows.
const TASKS: [string, number, number][] = [
  ['Research', 0, 3],
  ['Design', 2, 6],
  ['Build', 5, 10],
  ['Launch', 9, 12],
]
const gtSpan = 12
const gtX = (v: number) => L + (v / gtSpan) * (R - L)
const gtRowH = (B - T) / TASKS.length
const gtBarH = 14
const ganttShapes: import('../chartsData').ChartPage['shapes'] = [...grid()]
TASKS.forEach(([, s, e], i) => {
  const col = i === 0 ? AC : i === 1 ? AC60 : i === 2 ? AC35 : mix(70)
  const y = T + i * gtRowH + (gtRowH - gtBarH) / 2
  ganttShapes.push(sh(rect(gtX(s), y, gtX(e) - gtX(s), gtBarH), { fill: col, role: `series-${i}` }))
})
// "today" marker at unit 7.
ganttShapes.push(sh(`M${f(gtX(7))} ${T}V${B}`, { stroke: 'var(--warn)', sw: 1.5, dash: '4 3', role: 'tooltip-anchor' }))

const gantt = makePage({
  id: 'gantt', name: 'Gantt chart',
  tagline: 'Horizontal task bars positioned by start and end along a time axis, one per row. A dashed marker tracks "today" so slip and overlap are obvious at a glance.',
  tree: tree(
    [
      ['▬', 'GanttTask', 'research', 'active', 'series-0'],
      ['▬', 'GanttTask', 'design', 'focus', 'series-1'],
      ['▬', 'GanttTask', 'build', '', 'series-2'],
      ['▬', 'GanttTask', 'launch', '', 'series-3'],
    ],
    [['│', 'Today', 1], ['▭', 'Tooltip', 1]],
  ),
  shapes: ganttShapes,
  texts: [
    tx(L, T + 0 * gtRowH + gtRowH / 2 + 3, 'Research', { role: 'series-0', fill: N }),
    tx(L, T + 1 * gtRowH + gtRowH / 2 + 3, 'Design', { role: 'series-1', fill: N }),
    tx(L, T + 2 * gtRowH + gtRowH / 2 + 3, 'Build', { role: 'series-2', fill: N }),
    tx(L, T + 3 * gtRowH + gtRowH / 2 + 3, 'Launch', { role: 'series-3', fill: N }),
  ],
  xlabels: ['W1', 'W4', 'W7', 'W10', 'W12'],
  tip: {
    left: ((gtX(7) / W) * 100 - 2).toFixed(1) + '%',
    title: 'Build',
    rows: [
      { c: AC35, l: 'Start', v: 'Week 5' },
      { c: AC35, l: 'End', v: 'Week 10' },
    ],
    fl: 'Duration', fv: '5 weeks', fc: 'var(--fg)',
  },
  legend: [{ c: AC, l: 'Research' }, { c: AC60, l: 'Design' }, { c: AC35, l: 'Build' }],
  note: 'bars grow 500ms swift-out · today marker fixed',
  code: code([
    open('GanttChart', [['tasks', '{tasks}', false], ['labels', '{weeks}', false], ['today', '{7}', false]]),
    selfc('GanttTask', [['label', '"Build"'], ['start', '{5}', false], ['end', '{10}', false]]),
    close('GanttChart'),
  ]),
  variants: [
    ['Timeline', 'Default — bars span start→end on a shared linear time axis.'],
    ['With today', 'A today marker drops a dashed warn line across all rows.'],
    ['Dependencies', 'Connect a task end to a successor start to show critical path.'],
  ],
  motion: [
    ['ENTER', '--dur-500 · swift-out', 'each bar grows from its start edge toward the end; rows stagger 40ms'],
    ['HOVER', '--dur-100 · linear', 'hovered bar lifts; its row label brightens to --fg'],
    ['REDUCED', '--dur-120 · linear', 'bars crossfade in at full width without the grow'],
  ],
  a11y: 'Each GanttTask is a labelled bar with a <title>. Rows read as "Build, week 5 to week 10, 5 weeks". The today marker is announced once as a reference line.',
  props: [
    ['tasks', 'GanttTask[]', '—', 'Rows to draw. Each has label, start, end and optional color.'],
    ['labels', 'string[]', '—', 'Evenly spaced time-axis tick labels.'],
    ['today', 'number', '—', 'Optional time value for a dashed reference marker.'],
    ['width', 'number', '520', 'SVG width in px.'],
  ],
})

// ── Horizon chart ────────────────────────────────────────────────────────────
// Three metric lanes, each folding its area into layered colour bands.
const HZ: number[][] = [
  [20, 40, 60, 80, 55, 30, 50, 75],
  [10, 25, 15, 35, 50, 40, 60, 45],
  [35, 20, 45, 30, 55, 65, 40, 55],
]
const HZn = 8
const HZlanes = 3
const HZbands = 3
const hzAbsMax = Math.max(...HZ.flat())
const hzBandSize = hzAbsMax / HZbands
const hzLaneH = (B - T) / HZlanes
const hzX = (i: number) => X(i, HZn)
// Fold band k of a lane into an area path clamped to one band's height.
const hzArea = (data: number[], laneTop: number, k: number): string => {
  const laneBottom = laneTop + hzLaneH - 2
  const yFor = (mag: number) => laneBottom - (Math.min(mag, hzBandSize) / hzBandSize) * (hzLaneH - 2)
  const pts = data.map((v, i) => ({ x: hzX(i), y: yFor(Math.max(0, v - k * hzBandSize)) }))
  let d = `M${f(pts[0].x)} ${f(laneBottom)}`
  for (const p of pts) d += `L${f(p.x)} ${f(p.y)}`
  d += `L${f(pts[pts.length - 1].x)} ${f(laneBottom)}Z`
  return d
}
const hzColor = (k: number) => mix(Math.round(((k + 1) / HZbands) * 85 + 15))
const horizonShapes: import('../chartsData').ChartPage['shapes'] = [...grid()]
HZ.forEach((data, si) => {
  const laneTop = T + si * hzLaneH
  for (let k = 0; k < HZbands; k++) {
    horizonShapes.push(sh(hzArea(data, laneTop, k), { fill: hzColor(k), role: `series-${si}` }))
  }
})

const horizon = makePage({
  id: 'horizon', name: 'Horizon chart',
  tagline: 'Banded area compressed into thin lanes. Each HorizonSeries folds its range into layered colour bands of increasing intensity, packing many time series into a dense, comparable stack.',
  tree: tree(
    [
      ['◢', 'HorizonSeries', 'cpu', 'active', 'series-0'],
      ['◢', 'HorizonSeries', 'memory', 'focus', 'series-1'],
      ['◢', 'HorizonSeries', 'disk', '', 'series-2'],
    ],
    [['▭', 'Tooltip', 1]],
  ),
  shapes: horizonShapes,
  texts: [
    tx(L, T + 0 * hzLaneH + hzLaneH / 2 + 3, 'CPU', { role: 'series-0', fill: N }),
    tx(L, T + 1 * hzLaneH + hzLaneH / 2 + 3, 'Memory', { role: 'series-1', fill: N }),
    tx(L, T + 2 * hzLaneH + hzLaneH / 2 + 3, 'Disk', { role: 'series-2', fill: N }),
  ],
  xlabels: MONTHS.slice(0, HZn),
  tip: {
    left: '58.0%',
    title: 'Jun 2026',
    rows: [
      { c: AC, l: 'CPU', v: '30%' },
      { c: AC60, l: 'Memory', v: '40%' },
      { c: AC35, l: 'Disk', v: '65%' },
    ],
    fl: 'Peak', fv: 'Disk 65%', fc: 'var(--fg)',
  },
  legend: [{ c: AC35, l: 'Band 1' }, { c: AC60, l: 'Band 2' }, { c: AC, l: 'Band 3' }],
  note: 'bands fade in 500ms swift-out',
  code: code([
    open('HorizonChart', [['series', '{metrics}', false], ['bands', '{3}', false], ['labels', '{months}', false]]),
    selfc('HorizonSeries', [['label', '"CPU"'], ['data', '{cpu}', false]]),
    close('HorizonChart'),
  ]),
  variants: [
    ['Positive', 'Default — three accent bands of rising intensity encode magnitude.'],
    ['Diverging', 'Negative values mirror into err-toned bands below the baseline.'],
    ['Dense', 'Raise bands to 4+ to fit more range into the same lane height.'],
  ],
  motion: [
    ['ENTER', '--dur-500 · swift-out', 'bands fade in back-to-front per lane so the darkest peak lands last'],
    ['HOVER', '--dur-100 · linear', 'hovered lane expands a readout; others hold at base intensity'],
    ['REDUCED', '--dur-120 · linear', 'all bands crossfade in together without stagger'],
  ],
  a11y: 'Each HorizonSeries is a labelled lane with a <title>. Values read with their band depth: "June, CPU 30 percent, band 1". Lanes share one time axis announced once.',
  props: [
    ['series', 'HorizonSeries[]', '—', 'Lanes to draw. Each has label and data[].'],
    ['bands', 'number', '3', 'Number of colour bands the range is folded into.'],
    ['labels', 'string[]', '—', 'Shared x-axis tick labels.'],
    ['width', 'number', '520', 'SVG width in px.'],
  ],
})

export const TEMPORAL_PAGES: Record<string, ChartPage> = { 'stream-graph': streamGraph, bump, gantt, horizon }
