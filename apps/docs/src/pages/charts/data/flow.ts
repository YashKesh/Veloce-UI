import {
  makePage, tree, sh, tx, rect, circ, arc, pol,
  code, open, selfc, close,
  AC, AC60, AC35, N, mix,
  type ChartPage,
} from '../chartsData'

// ── Sankey ──────────────────────────────────────────────────────────────────
// Three columns of nodes (rect) with curved bezier ribbons between them.
// Demo: budget flows (Income → departments → outcomes).
// ribbon = thick curve approximated by a filled band between two bezier edges
const ribbon = (x0: number, y0a: number, y0b: number, x1: number, y1a: number, y1b: number) => {
  const cx = (x0 + x1) / 2
  return `M${x0} ${y0a}C${cx} ${y0a} ${cx} ${y1a} ${x1} ${y1a}` +
    `L${x1} ${y1b}C${cx} ${y1b} ${cx} ${y0b} ${x0} ${y0b}Z`
}
const NW = 12
const sankey = makePage({
  id: 'sankey', name: 'Sankey diagram',
  tagline: 'Weighted flows between stages. Node columns are sized by throughput; curved ribbons keep width proportional to value so splits and merges read at a glance.',
  tree: tree(
    [['⇄', 'SankeyLinks', 'value', 'active', 'series-0'], ['▭', 'SankeyNodes', 'id', 'focus', 'series-1']],
    [['▭', 'Tooltip', 1], ['≡', 'Legend']],
    false,
  ),
  shapes: [
    // ribbons (drawn first, behind nodes)
    sh(ribbon(42 + NW, 40, 92, 300, 40, 84), { fill: AC, op: 0.3, role: 'series-0' }),
    sh(ribbon(42 + NW, 96, 150, 300, 108, 160), { fill: AC60, op: 0.3, role: 'series-0' }),
    sh(ribbon(300 + NW, 40, 84, 546, 48, 88), { fill: AC, op: 0.3, role: 'series-0' }),
    sh(ribbon(300 + NW, 108, 160, 546, 112, 170), { fill: AC35, op: 0.35, role: 'series-0' }),
    // nodes: source column
    sh(rect(42, 40, NW, 56), { fill: AC, role: 'series-1' }),
    sh(rect(42, 96, NW, 58), { fill: AC60, role: 'series-1' }),
    // middle column
    sh(rect(300, 40, NW, 68), { fill: AC, role: 'series-1' }),
    sh(rect(300, 108, NW, 56), { fill: AC60, role: 'series-1' }),
    // target column
    sh(rect(546, 48, NW, 44), { fill: AC, role: 'series-1' }),
    sh(rect(546, 112, NW, 62), { fill: AC35, role: 'series-1' }),
  ],
  texts: [
    tx(38, 32, 'Income', { a: 'end', sans: true, fill: 'var(--fg-2)', size: 11, role: 'series-1' }),
    tx(38, 90, 'Loans', { a: 'end', sans: true, fill: 'var(--fg-2)', size: 11, role: 'series-1' }),
    tx(318, 32, 'Product', { sans: true, fill: 'var(--fg)', size: 11, w: 600, role: 'series-1' }),
    tx(318, 102, 'Sales', { sans: true, fill: 'var(--fg-2)', size: 11, role: 'series-1' }),
    tx(540, 42, 'Growth', { a: 'end', sans: true, fill: 'var(--fg-2)', size: 11, role: 'series-1' }),
    tx(540, 106, 'Reserve', { a: 'end', sans: true, fill: 'var(--fg-2)', size: 11, role: 'series-1' }),
  ],
  xlabels: [],
  tip: {
    left: '50%', title: 'Income → Product',
    rows: [{ c: AC, l: 'Flow', v: '$1.2M' }, { c: AC60, l: 'Share', v: '58%' }],
    fl: 'Node total', fv: '$2.1M', fc: 'var(--fg)',
  },
  legend: [{ c: AC, l: 'Primary flow' }, { c: AC60, l: 'Secondary' }, { c: AC35, l: 'Residual' }],
  note: 'ribbons draw 600ms · node hover highlights its links',
  code: code([
    open('ChartContainer', [['nodes', '{budget.nodes}', false], ['links', '{budget.links}', false]]),
    selfc('SankeyNodes', [['nodeKey', '"id"'], ['labelKey', '"label"']]),
    selfc('SankeyLinks', [['valueKey', '"value"'], ['curvature', '{0.5}', false]]),
    close('ChartContainer'),
  ]),
  variants: [
    ['Left-right', 'Default horizontal flow; columns auto-placed by longest path.'],
    ['Top-down', 'orientation="vertical" stacks stages for tall funnels.'],
    ['Aligned', 'nodeAlign="justify" spreads terminal nodes to the edges.'],
  ],
  motion: [
    ['ENTER', '--dur-600 · swift-out', 'ribbons grow from source to target; nodes fade in with their column'],
    ['HOVER', '--dur-150 · linear', 'hovered node dims unrelated links to 10% and raises its own ribbons'],
    ['REDUCED', '--dur-120 · linear', 'diagram fades in complete; hover swaps to a 2px link outline'],
  ],
  a11y: 'Exposed as a nested list: each node is a group whose children are its outgoing links with target and value. Arrow keys walk the columns; the live region reads "Income flows $1.2M to Product".',
  props: [
    ['nodes', 'SankeyNode[]', '—', 'Node records: { id, label }.'],
    ['links', 'SankeyLink[]', '—', 'Flows: { source, target, value }. value > 0.'],
    ['curvature', 'number (0–1)', '0.5', 'Bend of the link ribbons.'],
    ['nodeWidth', 'number', '14', 'Width of each node rectangle in px.'],
  ],
})

// ── Chord ─────────────────────────────────────────────────────────────────
// Circular arc segments + bezier chords across the circle. Demo: trade between regions.
const CC: [number, number] = [300, 108]
const CR = 78
const chordSeg = (a0: number, a1: number) => arc(CC[0], CC[1], CR, a0, a1)
const chordLink = (a0: number, a1: number) => {
  const [x0, y0] = pol(CC[0], CC[1], CR - 2, a0)
  const [x1, y1] = pol(CC[0], CC[1], CR - 2, a1)
  return `M${x0.toFixed(1)} ${y0.toFixed(1)}Q${CC[0]} ${CC[1]} ${x1.toFixed(1)} ${y1.toFixed(1)}`
}
const TAU = Math.PI * 2
const chord = makePage({
  id: 'chord', name: 'Chord diagram',
  tagline: 'Relationships inside one population. Arc segments sit on a ring sized by total volume; ribbons across the circle show how much each group sends to every other.',
  tree: tree(
    [['◠', 'ChordArcs', 'labels', 'active', 'series-0'], ['⇄', 'ChordRibbons', 'matrix', 'focus', 'series-1']],
    [['▭', 'Tooltip', 1], ['≡', 'Legend']],
    false,
  ),
  shapes: [
    // ring arc segments (four groups)
    sh(chordSeg(-Math.PI / 2 + 0.04, 0.3), { stroke: AC, sw: 10, role: 'series-0' }),
    sh(chordSeg(0.34, TAU * 0.3 - Math.PI / 2), { stroke: AC60, sw: 10, role: 'series-0' }),
    sh(chordSeg(TAU * 0.3 - Math.PI / 2 + 0.04, TAU * 0.62 - Math.PI / 2), { stroke: AC35, sw: 10, role: 'series-0' }),
    sh(chordSeg(TAU * 0.62 - Math.PI / 2 + 0.04, TAU - Math.PI / 2 - 0.04), { stroke: N, sw: 10, op: 0.6, role: 'series-0' }),
    // ribbons across the circle
    sh(chordLink(-Math.PI / 2 + 0.15, TAU * 0.3 - Math.PI / 2 + 0.2), { stroke: AC, sw: 2, op: 0.5, role: 'series-1' }),
    sh(chordLink(0.1, TAU * 0.45 - Math.PI / 2), { stroke: AC60, sw: 2, op: 0.5, role: 'series-1' }),
    sh(chordLink(-Math.PI / 2 + 0.2, TAU * 0.75 - Math.PI / 2), { stroke: AC, sw: 2.5, op: 0.55, role: 'series-1' }),
    sh(chordLink(TAU * 0.35 - Math.PI / 2, TAU * 0.8 - Math.PI / 2), { stroke: AC35, sw: 2, op: 0.5, role: 'series-1' }),
  ],
  texts: [
    tx(300, 30, 'APAC', { a: 'middle', sans: true, fill: 'var(--fg)', size: 10, w: 600, role: 'series-0' }),
    tx(390, 120, 'EMEA', { a: 'start', sans: true, fill: 'var(--fg-2)', size: 10, role: 'series-0' }),
    tx(300, 198, 'LATAM', { a: 'middle', sans: true, fill: 'var(--fg-2)', size: 10, role: 'series-0' }),
    tx(210, 120, 'NA', { a: 'end', sans: true, fill: 'var(--fg-2)', size: 10, role: 'series-0' }),
  ],
  xlabels: [],
  tip: {
    left: '50%', title: 'APAC ⇄ EMEA',
    rows: [{ c: AC, l: 'APAC → EMEA', v: '$420M' }, { c: AC60, l: 'EMEA → APAC', v: '$310M' }],
    fl: 'Net', fv: '+$110M', fc: 'var(--fg)',
  },
  legend: [{ c: AC, l: 'APAC' }, { c: AC60, l: 'EMEA' }, { c: AC35, l: 'LATAM' }, { c: N, l: 'NA' }],
  note: 'arcs sweep 500ms · hovering an arc isolates its ribbons',
  code: code([
    open('ChartContainer', [['matrix', '{trade}', false], ['labels', '{regions}', false]]),
    selfc('ChordArcs', [['padAngle', '{0.04}', false]]),
    selfc('ChordRibbons', [['opacity', '{0.5}', false]]),
    close('ChartContainer'),
  ]),
  variants: [
    ['Directed', 'Asymmetric matrix renders source/target halves of each ribbon.'],
    ['Symmetric', 'Equal matrix[i][j] and matrix[j][i] for undirected relationships.'],
    ['Sorted', 'sort="descending" orders groups by total volume around the ring.'],
  ],
  motion: [
    ['ENTER', '--dur-500 · swift-out', 'arcs sweep clockwise, then ribbons fade in from the ring inward'],
    ['HOVER', '--dur-150 · linear', 'hovered arc keeps full opacity; unrelated ribbons drop to 8%'],
    ['REDUCED', '--dur-120 · linear', 'figure fades in complete; hover highlights by stroke width only'],
  ],
  a11y: 'Each group is a list whose items are its ribbons with partner and value. The live region announces both directions, e.g. "APAC sends $420M to EMEA, receives $310M".',
  props: [
    ['matrix', 'number[][]', '—', 'Square flow matrix; matrix[i][j] = i → j volume.'],
    ['labels', 'string[]', '—', 'Group names, one per matrix row.'],
    ['colors', 'string[]', 'palette', 'Per-group colors; defaults to the accent palette.'],
    ['padAngle', 'number (rad)', '0.04', 'Gap between arc segments.'],
  ],
})

// ── Network ─────────────────────────────────────────────────────────────────
// circ() nodes + line() edges, force-directed look. Demo: dependency graph.
const edge = (x0: number, y0: number, x1: number, y1: number) => `M${x0} ${y0}L${x1} ${y1}`
const network = makePage({
  id: 'network', name: 'Network graph',
  tagline: 'Entities and the links between them. A deterministic force layout places hubs centrally; node radius encodes degree and edges fade by weight so clusters stay readable.',
  tree: tree(
    [['◉', 'NetworkNodes', 'id', 'active', 'series-0'], ['⇄', 'NetworkLinks', 'value', 'focus', 'series-1']],
    [['▭', 'Tooltip', 1], ['≡', 'Legend']],
    false,
  ),
  shapes: [
    // edges first
    sh(edge(300, 108, 180, 60), { stroke: 'var(--line-2)', sw: 1.5, role: 'series-1' }),
    sh(edge(300, 108, 430, 56), { stroke: 'var(--line-2)', sw: 1.5, role: 'series-1' }),
    sh(edge(300, 108, 200, 160), { stroke: 'var(--line-2)', sw: 1.5, role: 'series-1' }),
    sh(edge(300, 108, 420, 158), { stroke: 'var(--line-2)', sw: 1.5, role: 'series-1' }),
    sh(edge(180, 60, 100, 110), { stroke: 'var(--line)', sw: 1, role: 'series-1' }),
    sh(edge(430, 56, 500, 108), { stroke: 'var(--line)', sw: 1, role: 'series-1' }),
    sh(edge(200, 160, 420, 158), { stroke: 'var(--line)', sw: 1, role: 'series-1' }),
    // nodes: central hub
    sh(circ(300, 108, 16), { fill: 'var(--bg)', stroke: AC, sw: 2.5, role: 'series-0' }),
    sh(circ(180, 60, 9), { fill: AC60, role: 'series-0' }),
    sh(circ(430, 56, 9), { fill: AC60, role: 'series-0' }),
    sh(circ(200, 160, 8), { fill: AC35, role: 'series-0' }),
    sh(circ(420, 158, 8), { fill: AC35, role: 'series-0' }),
    sh(circ(100, 110, 6), { fill: N, op: 0.7, role: 'series-0' }),
    sh(circ(500, 108, 6), { fill: N, op: 0.7, role: 'series-0' }),
  ],
  texts: [
    tx(300, 112, 'core', { a: 'middle', sans: true, fill: AC, size: 9, w: 600, role: 'series-0' }),
    tx(180, 46, 'api', { a: 'middle', sans: true, fill: 'var(--fg-2)', size: 9, role: 'series-0' }),
    tx(430, 42, 'ui', { a: 'middle', sans: true, fill: 'var(--fg-2)', size: 9, role: 'series-0' }),
  ],
  xlabels: [],
  tip: {
    left: '50%', title: 'core',
    rows: [{ c: AC, l: 'Degree', v: '4' }, { c: AC60, l: 'Group', v: 'runtime' }],
    fl: 'Dependents', fv: '11', fc: 'var(--fg)',
  },
  legend: [{ c: AC, l: 'Hub' }, { c: AC60, l: 'Module' }, { c: AC35, l: 'Leaf' }],
  note: 'nodes settle 600ms · hover lifts a node and its neighbours',
  code: code([
    open('ChartContainer', [['nodes', '{graph.nodes}', false], ['links', '{graph.links}', false]]),
    selfc('NetworkNodes', [['nodeKey', '"id"'], ['sizeKey', '"value"'], ['groupKey', '"group"']]),
    selfc('NetworkLinks', [['weightKey', '"value"']]),
    close('ChartContainer'),
  ]),
  variants: [
    ['Force', 'Default spring layout; hubs drift to the centre.'],
    ['Radial', 'layout="radial" arranges groups on concentric rings.'],
    ['Clustered', 'Nodes grouped by `group` with intra-cluster attraction.'],
  ],
  motion: [
    ['ENTER', '--dur-600 · swift-out', 'edges draw then nodes ease to their resting positions'],
    ['HOVER', '--dur-150 · press', 'hovered node scales 1.15×; non-adjacent nodes and edges dim to 15%'],
    ['REDUCED', '--dur-120 · linear', 'graph fades in at rest; hover highlights neighbours by opacity only'],
  ],
  a11y: 'Rendered as an adjacency list: each node is a listitem announcing its label, group and degree, with its neighbours as nested items. Arrow keys traverse edges from the focused node.',
  props: [
    ['nodes', 'NetworkNode[]', '—', 'Nodes: { id, label, group?, value? }.'],
    ['links', 'NetworkLink[]', '—', 'Edges: { source, target, value? }.'],
    ['sizeKey', 'string', 'degree', 'Datum key driving node radius; falls back to degree.'],
    ['groupKey', 'string', '—', 'Key used to color and cluster nodes.'],
  ],
})

// ── Tile map ──────────────────────────────────────────────────────────────
// Grid of equal rect tiles (US-state cartogram) with abbreviations via tx().
const tiles: [string, number, number, number][] = [
  ['WA', 0, 0, 72], ['MT', 0, 1, 40], ['ND', 0, 2, 35], ['MN', 0, 3, 61], ['NY', 0, 5, 95],
  ['OR', 1, 0, 58], ['ID', 1, 1, 33], ['WY', 1, 2, 28], ['IA', 1, 3, 44], ['OH', 1, 4, 70], ['PA', 1, 5, 82],
  ['CA', 2, 0, 100], ['NV', 2, 1, 46], ['CO', 2, 2, 64], ['MO', 2, 3, 52], ['KY', 2, 4, 48], ['VA', 2, 5, 74],
  ['AZ', 3, 1, 57], ['NM', 3, 2, 38], ['TX', 3, 3, 90], ['TN', 3, 4, 55], ['NC', 3, 5, 68],
]
const TM_X = 150, TM_Y = 30, TM_C = 42, TM_T = 36
const tmFill = (v: number) => mix(Math.round(15 + (v / 100) * 75))
const tileMap = makePage({
  id: 'tile-map', name: 'Tile grid map',
  tagline: 'A cartogram that trades geographic accuracy for equal-area tiles. Every region gets the same square, placed on a coarse grid, so small states stay as visible as large ones.',
  tree: tree(
    [['▦', 'TileSeries', 'value', 'active', 'series-0'], ['≡', 'TileLabels', 'label', '', 'series-1']],
    [['▭', 'Tooltip', 1], ['≡', 'Legend', 1]],
    false,
  ),
  shapes: [
    ...tiles.map(([, r, c, v]) =>
      sh(rect(TM_X + c * TM_C, TM_Y + r * TM_C, TM_T, TM_T), {
        fill: tmFill(v), role: 'series-0',
      })),
  ],
  texts: tiles.map(([abbr, r, c, v]) =>
    tx(TM_X + c * TM_C + TM_T / 2, TM_Y + r * TM_C + TM_T / 2 + 3, abbr, {
      a: 'middle', sans: true, size: 9, w: 600,
      fill: v > 60 ? 'var(--bg)' : 'var(--fg-2)', role: 'series-1',
    })),
  xlabels: [],
  tip: {
    left: '58%', title: 'California',
    rows: [{ c: AC, l: 'Value', v: '100' }, { c: AC60, l: 'Rank', v: '1 of 50' }],
    fl: 'Share', fv: '12.4%', fc: 'var(--fg)',
  },
  legend: [{ c: AC35, l: 'Low' }, { c: AC60, l: 'Mid' }, { c: AC, l: 'High' }],
  note: 'tiles fade in by value 500ms · hover raises one tile',
  code: code([
    open('ChartContainer', [['data', '{states}', false]]),
    selfc('TileSeries', [['valueKey', '"value"'], ['rowKey', '"row"'], ['colKey', '"col"']]),
    selfc('TileLabels', [['labelKey', '"label"']]),
    close('ChartContainer'),
  ]),
  variants: [
    ['Sequential', 'Single-hue accent ramp for ordered magnitudes (default).'],
    ['Diverging', 'Two-hue scale around a midpoint for above/below values.'],
    ['Binned', 'scale="quantize" snaps values into labelled legend buckets.'],
  ],
  motion: [
    ['ENTER', '--dur-500 · swift-out', 'tiles fade and scale in, highest values first, staggered 12ms'],
    ['HOVER', '--dur-120 · press', 'tile lifts with a 1px outline; neighbours unaffected'],
    ['REDUCED', '--dur-120 · linear', 'grid fades in complete; hover shows outline only'],
  ],
  a11y: 'Presented as a data table with region, value and rank — the grid layout is decorative. Arrow keys move tile-to-tile; each cell announces its label and value with a sorted rank.',
  props: [
    ['data', 'TileDatum[]', '—', 'Tiles: { id, label, value, row, col }.'],
    ['valueKey', 'string', '"value"', 'Datum key mapped to the color scale.'],
    ['scale', '"sequential" | "quantize"', '"sequential"', 'Color scale type.'],
    ['tileGap', 'number', '4', 'Gap between tiles in px.'],
  ],
})

// ── Word cloud ──────────────────────────────────────────────────────────────
// Words placed via tx() at varying size by weight. Demo: tag frequencies.
const words: [string, number, number, number, string][] = [
  ['design', 300, 92, 34, AC],
  ['systems', 190, 56, 22, AC60],
  ['tokens', 420, 60, 20, AC60],
  ['motion', 150, 130, 16, AC35],
  ['accessible', 420, 136, 18, AC35],
  ['svg', 300, 150, 15, N],
  ['theme', 500, 100, 13, N],
  ['charts', 110, 96, 14, AC35],
]
const wordCloud = makePage({
  id: 'word-cloud', name: 'Word cloud',
  tagline: 'Term frequency as type size. Words spiral out from the centre, biggest first, each sized by weight and tinted by rank — a quick, scannable summary of what dominates a corpus.',
  tree: tree(
    [['✶', 'WordSeries', 'value', 'active', 'series-0']],
    [['▭', 'Tooltip', 1]],
    false,
  ),
  shapes: [],
  texts: words.map(([t, x, y, size, fill]) =>
    tx(x, y, t, { a: 'middle', sans: true, size, w: size > 24 ? 600 : 500, fill, role: 'series-0' })),
  xlabels: [],
  tip: {
    left: '50%', title: 'design',
    rows: [{ c: AC, l: 'Count', v: '1,284' }, { c: AC60, l: 'Rank', v: '1' }],
    fl: 'Share', fv: '9.2%', fc: 'var(--fg)',
  },
  legend: [{ c: AC, l: 'Most frequent' }, { c: AC35, l: 'Least frequent' }],
  note: 'words settle 600ms, largest first · hover scales one word',
  code: code([
    open('ChartContainer', [['words', '{tags}', false]]),
    selfc('WordSeries', [['textKey', '"text"'], ['valueKey', '"value"'], ['minFont', '{12}', false], ['maxFont', '{44}', false]]),
    close('ChartContainer'),
  ]),
  variants: [
    ['Spiral', 'Archimedean placement from the centre outward (default).'],
    ['Rows', 'layout="rows" packs words in justified lines for density.'],
    ['Rotated', 'Alternating 0°/90° orientation for a tighter fill.'],
  ],
  motion: [
    ['ENTER', '--dur-600 · swift-out', 'words fade and scale up from 0.6×, largest first, staggered 20ms'],
    ['HOVER', '--dur-120 · press', 'hovered word scales 1.1× and takes full accent; others dim to 40%'],
    ['REDUCED', '--dur-120 · linear', 'words appear in place at final size; hover changes color only'],
  ],
  a11y: 'Exposed as an ordered list sorted by frequency, so screen readers get the ranking that font size conveys visually. Each item announces the term and its count; decorative rotation is hidden.',
  props: [
    ['words', 'WordDatum[]', '—', 'Terms: { text, value }.'],
    ['minFont', 'number', '12', 'Font size for the least frequent word.'],
    ['maxFont', 'number', '44', 'Font size for the most frequent word.'],
    ['scale', '"linear" | "sqrt"', '"sqrt"', 'Maps value to font size.'],
  ],
})

export const FLOW_PAGES: Record<string, ChartPage> = {
  sankey, chord, network, 'tile-map': tileMap, 'word-cloud': wordCloud,
}
