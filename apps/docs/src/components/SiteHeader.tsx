import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../theme'

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
  { label: 'Motion', to: '/docs/motion', match: (p: string) => p === '/docs/motion' },
  { label: 'Tokens', to: '/docs/tokens', match: (p: string) => p === '/docs/tokens' },
  { label: 'Accents', to: '/accents', match: (p: string) => p === '/accents' },
]

const PAGES = [
  { label: 'Introduction', to: '/', hint: 'hero · pillars', group: 'DOCS' },
  { label: 'Installation', to: '/docs/installation', hint: 'veloce init', group: 'DOCS' },
  { label: 'Motion system', to: '/docs/motion', hint: 'four rules', group: 'DOCS' },
  { label: 'Design tokens', to: '/docs/tokens', hint: 'oklch · spacing · easing', group: 'DOCS' },
  { label: 'Accent variants', to: '/accents', hint: 'violet · lime · cyan', group: 'DOCS' },
  { label: 'All components', to: '/components', hint: 'overview grid', group: 'COMPONENTS' },
  { label: 'Button', to: '/components/button', hint: 'variants · sizes · loading', group: 'COMPONENTS' },
  { label: 'Input', to: '/components/input', hint: 'states · validation', group: 'COMPONENTS' },
  { label: 'Switch', to: '/components/switch', hint: 'checked · disabled', group: 'COMPONENTS' },
  { label: 'Dialog', to: '/components/dialog', hint: 'props · a11y · motion spec', group: 'COMPONENTS' },
  { label: 'Command palette', to: '/components/command', hint: '⌘K · fuzzy filter', group: 'COMPONENTS' },
  { label: 'Toast', to: '/components/toast', hint: 'stacking · dismiss', group: 'COMPONENTS' },
  { label: 'Progress', to: '/components/progress', hint: 'determinate · indeterminate', group: 'COMPONENTS' },
  { label: 'Skeleton', to: '/components/skeleton', hint: 'shimmer · shapes', group: 'COMPONENTS' },
  { label: 'Data grid', to: '/components/data-grid', hint: 'sort · select · density', group: 'COMPONENTS' },
  { label: 'Badge', to: '/components/badge', hint: 'accent · success · outline', group: 'COMPONENTS' },
  { label: 'Card', to: '/components/card', hint: 'lift · media · footer', group: 'COMPONENTS' },
  { label: 'Select', to: '/components/select', hint: 'unfold · groups', group: 'COMPONENTS' },
  { label: 'Checkbox', to: '/components/checkbox', hint: 'draw · indeterminate', group: 'COMPONENTS' },
  { label: 'Tabs', to: '/components/tabs', hint: 'sliding indicator', group: 'COMPONENTS' },
  { label: 'Dropdown menu', to: '/components/dropdown', hint: 'unfold · shortcuts', group: 'COMPONENTS' },
  { label: 'Popover', to: '/components/popover', hint: 'anchored · scale-fade', group: 'COMPONENTS' },
  { label: 'Tooltip', to: '/components/tooltip', hint: 'rise · delay', group: 'COMPONENTS' },
  { label: 'Accordion', to: '/components/accordion', hint: 'height auto · single', group: 'COMPONENTS' },
  { label: 'Chip', to: '/components/chip', hint: 'removable · filter', group: 'COMPONENTS' },
  { label: 'Avatar', to: '/components/avatar', hint: 'sizes · stack · fallback', group: 'COMPONENTS' },
  { label: 'Separator', to: '/components/separator', hint: 'horizontal · vertical', group: 'COMPONENTS' },
  { label: 'Textarea', to: '/components/textarea', hint: 'autogrow · counter', group: 'COMPONENTS' },
  { label: 'Radio', to: '/components/radio', hint: 'group · cards', group: 'COMPONENTS' },
  { label: 'Slider', to: '/components/slider', hint: 'drag · steps · range', group: 'COMPONENTS' },
  { label: 'Toggle group', to: '/components/toggle-group', hint: 'single · multiple', group: 'COMPONENTS' },
  { label: 'Sheet', to: '/components/sheet', hint: 'side panel · slide 250ms', group: 'COMPONENTS' },
  { label: 'Alert', to: '/components/alert', hint: 'info · warn · error', group: 'COMPONENTS' },
  { label: 'Spinner', to: '/components/spinner', hint: 'sizes · inline', group: 'COMPONENTS' },
  { label: 'Empty state', to: '/components/empty-state', hint: 'icon · action', group: 'COMPONENTS' },
  { label: 'Breadcrumbs', to: '/components/breadcrumbs', hint: 'collapse · separator', group: 'COMPONENTS' },
  { label: 'Pagination', to: '/components/pagination', hint: 'pages · ellipsis', group: 'COMPONENTS' },
  { label: 'Stepper', to: '/components/stepper', hint: 'progress · steps', group: 'COMPONENTS' },
  { label: 'Layout primitives', to: '/components/layout', hint: 'container · grid · stack', group: 'COMPONENTS' },
  { label: 'Motion utilities', to: '/components/motion-utilities', hint: 'presence · stagger · numberflow', group: 'COMPONENTS' },
  { label: 'Table', to: '/components/table', hint: 'striped · expandable · totals', group: 'COMPONENTS' },
]

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
    if (r) {
      navigate(r.to)
      onClose()
    }
  }

  const groups = ['DOCS', 'COMPONENTS'].map((g) => ({ g, items: results.filter((r) => r.group === g) }))

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
                        {r.group === 'DOCS' ? '¶' : '▦'}
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
  const { isMobile, isTablet } = useHeaderViewport()

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
          onClick={onMenu ?? (() => {})}
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
            className="vl-input"
            onClick={() => setPaletteOpen(true)}
            style={{ height: 32, width: isTablet ? 160 : 200, background: 'var(--bg-1)', border: '1px solid var(--line)', fontSize: 13, color: 'var(--fg-3)', justifyContent: 'space-between' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 12 }}>⌕</span> Search docs
            </span>
            <kbd className="vl-kbd">⌘K</kbd>
          </button>
        )}
        {!isMobile && (
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, height: 32, padding: '0 11px',
              borderRadius: 8, border: '1px solid var(--line-2)', fontSize: 13, color: 'var(--fg)',
            }}
          >
            GitHub
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-2)' }}>
              <span style={{ color: 'var(--warn)' }}>★</span> 12.4k
            </span>
          </a>
        )}
        {!isMobile && (
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
    </header>
  )
}
