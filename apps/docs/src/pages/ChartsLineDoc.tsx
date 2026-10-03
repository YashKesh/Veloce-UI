import { useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react'
import { ChartsShell, ChartsBreadcrumb, ChartsTitle, ChartsSourceTabs } from './charts/ChartsShell'
import { useTheme } from '../theme'

const mono: CSSProperties = { fontFamily: 'var(--font-mono)' }

// ---------------------------------------------------------------------------
// Shared chart math (mirrors the artboard script)
// viewBox 0 0 600 220, padding 20 all sides; y-domain 0–120.
// ---------------------------------------------------------------------------
const A = [42, 48, 45, 61, 58, 72, 69, 84, 91, 88, 104, 112] // Revenue
const B = [30, 34, 38, 36, 44, 47, 52, 50, 58, 63, 61, 70] // Costs

const xs = (i: number, n: number) => 20 + i * (560 / (n - 1))
const ys = (v: number) => 200 - (v / 120) * 180
const f1 = (n: number) => n.toFixed(1)

function lp(arr: number[]): string {
  return arr.map((v, i) => `${i === 0 ? 'M' : 'L'}${f1(xs(i, arr.length))} ${f1(ys(v))}`).join(' ')
}

function areaPath(arr: number[]): string {
  return `${lp(arr)} L${f1(xs(arr.length - 1, arr.length))} 200.0 L20.0 200.0 Z`
}

/** Closed band between two series (lower → upper), for stacked areas. */
function bandPath(lower: number[], upper: number[]): string {
  const fwd = lp(upper)
  const back = lower
    .map((v, i) => `L${f1(xs(i, lower.length))} ${f1(ys(v))}`)
    .reverse()
    .join(' ')
  return `${fwd} ${back} Z`
}

// Crosshair pinned at index 9
const tipX = xs(9, 12) // 478.2
const tipYA = ys(A[9]) // 68.0
const tipYB = ys(B[9]) // 105.5
const tipLeft = '79.7%'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const TOC = [
  { label: 'Basics', id: 'basics', active: true },
  { label: 'Area & stacking', id: 'area-stacking' },
  { label: 'Tooltip & crosshair', id: 'tooltip-crosshair' },
  { label: 'Draw-in motion', id: 'draw-in-motion' },
  { label: 'Components & API', id: 'components-api' },
  { label: 'Accessibility', id: 'accessibility' },
]

const h2Style: CSSProperties = { margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }
const proseStyle: CSSProperties = { margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--fg-2)', maxWidth: 760 }
const sectionStyle: CSSProperties = { scrollMarginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }
const codeBoxStyle: CSSProperties = {
  ...mono, margin: 0, padding: '18px 20px', border: '1px solid var(--line)', borderRadius: 10,
  background: 'var(--bg-1)', fontSize: 13, lineHeight: 1.65, color: 'var(--fg)', overflowX: 'auto',
}

// ---------------------------------------------------------------------------
// Interactive anatomy tree
// ---------------------------------------------------------------------------

interface TreeNode {
  id: string
  icon: string
  label: string
  meta?: string
  iconColor?: string
  children?: TreeNode[]
}

const TREE: TreeNode[] = [
  {
    id: 'chart', icon: '▣', label: 'ChartContainer',
    children: [
      {
        id: 'axes', icon: '╪', label: 'Axes',
        children: [
          { id: 'xaxis', icon: '—', label: 'XAxis', meta: 'band' },
          { id: 'yaxis', icon: '|', label: 'YAxis', meta: 'linear' },
          { id: 'grid', icon: '⋯', label: 'GridLines' },
        ],
      },
      {
        id: 'series', icon: '∿', label: 'Series',
        children: [
          { id: 'lineA', icon: '∿', label: 'LineSeries revenue', iconColor: 'var(--ac-text)' },
          { id: 'area', icon: '◢', label: 'AreaSeries revenue' },
          { id: 'lineB', icon: '∿', label: 'LineSeries costs' },
          { id: 'markers', icon: '●', label: 'Markers' },
        ],
      },
      {
        id: 'tooltip', icon: '▭', label: 'Tooltip',
        children: [{ id: 'tooltip-variant', icon: '·', label: 'variant', meta: '"multi"' }],
      },
      {
        id: 'crosshair', icon: '┼', label: 'Crosshair',
        children: [{ id: 'crosshair-snap', icon: '·', label: 'snap', meta: '"nearest"' }],
      },
      { id: 'legend', icon: '≡', label: 'Legend' },
    ],
  },
]

/** Which chart parts stay at full opacity when a tree node is selected (null = all). */
const FOCUS: Record<string, string[] | null> = {
  chart: null,
  axes: ['grid', 'xaxis', 'yaxis'],
  xaxis: ['xaxis'],
  yaxis: ['yaxis'],
  grid: ['grid'],
  series: ['area', 'lineA', 'lineB', 'markers'],
  lineA: ['lineA'],
  area: ['area'],
  lineB: ['lineB'],
  markers: ['markers'],
  tooltip: ['tooltip', 'crosshair', 'markers'],
  'tooltip-variant': ['tooltip'],
  crosshair: ['crosshair', 'markers'],
  'crosshair-snap': ['crosshair'],
  legend: ['legend'],
}

function allParentIds(nodes: TreeNode[]): string[] {
  return nodes.flatMap((n) => (n.children ? [n.id, ...allParentIds(n.children)] : []))
}

function visibleIds(nodes: TreeNode[], open: Record<string, boolean>): string[] {
  return nodes.flatMap((n) => [n.id, ...(n.children && open[n.id] ? visibleIds(n.children, open) : [])])
}

function Chevron({ open }: { open?: boolean }) {
  return (
    <span style={{ width: 14, fontSize: 10, color: 'var(--fg-3)', display: 'inline-flex', justifyContent: 'center', flexShrink: 0 }}>
      {open ? '⌄' : '›'}
    </span>
  )
}

function AnatomyPanel() {
  const [open, setOpen] = useState<Record<string, boolean>>({ chart: true, axes: true, series: true })
  const [selected, setSelected] = useState('series')
  const treeRef = useRef<HTMLDivElement>(null)

  const focusSet = FOCUS[selected] ?? null
  const dim = (part: string) => (focusSet && !focusSet.includes(part) ? 0.18 : 1)
  const fade: CSSProperties = { transition: 'opacity 200ms cubic-bezier(.22,1,.36,1)' }

  const onRowClick = (node: TreeNode, e: MouseEvent) => {
    if (e.altKey) {
      setOpen(Object.fromEntries(allParentIds(TREE).map((id) => [id, true])))
    } else if (node.children) {
      setOpen((prev) => ({ ...prev, [node.id]: !prev[node.id] }))
    }
    setSelected(node.id)
  }

  const onTreeKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const ids = visibleIds(TREE, open)
    const current = (document.activeElement as HTMLElement | null)?.dataset.node
    const i = current ? ids.indexOf(current) : -1
    const next = ids[Math.min(ids.length - 1, Math.max(0, i + (e.key === 'ArrowDown' ? 1 : -1)))]
    treeRef.current?.querySelector<HTMLButtonElement>(`[data-node="${next}"]`)?.focus()
  }

  const renderNode = (node: TreeNode): ReactNode => {
    const isOpen = !!open[node.id]
    const isSelected = selected === node.id
    return (
      <div key={node.id} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <button
          data-node={node.id}
          onClick={(e) => onRowClick(node, e)}
          style={{
            display: 'flex', alignItems: 'center', padding: '7px 8px', fontSize: 13.5, textAlign: 'left',
            borderRadius: 7, color: isSelected ? 'var(--ac-text)' : 'var(--fg-2)',
            background: isSelected ? 'var(--ac-soft)' : 'transparent',
            fontWeight: isSelected ? 500 : 400, width: '100%',
          }}
        >
          {node.children ? <Chevron open={isOpen} /> : <span style={{ width: 14, flexShrink: 0 }} />}
          <span style={{ width: 16, display: 'inline-flex', justifyContent: 'center', color: node.iconColor ?? 'var(--fg-3)', fontSize: 12, flexShrink: 0 }}>
            {node.icon}
          </span>
          <span style={{ marginLeft: 4 }}>{node.label}</span>
          {node.meta && <span style={{ ...mono, fontSize: 11, color: 'var(--fg-3)', marginLeft: 6 }}>{node.meta}</span>}
          <span style={{ marginLeft: 'auto', color: 'var(--fg-3)', fontSize: 11 }}>⊡</span>
        </button>
        {node.children && isOpen && (
          <div style={{ marginLeft: 15, paddingLeft: 8, borderLeft: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {node.children.map(renderNode)}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg-1)' }}>
      {/* Left: interactive TreeView */}
      <div style={{ borderRight: '1px solid var(--line)', padding: '10px 8px', display: 'flex', flexDirection: 'column' }}>
        <div ref={treeRef} onKeyDown={onTreeKeyDown} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {TREE.map(renderNode)}
        </div>
        <div style={{ ...mono, marginTop: 'auto', padding: '8px 8px 4px', borderTop: '1px solid var(--line)', fontSize: 11, color: 'var(--fg-3)', lineHeight: 1.5 }}>
          {'<TreeView>'} · click a node to isolate it · ↑ ↓ moves focus · ⌥-click expands all
        </div>
      </div>

      {/* Right: chart pane, parts dim according to the selected node */}
      <div style={{ padding: '20px 20px 12px', background: 'radial-gradient(var(--line) 1px, transparent 1px) 0 0/16px 16px, var(--bg)', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, fontSize: 12.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: 'var(--fg-2)', opacity: dim('legend'), ...fade }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 10, height: 3, borderRadius: 2, background: 'var(--ac)' }} /> Revenue
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 10, height: 3, borderRadius: 2, background: 'var(--fg-3)' }} /> Costs
            </span>
          </div>
          <span style={{ padding: 2, border: '1px solid var(--line)', borderRadius: 6, fontSize: 11.5, display: 'inline-flex' }}>
            <span style={{ padding: '3px 8px', borderRadius: 4, color: 'var(--fg-3)' }}>6M</span>
            <span style={{ padding: '3px 8px', borderRadius: 4, background: 'var(--bg-3)', color: 'var(--fg)' }}>1Y</span>
            <span style={{ padding: '3px 8px', borderRadius: 4, color: 'var(--fg-3)' }}>All</span>
          </span>
        </div>

        <svg viewBox="0 0 600 220" style={{ width: '100%', overflow: 'visible', display: 'block' }}>
          <defs>
            <linearGradient id="vl-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--ac)" stopOpacity=".28" />
              <stop offset="100%" stopColor="var(--ac)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g opacity={dim('grid')} style={fade}>
            <line x1={20} x2={580} y1={200} y2={200} stroke="var(--line-2)" />
            {[155, 110, 65, 20].map((y) => (
              <line key={y} x1={20} x2={580} y1={y} y2={y} stroke="var(--line)" strokeDasharray="2 4" />
            ))}
          </g>
          <g opacity={dim('yaxis')} style={fade}>
            <text x={586} y={203} fontSize={10} fill="var(--fg-3)" fontFamily="Geist Mono, monospace">0</text>
            <text x={586} y={113} fontSize={10} fill="var(--fg-3)" fontFamily="Geist Mono, monospace">60k</text>
            <text x={586} y={23} fontSize={10} fill="var(--fg-3)" fontFamily="Geist Mono, monospace">120k</text>
          </g>
          <path d={areaPath(A)} fill="url(#vl-area)" opacity={dim('area')} style={fade} />
          <path d={lp(B)} fill="none" stroke="var(--fg-3)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" opacity={dim('lineB')} style={fade} />
          <path d={lp(A)} fill="none" stroke="var(--ac)" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" opacity={dim('lineA')} style={fade} />
          <line x1={f1(tipX)} x2={f1(tipX)} y1={14} y2={200} stroke="var(--fg-2)" strokeDasharray="3 3" opacity={dim('crosshair')} style={fade} />
          <g opacity={dim('markers')} style={fade}>
            <circle cx={f1(tipX)} cy={f1(tipYB)} r={4.5} fill="var(--bg)" stroke="var(--fg-3)" strokeWidth={2} />
            <circle cx={f1(tipX)} cy={f1(tipYA)} r={5} fill="var(--bg)" stroke="var(--ac)" strokeWidth={2.5} />
            <circle cx={f1(tipX)} cy={f1(tipYA)} r={10} fill="none" stroke="var(--ac)" strokeOpacity=".3" strokeWidth={1} />
          </g>
        </svg>

        {/* Tooltip */}
        <div
          style={{
            position: 'absolute', top: 6, left: tipLeft, transform: 'translateX(calc(-100% - 14px))',
            width: 172, padding: '10px 12px', borderRadius: 9, background: 'var(--bg-2)', border: '1px solid var(--line-2)',
            boxShadow: 'var(--shadow-lg)', fontSize: 12.5, display: 'flex', flexDirection: 'column', gap: 6, boxSizing: 'border-box',
            opacity: dim('tooltip'), ...fade,
          }}
        >
          <span style={{ ...mono, fontSize: 11, color: 'var(--fg-3)' }}>Oct 2026</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--ac)', flexShrink: 0 }} />
            <span style={{ color: 'var(--fg-2)' }}>Revenue</span>
            <span style={{ marginLeft: 'auto', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>$88.0k</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--fg-3)', flexShrink: 0 }} />
            <span style={{ color: 'var(--fg-2)' }}>Costs</span>
            <span style={{ marginLeft: 'auto', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>$63.0k</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', paddingTop: 6, borderTop: '1px solid var(--line)', color: 'var(--fg-3)' }}>
            <span>Margin</span>
            <span style={{ marginLeft: 'auto', color: 'var(--ok)', fontVariantNumeric: 'tabular-nums' }}>28.4%</span>
          </div>
        </div>

        <div style={{ ...mono, display: 'flex', justifyContent: 'space-between', padding: '6px 14px 0 12px', fontSize: 10.5, color: 'var(--fg-3)', opacity: dim('xaxis'), ...fade }}>
          {MONTHS.map((m) => <span key={m}>{m}</span>)}
        </div>
        <div style={{ ...mono, position: 'absolute', right: 14, bottom: 10, fontSize: 11, color: 'var(--fg-3)' }}>
          draw-in 600ms swift-out · crosshair 100ms
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Draw-in motion demo (real animation, replayable)
// ---------------------------------------------------------------------------

function DrawInDemo() {
  const { reducedMotion } = useTheme()
  const [run, setRun] = useState(0)
  const anim = (name: string, dur: number, delay = 0): CSSProperties =>
    reducedMotion
      ? {}
      : { animation: `${name} ${dur}ms cubic-bezier(.22,1,.36,1) ${delay}ms both` }
  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-1)', overflow: 'hidden' }}>
      <style>{`
        @keyframes vl-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
        @keyframes vl-fade { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>Live demo{reducedMotion ? ' · reduced motion: final frame only' : ''}</div>
        <button
          onClick={() => setRun((n) => n + 1)}
          style={{
            padding: '5px 12px', borderRadius: 7, border: '1px solid var(--line-2)', fontSize: 12.5,
            color: 'var(--fg)', background: 'var(--bg-2)',
          }}
        >
          ↻ Replay
        </button>
      </div>
      <div key={run} style={{ position: 'relative', padding: 20, background: 'radial-gradient(var(--line) 1px, transparent 1px) 0 0/16px 16px, var(--bg)' }}>
        <svg viewBox="0 0 600 220" style={{ width: '100%', overflow: 'visible', display: 'block' }}>
          <defs>
            <linearGradient id="vl-area-demo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--ac)" stopOpacity=".28" />
              <stop offset="100%" stopColor="var(--ac)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1={20} x2={580} y1={200} y2={200} stroke="var(--line-2)" />
          {[155, 110, 65, 20].map((y) => (
            <line key={y} x1={20} x2={580} y1={y} y2={y} stroke="var(--line)" strokeDasharray="2 4" />
          ))}
          <path d={areaPath(A)} fill="url(#vl-area-demo)" style={anim('vl-fade', 300, 450)} />
          <path
            d={lp(B)} fill="none" stroke="var(--fg-3)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round"
            pathLength={1} strokeDasharray="1" style={anim('vl-draw', 600, 80)}
          />
          <path
            d={lp(A)} fill="none" stroke="var(--ac)" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round"
            pathLength={1} strokeDasharray="1" style={anim('vl-draw', 600)}
          />
          <g style={anim('vl-fade', 200, 600)}>
            <circle cx={580} cy={f1(ys(A[11]))} r={5} fill="var(--bg)" stroke="var(--ac)" strokeWidth={2.5} />
            <circle cx={580} cy={f1(ys(B[11]))} r={4.5} fill="var(--bg)" stroke="var(--fg-3)" strokeWidth={2} />
          </g>
        </svg>
        <div style={{ ...mono, position: 'absolute', right: 14, bottom: 10, fontSize: 11, color: 'var(--fg-3)' }}>
          lines draw 600ms · area fades at 450ms · markers land at 600ms
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Components & API reference
// ---------------------------------------------------------------------------

interface ApiEntry {
  name: string
  signature: string
  description: string
  props: { prop: string; detail: string }[]
  usage: string
}

const API: ApiEntry[] = [
  {
    name: 'ChartContainer',
    signature: '<ChartContainer data={rows} motion="draw" a11y={{ table: "toggle", announce: true }}>',
    description:
      'The root of every chart. It owns the data, computes the x/y scales from its axis children, sizes itself to its parent, and hands scales + theme down to every series. All other chart components must live inside it.',
    props: [
      { prop: 'data', detail: 'array of row objects — every dataKey below reads from these rows' },
      { prop: 'motion', detail: '"draw" | "rise" | "pop" | "none" — mount choreography for all series at once' },
      { prop: 'a11y', detail: 'hidden data-table mirror, live-region announcements, keyboard model' },
    ],
    usage: 'Use one container per chart. Mix any series types inside it — they share axes, tooltip, legend and the a11y layer automatically.',
  },
  {
    name: 'XAxis',
    signature: '<XAxis dataKey="month" scale="band" />',
    description:
      'Maps a row field to the horizontal scale and renders the tick labels under the plot. Band scale spaces categories evenly; time interprets Date values; linear is for numeric x.',
    props: [
      { prop: 'dataKey', detail: 'row field that drives the x position' },
      { prop: 'scale', detail: '"band" | "linear" | "time"' },
      { prop: 'ticks', detail: '"auto" or an explicit array of tick values' },
    ],
    usage: 'Months, weeks and categories want "band". Timestamps want "time" so zooming and brushing stay proportional.',
  },
  {
    name: 'YAxis',
    signature: '<YAxis max={120} format="compact" />',
    description:
      'Computes the vertical domain (auto from the data unless max is set) and renders right-aligned tick labels. format="compact" prints 60000 as 60k.',
    props: [
      { prop: 'max', detail: 'pin the top of the domain — keeps multiple charts comparable' },
      { prop: 'format', detail: '"compact" | "percent" | (v) => string' },
      { prop: 'label', detail: 'rotated axis title along the left edge' },
    ],
    usage: 'Pin max when several charts sit side by side; let it auto-fit for standalone charts.',
  },
  {
    name: 'GridLines',
    signature: '<GridLines />',
    description:
      'Dashed horizontal guides at each YAxis tick plus a solid baseline at zero. Purely visual — it never affects layout or scales.',
    props: [{ prop: 'dash', detail: 'dash pattern, default "2 4"' }],
    usage: 'Keep it in — lines without guides are hard to read against a dark canvas. Drop it only in sparkline-sized charts.',
  },
  {
    name: 'LineSeries',
    signature: '<LineSeries dataKey="revenue" curve="monotone" />',
    description:
      'One stroked path per series. Draws in along its own length on mount (stroke-dashoffset — pure CSS, no animation runtime). Add as many as the palette can distinguish.',
    props: [
      { prop: 'dataKey', detail: 'row field plotted on y' },
      { prop: 'color', detail: '"accent" (default) | "neutral" | "ok" | "err"' },
      { prop: 'curve', detail: '"monotone" | "linear" | "step"' },
      { prop: 'width', detail: 'stroke width, default 2.5 for the primary series' },
    ],
    usage: 'The first series gets the accent; give secondary series color="neutral" so the story stays focused. curve="step" is for values that change at discrete moments (pricing, limits, deploys).',
  },
  {
    name: 'AreaSeries',
    signature: '<AreaSeries dataKey="revenue" stackId="a" />',
    description:
      'A filled region under its line, closed to the baseline. Alone it renders a gradient fade; with a shared stackId several areas stack on top of each other into bands.',
    props: [
      { prop: 'dataKey', detail: 'row field plotted on y' },
      { prop: 'stackId', detail: 'areas with the same id stack; omit to overlay from the baseline' },
      { prop: 'fade', detail: '"bottom" (default gradient) | "none" for solid stacked bands' },
    ],
    usage: 'Use a single gradient area to emphasise magnitude, stacks to show composition. Keep stacks to ~3 bands and order them largest-first so lightness stays monotonic.',
  },
  {
    name: 'Markers',
    signature: '<Markers show="hover" />',
    description:
      'Point dots on top of a series. They fade in after the line finishes drawing, and the crosshair enlarges the nearest one.',
    props: [
      { prop: 'show', detail: '"hover" (default) | "end" | "all"' },
      { prop: 'r', detail: 'radius, default 4.5' },
    ],
    usage: '"end" puts a single dot on the latest value — good for KPI-style charts. "all" only works with few points.',
  },
  {
    name: 'Tooltip',
    signature: '<Tooltip variant="multi" snap="nearest" />',
    description:
      'A floating card that follows the pointer with a 100ms lerp and snaps to the nearest data point. variant="multi" lists every series at the hovered x; "minimal" is a single inverted value pill; render replaces the card entirely.',
    props: [
      { prop: 'variant', detail: '"multi" | "minimal"' },
      { prop: 'snap', detail: '"nearest" | "x" — snap to closest point or closest column' },
      { prop: 'render', detail: '({ row, series }) => ReactNode for fully custom cards' },
    ],
    usage: 'Use "multi" whenever more than one series is visible; use render to add derived rows like the margin % in the demo above.',
  },
  {
    name: 'Crosshair',
    signature: '<Crosshair labels />',
    description:
      'A dashed vertical guide locked to the snapped point, with ring highlights on each series it crosses. It is also the keyboard cursor: ← → steps through points, ↑ ↓ switches series.',
    props: [
      { prop: 'labels', detail: 'show the x value in a pill on the axis' },
      { prop: 'snap', detail: 'inherits the Tooltip snap unless set' },
    ],
    usage: 'Pair it with the Tooltip — the crosshair gives position, the tooltip gives values. Keyboard users get both via the same component.',
  },
  {
    name: 'Legend',
    signature: '<Legend interactive />',
    description:
      'Series chips above the plot. When interactive, clicking a chip toggles its series and hovering one dims every other series to 45% for 150ms.',
    props: [
      { prop: 'variant', detail: '"chips" (default) | "list" with per-series values' },
      { prop: 'interactive', detail: 'enables toggle + hover-isolate' },
    ],
    usage: 'Always render a legend with two or more series. The "list" variant doubles as a summary table for dashboards.',
  },
]

function ApiCard({ entry }: { entry: ApiEntry }) {
  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg-1)', overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{entry.name}</div>
        <code style={{ ...mono, fontSize: 12, color: 'var(--ac-text)' }}>{entry.signature}</code>
      </div>
      <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, lineHeight: 1.55, color: 'var(--fg-2)' }}>
        <p style={{ margin: 0 }}>{entry.description}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {entry.props.map((p) => (
            <div key={p.prop} style={{ display: 'flex', gap: 10, fontSize: 12.5 }}>
              <code style={{ ...mono, fontSize: 11.5, color: 'var(--fg)', width: 84, flexShrink: 0 }}>{p.prop}</code>
              <span style={{ color: 'var(--fg-2)' }}>{p.detail}</span>
            </div>
          ))}
        </div>
        <p style={{ margin: 0, paddingTop: 8, borderTop: '1px solid var(--line)', fontSize: 12.5, color: 'var(--fg-3)' }}>
          <span style={{ color: 'var(--fg)', fontWeight: 500 }}>When to reach for it — </span>
          {entry.usage}
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ChartsLineDoc() {
  return (
    <ChartsShell toc={TOC}>
      <ChartsBreadcrumb />
      <ChartsTitle
        title="Line chart"
        lead="Plot one or more series over a continuous axis. Lines draw in along their path, points settle last, and the crosshair follows the pointer with the same easing every other Veloce component uses."
      />
      <ChartsSourceTabs />

      {/* ---------------- Basics ---------------- */}
      <section id="basics" style={sectionStyle}>
        <h2 style={h2Style}>Basics</h2>
        <p style={proseStyle}>
          A line chart is composed, not configured: the container owns data and scales, and every
          visible part — axes, grid, each series, tooltip, crosshair, legend — is its own child
          component. Click a node in the tree to isolate the part it renders.
        </p>
        <AnatomyPanel />
        <pre style={codeBoxStyle}>
{`<ChartContainer data={rows} motion="draw">
  <XAxis dataKey="month" />  <YAxis format="compact" />
  <AreaSeries dataKey="revenue" />  <LineSeries dataKey="costs" color="neutral" />
  <Tooltip />  <Crosshair />  <Legend />
</ChartContainer>`}
        </pre>
      </section>

      {/* ---------------- Area & stacking ---------------- */}
      <section id="area-stacking" style={sectionStyle}>
        <h2 style={h2Style}>Area &amp; stacking</h2>
        <p style={proseStyle}>
          An <code style={{ ...mono, fontSize: 12.5, color: 'var(--fg)' }}>AreaSeries</code> on its own fills to the
          baseline with a gradient fade — use it to emphasise how much, not just the trend. Give two
          or more areas the same <code style={{ ...mono, fontSize: 12.5, color: 'var(--fg)' }}>stackId</code> and they
          stack into solid bands that show composition: each band starts where the previous one ends,
          and the top edge is the total.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg-1)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--line)', fontSize: 13, fontWeight: 600 }}>
              Overlay <span style={{ ...mono, fontSize: 11, color: 'var(--fg-3)', fontWeight: 400, marginLeft: 6 }}>no stackId · gradient</span>
            </div>
            <div style={{ padding: 14, background: 'var(--bg)' }}>
              <svg viewBox="0 0 600 220" style={{ width: '100%', display: 'block' }}>
                <line x1={20} x2={580} y1={200} y2={200} stroke="var(--line-2)" />
                <path d={areaPath(A)} fill="url(#vl-area-2)" />
                <defs>
                  <linearGradient id="vl-area-2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--ac)" stopOpacity=".28" />
                    <stop offset="100%" stopColor="var(--ac)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={lp(A)} fill="none" stroke="var(--ac)" strokeWidth={2.5} strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg-1)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--line)', fontSize: 13, fontWeight: 600 }}>
              Stacked <span style={{ ...mono, fontSize: 11, color: 'var(--fg-3)', fontWeight: 400, marginLeft: 6 }}>stackId="a" · solid bands</span>
            </div>
            <div style={{ padding: 14, background: 'var(--bg)' }}>
              <svg viewBox="0 0 600 220" style={{ width: '100%', display: 'block' }}>
                <line x1={20} x2={580} y1={200} y2={200} stroke="var(--line-2)" />
                <path d={areaPath(B)} fill="var(--ac)" opacity={0.6} />
                <path d={bandPath(B, A)} fill="var(--ac)" opacity={0.28} />
                <path d={lp(B)} fill="none" stroke="var(--ac)" strokeWidth={1.5} opacity={0.7} />
                <path d={lp(A)} fill="none" stroke="var(--ac)" strokeWidth={2} strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
        <pre style={codeBoxStyle}>
{`// overlay — magnitude of one series
<AreaSeries dataKey="revenue" />

// stacked — composition of a total (order largest-first)
<AreaSeries dataKey="costs" stackId="a" fade="none" />
<AreaSeries dataKey="margin" stackId="a" fade="none" />`}
        </pre>
        <p style={proseStyle}>
          Rules of thumb: stacks read best with at most three bands; keep band opacities monotonic
          (0.6 → 0.28 here) so depth encodes order; and never stack series with mixed signs — use a
          waterfall for that.
        </p>
      </section>

      {/* ---------------- Tooltip & crosshair ---------------- */}
      <section id="tooltip-crosshair" style={sectionStyle}>
        <h2 style={h2Style}>Tooltip &amp; crosshair</h2>
        <p style={proseStyle}>
          The crosshair snaps to the nearest data point and the tooltip follows it with a 100ms lerp —
          position comes from the crosshair, values from the tooltip. Three tooltip shapes cover most
          charts; the render prop replaces the card entirely when you need derived values.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ minWidth: 150, padding: '8px 10px', borderRadius: 8, background: 'var(--bg-2)', border: '1px solid var(--line-2)', boxShadow: 'var(--shadow-md)', fontSize: 12, display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ ...mono, fontSize: 10.5, color: 'var(--fg-3)' }}>Oct 12</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 7, height: 7, borderRadius: 2, background: 'var(--ac)' }} />
              <span style={{ color: 'var(--fg-2)' }}>Revenue</span>
              <span style={{ marginLeft: 'auto', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>$3.1k</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 7, height: 7, borderRadius: 2, background: 'var(--fg-3)' }} />
              <span style={{ color: 'var(--fg-2)' }}>Costs</span>
              <span style={{ marginLeft: 'auto', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>$2.2k</span>
            </div>
          </div>
          <span style={{ ...mono, padding: '4px 8px', borderRadius: 6, background: 'var(--fg)', color: 'var(--bg)', fontSize: 11, fontVariantNumeric: 'tabular-nums' }}>$3,104</span>
          <div style={{ minWidth: 160, padding: '8px 10px', borderRadius: 8, background: 'var(--bg-2)', border: '1px solid var(--line-2)', boxShadow: 'var(--shadow-md)', fontSize: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span>Chrome <span style={{ fontWeight: 500 }}>92k</span></span>
            <span style={{ display: 'block', height: 4, borderRadius: 2, background: 'var(--bg-3)' }}>
              <span style={{ display: 'block', width: '78%', height: 4, borderRadius: 2, background: 'var(--ac)' }} />
            </span>
            <span style={{ ...mono, fontSize: 10.5, color: 'var(--fg-3)' }}>78% of total · ▲ 4.1%</span>
          </div>
          <span style={{ ...mono, fontSize: 10.5, color: 'var(--fg-3)', alignSelf: 'flex-end' }}>multi · minimal · rich (custom render)</span>
        </div>
        <pre style={codeBoxStyle}>
{`<Tooltip variant="multi" snap="nearest" />
<Crosshair labels />

// custom render — add derived rows
<Tooltip render={({ row }) => (
  <Card>
    <Row label="Revenue" value={row.revenue} />
    <Row label="Margin" value={pct(row.revenue - row.costs, row.revenue)} />
  </Card>
)} />`}
        </pre>
        <p style={proseStyle}>
          The crosshair is also the keyboard cursor: ← → steps through points, ↑ ↓ switches series,
          Home/End jump to the range edges, and every move is announced via a live region — the mouse
          and keyboard share one model.
        </p>
      </section>

      {/* ---------------- Draw-in motion ---------------- */}
      <section id="draw-in-motion" style={sectionStyle}>
        <h2 style={h2Style}>Draw-in motion</h2>
        <p style={proseStyle}>
          <code style={{ ...mono, fontSize: 12.5, color: 'var(--fg)' }}>motion="draw"</code> animates each line along
          its own length with stroke-dashoffset — pure CSS, zero animation runtime. The primary series
          leads, secondary series follow 80ms later, the area fades in at 450ms and markers land last.
          Charts animate on mount only, never on data refresh. With reduced motion enabled the final
          frame crossfades in 120ms instead — flip the switch in the sidebar footer and replay.
        </p>
        <DrawInDemo />
        <pre style={codeBoxStyle}>
{`<ChartContainer data={rows} motion="draw">   // "draw" | "rise" | "pop" | "none"
  <LineSeries dataKey="revenue" />           // leads the choreography
  <LineSeries dataKey="costs" color="neutral" />  // +80ms stagger
  <Markers show="end" />                     // fades in after the line lands
</ChartContainer>`}
        </pre>
      </section>

      {/* ---------------- Components & API ---------------- */}
      <section id="components-api" style={sectionStyle}>
        <h2 style={h2Style}>Components &amp; API</h2>
        <p style={proseStyle}>
          Everything a line chart can contain, what each part does, and when to reach for it. The same
          grammar carries to every other chart type — only the series components change.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {API.map((entry) => <ApiCard key={entry.name} entry={entry} />)}
        </div>
      </section>

      {/* ---------------- Accessibility ---------------- */}
      <section id="accessibility" style={sectionStyle}>
        <h2 style={h2Style}>Accessibility</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ padding: '16px 18px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg-1)', fontSize: 13.5, lineHeight: 1.5, color: 'var(--fg-2)' }}>
            <div style={{ fontWeight: 600, color: 'var(--fg)', marginBottom: 6 }}>Accessible by default</div>
            Every series renders a visually-hidden data table; the crosshair is keyboard-driven (← → by point, ↑ ↓ by series) and announces values via a live region.
          </div>
          <div style={{ padding: '16px 18px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg-1)', fontSize: 13.5, lineHeight: 1.5, color: 'var(--fg-2)' }}>
            <div style={{ fontWeight: 600, color: 'var(--fg)', marginBottom: 6 }}>Motion is opt-out</div>
            <code style={{ ...mono, fontSize: 12.5, color: 'var(--fg)' }}>motion="draw"</code> uses stroke-dashoffset; markers fade in after the line lands. Reduced motion renders the final frame with a 120ms crossfade.
          </div>
        </div>
      </section>
    </ChartsShell>
  )
}
