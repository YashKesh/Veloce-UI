import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../theme'
import { useGithubStars } from '../useGithubStars'
import { COMPONENTS } from '../docsNav'

export const REPO_OWNER = 'YashKesh'
export const REPO_NAME = 'Veloce-UI'
export const REPO_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}`

export function Logo() {
  return (
    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, color: 'var(--fg)' }}>
      <span
        style={{
          width: 22, height: 22, borderRadius: 6, background: 'var(--ac)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <span style={{ width: 3, height: 12, background: 'var(--ac-fg)', transform: 'skewX(-22deg)', display: 'inline-block' }} />
      </span>
      <span style={{ fontWeight: 600, fontSize: 15 }}>
        Veloce <span style={{ color: 'var(--fg-3)', fontWeight: 500 }}>UI</span>
      </span>
    </Link>
  )
}

export function ModeToggle() {
  const { mode, setMode } = useTheme()
  return (
    <div className="vl-seg" style={{ padding: 2, borderRadius: 7 }}>
      <button
        className={`vl-seg__item${mode === 'dark' ? ' vl-seg__item--active' : ''}`}
        style={{ padding: '3px 8px', fontSize: 12 }}
        onClick={() => setMode('dark')}
        aria-label="Dark mode"
      >
        ☾
      </button>
      <button
        className={`vl-seg__item${mode === 'light' ? ' vl-seg__item--active' : ''}`}
        style={{ padding: '3px 8px', fontSize: 12 }}
        onClick={() => setMode('light')}
        aria-label="Light mode"
      >
        ☀
      </button>
    </div>
  )
}

const NAV = [
  { label: 'Docs', to: '/docs/installation', match: (p: string) => p.startsWith('/docs') && p !== '/docs/motion' && p !== '/docs/tokens' },
  { label: 'Components', to: '/components', match: (p: string) => p.startsWith('/components') },
  { label: 'Dashboards', to: '/dashboards', match: (p: string) => p.startsWith('/dashboards') },
  { label: 'Builder', to: '/builder', match: (p: string) => p === '/builder' },
  { label: 'Theme', to: '/theme', match: (p: string) => p === '/theme' },
  { label: 'Motion', to: '/docs/motion', match: (p: string) => p === '/docs/motion' },
  { label: 'Tokens', to: '/docs/tokens', match: (p: string) => p === '/docs/tokens' },
]

// Hint overrides for well-known components (anything not listed just shows "primitive").
const COMPONENT_HINTS: Record<string, string> = {
  button: 'variants · sizes · loading',
  input: 'states · validation',
  switch: 'checked · disabled',
  dialog: 'props · a11y · motion spec',
  command: '⌘K · fuzzy filter',
  toast: 'stacking · dismiss',
  progress: 'determinate · indeterminate',
  skeleton: 'shimmer · shapes',
  'data-grid': 'sort · select · density',
  badge: 'accent · success · outline',
  card: 'lift · media · footer',
  select: 'unfold · groups',
  checkbox: 'draw · indeterminate',
  tabs: 'sliding indicator',
  dropdown: 'unfold · shortcuts',
  popover: 'anchored · scale-fade',
  tooltip: 'rise · delay',
  accordion: 'height auto · single',
  chip: 'removable · filter',
  avatar: 'sizes · stack · fallback',
  separator: 'horizontal · vertical',
  textarea: 'autogrow · counter',
  radio: 'group · cards',
  slider: 'drag · steps · range',
  'toggle-group': 'single · multiple',
  sheet: 'side panel',
  alert: 'info · warn · error',
  spinner: 'sizes · inline',
  'empty-state': 'icon · action',
  breadcrumbs: 'collapse · separator',
  pagination: 'pages · ellipsis',
  stepper: 'progress · steps',
  table: 'striped · expandable',
  form: 'field · label · error',
  combobox: 'typeahead · filter',
  'multi-select': 'chips · pills',
  'number-input': 'stepper · min / max',
  'pin-input': 'otp · code',
  'date-picker': 'calendar · range',
  'file-upload': 'drop · preview',
  rating: 'stars · half',
  'hover-card': 'rich preview',
  'context-menu': 'right-click',
  drawer: 'bottom · side',
  'scroll-area': 'custom scrollbar',
  carousel: 'slide · autoplay',
  timeline: 'milestones',
  tree: 'folders · expand',
  portal: 'escape · teleport',
  'visually-hidden': 'a11y utility',
  slot: 'asChild composition',
  kbd: 'keyboard shortcut',
  code: 'inline code',
  mark: 'highlight',
  blockquote: 'callout',
  toggle: 'two-state',
  label: 'form label',
  collapsible: 'disclosure',
  'alert-dialog': 'confirm action',
  'chat-message': 'AI · bubble',
  'streaming-text': 'AI · typewriter',
  'prompt-input': 'AI · composer',
  'tool-call': 'AI · function',
  citation: 'AI · source link',
  'agent-avatar': 'AI · persona',
  'token-counter': 'AI · usage',
  'suggestion-chips': 'AI · quick replies',
  'thinking-indicator': 'AI · dots',
  'diff-viewer': 'AI · code diff',
  'marketing-blocks': 'hero · pricing · CTA',
}

const DOC_PAGES = [
  { label: 'Introduction', to: '/', hint: 'hero · pillars', group: 'DOCS' },
  { label: 'Installation', to: '/docs/installation', hint: 'veloce init', group: 'DOCS' },
  { label: 'Usage', to: '/docs/usage', hint: 'first import', group: 'DOCS' },
  { label: 'Customization', to: '/docs/customization', hint: 'three layers', group: 'DOCS' },
  { label: 'Motion system', to: '/docs/motion', hint: 'four rules', group: 'DOCS' },
  { label: 'Design tokens', to: '/docs/tokens', hint: 'oklch · spacing · easing', group: 'DOCS' },
  { label: 'Accent variants', to: '/accents', hint: 'violet · lime · cyan', group: 'DOCS' },
  { label: 'Gallery', to: '/gallery', hint: 'every primitive at a glance', group: 'DOCS' },
]

const TOOL_PAGES = [
  { label: 'Dashboard builder', to: '/builder', hint: 'drag · drop · export JSX', group: 'TOOLS' },
  { label: 'Theme studio', to: '/theme', hint: 'OKLCH ramp generator', group: 'TOOLS' },
  { label: 'Dashboard builder docs', to: '/docs/builder', hint: 'how to use + embed', group: 'TOOLS' },
  { label: 'Theme studio docs', to: '/docs/theme-studio', hint: 'how to use + tokens', group: 'TOOLS' },
]

const CHART_PAGES = [
  { label: 'Charts overview', to: '/charts', hint: 'all series · catalogue', group: 'CHARTS' },
  { label: 'Chart catalogue', to: '/charts/catalogue', hint: '16 series at a glance', group: 'CHARTS' },
  { label: 'All charts', to: '/components/charts', hint: 'library doc', group: 'CHARTS' },
  ...['area', 'bar', 'bullet', 'candle', 'funnel', 'gauge', 'heatmap', 'line', 'pie-donut', 'radar', 'scatter', 'sparkline', 'treemap', 'waterfall'].map((slug) => ({
    label: `${slug.replace(/-/g, ' / ').replace(/\b\w/g, (c) => c.toUpperCase())} chart`,
    to: `/docs/charts/${slug}`,
    hint: 'anatomy · variants · motion',
    group: 'CHARTS',
  })),
]

const DASHBOARD_PAGES = [
  { label: 'All dashboards', to: '/dashboards', hint: '14 blueprints · 4 categories', group: 'DASHBOARDS' },
  { label: 'SaaS metrics',          to: '/dashboards/saas-metrics',       hint: 'MRR · churn · activation',       group: 'DASHBOARDS' },
  { label: 'Analytics',             to: '/dashboards/analytics',          hint: 'traffic · funnel · referrers',   group: 'DASHBOARDS' },
  { label: 'E-commerce admin',      to: '/dashboards/ecommerce-admin',    hint: 'orders · inventory · stock',     group: 'DASHBOARDS' },
  { label: 'Finance',               to: '/dashboards/finance',            hint: 'cashflow · burn · runway',       group: 'DASHBOARDS' },
  { label: 'DevOps monitoring',     to: '/dashboards/devops',             hint: 'uptime · p95 · incidents',       group: 'DASHBOARDS' },
  { label: 'Project management',    to: '/dashboards/project-management', hint: 'gantt · kanban · velocity',      group: 'DASHBOARDS' },
  { label: 'People / HR',           to: '/dashboards/hr',                 hint: 'headcount · reviews · leave',    group: 'DASHBOARDS' },
  { label: 'Admin · Users',         to: '/dashboards/admin-users',        hint: 'DataGrid · invite dialog',       group: 'DASHBOARDS' },
  { label: 'Settings',              to: '/dashboards/settings',           hint: 'tabs · forms · switches',        group: 'DASHBOARDS' },
  { label: 'Inbox',                 to: '/dashboards/inbox',              hint: 'three-pane list / detail',       group: 'DASHBOARDS' },
  { label: 'CRM · Pipeline',        to: '/dashboards/crm-pipeline',       hint: '5-stage sales kanban',           group: 'DASHBOARDS' },
  { label: 'Helpdesk',              to: '/dashboards/helpdesk',           hint: 'ticket queue · SLA',             group: 'DASHBOARDS' },
  { label: 'Marketing · Landing',   to: '/dashboards/marketing-site',     hint: 'hero → pricing → footer',        group: 'DASHBOARDS' },
  { label: 'Social scheduler',      to: '/dashboards/social-scheduler',   hint: 'calendar · queue · engagement',  group: 'DASHBOARDS' },
]

const COMPONENT_PAGES = [
  { label: 'All components', to: '/components', hint: 'overview grid', group: 'COMPONENTS' },
  ...COMPONENTS.map((c) => ({
    label: c.label,
    to: `/components/${c.slug}`,
    hint: COMPONENT_HINTS[c.slug] ?? 'primitive',
    group: 'COMPONENTS',
  })),
]

// Marketing blocks — one dedicated doc page per block.
const MARKETING_PAGES = [
  { label: 'All marketing blocks', to: '/components/marketing-blocks',               hint: '14 blocks · overview',  group: 'MARKETING' },
  { label: 'Hero',                 to: '/components/marketing/hero',                 hint: 'eyebrow · title · CTA', group: 'MARKETING' },
  { label: 'FeatureGrid',          to: '/components/marketing/feature-grid',         hint: 'icon tiles',            group: 'MARKETING' },
  { label: 'BentoGrid',            to: '/components/marketing/bento',                hint: 'bento · asymmetric',    group: 'MARKETING' },
  { label: 'PricingTable',         to: '/components/marketing/pricing-table',        hint: 'tiers · featured',      group: 'MARKETING' },
  { label: 'TestimonialWall',      to: '/components/marketing/testimonial-wall',     hint: 'social proof',          group: 'MARKETING' },
  { label: 'LogoCloud',            to: '/components/marketing/logo-cloud',           hint: 'marquee · trust bar',   group: 'MARKETING' },
  { label: 'StatsBar',             to: '/components/marketing/stats-bar',            hint: 'big numbers row',       group: 'MARKETING' },
  { label: 'BorderMagic',          to: '/components/marketing/border-magic',         hint: 'gradient border',       group: 'MARKETING' },
  { label: 'MeteorBackground',     to: '/components/marketing/meteor-background',    hint: 'falling streaks',       group: 'MARKETING' },
  { label: 'Sparkles',             to: '/components/marketing/sparkles',             hint: 'twinkle particles',     group: 'MARKETING' },
  { label: 'CardTilt',             to: '/components/marketing/card-tilt',            hint: '3-D tilt on hover',     group: 'MARKETING' },
  { label: 'TextReveal',           to: '/components/marketing/text-reveal',          hint: 'word-by-word fade',     group: 'MARKETING' },
  { label: 'CTA band',             to: '/components/marketing/cta',                  hint: 'end-of-page CTA',       group: 'MARKETING' },
  { label: 'MarketingFooter',      to: '/components/marketing/marketing-footer',     hint: 'columns · social',      group: 'MARKETING' },
]

const PAGES = [...DOC_PAGES, ...TOOL_PAGES, ...COMPONENT_PAGES, ...MARKETING_PAGES, ...CHART_PAGES, ...DASHBOARD_PAGES]

function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(
    () => PAGES.filter((p) => (p.label + ' ' + p.hint).toLowerCase().includes(query.toLowerCase())),
    [query],
  )

  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  useEffect(() => {
    setIndex(0)
  }, [query])

  const run = (i: number) => {
    const r = results[i]
    if (!r) return
    navigate(r.to)
    onClose()
    // If the target has a hash, scroll to the anchor after React Router finishes.
    const hashIdx = r.to.indexOf('#')
    if (hashIdx !== -1) {
      const id = r.to.slice(hashIdx + 1)
      // Two rAFs: first for route to render, second for layout to settle.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }))
    }
  }

  const groups = ['DOCS', 'TOOLS', 'COMPONENTS', 'MARKETING', 'CHARTS', 'DASHBOARDS']
    .map((g) => ({ g, items: results.filter((r) => r.group === g) }))

  return (
    <div
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose()
        if (e.key === 'ArrowDown') { e.preventDefault(); setIndex((i) => Math.min(i + 1, results.length - 1)) }
        if (e.key === 'ArrowUp') { e.preventDefault(); setIndex((i) => Math.max(i - 1, 0)) }
        if (e.key === 'Enter') run(index)
      }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200, background: 'oklch(0 0 0/.55)',
        display: 'flex', justifyContent: 'center', paddingTop: '15vh',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 560, height: 'fit-content', borderRadius: 12, background: 'var(--bg-2)',
          border: '1px solid var(--line-2)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden',
          animation: 'vl-in .2s cubic-bezier(.16,1,.3,1) both',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 50, padding: '0 14px', borderBottom: '1px solid var(--line)' }}>
          <span style={{ color: 'var(--fg-3)' }}>⌕</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages…"
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: 'var(--fg)' }}
          />
          <kbd className="vl-kbd">esc</kbd>
        </div>
        <div style={{ padding: 6, maxHeight: 320, overflowY: 'auto' }}>
          {groups.map(({ g, items }) =>
            items.length === 0 ? null : (
              <div key={g}>
                <div className="vl-label" style={{ fontSize: 10.5, padding: '8px 10px 4px' }}>{g}</div>
                {items.map((r) => {
                  const i = results.indexOf(r)
                  return (
                    <button
                      key={r.to}
                      onClick={() => run(i)}
                      onMouseEnter={() => setIndex(i)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
                        padding: '9px 10px', borderRadius: 7, fontSize: 13.5,
                        background: i === index ? 'var(--bg-3)' : 'transparent', color: 'var(--fg)',
                      }}
                    >
                      <span
                        style={{
                          width: 26, height: 26, borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          background: i === index ? 'var(--ac-soft)' : 'var(--bg-3)',
                          color: i === index ? 'var(--ac-text)' : 'var(--fg-3)', fontSize: 12,
                        }}
                      >
                        {r.group === 'DOCS' ? '¶' : r.group === 'TOOLS' ? '✦' : r.group === 'CHARTS' ? '◴' : r.group === 'DASHBOARDS' ? '◫' : r.group === 'MARKETING' ? '✺' : '▦'}
                      </span>
                      <span style={{ flex: 1 }}>{r.label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>{r.hint}</span>
                    </button>
                  )
                })}
              </div>
            ),
          )}
          {results.length === 0 && (
            <div style={{ padding: '18px 10px', fontSize: 13, color: 'var(--fg-3)', textAlign: 'center' }}>No results for “{query}”</div>
          )}
        </div>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 14, height: 38, padding: '0 14px',
            borderTop: '1px solid var(--line)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)',
          }}
        >
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span style={{ marginLeft: 'auto' }}>{results.length} results · 3ms</span>
        </div>
      </div>
    </div>
  )
}

function GithubPill() {
  const { formatted, loading } = useGithubStars(REPO_OWNER, REPO_NAME)
  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noreferrer"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, height: 32, padding: '0 11px',
        borderRadius: 8, border: '1px solid var(--line-2)', fontSize: 13, color: 'var(--fg)',
      }}
    >
      GitHub
      <span
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-2)',
          minWidth: 36, justifyContent: 'flex-end',
          opacity: loading && !formatted ? 0 : 1,
          transition: 'opacity 150ms var(--ease-swift-out)',
        }}
      >
        <span style={{ color: 'var(--warn)' }}>★</span>
        {formatted ?? ''}
      </span>
    </a>
  )
}

function useHeaderViewport() {
  const read = () => {
    if (typeof window === 'undefined') return { isMobile: false, isTablet: false }
    const isMobile = window.matchMedia('(max-width: 720px)').matches
    const isTablet = window.matchMedia('(max-width: 1199px)').matches && !isMobile
    return { isMobile, isTablet }
  }
  const [v, setV] = useState(read)
  useEffect(() => {
    const mq1 = window.matchMedia('(max-width: 720px)')
    const mq2 = window.matchMedia('(max-width: 1199px)')
    const on = () => setV(read())
    mq1.addEventListener('change', on)
    mq2.addEventListener('change', on)
    return () => {
      mq1.removeEventListener('change', on)
      mq2.removeEventListener('change', on)
    }
  }, [])
  return v
}

export function SiteHeader({ height = 56, onMenu }: { height?: number; onMenu?: () => void }) {
  const { pathname } = useLocation()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const { isMobile, isTablet } = useHeaderViewport()

  // Close the built-in drawer on route change.
  useEffect(() => setNavOpen(false), [pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header
      style={{
        height, display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 26,
        padding: isMobile ? '0 14px' : isTablet ? '0 24px' : '0 48px',
        borderBottom: '1px solid var(--line)',
      }}
    >
      {isMobile && (
        <button
          data-mobile-menu
          onClick={onMenu ?? (() => setNavOpen((o) => !o))}
          aria-label="Toggle menu"
          style={{
            width: 36, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--line-2)', borderRadius: 7, background: 'var(--bg-1)', color: 'var(--fg)',
            fontSize: 16, cursor: 'pointer', flex: '0 0 auto',
          }}
        >
          ☰
        </button>
      )}
      <Logo />
      {!isMobile && (
        <nav style={{ display: 'flex', gap: 18, fontSize: 14 }}>
          {NAV.map((n) => {
            const active = n.match(pathname)
            return (
              <Link key={n.label} to={n.to} style={{ color: active ? 'var(--fg)' : 'var(--fg-2)', fontWeight: active ? 500 : 400, whiteSpace: 'nowrap' }}>
                {n.label}
              </Link>
            )
          })}
        </nav>
      )}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12 }}>
        {!isMobile && (
          <button
            onClick={() => setPaletteOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              height: 32, width: isTablet ? 160 : 200, padding: '0 8px 0 10px',
              background: 'var(--bg-1)', border: '1px solid var(--line)', borderRadius: 8,
              fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--fg-3)', cursor: 'pointer',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 12 }}>⌕</span> Search docs
            </span>
            <kbd className="vl-kbd" style={{ flex: '0 0 auto' }}>⌘K</kbd>
          </button>
        )}
        {!isMobile && <GithubPill />}
        {!isMobile && import.meta.env.DEV && (
          <Link
            to="/playground"
            style={{
              fontSize: 13, color: pathname === '/playground' ? 'var(--fg)' : 'var(--fg-2)',
              fontWeight: pathname === '/playground' ? 500 : 400, whiteSpace: 'nowrap',
            }}
          >
            Playground
          </Link>
        )}
        <ModeToggle />
        {!isMobile && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>v1.0.4</span>}
      </div>
      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}
      {isMobile && !onMenu && navOpen && (
        <>
          <div
            onClick={() => setNavOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'oklch(0 0 0/.5)', zIndex: 150 }}
          />
          <nav
            style={{
              position: 'fixed', top: 0, left: 0, bottom: 0, width: 280, zIndex: 151,
              background: 'var(--bg)', borderRight: '1px solid var(--line)',
              padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 4,
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <Logo />
              <button
                onClick={() => setNavOpen(false)}
                aria-label="Close menu"
                style={{ fontSize: 18, color: 'var(--fg-3)', padding: '2px 8px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            {NAV.map((n) => {
              const active = n.match(pathname)
              return (
                <Link
                  key={n.label}
                  to={n.to}
                  onClick={() => setNavOpen(false)}
                  style={{
                    padding: '10px 12px', borderRadius: 8, fontSize: 15,
                    color: active ? 'var(--fg)' : 'var(--fg-2)', fontWeight: active ? 600 : 400,
                    background: active ? 'var(--bg-2)' : 'transparent',
                  }}
                >
                  {n.label}
                </Link>
              )
            })}
          </nav>
        </>
      )}
    </header>
  )
}
