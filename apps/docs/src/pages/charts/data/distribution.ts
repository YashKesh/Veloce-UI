import {
  makePage, tree, grid, sh, tx, yl, circ, rect,
  code, open, selfc, close,
  AC, AC60, AC35, N, mix,
  Y, f, L, R, T, B, W,
  type ChartPage,
} from '../chartsData'

// ── Histogram ───────────────────────────────────────────────────────────────
// Demo: API response-time distribution (ms) bucketed into bins.
const HBINS = [3, 9, 18, 27, 22, 14, 7, 4]
const hMax = Math.max(...HBINS)
const hN = HBINS.length
const hStep = (R - L) / hN
const histogram = makePage({
  id: 'histogram', name: 'Histogram',
  tagline: 'Counts per bin of a continuous variable. Equal-width bars share a 1px gap so adjacent buckets stay readable; the y-axis counts occurrences, the x-axis spans the value range.',
  tree: tree(
    [['▮', 'HistogramSeries', 'values', 'active', 'series-0']],
    [['▭', 'Tooltip', 1]],
  ),
  shapes: [
    ...grid(),
    ...HBINS.map((c, i) => {
      const bx = L + i * hStep
      const by = Y(c, hMax)
      return sh(rect(bx + 0.5, by, hStep - 1, B - by), { fill: AC, stroke: 'var(--bg-1)', sw: 1, role: 'series-0' })
    }),
  ],
  texts: yl(hMax, (v) => String(Math.round(v))),
  xlabels: ['0', '50', '100', '150', '200', '250', '300', '350', '400'],
  tip: {
    left: f((L + 3 * hStep) / W * 100) + '%',
    title: '[150,200) ms',
    rows: [{ c: AC, l: 'Count', v: '27 requests' }],
    fl: 'Share', fv: '31%', fc: 'var(--fg)',
  },
  legend: [{ c: AC, l: 'Response time (ms)' }],
  note: 'bars rise 500ms swift-out · staggered 20ms',
  code: code([
    open('HistogramChart', [['values', '{latencies}', false], ['bins', '8', false]]),
    close('HistogramChart'),
  ]),
  variants: [
    ['Bin count', 'bins sets the number of equal-width buckets (default 10).'],
    ['Density', 'Normalise counts to a probability so bars sum to 1.'],
    ['Cumulative', 'Each bar adds the running total — an empirical CDF staircase.'],
  ],
  motion: [
    ['ENTER', '--dur-500 · swift-out', 'bars grow from the baseline; height tween staggered 20ms per bin'],
    ['HOVER', '--dur-100 · linear', 'hovered bar lifts to full accent; siblings dim to 35%'],
    ['REDUCED', '--dur-120 · linear', 'bars crossfade to final height without the grow'],
  ],
  a11y: 'The binned table is mirrored: each row announces the interval and its count, e.g. "150 to 200 milliseconds, 27 requests".',
  props: [
    ['values', 'number[]', '—', 'Raw observations; binning is computed internally.'],
    ['bins', 'number', '10', 'Number of equal-width buckets across the range.'],
    ['showGrid', 'boolean', 'true', 'Dashed horizontal count gridlines.'],
  ],
})

// ── Box plot ──────────────────────────────────────────────────────────────────
// Demo: exam scores across three cohorts. Per group: whisker line, box rect, median.
const boxGroups = [
  { c: 52, q1: 44, q3: 61, lo: 30, hi: 78, med: 54 },
  { c: 50, q1: 46, q3: 68, lo: 34, hi: 86, med: 58 },
  { c: 48, q1: 40, q3: 56, lo: 26, hi: 72, med: 47 },
]
const bMax = 100
const bN = boxGroups.length
const bSlot = (R - L) / bN
const bHalf = 24
const boxPlot = makePage({
  id: 'box-plot', name: 'Box plot',
  tagline: 'Five-number summary per group: a box from Q1 to Q3, a median line inside, whiskers to 1.5×IQR and dots for outliers. Compact spread comparison across categories.',
  tree: tree(
    [['◫', 'BoxPlotGroup', 'values', 'active', 'series-0']],
    [['▭', 'Tooltip', 1]],
  ),
  shapes: [
    ...grid(),
    ...boxGroups.flatMap((g, i) => {
      const cx = L + bSlot * (i + 0.5)
      const yQ1 = Y(g.q1, bMax), yQ3 = Y(g.q3, bMax)
      const yLo = Y(g.lo, bMax), yHi = Y(g.hi, bMax), yMed = Y(g.med, bMax)
      return [
        sh(`M${f(cx)} ${f(yHi)}V${f(yQ3)}`, { stroke: N, sw: 1, role: 'series-0' }),
        sh(`M${f(cx)} ${f(yQ1)}V${f(yLo)}`, { stroke: N, sw: 1, role: 'series-0' }),
        sh(`M${f(cx - 8)} ${f(yHi)}H${f(cx + 8)}`, { stroke: N, sw: 1, role: 'series-0' }),
        sh(`M${f(cx - 8)} ${f(yLo)}H${f(cx + 8)}`, { stroke: N, sw: 1, role: 'series-0' }),
        sh(rect(cx - bHalf, yQ3, bHalf * 2, yQ1 - yQ3), { fill: AC35, stroke: AC, sw: 1, role: 'series-0' }),
        sh(`M${f(cx - bHalf)} ${f(yMed)}H${f(cx + bHalf)}`, { stroke: AC, sw: 2, role: 'series-0' }),
      ]
    }),
  ],
  texts: yl(bMax, (v) => String(Math.round(v))),
  xlabels: ['Cohort A', 'Cohort B', 'Cohort C'],
  tip: {
    left: f((L + bSlot * 1.5) / W * 100 - 6) + '%',
    title: 'Cohort B',
    rows: [
      { c: AC, l: 'Median', v: '58' },
      { c: AC35, l: 'Q1 – Q3', v: '46 – 68' },
      { c: N, l: 'Range', v: '34 – 86' },
    ],
    fl: 'IQR', fv: '22', fc: 'var(--fg)',
  },
  legend: [{ c: AC, l: 'Exam score' }],
  note: 'boxes expand from median 500ms swift-out',
  code: code([
    open('BoxPlotChart', [['data', '{cohorts}', false], ['orientation', '"vertical"']]),
    close('BoxPlotChart'),
  ]),
  variants: [
    ['Vertical', 'Default — value axis runs vertically, groups across x.'],
    ['Horizontal', 'orientation="horizontal" rotates boxes for long labels.'],
    ['Outliers', 'Points beyond 1.5×IQR render as err-tinted dots past the whiskers.'],
  ],
  motion: [
    ['ENTER', '--dur-500 · swift-out', 'box scales vertically from the median line; whiskers draw outward'],
    ['HOVER', '--dur-100 · linear', 'hovered group raises stroke contrast; others soften'],
    ['REDUCED', '--dur-120 · linear', 'final geometry crossfades in without scaling'],
  ],
  a11y: 'Each group is a table row announcing min, Q1, median, Q3 and max, e.g. "Cohort B, median 58, interquartile 46 to 68".',
  props: [
    ['data', 'BoxPlotGroup[]', '—', '{ label, values } per group; quartiles computed internally.'],
    ['orientation', '"vertical" | "horizontal"', '"vertical"', 'Axis along which boxes are laid out.'],
    ['showGrid', 'boolean', 'true', 'Dashed value gridlines behind the boxes.'],
  ],
})

// ── Violin ────────────────────────────────────────────────────────────────────
// Demo: two sensor latency distributions as mirrored KDE silhouettes.
const vMax = 100
const vN = 2
const vSlot = (R - L) / vN
const vHalf = 30
// hand-shaped density samples (value, density 0..1), bottom→top
const vDensity = [0.08, 0.22, 0.55, 0.9, 1, 0.78, 0.4, 0.18, 0.06]
const violinSil = (cx: number) => {
  const nS = vDensity.length
  const right = vDensity.map((d, i) => {
    const v = (i / (nS - 1)) * vMax
    return `${f(cx + d * vHalf)} ${f(Y(v, vMax))}`
  })
  const left = [...vDensity].reverse().map((d, i) => {
    const v = ((nS - 1 - i) / (nS - 1)) * vMax
    return `${f(cx - d * vHalf)} ${f(Y(v, vMax))}`
  })
  return `M${right.join(' L ')} L ${left.join(' L ')} Z`
}
const violin = makePage({
  id: 'violin', name: 'Violin plot',
  tagline: 'Kernel-density silhouette mirrored about a center line — a smooth stand-in for the box plot. Width encodes probability density so multimodal shapes stay visible.',
  tree: tree(
    [['┃', 'ViolinGroup', 'values', 'active', 'series-0']],
    [['▭', 'Tooltip', 1]],
  ),
  shapes: [
    ...grid(),
    ...[0, 1].flatMap((i) => {
      const cx = L + vSlot * (i + 0.5)
      return [
        sh(violinSil(cx), { fill: mix(22), stroke: AC, sw: 1.5, role: 'series-0' }),
        sh(circ(cx, Y(52, vMax), 3), { fill: AC, role: 'series-0' }),
      ]
    }),
  ],
  texts: yl(vMax, (v) => String(Math.round(v))),
  xlabels: ['Sensor A', 'Sensor B'],
  tip: {
    left: f((L + vSlot * 0.5) / W * 100 - 4) + '%',
    title: 'Sensor A',
    rows: [
      { c: AC, l: 'Median', v: '52 ms' },
      { c: mix(22), l: 'Peak density', v: '48 ms' },
    ],
    fl: 'Samples', fv: '1,204', fc: 'var(--fg)',
  },
  legend: [{ c: AC, l: 'Latency (ms)' }],
  note: 'silhouette unfurls from the median 500ms swift-out',
  code: code([
    open('ViolinChart', [['data', '{sensors}', false]]),
    selfc('Tooltip', []),
    close('ViolinChart'),
  ]),
  variants: [
    ['Density', 'Width is a Gaussian KDE; bandwidth follows Silverman’s rule.'],
    ['With box', 'Overlay a slim box plot inside the silhouette for the quartiles.'],
    ['Split', 'Draw two half-violins back-to-back to compare paired groups.'],
  ],
  motion: [
    ['ENTER', '--dur-500 · swift-out', 'silhouette scales horizontally from the center axis'],
    ['HOVER', '--dur-100 · linear', 'hovered violin gains stroke weight; others dim to 35%'],
    ['REDUCED', '--dur-120 · linear', 'final silhouette crossfades without the widen'],
  ],
  a11y: 'Each group announces its median and modal value; the full density is summarised, e.g. "Sensor A, median 52 milliseconds, peak near 48".',
  props: [
    ['data', 'ViolinGroup[]', '—', '{ label, values } per group; KDE sampled at 32 points.'],
    ['showGrid', 'boolean', 'true', 'Dashed value gridlines behind the silhouettes.'],
  ],
})

// ── Ridgeline ───────────────────────────────────────────────────────────────
// Demo: monthly temperature distributions stacked with vertical offset.
const rowLabels = ['Jan', 'Mar', 'May', 'Jul']
const rN = rowLabels.length
const rGap = (B - T) / rN
const rAmp = rGap * 1.7
const rDensity = [0.05, 0.14, 0.4, 0.82, 1, 0.9, 0.5, 0.2, 0.07]
const ridge = (baseY: number, shift: number) => {
  const nS = rDensity.length
  const pts = rDensity.map((d, i) => {
    const x = L + ((i + shift) / (nS - 1 + shift)) * (R - L)
    return `${f(Math.min(R, x))} ${f(baseY - d * rAmp)}`
  })
  return `M${f(L)} ${f(baseY)} L ${pts.join(' L ')} L ${f(R)} ${f(baseY)} Z`
}
const ridgeline = makePage({
  id: 'ridgeline', name: 'Ridgeline',
  tagline: 'Overlapping density curves offset down the page — a "joyplot". Shared x-axis lets you track how a distribution shifts across many groups without a dense heatmap.',
  tree: tree(
    [['∿', 'RidgeSeries', 'values', 'active', 'series-0']],
    [['▭', 'Tooltip', 1]],
  ),
  shapes: [
    ...grid(),
    ...rowLabels.map((_, i) => {
      const baseY = T + rGap * (i + 1)
      return sh(ridge(baseY, i * 1.4), { fill: mix(30), op: 0.75, stroke: AC, sw: 1.25, role: 'series-0' })
    }),
  ],
  texts: rowLabels.map((lbl, i) => tx(24, T + rGap * (i + 1) + 3, lbl, { a: 'end', role: 'yaxis' })),
  xlabels: ['-10', '0', '10', '20', '30', '40'],
  tip: {
    left: '54.0%',
    title: 'Jul',
    rows: [
      { c: AC, l: 'Mode', v: '28 °C' },
      { c: mix(30), l: 'Spread', v: '±6 °C' },
    ],
    fl: 'Readings', fv: '31', fc: 'var(--fg)',
  },
  legend: [{ c: AC, l: 'Daily high (°C)' }],
  note: 'ridges draw top-down 600ms swift-out',
  code: code([
    open('RidgelineChart', [['data', '{months}', false]]),
    selfc('Tooltip', []),
    close('RidgelineChart'),
  ]),
  variants: [
    ['Overlap', 'Row amplitude exceeds row gap so ridges overlap for density.'],
    ['Gradient', 'Fill each ridge by its mode to encode a second dimension.'],
    ['Stroke-only', 'Drop the fill for a faint contour-line variant.'],
  ],
  motion: [
    ['ENTER', '--dur-500 · swift-out', 'each ridge path draws left-to-right, staggered top to bottom'],
    ['HOVER', '--dur-100 · linear', 'hovered ridge raises to full opacity above its neighbours'],
    ['REDUCED', '--dur-120 · linear', 'all ridges crossfade in together'],
  ],
  a11y: 'Each ridge is a labelled row announcing its modal value and spread, e.g. "July, mode 28 degrees, spread plus or minus 6".',
  props: [
    ['data', 'RidgeSeries[]', '—', '{ label, values } per row, drawn bottom to top.'],
    ['showGrid', 'boolean', 'true', 'Dashed vertical gridlines on the shared x-axis.'],
  ],
})

// ── Beeswarm ──────────────────────────────────────────────────────────────────
// Demo: individual bug-fix times (hours) jittered around one lane.
const beeVals = [4, 6, 6, 8, 9, 9, 10, 10, 11, 12, 12, 13, 14, 16, 18, 22, 28, 34, 40]
const beeMax = 48
const beeCy = (T + B) / 2
// deterministic jitter offsets so dots fan out vertically
const beeOffsets = [0, 7, -7, 0, 7, -7, 14, 0, -7, 7, -14, 0, 7, -7, 0, 7, 0, -7, 0]
const beeswarm = makePage({
  id: 'beeswarm', name: 'Beeswarm',
  tagline: 'Every observation as a dot, packed with vertical jitter so none overlap. Shows the raw shape of a distribution — gaps, clusters and outliers — not just its summary.',
  tree: tree(
    [['●', 'BeeswarmDatum', 'value', 'active', 'series-0']],
    [['▭', 'Tooltip', 1]],
  ),
  shapes: [
    ...grid(),
    ...beeVals.map((v, i) =>
      sh(circ(L + (v / beeMax) * (R - L), beeCy + beeOffsets[i], 4), { fill: AC, op: 0.8, role: 'series-0' }),
    ),
  ],
  texts: yl(beeMax, (v) => String(Math.round(v))),
  xlabels: ['0', '8', '16', '24', '32', '40', '48'],
  tip: {
    left: f((L + (34 / beeMax) * (R - L)) / W * 100 - 4) + '%',
    title: 'PR #482',
    rows: [{ c: AC, l: 'Fix time', v: '34 h' }],
    fl: 'Percentile', fv: '94th', fc: 'var(--fg)',
  },
  legend: [{ c: AC, l: 'Fix time (hours)' }],
  note: 'dots settle into packing 500ms swift-out',
  code: code([
    open('BeeswarmChart', [['data', '{fixes}', false], ['dotRadius', '3.5', false]]),
    close('BeeswarmChart'),
  ]),
  variants: [
    ['Single lane', 'One category — pure 1-D distribution of the value.'],
    ['Grouped', 'Set group on each datum to split into stacked lanes.'],
    ['Sized dots', 'Map a second field to dotRadius for an encoded third axis.'],
  ],
  motion: [
    ['ENTER', '--dur-500 · swift-out', 'dots animate from the axis to their packed vertical slots'],
    ['HOVER', '--dur-100 · linear', 'hovered dot grows and raises; the rest fade to 35%'],
    ['REDUCED', '--dur-120 · linear', 'dots crossfade into final positions'],
  ],
  a11y: 'Points are summarised as a sorted list with min, median, max and any flagged outliers announced, e.g. "19 values, median 11 hours, max 40".',
  props: [
    ['data', 'BeeswarmDatum[]', '—', '{ value, label?, group? } per point; packing avoids overlap.'],
    ['dotRadius', 'number', '3.5', 'Circle radius; also sets the collision diameter.'],
    ['showGrid', 'boolean', 'true', 'Dashed vertical gridlines on the value axis.'],
  ],
})

// ── Population pyramid ────────────────────────────────────────────────────────
// Demo: age bands, male (left) vs female (right), back-to-back bars about a center.
const pyramid = [
  { g: '0–9', l: 62, r: 59 },
  { g: '10–19', l: 71, r: 68 },
  { g: '20–29', l: 84, r: 80 },
  { g: '30–39', l: 76, r: 79 },
  { g: '40–49', l: 58, r: 63 },
  { g: '50+', l: 41, r: 52 },
]
const pMax = 100
const pCenter = (L + R) / 2
const pGap = 44
const pLeftEdge = pCenter - pGap / 2
const pRightEdge = pCenter + pGap / 2
const pSide = (R - L - pGap) / 2
const pN = pyramid.length
const pRowH = (B - T) / pN
const pBarH = Math.min(pRowH * 0.7, 18)
const populationPyramid = makePage({
  id: 'population-pyramid', name: 'Population pyramid',
  tagline: 'Two horizontal bar charts mirrored about a shared center axis — classic for age-by-sex demographics. Opposing bars make left-vs-right asymmetry pop at a glance.',
  tree: tree(
    [['▭', 'PyramidDatum', 'left/right', 'active', 'series-0']],
    [['▭', 'Tooltip', 1]],
  ),
  shapes: [
    ...grid(),
    ...pyramid.flatMap((d, i) => {
      const cy = T + pRowH * (i + 0.5)
      const by = cy - pBarH / 2
      const lw = (d.l / pMax) * pSide
      const rw = (d.r / pMax) * pSide
      return [
        sh(rect(pLeftEdge - lw, by, lw, pBarH), { fill: AC60, role: 'series-0' }),
        sh(rect(pRightEdge, by, rw, pBarH), { fill: AC, role: 'series-0' }),
      ]
    }),
  ],
  texts: pyramid.map((d, i) =>
    tx(pCenter, T + pRowH * (i + 0.5) + 3, d.g, { a: 'middle', fill: 'var(--fg)', role: 'yaxis' }),
  ),
  xlabels: [],
  tipShow: true,
  tip: {
    left: '62.0%',
    title: 'Age 20–29',
    rows: [
      { c: AC60, l: 'Male', v: '84k' },
      { c: AC, l: 'Female', v: '80k' },
    ],
    fl: 'Total', fv: '164k', fc: 'var(--fg)',
  },
  legend: [{ c: AC60, l: 'Male' }, { c: AC, l: 'Female' }],
  note: 'bars grow outward from the center 500ms swift-out',
  code: code([
    open('PopulationPyramidChart', [['data', '{ages}', false], ['leftLabel', '"Male"'], ['rightLabel', '"Female"']]),
    close('PopulationPyramidChart'),
  ]),
  variants: [
    ['Counts', 'Bars encode absolute population per band (default).'],
    ['Percent', 'Normalise each side to its total so shapes compare across regions.'],
    ['Overlaid', 'Draw a second cohort as an outline to show change over time.'],
  ],
  motion: [
    ['ENTER', '--dur-500 · swift-out', 'left and right bars extend outward from the center gap'],
    ['HOVER', '--dur-100 · linear', 'hovered band highlights both sides; others dim to 35%'],
    ['REDUCED', '--dur-120 · linear', 'bars crossfade to final width without the extend'],
  ],
  a11y: 'Each age band is a row announcing both sides and the total, e.g. "Age 20 to 29, male 84 thousand, female 80 thousand, total 164 thousand".',
  props: [
    ['data', 'PyramidDatum[]', '—', '{ group, left, right } per band, drawn top to bottom.'],
    ['leftLabel', 'string', '"Left"', 'Header for the left (mirrored) side.'],
    ['rightLabel', 'string', '"Right"', 'Header for the right side.'],
  ],
})

export const DISTRIBUTION_PAGES: Record<string, ChartPage> = {
  histogram,
  'box-plot': boxPlot,
  violin,
  ridgeline,
  beeswarm,
  'population-pyramid': populationPyramid,
}
