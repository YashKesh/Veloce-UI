import {
  makePage, tree, grid, sh, tx, yl, circ, rect, arc,
  code, open, selfc, close,
  AC, AC35, N, OK, WARN, mix,
  X, Y, L, R, T, B, W,
  type ChartPage,
} from '../chartsData'

// ---------------------------------------------------------------------------
// Bullet chart — qualitative range bands + measure bar + target marker.
// ---------------------------------------------------------------------------
const bullet = makePage({
  id: 'bullet', name: 'Bullet chart',
  tagline: 'A measure bar over graded qualitative bands with a target tick. Compact KPI gauge that shows performance, context and goal in one horizontal row.',
  tree: tree(
    [['▮', 'BulletChart', 'value', 'active', 'series-0'], ['│', 'TargetMarker', 'target', 'focus', 'series-1'], ['▭', 'RangeBands', 'ranges', 'dim', 'series-2']],
    [['▭', 'Tooltip', 1], ['≡', 'Legend']],
  ),
  shapes: [
    // three stacked KPI rows: bands (light→dark), measure bar, target tick
    ...[0, 1, 2].flatMap((row) => {
      const cy = 50 + row * 70
      const h = 44
      const vals = [0.45, 0.7, 0.9][row] // measure fraction
      const tgt = [0.62, 0.78, 0.82][row]
      const bands = [0.4, 0.75, 1]
      return [
        ...bands.map((hi, bi) => {
          const lo = bi === 0 ? 0 : bands[bi - 1]
          return sh(rect(L + lo * (R - L), cy - h / 2, (hi - lo) * (R - L), h), { fill: mix(14 + bi * 12), role: 'series-2' })
        }),
        sh(rect(L, cy - 9, vals * (R - L), 18), { fill: AC, role: 'series-0' }),
        sh(`M${(L + tgt * (R - L)).toFixed(1)} ${cy - h / 2}L${(L + tgt * (R - L)).toFixed(1)} ${cy + h / 2}`, { stroke: 'var(--fg)', sw: 3, role: 'series-1' }),
        sh(circ(L + vals * (R - L), cy, 2), { fill: 'var(--bg)', role: 'tooltip-anchor' }),
      ]
    }),
  ],
  texts: [
    tx(L - 6, 50, 'Revenue', { a: 'end', fill: 'var(--fg)', size: 12, sans: true }),
    tx(L - 6, 120, 'Signups', { a: 'end', fill: 'var(--fg)', size: 12, sans: true }),
    tx(L - 6, 190, 'NPS', { a: 'end', fill: 'var(--fg)', size: 12, sans: true }),
  ],
  xlabels: [],
  tip: {
    left: '56%',
    title: 'Revenue',
    rows: [{ c: AC, l: 'Actual', v: '$1.26M' }, { c: 'var(--fg)', l: 'Target', v: '$1.40M' }],
    fl: 'Attainment', fv: '90%', fc: OK,
  },
  legend: [{ c: AC, l: 'Measure' }, { c: 'var(--fg)', l: 'Target' }, { c: mix(30), l: 'Qualitative bands' }],
  note: 'bar grow 480ms swift-out · bands fade 160ms',
  code: code([
    open('BulletChart', [['data', '{rows}', false]]),
    selfc('BulletChart', [['dataKey', '"value"']]),
    close('BulletChart'),
  ]),
  variants: [['Horizontal', 'Default row layout; label on the left, bands fill the track.'], ['Multi-KPI', 'Stack several datum rows to build a dashboard panel.']],
  motion: [
    ['ENTER', '--dur-480 · swift-out', 'Measure bar grows left→right; bands fade in behind it.'],
    ['HOVER', '--dur-100 · linear', 'Row raises contrast; target tick thickens.'],
    ['REDUCED', '--dur-120 · linear', 'Bar and bands crossfade to final state.'],
  ],
  a11y: 'Each row mirrors to a table with label, value, target and a computed attainment percentage announced on focus.',
  props: [
    ['data', 'BulletChartDatum[]', '—', 'Rows of { label, value, target, ranges }.'],
    ['width', 'number', '480', 'SVG width in px.'],
    ['height', 'number', '220', 'SVG height in px.'],
  ],
})

// ---------------------------------------------------------------------------
// Lollipop chart — stem line + dot per category.
// ---------------------------------------------------------------------------
const lollipopData = [72, 48, 91, 63, 34, 80]
const lollipop = makePage({
  id: 'lollipop', name: 'Lollipop chart',
  tagline: 'A thin stem with a dot at its tip — a decluttered bar chart that trades heavy ink for a precise point, ideal for ranked category comparisons.',
  tree: tree(
    [['│', 'Stems', 'value', 'dim', 'series-1'], ['●', 'LollipopChart', 'value', 'active', 'series-0']],
    [['▭', 'Tooltip', 1], ['≡', 'Legend']],
  ),
  shapes: [
    ...grid(),
    ...lollipopData.flatMap((v, i) => {
      const cx = X(i, lollipopData.length)
      const cy = Y(v, 100)
      return [
        sh(`M${cx.toFixed(1)} ${B}L${cx.toFixed(1)} ${cy.toFixed(1)}`, { stroke: 'var(--line-2)', sw: 2, role: 'series-1' }),
        sh(circ(cx, cy, 6), { fill: AC, role: i === 2 ? 'tooltip-anchor' : 'series-0' }),
      ]
    }),
  ],
  texts: yl(100, (v) => String(v)),
  xlabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  tip: {
    left: ((X(2, lollipopData.length) / W) * 100 - 2).toFixed(1) + '%',
    title: 'Wed',
    rows: [{ c: AC, l: 'Tickets', v: '91' }],
    fl: 'Rank', fv: '#1', fc: 'var(--fg)',
  },
  legend: [{ c: AC, l: 'Tickets closed' }],
  note: 'stem draw 420ms swift-out · dot pop 180ms spring',
  code: code([
    open('LollipopChart', [['data', '{rows}', false]]),
    selfc('LollipopChart', [['orientation', '"horizontal"']]),
    close('LollipopChart'),
  ]),
  variants: [['Horizontal', 'Categories down the left, stems run rightward (default).'], ['Vertical', 'Set orientation="vertical" for upright stems over an x-axis.']],
  motion: [
    ['ENTER', '--dur-420 · swift-out', 'Stems draw from the baseline, then dots pop into place.'],
    ['HOVER', '--dur-100 · linear', 'Hovered dot enlarges; tooltip pins to it.'],
    ['REDUCED', '--dur-120 · linear', 'Stems and dots crossfade in together.'],
  ],
  a11y: 'Mirrored to a sorted table of label/value pairs; focus moves dot-to-dot announcing the category and its value.',
  props: [
    ['data', 'LollipopChartDatum[]', '—', 'Rows of { label, value }.'],
    ['orientation', '"horizontal" | "vertical"', '"horizontal"', 'Stem direction.'],
    ['dotRadius', 'number', '5', 'Radius of the tip marker in px.'],
    ['width', 'number', '480', 'SVG width in px.'],
    ['height', 'number', '280', 'SVG height in px.'],
  ],
})

// ---------------------------------------------------------------------------
// Dumbbell chart — two dots joined by a connector showing change.
// ---------------------------------------------------------------------------
const dumbbellData = [[32, 58], [45, 71], [60, 54], [20, 66]]
const dumbbell = makePage({
  id: 'dumbbell', name: 'Dumbbell chart',
  tagline: 'Two dots per row linked by a bar, encoding a before/after pair. The connector length reads as the delta, making gains and shrinkage obvious at a glance.',
  tree: tree(
    [['●', 'StartDot', 'start', 'dim', 'series-0'], ['●', 'EndDot', 'end', 'active', 'series-1'], ['│', 'Connector', '', 'focus', 'series-2']],
    [['▭', 'Tooltip', 1], ['≡', 'Legend']],
  ),
  shapes: [
    ...grid(),
    ...dumbbellData.flatMap(([s, e], i) => {
      const n = dumbbellData.length
      const cy = T + 30 + (i * (B - T - 40)) / (n - 1)
      const xs = L + (s / 100) * (R - L)
      const xe = L + (e / 100) * (R - L)
      return [
        sh(`M${xs.toFixed(1)} ${cy.toFixed(1)}L${xe.toFixed(1)} ${cy.toFixed(1)}`, { stroke: 'var(--line-2)', sw: 4, role: 'series-2' }),
        sh(circ(xs, cy, 7), { fill: AC35, role: 'series-0' }),
        sh(circ(xe, cy, 7), { fill: AC, role: i === 1 ? 'tooltip-anchor' : 'series-1' }),
      ]
    }),
  ],
  texts: yl(100, (v) => (v ? v + '%' : '0')),
  xlabels: [],
  tip: {
    left: '62%',
    title: 'Team B',
    rows: [{ c: AC35, l: '2024', v: '45%' }, { c: AC, l: '2025', v: '71%' }],
    fl: 'Change', fv: '+26 pts', fc: OK,
  },
  legend: [{ c: AC35, l: 'Before' }, { c: AC, l: 'After' }],
  note: 'connector draw 440ms swift-out · dots pop 160ms',
  code: code([
    open('DumbbellChart', [['data', '{rows}', false]]),
    selfc('DumbbellChart', [['startLabel', '"2024"'], ['endLabel', '"2025"']]),
    close('DumbbellChart'),
  ]),
  variants: [['With delta', 'showDelta renders the signed change at the row end.'], ['Sorted', 'Order rows by end value or by magnitude of change.']],
  motion: [
    ['ENTER', '--dur-440 · swift-out', 'Connector draws start→end, then both dots pop.'],
    ['HOVER', '--dur-100 · linear', 'Row highlights; delta label gains contrast.'],
    ['REDUCED', '--dur-120 · linear', 'Dots and connectors crossfade in place.'],
  ],
  a11y: 'Each row exposes start, end and delta in the mirrored table; focus announces the label and its signed change.',
  props: [
    ['data', 'DumbbellChartDatum[]', '—', 'Rows of { label, start, end }.'],
    ['startLabel', 'string', '"Start"', 'Legend label for the start dot.'],
    ['endLabel', 'string', '"End"', 'Legend label for the end dot.'],
    ['showDelta', 'boolean', 'true', 'Render the signed change beside each row.'],
    ['dotRadius', 'number', '6', 'Radius of each endpoint dot in px.'],
  ],
})

// ---------------------------------------------------------------------------
// Slope chart — two axes joined by one line per series.
// ---------------------------------------------------------------------------
const slopeData = [[20, 68], [55, 40], [38, 52], [72, 30]]
const slope = makePage({
  id: 'slope', name: 'Slope chart',
  tagline: 'Two vertical axes connected by one line per category. Slope direction and crossings reveal rank changes between exactly two time points.',
  tree: tree(
    [['╱', 'SlopeChart', 'start', 'active', 'series-0'], ['●', 'Endpoints', 'end', 'dim', 'series-1']],
    [['▭', 'Tooltip', 1], ['│', 'AxisLabels']],
  ),
  shapes: [
    sh(`M${L} ${T}L${L} ${B}`, { stroke: 'var(--line)', sw: 1 }),
    sh(`M${R} ${T}L${R} ${B}`, { stroke: 'var(--line)', sw: 1 }),
    ...slopeData.flatMap(([s, e], i) => {
      const ys = Y(s, 100)
      const ye = Y(e, 100)
      const focus = i === 0
      return [
        sh(`M${L} ${ys.toFixed(1)}L${R} ${ye.toFixed(1)}`, { stroke: focus ? AC : mix(40), sw: focus ? 3 : 2, role: `series-${focus ? 0 : 1}` }),
        sh(circ(L, ys, 4), { fill: focus ? AC : mix(40), role: 'series-0' }),
        sh(circ(R, ye, 4), { fill: focus ? AC : mix(40), role: focus ? 'tooltip-anchor' : 'series-1' }),
      ]
    }),
  ],
  texts: [
    tx(L, T - 4, '2024', { a: 'middle', fill: N, size: 12, sans: true }),
    tx(R, T - 4, '2025', { a: 'middle', fill: N, size: 12, sans: true }),
  ],
  xlabels: [],
  tip: {
    left: '88%',
    title: 'Product A',
    rows: [{ c: AC, l: '2024', v: '20%' }, { c: AC, l: '2025', v: '68%' }],
    fl: 'Rank', fv: '4th → 1st', fc: OK,
  },
  legend: [{ c: AC, l: 'Product A' }, { c: mix(40), l: 'Others' }],
  note: 'line draw 500ms swift-out · endpoints fade 160ms',
  code: code([
    open('SlopeChart', [['data', '{rows}', false]]),
    selfc('SlopeChart', [['leftLabel', '"2024"'], ['rightLabel', '"2025"']]),
    close('SlopeChart'),
  ]),
  variants: [['Highlighted', 'Pass per-datum color to accent one series and dim the rest.'], ['Ranked', 'Sort endpoints to make crossing rank-swaps explicit.']],
  motion: [
    ['ENTER', '--dur-500 · swift-out', 'Each slope draws from the left axis to the right.'],
    ['HOVER', '--dur-100 · linear', 'Hovered line thickens; others dim.'],
    ['REDUCED', '--dur-120 · linear', 'Lines crossfade to their final positions.'],
  ],
  a11y: 'Mirrored table lists each series with its start and end value; focus announces the label and its rank change.',
  props: [
    ['data', 'SlopeChartDatum[]', '—', 'Rows of { label, start, end, color? }.'],
    ['leftLabel', 'string', '"Start"', 'Caption above the left axis.'],
    ['rightLabel', 'string', '"End"', 'Caption above the right axis.'],
    ['width', 'number', '480', 'SVG width in px.'],
    ['height', 'number', '280', 'SVG height in px.'],
  ],
})

// ---------------------------------------------------------------------------
// Radial bar chart — concentric arcs, one ring per category (polar).
// ---------------------------------------------------------------------------
const radialData = [82, 64, 45, 30]
const radialBar = makePage({
  id: 'radial-bar', name: 'Radial bar chart',
  tagline: 'Concentric arcs, one ring per category, swept proportional to value. A space-efficient, eye-catching alternative to a horizontal bar set.',
  tree: tree(
    [['◠', 'RadialBarChart', 'value', 'active', 'series-0'], ['◎', 'Track', '', 'dim', 'series-1']],
    [['▭', 'Tooltip', 1], ['≡', 'Legend']],
    false,
  ),
  shapes: [
    ...radialData.flatMap((v, i) => {
      const cx = W / 2
      const cy = (T + B) / 2
      const r = 84 - i * 19
      const a0 = -Math.PI / 2
      const full = Math.PI * 1.5
      const a1 = a0 + full * (v / 100)
      return [
        sh(arc(cx, cy, r, a0, a0 + full), { stroke: 'var(--line)', sw: 12, role: 'series-1' }),
        sh(arc(cx, cy, r, a0, a1), { stroke: i === 0 ? AC : mix(70 - i * 15), sw: 12, role: i === 0 ? 'tooltip-anchor' : 'series-0' }),
      ]
    }),
    sh(circ(W / 2, (T + B) / 2, 2), { fill: 'var(--fg-3)', op: 0.4 }),
  ],
  texts: [
    tx(W / 2, (T + B) / 2 - 2, '82%', { a: 'middle', fill: 'var(--fg)', size: 18, w: 600, sans: true }),
    tx(W / 2, (T + B) / 2 + 14, 'Q4 goal', { a: 'middle', fill: N, size: 11, sans: true }),
  ],
  xlabels: [],
  tipShow: true,
  tip: {
    left: '50%',
    title: 'Sales',
    rows: [{ c: AC, l: 'Attained', v: '82%' }],
    fl: 'Of goal', fv: '$1.64M', fc: 'var(--fg)',
  },
  legend: [{ c: AC, l: 'Sales' }, { c: mix(55), l: 'Marketing' }, { c: mix(40), l: 'Support' }, { c: mix(25), l: 'Ops' }],
  note: 'arc sweep 560ms swift-out · stagger 60ms per ring',
  code: code([
    open('RadialBarChart', [['data', '{rows}', false]]),
    selfc('RadialBarChart', [['max', '100', false], ['startAngle', '-90', false]]),
    close('RadialBarChart'),
  ]),
  variants: [['Gauge', 'A single ring with a partial sweep reads as a progress gauge.'], ['Custom sweep', 'Tune startAngle and sweep to fit half- or three-quarter rings.']],
  motion: [
    ['ENTER', '--dur-560 · swift-out', 'Each arc sweeps from the start angle, staggered outer→inner.'],
    ['HOVER', '--dur-100 · linear', 'Hovered ring brightens; its value label centers.'],
    ['REDUCED', '--dur-120 · linear', 'Arcs crossfade to their final sweep.'],
  ],
  a11y: 'Rings mirror to a table of label and percentage; focus steps ring-to-ring announcing each value against its max.',
  props: [
    ['data', 'RadialBarChartDatum[]', '—', 'Rows of { label, value, color? }.'],
    ['max', 'number', 'auto', 'Value mapped to a full sweep; defaults to the data max.'],
    ['size', 'number', '280', 'Square SVG edge in px.'],
    ['startAngle', 'number', '-90', 'Starting angle in degrees (-90 = 12 o\'clock).'],
    ['sweep', 'number', '270', 'Total arc sweep in degrees.'],
  ],
})

// ---------------------------------------------------------------------------
// Parallel coordinates — one vertical axis per dimension, polylines per row.
// ---------------------------------------------------------------------------
const pcAxes = [0, 1, 2, 3, 4]
const pcLines = [
  [0.8, 0.3, 0.6, 0.9, 0.5],
  [0.4, 0.7, 0.5, 0.3, 0.8],
  [0.6, 0.55, 0.9, 0.6, 0.35],
]
const parallelCoordinates = makePage({
  id: 'parallel-coordinates', name: 'Parallel coordinates',
  tagline: 'One vertical axis per dimension with a polyline per record threading across them. Reveals multivariate structure, clusters and correlations at once.',
  tree: tree(
    [['╱', 'ParallelCoordinatesChart', '', 'active', 'series-0'], ['│', 'Dimensions', '', 'dim', 'series-1']],
    [['▭', 'Tooltip', 1], ['≡', 'Legend']],
  ),
  shapes: [
    // vertical dimension axes
    ...pcAxes.map((i) =>
      sh(`M${X(i, pcAxes.length).toFixed(1)} ${T}L${X(i, pcAxes.length).toFixed(1)} ${B}`, { stroke: 'var(--line)', sw: 1, role: 'series-1' }),
    ),
    // record polylines
    ...pcLines.flatMap((row, ri) => {
      const d = row.map((v, i) => `${i === 0 ? 'M' : 'L'}${X(i, pcAxes.length).toFixed(1)} ${(T + (1 - v) * (B - T)).toFixed(1)}`).join('')
      const focus = ri === 0
      const segs: ReturnType<typeof sh>[] = [sh(d, { stroke: focus ? AC : mix(45), sw: focus ? 2.5 : 1.5, op: focus ? 1 : 0.7, role: `series-${focus ? 0 : 1}` })]
      if (focus) segs.push(sh(circ(X(0, pcAxes.length), T + (1 - row[0]) * (B - T), 3), { fill: AC, role: 'tooltip-anchor' }))
      return segs
    }),
  ],
  texts: [
    tx(X(0, 5), B + 14, 'Price', { a: 'middle', fill: N, size: 10, sans: true }),
    tx(X(1, 5), B + 14, 'MPG', { a: 'middle', fill: N, size: 10, sans: true }),
    tx(X(2, 5), B + 14, 'Power', { a: 'middle', fill: N, size: 10, sans: true }),
    tx(X(3, 5), B + 14, 'Weight', { a: 'middle', fill: N, size: 10, sans: true }),
    tx(X(4, 5), B + 14, 'Range', { a: 'middle', fill: N, size: 10, sans: true }),
  ],
  xlabels: [],
  tip: {
    left: ((X(0, 5) / W) * 100).toFixed(1) + '%',
    title: 'Model S',
    rows: [{ c: AC, l: 'Price', v: '$89k' }, { c: AC, l: 'Range', v: '405 mi' }],
    fl: 'Segment', fv: 'Premium', fc: WARN,
  },
  legend: [{ c: AC, l: 'Selected' }, { c: mix(45), l: 'Other rows' }],
  note: 'line draw 520ms swift-out · brush filter 120ms',
  code: code([
    open('ParallelCoordinatesChart', [['data', '{rows}', false], ['dimensions', '{dims}', false]]),
    selfc('ParallelCoordinatesChart', [['colorKey', '"segment"']]),
    close('ParallelCoordinatesChart'),
  ]),
  variants: [['Color by key', 'colorKey tints each polyline along the accent palette.'], ['Brushed', 'Drag on an axis to filter the records that stay highlighted.']],
  motion: [
    ['ENTER', '--dur-520 · swift-out', 'Polylines draw left→right across every axis.'],
    ['HOVER', '--dur-100 · linear', 'Hovered record pops forward; the rest dim.'],
    ['REDUCED', '--dur-120 · linear', 'Lines crossfade to their final paths.'],
  ],
  a11y: 'Each record mirrors to a table row spanning every dimension; focus reads the record label and its value per axis.',
  props: [
    ['dimensions', 'ParallelDimension[]', '—', 'Axes as { key, label, min?, max? }.'],
    ['data', 'Record<string, number>[]', '—', 'One object per record keyed by dimension.'],
    ['colorKey', 'string', '—', 'Dimension key used to tint each polyline.'],
    ['width', 'number', '480', 'SVG width in px.'],
    ['height', 'number', '280', 'SVG height in px.'],
  ],
})

export const COMPARISON_PAGES: Record<string, ChartPage> = { bullet, lollipop, dumbbell, slope, 'radial-bar': radialBar, 'parallel-coordinates': parallelCoordinates }
