import {
  makePage, tree, sh, tx, pol,
  code, open, close,
  AC, AC60, AC35, N, mix,
  type ChartPage,
} from '../chartsData'

// Illustration coordinate system: viewBox 0 0 600 240. Center ≈ (300, 108).
const CX = 300, CY = 108
const TAU = Math.PI * 2
const ringSector = (rIn: number, rOut: number, a0: number, a1: number): string => {
  const [x0, y0] = pol(CX, CY, rOut, a0)
  const [x1, y1] = pol(CX, CY, rOut, a1)
  const [x2, y2] = pol(CX, CY, rIn, a1)
  const [x3, y3] = pol(CX, CY, rIn, a0)
  const lg = a1 - a0 > Math.PI ? 1 : 0
  return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${rOut} ${rOut} 0 ${lg} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}A${rIn} ${rIn} 0 ${lg} 0 ${x3.toFixed(1)} ${y3.toFixed(1)}Z`
}
const wedge = (r: number, a0: number, a1: number): string => {
  const [x0, y0] = pol(CX, CY, r, a0)
  const [x1, y1] = pol(CX, CY, r, a1)
  const lg = a1 - a0 > Math.PI ? 1 : 0
  return `M${CX} ${CY}L${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 ${lg} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}Z`
}

// ── Sunburst ────────────────────────────────────────────────────────────────
// Website traffic by channel → sub-channel. Two concentric rings.
const sbInner: [number, number, string][] = [
  [0, TAU * 0.45, AC], // Organic 45%
  [TAU * 0.45, TAU * 0.75, AC60], // Paid 30%
  [TAU * 0.75, TAU, AC35], // Referral 25%
]
const sbOuter: [number, number, string][] = [
  [0, TAU * 0.28, mix(90)], // Search
  [TAU * 0.28, TAU * 0.45, mix(55)], // Social
  [TAU * 0.45, TAU * 0.62, mix(70)], // Display
  [TAU * 0.62, TAU * 0.75, mix(40)], // Video
  [TAU * 0.75, TAU * 0.9, mix(45)], // Partners
  [TAU * 0.9, TAU, mix(28)], // Blogs
]
const sbRot = -Math.PI / 2
const sunburst = makePage({
  id: 'sunburst', name: 'Sunburst chart',
  tagline: 'Concentric rings turn a value-weighted hierarchy into nested arcs. Each ring is a level; sweep angle encodes the rolled-up share, and children inherit a lighter tint of the parent.',
  tree: tree(
    [['◔', 'SunburstChart', 'traffic', 'active', 'series-0']],
    [['▭', 'Tooltip', 1]],
    false,
  ),
  shapes: [
    sh(`M${CX - 24} ${CY}a24 24 0 1 0 48 0a24 24 0 1 0 -48 0`, { fill: 'var(--bg)', stroke: 'var(--line-2)', sw: 1, role: 'polar' }),
    ...sbInner.map(([a0, a1, c]) => sh(ringSector(24, 54, a0 + sbRot, a1 + sbRot), { fill: c, stroke: 'var(--bg)', sw: 1, role: 'series-0' })),
    ...sbOuter.map(([a0, a1, c]) => sh(ringSector(54, 86, a0 + sbRot, a1 + sbRot), { fill: c, stroke: 'var(--bg)', sw: 1, role: 'series-0' })),
    sh(wedge(86, TAU * 0.1 + sbRot, TAU * 0.2 + sbRot), { fill: 'none', stroke: 'var(--fg-2)', sw: 1.5, dash: '3 3', role: 'tooltip-anchor' }),
  ],
  texts: [tx(CX, CY + 3, 'traffic', { a: 'middle', fill: N, size: 9 })],
  xlabels: [],
  tip: {
    left: '58.0%', title: 'Organic › Search',
    rows: [{ c: AC, l: 'Visits', v: '128.4k' }, { c: N, l: 'Share of parent', v: '62%' }],
    fl: 'Share of total', fv: '28%', fc: 'var(--fg)',
  },
  legend: [{ c: AC, l: 'Organic' }, { c: AC60, l: 'Paid' }, { c: AC35, l: 'Referral' }],
  note: 'rings sweep 500ms swift-out · staggered by depth',
  code: code([
    open('SunburstChart', [['data', '{traffic}', false], ['size', '320', false]]),
    close('SunburstChart'),
  ]),
  variants: [
    ['Depth limit', 'maxDepth collapses deeper levels into their last visible ancestor.'],
    ['Zoomable', 'Click a sector to re-root the layout to that branch.'],
    ['Value labels', 'Arcs wider than a threshold ink their rolled-up value inline.'],
  ],
  motion: [
    ['ENTER', '--dur-500 · swift-out', 'each ring sweeps 0→full angle; outer rings stagger behind their parents'],
    ['HOVER', '--dur-100 · linear', 'hovered branch keeps full opacity; siblings dim to 45%'],
    ['REDUCED', '--dur-120 · linear', 'final frame crossfades in without angular sweep'],
  ],
  a11y: 'The hierarchy is mirrored as a nested list; each node announces its name, value and share of parent, e.g. "Organic, 45 percent; Search, 28 percent of total".',
  props: [
    ['data', 'SunburstNode', '—', 'Root node with nested { name, value?, color?, children? }.'],
    ['size', 'number', '300', 'Square SVG edge in px; rings divide the radius evenly.'],
  ],
})

// ── Dendrogram ────────────────────────────────────────────────────────────────
// Org / file tree laid left→right. Root at left, leaves at right.
const dxRoot = 70, dxMid = 300, dxLeaf = 490
const leafY = [36, 72, 108, 144, 180]
const midY = [(leafY[0] + leafY[1]) / 2, (leafY[2] + leafY[3] + leafY[4]) / 3]
const rootY = (midY[0] + midY[1]) / 2
const elbow = (x0: number, y0: number, x1: number, y1: number): string =>
  `M${x0} ${y0}H${(x0 + x1) / 2}V${y1}H${x1}`
const dendrogram = makePage({
  id: 'dendrogram', name: 'Dendrogram',
  tagline: 'An explicit node-link tree drawn left-to-right. Elbow connectors join each parent to its children so depth reads as horizontal distance and sibling order reads top-to-bottom.',
  tree: tree(
    [['◇', 'DendrogramChart', 'taxonomy', 'active', 'series-0']],
    [['▭', 'Tooltip', 1]],
    false,
  ),
  shapes: [
    // links root → mids
    sh(elbow(dxRoot, rootY, dxMid, midY[0]), { stroke: 'var(--line-2)', sw: 1.5, role: 'series-0' }),
    sh(elbow(dxRoot, rootY, dxMid, midY[1]), { stroke: 'var(--line-2)', sw: 1.5, role: 'series-0' }),
    // links mids → leaves
    sh(elbow(dxMid, midY[0], dxLeaf, leafY[0]), { stroke: 'var(--line)', sw: 1.5, role: 'series-0' }),
    sh(elbow(dxMid, midY[0], dxLeaf, leafY[1]), { stroke: 'var(--line)', sw: 1.5, role: 'series-0' }),
    sh(elbow(dxMid, midY[1], dxLeaf, leafY[2]), { stroke: 'var(--line)', sw: 1.5, role: 'series-0' }),
    sh(elbow(dxMid, midY[1], dxLeaf, leafY[3]), { stroke: AC, sw: 2, role: 'tooltip-anchor' }),
    sh(elbow(dxMid, midY[1], dxLeaf, leafY[4]), { stroke: 'var(--line)', sw: 1.5, role: 'series-0' }),
    // nodes
    sh(`M${dxRoot - 6} ${rootY - 6}h12v12h-12z`, { fill: AC, role: 'series-0' }),
    sh(`M${dxMid - 5} ${midY[0] - 5}h10v10h-10z`, { fill: AC60, role: 'series-0' }),
    sh(`M${dxMid - 5} ${midY[1] - 5}h10v10h-10z`, { fill: AC60, role: 'series-0' }),
    ...leafY.map((y, i) => sh(`M${dxLeaf - 4} ${y - 4}h8v8h-8z`, { fill: i === 3 ? AC : AC35, role: i === 3 ? 'tooltip-anchor' : 'series-0' })),
  ],
  texts: [
    tx(dxRoot - 12, rootY + 3, 'root', { a: 'end', fill: N, size: 9 }),
    tx(dxLeaf + 10, leafY[3] + 3, 'Payments', { fill: 'var(--fg)', size: 9 }),
  ],
  xlabels: [],
  tip: {
    left: '70.0%', title: 'Services › Payments',
    rows: [{ c: AC, l: 'Depth', v: '2' }, { c: N, l: 'Siblings', v: '3' }],
    fl: 'Leaf node', fv: 'yes', fc: 'var(--fg)',
  },
  legend: [{ c: AC, l: 'Root' }, { c: AC60, l: 'Branch' }, { c: AC35, l: 'Leaf' }],
  note: 'links draw 450ms root→leaf · nodes pop 1→1.1→1',
  code: code([
    open('DendrogramChart', [['data', '{taxonomy}', false], ['width', '520', false], ['height', '300', false]]),
    close('DendrogramChart'),
  ]),
  variants: [
    ['Top-down', 'orient="vertical" drops children beneath parents instead of to the right.'],
    ['Radial', 'Project the tree onto a circle so leaves ring the root.'],
    ['Collapsible', 'Click a branch to fold its subtree into a single node.'],
  ],
  motion: [
    ['ENTER', '--dur-450 · swift-out', 'elbow links stroke-dash draw outward from the root; leaf nodes scale 0→1'],
    ['HOVER', '--dur-100 · linear', 'ancestor path to the hovered node highlights in accent'],
    ['REDUCED', '--dur-120 · linear', 'tree crossfades to its final layout; no path drawing'],
  ],
  a11y: 'The tree is exposed as a nested list with aria-level; each node names its label and child count, and the active branch is announced as the ancestor chain.',
  props: [
    ['data', 'DendroNode', '—', 'Root node with nested { name, children? }.'],
    ['width', 'number', '520', 'SVG width; depth maps across the inner width.'],
    ['height', 'number', '300', 'SVG height; leaves distribute evenly down it.'],
  ],
})

// ── Venn ────────────────────────────────────────────────────────────────────
// Audience overlap: three segments. Overlapping circles.
const vR = 48
const vOff = 34
const vTop: [number, number] = [CX, CY - 28]
const vBL: [number, number] = [CX - vOff, CY + 22]
const vBR: [number, number] = [CX + vOff, CY + 22]
const venn = makePage({
  id: 'venn', name: 'Venn diagram',
  tagline: 'Two or three sized circles whose overlaps show shared membership. Radius encodes set size and the blended intersections read as a distinct tone where audiences co-occur.',
  tree: tree(
    [['●', 'VennChart', 'sets', 'active', 'series-0']],
    [['▭', 'Tooltip', 1]],
    false,
  ),
  shapes: [
    sh(`M${vTop[0] - vR} ${vTop[1]}a${vR} ${vR} 0 1 0 ${2 * vR} 0a${vR} ${vR} 0 1 0 ${-2 * vR} 0`, { fill: AC, op: 0.32, stroke: AC, sw: 1.5, role: 'series-0' }),
    sh(`M${vBL[0] - vR} ${vBL[1]}a${vR} ${vR} 0 1 0 ${2 * vR} 0a${vR} ${vR} 0 1 0 ${-2 * vR} 0`, { fill: AC60, op: 0.32, stroke: AC60, sw: 1.5, role: 'series-0' }),
    sh(`M${vBR[0] - vR} ${vBR[1]}a${vR} ${vR} 0 1 0 ${2 * vR} 0a${vR} ${vR} 0 1 0 ${-2 * vR} 0`, { fill: mix(20), op: 0.42, stroke: N, sw: 1.5, role: 'tooltip-anchor' }),
  ],
  texts: [
    tx(vTop[0], vTop[1] - 20, 'Email', { a: 'middle', fill: 'var(--fg)', size: 9 }),
    tx(vBL[0] - 24, vBL[1] + 34, 'Push', { a: 'middle', fill: 'var(--fg)', size: 9 }),
    tx(vBR[0] + 24, vBR[1] + 34, 'In-app', { a: 'middle', fill: 'var(--fg)', size: 9 }),
  ],
  xlabels: [],
  tip: {
    left: '54.0%', title: 'Push ∩ In-app',
    rows: [{ c: AC60, l: 'Push', v: '18.2k' }, { c: N, l: 'In-app', v: '14.6k' }],
    fl: 'Shared users', fv: '5.1k', fc: 'var(--fg)',
  },
  legend: [{ c: AC, l: 'Email' }, { c: AC60, l: 'Push' }, { c: N, l: 'In-app' }],
  note: 'circles scale 400ms settle · overlaps fade in 150ms',
  code: code([
    open('VennChart', [['sets', '{sets}', false], ['width', '480', false], ['height', '300', false]]),
    close('VennChart'),
  ]),
  variants: [
    ['Two-set', 'Pass two sets for a single lens overlap.'],
    ['Weighted', 'Radius scales with the square root of size so area reads as the value.'],
    ['Labelled overlaps', 'Ink the intersection count inside each lens region.'],
  ],
  motion: [
    ['ENTER', '--dur-400 · settle', 'each circle scales 0→1 from its centre; fills ease to their opacity'],
    ['HOVER', '--dur-100 · linear', 'hovered set lifts to full opacity; others dim so the overlap pops'],
    ['REDUCED', '--dur-120 · linear', 'diagram crossfades in at final size'],
  ],
  a11y: 'Each set and intersection is a table row naming its members and shared count; "Push and In-app share 5.1 thousand users" is announced on focus.',
  props: [
    ['sets', 'VennSet[]', '—', 'Two or three { label, size } sets; size drives radius.'],
    ['width', 'number', '480', 'SVG width in px.'],
    ['height', 'number', '300', 'SVG height in px.'],
  ],
})

// ── Waffle ────────────────────────────────────────────────────────────────────
// Budget allocation as a 10×10 grid. 100 cells = 100%.
// Housing 42, Food 23, Transport 15, Savings 20.
const wCounts: [number, string, string][] = [
  [42, AC, 'Housing'],
  [23, AC60, 'Food'],
  [15, AC35, 'Transport'],
  [20, mix(20), 'Savings'],
]
const wCellColors: string[] = []
wCounts.forEach(([n, c]) => { for (let k = 0; k < n; k++) wCellColors.push(c) })
const wGap = 2.4, wCell = 15, wStep = wCell + wGap
const wX0 = CX - (10 * wStep - wGap) / 2
const wY0 = CY - (10 * wStep - wGap) / 2
const waffleCells: ReturnType<typeof sh>[] = []
for (let idx = 0; idx < 100; idx++) {
  const col = idx % 10
  const row = Math.floor(idx / 10)
  const x = wX0 + col * wStep
  const y = wY0 + (9 - row) * wStep
  const hot = idx === 55
  waffleCells.push(sh(`M${x.toFixed(1)} ${y.toFixed(1)}h${wCell}v${wCell}h${-wCell}z`, {
    fill: wCellColors[idx], op: hot ? 1 : 0.92,
    stroke: hot ? 'var(--fg-2)' : 'none', sw: hot ? 1.5 : 0,
    role: hot ? 'tooltip-anchor' : 'series-0',
  }))
}
const waffle = makePage({
  id: 'waffle', name: 'Waffle chart',
  tagline: 'A 10×10 grid where every cell is one percent. Categories claim contiguous blocks of cells so part-to-whole shares read as filled area without a single dominant arc.',
  tree: tree(
    [['▦', 'WaffleChart', 'budget', 'active', 'series-0']],
    [['▭', 'Tooltip', 1], ['≡', 'Legend']],
  ),
  shapes: waffleCells,
  texts: [],
  xlabels: [],
  tip: {
    left: '52.0%', title: 'Savings',
    rows: [{ c: mix(20), l: 'Cells', v: '20 / 100' }, { c: N, l: 'Category', v: '4 of 4' }],
    fl: 'Share', fv: '20%', fc: 'var(--fg)',
  },
  legend: [{ c: AC, l: 'Housing' }, { c: AC60, l: 'Food' }, { c: AC35, l: 'Transport' }, { c: mix(20), l: 'Savings' }],
  note: 'cells fill 400ms · stagger 8ms row-major',
  code: code([
    open('WaffleChart', [['data', '{budget}', false], ['rows', '10', false], ['cols', '10', false]]),
    close('WaffleChart'),
  ]),
  variants: [
    ['Custom grid', 'rows and cols reshape the matrix, e.g. 5×20 for a wide strip.'],
    ['Single metric', 'One datum fills n cells to show a lone completion percentage.'],
    ['Icon cells', 'Swap squares for glyphs to make a pictogram unit chart.'],
  ],
  motion: [
    ['ENTER', '--dur-400 · swift-out', 'cells fill in row-major order with an 8ms stagger per cell'],
    ['HOVER', '--dur-100 · linear', 'hovered category keeps full opacity; other blocks dim to 55%'],
    ['REDUCED', '--dur-120 · linear', 'grid crossfades in fully filled'],
  ],
  a11y: 'The grid is summarised as a list of categories with cell counts; "Savings, 20 of 100 cells, 20 percent" is announced rather than reading 100 cells.',
  props: [
    ['data', 'WaffleChartDatum[]', '—', 'Array of { label, value, color? }; values distribute via largest-remainder.'],
    ['rows', 'number', '10', 'Grid row count.'],
    ['cols', 'number', '10', 'Grid column count.'],
    ['size', 'number', '300', 'Square SVG edge in px.'],
  ],
})

// ── Marimekko ────────────────────────────────────────────────────────────────
// Revenue by region (column width) × product mix (segment height).
// Widths proportional to region revenue; segments sum to 100% per column.
const mkCols: { label: string; w: number; segs: [number, string][] }[] = [
  { label: 'NA', w: 0.4, segs: [[0.5, AC], [0.3, AC60], [0.2, AC35]] },
  { label: 'EU', w: 0.33, segs: [[0.42, AC], [0.38, AC60], [0.2, AC35]] },
  { label: 'APAC', w: 0.27, segs: [[0.6, AC], [0.25, AC60], [0.15, AC35]] },
]
const mkL = 60, mkR = 540, mkT = 20, mkB = 180
const mkPlotW = mkR - mkL, mkPlotH = mkB - mkT, mkGap = 6
const mekkoShapes: ReturnType<typeof sh>[] = []
const mekkoTexts: ReturnType<typeof tx>[] = []
let mkCursor = mkL
mkCols.forEach((col, ci) => {
  const cw = col.w * (mkPlotW - mkGap * (mkCols.length - 1))
  let segTop = mkT
  col.segs.forEach(([frac, c], si) => {
    const h = frac * mkPlotH
    const hot = ci === 2 && si === 0
    mekkoShapes.push(sh(`M${mkCursor.toFixed(1)} ${segTop.toFixed(1)}h${cw.toFixed(1)}v${h.toFixed(1)}h${(-cw).toFixed(1)}z`, {
      fill: c, stroke: 'var(--bg)', sw: 1,
      role: hot ? 'tooltip-anchor' : si === 0 ? 'series-0' : 'series-0',
    }))
    segTop += h
  })
  mekkoTexts.push(tx(mkCursor + cw / 2, mkB + 14, col.label, { a: 'middle', fill: N, size: 9 }))
  mkCursor += cw + mkGap
})
const marimekko = makePage({
  id: 'marimekko', name: 'Marimekko chart',
  tagline: 'Variable-width stacked columns encode two dimensions at once: column width is one share, segment height is another. Area reads as the product, surfacing where value concentrates.',
  tree: tree(
    [['▭', 'MarimekkoChart', 'regions', 'active', 'series-0']],
    [['▭', 'Tooltip', 1], ['≡', 'Legend']],
  ),
  shapes: mekkoShapes,
  texts: mekkoTexts,
  xlabels: [],
  tip: {
    left: '78.0%', title: 'APAC › Enterprise',
    rows: [{ c: AC, l: 'Segment', v: '60%' }, { c: N, l: 'Region width', v: '27%' }],
    fl: 'Area share', fv: '16.2%', fc: 'var(--fg)',
  },
  legend: [{ c: AC, l: 'Enterprise' }, { c: AC60, l: 'Team' }, { c: AC35, l: 'Free' }],
  note: 'columns grow 450ms · widths ease from equal to weighted',
  code: code([
    open('MarimekkoChart', [['columns', '{regions}', false], ['width', '480', false], ['height', '300', false]]),
    close('MarimekkoChart'),
  ]),
  variants: [
    ['Sorted', 'Order columns by total so the widest region leads.'],
    ['Percent segments', 'Each column normalises its stack to 100% height.'],
    ['Value labels', 'Segments above a size threshold ink their area share.'],
  ],
  motion: [
    ['ENTER', '--dur-450 · swift-out', 'columns rise from the baseline while their widths ease from equal to weighted'],
    ['HOVER', '--dur-100 · linear', 'hovered segment holds; the rest of its column and siblings dim'],
    ['REDUCED', '--dur-120 · linear', 'chart crossfades in at final geometry'],
  ],
  a11y: 'Each column and segment is a table cell announcing both dimensions, e.g. "APAC, 27 percent of revenue; Enterprise, 60 percent of region, 16 percent of total area".',
  props: [
    ['columns', 'MekkoColumn[]', '—', 'Columns of { label, segments }; each segment is { label, value, color? }.'],
    ['width', 'number', '480', 'SVG width; column widths divide it by column totals.'],
    ['height', 'number', '300', 'SVG height; segment heights divide each column.'],
  ],
})

// ── Nightingale ────────────────────────────────────────────────────────────────
// Deaths by cause over a campaign — classic polar-area rose. 6 wedges.
const ngVals = [92, 64, 110, 48, 78, 56]
const ngMax = Math.max(...ngVals)
const ngRMax = 86
const ngStep = TAU / ngVals.length
const ngStart = -Math.PI / 2
const ngRings = [0.33, 0.66, 1]
const nightingale = makePage({
  id: 'nightingale', name: 'Nightingale rose',
  tagline: 'A polar-area diagram where equal-angle wedges vary by radius. Radius maps to the square root of value so area, not length, encodes the magnitude of each category.',
  tree: tree(
    [['⬡', 'NightingaleChart', 'causes', 'active', 'series-0']],
    [['▭', 'Tooltip', 1]],
    false,
  ),
  shapes: [
    ...ngRings.map((f) => sh(`M${(CX - ngRMax * f).toFixed(1)} ${CY}a${(ngRMax * f).toFixed(1)} ${(ngRMax * f).toFixed(1)} 0 1 0 ${(2 * ngRMax * f).toFixed(1)} 0a${(ngRMax * f).toFixed(1)} ${(ngRMax * f).toFixed(1)} 0 1 0 ${(-2 * ngRMax * f).toFixed(1)} 0`, {
      fill: 'none', stroke: 'var(--line)', sw: 1, dash: '2 4', role: 'polar',
    })),
    ...ngVals.map((v, i) => {
      const a0 = ngStart + i * ngStep
      const a1 = a0 + ngStep
      const r = Math.sqrt(v / ngMax) * ngRMax
      const hot = i === 2
      return sh(wedge(r, a0, a1), {
        fill: hot ? AC : i % 2 ? AC60 : AC35, op: hot ? 1 : 0.85,
        stroke: 'var(--bg)', sw: 1, role: hot ? 'tooltip-anchor' : 'series-0',
      })
    }),
  ],
  texts: [tx(CX, CY - ngRMax - 6, 'Causes', { a: 'middle', fill: N, size: 9 })],
  xlabels: [],
  tip: {
    left: '56.0%', title: 'Preventable',
    rows: [{ c: AC, l: 'Count', v: '110' }, { c: N, l: 'Peak cause', v: 'yes' }],
    fl: 'Share', fv: '25%', fc: 'var(--fg)',
  },
  legend: [{ c: AC, l: 'Preventable' }, { c: AC60, l: 'Wounds' }, { c: AC35, l: 'Other' }],
  note: 'wedges sweep + grow 500ms swift-out',
  code: code([
    open('NightingaleChart', [['data', '{causes}', false], ['size', '320', false]]),
    close('NightingaleChart'),
  ]),
  variants: [
    ['Stacked rose', 'Stack sub-series within each wedge for grouped polar areas.'],
    ['Linear radius', 'Map radius to value directly instead of its square root.'],
    ['Labelled', 'Ink each wedge value just beyond its outer edge.'],
  ],
  motion: [
    ['ENTER', '--dur-500 · swift-out', 'wedges sweep clockwise while their radii grow from the centre'],
    ['HOVER', '--dur-100 · linear', 'hovered wedge holds full opacity; neighbours dim to 55%'],
    ['REDUCED', '--dur-120 · linear', 'rose crossfades to its final radii without sweeping'],
  ],
  a11y: 'Wedges are a table of categories; each announces its value and share, e.g. "Preventable, 110, 25 percent of total", so area need not be judged by eye.',
  props: [
    ['data', 'NightingaleDatum[]', '—', 'Array of { label, value, color? }; one wedge per datum.'],
    ['size', 'number', '300', 'Square SVG edge; radius scales to the largest value.'],
  ],
})

export const HIERARCHY_PAGES: Record<string, ChartPage> = {
  sunburst, dendrogram, venn, waffle, marimekko, nightingale,
}
