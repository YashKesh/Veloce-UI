import { Fragment } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Sidebar } from 'veloce-ui'
import { DocsShell, RightRail, useViewport } from '../../components/DocsShell'
import type { TocItem } from '../../components/DocsShell'
import { DOCS_SIDEBAR, prevNext } from '../../docsNav'
import { useAnatomy, type AnatomyTreeRow } from '../../components/useAnatomy'

const mono: CSSProperties = { fontFamily: 'var(--font-mono)' }
const sans: CSSProperties = { fontFamily: 'var(--font-sans)' }

const TOC: TocItem[] = [
  { label: 'Anatomy', id: 'anatomy', active: true },
  { label: 'Composition', id: 'composition' },
  { label: 'Variants', id: 'variants' },
  { label: 'Collapse behavior', id: 'collapse-behavior' },
  { label: 'Accessibility', id: 'accessibility' },
  { label: 'API', id: 'api' },
]

const h2Style: CSSProperties = { margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }
const sectionStyle: CSSProperties = { scrollMarginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }
const cardStyle: CSSProperties = {
  padding: 16, border: '1px solid var(--line)', borderRadius: 10,
  background: 'var(--bg-1)', display: 'flex', flexDirection: 'column', gap: 10,
}
const cardTitle: CSSProperties = { fontSize: 13.5, fontWeight: 600 }

/* ─────────────────────────── Anatomy tree ─────────────────────────── */

interface SidebarTreeRow extends AnatomyTreeRow {
  label: ReactNode
}

const SIDEBAR_TREE: SidebarTreeRow[] = [
  { id: 'sidebar', depth: 0, chev: '⌄', icon: '▭', label: 'Sidebar', role: 'sidebar' },
  { id: 'group', parent: 'sidebar', depth: 1, chev: '⌄', icon: '≡', label: 'Group', role: 'group' },
  { id: 'section', parent: 'group', depth: 2, chev: '⌄', icon: '⊟', label: 'Section · Overlays', role: 'section' },
  { id: 'item-overlays', parent: 'section', depth: 3, icon: '•', label: 'Item · Overview', role: 'item' },
  { id: 'item-dialog', parent: 'section', depth: 3, chev: '⌄', icon: '•', label: 'Item · Dialog (active)', role: 'item-dialog' },
  { id: 'sub-basics', parent: 'item-dialog', depth: 4, icon: '⌁', label: 'Sub · Basics', role: 'sub-basics' },
  { id: 'sub-variants', parent: 'item-dialog', depth: 4, icon: '⌁', label: 'Sub · Variants', role: 'sub-variants' },
  { id: 'sub-keyboard', parent: 'item-dialog', depth: 4, icon: '⌁', label: 'Sub · Keyboard', role: 'sub-keyboard' },
  { id: 'item-popover', parent: 'section', depth: 3, icon: '•', label: 'Item · Popover', role: 'item' },
  { id: 'item-tooltip', parent: 'section', depth: 3, icon: '•', label: 'Item · Tooltip', role: 'item' },
  { id: 'item', parent: 'group', depth: 2, icon: '•', label: 'Item · Primitives', role: 'item' },
  { id: 'footer', parent: 'sidebar', depth: 1, chev: '⌄', icon: '▭', label: 'Footer', role: 'footer' },
  { id: 'theme-ctrl', parent: 'footer', depth: 2, icon: '◐', label: 'ThemeControl', role: 'theme-ctrl' },
  { id: 'motion-switch', parent: 'footer', depth: 2, icon: '◉', label: 'MotionSwitch', role: 'motion-switch' },
  { id: 'links', parent: 'footer', depth: 2, icon: '↗', label: 'Links', role: 'links' },
]

const SIDEBAR_ALL_ROLES = Array.from(new Set(SIDEBAR_TREE.map((r) => r.role!).filter(Boolean)))

function sidebarFocusFor(id: string | null): string[] | null {
  if (!id) return null
  const map: Record<string, string[]> = {
    sidebar: SIDEBAR_ALL_ROLES,
    group: ['group', 'section', 'item', 'item-dialog', 'sub-basics', 'sub-variants', 'sub-keyboard', 'sidebar'],
    section: ['section', 'item', 'item-dialog', 'sub-basics', 'sub-variants', 'sub-keyboard', 'group', 'sidebar'],
    'item-overlays': ['item', 'section', 'group', 'sidebar'],
    'item-dialog': ['item-dialog', 'sub-basics', 'sub-variants', 'sub-keyboard', 'section', 'group', 'sidebar'],
    'sub-basics': ['sub-basics', 'item-dialog', 'section', 'group', 'sidebar'],
    'sub-variants': ['sub-variants', 'item-dialog', 'section', 'group', 'sidebar'],
    'sub-keyboard': ['sub-keyboard', 'item-dialog', 'section', 'group', 'sidebar'],
    'item-popover': ['item', 'section', 'group', 'sidebar'],
    'item-tooltip': ['item', 'section', 'group', 'sidebar'],
    item: ['item', 'section', 'group', 'sidebar'],
    footer: ['footer', 'theme-ctrl', 'motion-switch', 'links', 'sidebar'],
    'theme-ctrl': ['theme-ctrl', 'footer', 'sidebar'],
    'motion-switch': ['motion-switch', 'footer', 'sidebar'],
    links: ['links', 'footer', 'sidebar'],
  }
  return map[id] ?? null
}

/* ─────────────────────────── Mock sidebar ─────────────────────────── */

function GroupTitle({ label, open }: { label: string; open?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '10px 10px 6px 10px',
      ...mono, fontSize: 10.5, letterSpacing: '0.08em', color: 'var(--fg-3)',
    }}>
      <span style={{ fontSize: 9 }}>{open ? '⌄' : '›'}</span>
      <span style={{ textTransform: 'uppercase' }}>{label}</span>
    </div>
  )
}

function SideItem({ label, active, chip, indent = 0, chev, sub, role, dim }: {
  label: string; active?: boolean; chip?: string; indent?: number; chev?: '›' | '⌄'; sub?: boolean
  role?: string; dim?: CSSProperties
}) {
  return (
    <div data-role={role} style={{
      ...(dim || {}),
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '6px 10px', paddingLeft: 10 + indent * 12,
      margin: '0 6px', borderRadius: 7,
      color: active ? 'var(--ac-text)' : 'var(--fg-2)',
      background: active ? 'var(--ac-soft)' : 'transparent',
      fontSize: sub ? 12 : 13,
      fontWeight: active ? 500 : 400,
      cursor: 'default',
    }} aria-current={active ? 'page' : undefined}>
      {chev ? <span style={{ fontSize: 10, color: 'var(--fg-3)', width: 10 }}>{chev}</span> : <span style={{ width: 10 }} />}
      <span style={{ flex: 1 }}>{label}</span>
      {chip ? <span style={{ ...mono, fontSize: 9.5, padding: '1px 6px', borderRadius: 4, background: 'var(--bg-2)', color: 'var(--fg-3)' }}>{chip}</span> : null}
    </div>
  )
}

function MockSidebar({ dim }: { dim: (role?: string) => CSSProperties }) {
  return (
    <div data-role="sidebar" style={{
      ...dim('sidebar'),
      width: 300, background: 'var(--bg-1)', borderRadius: 10,
      border: '1px solid var(--line)', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <nav aria-label="Secondary" style={{ display: 'flex', flexDirection: 'column', padding: '8px 0', gap: 2 }}>
        <GroupTitle label="Getting started" />
        <SideItem label="Introduction" chev="›" />

        <div data-role="group" style={dim('group')}>
          <GroupTitle label="Components" open />
          <SideItem label="Primitives" chev="›" indent={0} role="item" dim={dim('item')} />
          <div data-role="section" style={dim('section')}>
            <SideItem label="Overlays" chev="⌄" indent={0} />
            <SideItem label="Dialog" active indent={1} chip="NEW" role="item-dialog" dim={dim('item-dialog')} />
            <SideItem label="Basics" indent={2} sub role="sub-basics" dim={dim('sub-basics')} />
            <SideItem label="Variants" indent={2} sub role="sub-variants" dim={dim('sub-variants')} />
            <SideItem label="Keyboard" indent={2} sub role="sub-keyboard" dim={dim('sub-keyboard')} />
            <SideItem label="Popover" indent={1} role="item" dim={dim('item')} />
            <SideItem label="Tooltip" indent={1} role="item" dim={dim('item')} />
          </div>
        </div>

        <GroupTitle label="Charts" />
        <SideItem label="Overview" chev="›" />
      </nav>

      {/* footer */}
      <div data-role="footer" style={{ ...dim('footer'), marginTop: 'auto', borderTop: '1px solid var(--line)', padding: '12px' }}>
        <div data-role="theme-ctrl" style={{ ...dim('theme-ctrl'), display: 'flex', gap: 4, padding: 3, borderRadius: 8, background: 'var(--bg-2)', border: '1px solid var(--line)' }}>
          {['Light', 'Dark', 'Auto'].map((t, i) => (
            <span key={t} style={{
              flex: 1, textAlign: 'center',
              padding: '5px 0', borderRadius: 6, fontSize: 11,
              background: i === 1 ? 'var(--bg)' : 'transparent',
              border: i === 1 ? '1px solid var(--line-2)' : '1px solid transparent',
              color: i === 1 ? 'var(--fg)' : 'var(--fg-3)',
            }}>{t}</span>
          ))}
        </div>
        <div data-role="motion-switch" style={{ ...dim('motion-switch'), display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, fontSize: 12, color: 'var(--fg-2)' }}>
          <span>Reduced motion</span>
          <span style={{
            width: 28, height: 16, borderRadius: 10, background: 'var(--bg-2)',
            border: '1px solid var(--line-2)', position: 'relative',
          }}>
            <span style={{
              position: 'absolute', top: 1, left: 1, width: 12, height: 12,
              borderRadius: '50%', background: 'var(--fg-3)',
            }} />
          </span>
        </div>
        <div data-role="links" style={{ ...dim('links'), display: 'flex', gap: 10, marginTop: 12, fontSize: 11, color: 'var(--fg-3)', ...mono }}>
          <span>GitHub</span><span>·</span><span>Discord</span><span>·</span><span>Figma</span>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────── Anatomy ─────────────────────────── */

function AnatomyPreview() {
  const { vis, open, parents, dimStyle, onRowClick, onKeyDown, treeRef } = useAnatomy(
    SIDEBAR_TREE,
    sidebarFocusFor,
    'item-dialog',
    (parents) => {
      const o: Record<string, boolean> = {}
      parents.forEach((id) => { o[id] = true })
      return o
    },
  )
  const { isMobile, isTablet } = useViewport()
  const narrow = isMobile || isTablet
  return (
    <div style={{ overflowX: narrow ? 'auto' : 'visible', minWidth: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '300px 1fr', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg-1)', minWidth: narrow ? 760 : undefined }}>
        {/* Left tree */}
        <div style={{ borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column' }}>
          <div ref={treeRef} onKeyDown={onKeyDown} style={{ padding: '10px 0', display: 'flex', flexDirection: 'column' }}>
            {vis.map((row) => {
              const isParent = parents.has(row.id)
              const isOpen = !!open[row.id]
              return (
                <button
                  key={row.id}
                  data-node={row.id}
                  onClick={(e) => onRowClick(row, e)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    paddingLeft: 8 + row.depth * 15, paddingRight: 12, height: 26,
                    background: 'transparent',
                    color: 'var(--fg-2)',
                    fontSize: 12.5, textAlign: 'left', border: 'none', width: '100%',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ width: 14, color: 'var(--fg-3)', fontSize: 11, textAlign: 'center' }}>
                    {isParent ? (isOpen ? '⌄' : '›') : (row.chev ?? '')}
                  </span>
                  <span style={{ width: 14, textAlign: 'center', color: 'var(--fg-3)', fontSize: 12 }}>
                    {row.icon ?? ''}
                  </span>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.label as ReactNode}</span>
                  {row.meta ? <span style={{ ...mono, fontSize: 11, color: 'var(--fg-3)' }}>{row.meta}</span> : null}
                </button>
              )
            })}
          </div>
          <div style={{ ...mono, borderTop: '1px solid var(--line)', padding: '8px 12px', fontSize: 11, color: 'var(--fg-3)', marginTop: 'auto', lineHeight: 1.5 }}>
            {'<TreeView>'} · click a node to isolate · ↑ ↓ moves focus · ⌥-click expands all
          </div>
        </div>

        {/* Right: mock sidebar */}
        <div style={{
          background: 'var(--bg)',
          backgroundImage: 'radial-gradient(circle, color-mix(in oklch, var(--fg) 8%, transparent) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
          padding: 18,
          display: 'flex', justifyContent: 'center',
        }}>
          <MockSidebar dim={dimStyle} />
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────── Composition ─────────────────────────── */

function CompositionCode() {
  const dim = (t: string) => <span style={{ color: 'var(--fg-3)' }}>{t}</span>
  const tag = (t: string) => <span style={{ color: 'var(--fg)' }}>{t}</span>
  const str = (t: string) => <span style={{ color: 'var(--ac-text)' }}>{t}</span>
  const val = (t: string) => <span style={{ color: 'var(--fg-2)' }}>{t}</span>
  return (
    <pre style={{ margin: 0, padding: '18px 20px', borderRadius: 10, background: 'var(--bg-1)', border: '1px solid var(--line)', ...mono, fontSize: 13, lineHeight: 1.65, color: 'var(--fg-2)', overflowX: 'auto' }}>
{dim('import')}{' { Sidebar } '}{dim('from')} {str('"veloce-ui"')}{'\n\n'}
{dim('<')}{tag('Sidebar')} {dim('width=')}{val('{264}')} {dim('footer=')}{val('{<Footer />}')}{dim('>')}{'\n'}
{'  '}{dim('{groups.map((g) => (')}{'\n'}
{'    '}{dim('<')}{tag('Sidebar.Group')} {dim('key=')}{val('{g.id}')} {dim('title=')}{val('{g.title}')}{dim('>')}{'\n'}
{'      '}{dim('{g.sections.map((s) => (')}{'\n'}
{'        '}{dim('<')}{tag('Sidebar.Section')} {dim('key=')}{val('{s.id}')} {dim('title=')}{val('{s.title}')} {dim('defaultOpen=')}{val('{s.open}')}{dim('>')}{'\n'}
{'          '}{dim('{s.items.map((i) => (')}{'\n'}
{'            '}{dim('<')}{tag('Sidebar.Item')} {dim('key=')}{val('{i.to}')} {dim('to=')}{val('{i.to}')} {dim('active=')}{val('{i.active}')} {dim('chip=')}{val('{i.chip}')}{dim('>')}{'\n'}
{'              '}{val('{i.label}')}{'\n'}
{'            '}{dim('</')}{tag('Sidebar.Item')}{dim('>')}{'\n'}
{'          '}{dim('))}')}{'\n'}
{'        '}{dim('</')}{tag('Sidebar.Section')}{dim('>')}{'\n'}
{'      '}{dim('))}')}{'\n'}
{'    '}{dim('</')}{tag('Sidebar.Group')}{dim('>')}{'\n'}
{'  '}{dim('))}')}{'\n'}
{dim('</')}{tag('Sidebar')}{dim('>')}
    </pre>
  )
}

/* ─────────────────────────── API ─────────────────────────── */

type ApiRow = { prop: string; type: string; def: string; desc: string }
type ApiGroup = { name: string; rows: ApiRow[] }

const API: ApiGroup[] = [
  {
    name: 'Sidebar',
    rows: [
      { prop: 'width', type: 'number', def: '264', desc: 'Fixed pixel width of the rail. Use 220 for compact, 300 for docs sites.' },
      { prop: 'collapsible', type: 'boolean', def: 'true', desc: 'Allows the entire rail to collapse to an icon-only strip.' },
      { prop: 'defaultCollapsed', type: 'boolean', def: 'false', desc: 'Starts in collapsed state. Combine with collapsible.' },
      { prop: 'footer', type: 'ReactNode', def: '—', desc: 'Content pinned to the bottom of the rail — theme switch, links, user menu.' },
      { prop: 'onSelect', type: '(href) => void', def: '—', desc: 'Fired when any Sidebar.Item is activated. Useful for analytics.' },
      { prop: 'density', type: '"compact" | "cozy"', def: '"cozy"', desc: 'Row height preset. compact=28, cozy=32.' },
    ],
  },
  {
    name: 'Sidebar.Group',
    rows: [
      { prop: 'title', type: 'string', def: '—', desc: 'Uppercase label rendered above the group items.' },
      { prop: 'defaultOpen', type: 'boolean', def: 'true', desc: 'Whether the group is expanded on first render.' },
    ],
  },
  {
    name: 'Sidebar.Section',
    rows: [
      { prop: 'title', type: 'string', def: '—', desc: 'Collapsible header for the nested set.' },
      { prop: 'defaultOpen', type: 'boolean', def: 'false', desc: 'Opens automatically when a child matches the current route.' },
      { prop: 'badge', type: 'ReactNode', def: '—', desc: 'Trailing badge — count or status indicator.' },
    ],
  },
  {
    name: 'Sidebar.Item',
    rows: [
      { prop: 'to', type: 'string', def: '—', desc: 'Route path, rendered through your router\'s Link.' },
      { prop: 'active', type: 'boolean', def: '—', desc: 'Marks the current page. Emits aria-current="page".' },
      { prop: 'disabled', type: 'boolean', def: '—', desc: 'Dimmed and non-interactive.' },
      { prop: 'chip', type: 'ReactNode', def: '—', desc: 'Trailing badge like "NEW" or "Beta".' },
      { prop: 'icon', type: 'ReactNode', def: '—', desc: 'Leading glyph used in dashboard variants.' },
    ],
  },
  {
    name: 'Sidebar.Sub',
    rows: [
      { prop: 'to', type: 'string', def: '—', desc: 'Route path for the parent page.' },
      { prop: 'id', type: 'string', def: '—', desc: 'Element id used as the scroll anchor on the parent page.' },
      { prop: 'active', type: 'boolean', def: '—', desc: 'Currently-visible section (scroll-spy wires this).' },
    ],
  },
  {
    name: 'Sidebar.Footer',
    rows: [
      { prop: '—', type: '—', def: '—', desc: 'No props. Drop in theme switcher, reduced-motion toggle, external links.' },
    ],
  },
]

function ApiTable() {
  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden', fontSize: 13.5 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '180px 220px 110px 1fr', padding: '10px 16px', background: 'var(--bg-1)', borderBottom: '1px solid var(--line)', ...mono, fontSize: 11, letterSpacing: '0.06em', color: 'var(--fg-3)' }}>
        <span>PROP</span><span>TYPE</span><span>DEFAULT</span><span>DESCRIPTION</span>
      </div>
      {API.map((group, gi) => (
        <div key={group.name}>
          <div style={{
            padding: '10px 16px', background: 'var(--bg-2)',
            borderTop: gi === 0 ? 'none' : '1px solid var(--line)',
            borderBottom: '1px solid var(--line)',
            ...mono, fontSize: 11.5, color: 'var(--ac-text)', letterSpacing: '0.04em',
          }}>{group.name}</div>
          {group.rows.map((r, i) => (
            <div key={r.prop + i} style={{
              display: 'grid', gridTemplateColumns: '180px 220px 110px 1fr',
              padding: '12px 16px',
              borderBottom: i < group.rows.length - 1 ? '1px solid var(--line)' : undefined,
              alignItems: 'baseline',
            }}>
              <span style={{ ...mono, color: 'var(--ac-text)' }}>{r.prop}</span>
              <span style={{ ...mono, fontSize: 12.5, color: 'var(--fg-2)' }}>{r.type}</span>
              <span style={{ ...mono, fontSize: 12.5, color: 'var(--fg-2)' }}>{r.def}</span>
              <span style={{ color: 'var(--fg-2)' }}>{r.desc}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

const Grid = ({ cols, gap = 14, children }: { cols: string; gap?: number; children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: cols, gap }}>{children}</div>
)

/* ─────────────────────────── Page ─────────────────────────── */

export default function SidebarDoc() {
  const { prev, next } = prevNext('sidebar')
  return (
    <DocsShell sidebar={DOCS_SIDEBAR} rail={<RightRail toc={TOC} />}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
          <span style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--ac-soft)', border: '1px solid color-mix(in oklch, var(--ac) 40%, transparent)', display: 'grid', placeItems: 'center', color: 'var(--ac-text)', fontSize: 12 }}>▭</span>
          <span style={{ color: 'var(--fg-3)' }}>Veloce</span>
          <span style={{ color: 'var(--fg-3)' }}>/</span>
          <Link to="/components" style={{ color: 'var(--fg-2)' }}>Components</Link>
          <span style={{ color: 'var(--fg-3)' }}>/</span>
          <span style={{ color: 'var(--fg)', fontWeight: 500 }}>Sidebar</span>
        </div>

        {/* Hero */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0, fontSize: 40, fontWeight: 600, letterSpacing: '-0.035em' }}>Sidebar</h1>
            <span style={{ ...mono, fontSize: 11.5, padding: '3px 8px', borderRadius: 6, background: 'color-mix(in oklch,var(--ok) 15%,transparent)', color: 'var(--ok)' }}>a11y ✓</span>
            <span style={{ ...mono, fontSize: 11.5, padding: '3px 8px', borderRadius: 6, border: '1px solid var(--line-2)', color: 'var(--fg-2)', whiteSpace: 'nowrap' }}>0 kB runtime</span>
          </div>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: 'var(--fg-2)', maxWidth: 720 }}>
            Vertical navigation for docs sites, dashboards, and admin panels. Collapsible groups, nested sections up to three levels, an optional footer slot, and a mobile off-canvas drawer behind a hamburger.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10, maxWidth: 760 }}>
            {[['5', 'variants'], ['3', 'levels max'], ['0 kB', 'runtime'], ['AA', 'contrast']].map(([v, l]) => (
              <div key={l} style={{ padding: '14px 16px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg-1)' }}>
                <div style={{ ...sans, fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{v}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live demo — real Sidebar */}
        <section id="live" style={{ display: 'flex', flexDirection: 'column', gap: 14, scrollMarginTop: 20 }}>
          <h2 style={h2Style}>Live example</h2>
        <div style={{ display: 'flex', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', height: 420 }}>
          <Sidebar width={240}>
            <Sidebar.Group title="Getting started" defaultOpen>
              <Sidebar.Item href="#" active icon="▸">Introduction</Sidebar.Item>
              <Sidebar.Item href="#" icon="▸">Installation</Sidebar.Item>
              <Sidebar.Item href="#" icon="▸">Theming</Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group title="Primitives" defaultOpen>
              <Sidebar.Item href="#" icon="◇">Button</Sidebar.Item>
              <Sidebar.Item href="#" icon="◇" chip="NEW">Toggle</Sidebar.Item>
              <Sidebar.Item href="#" icon="◇">Checkbox</Sidebar.Item>
              <Sidebar.Item href="#" icon="◇">Switch</Sidebar.Item>
              <Sidebar.Item href="#" icon="◇" disabled>Radio (soon)</Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group title="Overlays">
              <Sidebar.Item href="#" icon="◇">Dialog</Sidebar.Item>
              <Sidebar.Item href="#" icon="◇">Popover</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar>
          <div style={{ flex: 1, padding: 24, display: 'grid', placeItems: 'center', color: 'var(--fg-3)', fontSize: 13 }}>
            Main content area
          </div>
        </div>
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

        {/* Variants */}
        <section id="variants" style={sectionStyle}>
          <h2 style={h2Style}>Variants</h2>
          <Grid cols="repeat(auto-fill, minmax(240px, 1fr))">
            {[
              ['Docs', '3-level nested like this site — groups, sections, sub-anchors.'],
              ['Dashboard', 'Icons + labels; collapses to an icon-only rail.'],
              ['Compact', '12 px rows for admin tools with many entries.'],
              ['With search header', 'Sticky search input pinned above the first group.'],
              ['Floating', 'Rounded, elevated card detached from the viewport edge.'],
            ].map(([t, d]) => (
              <div key={t} style={cardStyle}>
                <span style={cardTitle}>{t}</span>
                <span style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.55 }}>{d}</span>
              </div>
            ))}
          </Grid>
        </section>

        {/* Collapse behavior */}
        <section id="collapse-behavior" style={sectionStyle}>
          <h2 style={h2Style}>Collapse behavior</h2>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: 'var(--fg-2)', maxWidth: 760 }}>
            A group auto-expands when one of its children matches the current route; a manual override is available via the chevron. On narrow viewports the entire rail becomes an off-canvas drawer behind a hamburger button — the threshold is the <span style={{ ...mono, color: 'var(--ac-text)' }}>breakpoint</span> prop, default <span style={{ ...mono, color: 'var(--ac-text)' }}>720</span> px.
          </p>
        </section>

        {/* Accessibility */}
        <section id="accessibility" style={sectionStyle}>
          <h2 style={h2Style}>Accessibility</h2>
          <Grid cols="1fr 1fr">
            <div style={cardStyle}>
              <span style={cardTitle}>Semantics</span>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--fg-2)' }}>
                Rendered as <span style={{ ...mono, color: 'var(--ac-text)' }}>&lt;nav aria-label='Secondary'&gt;</span> with a nested <span style={{ ...mono, color: 'var(--ac-text)' }}>&lt;ul&gt;</span> tree. Expand/collapse buttons use <span style={{ ...mono, color: 'var(--ac-text)' }}>aria-expanded</span> + <span style={{ ...mono, color: 'var(--ac-text)' }}>aria-controls</span>. Current page gets <span style={{ ...mono, color: 'var(--ac-text)' }}>aria-current='page'</span>.
              </p>
            </div>
            <div style={cardStyle}>
              <span style={cardTitle}>Keyboard</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 14px', fontSize: 13, alignItems: 'center' }}>
                {[
                  ['↑ ↓', 'move focus between visible rows'],
                  ['→', 'expand a group'],
                  ['←', 'collapse a group'],
                  ['Home / End', 'first / last row'],
                ].map(([k, d]) => (
                  <Fragment key={k}>
                    <span style={{
                      ...mono, fontSize: 12, padding: '3px 8px', borderRadius: 6,
                      border: '1px solid var(--line-2)', background: 'var(--bg)',
                      color: 'var(--fg)', justifySelf: 'start',
                    }}>{k}</span>
                    <span style={{ color: 'var(--fg-2)' }}>{d}</span>
                  </Fragment>
                ))}
              </div>
            </div>
          </Grid>
        </section>

        {/* API */}
        <section id="api" style={sectionStyle}>
          <h2 style={h2Style}>API <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--fg-3)', marginLeft: 6 }}>Sidebar &amp; subcomponents</span></h2>
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
