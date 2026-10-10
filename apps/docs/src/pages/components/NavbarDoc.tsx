import { Fragment } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from 'veloce-ui'
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
  { label: 'Density & height', id: 'density' },
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
const cardFoot: CSSProperties = { ...mono, fontSize: 11, color: 'var(--fg-3)', lineHeight: 1.5 }

/* ─────────────────────────── Anatomy tree ─────────────────────────── */

interface NavbarTreeRow extends AnatomyTreeRow {
  label: ReactNode
}

const NAVBAR_TREE: NavbarTreeRow[] = [
  { id: 'navbar', depth: 0, chev: '⌄', icon: '▭', label: 'Navbar', role: 'navbar' },
  { id: 'announcement', parent: 'navbar', depth: 1, icon: '◆', label: 'Announcement rail', role: 'announcement' },
  { id: 'brand', parent: 'navbar', depth: 1, chev: '⌄', icon: '▣', label: 'Brand', role: 'brand' },
  { id: 'brand-logo', parent: 'brand', depth: 2, icon: '▦', label: 'Brand.Logo', role: 'brand-logo' },
  { id: 'brand-name', parent: 'brand', depth: 2, icon: 'Aa', label: 'Brand.Name', role: 'brand-name' },
  { id: 'nav', parent: 'navbar', depth: 1, chev: '⌄', icon: '≡', label: 'Nav', role: 'nav' },
  { id: 'link-dashboard', parent: 'nav', depth: 2, icon: '•', label: 'Link · Dashboard', role: 'link-dashboard' },
  { id: 'link-projects', parent: 'nav', depth: 2, icon: '•', label: 'Link · Projects', role: 'link-projects' },
  { id: 'link-analytics', parent: 'nav', depth: 2, icon: '•', label: 'Link · Analytics (active)', role: 'link-analytics' },
  { id: 'actions', parent: 'navbar', depth: 1, chev: '⌄', icon: '▭', label: 'Actions', role: 'actions' },
  { id: 'search', parent: 'actions', depth: 2, icon: '⌕', label: 'Search', role: 'search' },
  { id: 'theme-toggle', parent: 'actions', depth: 2, icon: '◐', label: 'ThemeToggle', role: 'theme-toggle' },
  { id: 'notifications', parent: 'actions', depth: 2, icon: '◔', label: 'Notifications', role: 'notifications' },
  { id: 'avatar', parent: 'actions', depth: 2, icon: '◉', label: 'Avatar', role: 'avatar' },
  { id: 'mobile', parent: 'navbar', depth: 1, icon: '☰', label: 'Mobile', role: 'mobile' },
]

const NAVBAR_ALL_ROLES = NAVBAR_TREE.map((r) => r.role!).filter(Boolean)

function navbarFocusFor(id: string | null): string[] | null {
  if (!id) return null
  const map: Record<string, string[]> = {
    navbar: NAVBAR_ALL_ROLES,
    announcement: ['announcement', 'navbar'],
    brand: ['brand', 'brand-logo', 'brand-name', 'navbar'],
    'brand-logo': ['brand-logo', 'brand', 'navbar'],
    'brand-name': ['brand-name', 'brand', 'navbar'],
    nav: ['nav', 'link-dashboard', 'link-projects', 'link-analytics', 'navbar'],
    'link-dashboard': ['link-dashboard', 'nav', 'navbar'],
    'link-projects': ['link-projects', 'nav', 'navbar'],
    'link-analytics': ['link-analytics', 'nav', 'navbar'],
    actions: ['actions', 'search', 'theme-toggle', 'notifications', 'avatar', 'navbar'],
    search: ['search', 'actions', 'navbar'],
    'theme-toggle': ['theme-toggle', 'actions', 'navbar'],
    notifications: ['notifications', 'actions', 'navbar'],
    avatar: ['avatar', 'actions', 'navbar'],
    mobile: ['mobile', 'navbar'],
  }
  return map[id] ?? null
}

/* ─────────────────────────── Mock pieces ─────────────────────────── */

function Logo() {
  return (
    <span data-role="brand-logo" style={{
      width: 22, height: 22, borderRadius: 6, background: 'var(--ac-soft)',
      border: '1px solid color-mix(in oklch, var(--ac) 40%, transparent)',
      display: 'inline-grid', placeItems: 'center', color: 'var(--ac-text)', fontSize: 12,
    }}>▦</span>
  )
}

function IconBtn({ children, badge }: { children: ReactNode; badge?: string }) {
  return (
    <span style={{
      position: 'relative', width: 32, height: 32, borderRadius: 7,
      border: '1px solid var(--line-2)', background: 'var(--bg)',
      display: 'inline-grid', placeItems: 'center', color: 'var(--fg-2)', fontSize: 13,
    }}>
      {children}
      {badge ? (
        <span style={{
          position: 'absolute', top: -4, right: -4,
          minWidth: 16, height: 16, padding: '0 4px',
          borderRadius: 8, background: 'var(--ac)', color: 'oklch(0.98 0 0)',
          ...mono, fontSize: 10, fontWeight: 600,
          display: 'inline-grid', placeItems: 'center',
        }}>{badge}</span>
      ) : null}
    </span>
  )
}

function MockAvatar({ initials, hue = 200 }: { initials: string; hue?: number }) {
  return (
    <span style={{
      width: 28, height: 28, borderRadius: '50%',
      background: `oklch(0.6 0.12 ${hue})`, color: 'oklch(0.98 0 0)',
      display: 'inline-grid', placeItems: 'center', fontSize: 11, fontWeight: 600,
    }}>{initials}</span>
  )
}

function Pill({ label, active, chip, role }: { label: string; active?: boolean; chip?: string; role?: string }) {
  return (
    <span data-role={role} style={{
      padding: '6px 12px', borderRadius: 7, fontSize: 13,
      color: active ? 'var(--ac-text)' : 'var(--fg-2)',
      background: active ? 'var(--ac-soft)' : 'transparent',
      border: active ? '1px solid color-mix(in oklch, var(--ac) 35%, transparent)' : '1px solid transparent',
      display: 'inline-flex', alignItems: 'center', gap: 6,
    }} aria-current={active ? 'page' : undefined}>
      {label}
      {chip ? <span style={{ ...mono, fontSize: 10, padding: '1px 6px', borderRadius: 4, background: 'var(--bg-2)', color: 'var(--fg-3)' }}>{chip}</span> : null}
    </span>
  )
}

function MarketingLink({ label, active }: { label: string; active?: boolean }) {
  return (
    <span style={{
      padding: '6px 2px', fontSize: 13,
      color: active ? 'var(--fg)' : 'var(--fg-2)',
      fontWeight: active ? 500 : 400,
      borderBottom: active ? '2px solid var(--ac)' : '2px solid transparent',
    }} aria-current={active ? 'page' : undefined}>{label}</span>
  )
}

function SearchField({ interactive }: { interactive?: boolean }) {
  const node = (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '6px 10px', borderRadius: 8, background: 'var(--bg)',
      border: '1px solid var(--line-2)', fontSize: 12.5, color: 'var(--fg-3)',
      minWidth: 180,
    }}>
      <span style={{ color: 'var(--fg-3)' }}>⌕</span>
      <span style={{ flex: 1 }}>Search docs…</span>
      <span style={{ ...mono, fontSize: 10.5, padding: '1px 6px', borderRadius: 4, background: 'var(--bg-2)', color: 'var(--fg-3)', border: '1px solid var(--line)' }}>⌘K</span>
    </span>
  )
  return interactive ? <span data-role="search">{node}</span> : node
}

/* App shell with data-role wrappers (interactive) */
function InteractiveAppShellNavbar({ dim }: { dim: (role?: string) => CSSProperties }) {
  return (
    <header data-role="navbar" style={{
      ...dim('navbar'),
      display: 'flex', alignItems: 'center', gap: 16,
      height: 56, padding: '0 16px',
      background: 'var(--bg-1)', borderBottom: '1px solid var(--line)',
    }}>
      <nav aria-label="Main" style={{ display: 'contents' }}>
        <span data-role="brand" style={{ ...dim('brand'), display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, color: 'var(--fg)', fontSize: 14 }}>
          <span data-role="brand-logo" style={dim('brand-logo')}>
            <span style={{
              width: 22, height: 22, borderRadius: 6, background: 'var(--ac-soft)',
              border: '1px solid color-mix(in oklch, var(--ac) 40%, transparent)',
              display: 'inline-grid', placeItems: 'center', color: 'var(--ac-text)', fontSize: 12,
            }}>▦</span>
          </span>
          <span data-role="brand-name" style={dim('brand-name')}>Veloce</span>
        </span>
        <span data-role="mobile" style={{
          ...dim('mobile'),
          display: 'inline-grid', placeItems: 'center',
          width: 32, height: 32, borderRadius: 7,
          border: '1px solid var(--line-2)', background: 'var(--bg)',
          color: 'var(--fg-2)', fontSize: 14,
        }}>☰</span>
        <span data-role="nav" style={{ ...dim('nav'), display: 'inline-flex', gap: 4, marginLeft: 10 }}>
          <Pill label="Dashboard" role="link-dashboard" />
          <Pill label="Projects" role="link-projects" />
          <Pill label="Analytics" active role="link-analytics" />
        </span>
        <span data-role="actions" style={{ ...dim('actions'), marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <SearchField interactive />
          <span data-role="theme-toggle" style={dim('theme-toggle')}><IconBtn>◐</IconBtn></span>
          <span data-role="notifications" style={dim('notifications')}><IconBtn badge="2">◔</IconBtn></span>
          <span data-role="avatar" style={dim('avatar')}><MockAvatar initials="JL" hue={200} /></span>
        </span>
      </nav>
    </header>
  )
}

/* Static marketing navbar (no data-role) */
function MarketingNavbar() {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: 24,
      height: 64, padding: '0 20px',
      background: 'var(--bg-1)', borderBottom: '1px solid var(--line)',
    }}>
      <nav aria-label="Main" style={{ display: 'contents' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, color: 'var(--fg)', fontSize: 15 }}>
          <Logo /> Veloce
        </span>
        <span style={{ display: 'inline-flex', gap: 18, marginLeft: 14 }}>
          <MarketingLink label="Product" />
          <MarketingLink label="Pricing" />
          <MarketingLink label="Docs" active />
          <MarketingLink label="Blog" />
        </span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ padding: '7px 12px', borderRadius: 7, fontSize: 13, color: 'var(--fg-2)' }}>Sign in</span>
          <span style={{
            padding: '7px 14px', borderRadius: 7, fontSize: 13, fontWeight: 500,
            background: 'var(--ac)', color: 'oklch(0.98 0 0)',
          }}>Get started</span>
        </span>
      </nav>
    </header>
  )
}

/* Static rail variant */
function RailNavbarStatic() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div role="status" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        height: 32, padding: '0 16px', fontSize: 12.5,
        background: 'var(--ac-soft)', color: 'var(--ac-text)',
        borderBottom: '1px solid color-mix(in oklch, var(--ac) 25%, transparent)',
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%', background: 'var(--ac)',
          boxShadow: '0 0 0 4px color-mix(in oklch, var(--ac) 25%, transparent)',
        }} />
        <span>Veloce 1.1: Charts, Data Grid and Tree View are out — read the announcement →</span>
      </div>
      <header style={{
        display: 'flex', alignItems: 'center', gap: 16,
        height: 56, padding: '0 16px',
        background: 'var(--bg-1)', borderBottom: '1px solid var(--line)',
      }}>
        <nav aria-label="Main" style={{ display: 'contents' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, color: 'var(--fg)', fontSize: 14 }}>
            <Logo /> Veloce
          </span>
          <span style={{ display: 'inline-flex', gap: 4, marginLeft: 10 }}>
            <Pill label="Dashboard" />
            <Pill label="Projects" />
            <Pill label="Analytics" active />
          </span>
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <SearchField />
            <IconBtn badge="2">◔</IconBtn>
            <IconBtn>◐</IconBtn>
            <MockAvatar initials="JL" hue={200} />
          </span>
        </nav>
      </header>
    </div>
  )
}

function VariantRow({ title, meta, children }: { title: string; meta: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>{children}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 12, color: 'var(--fg-2)' }}>{title}</span>
        <span style={cardFoot}>{meta}</span>
      </div>
    </div>
  )
}

function AnatomyPreview() {
  const { vis, open, parents, dimStyle, onRowClick, onKeyDown, treeRef } = useAnatomy(
    NAVBAR_TREE,
    navbarFocusFor,
    'nav',
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
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '300px 1fr', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg-1)', minWidth: narrow ? 920 : undefined }}>
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

        {/* Right: three variants — each wrapped in overflow-x: auto so the full app-shell / marketing /
            rail navbars (which are wider than this column at most viewports) stay reachable by scrolling
            horizontally instead of getting clipped at the right edge. */}
        <div style={{
          minWidth: 0,
          background: 'var(--bg)',
          backgroundImage: 'radial-gradient(circle, color-mix(in oklch, var(--fg) 8%, transparent) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
          padding: 18, display: 'flex', flexDirection: 'column', gap: 18,
        }}>
          <VariantRow title="App shell · interactive" meta="app · 56px · sticky">
            <div style={{ overflowX: 'auto', minWidth: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 820 }}>
                <div data-role="announcement" role="status" style={{
                  ...dimStyle('announcement'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  height: 32, padding: '0 16px', fontSize: 12.5,
                  background: 'var(--ac-soft)', color: 'var(--ac-text)',
                  borderBottom: '1px solid color-mix(in oklch, var(--ac) 25%, transparent)',
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%', background: 'var(--ac)',
                    boxShadow: '0 0 0 4px color-mix(in oklch, var(--ac) 25%, transparent)',
                  }} />
                  <span>Veloce 1.1: Charts, Data Grid and Tree View are out — read the announcement →</span>
                </div>
                <InteractiveAppShellNavbar dim={dimStyle} />
              </div>
            </div>
          </VariantRow>
          <VariantRow title="Marketing" meta="marketing · 64px">
            <div style={{ overflowX: 'auto', minWidth: 0 }}>
              <div style={{ minWidth: 820 }}><MarketingNavbar /></div>
            </div>
          </VariantRow>
          <VariantRow title="With announcement rail" meta="rail + bar · 88px total">
            <div style={{ overflowX: 'auto', minWidth: 0 }}>
              <div style={{ minWidth: 820 }}><RailNavbarStatic /></div>
            </div>
          </VariantRow>
        </div>
      </div>
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
{dim('import')}{' { Navbar } '}{dim('from')} {str('"veloce-ui"')}{'\n\n'}
{dim('<')}{tag('Navbar')} {dim('sticky height=')}{val('{56}')}{dim('>')}{'\n'}
{'  '}{dim('<')}{tag('Navbar.Brand')} {dim('href=')}{str('"/"')} {dim('logo=')}{val('{<Logo />}')}{dim('>')}Veloce{dim('</')}{tag('Navbar.Brand')}{dim('>')}{'\n'}
{'  '}{dim('<')}{tag('Navbar.Nav')}{dim('>')}{'\n'}
{'    '}{dim('<')}{tag('Navbar.Link')} {dim('to=')}{str('"/dashboard"')}{dim('>')}Dashboard{dim('</')}{tag('Navbar.Link')}{dim('>')}{'\n'}
{'    '}{dim('<')}{tag('Navbar.Link')} {dim('to=')}{str('"/projects"')}{dim('>')}Projects{dim('</')}{tag('Navbar.Link')}{dim('>')}{'\n'}
{'    '}{dim('<')}{tag('Navbar.Link')} {dim('to=')}{str('"/analytics"')} {dim('active>')}Analytics{dim('</')}{tag('Navbar.Link')}{dim('>')}{'\n'}
{'  '}{dim('</')}{tag('Navbar.Nav')}{dim('>')}{'\n'}
{'  '}{dim('<')}{tag('Navbar.Actions')}{dim('>')}{'\n'}
{'    '}{dim('<')}{tag('Navbar.Search')} {dim('shortcut=')}{str('"⌘K"')} {dim('onOpen=')}{val('{openPalette}')}{dim(' />')}{'\n'}
{'    '}{dim('<')}{tag('Navbar.ThemeToggle')} {dim('/>')}{'\n'}
{'    '}{dim('<')}{tag('Navbar.Avatar')} {dim('name=')}{str('"Jonas L."')} {dim('src=')}{str('"/avatars/jl.png"')} {dim('/>')}{'\n'}
{'  '}{dim('</')}{tag('Navbar.Actions')}{dim('>')}{'\n'}
{dim('</')}{tag('Navbar')}{dim('>')}
    </pre>
  )
}

/* ─────────────────────────── API ─────────────────────────── */

type ApiRow = { prop: string; type: string; def: string; desc: string }
type ApiGroup = { name: string; rows: ApiRow[] }

const API: ApiGroup[] = [
  {
    name: 'Navbar',
    rows: [
      { prop: 'height', type: '48 | 56 | 64', def: '56', desc: 'Pixel height of the main bar. 48 is dense, 64 is comfortable for marketing.' },
      { prop: 'sticky', type: 'boolean', def: 'true', desc: 'Pins the bar to the top of the viewport with position: sticky.' },
      { prop: 'variant', type: '"app" | "marketing" | "transparent"', def: '"app"', desc: 'Visual preset. transparent sits over hero sections with no background.' },
      { prop: 'density', type: '"compact" | "cozy" | "comfortable"', def: '"cozy"', desc: 'Internal padding scale for the bar and its action cluster.' },
      { prop: 'announcement', type: 'ReactNode', def: '—', desc: 'Optional slim rail rendered above the bar; role="status" for screen readers.' },
      { prop: 'blur', type: 'boolean', def: 'false', desc: 'Enables backdrop-filter: blur(16px) for the floating glass variant.' },
      { prop: 'border', type: 'boolean', def: 'true', desc: 'Bottom hairline. Disable when the next region already has a strong divider.' },
    ],
  },
  {
    name: 'Navbar.Brand',
    rows: [
      { prop: 'href', type: 'string', def: '—', desc: 'Home link URL. Rendered as an <a> with a visually-hidden label if logo-only.' },
      { prop: 'logo', type: 'ReactNode', def: '—', desc: 'Leading mark; render your product logo at 20–24 px.' },
    ],
  },
  {
    name: 'Navbar.Nav',
    rows: [
      { prop: 'align', type: '"start" | "center"', def: '"start"', desc: 'Alignment inside the bar. "center" is used for centered-logo marketing layouts.' },
    ],
  },
  {
    name: 'Navbar.Link',
    rows: [
      { prop: 'to', type: 'string', def: '—', desc: 'Route path. Rendered via your router\'s Link component.' },
      { prop: 'active', type: 'boolean', def: '—', desc: 'Marks the current page. Emits aria-current="page" automatically.' },
      { prop: 'disabled', type: 'boolean', def: '—', desc: 'Dimmed and non-interactive. Useful for coming-soon routes.' },
      { prop: 'chip', type: 'ReactNode', def: '—', desc: 'Trailing badge like "NEW" or "Beta".' },
    ],
  },
  {
    name: 'Navbar.Actions',
    rows: [
      { prop: '—', type: '—', def: '—', desc: 'Right-aligned action cluster. No props; just drop in Search, ThemeToggle, Avatar, buttons.' },
    ],
  },
  {
    name: 'Navbar.Search',
    rows: [
      { prop: 'shortcut', type: 'string', def: '"⌘K"', desc: 'Rendered as a trailing kbd. Also wired as a global accelerator.' },
      { prop: 'onOpen', type: '() => void', def: '—', desc: 'Fired when the user clicks or presses the shortcut; usually opens a command palette.' },
      { prop: 'placeholder', type: 'string', def: '"Search…"', desc: 'Placeholder text inside the input affordance.' },
    ],
  },
  {
    name: 'Navbar.Avatar',
    rows: [
      { prop: 'name', type: 'string', def: '—', desc: 'User display name; used for the aria-label and tooltip.' },
      { prop: 'src', type: 'string', def: '—', desc: 'Avatar image URL. Initials fallback is rendered when src fails.' },
      { prop: 'menu', type: 'ReactNode', def: '—', desc: 'Content for the dropdown menu that opens on click.' },
    ],
  },
  {
    name: 'Navbar.Mobile',
    rows: [
      { prop: 'breakpoint', type: 'number', def: '720', desc: 'Width in px below which the bar collapses to a hamburger affordance.' },
      { prop: 'onOpen', type: '() => void', def: '—', desc: 'Called when the hamburger is tapped; usually opens an off-canvas Sheet.' },
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

export default function NavbarDoc() {
  const { prev, next } = prevNext('navbar')
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
          <span style={{ color: 'var(--fg)', fontWeight: 500 }}>Navbar</span>
        </div>

        {/* Live demo — real Navbar */}
        <section id="live" style={{ display: 'flex', flexDirection: 'column', gap: 14, scrollMarginTop: 20 }}>
          <h2 style={h2Style}>Live example</h2>
        <div style={{ border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
          <Navbar height={56} border={false}>
            <Navbar.Brand href="#">
              <span style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--ac)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ width: 3, height: 12, background: 'var(--ac-fg)', transform: 'skewX(-22deg)', display: 'inline-block' }} />
              </span>
              <span style={{ fontWeight: 600, fontSize: 15, marginLeft: 9 }}>Veloce</span>
            </Navbar.Brand>
            <Navbar.Nav>
              <Navbar.Link href="#" active>Docs</Navbar.Link>
              <Navbar.Link href="#">Components</Navbar.Link>
              <Navbar.Link href="#">Charts</Navbar.Link>
              <Navbar.Link href="#" chip="NEW">Changelog</Navbar.Link>
            </Navbar.Nav>
            <Navbar.Actions>
              <button style={{ height: 32, padding: '0 12px', borderRadius: 7, border: '1px solid var(--line-2)', background: 'var(--bg)', color: 'var(--fg)', fontSize: 13, cursor: 'pointer' }}>Sign in</button>
              <button style={{ height: 32, padding: '0 12px', borderRadius: 7, border: 'none', background: 'var(--ac)', color: 'var(--ac-fg)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Get started</button>
            </Navbar.Actions>
          </Navbar>
        </div>
        </section>

        {/* Hero */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0, fontSize: 40, fontWeight: 600, letterSpacing: '-0.035em' }}>Navbar</h1>
            <span style={{ ...mono, fontSize: 11.5, padding: '3px 8px', borderRadius: 6, background: 'color-mix(in oklch,var(--ok) 15%,transparent)', color: 'var(--ok)' }}>a11y ✓</span>
            <span style={{ ...mono, fontSize: 11.5, padding: '3px 8px', borderRadius: 6, border: '1px solid var(--line-2)', color: 'var(--fg-2)', whiteSpace: 'nowrap' }}>0 kB runtime</span>
          </div>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: 'var(--fg-2)', maxWidth: 720 }}>
            Top chrome for app shells and marketing pages. Logo, primary nav links, a search slot, right-aligned actions, and an optional announcement rail. Collapses to a sticky mobile bar with hamburger at ≤ 720 px.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10, maxWidth: 760 }}>
            {[['6', 'variants'], ['8', 'subcomponents'], ['0 kB', 'runtime'], ['AA', 'contrast']].map(([v, l]) => (
              <div key={l} style={{ padding: '14px 16px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg-1)' }}>
                <div style={{ ...sans, fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{v}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

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
              ['App shell', 'Sticky 56 px bar with pill nav and action cluster.'],
              ['Marketing', 'Taller 64 px bar with underlined link set.'],
              ['With announcement rail', 'Slim ac-soft rail with pulse dot above the bar.'],
              ['Transparent', 'Sits over a hero image or gradient; no background.'],
              ['Centered logo', 'Logo centered; nav split left/right.'],
              ['Floating glass', 'Rounded, elevated, backdrop-filter: blur(16px).'],
            ].map(([t, d]) => (
              <div key={t} style={cardStyle}>
                <span style={cardTitle}>{t}</span>
                <span style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.55 }}>{d}</span>
              </div>
            ))}
          </Grid>
        </section>

        {/* Density & height */}
        <section id="density" style={sectionStyle}>
          <h2 style={h2Style}>Density &amp; height</h2>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: 'var(--fg-2)', maxWidth: 760 }}>
            The <span style={{ ...mono, color: 'var(--ac-text)' }}>height</span> prop accepts 48, 56 or 64. Pair it with the <span style={{ ...mono, color: 'var(--ac-text)' }}>density</span> prop — <span style={{ ...mono, color: 'var(--ac-text)' }}>compact</span> for admin tools, <span style={{ ...mono, color: 'var(--ac-text)' }}>cozy</span> as the default for product dashboards, and <span style={{ ...mono, color: 'var(--ac-text)' }}>comfortable</span> for marketing shells with more breathing room around the links and the CTA.
          </p>
        </section>

        {/* Accessibility */}
        <section id="accessibility" style={sectionStyle}>
          <h2 style={h2Style}>Accessibility</h2>
          <Grid cols="1fr 1fr">
            <div style={cardStyle}>
              <span style={cardTitle}>Semantics</span>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--fg-2)' }}>
                Rendered as <span style={{ ...mono, color: 'var(--ac-text)' }}>&lt;header&gt;&lt;nav aria-label='Main'&gt;…&lt;/nav&gt;&lt;/header&gt;</span>. Active link gets <span style={{ ...mono, color: 'var(--ac-text)' }}>aria-current='page'</span>. Dropdown triggers use <span style={{ ...mono, color: 'var(--ac-text)' }}>aria-expanded</span> + <span style={{ ...mono, color: 'var(--ac-text)' }}>aria-haspopup</span>. The announcement rail is <span style={{ ...mono, color: 'var(--ac-text)' }}>role='status'</span> so screen readers pick it up on page load but don't interrupt.
              </p>
            </div>
            <div style={cardStyle}>
              <span style={cardTitle}>Keyboard</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 14px', fontSize: 13, alignItems: 'center' }}>
                {[
                  ['Tab', 'navigate'],
                  ['↑ ↓', 'nested menu'],
                  ['Esc', 'close menu'],
                  ['⌘K', 'open search'],
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
          <h2 style={h2Style}>API <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--fg-3)', marginLeft: 6 }}>Navbar &amp; subcomponents</span></h2>
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
