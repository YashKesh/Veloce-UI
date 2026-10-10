import { useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { DataGrid } from 'veloce-ui'
import { DocsShell, RightRail, useViewport } from '../../components/DocsShell'
import type { TocItem } from '../../components/DocsShell'
import { DOCS_SIDEBAR, prevNext } from '../../docsNav'
import { useAnatomy } from '../../components/useAnatomy'

interface DemoRow {
  id: string
  name: string
  owner: string
  status: 'live' | 'building' | 'error'
  requests: number
}

const DEMO_ROWS: DemoRow[] = [
  { id: '1', name: 'veloce-docs', owner: 'yash', status: 'live', requests: 2_400_000 },
  { id: '2', name: 'edge-api', owner: 'mara', status: 'live', requests: 980_000 },
  { id: '3', name: 'preview-pr-218', owner: 'yash', status: 'building', requests: 0 },
  { id: '4', name: 'blog', owner: 'rina', status: 'live', requests: 184_000 },
  { id: '5', name: 'admin-panel', owner: 'alex', status: 'error', requests: 12_000 },
  { id: '6', name: 'www-static', owner: 'yash', status: 'live', requests: 6_200_000 },
  { id: '7', name: 'realtime', owner: 'mara', status: 'live', requests: 510_000 },
]

function LiveDataGridDemo() {
  const [selected, setSelected] = useState<Set<string>>(new Set(['2']))
  const [sortKey, setSortKey] = useState('requests')
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>('desc')
  const [quick, setQuick] = useState('')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, border: '1px solid var(--line)', borderRadius: 12, padding: 20, background: 'var(--bg-1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <input
          placeholder="Quick filter…"
          value={quick}
          onChange={(e) => setQuick(e.target.value)}
          style={{ height: 30, padding: '0 10px', borderRadius: 7, border: '1px solid var(--line-2)', background: 'var(--bg)', fontSize: 12.5, color: 'var(--fg)', fontFamily: 'inherit', outline: 'none', minWidth: 160 }}
        />
      </div>
      <DataGrid<DemoRow>
        rows={DEMO_ROWS}
        rowKey={(r) => r.id}
        selectable
        selectedIds={selected}
        onSelectedIdsChange={setSelected}
        sortKey={sortKey}
        sortDir={sortDir}
        onSortChange={(k, d) => { setSortKey(k); setSortDir(d) }}
        quickFilter={quick}
        onQuickFilterChange={setQuick}
        columns={[
          { key: 'name', header: 'Project', sortable: true },
          { key: 'owner', header: 'Owner', sortable: true },
          {
            key: 'status', header: 'Status', align: 'start',
            render: (r) => (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12,
                color: r.status === 'live' ? 'var(--ok)' : r.status === 'error' ? 'var(--err)' : 'var(--warn)',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: 'currentColor' }} />
                {r.status}
              </span>
            ),
          },
          {
            key: 'requests', header: 'Requests', align: 'end', sortable: true,
            render: (r) => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-2)' }}>{r.requests.toLocaleString()}</span>,
          },
        ]}
      />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
        selected: {selected.size} · sort: {sortKey} {sortDir ?? ''}
      </div>
    </div>
  )
}

const mono: CSSProperties = { fontFamily: 'var(--font-mono)' }
const sans: CSSProperties = { fontFamily: 'var(--font-sans)' }

const TOC: TocItem[] = [
  { label: 'Anatomy', id: 'anatomy', active: true },
  { label: 'Composition', id: 'composition' },
  { label: 'Columns', id: 'columns' },
  { label: 'Filtering & sort', id: 'filtering' },
  { label: 'Selection & editing', id: 'selection' },
  { label: 'Grouping & tree', id: 'grouping' },
  { label: 'Scale & state', id: 'scale' },
  { label: 'Export & types', id: 'export' },
  { label: 'API', id: 'api' },
]

const h2Style: CSSProperties = { margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }
const sectionStyle: CSSProperties = { scrollMarginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }
const cardStyle: CSSProperties = {
  padding: 16, border: '1px solid var(--line)', borderRadius: 10,
  background: 'var(--bg-1)', display: 'flex', flexDirection: 'column', gap: 10,
}
const cardTitle: CSSProperties = { fontSize: 13.5, fontWeight: 600 }
const cardFoot: CSSProperties = { ...mono, fontSize: 11, color: 'var(--fg-3)', lineHeight: 1.5 }

/* ─────────────────────────── Anatomy preview ─────────────────────────── */

const GRID_COLS = '44px minmax(0,1fr) 108px 96px 92px 72px 140px 60px'

/* ───── Anatomy tree (interactive) ───── */

interface GridTreeRow {
  id: string
  parent?: string
  depth: number
  chev?: string
  icon?: string
  label: ReactNode
  meta?: string
  role?: string
}

const GRID_TREE: GridTreeRow[] = [
  { id: 'grid', depth: 0, chev: '⌄', icon: '▦', label: 'DataGrid' },
  { id: 'toolbar', parent: 'grid', depth: 1, chev: '⌄', icon: '⟐', label: 'Toolbar', role: 'toolbar' },
  { id: 'quick-filter', parent: 'toolbar', depth: 2, icon: '⌕', label: 'QuickFilter', role: 'quick-filter' },
  { id: 'filter-builder', parent: 'toolbar', depth: 2, icon: '▾', label: 'FilterBuilder', role: 'filter-builder' },
  { id: 'sort-menu', parent: 'toolbar', depth: 2, icon: '⇅', label: 'SortMenu', role: 'sort-menu' },
  { id: 'column-menu', parent: 'toolbar', depth: 2, icon: '⫼', label: 'ColumnMenu', role: 'column-menu' },
  { id: 'export-menu', parent: 'toolbar', depth: 2, icon: '↓', label: 'ExportMenu', role: 'export-menu' },
  { id: 'columns', parent: 'grid', depth: 1, chev: '⌄', icon: '▤', label: 'Columns', role: 'columns' },
  { id: 'column-deployment', parent: 'columns', depth: 2, icon: '⫿', label: 'Column deployment', role: 'column-deployment' },
  { id: 'column-status', parent: 'columns', depth: 2, icon: '●', label: 'Column status · badge', role: 'column-status' },
  { id: 'column-branch', parent: 'columns', depth: 2, icon: '⎇', label: 'Column branch', role: 'column-branch' },
  { id: 'column-traffic', parent: 'columns', depth: 2, icon: '∿', label: 'Column traffic · sparkline', role: 'column-traffic' },
  { id: 'column-actions', parent: 'columns', depth: 2, icon: '◉', label: 'Column actions · pinned right', role: 'column-actions' },
  { id: 'rows', parent: 'grid', depth: 1, chev: '⌄', icon: '⫯', label: 'Rows', role: 'rows' },
  { id: 'row-group', parent: 'rows', depth: 2, icon: '⤷', label: 'Row group', role: 'row-group' },
  { id: 'row', parent: 'rows', depth: 2, icon: '⊞', label: 'Row', role: 'row-item' },
  { id: 'detail-panel', parent: 'rows', depth: 2, icon: '⌃', label: 'DetailPanel', role: 'detail-panel' },
  { id: 'aggregate-row', parent: 'rows', depth: 2, icon: '∑', label: 'AggregateRow', role: 'aggregate-row' },
  { id: 'bulk-actions', parent: 'grid', depth: 1, icon: '▭', label: 'BulkActions', role: 'bulk-actions' },
  { id: 'pagination', parent: 'grid', depth: 1, icon: '⤒', label: 'Pagination', role: 'pagination' },
  { id: 'empty-state', parent: 'grid', depth: 1, icon: '⊗', label: 'EmptyState', role: 'empty-state' },
]

const GRID_TOOLBAR_ROLES = ['toolbar', 'quick-filter', 'filter-builder', 'sort-menu', 'column-menu', 'export-menu', 'bulk-actions']
const GRID_COLUMNS_ROLES = ['columns', 'column-deployment', 'column-status', 'column-branch', 'column-traffic', 'column-actions']
const GRID_ROWS_ROLES = ['rows', 'row-group', 'row-item', 'aggregate-row']
const GRID_ALL_ROLES = [
  ...GRID_TOOLBAR_ROLES,
  ...GRID_COLUMNS_ROLES,
  ...GRID_ROWS_ROLES,
  'detail-panel',
  'pagination',
  'empty-state',
]

function gridFocusFor(id: string | null): string[] | null {
  if (!id) return null
  // Each leaf also includes its ancestor roles so the parent wrapper (which also has data-role)
  // stays at opacity 1 — otherwise CSS opacity multiplies and the "bright" leaf renders faded
  // because its toolbar/columns/rows wrapper is dimmed.
  const map: Record<string, string[]> = {
    grid: GRID_ALL_ROLES,
    toolbar: GRID_TOOLBAR_ROLES,
    'quick-filter': ['quick-filter', 'toolbar'],
    'filter-builder': ['filter-builder', 'toolbar'],
    'sort-menu': ['sort-menu', 'toolbar'],
    'column-menu': ['column-menu', 'toolbar'],
    'export-menu': ['export-menu', 'toolbar'],
    columns: GRID_COLUMNS_ROLES,
    'column-deployment': ['column-deployment', 'columns'],
    'column-status': ['column-status', 'columns'],
    'column-branch': ['column-branch', 'columns'],
    'column-traffic': ['column-traffic', 'columns'],
    'column-actions': ['column-actions', 'columns'],
    rows: [...GRID_ROWS_ROLES, 'detail-panel'],
    'row-group': ['row-group', 'rows'],
    row: ['row-item', 'rows'],
    'aggregate-row': ['aggregate-row', 'rows'],
    'detail-panel': ['detail-panel', 'rows'],
    'bulk-actions': ['bulk-actions'],
    pagination: ['pagination'],
    'empty-state': ['empty-state'],
  }
  return map[id] ?? null
}

function Chk({ state = 'unchecked' }: { state?: 'checked' | 'unchecked' | 'indeterminate' }) {
  if (state === 'unchecked')
    return <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: 3, border: '1px solid var(--line-2)', background: 'var(--bg)' }} />
  return (
    <span style={{
      display: 'inline-grid', placeItems: 'center', width: 14, height: 14, borderRadius: 3,
      background: 'var(--ac)', color: 'var(--ac-fg)', fontSize: 9, fontWeight: 700,
    }}>{state === 'checked' ? '✓' : '–'}</span>
  )
}

function StatusChip({ kind }: { kind: 'ready' | 'building' | 'failed' }) {
  if (kind === 'building')
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '2px 10px', borderRadius: 999, background: 'var(--ac-soft)', color: 'var(--ac-text)', fontSize: 11.5, fontWeight: 500, minWidth: 86, boxSizing: 'border-box', justifyContent: 'flex-start' }}>
        <span
          style={{
            width: 10, height: 10, borderRadius: '50%',
            border: '1.5px solid var(--ac)',
            borderRightColor: 'transparent',
            display: 'inline-block',
            flex: '0 0 10px',
            boxSizing: 'border-box',
            animation: 'vl-spin .7s linear infinite',
          }}
        />
        Building
      </span>
    )
  const map = {
    ready: { bg: 'color-mix(in oklch,var(--ok) 18%,transparent)', fg: 'var(--ok)', dot: 'var(--ok)', label: 'Ready' },
    failed: { bg: 'color-mix(in oklch,var(--err) 18%,transparent)', fg: 'var(--err)', dot: 'var(--err)', label: 'Failed' },
  }[kind]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '2px 10px', borderRadius: 999, background: map.bg, color: map.fg, fontSize: 11.5, fontWeight: 500, minWidth: 86, boxSizing: 'border-box', justifyContent: 'flex-start' }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: map.dot }} />
      {map.label}
    </span>
  )
}

const Spark = ({ d, stroke = 'var(--ac)', dash, dot }: { d: string; stroke?: string; dash?: string; dot?: [number, number] }) => (
  <svg viewBox="0 0 100 24" preserveAspectRatio="none" style={{ width: 120, height: 22 }}>
    <path d={d} fill="none" stroke={stroke} strokeWidth={2} vectorEffect="non-scaling-stroke" strokeDasharray={dash} />
    {dot && <circle cx={dot[0]} cy={dot[1]} r={2.5} fill={stroke} />}
  </svg>
)

const ellipsis: CSSProperties = { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }

function AnatomyPreview() {
  const { vis, open, selected, parents, dimStyle, onRowClick, onKeyDown, treeRef } = useAnatomy(
    GRID_TREE,
    gridFocusFor,
    'rows',
    (parents) => {
      const o: Record<string, boolean> = {}
      parents.forEach((id) => {
        o[id] = id === 'grid' || id === 'toolbar' || id === 'columns' || id === 'rows'
      })
      return o
    },
  )
  const { isMobile, isTablet } = useViewport()
  const narrow = isMobile || isTablet
  return (
    <div style={{ overflowX: narrow ? 'auto' : 'visible', minWidth: 0 }}>
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '300px 1fr', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg-1)', minWidth: narrow ? 760 : undefined }}>
      {/* Left: component tree */}
      <div style={{ borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column' }}>
        <div ref={treeRef} onKeyDown={onKeyDown} style={{ padding: '10px 0', display: 'flex', flexDirection: 'column' }}>
          {vis.map((row) => {
            const isParent = parents.has(row.id)
            const isSelected = selected === row.id
            const isOpen = !!open[row.id]
            return (
              <button
                key={row.id}
                data-node={row.id}
                onClick={(e) => onRowClick(row, e)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  paddingLeft: 8 + row.depth * 15, paddingRight: 12, height: 26,
                  background: isSelected ? 'var(--ac-soft)' : 'transparent',
                  color: isSelected ? 'var(--ac-text)' : 'var(--fg-2)',
                  fontWeight: isSelected ? 500 : 400,
                  boxShadow: isSelected ? 'inset 2px 0 0 var(--ac)' : 'none',
                  fontSize: 12.5, textAlign: 'left', border: 'none', width: '100%',
                  cursor: 'pointer',
                }}
              >
                <span style={{ width: 14, color: 'var(--fg-3)', fontSize: 11, textAlign: 'center' }}>
                  {isParent ? (isOpen ? '⌄' : '›') : (row.chev ?? '')}
                </span>
                <span style={{ width: 14, textAlign: 'center', color: isSelected ? 'var(--ac-text)' : 'var(--fg-3)', fontSize: 12 }}>
                  {row.icon ?? ''}
                </span>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.label}</span>
                {row.meta ? <span style={{ ...mono, fontSize: 11, color: 'var(--fg-3)' }}>{row.meta}</span> : null}
              </button>
            )
          })}
        </div>
        <div style={{ ...mono, borderTop: '1px solid var(--line)', padding: '8px 12px', fontSize: 11, color: 'var(--fg-3)', marginTop: 'auto', lineHeight: 1.5 }}>
          {'<TreeView>'} · click a node to isolate · ↑ ↓ moves focus · ⌥-click expands all
        </div>
      </div>

      {/* Right: grid preview */}
      <div style={{ background: 'var(--bg)', position: 'relative', minWidth: 0 }}>
        {/* Toolbar */}
        <div data-role="toolbar" style={{ ...dimStyle('toolbar'), display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderBottom: '1px solid var(--line)', flexWrap: 'nowrap', minWidth: 0 }}>
          <div data-role="quick-filter" style={{ ...dimStyle('quick-filter'), display: 'flex', alignItems: 'center', gap: 8, height: 32, flex: '0 0 230px', padding: '0 10px', border: '1px solid var(--line-2)', borderRadius: 8, background: 'var(--bg-1)', fontSize: 12.5, overflow: 'hidden' }}>
            <span style={{ color: 'var(--fg-3)', flex: '0 0 auto' }}>⌕</span>
            <span style={{ ...mono, ...ellipsis }}>status:ready region:iad1</span>
          </div>
          <span data-role="filter-builder" style={{ ...dimStyle('filter-builder'), display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 10px', borderRadius: 8, border: '1px solid var(--line-2)', fontSize: 12.5, fontWeight: 500, flex: '0 0 auto' }}>
            Filters <span style={{ ...mono, padding: '0 6px', borderRadius: 999, background: 'var(--ac)', color: 'var(--ac-fg)', fontSize: 10.5 }}>2</span>
          </span>
          <span data-role="sort-menu" style={{ ...dimStyle('sort-menu'), display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 10px', borderRadius: 8, border: '1px solid var(--line-2)', fontSize: 12.5, color: 'var(--fg-2)', flex: '0 0 auto' }}>
            <span style={{ color: 'var(--fg-3)' }}>⇅</span>Sort<span style={{ ...mono, padding: '0 6px', borderRadius: 999, background: 'var(--bg-3)', color: 'var(--fg-2)', fontSize: 10.5 }}>2</span>
          </span>
          <span data-role="column-menu" style={{ ...dimStyle('column-menu'), display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 10px', borderRadius: 8, border: '1px solid var(--line-2)', fontSize: 12.5, color: 'var(--fg-2)', flex: '0 0 auto' }}>Columns · 7 ▾</span>
          <div data-role="export-menu" style={{ ...dimStyle('export-menu'), display: 'inline-flex', alignItems: 'center', gap: 4, height: 32, padding: '0 8px', borderRadius: 8, border: '1px solid var(--line-2)', fontSize: 12.5, color: 'var(--fg-2)', flex: '0 0 auto' }}>
            <span style={{ color: 'var(--fg-3)' }}>▦</span>
            <span style={{ width: 1, height: 14, background: 'var(--line-2)' }} />
            <span style={{ color: 'var(--fg-3)' }}>↓</span>
          </div>
          <div data-role="bulk-actions" style={{ ...dimStyle('bulk-actions'), marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, flex: '0 0 auto' }}>
            <span style={{ color: 'var(--fg)', fontWeight: 500 }}>3 selected</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', height: 30, padding: '0 11px', borderRadius: 7, border: '1px solid var(--line-2)', fontWeight: 500 }}>Redeploy</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', height: 30, padding: '0 11px', borderRadius: 7, border: '1px solid color-mix(in oklch,var(--err) 40%,var(--line-2))', color: 'var(--err)', fontWeight: 500 }}>Delete</span>
          </div>
        </div>

        {/* Group header */}
        <div data-role="row-group" style={{ ...dimStyle('row-group'), display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: 'var(--bg-2)', borderBottom: '1px solid var(--line)', fontSize: 12.5, minWidth: 0 }}>
          <span style={{ color: 'var(--fg-2)' }}>⌄</span>
          <span style={{ fontWeight: 500, color: 'var(--fg)' }}>Region · iad1</span>
          <span style={{ ...mono, fontSize: 11, padding: '1px 6px', borderRadius: 4, background: 'var(--bg-3)', color: 'var(--fg-2)' }}>4 rows</span>
          <span style={{ marginLeft: 'auto', ...mono, fontSize: 11, color: 'var(--fg-3)', ...ellipsis }}>avg build 36s · success 92%</span>
        </div>

        {/* Column header */}
        <div data-role="columns" style={{ display: 'grid', gridTemplateColumns: GRID_COLS, alignItems: 'center', padding: '0 14px', height: 38, background: 'var(--bg-1)', borderBottom: '1px solid var(--line)', ...mono, fontSize: 10.5, letterSpacing: '0.06em', color: 'var(--fg-3)' }}>
          <span><Chk state="indeterminate" /></span>
          <span data-role="column-deployment" style={{ ...dimStyle('column-deployment'), ...ellipsis }}>DEPLOYMENT</span>
          <span data-role="column-status" style={{ ...dimStyle('column-status'), color: 'var(--fg)', display: 'flex', alignItems: 'center', gap: 4, ...ellipsis }}>STATUS ↓</span>
          <span data-role="column-branch" style={{ ...dimStyle('column-branch'), ...ellipsis }}>BRANCH</span>
          <span style={ellipsis}>REGION</span>
          <span style={{ textAlign: 'right', paddingRight: 10, ...ellipsis }}>BUILD</span>
          <span data-role="column-traffic" style={{ ...dimStyle('column-traffic'), ...ellipsis }}>TRAFFIC · 24h</span>
          <span data-role="column-actions" style={{ ...dimStyle('column-actions'), textAlign: 'center', color: 'var(--fg)', ...ellipsis }}>ACTIONS</span>
        </div>

        {/* Rows wrapper */}
        <div>
          <GridRow sel dim={dimStyle('row-item')}>
            <RowCell><span style={{ ...mono, fontSize: 12, flex: '0 0 auto' }}>a81f2c9</span><span style={{ color: 'var(--fg-3)', fontSize: 12, ...ellipsis, flex: 1 }}>fix: restore focus in nested dialogs</span></RowCell>
            <span><StatusChip kind="ready" /></span>
            <span style={{ ...mono, fontSize: 12, color: 'var(--fg-2)', ...ellipsis }}>main</span>
            <span style={{ color: 'var(--fg-2)', ...ellipsis }}>iad1</span>
            <span style={{ textAlign: 'right', paddingRight: 10, fontVariantNumeric: 'tabular-nums', color: 'var(--fg-2)', ...ellipsis }}>38s</span>
            <span style={ellipsis}><Spark d="M0 20L12 16L24 14L36 10L48 8L60 11L72 5L84 7L100 2" dot={[100, 2]} /></span>
            <span style={{ textAlign: 'center', color: 'var(--fg-3)' }}>⋯</span>
          </GridRow>

          <GridRow sel dim={dimStyle('row-item')}>
            <RowCell><span style={{ ...mono, fontSize: 12, flex: '0 0 auto' }}>7d21e04</span><span style={{ color: 'var(--fg-3)', fontSize: 12, ...ellipsis, flex: 1 }}>docs: motion tokens page</span></RowCell>
            <span><StatusChip kind="ready" /></span>
            <span style={{ ...mono, fontSize: 12, color: 'var(--fg-2)', ...ellipsis }}>main</span>
            <span style={{ color: 'var(--fg-2)', ...ellipsis }}>iad1</span>
            <span style={{ textAlign: 'right', paddingRight: 10, fontVariantNumeric: 'tabular-nums', color: 'var(--fg-2)', ...ellipsis }}>41s</span>
            <span style={ellipsis}><Spark d="M0 18L12 15L24 16L36 12L48 10L60 13L72 8L84 10L100 6" dot={[100, 6]} /></span>
            <span style={{ textAlign: 'center', color: 'var(--fg-3)' }}>⋯</span>
          </GridRow>

          <GridRow editing dim={dimStyle('row-item')}>
            <RowCell><span style={{ ...mono, fontSize: 12, flex: '0 0 auto' }}>3c0d7e1</span><span style={{ color: 'var(--fg-3)', fontSize: 12, ...ellipsis, flex: 1 }}>feat: sheet component</span></RowCell>
            <span><StatusChip kind="building" /></span>
            <div style={{ display: 'flex', alignItems: 'center', height: 28, margin: '0 4px', padding: '0 8px', borderRadius: 6, border: '1px solid var(--ac)', background: 'var(--bg)', ...mono, fontSize: 12, boxShadow: 'inset 0 0 0 1px var(--ac), 0 0 0 2px var(--ac-soft)', minWidth: 0, overflow: 'hidden' }}>
              <span style={ellipsis}>pr-218</span>
              <span style={{ width: 1.5, height: 14, background: 'var(--fg)', marginLeft: 1, animation: 'vl-caret 1s steps(1) infinite', flex: '0 0 auto' }} />
            </div>
            <span style={{ color: 'var(--fg-2)', ...ellipsis }}>iad1</span>
            <span style={{ textAlign: 'right', paddingRight: 10, fontVariantNumeric: 'tabular-nums', color: 'var(--fg-3)', ...ellipsis }}>—</span>
            <span style={ellipsis}><Spark d="M0 20L25 18L50 20L75 19" stroke="var(--fg-3)" dash="3 3" /></span>
            <span style={{ textAlign: 'center', color: 'var(--fg-3)' }}>⋯</span>
          </GridRow>

          <GridRow dim={dimStyle('row-item')}>
            <RowCell chk="unchecked">
              <span style={{ color: 'var(--ac-text)', fontSize: 11, flex: '0 0 auto' }}>⌄</span>
              <span style={{ ...mono, fontSize: 12, flex: '0 0 auto' }}>9be44a0</span>
              <span style={{ color: 'var(--fg-3)', fontSize: 12, ...ellipsis, flex: 1 }}>chore: bump deps</span>
            </RowCell>
            <span><StatusChip kind="failed" /></span>
            <span style={{ ...mono, fontSize: 12, color: 'var(--fg-2)', ...ellipsis }}>fix/focus</span>
            <span style={{ color: 'var(--fg-2)', ...ellipsis }}>iad1</span>
            <span style={{ textAlign: 'right', paddingRight: 10, fontVariantNumeric: 'tabular-nums', color: 'var(--fg-2)', ...ellipsis }}>12s</span>
            <span style={ellipsis}><Spark d="M0 18L25 20L50 19L75 22" stroke="var(--err)" /></span>
            <span style={{ textAlign: 'center', color: 'var(--fg-3)' }}>⋯</span>
          </GridRow>
        </div>

        {/* Detail panel */}
        <div data-role="detail-panel" style={{ ...dimStyle('detail-panel'), padding: '14px', borderBottom: '1px solid var(--line)', background: 'var(--bg-2)', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, fontSize: 12.5, minWidth: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
            <span style={{ ...mono, fontSize: 11, color: 'var(--fg-3)' }}>BUILD LOG · tail</span>
            <pre style={{ margin: 0, padding: '10px 12px', borderRadius: 7, background: 'var(--bg)', border: '1px solid var(--line)', ...mono, fontSize: 11.5, lineHeight: 1.55, color: 'var(--fg-2)', maxHeight: 180, overflow: 'auto', whiteSpace: 'pre' }}>
{`[14:02:31] installing dependencies
[14:02:48] resolved 342 packages
`}
<span style={{ color: 'var(--err)' }}>{`[14:02:52] ✕ Type error · app/layout.tsx:42
`}</span>
{`   Property 'themeColor' does not exist…`}
            </pre>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
            <span style={{ ...mono, fontSize: 11, color: 'var(--fg-3)' }}>METADATA</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 14px', alignItems: 'center', color: 'var(--fg-2)' }}>
              <span style={{ color: 'var(--fg-3)' }}>Author</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, ...ellipsis }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'oklch(0.6 0.12 200)', color: 'oklch(0.98 0 0)', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 600, flex: '0 0 auto' }}>JL</span>
                <span style={ellipsis}>jonas@acme.co</span>
              </span>
              <span style={{ color: 'var(--fg-3)' }}>Env</span><span style={ellipsis}>production</span>
              <span style={{ color: 'var(--fg-3)' }}>Framework</span><span style={ellipsis}>Next.js 15.1</span>
              <span style={{ color: 'var(--fg-3)' }}>Hash</span><span style={{ ...mono, fontSize: 11.5, ...ellipsis }}>9be44a0e3f1b</span>
            </div>
          </div>
        </div>

        {/* Ready row + aggregate */}
        <div>
          <GridRow dim={dimStyle('row-item')}>
            <RowCell chk="unchecked"><span style={{ ...mono, fontSize: 12, flex: '0 0 auto' }}>e5a90bb</span><span style={{ color: 'var(--fg-3)', fontSize: 12, ...ellipsis, flex: 1 }}>refactor: token pipeline</span></RowCell>
            <span><StatusChip kind="ready" /></span>
            <span style={{ ...mono, fontSize: 12, color: 'var(--fg-2)', ...ellipsis }}>main</span>
            <span style={{ color: 'var(--fg-2)', ...ellipsis }}>iad1</span>
            <span style={{ textAlign: 'right', paddingRight: 10, fontVariantNumeric: 'tabular-nums', color: 'var(--fg-2)', ...ellipsis }}>44s</span>
            <span style={ellipsis}><Spark d="M0 18L12 16L24 17L36 14L48 15L60 11L72 13L84 9L100 10" /></span>
            <span style={{ textAlign: 'center', color: 'var(--fg-3)' }}>⋯</span>
          </GridRow>

          <div data-role="aggregate-row" style={{ ...dimStyle('aggregate-row'), display: 'grid', gridTemplateColumns: GRID_COLS, alignItems: 'center', padding: '0 14px', height: 40, background: 'var(--bg-1)', borderBottom: '1px solid var(--line-2)', fontSize: 12.5, fontWeight: 500 }}>
            <span />
            <span style={{ color: 'var(--fg-3)', ...ellipsis }}>∑ 5 deployments</span>
            <span style={{ color: 'var(--fg-2)', display: 'flex', alignItems: 'center', gap: 8, ...ellipsis }}>
              <span style={{ color: 'var(--ok)' }}>● 3</span>
              <span style={{ color: 'var(--ac-text)' }}>● 1</span>
              <span style={{ color: 'var(--err)' }}>● 1</span>
            </span>
            <span /><span />
            <span style={{ textAlign: 'right', paddingRight: 10, fontVariantNumeric: 'tabular-nums', ...ellipsis }}>33.8s avg</span>
            <span style={{ color: 'var(--fg-3)', ...mono, fontSize: 11, ...ellipsis }}>rollup</span>
            <span />
          </div>
        </div>

        {/* Pagination */}
        <div data-role="pagination" style={{ ...dimStyle('pagination'), display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', fontSize: 12.5, color: 'var(--fg-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>Rows per page <span style={{ color: 'var(--fg-2)' }}>10 ▾</span></span>
            <span>Showing <span style={{ color: 'var(--fg-2)' }}>1–10</span> of 472</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 13 }}>
            {['«', '‹'].map((c) => <span key={c} style={{ display: 'grid', placeItems: 'center', width: 28, height: 28, borderRadius: 7, color: 'var(--fg-3)' }}>{c}</span>)}
            <span style={{ display: 'grid', placeItems: 'center', width: 28, height: 28, borderRadius: 7, background: 'var(--fg)', color: 'var(--bg)', fontWeight: 500 }}>1</span>
            {['2', '3'].map((n) => <span key={n} style={{ display: 'grid', placeItems: 'center', width: 28, height: 28, borderRadius: 7, color: 'var(--fg-2)' }}>{n}</span>)}
            <span style={{ display: 'grid', placeItems: 'center', width: 28, height: 28, color: 'var(--fg-3)' }}>…</span>
            <span style={{ display: 'grid', placeItems: 'center', width: 28, height: 28, borderRadius: 7, color: 'var(--fg-2)' }}>48</span>
            {['›', '»'].map((c) => <span key={c} style={{ display: 'grid', placeItems: 'center', width: 28, height: 28, borderRadius: 7, color: 'var(--fg)' }}>{c}</span>)}
          </div>
        </div>

        {/* Empty-state placeholder — mostly collapsed; expands when its node is selected */}
        <div
          data-role="empty-state"
          style={{
            ...dimStyle('empty-state'),
            borderTop: '1px dashed var(--line)',
            padding: selected === 'empty-state' ? '20px 14px' : '4px 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontSize: 12.5, color: 'var(--fg-3)', ...mono,
            transition: 'padding 200ms var(--easing-standard, cubic-bezier(.22,1,.36,1)), opacity 200ms var(--easing-standard, cubic-bezier(.22,1,.36,1))',
          }}
        >
          <span>⊗</span>
          <span>No deployments match these filters</span>
        </div>
      </div>
    </div>
    </div>
  )
}

function GridRow({ sel, editing, role = 'row-item', dim, children }: { sel?: boolean; editing?: boolean; role?: string; dim?: CSSProperties; children: ReactNode }) {
  return (
    <div data-role={role} style={{
      ...(dim || {}),
      display: 'grid', gridTemplateColumns: GRID_COLS, alignItems: 'center',
      padding: '0 14px', height: 44, borderBottom: '1px solid var(--line)',
      background: sel ? 'var(--ac-soft)' : editing ? 'var(--bg-2)' : undefined,
      fontSize: 13, minWidth: 0,
    }}>
      {children}
    </div>
  )
}
function RowCell({ chk = 'checked', children }: { chk?: 'checked' | 'unchecked'; children: ReactNode }) {
  return (
    <>
      <span><Chk state={chk} /></span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, overflow: 'hidden' }}>{children}</span>
    </>
  )
}

/* ─────────────────────────── Shared helpers ─────────────────────────── */

const Grid = ({ cols, gap = 14, children }: { cols: string; gap?: number; children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: cols, gap }}>{children}</div>
)

/* ─────────────────────────── Section cards ─────────────────────────── */

function ColumnMenuCard() {
  const item = (ic: string, label: string, kbd?: string, danger?: boolean, selected?: boolean) => (
    <div style={{ padding: '7px 9px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8, color: danger ? 'var(--err)' : 'var(--fg-2)', background: selected ? 'var(--bg-3)' : undefined }}>
      <span style={{ width: 14, color: 'var(--fg-3)', letterSpacing: -2 }}>⋮⋮</span>
      <span style={{ width: 14, height: 14, borderRadius: 3, border: '1px solid var(--line-2)', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700, background: ic === '✓' ? 'var(--ac)' : undefined, color: ic === '✓' ? 'var(--ac-fg)' : undefined, borderColor: ic === '✓' ? 'var(--ac)' : 'var(--line-2)' }}>{ic === '✓' ? '✓' : ''}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {kbd ? <span style={{ color: 'var(--fg-3)', fontSize: 11 }}>{kbd}</span> : null}
    </div>
  )
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={cardTitle}>Column menu</span>
        <span style={cardFoot}>unfold 180ms · drag ⋮⋮ to reorder</span>
      </div>
      <div style={{ width: 280, padding: 5, borderRadius: 9, background: 'var(--bg-2)', border: '1px solid var(--line-2)', boxShadow: 'var(--shadow-lg, 0 16px 40px rgba(0,0,0,.4))', fontSize: 13 }}>
        <div style={{ padding: '7px 9px', ...mono, fontSize: 10.5, letterSpacing: '0.06em', color: 'var(--fg-3)' }}>STATUS</div>
        {item('✓', 'Visible', '⇧ H')}
        <div style={{ padding: '7px 9px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--fg-2)' }}>
          <span style={{ width: 14, color: 'var(--fg-3)', letterSpacing: -2 }}>⋮⋮</span>
          <span style={{ width: 14, height: 14, borderRadius: 3, border: '1px solid var(--line-2)' }} />
          Pin to left
        </div>
        {item('✓', 'Pin to right', undefined, false, true)}
        <div style={{ height: 1, background: 'var(--line)', margin: '4px 2px' }} />
        <div style={{ padding: '7px 9px', ...mono, fontSize: 10.5, letterSpacing: '0.06em', color: 'var(--fg-3)' }}>SORT</div>
        <div style={{ padding: '7px 9px', color: 'var(--fg-2)' }}>↑ Sort A → Z</div>
        <div style={{ padding: '7px 9px', color: 'var(--fg-2)' }}>↓ Sort Z → A</div>
        <div style={{ height: 1, background: 'var(--line)', margin: '4px 2px' }} />
        <div style={{ padding: '7px 9px', color: 'var(--fg-2)' }}>⤷ Group by status</div>
        <div style={{ padding: '7px 9px', color: 'var(--fg-2)' }}>∑ Aggregate · count ▾</div>
        <div style={{ padding: '7px 9px', color: 'var(--err)' }}>⊘ Hide column</div>
      </div>
    </div>
  )
}

function ResizeCard() {
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={cardTitle}>Resize & reorder</span>
        <span style={cardFoot}>snaps to 8px grid · persists</span>
      </div>
      {/* Column headers with an active BUILD column being resized */}
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr .8fr 1fr', background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 8, overflow: 'hidden' }}>
        <span style={{ padding: '7px 12px', borderRight: '1px solid var(--line)', ...mono, fontSize: 10.5, letterSpacing: '0.06em', color: 'var(--fg-3)' }}>COMMIT</span>
        <span style={{ padding: '7px 12px', borderRight: '1px solid var(--line)', ...mono, fontSize: 10.5, letterSpacing: '0.06em', color: 'var(--fg-3)' }}>STATUS</span>
        <span style={{ position: 'relative', padding: '7px 12px', borderRight: '2px solid var(--ac)', ...mono, fontSize: 10.5, letterSpacing: '0.06em', color: 'var(--fg)', boxShadow: '2px 0 8px -2px var(--ac-soft)' }}>
          BUILD
          <span style={{ position: 'absolute', right: -6, top: -4, padding: '2px 5px', borderRadius: 4, background: 'var(--fg)', color: 'var(--bg)', fontSize: 10, ...mono }}>128px</span>
        </span>
        <span style={{ padding: '7px 12px', ...mono, fontSize: 10.5, letterSpacing: '0.06em', color: 'var(--fg-3)' }}>BRANCH</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr .8fr 1fr' }}>
        <span style={{ padding: '7px 12px', color: 'var(--fg-2)', fontSize: 12.5 }}>a81f2c9</span>
        <span style={{ padding: '7px 12px' }}><StatusChip kind="ready" /></span>
        <span style={{ padding: '7px 12px', fontVariantNumeric: 'tabular-nums', fontSize: 12.5 }}>38s</span>
        <span style={{ padding: '7px 12px', ...mono, fontSize: 11.5, color: 'var(--fg-2)' }}>main</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...mono, fontSize: 11, color: 'var(--fg-3)' }}>
        <span>⋮⋮ drag → reorder</span><span>↔ handle → resize</span><span>double-click → autosize</span>
      </div>
    </div>
  )
}

function QuickFilterCard() {
  return (
    <div style={cardStyle}>
      <span style={cardTitle}>Quick filter</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 34, padding: '0 10px', border: '1px solid var(--line-2)', borderRadius: 8, background: 'var(--bg)', fontSize: 13 }}>
        <span style={{ color: 'var(--fg-3)' }}>⌕</span>
        <span>mara</span>
        <span style={{ width: 1.5, height: 14, background: 'var(--fg)', animation: 'vl-caret 1s steps(1) infinite' }} />
        <span style={{ marginLeft: 'auto', ...mono, fontSize: 11, color: 'var(--fg-3)' }}>3 / 472</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, fontSize: 12 }}>
        <span style={{ padding: '2px 7px', borderRadius: 5, background: 'var(--ac-soft)', color: 'var(--ac-text)', fontWeight: 500 }}>
          <span style={mono}>mara</span>@acme.co
        </span>
        <span style={{ padding: '2px 7px', borderRadius: 5, background: 'var(--bg-3)', color: 'var(--fg-2)' }}>Mara Kessler</span>
        <span style={{ padding: '2px 7px', borderRadius: 5, background: 'var(--bg-3)', color: 'var(--fg-2)' }}>fix/<span style={{ color: 'var(--ac-text)' }}>mara</span>-test</span>
      </div>
      <div style={cardFoot}>matches across every string column · 150ms debounce</div>
    </div>
  )
}

function FilterBuilderCard() {
  const chip = (bg: string, color: string): CSSProperties => ({ padding: '3px 8px', borderRadius: 5, background: bg, color })
  return (
    <div style={cardStyle}>
      <span style={cardTitle}>Filter builder</span>
      <div style={{ padding: 10, border: '1px solid var(--line-2)', borderRadius: 8, background: 'var(--bg)', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={chip('var(--bg-3)', 'var(--fg-2)')}>status</span>
          <span style={{ color: 'var(--fg-3)' }}>is one of</span>
          <span style={chip('color-mix(in oklch,var(--ok) 18%,transparent)', 'var(--ok)')}>Ready</span>
          <span style={chip('var(--ac-soft)', 'var(--ac-text)')}>Building</span>
          <span style={{ marginLeft: 'auto', color: 'var(--fg-3)', fontSize: 11 }}>✕</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ ...mono, padding: '1px 6px', borderRadius: 4, background: 'var(--fg)', color: 'var(--bg)', fontSize: 10 }}>AND</span>
          <span style={chip('var(--bg-3)', 'var(--fg-2)')}>build</span>
          <span style={{ color: 'var(--fg-3)' }}>&lt;</span>
          <span style={{ ...mono, color: 'var(--fg)' }}>60s</span>
          <span style={{ marginLeft: 'auto', color: 'var(--fg-3)', fontSize: 11 }}>✕</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ ...mono, padding: '1px 6px', borderRadius: 4, background: 'var(--fg-3)', color: 'var(--bg)', fontSize: 10 }}>OR</span>
          <span style={chip('var(--bg-3)', 'var(--fg-2)')}>createdAt</span>
          <span style={{ color: 'var(--fg-3)' }}>in the last</span>
          <span style={{ ...mono, color: 'var(--fg)' }}>24h</span>
          <span style={{ marginLeft: 'auto', color: 'var(--fg-3)', fontSize: 11 }}>✕</span>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 5, border: '1px dashed var(--line-2)', color: 'var(--fg-3)', fontSize: 11.5, alignSelf: 'flex-start' }}>+ Add rule</span>
      </div>
    </div>
  )
}

function MultiSortCard() {
  const row = (n: number, name: string, dir: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', border: '1px solid var(--line-2)', borderRadius: 7, background: 'var(--bg)' }}>
      <span style={{ ...mono, width: 18, height: 18, borderRadius: 4, background: 'var(--ac)', color: 'var(--ac-fg)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700 }}>{n}</span>
      <span>{name}</span>
      <span style={{ marginLeft: 'auto', color: 'var(--fg-2)' }}>{dir}</span>
      <span style={{ color: 'var(--fg-3)' }}>⋮⋮</span>
    </div>
  )
  return (
    <div style={cardStyle}>
      <span style={cardTitle}>Multi-sort</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5 }}>
        {row(1, 'status', '↓ desc')}
        {row(2, 'build', '↑ asc')}
      </div>
      <div style={cardFoot}>⇧-click a header to add to the sort stack · drag to reorder priority</div>
    </div>
  )
}

function SelectionCard() {
  const kbd = (k: string) => <span style={{ ...mono, fontSize: 11, padding: '2px 6px', border: '1px solid var(--line-2)', borderRadius: 4, color: 'var(--fg)' }}>{k}</span>
  return (
    <div style={cardStyle}>
      <span style={cardTitle}>Selection</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12.5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Chk state="indeterminate" />Header tri-state · indeterminate when some rows selected</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Chk state="checked" />Single · click a row</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--fg-2)' }}>{kbd('⇧ click')}Range · from last selected to this</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--fg-2)' }}>{kbd('⌘ click')}Toggle individual rows</div>
      </div>
      <div style={{ padding: '10px 12px', borderRadius: 7, background: 'var(--bg-2)', display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5 }}>
        <span style={{ fontWeight: 500 }}>3 selected</span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <span style={{ padding: '4px 9px', borderRadius: 6, border: '1px solid var(--line-2)', fontWeight: 500 }}>Redeploy</span>
          <span style={{ padding: '4px 9px', borderRadius: 6, background: 'var(--ac)', color: 'var(--ac-fg)', fontWeight: 500 }}>Promote</span>
        </span>
      </div>
    </div>
  )
}

function CellEditingCard() {
  return (
    <div style={cardStyle}>
      <span style={cardTitle}>Cell editing</span>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12.5 }}>
        <div style={{ padding: '8px 10px', border: '1px solid var(--ac)', borderRadius: 7, background: 'var(--bg)', boxShadow: '0 0 0 2px var(--bg-1),0 0 0 4px var(--ac)', display: 'flex', alignItems: 'center' }}>
          Mara Kessler
          <span style={{ width: 1.5, height: 14, background: 'var(--fg)', marginLeft: 1, animation: 'vl-caret 1s steps(1) infinite' }} />
        </div>
        <div style={{ padding: '8px 10px', border: '1px solid var(--err)', borderRadius: 7, background: 'var(--bg)', display: 'flex', alignItems: 'center', gap: 6 }}>
          99.<span style={{ color: 'var(--err)' }}>x</span>
          <span style={{ marginLeft: 'auto', color: 'var(--err)', fontSize: 11 }}>must be number</span>
        </div>
        <div style={{ padding: '8px 10px', border: '1px solid var(--line-2)', borderRadius: 7, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          production<span style={{ color: 'var(--fg-3)' }}>⌄</span>
        </div>
        <div style={{ padding: '8px 10px', border: '1px solid var(--line-2)', borderRadius: 7, background: 'var(--bg)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Chk state="checked" />Auto-deploy
        </div>
      </div>
      <div style={cardFoot}>text · number · select · checkbox · date · custom. Dirty cells show a dot; Esc reverts, Enter commits.</div>
    </div>
  )
}

function KeyboardCard() {
  const kbd = (k: string) => <span style={{ ...mono, fontSize: 11, padding: '2px 6px', border: '1px solid var(--line-2)', borderRadius: 4, color: 'var(--fg)', justifySelf: 'start' }}>{k}</span>
  const ROWS: [string, string][] = [
    ['← ↑ → ↓', 'Move active cell'],
    ['Home / End', 'First / last column'],
    ['⌘ ↑ / ↓', 'Jump to first / last row'],
    ['Space', 'Toggle row selection'],
    ['Enter / F2', 'Start editing active cell'],
    ['Esc', 'Cancel edit / clear selection'],
    ['⌘ C / V', 'Copy / paste range'],
  ]
  return (
    <div style={cardStyle}>
      <span style={cardTitle}>Keyboard map</span>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '5px 14px', alignItems: 'center', fontSize: 12.5 }}>
        {ROWS.map(([k, label]) => (
          <div key={k} style={{ display: 'contents' }}>
            {kbd(k)}<span style={{ color: 'var(--fg-2)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RowGroupingCard() {
  const section = (chev: string, name: string, n: string, avg: string) => (
    <div style={{ padding: '7px 10px', background: 'var(--bg-2)', display: 'flex', gap: 8, alignItems: 'center', borderBottom: '1px solid var(--line)' }}>
      <span style={{ color: 'var(--fg-3)' }}>{chev}</span>
      <span style={{ fontWeight: 500 }}>{name}</span>
      <span style={{ ...mono, fontSize: 11, padding: '1px 5px', borderRadius: 4, background: 'var(--bg-3)', color: 'var(--fg-2)' }}>{n}</span>
      <span style={{ marginLeft: 'auto', color: 'var(--fg-3)', ...mono, fontSize: 11 }}>avg {avg}</span>
    </div>
  )
  const child = (name: string, v: string) => (
    <div style={{ padding: '6px 10px 6px 28px', color: 'var(--fg-2)', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between' }}>
      {name}<span style={{ color: 'var(--fg-3)' }}>{v}</span>
    </div>
  )
  return (
    <div style={cardStyle}>
      <span style={cardTitle}>Row grouping</span>
      <div style={{ border: '1px solid var(--line-2)', borderRadius: 7, background: 'var(--bg)', overflow: 'hidden', fontSize: 12.5 }}>
        {section('⌄', 'iad1', '4', '36s')}
        {child('a81f2c9', '38s')}
        {child('7d21e04', '41s')}
        {section('›', 'fra1', '7', '44s')}
        <div style={{ padding: '7px 10px', background: 'var(--bg-2)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ color: 'var(--fg-3)' }}>›</span>
          <span style={{ fontWeight: 500 }}>sfo1</span>
          <span style={{ ...mono, fontSize: 11, padding: '1px 5px', borderRadius: 4, background: 'var(--bg-3)', color: 'var(--fg-2)' }}>3</span>
          <span style={{ marginLeft: 'auto', color: 'var(--fg-3)', ...mono, fontSize: 11 }}>avg 29s</span>
        </div>
      </div>
      <span style={cardFoot}>groupBy=["region"] · aggregate per column</span>
    </div>
  )
}

function TreeDataCard() {
  const row = (indent: number, chev: string, icon: string, name: string, size: string, selected?: boolean) => (
    <div style={{
      padding: '6px 10px', paddingLeft: 10 + indent, display: 'flex', alignItems: 'center', gap: 8,
      borderBottom: '1px solid var(--line)', color: 'var(--fg-2)',
      background: selected ? 'var(--ac-soft)' : undefined,
    }}>
      <span>{chev}</span>
      <span style={{ color: 'var(--fg-3)' }}>{icon}</span>
      {name}
      <span style={{ marginLeft: 'auto', color: selected ? 'var(--fg-2)' : 'var(--fg-3)', fontVariantNumeric: 'tabular-nums' }}>{size}</span>
    </div>
  )
  return (
    <div style={cardStyle}>
      <span style={cardTitle}>Tree data</span>
      <div style={{ border: '1px solid var(--line-2)', borderRadius: 7, background: 'var(--bg)', overflow: 'hidden', fontSize: 12.5 }}>
        {row(0, '⌄', '▣', 'veloce-ui', '214 MB')}
        {row(18, '⌄', '⌂', 'packages', '182 MB')}
        {row(38, '', '▪', 'core', '88 MB')}
        {row(38, '', '▪', 'charts', '61 MB', true)}
        {row(38, '', '▪', 'data-grid', '33 MB')}
        <div style={{ padding: '6px 10px 6px 28px', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--fg-2)' }}>
          <span style={{ color: 'var(--fg-3)' }}>›</span>
          <span style={{ color: 'var(--fg-3)' }}>⌂</span>
          apps
          <span style={{ marginLeft: 'auto', color: 'var(--fg-3)', fontVariantNumeric: 'tabular-nums' }}>32 MB</span>
        </div>
      </div>
      <span style={cardFoot}>getRowId · getChildren · unlimited depth</span>
    </div>
  )
}

function PivotCard() {
  const H = ['REGION ↓', 'READY', 'BUILDING', 'FAILED', 'TOTAL']
  const rows: (string | number)[][] = [
    ['iad1', 38, 2, 1, 41],
    ['fra1', 22, 1, 3, 26],
    ['sfo1', 11, 0, 0, 11],
  ]
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={cardTitle}>Pivot</span>
        <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 4, background: 'var(--ac)', color: 'var(--ac-fg)', fontWeight: 600 }}>PRO</span>
      </div>
      <div style={{ border: '1px solid var(--line-2)', borderRadius: 7, background: 'var(--bg)', overflow: 'hidden', fontSize: 11.5, fontVariantNumeric: 'tabular-nums' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr .7fr .7fr .7fr .7fr', background: 'var(--bg-2)', borderBottom: '1px solid var(--line)', ...mono, fontSize: 10, letterSpacing: '0.06em', color: 'var(--fg-3)' }}>
          {H.map((h, i) => (
            <span key={h} style={{ padding: '6px 8px', textAlign: i === 0 ? 'left' : 'right', background: i === 4 ? 'var(--bg-3)' : undefined, color: i === 4 ? 'var(--fg)' : undefined }}>{h}</span>
          ))}
        </div>
        {rows.map((r, ri) => (
          <div key={ri} style={{ display: 'grid', gridTemplateColumns: '1.1fr .7fr .7fr .7fr .7fr', borderBottom: '1px solid var(--line)' }}>
            {r.map((v, i) => (
              <span key={i} style={{ padding: '6px 8px', textAlign: i === 0 ? 'left' : 'right', fontWeight: i === 4 ? 600 : 400, background: i === 4 ? 'var(--bg-2)' : undefined, color: i === 3 && v !== 0 ? 'var(--err)' : undefined }}>{v}</span>
            ))}
          </div>
        ))}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr .7fr .7fr .7fr .7fr', background: 'var(--bg-2)', borderTop: '1px solid var(--line-2)', fontWeight: 600 }}>
          <span style={{ padding: '6px 8px', color: 'var(--fg-3)', ...mono, fontSize: 10 }}>TOTAL</span>
          <span style={{ padding: '6px 8px', textAlign: 'right' }}>71</span>
          <span style={{ padding: '6px 8px', textAlign: 'right' }}>3</span>
          <span style={{ padding: '6px 8px', textAlign: 'right' }}>4</span>
          <span style={{ padding: '6px 8px', textAlign: 'right', background: 'var(--ac-soft)', color: 'var(--ac-text)' }}>78</span>
        </div>
      </div>
      <span style={cardFoot}>rows: region · cols: status · agg: count</span>
    </div>
  )
}

function VirtualizationCard() {
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={cardTitle}>Virtualisation</span>
        <span style={cardFoot}>100k rows · 60 fps</span>
      </div>
      <div style={{ position: 'relative', height: 160, border: '1px solid var(--line-2)', borderRadius: 7, background: 'var(--bg)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg,var(--bg) 0 20px,var(--bg-2) 20px 21px)' }} />
        <div style={{ position: 'absolute', left: 0, right: 14, top: 46, height: 84, border: '1px dashed var(--ac)', background: 'var(--ac-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...mono, fontSize: 11, color: 'var(--ac-text)' }}>
          rendered window · 42 rows + 10 overscan
        </div>
        <div style={{ position: 'absolute', right: 4, top: 44, bottom: 4, width: 6, borderRadius: 3, background: 'var(--bg-3)' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: '28%', height: '44%', borderRadius: 3, background: 'var(--fg-2)' }} />
        </div>
        <div style={{ position: 'absolute', left: 8, top: 4, ...mono, fontSize: 10, color: 'var(--fg-3)' }}>row 2,418 — 2,459 of 100,000</div>
      </div>
      <span style={cardFoot}>row &amp; column virtualisation · estimated row height ok</span>
    </div>
  )
}

function ServerSideCard() {
  return (
    <div style={cardStyle}>
      <span style={cardTitle}>Server-side state</span>
      <pre style={{ margin: 0, padding: 12, borderRadius: 7, background: 'var(--bg)', border: '1px solid var(--line-2)', ...mono, fontSize: 11.5, lineHeight: 1.6, color: 'var(--fg-2)', whiteSpace: 'pre-wrap' }}>
<span style={{ color: 'var(--fg-3)' }}>{`// drive sort/filter/paging from the URL`}</span>{`\n`}
<span style={{ color: 'var(--ac-text)' }}>useDataGridState</span>{`({\n  rowCount: `}<span style={{ color: 'var(--fg)' }}>472</span>{`,\n  state, `}<span style={{ color: 'var(--ac-text)' }}>onStateChange</span>{`,\n  loader: `}<span style={{ color: 'var(--fg)' }}>async</span>{` (q) => fetch(\n    `}<span style={{ color: 'var(--ac-text)' }}>{"`/api/deploys?${toQS(q)}`"}</span>{`)\n})`}
      </pre>
      <span style={cardFoot}>rowCount tells the grid to delegate paging · suspense-ready</span>
    </div>
  )
}

function LoadingEmptyCard() {
  const shimmer: CSSProperties = {
    height: 9, borderRadius: 3,
    background: 'linear-gradient(90deg,var(--bg-3) 25%,var(--line-2) 50%,var(--bg-3) 75%) 0 0/200% 100%',
    animation: 'vl-shimmer 1.6s linear infinite',
  }
  return (
    <div style={cardStyle}>
      <span style={cardTitle}>Loading & empty</span>
      <div style={{ border: '1px solid var(--line-2)', borderRadius: 7, background: 'var(--bg)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '40px 1.4fr 1fr .8fr', padding: '7px 10px', background: 'var(--bg-2)', borderBottom: '1px solid var(--line)', ...mono, fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.06em' }}>
          <span /><span>COMMIT</span><span>STATUS</span><span>BUILD</span>
        </div>
        {[['78%', '50%', '30%'], ['62%', '66%', '40%']].map((widths, ri) => (
          <div key={ri} style={{ display: 'grid', gridTemplateColumns: '40px 1.4fr 1fr .8fr', padding: '8px 10px', borderBottom: '1px solid var(--line)', alignItems: 'center' }}>
            <span style={{ width: 14, height: 14, borderRadius: 3, background: 'var(--bg-3)' }} />
            {widths.map((w, i) => <span key={i} style={{ ...shimmer, width: w }} />)}
          </div>
        ))}
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textAlign: 'center', color: 'var(--fg-2)', fontSize: 12.5 }}>
          <span style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--bg-3)', display: 'grid', placeItems: 'center', color: 'var(--fg-3)' }}>▦</span>
          <span style={{ fontWeight: 600, color: 'var(--fg)', fontSize: 13 }}>No rows match</span>
          <span style={{ color: 'var(--fg-3)' }}>Clear filters or widen the time range</span>
        </div>
      </div>
    </div>
  )
}

function ExportMenuCard() {
  const row = (label: string, hint?: string, highlight?: boolean) => (
    <div style={{ padding: '7px 9px', borderRadius: 6, display: 'flex', justifyContent: 'space-between', color: highlight ? undefined : 'var(--fg-2)', background: highlight ? 'var(--bg-3)' : undefined }}>
      {label}{hint ? <span style={{ ...mono, fontSize: 10.5, color: 'var(--fg-3)' }}>{hint}</span> : null}
    </div>
  )
  return (
    <div style={cardStyle}>
      <span style={cardTitle}>Export menu</span>
      <div style={{ width: 220, padding: 4, borderRadius: 9, background: 'var(--bg-2)', border: '1px solid var(--line-2)', boxShadow: '0 4px 12px -2px rgba(0,0,0,.3)', fontSize: 12.5, alignSelf: 'flex-start' }}>
        {row('Download CSV', 'visible', true)}
        {row('Download XLSX', 'all')}
        {row('Download JSON')}
        <div style={{ height: 1, background: 'var(--line)', margin: '4px 0' }} />
        {row('Copy as TSV')}
        {row('Copy as Markdown')}
        <div style={{ height: 1, background: 'var(--line)', margin: '4px 0' }} />
        {row('Print preview')}
      </div>
      <span style={cardFoot}>respects filters, column order &amp; visibility</span>
    </div>
  )
}

function ContextMenuCard() {
  const row = (label: string, hint?: string, danger?: boolean) => (
    <div style={{ padding: '7px 9px', color: danger ? 'var(--err)' : 'var(--fg-2)', display: 'flex', justifyContent: 'space-between' }}>
      {label}{hint ? <span style={{ ...mono, fontSize: 10.5, color: 'var(--fg-3)' }}>{hint}</span> : null}
    </div>
  )
  return (
    <div style={cardStyle}>
      <span style={cardTitle}>Row context menu</span>
      <div style={{ width: 220, padding: 4, borderRadius: 9, background: 'var(--bg-2)', border: '1px solid var(--line-2)', boxShadow: '0 4px 12px -2px rgba(0,0,0,.3)', fontSize: 12.5, alignSelf: 'flex-start' }}>
        {row('Open deployment', '↵')}
        {row('Redeploy', 'R')}
        {row('Pin row to top', 'P')}
        {row('Copy commit SHA')}
        {row('Expand detail', '⌘ E')}
        <div style={{ height: 1, background: 'var(--line)', margin: '4px 0' }} />
        {row('Delete deployment', undefined, true)}
      </div>
      <span style={cardFoot}>right-click or ⇧ F10 on any row</span>
    </div>
  )
}

function ColumnTypesCard() {
  const TYPES = ['string', 'number', 'currency', 'percent', 'boolean', 'date', 'duration', 'enum', 'tags', 'user', 'progress', 'sparkline', 'image', 'rating', 'actions']
  return (
    <div style={cardStyle}>
      <span style={cardTitle}>Column types</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, fontSize: 11.5, ...mono }}>
        {TYPES.map((t) => (
          <span key={t} style={{ padding: '3px 8px', borderRadius: 5, border: '1px solid var(--line-2)', color: 'var(--fg-2)' }}>{t}</span>
        ))}
      </div>
      <span style={cardFoot}>each type ships formatter, parser, editor, filter op &amp; aggregate</span>
    </div>
  )
}

/* ─────────────────────────── API table ─────────────────────────── */

const API_ROWS: [string, string, string, string][] = [
  ['rows', 'T[]', '—', 'The row data. Immutable updates are fine; the grid memoises per rowKey.'],
  ['rowKey', 'keyof T | (row) => string', '"id"', 'Stable identity for selection, animation and virtualisation.'],
  ['density', '"compact" | "comfortable" | "cozy"', '"comfortable"', 'Row height preset. Persists per grid id when storageKey is set.'],
  ['selection', '"none" | "single" | "multi"', '"multi"', 'Checkbox column mode. Pair with selectionMode="cell" for range select.'],
  ['groupBy', 'string[]', '[]', 'Column ids to group rows under. Order determines nesting.'],
  ['getChildren', '(row) => T[]', '—', 'Opt into tree data. Children render under an expander in the first column.'],
  ['rowCount', 'number', '—', 'Pass total row count to switch to server-side paging/sorting.'],
  ['virtualize', 'boolean | { overscan: number }', 'true', 'Row and column virtualisation. Disable only for < 50 rows with mixed heights.'],
  ['onEdit', '(change) => void | Promise', '—', 'Fires on cell commit. Returning a promise shows an inline spinner.'],
  ['onCellEdit', '(row, key, newValue) => void', '—', 'Shipped alias of onEdit used by editable column cells.'],
  ['quickFilter', 'string', '—', 'Case-insensitive substring filter over every cell. Debounced 150ms when wired via DataGrid.Toolbar.'],
  ['onQuickFilterChange', '(q: string) => void', '—', 'Controlled version of the quick-filter string.'],
  ['visibleColumnKeys', 'string[]', '—', 'Controlled column visibility. Keys omitted are hidden; pinned columns are always shown.'],
  ['onVisibleColumnKeysChange', '(keys: string[]) => void', '—', 'Fires when a user toggles a column in DataGrid.ColumnMenu.'],
  ['onColumnResize', '(key: string, width: number) => void', '—', 'Controlled width updates when the drag handle is released.'],
  ['storageKey', 'string', '—', 'Persist column order, widths, visibility, sort & density in localStorage.'],
]

function ApiTable() {
  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden', fontSize: 13.5 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '170px 240px 110px 1fr', padding: '10px 16px', background: 'var(--bg-1)', borderBottom: '1px solid var(--line)', ...mono, fontSize: 11, letterSpacing: '0.06em', color: 'var(--fg-3)' }}>
        <span>PROP</span><span>TYPE</span><span>DEFAULT</span><span>DESCRIPTION</span>
      </div>
      {API_ROWS.map(([name, type, def, desc], i) => (
        <div key={name} style={{
          display: 'grid', gridTemplateColumns: '170px 240px 110px 1fr',
          padding: '12px 16px', borderBottom: i < API_ROWS.length - 1 ? '1px solid var(--line)' : 'none',
          alignItems: 'baseline',
        }}>
          <span style={{ ...mono, color: 'var(--ac-text)' }}>{name}</span>
          <span style={{ ...mono, fontSize: 12.5, color: 'var(--fg-2)' }}>{type}</span>
          <span style={{ ...mono, fontSize: 12.5, color: 'var(--fg-2)' }}>{def}</span>
          <span style={{ color: 'var(--fg-2)' }}>{desc}</span>
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────── Composition code ─────────────────────────── */

function CompositionCode() {
  const dim = (t: string) => <span style={{ color: 'var(--fg-3)' }}>{t}</span>
  const tag = (t: string) => <span style={{ color: 'var(--fg)' }}>{t}</span>
  const str = (t: string) => <span style={{ color: 'var(--ac-text)' }}>{t}</span>
  const val = (t: string) => <span style={{ color: 'var(--fg-2)' }}>{t}</span>
  return (
    <pre style={{ margin: 0, padding: '18px 20px', borderRadius: 10, background: 'var(--bg-1)', border: '1px solid var(--line)', ...mono, fontSize: 13, lineHeight: 1.65, color: 'var(--fg-2)', overflowX: 'auto' }}>
{dim('import')}{' { DataGrid } '}{dim('from')} {str('"veloce-ui"')}{'\n\n'}
{dim('<')}{tag('DataGrid')} {dim('rows=')}{val('{rows}')} {dim('rowKey=')}{str('"id"')} {dim('groupBy=')}{str('["region"]')}{dim('>')}{'\n'}
{'  '}{dim('<')}{tag('DataGrid.Toolbar')} {dim('quickFilter density="comfortable" />')}{'\n'}
{'  '}{dim('<')}{tag('DataGrid.Column')} {dim('id=')}{str('"commit"')} {dim('header=')}{str('"Deployment"')} {dim('pin="left" sticky />')}{'\n'}
{'  '}{dim('<')}{tag('DataGrid.Column')} {dim('id=')}{str('"status"')} {dim('cell=')}{val('{StatusBadge}')} {dim('filter="enum" />')}{'\n'}
{'  '}{dim('<')}{tag('DataGrid.Column')} {dim('id=')}{str('"build"')} {dim('type="duration" aggregate="avg" align="right" />')}{'\n'}
{'  '}{dim('<')}{tag('DataGrid.Column')} {dim('id=')}{str('"traffic"')} {dim('cell=')}{val('{TrafficSparkline}')} {dim('sortable=')}{val('{false}')}{dim(' />')}{'\n'}
{'  '}{dim('<')}{tag('DataGrid.DetailPanel')}{dim(' render=')}{val('{BuildLog}')}{dim(' />')}{'\n'}
{'  '}{dim('<')}{tag('DataGrid.Pagination')} {dim('page=')}{val('{page}')} {dim('pageSize=')}{val('{10}')}{dim(' />')}{'\n'}
{dim('</')}{tag('DataGrid')}{dim('>')}
    </pre>
  )
}

/* ─────────────────────────── Page ─────────────────────────── */

export default function DataGridDoc() {
  const { prev, next } = prevNext('data-grid')
  return (
    <DocsShell sidebar={DOCS_SIDEBAR} rail={<RightRail toc={TOC} />}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
          <span style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--ac-soft)', border: '1px solid var(--ac-line, color-mix(in oklch, var(--ac) 40%, transparent))', display: 'grid', placeItems: 'center', color: 'var(--ac-text)', fontSize: 12 }}>▦</span>
          <span style={{ color: 'var(--ac-text)', fontWeight: 500 }}>Veloce Data Grid</span>
          <span style={{ color: 'var(--fg-3)' }}>/</span>
          <Link to="/components/data-grid" style={{ color: 'var(--fg-2)' }}>Overview</Link>
        </div>

        {/* Hero */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0, fontSize: 40, fontWeight: 600, letterSpacing: '-0.035em' }}>Data Grid</h1>
            <span style={{ ...mono, fontSize: 11.5, padding: '3px 8px', borderRadius: 6, background: 'color-mix(in oklch,var(--ok) 15%,transparent)', color: 'var(--ok)' }}>a11y ✓ grid pattern</span>
            <span style={{ ...mono, fontSize: 11.5, padding: '3px 8px', borderRadius: 6, border: '1px solid var(--line-2)', color: 'var(--fg-2)', whiteSpace: 'nowrap' }}>14.2 kB · tree-shakeable</span>
            <span style={{ ...mono, fontSize: 11.5, padding: '3px 8px', borderRadius: 6, background: 'var(--ac)', color: 'var(--ac-fg)' }}>v1.1 PRO</span>
          </div>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: 'var(--fg-2)', maxWidth: 720 }}>
            A fully-featured, virtualised grid that scales from 10 rows to 100,000. Compose columns declaratively, drive state server-side when you need to, and keep the keyboard-first experience of a native table — nothing is hidden behind a motion library.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, maxWidth: 720 }}>
            {[['38', 'built-in features'], ['100k', 'rows at 60 fps'], ['0 kB', 'animation runtime'], ['AA', 'WCAG 2.2']].map(([v, l]) => (
              <div key={l} style={{ padding: '14px 16px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg-1)' }}>
                <div style={{ ...sans, fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{v}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live demo — real component */}
        <section id="live" style={{ display: 'flex', flexDirection: 'column', gap: 14, scrollMarginTop: 20 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Live example</h2>
          <LiveDataGridDemo />
        </section>

        {/* Anatomy */}
        <section id="anatomy" style={sectionStyle}>
          <AnatomyPreview />
        </section>

        {/* Composition */}
        <section id="composition" style={sectionStyle}>
          <h2 style={h2Style}>Composition</h2>
          <CompositionCode />
        </section>

        {/* Columns */}
        <section id="columns" style={sectionStyle}>
          <h2 style={h2Style}>Columns</h2>
          <Grid cols="1.3fr 1fr"><ColumnMenuCard /><ResizeCard /></Grid>
        </section>

        {/* Filtering & sort */}
        <section id="filtering" style={sectionStyle}>
          <h2 style={h2Style}>Filtering &amp; sort</h2>
          <Grid cols="1fr 1fr 1fr"><QuickFilterCard /><FilterBuilderCard /><MultiSortCard /></Grid>
        </section>

        {/* Selection, editing & keyboard */}
        <section id="selection" style={sectionStyle}>
          <h2 style={h2Style}>Selection, editing &amp; keyboard</h2>
          <Grid cols="1fr 1fr 1fr"><SelectionCard /><CellEditingCard /><KeyboardCard /></Grid>
        </section>

        {/* Grouping, tree & pivot */}
        <section id="grouping" style={sectionStyle}>
          <h2 style={h2Style}>Grouping, tree &amp; pivot</h2>
          <Grid cols="1fr 1fr 1fr"><RowGroupingCard /><TreeDataCard /><PivotCard /></Grid>
        </section>

        {/* Scale & state */}
        <section id="scale" style={sectionStyle}>
          <h2 style={h2Style}>Scale &amp; state</h2>
          <Grid cols="1fr 1fr 1fr"><VirtualizationCard /><ServerSideCard /><LoadingEmptyCard /></Grid>
        </section>

        {/* Export, context & column types */}
        <section id="export" style={sectionStyle}>
          <h2 style={h2Style}>Export, context &amp; column types</h2>
          <Grid cols="1fr 1fr 1fr"><ExportMenuCard /><ContextMenuCard /><ColumnTypesCard /></Grid>
        </section>

        {/* API */}
        <section id="api" style={sectionStyle}>
          <h2 style={h2Style}>API <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--fg-3)', marginLeft: 6 }}>DataGrid</span></h2>
          <ApiTable />
        </section>

        {/* Prev/Next */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13.5 }}>
          {prev ? (
            <Link to={`/components/${prev.slug}`} style={{ padding: '14px 16px', border: '1px solid var(--line)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 4, color: 'inherit' }}>
              <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>← Previous</span>
              <span style={{ fontWeight: 500, color: 'var(--fg)' }}>{prev.label}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`/components/${next.slug}`} style={{ padding: '14px 16px', border: '1px solid var(--line)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'right', color: 'inherit' }}>
              <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>Next →</span>
              <span style={{ fontWeight: 500, color: 'var(--fg)' }}>{next.label}</span>
            </Link>
          ) : <span />}
        </div>
      </div>
    </DocsShell>
  )
}
