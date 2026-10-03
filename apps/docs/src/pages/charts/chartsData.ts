// Ported from design artifact `charts-data.js`.
// HTML entities decoded (&lt; → <, &gt; → >, &amp; → &).

export interface TreeRow {
  id: string
  pad: number
  chev: string
  icon: string
  label: string
  meta?: string
  iconColor?: string
  bg?: string
  color?: string
  weight?: number
  shadow?: string
  parent?: string
  role?: string
}

export interface Shape {
  d: string
  fill: string
  stroke: string
  sw: number
  dash: string
  op: number
  lj: string
  lc: string
  role?: string
}

export interface TextNode {
  x: number
  y: number
  t: string
  anchor: 'start' | 'middle' | 'end'
  fill: string
  size: number
  weight: number
  font: string
  role?: string
}

export interface TipRow {
  c: string
  l: string
  v: string
}

export interface Tip {
  left: string
  title: string
  rows: TipRow[]
  fl: string
  fv: string
  fc: string
}

export interface LegendItem {
  c: string
  l: string
}

export interface CodeSeg {
  t: string
  color: string
}

export interface CodeLine {
  segs: CodeSeg[]
}

export interface PropRow {
  name: string
  type: string
  def: string
  desc: string
}

export interface ChartPage {
  id: string
  name: string
  tagline: string
  tree: TreeRow[]
  shapes: Shape[]
  texts: TextNode[]
  tipShow: boolean
  tip: Tip
  xlabels: string[]
  legend: LegendItem[]
  note: string
  code: CodeLine[]
  variants: [string, string][]
  motion: [string, string, string][]
  a11y: string
  props: PropRow[]
  badges: string[]
  outline: string[]
  swatches?: { c: string; y: number }[]
}

// ── Helpers (mirror design script) ─────────────────────────────────────────
const W = 600, L = 30, R = 570, T = 16, B = 200
const X = (i: number, n: number) => L + (i * (R - L)) / (n - 1)
const Y = (v: number, mx: number) => B - (v / mx) * (B - T)
const f = (n: number) => (+n).toFixed(1)

const sh = (d: string, o: Partial<Shape> = {}): Shape => ({
  d, fill: o.fill || 'none', stroke: o.stroke || 'none', sw: o.sw ?? 0,
  dash: o.dash || '', op: o.op ?? 1, lj: 'round', lc: o.lc || 'butt',
  role: o.role,
})

/** Stamp a role onto any shapes that don't already have one. */
const tag = (shapes: Shape[], role: string): Shape[] =>
  shapes.map((s) => (s.role ? s : { ...s, role }))

interface TxOpt { a?: 'start' | 'middle' | 'end'; fill?: string; size?: number; w?: number; sans?: boolean; role?: string }
const tx = (x: number, y: number, t: string, o: TxOpt = {}): TextNode => ({
  x, y, t, anchor: o.a || 'start', fill: o.fill || 'var(--fg-3)',
  size: o.size || 10, weight: o.w || 400,
  font: o.sans ? 'Geist, sans-serif' : 'Geist Mono, monospace',
  role: o.role,
})

const line = (arr: number[], mx: number) =>
  arr.map((v, i) => `${i ? 'L' : 'M'}${f(X(i, arr.length))} ${f(Y(v, mx))}`).join(' ')

const circ = (cx: number, cy: number, r: number) =>
  `M${f(cx - r)} ${f(cy)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`

const rect = (x: number, y: number, w: number, h: number) =>
  `M${f(x)} ${f(y)}h${f(w)}v${f(h)}h${f(-w)}z`

const grid = (n = 4): Shape[] =>
  Array.from({ length: n + 1 }, (_, i) =>
    sh(`M${L} ${f(T + (i * (B - T)) / n)}H${R}`, {
      stroke: i === n ? 'var(--line-2)' : 'var(--line)', sw: 1,
      dash: i === n ? '' : '2 4',
      role: 'grid',
    }),
  )

const yl = (mx: number, fmt: (v: number) => string, n = 4): TextNode[] =>
  Array.from({ length: n + 1 }, (_, i) => tx(576, T + (i * (B - T)) / n + 3, fmt(mx - (i * mx) / n), { role: 'yaxis' }))

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const pol = (cx: number, cy: number, r: number, a: number): [number, number] =>
  [cx + r * Math.cos(a), cy + r * Math.sin(a)]

const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const [x0, y0] = pol(cx, cy, r, a0), [x1, y1] = pol(cx, cy, r, a1)
  return `M${f(x0)} ${f(y0)}A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${f(x1)} ${f(y1)}`
}

const AC = 'var(--ac)'
const AC60 = 'color-mix(in oklch,var(--ac) 60%,var(--bg-3))'
const AC35 = 'color-mix(in oklch,var(--ac) 35%,var(--bg-3))'
const N = 'var(--fg-3)'
const OK = 'var(--ok)'
const ERR = 'var(--err)'
const WARN = 'var(--warn)'
const mix = (p: number) => `color-mix(in oklch,var(--ac) ${p}%,var(--bg-3))`

type StateKey = '' | 'dim' | 'active' | 'focus'
const ST: Record<StateKey, { bg: string; color: string; weight: number; shadow: string }> = {
  '': { bg: 'transparent', color: 'var(--fg-2)', weight: 400, shadow: 'none' },
  dim: { bg: 'transparent', color: 'var(--fg)', weight: 400, shadow: 'none' },
  active: { bg: 'var(--ac-soft)', color: 'var(--ac-text)', weight: 500, shadow: 'none' },
  focus: { bg: 'transparent', color: 'var(--fg-2)', weight: 400, shadow: '0 0 0 2px var(--bg-1),0 0 0 4px var(--ac)' },
}

const slug = (s: string): string =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const ti = (
  depth: number, chev: string, icon: string, label: string,
  meta = '', state: StateKey = '', iconColor?: string,
  id?: string, parent?: string, role?: string,
): TreeRow => ({
  id: id || slug(label) || `node-${Math.random().toString(36).slice(2, 7)}`,
  pad: 8 + depth * 23, chev, icon, label, meta,
  iconColor: iconColor || (state === 'active' ? 'var(--ac-text)' : 'var(--fg-3)'),
  parent, role,
  ...ST[state],
})

// [icon, label, dataKey/meta, state, roleOverride]
type SeriesEntry = [string, string, string?, StateKey?, string?]
type ExtraEntry = [string, string, number?]

/** map extras label → id + role */
const extraMeta = (label: string): { id: string; role: string } => {
  const l = label.toLowerCase()
  if (l.includes('tooltip')) return { id: 'tooltip', role: 'tooltip-anchor' }
  if (l.includes('crosshair')) return { id: 'crosshair', role: 'tooltip-anchor' }
  if (l.includes('legend')) return { id: 'legend', role: '' }
  return { id: slug(label), role: 'reference' }
}

const tree = (series: SeriesEntry[], extras: ExtraEntry[] = [], axes = true): TreeRow[] => {
  const rows: TreeRow[] = [ti(0, '⌄', '▣', 'ChartContainer', '', 'dim', undefined, 'chart')]
  if (axes) {
    rows.push(
      ti(1, '⌄', '╪', 'Axes', '', 'dim', undefined, 'axes', 'chart', 'axes'),
      ti(2, '', '—', 'XAxis', 'band', '', undefined, 'xaxis', 'axes', 'xaxis'),
      ti(2, '', '|', 'YAxis', 'linear', '', undefined, 'yaxis', 'axes', 'yaxis'),
      ti(2, '', '⋯', 'GridLines', '', '', undefined, 'grid', 'axes', 'grid'),
    )
  } else {
    rows.push(ti(1, '⌄', '◎', 'PolarLayout', '', 'dim', undefined, 'polar', 'chart'))
  }
  rows.push(ti(1, '⌄', '∿', 'Series', '', 'active', undefined, 'series', 'chart', 'series'))
  series.forEach((s, i) => {
    const role = s[4] || (i === 1 ? 'series2' : (s[1].toLowerCase().includes('marker') ? 'markers' : 'series'))
    // Fold the dataKey (s[2]) into the label so sibling rows read as "AreaSeries · revenue" /
    // "AreaSeries · costs" instead of two rows both labelled "AreaSeries".
    const label = s[2] ? `${s[1]} · ${s[2]}` : s[1]
    rows.push(ti(2, '', s[0], label, '', (s[3] || '') as StateKey, undefined, `series-${i}`, 'series', role))
  })
  extras.forEach((e) => {
    const m = extraMeta(e[1])
    rows.push(ti(1, e[2] ? '›' : '', e[0], e[1], '', 'dim', undefined, m.id, 'chart', m.role))
  })
  return rows
}

// Code builder
type SegColorKey = 'tag' | 'attr' | 'str' | 'dim' | 'val'
const CODE: Record<SegColorKey, string> = {
  tag: 'var(--fg)', attr: 'var(--fg-3)', str: 'var(--ac-text)',
  dim: 'var(--fg-3)', val: 'var(--fg-2)',
}
type Seg = [SegColorKey, string]
const code = (lines: Seg[][]): CodeLine[] =>
  lines.map((segs) => ({ segs: segs.map(([c, t]) => ({ t, color: CODE[c] })) }))

type Attr = [string, string, boolean?]
const open = (name: string, attrs: Attr[] = []): Seg[] => [
  ['dim', '<'], ['tag', name],
  ...attrs.flatMap(([k, v, s]): Seg[] => [['attr', ` ${k}=`], [s === false ? 'val' : 'str', v]]),
  ['dim', '>'],
]
const selfc = (name: string, attrs: Attr[] = [], ind = '  '): Seg[] => [
  ['dim', `${ind}<`], ['tag', name],
  ...attrs.flatMap(([k, v, s]): Seg[] => [['attr', ` ${k}=`], [s === false ? 'val' : 'str', v]]),
  ['dim', ' />'],
]
const close = (name: string): Seg[] => [['dim', '</'], ['tag', name], ['dim', '>']]

const baseProps: [string, string, string, string][] = [
  ['data', 'T[]', '—', 'Row objects. Keys are referenced by dataKey.'],
  ['motion', '"draw" | "rise" | "none"', '"draw"', 'Enter choreography. Reduced motion → 120ms crossfade.'],
  ['color', 'Token | string', '"accent"', 'Series color; palette steps derive from it.'],
]
const prop = (n: string, t: string, d: string, desc: string): PropRow => ({ name: n, type: t, def: d, desc })

interface PageInput {
  id: string
  name: string
  tagline: string
  tree: TreeRow[]
  shapes: Shape[]
  texts: TextNode[]
  xlabels: string[]
  tipShow?: boolean
  tip: Tip
  legend: LegendItem[]
  note: string
  code: CodeLine[]
  variants: [string, string][]
  motion: [string, string, string][]
  a11y: string
  props: [string, string, string, string][]
  swatches?: { c: string; y: number }[]
}

const page = (o: PageInput): ChartPage => ({
  badges: ['a11y ✓', 'SVG · 0 kB runtime'],
  outline: ['Anatomy', 'Composition', 'Variants', 'Tooltip & hover', 'Motion', 'Accessibility', 'API'],
  xlabels: o.xlabels.length ? o.xlabels : MONTHS,
  tipShow: o.tipShow !== false,
  tip: o.tip,
  id: o.id,
  name: o.name,
  tagline: o.tagline,
  tree: o.tree,
  shapes: o.shapes,
  texts: o.texts,
  legend: o.legend,
  note: o.note,
  code: o.code,
  variants: o.variants,
  motion: o.motion,
  a11y: o.a11y,
  props: [...o.props.map((p) => prop(...p)), ...baseProps.map((p) => prop(...p))],
  swatches: o.swatches,
})

// Override: xlabels default when empty should stay empty (pie/radar/funnel/treemap/gauge/sparkline).
// Rework page() to be explicit:
const makePage = (o: PageInput): ChartPage => ({
  badges: ['a11y ✓', 'SVG · 0 kB runtime'],
  outline: ['Anatomy', 'Composition', 'Variants', 'Tooltip & hover', 'Motion', 'Accessibility', 'API'],
  xlabels: o.xlabels,
  tipShow: o.tipShow !== false,
  tip: o.tip,
  id: o.id,
  name: o.name,
  tagline: o.tagline,
  tree: o.tree,
  shapes: o.shapes,
  texts: o.texts,
  legend: o.legend,
  note: o.note,
  code: o.code,
  variants: o.variants,
  motion: o.motion,
  a11y: o.a11y,
  props: [...o.props.map((p) => prop(...p)), ...baseProps.map((p) => prop(...p))],
  swatches: o.swatches,
})
void page // placeholder, use makePage

// ── Area ────────────────────────────────────────────────────────────────────
const A1 = [42, 48, 45, 61, 58, 72, 69, 84, 91, 88, 104, 112]
const A2 = [30, 34, 38, 36, 44, 47, 52, 50, 58, 63, 61, 70]
const topA = A1.map((v, i) => v + A2[i])
const band = (hi2: number[], lo: number[], mx: number) =>
  hi2.map((v, i) => `${i ? 'L' : 'M'}${f(X(i, 12))} ${f(Y(v, mx))}`).join(' ') +
  [...lo].reverse().map((v, i) => `L${f(X(11 - i, 12))} ${f(Y(v, mx))}`).join('') +
  'Z'
const hi = 8
const area = makePage({
  id: 'area', name: 'Area chart',
  tagline: 'Stacked, percent or overlapping fills under a line. Gradient fades to the baseline so stacked bands stay legible; the top edge keeps a crisp 2px stroke.',
  tree: tree(
    [['◢', 'AreaSeries', 'revenue', 'active', 'series-0'], ['◢', 'AreaSeries', 'costs', 'focus', 'series-1'], ['●', 'Markers', '', '', 'series-2']],
    [['▭', 'Tooltip', 1], ['┼', 'Crosshair', 1], ['≡', 'Legend']],
  ),
  shapes: [
    ...grid(),
    sh(band(topA, A1, 200), { fill: AC, op: 0.28, role: 'series-1' }),
    sh(line(A1, 200) + `L${R} ${B}L${L} ${B}Z`, { fill: 'url(#vl-ga)', role: 'series-0' }),
    sh(line(topA, 200), { stroke: AC60, sw: 1.5, role: 'series-1' }),
    sh(line(A1, 200), { stroke: AC, sw: 2.5, role: 'series-0' }),
    sh(`M${f(X(hi, 12))} ${T}V${B}`, { stroke: 'var(--fg-2)', sw: 1, dash: '3 3', role: 'tooltip-anchor' }),
    sh(circ(X(hi, 12), Y(topA[hi], 200), 4.5), { fill: 'var(--bg)', stroke: AC60, sw: 2, role: 'series-2' }),
    sh(circ(X(hi, 12), Y(A1[hi], 200), 5), { fill: 'var(--bg)', stroke: AC, sw: 2.5, role: 'series-2' }),
    sh(circ(X(hi, 12), Y(A1[hi], 200), 10), { stroke: AC, sw: 1, op: 0.3, role: 'series-2' }),
  ],
  texts: yl(200, (v) => (v ? v + 'k' : '0')),
  xlabels: MONTHS,
  tip: {
    left: ((X(hi, 12) / W) * 100 - 2).toFixed(1) + '%',
    title: 'Sep 2026',
    rows: [{ c: AC, l: 'Revenue', v: '$91.0k' }, { c: AC60, l: 'Costs', v: '$58.0k' }],
    fl: 'Total', fv: '$149.0k', fc: 'var(--fg)',
  },
  legend: [{ c: AC, l: 'Revenue' }, { c: AC60, l: 'Costs' }],
  note: 'rise 500ms swift-out · crosshair 100ms',
  code: code([
    open('ChartContainer', [['data', '{rows}', false], ['motion', '"rise"']]),
    selfc('XAxis', [['dataKey', '"month"']]),
    selfc('YAxis', [['format', '"compact"']]),
    selfc('AreaSeries', [['dataKey', '"revenue"'], ['stackId', '"a"']]),
    selfc('AreaSeries', [['dataKey', '"costs"'], ['stackId', '"a"'], ['color', '"accent.60"']]),
    selfc('Tooltip', []),
    selfc('Crosshair', []),
    close('ChartContainer'),
  ]),
  variants: [
    ['Stacked', 'stackId groups series; the band between edges is filled at 28%.'],
    ['Percent', 'stackOffset="expand" normalises each column to 100%.'],
    ['Overlapping', 'No stackId — fills at 18% so intersections read as a third tone.'],
    ['Baseline', 'baseline={value} fills above/below a reference in ok/err.'],
  ],
  motion: [
    ['ENTER', '--dur-500 · swift-out', 'fill rises from baseline via clip-path inset; edge stroke draws 200ms behind'],
    ['HOVER', '--dur-100 · linear', 'crosshair follows pointer; markers scale 0→1 at the snapped x'],
    ['REDUCED', '--dur-120 · linear', 'final frame crossfades in; crosshair snaps without lerp'],
  ],
  a11y: 'Each AreaSeries is a row group in the mirrored table. Stacked totals are announced after the parts: "September, Revenue 91 thousand, Costs 58 thousand, total 149 thousand".',
  props: [
    ['stackId', 'string', '—', 'Series sharing an id stack vertically.'],
    ['stackOffset', '"none" | "expand" | "silhouette"', '"none"', 'Normalise to percent or centre the stack.'],
    ['curve', '"monotone" | "linear" | "step"', '"monotone"', 'Interpolation shared with the top-edge stroke.'],
    ['gradient', 'boolean', 'true', 'Fade fill to transparent at the baseline.'],
  ],
})

// ── Bar ─────────────────────────────────────────────────────────────────────
const G: [number, number][] = [[64, 40], [72, 46], [58, 52], [90, 48], [84, 60], [102, 66], [96, 72], [118, 80]]
const bw = 22, gw = (R - L) / 8
const barShapes: Shape[] = [...grid()]
G.forEach(([a, b], i) => {
  const x0 = L + i * gw + gw / 2 - bw - 3
  const dim = i !== 5 ? 0.45 : 1
  barShapes.push(
    sh(rect(x0, Y(a, 120), bw, B - Y(a, 120)), { fill: AC, op: dim, role: 'series-0' }),
    sh(rect(x0 + bw + 6, Y(b, 120), bw, B - Y(b, 120)), { fill: AC35, op: dim, role: 'series-1' }),
  )
})
barShapes.splice(5, 0, sh(rect(L + 5 * gw + 2, T, gw - 4, B - T), { fill: 'var(--fg)', op: 0.05, role: 'tooltip-anchor' }))

const bar = makePage({
  id: 'bar', name: 'Bar chart',
  tagline: 'Grouped, stacked or horizontal columns. Bars grow from the baseline with a 30ms stagger; hovering a group dims its siblings so the comparison stays local.',
  tree: tree(
    [['▮', 'BarSeries', 'production', 'active', 'series-0'], ['▮', 'BarSeries', 'preview', '', 'series-1'], ['◫', 'BarLabel', 'end', '', 'series-2']],
    [['▭', 'Tooltip', 1], ['≡', 'Legend'], ['⊟', 'ReferenceLine']],
  ),
  shapes: barShapes,
  texts: [
    ...yl(120, (v) => String(Math.round(v))),
    tx(L + 5 * gw + gw / 2 - bw / 2 - 3, Y(102, 120) - 6, '102', { a: 'middle', fill: 'var(--fg)', w: 600, role: 'series-2' }),
  ],
  xlabels: ['W32', 'W33', 'W34', 'W35', 'W36', 'W37', 'W38', 'W39'],
  tip: {
    left: (((L + 5 * gw + gw / 2) / W) * 100 + 1).toFixed(1) + '%',
    title: 'Week 37',
    rows: [{ c: AC, l: 'Production', v: '102' }, { c: AC35, l: 'Preview', v: '66' }],
    fl: 'vs W36', fv: '+21%', fc: OK,
  },
  legend: [{ c: AC, l: 'Production' }, { c: AC35, l: 'Preview' }],
  note: 'grow 400ms settle · stagger 30ms · siblings dim 150ms',
  code: code([
    open('ChartContainer', [['data', '{weeks}', false]]),
    selfc('XAxis', [['dataKey', '"week"']]),
    selfc('YAxis', []),
    selfc('BarSeries', [['dataKey', '"production"'], ['radius', '"top"']]),
    selfc('BarSeries', [['dataKey', '"preview"'], ['color', '"accent.35"']]),
    selfc('Tooltip', [['mode', '"group"']]),
    close('ChartContainer'),
  ]),
  variants: [
    ['Grouped', 'Default. gap and groupGap control spacing; min bar width 4px.'],
    ['Stacked', 'stackId stacks series; only the top segment gets the radius.'],
    ['Horizontal', 'layout="horizontal" swaps axes; labels can sit at the end.'],
    ['Diverging', 'Negative values grow downward from a zero line in err.'],
  ],
  motion: [
    ['ENTER', '--dur-400 · settle', 'scaleY from baseline, transform-origin bottom; i × 30ms stagger, capped at 12'],
    ['HOVER', '--dur-150 · press', 'group band fades in; non-hovered groups drop to 45% opacity'],
    ['REDUCED', '--dur-120 · linear', 'bars appear at full height; dimming stays (it is state, not motion)'],
  ],
  a11y: 'Bars are keyboard-focusable per group (← →) then per bar (↑ ↓). Values announce as "Week 37, Production 102, Preview 66". Patterns (fill="pattern") are available for colour-blind safe stacks.',
  props: [
    ['layout', '"vertical" | "horizontal"', '"vertical"', 'Orientation of the bars.'],
    ['radius', 'number | "top" | "all"', '"top"', 'Corner radius, capped at half the bar width.'],
    ['stackId', 'string', '—', 'Series sharing an id stack.'],
    ['gap', 'number', '4', 'Space between bars inside a group, in px.'],
  ],
})

// ── Pie & Donut ─────────────────────────────────────────────────────────────
const PC: [number, number] = [300, 112], PR = 78
const slices: [number, string, string][] = [
  [38, AC, 'Pro'], [27, AC60, 'Team'], [20, AC35, 'Hobby'], [15, N, 'Enterprise'],
]
let pang = -Math.PI / 2
const pieShapes: Shape[] = []
slices.forEach(([p, c], i) => {
  const a1 = pang + 2 * Math.PI * p / 100
  const mid = (pang + a1) / 2
  const off = i === 1 ? 6 : 0
  const [dx, dy] = [Math.cos(mid) * off, Math.sin(mid) * off]
  pieShapes.push(sh(arc(PC[0] + dx, PC[1] + dy, PR, pang + 0.02, a1 - 0.02), {
    stroke: c, sw: 34, op: i === 1 || i === 0 ? 1 : 0.85,
  }))
  pang = a1
})

const pie = makePage({
  id: 'pie', name: 'Pie & Donut chart',
  tagline: 'Part-to-whole in a single ring. Arcs sweep clockwise on enter; the hovered arc offsets 6px outward and the centre label swaps to its value.',
  tree: tree(
    [['◔', 'PieSeries', 'plan', 'active', 'series-0'], ['◎', 'CenterLabel', '', '', 'series-1'], ['◫', 'ArcLabel', 'outside', '', 'series-2']],
    [['▭', 'Tooltip', 1], ['≡', 'Legend', 1]],
    false,
  ),
  shapes: [...tag(pieShapes, 'series-0'), sh(circ(PC[0], PC[1], PR + 17), { stroke: 'var(--bg-1)', sw: 2, role: 'series-0' })],
  texts: [
    tx(300, 108, '27%', { a: 'middle', fill: 'var(--fg)', size: 24, w: 600, sans: true, role: 'series-1' }),
    tx(300, 124, 'Team · 1,930 seats', { a: 'middle', size: 10, role: 'series-1' }),
    tx(430, 60, 'Pro', { sans: true, fill: 'var(--fg-2)', size: 11, role: 'series-2' }),
    tx(560, 60, '38%', { a: 'end', fill: 'var(--fg)', role: 'series-2' }),
    tx(430, 84, 'Team', { sans: true, fill: 'var(--fg)', size: 11, w: 600, role: 'series-2' }),
    tx(560, 84, '27%', { a: 'end', fill: 'var(--fg)', role: 'series-2' }),
    tx(430, 108, 'Hobby', { sans: true, fill: 'var(--fg-2)', size: 11, role: 'series-2' }),
    tx(560, 108, '20%', { a: 'end', fill: 'var(--fg)', role: 'series-2' }),
    tx(430, 132, 'Enterprise', { sans: true, fill: 'var(--fg-2)', size: 11, role: 'series-2' }),
    tx(560, 132, '15%', { a: 'end', fill: 'var(--fg)', role: 'series-2' }),
    tx(40, 60, 'MRR share', { sans: true, fill: 'var(--fg-2)', size: 11 }),
    tx(40, 76, 'by plan · Oct', { size: 10 }),
  ],
  swatches: slices.map(([, c], i) => ({ c, y: 52 + i * 24 })),
  xlabels: [],
  tip: {
    left: '58%', title: 'Team',
    rows: [{ c: AC60, l: 'Seats', v: '1,930' }, { c: 'transparent', l: 'MRR', v: '$38.6k' }],
    fl: 'Share', fv: '27%', fc: 'var(--fg)',
  },
  legend: [],
  note: 'sweep 500ms swift-out · hover offset 6px, 150ms',
  code: code([
    open('ChartContainer', [['data', '{plans}', false]]),
    selfc('PieSeries', [['dataKey', '"mrr"'], ['nameKey', '"plan"'], ['innerRadius', '{0.6}', false], ['padAngle', '{1}', false]]),
    selfc('CenterLabel', [['render', '{(d) => d.share}', false]]),
    selfc('Legend', [['variant', '"list"'], ['align', '"right"']]),
    close('ChartContainer'),
  ]),
  variants: [
    ['Pie', 'innerRadius={0} — full disc; labels move outside with leader lines.'],
    ['Donut', 'innerRadius 0.5–0.75 leaves room for a CenterLabel.'],
    ['Half', 'startAngle=-90 endAngle=90 for a gauge-like summary.'],
    ['Nested', 'Two PieSeries with different radii for category → subcategory.'],
  ],
  motion: [
    ['ENTER', '--dur-500 · swift-out', 'stroke-dashoffset sweeps each arc in sequence; later arcs start at 60% of the previous'],
    ['HOVER', '--dur-150 · press', 'arc translates 6px along its bisector; centre label crossfades 100ms'],
    ['REDUCED', '--dur-120 · linear', 'ring fades in complete; hover offset drops to a 2px stroke highlight'],
  ],
  a11y: 'Rendered as a list, not a graphic: each arc is a listitem with name, value and share. Slices under 3% are grouped into "Other" by default so the legend stays readable.',
  props: [
    ['innerRadius', 'number (0–1)', '0', 'Fraction of the outer radius left empty.'],
    ['padAngle', 'number', '1', 'Gap between arcs, in degrees.'],
    ['startAngle', 'number', '-90', 'Where the first arc begins.'],
    ['minShare', 'number', '0.03', 'Slices below this fraction collapse into "Other".'],
  ],
})

// ── Scatter ─────────────────────────────────────────────────────────────────
let seed = 11
const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }
const pts = Array.from({ length: 46 }, () => {
  const x = rnd()
  return { x, y: Math.min(0.98, Math.max(0.04, x * 0.65 + rnd() * 0.4 - 0.12)), r: 3 + rnd() * 3 }
})
const hp = pts[17]
const scShapes: Shape[] = [
  ...grid(),
  sh(`M${L} ${T}V${B}`, { stroke: 'var(--line-2)', sw: 1, role: 'axes' }),
  sh(rect(L, T, (R - L) / 2, (B - T) / 2), { fill: 'var(--fg)', op: 0.03, role: 'reference' }),
  sh(`M${L} ${f(Y(14, 100))}L${R} ${f(Y(86, 100))}`, { stroke: N, sw: 1.5, dash: '4 4', role: 'series-1' }),
  ...pts.map((p) => sh(circ(L + p.x * (R - L), B - p.y * (B - T), p.r), {
    fill: AC, op: p === hp ? 1 : 0.6, stroke: 'var(--bg-1)', sw: 1, role: 'series-0',
  })),
]
const hx = L + hp.x * (R - L), hy = B - hp.y * (B - T)
scShapes.push(
  sh(`M${f(hx)} ${T}V${B}M${L} ${f(hy)}H${R}`, { stroke: 'var(--fg-2)', sw: 1, dash: '3 3', role: 'tooltip-anchor' }),
  sh(circ(hx, hy, hp.r + 4), { stroke: AC, sw: 2, fill: 'var(--bg)', op: 1, role: 'markers' }),
  sh(circ(hx, hy, hp.r), { fill: AC, role: 'markers' }),
)

const scatter = makePage({
  id: 'scatter', name: 'Scatter chart',
  tagline: 'Points on two continuous axes, optionally sized by a third key. A trend line, quadrant shading and nearest-point hover make the correlation obvious.',
  tree: tree(
    [['●', 'ScatterSeries', 'repos', 'active', 'series-0'], ['⟋', 'TrendLine', 'linear', '', 'series-1'], ['◫', 'PointLabel', 'top-n', '', 'series-2']],
    [['▭', 'Tooltip', 1], ['┼', 'Crosshair', 1], ['▦', 'ReferenceArea']],
  ),
  shapes: scShapes,
  texts: [
    ...yl(100, (v) => Math.round(v) + '%'),
    tx(L + 6, T + 12, 'low stars · high issues', { size: 9, role: 'series-2' }),
    tx(R - 4, Y(88, 100) - 6, 'r = 0.81', { a: 'end', fill: 'var(--fg-2)', role: 'series-2' }),
  ],
  xlabels: ['0', '2k', '4k', '6k', '8k', '10k', '12k'],
  tip: {
    left: ((hx / W) * 100 + 1.5).toFixed(1) + '%',
    title: 'veloce-ui/veloce',
    rows: [{ c: AC, l: 'Stars', v: '12.4k' }, { c: 'transparent', l: 'Issues closed', v: '91%' }],
    fl: 'Contributors', fv: '214', fc: 'var(--fg)',
  },
  legend: [{ c: AC, l: 'Repositories (size = contributors)' }],
  note: 'pop 250ms settle · stagger 8ms · nearest-point hover',
  code: code([
    open('ChartContainer', [['data', '{repos}', false]]),
    selfc('XAxis', [['dataKey', '"stars"'], ['format', '"compact"']]),
    selfc('YAxis', [['dataKey', '"closedRate"'], ['format', '"percent"']]),
    selfc('ScatterSeries', [['sizeKey', '"contributors"'], ['sizeRange', '{[3, 7]}', false]]),
    selfc('TrendLine', [['method', '"linear"'], ['showR', '', false]]),
    selfc('Tooltip', [['mode', '"nearest"']]),
    close('ChartContainer'),
  ]),
  variants: [
    ['Bubble', 'sizeKey maps a third dimension to radius (area-scaled).'],
    ['Categorical', 'colorKey assigns palette steps per category + legend.'],
    ['Connected', 'connect sorts by x and draws a thin path through points.'],
    ['Density', 'Over 2k points switches to canvas hit-testing automatically.'],
  ],
  motion: [
    ['ENTER', '--dur-250 · settle', 'points scale 0→1 at their position; stagger 8ms by x, capped at 400ms'],
    ['HOVER', '--dur-100 · linear', 'nearest point (Voronoi) gets a halo; crosshair lines snap to it'],
    ['REDUCED', '--dur-120 · linear', 'points fade in together; halo appears without scale'],
  ],
  a11y: 'Points are navigable along the x order (← →) with the nearest-neighbour rule for ↑ ↓. Each announces both axes and the size key. The trend line reports r and slope in the chart description.',
  props: [
    ['sizeKey', 'string', '—', 'Key mapped to point radius.'],
    ['sizeRange', '[number, number]', '[3, 8]', 'Min and max radius in px.'],
    ['colorKey', 'string', '—', 'Categorical key mapped to palette steps.'],
    ['connect', 'boolean', 'false', 'Draw a path through points in x order.'],
  ],
})

// ── Candlestick ─────────────────────────────────────────────────────────────
const ohlc: [number, number, number, number][] = [
  [40, 52, 36, 50], [50, 58, 46, 44], [44, 47, 38, 40], [40, 56, 39, 54],
  [54, 62, 50, 60], [60, 61, 48, 52], [52, 66, 50, 64], [64, 70, 60, 68],
  [68, 72, 58, 60], [60, 66, 55, 64], [64, 78, 62, 76], [76, 80, 70, 72],
  [72, 74, 64, 66], [66, 84, 65, 82], [82, 86, 78, 80], [80, 81, 70, 72],
  [72, 79, 71, 78], [78, 90, 76, 88], [88, 92, 82, 84], [84, 86, 76, 78],
  [78, 88, 77, 86], [86, 94, 84, 92],
]
const cw = (R - L) / 22
const cs: Shape[] = [...grid(4)]
const maArr = ohlc.map((_, i) =>
  ohlc.slice(Math.max(0, i - 4), i + 1).reduce((a, c) => a + c[3], 0) / Math.min(5, i + 1),
)
ohlc.forEach(([o, h, l, c], i) => {
  const x = L + i * cw + cw / 2
  const up = c >= o
  const col = up ? OK : ERR
  const dim = i === 17 ? 1 : 0.8
  cs.push(
    sh(`M${f(x)} ${f(Y(h, 100))}V${f(Y(l, 100))}`, { stroke: col, sw: 1.5, op: dim, role: 'series-0' }),
    sh(rect(x - 6, Y(Math.max(o, c), 100), 12, Math.max(2, Y(Math.min(o, c), 100) - Y(Math.max(o, c), 100))), {
      fill: col, stroke: col, sw: 1, op: dim, role: 'series-0',
    }),
  )
  cs.push(sh(rect(x - 6, B + 6, 12, 8 + ((i * 7) % 13)), { fill: 'var(--line-2)', op: 0.9, role: 'series-2' }))
})
cs.push(sh(maArr.map((v, i) => `${i ? 'L' : 'M'}${f(L + i * cw + cw / 2)} ${f(Y(v, 100))}`).join(''), {
  stroke: AC, sw: 1.5, op: 0.9, role: 'series-1',
}))
cs.push(
  sh(`M${f(L + 17 * cw + cw / 2)} ${T}V${B + 30}`, { stroke: 'var(--fg-2)', sw: 1, dash: '3 3', role: 'tooltip-anchor' }),
  sh(rect(L + 17 * cw, T, cw, B - T), { fill: 'var(--fg)', op: 0.05, role: 'tooltip-anchor' }),
)

const candle = makePage({
  id: 'candle', name: 'Candlestick chart',
  tagline: 'Open-high-low-close per period, with a volume strip and moving average. Up and down candles use the ok/err tokens so they survive any accent.',
  tree: tree(
    [['⫿', 'CandlestickSeries', 'ohlc', 'active', 'series-0'], ['∿', 'LineSeries', 'ma(5)', '', 'series-1'], ['▮', 'BarSeries', 'volume · pane 2', '', 'series-2']],
    [['▭', 'Tooltip', 1], ['┼', 'Crosshair', 1], ['⊟', 'Panes']],
  ),
  shapes: cs,
  texts: [...yl(100, (v) => '$' + Math.round(v)), tx(R, B + 18, 'vol', { a: 'end', size: 9 })],
  xlabels: ['Sep 1', 'Sep 5', 'Sep 9', 'Sep 13', 'Sep 17', 'Sep 21', 'Sep 25', 'Sep 29'],
  tip: {
    left: (((L + 17 * cw) / W) * 100 + 2.5).toFixed(1) + '%',
    title: 'Sep 24 · daily',
    rows: [{ c: OK, l: 'O / C', v: '78 → 88' }, { c: 'transparent', l: 'H / L', v: '90 / 76' }],
    fl: 'MA(5)', fv: '81.6', fc: 'var(--ac-text)',
  },
  legend: [{ c: OK, l: 'Up' }, { c: ERR, l: 'Down' }, { c: AC, l: 'MA(5)' }],
  note: 'wick draws 150ms → body grows 150ms · panes share the crosshair',
  code: code([
    open('ChartContainer', [['data', '{candles}', false], ['panes', '{[3, 1]}', false]]),
    selfc('XAxis', [['dataKey', '"date"'], ['scale', '"time"']]),
    selfc('YAxis', [['format', '"currency"']]),
    selfc('CandlestickSeries', [['up', '"ok"'], ['down', '"err"']]),
    selfc('LineSeries', [['dataKey', '"ma5"'], ['width', '{1.5}', false]]),
    selfc('BarSeries', [['dataKey', '"volume"'], ['pane', '{1}', false], ['color', '"neutral"']]),
    selfc('Crosshair', [['sync', '"panes"']]),
    close('ChartContainer'),
  ]),
  variants: [
    ['OHLC bars', 'variant="ohlc" draws ticks instead of bodies.'],
    ['Hollow', 'hollowUp fills only down candles — common in trading UIs.'],
    ['Heikin-Ashi', 'transform="heikin-ashi" smooths the series before render.'],
    ['Multi-pane', 'panes={[3,1]} stacks price and volume with one shared crosshair.'],
  ],
  motion: [
    ['ENTER', '--dur-300 · swift-out', 'wick scales from the midpoint, then body grows from open; stagger 10ms by index'],
    ['HOVER', '--dur-100 · linear', 'column highlight + crosshair across panes; tooltip pins to the candle, not the pointer'],
    ['REDUCED', '--dur-120 · linear', 'candles appear complete; highlight remains instant'],
  ],
  a11y: 'Each candle announces "Sep 24, open 78, high 90, low 76, close 88, up 12.8%". Colour is never the only cue: down candles get a hatched pattern when fill="pattern" or forced-colors is active.',
  props: [
    ['up', 'Token', '"ok"', 'Colour for close ≥ open.'],
    ['down', 'Token', '"err"', 'Colour for close < open.'],
    ['variant', '"candle" | "ohlc"', '"candle"', 'Body or tick rendering.'],
    ['pane', 'number', '0', 'Which pane this series draws into.'],
  ],
})

// ── Radar ───────────────────────────────────────────────────────────────────
const RC: [number, number] = [300, 112], RR = 86
const AX = ['Speed', 'A11y', 'DX', 'Size', 'Motion', 'Theming']
const rp = (v: number, i: number, n = 6): [number, number] =>
  pol(RC[0], RC[1], RR * v, -Math.PI / 2 + (i * 2 * Math.PI) / n)
const polyPath = (vals: number[]) =>
  vals.map((v, i) => { const [x, y] = rp(v, i); return `${i ? 'L' : 'M'}${f(x)} ${f(y)}` }).join('') + 'Z'
const rs: Shape[] = [1, 0.75, 0.5, 0.25].map((r) =>
  sh(polyPath(Array(6).fill(r)), { stroke: r === 1 ? 'var(--line-2)' : 'var(--line)', sw: 1, role: 'grid' }),
)
rs.push(sh(
  Array.from({ length: 6 }, (_, i) => { const [x, y] = rp(1, i); return `M${RC[0]} ${RC[1]}L${f(x)} ${f(y)}` }).join(''),
  { stroke: 'var(--line)', sw: 1, role: 'grid' },
))
const RA = [0.92, 0.7, 0.82, 0.6, 0.9, 0.78]
const RB = [0.5, 0.85, 0.45, 0.95, 0.4, 0.62]
rs.push(
  sh(polyPath(RB), { fill: N, op: 0.18, stroke: N, sw: 1.5, role: 'series-1' }),
  sh(polyPath(RA), { fill: AC, op: 0.28, stroke: AC, sw: 2, role: 'series-0' }),
)
rs.push(sh(`M${RC[0]} ${RC[1]}L${f(rp(1, 1)[0])} ${f(rp(1, 1)[1])}`, { stroke: AC, sw: 1.5, op: 0.6, role: 'tooltip-anchor' }))
rs.push(...RA.map((v, i) => {
  const [cx, cy] = rp(v, i)
  return sh(circ(cx, cy, i === 1 ? 5 : 3), { fill: i === 1 ? 'var(--bg)' : AC, stroke: AC, sw: 2, role: 'series-2' })
}))
const radarTexts: TextNode[] = AX.map((a, i) => {
  const [x, y] = rp(1.17, i)
  return tx(x, y + 3, a, {
    a: 'middle', sans: true, fill: i === 1 ? 'var(--fg)' : 'var(--fg-2)', size: 11, w: i === 1 ? 600 : 400,
  })
})

const radar = makePage({
  id: 'radar', name: 'Radar chart',
  tagline: 'Multivariate comparison on spokes. Polygons unfold from the centre; hovering a spoke highlights that axis across every series.',
  tree: tree(
    [['⬡', 'RadarSeries', 'veloce', 'active', 'series-0'], ['⬡', 'RadarSeries', 'baseline', '', 'series-1'], ['●', 'Markers', '', '', 'series-2']],
    [['▭', 'Tooltip', 1], ['≡', 'Legend', 1], ['◎', 'PolarGrid']],
    false,
  ),
  shapes: rs,
  texts: [
    ...radarTexts,
    tx(40, 60, 'Audit score', { sans: true, fill: 'var(--fg-2)', size: 11 }),
    tx(40, 76, '0–100 per axis', { size: 10 }),
    tx(560, 60, '●', { a: 'end', fill: AC }),
    tx(548, 60, 'Veloce 1.1', { a: 'end', sans: true, fill: 'var(--fg-2)', size: 11 }),
    tx(560, 80, '●', { a: 'end', fill: N }),
    tx(548, 80, 'Baseline', { a: 'end', sans: true, fill: 'var(--fg-2)', size: 11 }),
  ],
  xlabels: [],
  tip: {
    left: '62%', title: 'A11y',
    rows: [{ c: AC, l: 'Veloce 1.1', v: '70' }, { c: N, l: 'Baseline', v: '85' }],
    fl: 'Δ', fv: '−15', fc: ERR,
  },
  legend: [],
  note: 'unfold 400ms swift-out · spoke highlight 150ms',
  code: code([
    open('ChartContainer', [['data', '{audit}', false], ['layout', '"polar"']]),
    selfc('PolarGrid', [['levels', '{4}', false], ['shape', '"polygon"']]),
    selfc('PolarAxis', [['dataKey', '"axis"']]),
    selfc('RadarSeries', [['dataKey', '"veloce"'], ['markers', '', false]]),
    selfc('RadarSeries', [['dataKey', '"baseline"'], ['color', '"neutral"']]),
    selfc('Tooltip', [['mode', '"axis"']]),
    close('ChartContainer'),
  ]),
  variants: [
    ['Polygon grid', 'Default. shape="circle" draws rings instead.'],
    ['Filled', 'fillOpacity up to .4; stroke stays 2px.'],
    ['Single', 'One series + markers reads as a profile card.'],
    ['Small multiples', 'Compose several ChartContainers in a Grid for n profiles.'],
  ],
  motion: [
    ['ENTER', '--dur-400 · swift-out', 'polygon scales from the centre (transform-origin 50% 50%); grid rings fade 100ms earlier'],
    ['HOVER', '--dur-150 · press', 'spoke line brightens, markers on that spoke grow; tooltip lists every series'],
    ['REDUCED', '--dur-120 · linear', 'polygons fade in at full size'],
  ],
  a11y: 'Table rows are axes, columns are series — the natural reading order. Arrow keys move around the spokes; the live region reads "A11y, Veloce 70, Baseline 85".',
  props: [
    ['levels', 'number', '4', 'Number of grid rings.'],
    ['shape', '"polygon" | "circle"', '"polygon"', 'Grid ring geometry.'],
    ['markers', 'boolean', 'false', 'Draw a point at each vertex.'],
    ['fillOpacity', 'number', '0.25', 'Polygon fill alpha.'],
  ],
})

// ── Funnel ──────────────────────────────────────────────────────────────────
const FS: [string, number, number][] = [
  ['Visited', 48200, 1], ['Signed up', 30850, 0.64], ['Installed', 18300, 0.38],
  ['Deployed', 10120, 0.21], ['Paid', 4340, 0.09],
]
const fs: Shape[] = []
const fh = 30, fg = 6
FS.forEach(([, , p], i) => {
  const w1 = p * 420
  const w2 = (FS[i + 1] ? FS[i + 1][2] : p * 0.8) * 420
  const y = T + 2 + i * (fh + fg)
  fs.push(sh(
    `M${f(300 - w1 / 2)} ${y}L${f(300 + w1 / 2)} ${y}L${f(300 + w2 / 2)} ${y + fh}L${f(300 - w2 / 2)} ${y + fh}Z`,
    { fill: i === 0 ? AC : mix(90 - i * 18), op: i === 2 ? 1 : 0.92, role: 'series-0' },
  ))
  if (i === 2) {
    fs.push(sh(
      `M${f(300 - w1 / 2 - 8)} ${y - 3}L${f(300 + w1 / 2 + 8)} ${y - 3}L${f(300 + w2 / 2 + 8)} ${y + fh + 3}L${f(300 - w2 / 2 - 8)} ${y + fh + 3}Z`,
      { stroke: AC, sw: 1.5, dash: '3 3', role: 'series-0' },
    ))
  }
})
const funnelTexts: TextNode[] = FS.flatMap(([n2, v, p], i) => {
  const y = T + 2 + i * (fh + fg) + fh / 2 + 4
  const base: TextNode[] = [
    tx(300, y, `${n2} · ${(v / 1000).toFixed(1)}k`, {
      a: 'middle', sans: true, fill: i < 2 ? 'var(--ac-fg)' : 'var(--fg)', size: 11, w: 600, role: 'series-1',
    }),
    tx(560, y, `${Math.round(p * 100)}%`, { a: 'end', fill: 'var(--fg)', role: 'series-2' }),
  ]
  if (i) base.push(tx(40, y, `↓ ${Math.round(FS[i][2] / FS[i - 1][2] * 100)}%`, {
    fill: i === 3 ? ERR : 'var(--fg-3)', role: 'series-2',
  }))
  return base
})

const funnel = makePage({
  id: 'funnel', name: 'Funnel chart',
  tagline: 'Sequential stages as a narrowing shape. Each stage shows absolute count, share of the top and step conversion — the number teams actually argue about.',
  tree: tree(
    [['⏷', 'FunnelSeries', 'stages', 'active', 'series-0'], ['◫', 'StageLabel', 'inside', '', 'series-1'], ['↓', 'ConversionLabel', 'left', '', 'series-2']],
    [['▭', 'Tooltip', 1], ['≡', 'Legend']],
    false,
  ),
  shapes: fs,
  texts: funnelTexts,
  xlabels: [],
  tip: {
    left: '66%', title: 'Installed',
    rows: [{ c: mix(54), l: 'Users', v: '18,300' }, { c: 'transparent', l: 'From top', v: '38%' }],
    fl: 'Step conversion', fv: '59%', fc: 'var(--fg)',
  },
  legend: [],
  note: 'cascade 60ms per stage · 300ms each · hover outlines stage',
  code: code([
    open('ChartContainer', [['data', '{stages}', false]]),
    selfc('FunnelSeries', [['dataKey', '"users"'], ['nameKey', '"stage"'], ['label', '"inside"'], ['conversion', '"step"']]),
    selfc('Tooltip', []),
    close('ChartContainer'),
  ]),
  variants: [
    ['Trapezoid', 'Default — stage width = share, sides slope to the next stage.'],
    ['Bars', 'shape="bar" for equal-height centred bars; easier to label.'],
    ['Horizontal', 'layout="horizontal" flows left → right for wide containers.'],
    ['Compare', 'Two FunnelSeries overlay as outline vs fill (e.g. this vs last month).'],
  ],
  motion: [
    ['ENTER', '--dur-300 · swift-out', 'each stage scales X from centre; starts 60ms after the previous'],
    ['HOVER', '--dur-150 · press', 'dashed outline grows 8px around the stage; others dim to 70%'],
    ['REDUCED', '--dur-120 · linear', 'stages fade in together'],
  ],
  a11y: 'Stages form an ordered list; each item reads name, count, share of first and conversion from previous. The biggest drop-off is flagged in the chart description.',
  props: [
    ['conversion', '"step" | "total" | "none"', '"step"', 'Which percentage to show beside stages.'],
    ['shape', '"trapezoid" | "bar"', '"trapezoid"', 'Stage geometry.'],
    ['label', '"inside" | "outside"', '"inside"', 'Label placement.'],
    ['sort', 'boolean', 'true', 'Sort stages descending before render.'],
  ],
})

// ── Waterfall ───────────────────────────────────────────────────────────────
const WF: [string, number, 't' | '+' | '-'][] = [
  ['Q2 close', 68, 't'], ['New', 24, '+'], ['Expansion', 11, '+'],
  ['Churn', -14, '-'], ['Contraction', -6, '-'], ['FX', 3, '+'], ['Q3 close', 0, 't'],
]
let wrun = 0
const ws: Shape[] = [...grid()]
const wl: TextNode[] = []
WF.forEach(([, v, k], i) => {
  const x = L + i * (R - L) / 7 + 10
  const w = (R - L) / 7 - 20
  let a: number, b: number
  if (k === 't') { b = i === 0 ? v : wrun; a = 0; wrun = b }
  else { a = wrun; b = wrun + v; wrun = b }
  const y1 = Y(Math.max(a, b), 120), y2 = Y(Math.min(a, b), 120)
  ws.push(sh(rect(x, y1, w, Math.max(2, y2 - y1)), {
    fill: k === 't' ? 'var(--fg-2)' : k === '+' ? OK : ERR, op: i === 3 ? 1 : 0.9, role: 'series-0',
  }))
  if (i < WF.length - 1) {
    ws.push(sh(`M${f(x + w)} ${f(Y(wrun, 120))}H${f(x + w + 20)}`, {
      stroke: 'var(--line-2)', sw: 1, dash: '2 2', role: 'series-2',
    }))
  }
  wl.push(tx(x + w / 2, y1 - 6,
    (k === 't' ? '' : v > 0 ? '+' : '') + (k === 't' ? wrun : v),
    { a: 'middle', fill: k === 't' ? 'var(--fg)' : k === '+' ? OK : ERR, w: 600, role: 'series-1' },
  ))
})

const waterfall = makePage({
  id: 'waterfall', name: 'Waterfall chart',
  tagline: 'How a total moves from one period to the next. Floating bars for each change, anchored totals at both ends, and connectors so the running value is never ambiguous.',
  tree: tree(
    [['⫶', 'WaterfallSeries', 'bridge', 'active', 'series-0'], ['◫', 'ValueLabel', 'top', '', 'series-1'], ['⋯', 'Connectors', '', '', 'series-2']],
    [['▭', 'Tooltip', 1], ['⊟', 'ReferenceLine']],
  ),
  shapes: ws,
  texts: [...yl(120, (v) => '$' + Math.round(v) + 'k'), ...wl],
  xlabels: WF.map((w) => w[0]),
  tip: {
    left: '50%', title: 'Churn',
    rows: [{ c: ERR, l: 'Change', v: '−$14k' }, { c: 'transparent', l: 'Running', v: '$89k' }],
    fl: 'vs Q2', fv: '−3.1%', fc: ERR,
  },
  legend: [{ c: 'var(--fg-2)', l: 'Total' }, { c: OK, l: 'Increase' }, { c: ERR, l: 'Decrease' }],
  note: 'left → right 40ms stagger · connectors draw after bars',
  code: code([
    open('ChartContainer', [['data', '{bridge}', false]]),
    selfc('XAxis', [['dataKey', '"label"']]),
    selfc('YAxis', [['format', '"currency"']]),
    selfc('WaterfallSeries', [['dataKey', '"delta"'], ['totals', '{["Q2 close", "Q3 close"]}', false], ['label', '"top"']]),
    selfc('Tooltip', []),
    close('ChartContainer'),
  ]),
  variants: [
    ['Bridge', 'Default: start total, deltas, end total.'],
    ['Running', 'totals={[]} — no anchors, pure cumulative.'],
    ['Subtotals', 'Mark intermediate rows as subtotal to add anchors mid-way.'],
    ['Horizontal', 'layout="horizontal" for long category names.'],
  ],
  motion: [
    ['ENTER', '--dur-300 · settle', 'bars grow from their anchor edge (not the baseline), 40ms stagger; connectors draw last'],
    ['HOVER', '--dur-150 · press', 'bar brightens, its connectors turn solid, running value pins in the tooltip'],
    ['REDUCED', '--dur-120 · linear', 'everything fades in; connectors visible immediately'],
  ],
  a11y: 'Table columns: step, change, running total. Increases/decreases are prefixed in text ("decrease of 14 thousand") so colour is redundant.',
  props: [
    ['totals', 'string[]', '—', 'Labels rendered as anchored totals.'],
    ['connectors', 'boolean', 'true', 'Dashed lines between bar edges.'],
    ['label', '"top" | "inside" | "none"', '"top"', 'Delta label placement.'],
    ['subtotal', '(row) => boolean', '—', 'Mark rows that reset as anchored subtotals.'],
  ],
})

// ── Treemap ─────────────────────────────────────────────────────────────────
const TM: [number, number, number, number, string, string, string, number][] = [
  [30, 16, 220, 184, 'Organic', '38%', AC, 1],
  [254, 16, 170, 92, 'Direct', '27%', AC60, 1],
  [254, 112, 100, 88, 'Referral', '20%', AC35, 1],
  [358, 112, 66, 44, 'Social', '9%', N, 0.8],
  [358, 160, 66, 40, 'Email', '6%', N, 0.6],
  [428, 16, 142, 110, 'Paid search', '14%', mix(78), 1],
  [428, 130, 142, 70, 'Display', '5%', mix(28), 1],
]
// Treemap series shapes: first tile is the primary TreemapSeries (series-0); outer tiles
// are also role='series-0' (shared with GroupTile), labels get role='series-2' (TileLabel).
const tms: Shape[] = TM.map(([x, y, w, h, , , c, op], i) =>
  sh(rect(x + 1.5, y + 1.5, w - 3, h - 3), {
    fill: c, op, stroke: i === 2 ? 'var(--fg)' : 'none', sw: i === 2 ? 2 : 0, role: i === 2 ? 'series-1' : 'series-0',
  }),
)
const tmt: TextNode[] = TM.flatMap(([x, y, , h, l2, p, , ], i) =>
  h > 40
    ? [
        tx(x + 9, y + 17, l2, {
          sans: true, fill: i < 2 || i === 5 ? 'var(--ac-fg)' : 'var(--fg)', size: 11, w: 600, role: 'series-2',
        }),
        tx(x + 9, y + 30, p, {
          fill: i < 2 || i === 5 ? 'var(--ac-fg)' : 'var(--fg-2)', size: 10, role: 'series-2',
        }),
      ]
    : [tx(x + 7, y + 14, l2, { sans: true, fill: 'var(--fg)', size: 9.5, w: 600, role: 'series-2' })],
)

const treemap = makePage({
  id: 'treemap', name: 'Treemap',
  tagline: 'Hierarchical share as nested tiles. Squarified layout keeps aspect ratios near 1 so labels fit; clicking a group tile zooms into its children.',
  tree: tree(
    [['▦', 'TreemapSeries', 'sessions', 'active', 'series-0'], ['▣', 'GroupTile', 'channel', '', 'series-1'], ['◫', 'TileLabel', 'auto', '', 'series-2']],
    [['▭', 'Tooltip', 1], ['↩', 'Breadcrumb']],
    false,
  ),
  shapes: tms,
  texts: tmt,
  xlabels: [],
  tip: {
    left: '42%', title: 'Referral',
    rows: [{ c: AC35, l: 'Sessions', v: '248k' }, { c: 'transparent', l: 'Share', v: '20%' }],
    fl: 'Top referrer', fv: 'github.com', fc: 'var(--fg)',
  },
  legend: [{ c: AC, l: 'Owned' }, { c: mix(78), l: 'Paid' }, { c: N, l: 'Other' }],
  note: 'tiles scale-in 250ms from group centre · zoom 350ms settle',
  code: code([
    open('ChartContainer', [['data', '{channels}', false]]),
    selfc('TreemapSeries', [['valueKey', '"sessions"'], ['childrenKey', '"children"'], ['tile', '"squarify"'], ['label', '"auto"']]),
    selfc('Breadcrumb', []),
    selfc('Tooltip', []),
    close('ChartContainer'),
  ]),
  variants: [
    ['Squarify', 'Default tiling; best label fit.'],
    ['Slice & dice', 'tile="slice" alternates rows and columns — stable order.'],
    ['Zoomable', 'Click a group → children fill the container; Breadcrumb goes back.'],
    ['Heat', 'colorKey maps a second metric to tile tone (e.g. growth).'],
  ],
  motion: [
    ['ENTER', '--dur-250 · swift-out', "tiles scale from their group's centre; depth-ordered 30ms stagger"],
    ['HOVER', '--dur-150 · press', '2px inner outline in fg; siblings unaffected (tiles are already distinct)'],
    ['REDUCED', '--dur-120 · linear', 'tiles fade in; zoom becomes a crossfade'],
  ],
  a11y: 'Nested lists mirror the hierarchy; tiles are focusable with Enter to zoom and Esc to go up. Labels hide when a tile is under 40×24px but remain in the accessible name.',
  props: [
    ['tile', '"squarify" | "slice" | "dice"', '"squarify"', 'Tiling algorithm.'],
    ['childrenKey', 'string', '"children"', 'Key holding nested rows.'],
    ['label', '"auto" | "always" | "none"', '"auto"', "Hide labels that don't fit."],
    ['zoomable', 'boolean', 'true', 'Click a group to drill in.'],
  ],
})

// ── Heatmap ─────────────────────────────────────────────────────────────────
const hm: Shape[] = []
const cwid = (R - L - 30) / 24, chei = (B - T) / 7
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
for (let d = 0; d < 7; d++) {
  for (let h = 0; h < 24; h++) {
    const wk = d < 5 ? 1 : 0.35
    const v = Math.max(0.03, wk * Math.exp(-Math.pow((h - 13.5) / 5.5, 2))) * (1 - (d === 4 ? 0.15 : 0))
    const hot = d === 1 && h === 14
    hm.push(sh(rect(L + 30 + h * cwid + 1, T + d * chei + 1, cwid - 2, chei - 2), {
      fill: mix(Math.round(v * 100)), stroke: hot ? 'var(--fg)' : 'none', sw: hot ? 2 : 0, role: hot ? 'series-1' : 'series-0',
    }))
  }
}

const heatmap = makePage({
  id: 'heatmap', name: 'Heatmap',
  tagline: 'A matrix of values encoded as colour. Uses the accent ramp at equal lightness steps so "hotter" is unambiguous in both colour schemes.',
  tree: tree(
    [['▦', 'HeatmapSeries', 'requests', 'active', 'series-0'], ['▤', 'ColorScale', 'sequential', '', 'series-1']],
    [['▭', 'Tooltip', 1], ['▥', 'ColorLegend']],
    true,
  ),
  shapes: hm,
  texts: DAYS.map((d, i) => tx(L + 22, T + i * chei + chei / 2 + 3, d, { a: 'end' })),
  xlabels: ['00', '03', '06', '09', '12', '15', '18', '21', '23'],
  tip: {
    left: '52%', title: 'Tue · 14:00',
    rows: [{ c: AC, l: 'Requests', v: '48,210' }, { c: 'transparent', l: 'p95', v: '142ms' }],
    fl: 'vs weekly mean', fv: '+86%', fc: OK,
  },
  legend: [{ c: mix(10), l: 'low' }, { c: mix(55), l: '' }, { c: AC, l: 'high' }],
  note: 'cells fade in by column 8ms · hover outline 100ms',
  code: code([
    open('ChartContainer', [['data', '{matrix}', false]]),
    selfc('XAxis', [['dataKey', '"hour"'], ['ticks', '{3}', false]]),
    selfc('YAxis', [['dataKey', '"day"'], ['type', '"band"']]),
    selfc('HeatmapSeries', [['valueKey', '"requests"'], ['scale', '"sequential"'], ['radius', '{3}', false]]),
    selfc('ColorLegend', [['position', '"top-right"']]),
    close('ChartContainer'),
  ]),
  variants: [
    ['Sequential', 'Default; accent ramp from 3% → 100%.'],
    ['Diverging', 'scale="diverging" uses err ↔ neutral ↔ ok around a midpoint.'],
    ['Calendar', 'layout="calendar" lays weeks as columns, like contribution graphs.'],
    ['Labelled', 'showValues prints the number when the cell is wide enough.'],
  ],
  motion: [
    ['ENTER', '--dur-200 · swift-out', 'cells fade in column by column, 8ms apart (≈200ms total for 24 cols)'],
    ['HOVER', '--dur-100 · linear', '2px fg outline; row and column headers turn fg'],
    ['REDUCED', '--dur-120 · linear', 'whole matrix fades in together'],
  ],
  a11y: 'Rendered as a real table with row/column headers, so screen readers get "Tuesday, 14:00, 48 thousand requests" for free. Arrow keys move by cell; Home/End jump rows.',
  props: [
    ['valueKey', 'string', '—', 'Key encoded as colour.'],
    ['scale', '"sequential" | "diverging"', '"sequential"', 'Colour mapping.'],
    ['domain', '[number, number]', 'auto', 'Clamp the colour scale.'],
    ['showValues', 'boolean', 'false', 'Print values inside cells.'],
  ],
})

// ── Gauge ───────────────────────────────────────────────────────────────────
const GC: [number, number] = [300, 150], GR = 96
const g0 = Math.PI, g1 = 2 * Math.PI, gv = 0.72
const gseg = (a: number, b: number, c: string, op: number) =>
  sh(arc(GC[0], GC[1], GR, g0 + (g1 - g0) * a + 0.01, g0 + (g1 - g0) * b - 0.01), {
    stroke: c, sw: 18, op, lc: 'butt', role: 'series-0',
  })
const gs: Shape[] = [
  gseg(0, 0.5, 'var(--bg-3)', 1),
  gseg(0.5, 0.9, 'var(--bg-3)', 1),
  gseg(0.9, 1, 'var(--bg-3)', 1),
  sh(arc(GC[0], GC[1], GR, g0, g0 + (g1 - g0) * gv), { stroke: AC, sw: 18, lc: 'round', role: 'series-0' }),
]
const na = g0 + (g1 - g0) * gv
const [nx, ny] = pol(GC[0], GC[1], GR - 26, na)
gs.push(
  sh(`M${GC[0]} ${GC[1]}L${f(nx)} ${f(ny)}`, { stroke: 'var(--fg)', sw: 2.5, lc: 'round', role: 'reference' }),
  sh(circ(GC[0], GC[1], 5), { fill: 'var(--fg)', role: 'reference' }),
)
;[0, 0.25, 0.5, 0.75, 1].forEach((t) => {
  const a = g0 + (g1 - g0) * t
  const [x0, y0] = pol(GC[0], GC[1], GR + 14, a)
  const [x1, y1] = pol(GC[0], GC[1], GR + 19, a)
  gs.push(sh(`M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}`, { stroke: 'var(--line-2)', sw: 1, role: 'series-3' }))
})
;[0.5, 0.9].forEach((t) => {
  const a = g0 + (g1 - g0) * t
  const [x0, y0] = pol(GC[0], GC[1], GR - 12, a)
  const [x1, y1] = pol(GC[0], GC[1], GR + 12, a)
  gs.push(sh(`M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}`, { stroke: t === 0.5 ? WARN : OK, sw: 1.5, role: 'series-1' }))
})
const [gx90, gy90] = pol(GC[0], GC[1], GR + 28, g0 + (g1 - g0) * 0.9)

const gauge = makePage({
  id: 'gauge', name: 'Gauge',
  tagline: 'One value against a range, with thresholds. The needle settles on a spring-free curve; crossing a threshold recolours the arc and announces the new band.',
  tree: tree(
    [['◠', 'GaugeSeries', 'perf', 'active', 'series-0'], ['⊟', 'Thresholds', '[50, 90]', '', 'series-1'], ['◎', 'CenterLabel', '', '', 'series-2'], ['⋮', 'Ticks', '', '', 'series-3']],
    [['▭', 'Tooltip']],
    false,
  ),
  shapes: gs,
  texts: [
    tx(300, 128, '72', { a: 'middle', fill: 'var(--fg)', size: 34, w: 600, sans: true, role: 'series-2' }),
    tx(300, 146, 'Lighthouse performance', { a: 'middle', size: 10, role: 'series-2' }),
    tx(GC[0] - GR - 4, GC[1] + 14, '0', { a: 'middle' }),
    tx(GC[0] + GR + 4, GC[1] + 14, '100', { a: 'middle' }),
    tx(300, GC[1] - GR - 22, '50', { a: 'middle', fill: WARN }),
    tx(gx90, gy90, '90', { a: 'middle', fill: OK }),
    tx(40, 60, 'Band', { size: 10, role: 'series-2' }),
    tx(40, 78, 'Needs work', { sans: true, fill: WARN, size: 12, w: 600, role: 'series-2' }),
    tx(560, 60, 'Δ 7d', { a: 'end', size: 10, role: 'series-2' }),
    tx(560, 78, '+6', { a: 'end', sans: true, fill: OK, size: 12, w: 600, role: 'series-2' }),
  ],
  xlabels: [],
  tipShow: false,
  tip: { left: '0', title: '', rows: [], fl: '', fv: '', fc: '' },
  legend: [{ c: ERR, l: '0–49 poor' }, { c: WARN, l: '50–89 needs work' }, { c: OK, l: '90–100 good' }],
  note: 'needle settle 600ms · arc sweep 500ms · value via NumberFlow',
  code: code([
    open('ChartContainer', [['data', '{score}', false]]),
    selfc('GaugeSeries', [['value', '{72}', false], ['min', '{0}', false], ['max', '{100}', false], ['thresholds', '{[50, 90]}', false], ['shape', '"arc"']]),
    selfc('CenterLabel', [['format', '"integer"'], ['caption', '"Lighthouse performance"']]),
    close('ChartContainer'),
  ]),
  variants: [
    ['Arc', 'Default 180° semicircle; angle up to 270°.'],
    ['Ring', 'shape="ring" for a full circle, value in the middle.'],
    ['Linear', 'shape="bar" — a thick progress bar with threshold ticks.'],
    ['Multi', 'Stack several GaugeSeries as concentric rings.'],
  ],
  motion: [
    ['ENTER', '--dur-600 · settle', 'arc sweeps via stroke-dashoffset while the needle rotates on the same curve; label counts up with NumberFlow'],
    ['UPDATE', '--dur-400 · settle', 'needle and arc interpolate to the new value; threshold recolour is a 150ms crossfade'],
    ['REDUCED', '--dur-120 · linear', 'final position fades in; value appears without counting'],
  ],
  a11y: 'Exposes role="meter" with aria-valuemin/max/now and the band name in aria-valuetext ("72, needs work"). Threshold crossings announce politely.',
  props: [
    ['value', 'number', '—', 'Current value.'],
    ['min / max', 'number', '0 / 100', 'Range.'],
    ['thresholds', 'number[]', '[]', 'Band boundaries; colours cycle err → warn → ok.'],
    ['shape', '"arc" | "ring" | "bar"', '"arc"', 'Geometry.'],
  ],
})

// ── Sparkline ───────────────────────────────────────────────────────────────
const sparkPath = (arr: number[], x0: number, x1: number, y0: number, y1: number) => {
  const mx = Math.max(...arr), mn = Math.min(...arr)
  return arr
    .map((v, i) => `${i ? 'L' : 'M'}${f(x0 + (i * (x1 - x0)) / (arr.length - 1))} ${f(y1 - ((v - mn) / (mx - mn)) * (y1 - y0))}`)
    .join('')
}
const SP: [string, number[], string, string, string, string, 'line' | 'bar' | 'status'][] = [
  ['Requests', [12, 14, 13, 18, 17, 22, 21, 26, 30, 29, 33, 36], '1.24M', '+12.4%', OK, AC, 'line'],
  ['p95 latency', [40, 38, 41, 37, 35, 36, 33, 31, 30, 32, 29, 28], '142ms', '−18ms', OK, N, 'line'],
  ['Error rate', [5, 9, 7, 12, 10, 14, 13, 15, 19, 17, 21, 24], '1.9%', '+0.3pp', ERR, ERR, 'bar'],
  ['Uptime', [1, 1, 1, 1, 0.5, 1, 1, 0, 1, 1, 1, 1], '99.9%', '2 incidents', 'var(--fg-3)', OK, 'status'],
]
const sps: Shape[] = []
const spt: TextNode[] = []
SP.forEach(([l2, arr, v, d, dc, c, kind], i) => {
  const y = T + 8 + i * 46, y0 = y + 4, y1 = y + 30
  const seriesRole = `series-${i}`
  sps.push(sh(`M${L} ${f(y1 + 10)}H${R}`, { stroke: 'var(--line)', sw: 1, role: 'grid' }))
  if (kind === 'line') {
    sps.push(sh(sparkPath(arr, 150, 420, y0, y1), { stroke: c, sw: 2, role: seriesRole }))
    // End marker — tag it as series-3 so clicking "EndMarker" (index 3 in the tree) isolates markers across all lines.
    sps.push(sh(
      circ(420, y1 - ((arr[11] - Math.min(...arr)) / (Math.max(...arr) - Math.min(...arr))) * (y1 - y0), 3),
      { fill: c, role: 'series-3' },
    ))
  } else if (kind === 'bar') {
    arr.forEach((a, j) =>
      sps.push(sh(rect(150 + j * 23, y1 - (a / 24) * 26, 14, (a / 24) * 26), {
        fill: c, op: j === 11 ? 1 : 0.55, role: seriesRole,
      })),
    )
  } else {
    arr.forEach((a, j) =>
      sps.push(sh(rect(150 + j * 23, y0 + 6, 18, 16), {
        fill: a === 1 ? OK : a === 0.5 ? WARN : ERR, role: seriesRole,
      })),
    )
  }
  spt.push(
    tx(L, y + 16, l2, { sans: true, fill: 'var(--fg-2)', size: 12 }),
    tx(L, y + 30, 'last 12h', { size: 9.5 }),
    tx(500, y + 14, v, { a: 'end', fill: 'var(--fg)', size: 15, w: 600, sans: true }),
    tx(500, y + 29, d, { a: 'end', fill: dc, size: 10 }),
  )
})

const sparkline = makePage({
  id: 'sparkline', name: 'Sparkline',
  tagline: 'Word-sized charts for tables and KPI rows. No axes, no legend — just the shape, an end marker and the number it belongs to. Three kinds: line, bar and status.',
  tree: tree(
    [['∿', 'Sparkline', 'line', 'active', 'series-0'], ['▮', 'Sparkline', 'bar', '', 'series-1'], ['▰', 'Sparkline', 'status', '', 'series-2'], ['●', 'EndMarker', '', '', 'series-3']],
    [['▭', 'Tooltip', 1]],
    false,
  ),
  shapes: sps,
  texts: spt,
  xlabels: [],
  tip: {
    left: '56%', title: 'Requests · 11:00',
    rows: [{ c: AC, l: 'Value', v: '36.0k' }],
    fl: 'vs 12h ago', fv: '+200%', fc: OK,
  },
  legend: [],
  note: 'draw 300ms swift-out · end marker pops last · hover shows a minimal tooltip',
  code: code([
    open('Table.Row', []),
    [['dim', '  <'], ['tag', 'Table.Cell'], ['dim', '>'], ['val', 'Requests'], ['dim', '</'], ['tag', 'Table.Cell'], ['dim', '>']],
    [
      ['dim', '  <'], ['tag', 'Table.Cell'], ['dim', '>'], ['dim', '<'], ['tag', 'Sparkline'],
      ['attr', ' data='], ['val', '{series}'], ['attr', ' type='], ['str', '"line"'],
      ['attr', ' width='], ['val', '{120}'], ['attr', ' endMarker'],
      ['dim', ' /></'], ['tag', 'Table.Cell'], ['dim', '>'],
    ],
    [
      ['dim', '  <'], ['tag', 'Table.Cell'], ['attr', ' align='], ['str', '"right"'], ['dim', '>'],
      ['dim', '<'], ['tag', 'NumberFlow'], ['attr', ' value='], ['val', '{1240000}'],
      ['attr', ' format='], ['str', '"compact"'], ['dim', ' /></'], ['tag', 'Table.Cell'], ['dim', '>'],
    ],
    close('Table.Row'),
  ]),
  variants: [
    ['Line', 'Default; optional area fill at 15% and end marker.'],
    ['Bar', 'Twelve bars max; the last is full opacity, the rest 55%.'],
    ['Status', 'Discrete states (ok / warn / err) as a strip — uptime, checks.'],
    ['Reference', 'baseline={value} colours above/below segments in ok/err.'],
  ],
  motion: [
    ['ENTER', '--dur-300 · swift-out', 'line draws left → right; bars grow with 10ms stagger; end marker pops at the end'],
    ['HOVER', '--dur-100 · linear', 'nearest point highlighted; minimal tooltip (value + time) appears above'],
    ['REDUCED', '--dur-120 · linear', 'shape fades in complete'],
  ],
  a11y: 'Sparklines are decorative by default (aria-hidden) because the adjacent number is the data. Pass label to make one self-describing: "Requests, trending up, 12 to 36 thousand".',
  props: [
    ['type', '"line" | "bar" | "status"', '"line"', 'Rendering kind.'],
    ['endMarker', 'boolean', 'true', 'Dot on the last point (line only).'],
    ['baseline', 'number', '—', 'Split colour above/below a value.'],
    ['label', 'string', '—', 'Makes the sparkline accessible instead of decorative.'],
  ],
})

export const CHART_PAGES: Record<string, ChartPage> = {
  area,
  bar,
  'pie-donut': pie,
  scatter,
  candle,
  radar,
  funnel,
  waterfall,
  treemap,
  heatmap,
  gauge,
  sparkline,
}

export const CHART_PAGE_ORDER = [
  'area', 'bar', 'pie-donut', 'scatter', 'candle', 'radar',
  'funnel', 'waterfall', 'treemap', 'heatmap', 'gauge', 'sparkline',
] as const
