import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'
import { useTheme } from '../theme'

/** Viewport hook — drives responsive JSX, not just CSS.
 *  mobile: ≤720px, tablet: 721–1199px, desktop: ≥1200px. */
export function useViewport() {
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

export interface SidebarItem {
  label: string
  to?: string
  chip?: string
  dot?: boolean
  /** Third-level entries shown only while this item is active; id scrolls to a section on the page. */
  sub?: { label: string; id?: string }[]
}
export interface SidebarSection {
  title: string
  items: SidebarItem[]
}
export interface SidebarGroup {
  title?: string
  items: SidebarItem[]
  sections?: SidebarSection[]
}

function groupItems(g: SidebarGroup): SidebarItem[] {
  return [...g.items, ...(g.sections?.flatMap((s) => s.items) ?? [])]
}

function ThemeFooter() {
  const { mode, setMode, reducedMotion, setReducedMotion } = useTheme()
  const cell = (active: boolean) => ({
    width: 26, height: 20, display: 'grid', placeItems: 'center' as const,
    borderRadius: 4, fontSize: 11,
    background: active ? 'var(--bg-3)' : 'transparent',
    color: active ? 'var(--fg)' : 'var(--fg-3)',
  })
  return (
    <div style={{ marginTop: 'auto', padding: 12, borderTop: '1px solid var(--line)', fontSize: 13, color: 'var(--fg-2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px' }}>
        <span>Theme</span>
        <span style={{ display: 'flex', height: 26, padding: 2, border: '1px solid var(--line)', borderRadius: 6, background: 'var(--bg-1)', gap: 1 }}>
          <button aria-label="Light mode" style={cell(mode === 'light')} onClick={() => setMode('light')}>☀</button>
          <button
            aria-label="System mode"
            style={cell(false)}
            onClick={() => setMode(window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')}
          >
            ◐
          </button>
          <button aria-label="Dark mode" style={cell(mode === 'dark')} onClick={() => setMode('dark')}>☾</button>
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px' }}>
        <span>Reduced motion</span>
        <button
          role="switch"
          aria-checked={reducedMotion}
          aria-label="Reduced motion"
          onClick={() => setReducedMotion(!reducedMotion)}
          style={{
            position: 'relative', width: 28, height: 16, borderRadius: 999,
            background: reducedMotion ? 'var(--ac)' : 'var(--bg-3)',
            border: reducedMotion ? '1px solid transparent' : '1px solid var(--line-2)',
          }}
        >
          <span
            style={{
              position: 'absolute', top: 1, left: reducedMotion ? 13 : 1, width: 12, height: 12,
              borderRadius: '50%', background: reducedMotion ? 'oklch(0.99 0 0)' : 'var(--fg-2)',
              transition: 'left 180ms cubic-bezier(.22,1,.36,1)',
            }}
          />
        </button>
      </div>
      <div style={{ display: 'flex', gap: 14, padding: '8px 10px 2px', fontSize: 12.5, color: 'var(--fg-3)' }}>
        <span>GitHub ↗</span>
        <span>Discord ↗</span>
        <span>Figma kit ↗</span>
      </div>
    </div>
  )
}

export function Sidebar({ groups }: { groups: SidebarGroup[] }) {
  const { pathname, hash } = useLocation()
  // Only the first item pointing at the current route is highlighted, so
  // secondary links to the same page don't all light up.
  const items = groups.flatMap(groupItems)
  const firstMatch =
    items.find((it) => it.to === pathname + hash) ?? items.find((it) => it.to === pathname)
  const activeGroup = groups.find((g) => groupItems(g).some((it) => it === firstMatch))

  const renderItem = (item: SidebarItem) => {
    const active = item === firstMatch
    const inner = (
      <span
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 10px',
          borderRadius: 7,
          background: active ? 'var(--ac-soft)' : undefined,
          color: active ? 'var(--ac-text)' : 'var(--fg-2)',
          fontWeight: active ? 500 : 400,
          marginLeft: active ? -1 : 0,
          borderLeft: active ? '2px solid var(--ac)' : undefined,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>{item.label}</span>
        {item.chip && (
          <span
            style={{
              fontSize: 10, fontWeight: 600, padding: '1px 5px', borderRadius: 4,
              background: 'var(--ac)', color: 'var(--ac-fg)',
            }}
          >
            {item.chip}
          </span>
        )}
      </span>
    )
    const row = item.to ? (
      <Link to={item.to} style={{ display: 'block', color: 'inherit' }}>{inner}</Link>
    ) : (
      inner
    )
    return (
      <div key={item.label}>
        {row}
        {active && item.sub && (
          <div style={{ marginLeft: 10, paddingLeft: 12, borderLeft: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 1, fontSize: 13 }}>
            {item.sub.map((sc, i) =>
              sc.id ? (
                <button
                  key={sc.label}
                  onClick={() => document.getElementById(sc.id!)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  style={{
                    padding: '5px 10px', textAlign: 'left', fontSize: 13,
                    color: i === 0 ? 'var(--fg)' : 'var(--fg-2)', fontWeight: i === 0 ? 500 : 400,
                  }}
                >
                  {sc.label}
                </button>
              ) : (
                <div key={sc.label} style={{ padding: '5px 10px', color: i === 0 ? 'var(--fg)' : 'var(--fg-2)', fontWeight: i === 0 ? 500 : 400 }}>
                  {sc.label}
                </div>
              ),
            )}
          </div>
        )}
      </div>
    )
  }
  // Manual expand/collapse overrides; groups without an override follow the active route.
  const [overrides, setOverrides] = useState<Record<string, boolean>>({})

  return (
    <aside style={{ borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column', fontSize: 13.5 }}>
      <nav style={{ padding: '20px 12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {groups.map((g) => {
          const expanded = !g.title || (overrides[g.title] ?? g === activeGroup)
          const groupActive = g === activeGroup
          return (
            <div key={g.title ?? 'root'} style={{ display: 'flex', flexDirection: 'column' }}>
              {g.title && (
                <button
                  onClick={() => setOverrides((prev) => ({ ...prev, [g.title!]: !expanded }))}
                  style={{
                    display: 'flex', alignItems: 'center', padding: '7px 10px', borderRadius: 7,
                    color: expanded ? 'var(--fg)' : 'var(--fg-2)', fontWeight: expanded ? 500 : 400,
                    fontSize: 13.5, textAlign: 'left',
                  }}
                >
                  <span style={{ width: 14, fontSize: 10, color: 'var(--fg-3)' }}>{expanded ? '⌄' : '›'}</span>
                  <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 7 }}>
                    {g.title}
                    {groupActive && !expanded && <span style={{ fontSize: 6, color: 'var(--ac-text)' }}>●</span>}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-3)' }}>{groupItems(g).length}</span>
                </button>
              )}
              {expanded && (
                <div
                  style={{
                    display: 'flex', flexDirection: 'column', gap: 1,
                    ...(g.title
                      ? { marginLeft: 17, paddingLeft: 12, borderLeft: '1px solid var(--line)' }
                      : {}),
                  }}
                >
                  {g.items.map(renderItem)}
                  {g.sections?.map((s) => {
                    const sectionActive = s.items.some((it) => it === firstMatch)
                    const key = `${g.title}/${s.title}`
                    const open = overrides[key] ?? sectionActive
                    return (
                      <div key={s.title} style={{ display: 'flex', flexDirection: 'column' }}>
                        <button
                          onClick={() => setOverrides((prev) => ({ ...prev, [key]: !open }))}
                          style={{
                            display: 'flex', alignItems: 'center', padding: '7px 10px', borderRadius: 7,
                            color: open ? 'var(--fg)' : 'var(--fg-2)', fontWeight: open ? 500 : 400,
                            fontSize: 13.5, textAlign: 'left',
                          }}
                        >
                          <span style={{ width: 14, fontSize: 10, color: 'var(--fg-3)' }}>{open ? '⌄' : '›'}</span>
                          <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 7 }}>
                            {s.title}
                            {sectionActive && !open && <span style={{ fontSize: 6, color: 'var(--ac-text)' }}>●</span>}
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-3)' }}>{s.items.length}</span>
                        </button>
                        {open && (
                          <div style={{ marginLeft: 17, paddingLeft: 12, borderLeft: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {s.items.map(renderItem)}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
      <ThemeFooter />
    </aside>
  )
}

export interface TocItem {
  label: string
  /** id of the section element to scroll to */
  id?: string
  active?: boolean
  sub?: boolean
}

export function RightRail({ toc, footer }: { toc: TocItem[]; footer?: ReactNode }) {
  const [current, setCurrent] = useState<string | null>(null)
  return (
    <aside style={{ padding: '32px 20px 32px 0' }}>
      <div style={{ position: 'sticky', top: 24 }}>
        <div className="vl-label" style={{ marginBottom: 10 }}>On this page</div>
        <div style={{ borderLeft: '1px solid var(--line)', fontSize: 13 }}>
          {toc.map((t) => {
            const active = current ? current === t.label : t.active
            const style = {
              display: 'block', width: '100%', textAlign: 'left' as const,
              padding: `5px 0 5px ${t.sub ? 26 : 14}px`,
              marginLeft: active ? -1 : 0,
              borderLeft: active ? '2px solid var(--ac)' : undefined,
              color: active ? 'var(--fg)' : 'var(--fg-3)',
              fontWeight: active ? 500 : 400,
              fontSize: 13,
              cursor: t.id ? 'pointer' : 'default',
            }
            return t.id ? (
              <button
                key={t.label}
                style={style}
                onClick={() => {
                  document.getElementById(t.id!)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  setCurrent(t.label)
                }}
              >
                {t.label}
              </button>
            ) : (
              <div key={t.label} style={style}>{t.label}</div>
            )
          })}
        </div>
        {footer && <div style={{ marginTop: 24 }}>{footer}</div>}
      </div>
    </aside>
  )
}

export function DocsShell({ sidebar, rail, wide, children }: { sidebar: SidebarGroup[]; rail?: ReactNode; wide?: boolean; children: ReactNode }) {
  const { isMobile, isTablet } = useViewport()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close drawer on route change / resize past mobile.
  useEffect(() => {
    if (!isMobile) setMenuOpen(false)
  }, [isMobile])

  const showRail = !!rail && !isMobile && !isTablet
  const showSidebar = !isMobile
  const gridCols = showSidebar
    ? (showRail ? '264px 1fr 220px' : '264px 1fr')
    : '1fr'
  const mainPadding = isMobile ? '20px 16px 40px' : isTablet ? '24px 20px 48px' : (wide ? '36px 40px 56px' : '36px 48px 56px')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <SiteHeader height={56} onMenu={isMobile ? () => setMenuOpen((o) => !o) : undefined} />
      <div style={{ display: 'grid', gridTemplateColumns: gridCols, flex: 1 }}>
        {showSidebar && <Sidebar groups={sidebar} />}
        <main style={{ padding: mainPadding, maxWidth: wide ? undefined : 820 + 96, width: '100%', justifySelf: 'stretch', minWidth: 0 }}>
          <div style={{ maxWidth: wide ? undefined : 820 }}>{children}</div>
        </main>
        {showRail && rail}
      </div>
      {/* Mobile off-canvas sidebar */}
      {isMobile && menuOpen && (
        <>
          <div
            onClick={() => setMenuOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'oklch(0 0 0/.55)', zIndex: 150 }}
          />
          <div
            style={{
              position: 'fixed', top: 0, bottom: 0, left: 0, width: 280, zIndex: 151,
              background: 'var(--bg)', borderRight: '1px solid var(--line)',
              overflowY: 'auto', animation: 'vl-in .2s cubic-bezier(.16,1,.3,1) both',
            }}
          >
            <Sidebar groups={sidebar} />
          </div>
        </>
      )}
      <SiteFooter />
    </div>
  )
}
