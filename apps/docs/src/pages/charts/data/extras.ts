// Anatomy pages for chart extras: sparkline-grid, annotations, brush, live, comparison.
import {
  makePage, tree, grid, sh, tx, yl, circ,
  code, open, selfc, close,
  AC, AC60, N, OK, ERR, mix,
  X, Y, f, L, R, T, B,
  type ChartPage,
} from '../chartsData'

/* ────────────────────────────────────────────────────────────────────────── */
/* 1 · SparklineGrid                                                           */
/* ────────────────────────────────────────────────────────────────────────── */

// Four stacked rows: label | mini-spark | value | delta.
const sgRows = 4
const sgRowH = (B - T) / sgRows
const sgRowY = (i: number) => T + sgRowH * (i + 0.5)
const sgSparkPath = (seed: number) => {
  const vals = Array.from({ length: 12 }, (_, i) =>
    30 + Math.sin((i + seed) / 1.6) * 14 + (i * (seed + 1)) / 4,
  )
  const mx = Math.max(...vals) + 4
  const mn = Math.min(...vals) - 4
  const w = 180
  const sparkX = (i: number) => 220 + (i / (vals.length - 1)) * w
  const sparkY = (v: number, rowI: number) =>
    sgRowY(rowI) - 10 + 20 - ((v - mn) / (mx - mn)) * 20
  return vals.map((v, i) => `${i ? 'L' : 'M'}${f(sparkX(i))} ${f(sparkY(v, seed))}`).join(' ')
}

const sgShapes: ChartPage['shapes'] = [
  // row dividers
  ...Array.from({ length: sgRows - 1 }, (_, i) =>
    sh(`M${L} ${f(T + sgRowH * (i + 1))}H${R}`, { stroke: 'var(--line)', sw: 1, role: 'grid' }),
  ),
  // sparklines per row — unique role per row so clicking a tree row isolates just that row
  sh(sgSparkPath(0), { stroke: AC, sw: 1.75, lc: 'round', role: 'series-0' }),
  sh(sgSparkPath(1), { stroke: AC60, sw: 1.75, lc: 'round', role: 'series-1' }),
  sh(sgSparkPath(2), { stroke: ERR, sw: 1.75, lc: 'round', role: 'series-2' }),
  sh(sgSparkPath(3), { stroke: OK, sw: 1.75, lc: 'round', role: 'series-3' }),
]

const sgTexts: ChartPage['texts'] = [
  // Row labels (left column) tagged with the matching series role
  tx(L + 10, sgRowY(0) + 3, 'MRR', { fill: 'var(--fg)', size: 11, w: 500, sans: true, role: 'series-0' }),
  tx(L + 10, sgRowY(1) + 3, 'Signups', { fill: 'var(--fg)', size: 11, w: 500, sans: true, role: 'series-1' }),
  tx(L + 10, sgRowY(2) + 3, 'Errors', { fill: 'var(--fg)', size: 11, w: 500, sans: true, role: 'series-2' }),
  tx(L + 10, sgRowY(3) + 3, 'Latency', { fill: 'var(--fg)', size: 11, w: 500, sans: true, role: 'series-3' }),
  // Values (right column)
  tx(430, sgRowY(0) + 3, '$84k', { a: 'end', fill: 'var(--fg)', size: 11, w: 500, role: 'series-0' }),
  tx(430, sgRowY(1) + 3, '912', { a: 'end', fill: 'var(--fg)', size: 11, w: 500, role: 'series-1' }),
  tx(430, sgRowY(2) + 3, '0.5%', { a: 'end', fill: 'var(--fg)', size: 11, w: 500, role: 'series-2' }),
  tx(430, sgRowY(3) + 3, '95ms', { a: 'end', fill: 'var(--fg)', size: 11, w: 500, role: 'series-3' }),
  // Delta badges — all share the markers role (click DeltaBadge → all four highlight)
  tx(560, sgRowY(0) + 3, '+12.4%', { a: 'end', fill: OK, size: 10, w: 600, role: 'markers' }),
  tx(560, sgRowY(1) + 3, '+185%', { a: 'end', fill: OK, size: 10, w: 600, role: 'markers' }),
  tx(560, sgRowY(2) + 3, '-76%', { a: 'end', fill: OK, size: 10, w: 600, role: 'markers' }),
  tx(560, sgRowY(3) + 3, '-21ms', { a: 'end', fill: OK, size: 10, w: 600, role: 'markers' }),
]

const sparklineGrid = makePage({
  id: 'sparkline-grid', name: 'SparklineGrid',
  tagline: 'Rows of mini sparklines for dashboards and metric tables. Each row shows a label, a word-sized trend chart, the current value, and an optional delta vs. the first data point. Composes on top of SparklineChart.',
  tree: tree(
    [
      ['∿', 'SparklineRow', 'MRR', 'active', 'series-0'],
      ['∿', 'SparklineRow', 'signups', '', 'series-1'],
      ['∿', 'SparklineRow', 'errors', '', 'series-2'],
      ['▮', 'SparklineRow', 'latency', '', 'series-3'],
      ['●', 'DeltaBadge', '', '', 'markers'],
    ],
    [],
    false,
  ),
  shapes: sgShapes,
  texts: sgTexts,
  xlabels: [],
  tip: {
    left: '68%', title: 'MRR · last 12mo',
    rows: [{ c: AC, l: 'Current', v: '$84k' }],
    fl: 'vs start', fv: '+12.4%', fc: OK,
  },
  legend: [],
  note: 'rows stagger-draw 60ms apart · delta badge fades in last',
  code: code([
    open('SparklineGrid', [['rows', '{metrics}', false], ['columns', '{2}', false]]),
    close('SparklineGrid'),
  ]),
  variants: [
    ['Line', 'Default — a smooth path per row. Great for monotone metrics.'],
    ['Bar', 'type="bar" renders one bar per value. Good for counts.'],
    ['Status', 'type="status" renders discrete ok/warn/err cells. Uptime strips.'],
    ['Columns', 'columns={2|3|4} splits rows into a dense grid for KPI panels.'],
  ],
  motion: [
    ['ENTER', '--dur-300 · swift-out', 'rows stagger-draw top-to-bottom at 60ms intervals'],
    ['HOVER', '--dur-100 · linear', 'row highlights with a soft bg tint; sparkline unaffected'],
    ['REDUCED', '--dur-120 · linear', 'rows fade in together without stagger'],
  ],
  a11y: 'Each row is a listitem. The sparkline is self-labelled with "<metric> trend" and the value cell is the source of truth: "MRR, trend: 84 thousand, up 12.4 percent since start".',
  props: [
    ['rows', 'SparklineGridRow[]', '—', 'Rows to render. Each: { label, data[], value?, meta?, color? }.'],
    ['type', '"line" | "bar" | "status"', '"line"', 'Sparkline rendering kind applied to every row.'],
    ['columns', '1 | 2 | 3 | 4', '1', 'Grid column count.'],
    ['showDelta', 'boolean', 'true', 'Toggle the ±% badge computed vs. the first data point.'],
    ['valueFormat', '(n: number) => string', '—', 'Formatter for the fallback (last data point) value.'],
    ['sparkWidth', 'number', '120', 'Sparkline cell width in px.'],
    ['sparkHeight', 'number', '32', 'Sparkline cell height in px.'],
  ],
})

/* ────────────────────────────────────────────────────────────────────────── */
/* 2 · AnnotationsLayer                                                        */
/* ────────────────────────────────────────────────────────────────────────── */

const anData = [42, 48, 55, 110, 92, 70, 58]
const anMax = 120
const anLine = anData
  .map((v, i) => `${i ? 'L' : 'M'}${f(X(i, anData.length))} ${f(Y(v, anMax))}`)
  .join(' ')
const anThresholdY = Y(100, anMax)
const anRangeX1 = X(1, anData.length)
const anRangeX2 = X(2, anData.length)
const anPointX = X(3, anData.length)
const anPointY = Y(110, anMax)

const annotations = makePage({
  id: 'annotations', name: 'AnnotationsLayer',
  tagline: 'Composable overlay for LineChart. Point markers call out specific events, horizontal threshold lines mark SLAs or targets, and vertical range bands highlight windows like deploys or incidents. Positioned absolutely over any chart that shares its coordinate space.',
  tree: tree(
    [
      ['∿', 'LineChart', 'metric', 'active', 'series-0'],
      ['─', 'Threshold', 'SLA', '', 'series-1'],
      ['▮', 'Range', 'deploy', '', 'series-2'],
      ['●', 'Point', 'spike', '', 'series-3'],
    ],
    [['▭', 'Tooltip', 1]],
  ),
  shapes: [
    ...grid(),
    // range band (deploy) → series-2
    sh(
      `M${f(anRangeX1)} ${f(T)}H${f(anRangeX2)}V${f(B)}H${f(anRangeX1)}Z`,
      { fill: AC, op: 0.12, role: 'series-2' },
    ),
    sh(`M${f(anRangeX1)} ${f(T)}V${f(B)}`, { stroke: AC, dash: '3 3', op: 0.6, sw: 1, role: 'series-2' }),
    sh(`M${f(anRangeX2)} ${f(T)}V${f(B)}`, { stroke: AC, dash: '3 3', op: 0.6, sw: 1, role: 'series-2' }),
    // threshold line (SLA) → series-1
    sh(`M${L} ${f(anThresholdY)}H${R}`, { stroke: ERR, dash: '4 3', sw: 1.25, role: 'series-1' }),
    // the metric line → series-0
    sh(anLine, { stroke: AC, sw: 2, lc: 'round', role: 'series-0' }),
    // point annotation → series-3
    sh(circ(anPointX, anPointY, 5), { fill: 'var(--bg-1)', stroke: AC, sw: 2, role: 'series-3' }),
    sh(circ(anPointX, anPointY, 2), { fill: AC, role: 'series-3' }),
  ],
  texts: [
    ...yl(anMax, (v) => String(Math.round(v))),
    tx(R - 6, anThresholdY - 4, 'SLA', { a: 'end', fill: ERR, size: 10, role: 'series-1' }),
    tx((anRangeX1 + anRangeX2) / 2, T + 14, 'deploy', { a: 'middle', fill: AC, size: 10, role: 'series-2' }),
    tx(anPointX + 10, anPointY - 6, 'spike', { fill: 'var(--fg)', size: 10, role: 'series-3' }),
  ],
  xlabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  tip: {
    left: '58%', title: 'Thu — spike',
    rows: [{ c: AC, l: 'Value', v: '110' }, { c: ERR, l: 'SLA', v: '100' }],
    fl: 'Over by', fv: '+10 (10%)', fc: ERR,
  },
  legend: [],
  note: 'overlay layers draw after the chart · reduced-motion skips the band fade',
  code: code([
    open('div', [['style', '{{ position: "relative" }}', false]]),
    [['dim', '  <'], ['tag', 'LineChart'], ['attr', ' data='], ['val', '{data}'], ['attr', ' width='], ['val', '{W}'], ['attr', ' height='], ['val', '{H}'], ['attr', ' yMin='], ['val', '{0}'], ['attr', ' yMax='], ['val', '{120}'], ['dim', ' />']],
    [
      ['dim', '  <'], ['tag', 'AnnotationsLayer'],
      ['attr', ' width='], ['val', '{W}'], ['attr', ' height='], ['val', '{H}'],
      ['attr', ' dataLength='], ['val', '{data.length}'],
      ['attr', ' yMin='], ['val', '{0}'], ['attr', ' yMax='], ['val', '{120}'],
      ['attr', ' annotations='], ['val', '{annotations}'], ['dim', ' />'],
    ],
    close('div'),
  ]),
  variants: [
    ['Point', '{ type: "point", x, y, label } — a labelled dot anchored to a data index.'],
    ['Threshold', '{ type: "threshold", y, label, dashed } — a horizontal reference line.'],
    ['Range', '{ type: "range", from, to, label } — a vertical band between two indices.'],
  ],
  motion: [
    ['ENTER', '--dur-300 · swift-out', 'range bands fade in; threshold line draws left→right; point markers pop'],
    ['HOVER', '--dur-100 · linear', 'point annotations enlarge their label pill; threshold lines are static'],
    ['REDUCED', '--dur-120 · linear', 'all overlays crossfade in together without the stagger'],
  ],
  a11y: 'Each annotation renders a <title> describing its role: "SLA threshold, 100". Points use aria-describedby to associate with the hovered chart value, so screen readers announce "Thursday, value 110, annotated: spike".',
  props: [
    ['annotations', 'Annotation[]', '—', 'Array of point / threshold / range entries.'],
    ['width', 'number', '—', 'Must match the paired chart width.'],
    ['height', 'number', '—', 'Must match the paired chart height.'],
    ['dataLength', 'number', '—', 'Length of the data array used by the chart.'],
    ['yMin', 'number', '—', 'Lower y-axis bound; pass the same value as the chart.'],
    ['yMax', 'number', '—', 'Upper y-axis bound; pass the same value as the chart.'],
    ['padding', '{ left?, right?, top?, bottom? }', 'LineChart defaults', 'Override inner padding if the chart was customised.'],
  ],
})

/* ────────────────────────────────────────────────────────────────────────── */
/* 3 · BrushChart                                                              */
/* ────────────────────────────────────────────────────────────────────────── */

const brN = 24
const brData = Array.from({ length: brN }, (_, i) =>
  Math.round(50 + Math.sin(i / 2.5) * 20 + i * 1.4),
)
const brMax = Math.max(...brData) + 10
// Split canvas: main chart in top 70%, overview in bottom 25% with a small gap.
const brMainT = T
const brMainB = T + (B - T) * 0.72
const brStripT = T + (B - T) * 0.82
const brStripB = B
const brXMain = (i: number) => L + (i / (brN - 1)) * (R - L)
const brYMain = (v: number) => brMainB - (v / brMax) * (brMainB - brMainT)
const brStripY = (v: number) => brStripB - (v / brMax) * (brStripB - brStripT)
const brSelFrom = 8
const brSelTo = 17
const brSelX1 = brXMain(brSelFrom)
const brSelX2 = brXMain(brSelTo)

const brMainLine = brData
  .slice(brSelFrom, brSelTo + 1)
  .map((v, i, arr) => {
    const localN = arr.length
    const x = L + (i / (localN - 1)) * (R - L)
    return `${i ? 'L' : 'M'}${f(x)} ${f(brYMain(v))}`
  })
  .join(' ')

const brStripLine = brData
  .map((v, i) => `${i ? 'L' : 'M'}${f(brXMain(i))} ${f(brStripY(v))}`)
  .join(' ')

const brush = makePage({
  id: 'brush', name: 'BrushChart',
  tagline: 'LineChart paired with a draggable brush selector. The main chart renders the current window; a compact overview strip below shows the whole dataset with a draggable selection band. Drag inside the band to pan, grab an edge to resize, or click-drag empty space for a fresh selection.',
  tree: tree(
    [
      ['∿', 'LineChart', 'window', 'active', 'series-0'],
      ['▭', 'OverviewStrip', '', '', 'series-1'],
      ['▮', 'SelectionBand', '', '', 'markers'],
    ],
    [['▭', 'Tooltip', 1]],
  ),
  shapes: [
    // Main chart baselines
    sh(`M${L} ${f(brMainB)}H${R}`, { stroke: 'var(--line-2)', sw: 1, role: 'xaxis' }),
    // Main line → series-0
    sh(brMainLine, { stroke: AC, sw: 2, lc: 'round', role: 'series-0' }),
    // Divider between main and strip
    sh(`M${L} ${f(brStripT - 4)}H${R}`, { stroke: 'var(--line)', dash: '2 4', sw: 1, role: 'grid' }),
    // Overview strip bg → series-1 (so it isolates with the overview row)
    sh(`M${L} ${f(brStripT)}H${R}V${f(brStripB)}H${L}Z`, { fill: 'var(--bg-2)', role: 'series-1' }),
    // Overview line → series-1
    sh(brStripLine, { stroke: 'var(--fg-3)', sw: 1.25, role: 'series-1' }),
    // Selection band → markers
    sh(
      `M${f(brSelX1)} ${f(brStripT)}H${f(brSelX2)}V${f(brStripB)}H${f(brSelX1)}Z`,
      { fill: AC, op: 0.15, stroke: AC, sw: 1, role: 'markers' },
    ),
    // Selection handles → markers
    sh(
      `M${f(brSelX1 - 2)} ${f(brStripT - 4)}h4v${f(brStripB - brStripT + 8)}h-4z`,
      { fill: AC, role: 'markers' },
    ),
    sh(
      `M${f(brSelX2 - 2)} ${f(brStripT - 4)}h4v${f(brStripB - brStripT + 8)}h-4z`,
      { fill: AC, role: 'markers' },
    ),
  ],
  texts: [
    tx(L, T - 2, 'window', { fill: 'var(--fg-3)', size: 10, role: 'series-0' }),
    tx(L, brStripT - 10, 'overview', { fill: 'var(--fg-3)', size: 10, role: 'series-1' }),
  ],
  xlabels: [],
  tip: {
    left: '48%', title: 'Range selected',
    rows: [{ c: AC, l: 'From', v: 'D9' }, { c: AC, l: 'To', v: 'D18' }],
    fl: 'Points', fv: '10', fc: 'var(--fg)',
  },
  legend: [],
  note: 'drag the band to pan · grab an edge to resize · click-drag empty space to re-select',
  code: code([
    open('BrushChart', [['data', '{series}', false], ['defaultRange', '{{ from: 8, to: 17 }}', false]]),
    close('BrushChart'),
  ]),
  variants: [
    ['Pan', 'Drag inside the band — selection slides, size preserved.'],
    ['Resize', 'Drag either edge handle to grow or shrink the window.'],
    ['Re-select', 'Click-drag over the strip background for a fresh selection.'],
  ],
  motion: [
    ['DRAG', '--dur-0', 'band follows the pointer with zero easing for 1:1 tracking'],
    ['RELEASE', '--dur-150 · swift-out', 'main chart interpolates to the new window with a soft tween'],
    ['REDUCED', '--dur-0', 'main chart snaps to the new window without the tween'],
  ],
  a11y: 'The selection band is a slider with aria-valuemin/aria-valuemax reflecting the data range. Arrow keys move the from/to endpoints by one index; shift+arrows pan the whole window.',
  props: [
    ['data', '{ label, value }[]', '—', 'Rows passed to LineChart. Length drives the overview strip.'],
    ['series', 'LineChartSeries[]', '—', 'Optional multi-series payload mirrored into both charts.'],
    ['range', '{ from, to }', '—', 'Controlled index range.'],
    ['defaultRange', '{ from, to }', 'full', 'Uncontrolled initial range.'],
    ['onRangeChange', '(range) => void', '—', 'Fires on every drag update.'],
    ['overviewHeight', 'number', '48', 'Overview strip height in px.'],
    ['overviewColor', 'string', 'var(--fg-3)', 'Stroke colour for the overview line.'],
  ],
})

/* ────────────────────────────────────────────────────────────────────────── */
/* 4 · LiveLineChart                                                           */
/* ────────────────────────────────────────────────────────────────────────── */

const lvN = 18
const lvData = Array.from({ length: lvN }, (_, i) =>
  Math.round(50 + Math.sin(i / 2) * 18 + Math.random() * 6),
)
const lvMax = 100
const lvLine = lvData
  .map((v, i) => `${i ? 'L' : 'M'}${f(X(i, lvN))} ${f(Y(v, lvMax))}`)
  .join(' ')
const lvLastX = X(lvN - 1, lvN)
const lvLastY = Y(lvData[lvN - 1], lvMax)

const liveLine = makePage({
  id: 'live-line', name: 'LiveLineChart',
  tagline: 'Streaming line chart backed by a ring buffer. Supply a source function for interval polling or push values imperatively via a ref. Built-in pause / resume / clear controls and automatic buffer eviction once maxPoints is reached.',
  tree: tree(
    [
      ['∿', 'LineChart', 'metric', 'active', 'series-0'],
      ['●', 'LivePulse', 'last', 'focus', 'markers'],
    ],
    [['▭', 'ControlsBar', 1], ['◎', 'RingBuffer']],
  ),
  shapes: [
    ...grid(),
    sh(lvLine, { stroke: AC, sw: 2, lc: 'round', role: 'series-0' }),
    // Pulsing live marker (two rings)
    sh(circ(lvLastX, lvLastY, 8), { fill: AC, op: 0.15, role: 'markers' }),
    sh(circ(lvLastX, lvLastY, 4), { fill: 'var(--bg-1)', stroke: AC, sw: 2, role: 'markers' }),
    sh(circ(lvLastX, lvLastY, 2), { fill: AC, role: 'markers' }),
    // Pause/resume indicator pill (top-right)
    sh(`M${R - 60} ${f(T + 2)}h50v16h-50z`, { fill: 'var(--bg-2)', stroke: 'var(--line)', sw: 1, role: 'reference' }),
  ],
  texts: [
    ...yl(lvMax, (v) => String(Math.round(v))),
    tx(R - 55, T + 13, '● LIVE', { fill: OK, size: 10, w: 600, role: 'reference' }),
    tx(lvLastX + 10, lvLastY - 8, String(lvData[lvN - 1]), { fill: AC, size: 11, w: 600, role: 'tooltip-anchor' }),
  ],
  xlabels: [],
  tip: {
    left: '82%', title: 't = now',
    rows: [{ c: AC, l: 'Value', v: String(lvData[lvN - 1]) }],
    fl: 'buffer', fv: `${lvN} / 60`, fc: 'var(--fg)',
  },
  legend: [],
  note: 'ring buffer shifts left when full · last point pulses every tick · pause freezes the series',
  code: code([
    selfc('LiveLineChart', [
      ['source', '{() => fetchMetric()}', false],
      ['intervalMs', '{1000}', false],
      ['maxPoints', '{60}', false],
    ], ''),
  ]),
  variants: [
    ['Polling', 'Pass source + intervalMs; the chart owns the timer.'],
    ['Imperative', 'Omit source and call ref.current.push(value) from a WebSocket or SSE stream.'],
    ['Hybrid', 'Mix both — source handles the baseline, push() injects out-of-band events.'],
  ],
  motion: [
    ['TICK', '--dur-200 · swift-out', 'line slides one step left; last-point marker pulses to signal arrival'],
    ['PAUSE', '--dur-150 · linear', 'live pill fades to paused; marker stops pulsing'],
    ['REDUCED', '--dur-0', 'line jumps to the new state without animation'],
  ],
  a11y: 'The chart carries aria-live="polite" and announces every nth sample ("buffer at 42 of 60, last value 72") so screen readers do not firehose. Pause stops announcements until resumed.',
  props: [
    ['maxPoints', 'number', '60', 'Ring-buffer capacity. Oldest point drops when full.'],
    ['source', '() => number', '—', 'Optional poller. Called every intervalMs.'],
    ['intervalMs', 'number', '1000', 'Poll interval when source is set.'],
    ['initial', 'number[]', '[]', 'Starting values; clipped to maxPoints.'],
    ['defaultPaused', 'boolean', 'false', 'Start in paused state.'],
    ['showControls', 'boolean', 'true', 'Pause / resume / clear buttons.'],
    ['ref', 'Ref<LiveLineChartHandle>', '—', 'Imperative handle: push, pause, resume, reset, clear.'],
  ],
})

/* ────────────────────────────────────────────────────────────────────────── */
/* 5 · ComparisonLineChart                                                     */
/* ────────────────────────────────────────────────────────────────────────── */

const cmpN = 7
const cmpCurr = [120, 148, 165, 180, 210, 192, 174]
const cmpPrev = [100, 118, 132, 150, 172, 160, 148]
const cmpMax = 240
const cmpCurrLine = cmpCurr
  .map((v, i) => `${i ? 'L' : 'M'}${f(X(i, cmpN))} ${f(Y(v, cmpMax))}`)
  .join(' ')
const cmpPrevLine = cmpPrev
  .map((v, i) => `${i ? 'L' : 'M'}${f(X(i, cmpN))} ${f(Y(v, cmpMax))}`)
  .join(' ')

const comparison = makePage({
  id: 'comparison', name: 'ComparisonLineChart',
  tagline: 'Overlay the current period against a previous period. The previous line renders dashed and muted so the current series stays the hero. A delta badge summarises the aggregate change through a configurable reducer (sum by default).',
  tree: tree(
    [
      ['∿', 'LineSeries', 'current', 'active', 'series-0'],
      ['∿', 'LineSeries', 'previous', '', 'series-1'],
      ['▮', 'DeltaBadge', '', 'focus', 'markers'],
    ],
    [['≡', 'Legend'], ['▭', 'Tooltip', 1]],
  ),
  shapes: [
    ...grid(),
    sh(cmpPrevLine, { stroke: N, sw: 1.5, dash: '4 3', lc: 'round', op: 0.75, role: 'series-1' }),
    sh(cmpCurrLine, { stroke: AC, sw: 2, lc: 'round', role: 'series-0' }),
    // Delta badge rect top-right
    sh(`M${R - 80} ${f(T + 2)}h70v18h-70z`, { fill: mix(15), stroke: AC, sw: 1, role: 'markers' }),
  ],
  texts: [
    ...yl(cmpMax, (v) => String(Math.round(v))),
    tx(R - 45, T + 14, '↑ +12.1%', { a: 'middle', fill: OK, size: 11, w: 600, role: 'markers' }),
  ],
  xlabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  tip: {
    left: '58%', title: 'Thu',
    rows: [
      { c: AC, l: 'This week', v: '180' },
      { c: N, l: 'Last week', v: '150' },
    ],
    fl: 'Delta', fv: '+30 (+20%)', fc: OK,
  },
  legend: [{ c: AC, l: 'This week' }, { c: N, l: 'Last week' }],
  note: 'current draws solid 300ms · previous ghosts in dashed 200ms later · badge pops at the end',
  code: code([
    selfc('ComparisonLineChart', [
      ['current', '{thisWeek}', false],
      ['previous', '{lastWeek}', false],
      ['currentLabel', '"This week"'],
      ['previousLabel', '"Last week"'],
    ], ''),
  ]),
  variants: [
    ['Rising', 'Default — accent current + muted previous. Badge is ok-coloured when up.'],
    ['Falling', 'Delta turns err-coloured without changing the series palette.'],
    ['Custom aggregate', 'Pass aggregate={avg} or any reducer to replace the sum-based badge.'],
  ],
  motion: [
    ['ENTER', '--dur-300 · swift-out', 'current line draws left→right; previous ghosts in 200ms later with half-opacity'],
    ['HOVER', '--dur-100 · linear', 'both series highlight at the same x; tooltip stacks the delta'],
    ['REDUCED', '--dur-120 · linear', 'both lines fade in together, no draw animation'],
  ],
  a11y: 'The legend and delta badge are the primary readout for screen readers. Tooltip rows announce both series together: "Thursday, this week 180, last week 150, delta plus 30 or plus 20 percent".',
  props: [
    ['current', '{ label, value }[]', '—', 'The current-period series. Its labels drive the x-axis.'],
    ['previous', 'number[]', '—', 'The previous-period values. Padded / clipped to current.length.'],
    ['currentLabel', 'string', '"Current"', 'Legend label for the solid series.'],
    ['previousLabel', 'string', '"Previous"', 'Legend label for the dashed series.'],
    ['currentColor', 'Token | string', 'var(--ac)', 'Solid series stroke.'],
    ['previousColor', 'Token | string', 'var(--fg-3)', 'Dashed series stroke.'],
    ['aggregate', '(vs: number[]) => number', 'sum', 'Reducer used for the delta badge.'],
    ['formatDelta', '(curr, prev) => string', '± %', 'Custom formatter for the delta badge.'],
    ['showHeader', 'boolean', 'true', 'Hide the legend + delta badge.'],
  ],
})

export const EXTRAS_PAGES: Record<string, ChartPage> = {
  'sparkline-grid': sparklineGrid,
  annotations,
  brush,
  'live-line': liveLine,
  comparison,
}
