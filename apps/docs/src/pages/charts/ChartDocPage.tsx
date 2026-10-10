import { useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react'
import { ChartsShell, ChartsBreadcrumb, ChartsTitle } from './ChartsShell'
import type { ChartPage, LiveSample, TreeRow } from './chartsData'
import { useViewport } from '../../components/DocsShell'
import { Seo } from '../../Seo'
import { AccentSwitcher } from '../../components/AccentSwitcher'

const mono: CSSProperties = { fontFamily: 'var(--font-mono)' }

const TOC_WITH_LIVE = [
  { label: 'Live example', id: 'live', active: true },
  { label: 'Anatomy', id: 'anatomy' },
  { label: 'Composition', id: 'composition' },
  { label: 'Variants', id: 'variants' },
  { label: 'Motion', id: 'motion' },
  { label: 'Accessibility', id: 'accessibility' },
  { label: 'API', id: 'api' },
]

const TOC_NO_LIVE = [
  { label: 'Anatomy', id: 'anatomy', active: true },
  { label: 'Composition', id: 'composition' },
  { label: 'Variants', id: 'variants' },
  { label: 'Motion', id: 'motion' },
  { label: 'Accessibility', id: 'accessibility' },
  { label: 'API', id: 'api' },
]

function LiveExample({
  Component,
  sample,
}: {
  Component: React.ComponentType<any>
  sample: LiveSample
}) {
  const variants = sample.variants ?? []
  const [variantIdx, setVariantIdx] = useState(0)
  const activeProps = variants[variantIdx]?.props ?? sample.props
  const height = sample.height ?? 320
  return (
    <section id="live" style={sectionStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <h2 style={h2Style}>Live example</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: 'var(--fg-3)', ...mono }}>accent</span>
          <AccentSwitcher compact />
        </div>
      </div>
      {variants.length > 1 && (
        <div style={{ display: 'inline-flex', gap: 2, padding: 2, border: '1px solid var(--line)', borderRadius: 8, background: 'var(--bg-1)', alignSelf: 'flex-start' }}>
          {variants.map((v, i) => {
            const active = i === variantIdx
            return (
              <button
                key={v.label}
                onClick={() => setVariantIdx(i)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 12.5,
                  fontWeight: active ? 500 : 400,
                  background: active ? 'var(--bg-3)' : 'transparent',
                  color: active ? 'var(--fg)' : 'var(--fg-2)',
                  cursor: 'pointer',
                }}
              >
                {v.label}
              </button>
            )
          })}
        </div>
      )}
      <div
        style={{
          border: '1px solid var(--line)',
          borderRadius: 12,
          background: 'var(--bg-1)',
          padding: 20,
          minHeight: 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <Component
          {...activeProps}
          style={{
            width: '100%',
            height: 'auto',
            maxWidth: '100%',
            maxHeight: height,
            display: 'block',
            ...(activeProps.style as object || {}),
          }}
        />
      </div>
    </section>
  )
}

const h2Style: CSSProperties = {
  margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em',
}
const sectionStyle: CSSProperties = {
  scrollMarginTop: 20, display: 'flex', flexDirection: 'column', gap: 14,
}

const CORE_ROLES = ['grid', 'axes', 'xaxis', 'yaxis', 'series', 'series2', 'markers', 'tooltip-anchor', 'reference', 'legend', 'tooltip']

/** For a given selected node id → roles that stay opaque. Null/undefined = show all.
 *  `rolesInUse` is the set of roles actually tagged on shapes/texts of the current chart —
 *  used so a row whose role doesn't match anything falls back to its parent's broader focus. */
function focusFor(id: string | null, tree: TreeRow[], rolesInUse: Set<string>): string[] | null {
  if (!id) return null
  const node = tree.find((r) => r.id === id)
  if (!node) return null
  // Compute ALL_ROLES dynamically so per-series synthetic roles (series-0, series-1…) stay opaque
  // when the ChartContainer is selected.
  const ALL_ROLES = Array.from(new Set([...CORE_ROLES, ...rolesInUse]))
  // Series parent: include every per-series synthetic role actually in use, plus the legacy roles.
  const seriesSynthetic = Array.from(rolesInUse).filter((r) => r.startsWith('series-'))
  const seriesParent = ['series', 'series2', 'markers', 'tooltip', 'tooltip-anchor', ...seriesSynthetic]
  const base: Record<string, string[]> = {
    chart: ALL_ROLES,
    axes: ['axes', 'xaxis', 'yaxis', 'grid'],
    xaxis: ['xaxis'],
    yaxis: ['yaxis'],
    grid: ['grid'],
    polar: ['grid', 'axes', 'xaxis', 'yaxis'],
    series: seriesParent,
    tooltip: ['tooltip', 'markers', 'tooltip-anchor', 'series', 'series2'],
    crosshair: ['tooltip-anchor', 'markers', 'tooltip'],
    legend: ['legend'],
    markers: ['markers', 'series', 'series2', 'tooltip', 'tooltip-anchor'],
  }
  if (base[id]) return base[id]
  // series-N children
  if (id.startsWith('series-')) {
    const r = node.role
    // Only isolate per-child when that specific role actually exists on this chart.
    // Otherwise (e.g. pie's CenterLabel/ArcLabel — all pie shapes share one role), fall back to
    // the Series parent's broader focus so the chart doesn't go nearly blank.
    if (r && rolesInUse.has(r)) return [r, 'markers', 'tooltip', 'tooltip-anchor']
    return seriesParent
  }
  // Fall back to the node's own role
  if (node.role) return [node.role]
  return null
}

const BASE_ROW = { bg: 'transparent', color: 'var(--fg-2)', weight: 400, shadow: 'none', iconColor: 'var(--fg-3)' }

function allParentIds(tree: TreeRow[]): string[] {
  const set = new Set<string>()
  tree.forEach((r) => { if (r.parent) set.add(r.parent) })
  return Array.from(set)
}

function visibleRows(tree: TreeRow[], open: Record<string, boolean>): TreeRow[] {
  const byId: Record<string, TreeRow> = {}
  tree.forEach((r) => { byId[r.id] = r })
  const isVisible = (r: TreeRow): boolean => {
    let cur: TreeRow | undefined = r
    while (cur && cur.parent) {
      const p: TreeRow | undefined = byId[cur.parent]
      if (!p) return true
      if (!open[p.id]) return false
      cur = p
    }
    return true
  }
  return tree.filter(isVisible)
}

function useAnatomyTree({ tree, rolesInUse }: { tree: TreeRow[]; rolesInUse: Set<string> }) {
  const parents = useMemo(() => new Set(allParentIds(tree)), [tree])
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const o: Record<string, boolean> = {}
    parents.forEach((id) => { o[id] = id === 'chart' || id === 'axes' || id === 'series' || id === 'polar' })
    return o
  })
  // Default to the Series node so the preview has a sensible initial focus (same as the Line page).
  // The baked-in "active"/"focus" data styling is purely artboard decoration — we strip it so the
  // live selection is the only highlighted row.
  const [selected, setSelected] = useState<string | null>(() => {
    if (tree.some((r) => r.id === 'series')) return 'series'
    if (tree.some((r) => r.id === 'chart')) return 'chart'
    return null
  })
  const treeRef = useRef<HTMLDivElement>(null)

  const focusSet = focusFor(selected, tree, rolesInUse)
  const isDimmed = (role?: string) => focusSet !== null && !!role && !focusSet.includes(role)
  const fade: CSSProperties = { transition: 'opacity 200ms var(--easing-standard, cubic-bezier(.22,1,.36,1))' }

  const onRowClick = (row: TreeRow, e: MouseEvent) => {
    if (e.altKey) {
      const next: Record<string, boolean> = {}
      parents.forEach((id) => { next[id] = true })
      setOpen(next)
    } else if (parents.has(row.id)) {
      setOpen((prev) => ({ ...prev, [row.id]: !prev[row.id] }))
    }
    setSelected(row.id)
  }

  const onChevronClick = (row: TreeRow, e: MouseEvent) => {
    e.stopPropagation()
    if (e.altKey) {
      const next: Record<string, boolean> = {}
      parents.forEach((id) => { next[id] = true })
      setOpen(next)
      return
    }
    setOpen((prev) => ({ ...prev, [row.id]: !prev[row.id] }))
  }

  const onTreeKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const vis = visibleRows(tree, open)
    const current = (document.activeElement as HTMLElement | null)?.dataset.node
    const i = current ? vis.findIndex((r) => r.id === current) : -1
    const next = vis[Math.min(vis.length - 1, Math.max(0, i + (e.key === 'ArrowDown' ? 1 : -1)))]
    if (next) treeRef.current?.querySelector<HTMLButtonElement>(`[data-node="${next.id}"]`)?.focus()
  }

  const vis = visibleRows(tree, open)
  return { vis, open, selected, parents, isDimmed, fade, onRowClick, onChevronClick, onTreeKeyDown, treeRef }
}

export default function ChartDocPage({ page }: { page: ChartPage }) {
  const rolesInUse = useMemo(() => {
    const s = new Set<string>()
    page.shapes.forEach((sh) => { if (sh.role) s.add(sh.role) })
    page.texts.forEach((tx) => { if (tx.role) s.add(tx.role) })
    return s
  }, [page])
  const t = useAnatomyTree({ tree: page.tree, rolesInUse })
  const { vis, open, selected, parents, isDimmed, fade, onRowClick, onChevronClick, onTreeKeyDown, treeRef } = t
  const { isMobile } = useViewport()

  const hasLive = Boolean(page.Component && page.sample)
  return (
    <ChartsShell toc={hasLive ? TOC_WITH_LIVE : TOC_NO_LIVE}>
      <Seo title={page.name} description={page.tagline} />
      <ChartsBreadcrumb />
      <ChartsTitle title={page.name} lead={page.tagline} />

      {hasLive && <LiveExample Component={page.Component!} sample={page.sample!} />}

      {/* Anatomy */}
      <section id="anatomy" style={sectionStyle}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '300px 1fr',
            border: '1px solid var(--line)',
            borderRadius: 12,
            overflow: 'hidden',
            background: 'var(--bg-1)',
          }}
        >
          {/* Left: interactive tree */}
          <div
            style={{
              borderRight: '1px solid var(--line)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              ref={treeRef}
              onKeyDown={onTreeKeyDown}
              style={{ padding: '10px 0', display: 'flex', flexDirection: 'column' }}
            >
              {vis.map((row) => {
                const isParent = parents.has(row.id)
                const isSelected = selected === row.id
                const isOpen = !!open[row.id]
                // The data's baked-in "active"/"focus" row states are artboard decoration — strip them
                // from every non-selected row so the live selection is the only visually active one.
                const stripBaked = !isSelected
                const bg = isSelected ? 'var(--ac-soft)' : stripBaked ? BASE_ROW.bg : row.bg
                const color = isSelected ? 'var(--ac-text)' : stripBaked ? BASE_ROW.color : row.color
                const weight = isSelected ? 500 : stripBaked ? BASE_ROW.weight : row.weight
                const shadow = isSelected ? 'inset 2px 0 0 var(--ac)' : stripBaked ? BASE_ROW.shadow : row.shadow
                const iconColor = isSelected ? 'var(--ac-text)' : stripBaked ? BASE_ROW.iconColor : row.iconColor
                return (
                  <button
                    key={row.id}
                    data-node={row.id}
                    onClick={(e) => onRowClick(row, e)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      paddingLeft: row.pad,
                      paddingRight: 12,
                      height: 26,
                      background: bg,
                      color,
                      fontWeight: weight,
                      boxShadow: shadow,
                      fontSize: 12.5,
                      textAlign: 'left',
                      border: 'none',
                      width: '100%',
                      cursor: 'pointer',
                    }}
                  >
                    <span
                      onClick={isParent ? (e) => onChevronClick(row, e) : undefined}
                      style={{
                        width: 14,
                        color: 'var(--fg-3)',
                        fontSize: 11,
                        textAlign: 'center',
                        cursor: isParent ? 'pointer' : 'default',
                      }}
                    >
                      {isParent ? (isOpen ? '⌄' : '›') : ''}
                    </span>
                    <span style={{ color: iconColor, width: 14, textAlign: 'center' }}>
                      {row.icon}
                    </span>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {row.label}
                    </span>
                    {row.meta ? (
                      <span style={{ ...mono, fontSize: 11, color: 'var(--fg-3)' }}>{row.meta}</span>
                    ) : null}
                  </button>
                )
              })}
            </div>
            <div
              style={{
                ...mono,
                borderTop: '1px solid var(--line)',
                padding: '8px 12px',
                fontSize: 11,
                color: 'var(--fg-3)',
                marginTop: 'auto',
                lineHeight: 1.5,
              }}
            >
              {'<TreeView>'} · click a node to isolate · ↑ ↓ moves focus · ⌥-click expands all
            </div>
          </div>

          {/* Right: preview */}
          <div
            style={{
              position: 'relative',
              padding: 20,
              background:
                'radial-gradient(var(--line) 1px, transparent 1px) 0 0 / 16px 16px, var(--bg)',
            }}
          >
            {/* Top row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <div
                data-role="legend"
                style={{
                  display: 'flex',
                  gap: 14,
                  fontSize: 12,
                  color: 'var(--fg-2)',
                  opacity: isDimmed('legend') ? 0.18 : 1,
                  ...fade,
                }}
              >
                {page.legend.map((lg, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 3, borderRadius: 2, background: lg.c, display: 'inline-block' }} />
                    {lg.l}
                  </span>
                ))}
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  padding: 3,
                  border: '1px solid var(--line)',
                  borderRadius: 8,
                  background: 'var(--bg-1)',
                  ...mono,
                  fontSize: 11,
                }}
              >
                <span style={{ padding: '3px 8px', color: 'var(--fg-3)' }}>6M</span>
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: 5,
                    background: 'var(--bg-3)',
                    color: 'var(--fg)',
                  }}
                >
                  1Y
                </span>
                <span style={{ padding: '3px 8px', color: 'var(--fg-3)' }}>All</span>
              </div>
            </div>

            <svg
              viewBox="0 0 600 240"
              style={{ width: '100%', overflow: 'visible', display: 'block' }}
            >
              <defs>
                <linearGradient id="vl-ga" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--ac)" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="var(--ac)" stopOpacity="0.08" />
                </linearGradient>
              </defs>
              {page.shapes.map((s, i) => {
                const dim = isDimmed(s.role)
                return (
                  <path
                    key={i}
                    data-role={s.role}
                    d={s.d}
                    fill={s.fill}
                    stroke={s.stroke}
                    strokeWidth={s.sw}
                    strokeDasharray={s.dash || undefined}
                    opacity={dim ? 0.18 : s.op}
                    strokeLinecap={(s.lc || 'butt') as 'butt' | 'round' | 'square'}
                    strokeLinejoin="round"
                    style={fade}
                  />
                )
              })}
              {page.texts.map((tn, i) => {
                const dim = isDimmed(tn.role)
                return (
                  <text
                    key={i}
                    data-role={tn.role}
                    x={tn.x}
                    y={tn.y}
                    fontSize={tn.size}
                    fontWeight={tn.weight}
                    fill={tn.fill}
                    textAnchor={tn.anchor}
                    fontFamily={tn.font}
                    opacity={dim ? 0.18 : 1}
                    style={fade}
                  >
                    {tn.t}
                  </text>
                )
              })}
            </svg>

            {/* Tooltip */}
            {page.tipShow !== false && (
              <div
                data-role="tooltip"
                style={{
                  position: 'absolute',
                  top: 6,
                  left: page.tip.left,
                  width: 176,
                  background: 'var(--bg-2)',
                  border: '1px solid var(--line)',
                  borderRadius: 8,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                  padding: 10,
                  fontSize: 12,
                  opacity: isDimmed('tooltip') ? 0.18 : 1,
                  ...fade,
                }}
              >
                <div style={{ ...mono, fontSize: 11, color: 'var(--fg-3)', marginBottom: 6 }}>
                  {page.tip.title}
                </div>
                {page.tip.rows.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '2px 0',
                      fontSize: 12,
                      color: 'var(--fg-2)',
                    }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: r.c, flex: '0 0 auto' }} />
                    <span style={{ flex: 1 }}>{r.l}</span>
                    <span style={{ ...mono, color: 'var(--fg)', fontVariantNumeric: 'tabular-nums' }}>
                      {r.v}
                    </span>
                  </div>
                ))}
                <div
                  style={{
                    borderTop: '1px solid var(--line)',
                    marginTop: 6,
                    paddingTop: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 11,
                    color: 'var(--fg-3)',
                  }}
                >
                  <span>{page.tip.fl}</span>
                  <span style={{ ...mono, color: page.tip.fc, fontVariantNumeric: 'tabular-nums' }}>
                    {page.tip.fv}
                  </span>
                </div>
              </div>
            )}

            {/* X labels */}
            {page.xlabels.length > 0 && (
              <div
                data-role="xaxis"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '6px 12px 0',
                  ...mono,
                  fontSize: 10.5,
                  color: 'var(--fg-3)',
                  opacity: isDimmed('xaxis') ? 0.18 : 1,
                  ...fade,
                }}
              >
                {page.xlabels.map((l, i) => (
                  <span key={i}>{l}</span>
                ))}
              </div>
            )}

            {/* Note */}
            <div
              style={{
                position: 'absolute',
                right: 14,
                bottom: 10,
                ...mono,
                fontSize: 10.5,
                color: 'var(--fg-3)',
              }}
            >
              {page.note}
            </div>
          </div>
        </div>
      </section>

      {/* Composition */}
      <section id="composition" style={sectionStyle}>
        <h2 style={h2Style}>Composition</h2>
        <pre
          style={{
            ...mono,
            fontSize: 13,
            lineHeight: 1.65,
            padding: '18px 20px',
            borderRadius: 10,
            background: 'var(--bg-1)',
            border: '1px solid var(--line)',
            margin: 0,
            whiteSpace: 'pre',
            overflowX: 'auto',
          }}
        >
          {page.code.map((line, i) => (
            <div key={i}>
              {line.segs.map((s, j) => (
                <span key={j} style={{ color: s.color }}>
                  {s.t}
                </span>
              ))}
            </div>
          ))}
        </pre>
      </section>

      {/* Variants */}
      <section id="variants" style={sectionStyle}>
        <h2 style={h2Style}>Variants</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 12,
          }}
        >
          {page.variants.map(([title, desc], i) => (
            <div
              key={i}
              style={{
                border: '1px solid var(--line)',
                background: 'var(--bg-1)',
                borderRadius: 10,
                padding: '14px 16px',
              }}
            >
              <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--fg-2)' }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Motion */}
      <section id="motion" style={sectionStyle}>
        <h2 style={h2Style}>Motion spec</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
            border: '1px solid var(--line)',
            borderRadius: 10,
            background: 'var(--bg-1)',
            overflow: 'hidden',
          }}
        >
          {page.motion.map(([label, timing, body], i) => (
            <div
              key={i}
              style={{
                padding: '14px 16px',
                borderRight: i < page.motion.length - 1 ? '1px solid var(--line)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div
                style={{
                  ...mono,
                  fontSize: 11,
                  letterSpacing: '0.06em',
                  color: 'var(--fg-3)',
                  textTransform: 'uppercase',
                }}
              >
                {label}
              </div>
              <div style={{ ...mono, fontSize: 11.5, color: 'var(--ac-text)' }}>{timing}</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.5, color: 'var(--fg-2)' }}>{body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Accessibility */}
      <section id="accessibility" style={sectionStyle}>
        <h2 style={h2Style}>Accessibility</h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
          <div
            style={{
              border: '1px solid var(--line)',
              background: 'var(--bg-1)',
              borderRadius: 10,
              padding: '14px 16px',
              fontSize: 13.5,
              lineHeight: 1.6,
              color: 'var(--fg-2)',
            }}
          >
            {page.a11y}
          </div>
          <div
            style={{
              border: '1px solid var(--line)',
              background: 'var(--bg-1)',
              borderRadius: 10,
              padding: '14px 16px',
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              rowGap: 8,
              columnGap: 12,
              alignItems: 'center',
              fontSize: 13,
              color: 'var(--fg-2)',
            }}
          >
            {[
              ['← →', 'Move along the primary axis'],
              ['↑ ↓', 'Switch series'],
              ['T', 'Toggle the data table'],
              ['Esc', 'Dismiss tooltip / exit chart'],
            ].map(([k, label], i) => (
              <SpanKbd key={i} k={k} label={label} />
            ))}
          </div>
        </div>
      </section>

      {/* API */}
      <section id="api" style={sectionStyle}>
        <h2 style={h2Style}>API</h2>
        <div
          style={{
            border: '1px solid var(--line)',
            borderRadius: 10,
            background: 'var(--bg-1)',
            overflow: 'hidden',
          }}
        >
          {!isMobile && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '150px 230px 110px 1fr',
                padding: '10px 14px',
                background: 'var(--bg-1)',
                borderBottom: '1px solid var(--line)',
                ...mono,
                fontSize: 11,
                letterSpacing: '0.06em',
                color: 'var(--fg-3)',
                textTransform: 'uppercase',
              }}
            >
              <span>Prop</span>
              <span>Type</span>
              <span>Default</span>
              <span>Description</span>
            </div>
          )}
          {page.props.map((p, i) => (
            <div
              key={i}
              style={isMobile ? {
                padding: '12px 14px',
                borderBottom: i < page.props.length - 1 ? '1px solid var(--line)' : 'none',
                fontSize: 13, color: 'var(--fg-2)',
                display: 'flex', flexDirection: 'column', gap: 6,
              } : {
                display: 'grid',
                gridTemplateColumns: '150px 230px 110px 1fr',
                padding: '10px 14px',
                borderBottom: i < page.props.length - 1 ? '1px solid var(--line)' : 'none',
                fontSize: 13,
                alignItems: 'baseline',
                color: 'var(--fg-2)',
              }}
            >
              {isMobile ? (
                <>
                  <div style={{ ...mono, color: 'var(--ac-text)', fontWeight: 500 }}>{p.name}</div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: 12 }}>
                    <span style={{ ...mono, color: 'var(--fg-2)' }}>{p.type}</span>
                    <span style={{ ...mono, color: 'var(--fg-3)' }}>default: {p.def}</span>
                  </div>
                  <div>{p.desc}</div>
                </>
              ) : (
                <>
                  <span style={{ ...mono, color: 'var(--ac-text)' }}>{p.name}</span>
                  <span style={{ ...mono, color: 'var(--fg-2)' }}>{p.type}</span>
                  <span style={{ ...mono, color: 'var(--fg-2)' }}>{p.def}</span>
                  <span>{p.desc}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </ChartsShell>
  )
}

function SpanKbd({ k, label }: { k: string; label: string }) {
  return (
    <>
      <kbd
        style={{
          ...mono,
          border: '1px solid var(--line-2)',
          borderRadius: 4,
          padding: '2px 6px',
          background: 'var(--bg-1)',
          color: 'var(--fg)',
          fontSize: 11.5,
          whiteSpace: 'nowrap',
          justifySelf: 'start',
        }}
      >
        {k}
      </kbd>
      <span>{label}</span>
    </>
  )
}
