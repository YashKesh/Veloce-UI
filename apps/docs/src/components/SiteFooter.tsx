import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../theme'

const mono: CSSProperties = { fontFamily: 'var(--font-mono)' }

function useFooterViewport() {
  const read = () => {
    if (typeof window === 'undefined') return { isMobile: false }
    return { isMobile: window.matchMedia('(max-width: 720px)').matches }
  }
  const [v, setV] = useState(read)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)')
    const on = () => setV(read())
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return v
}

interface ColLink {
  label: string
  to?: string
  href?: string
}

const COLS: { title: string; links: ColLink[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Components', to: '/components' },
      { label: 'Charts', to: '/charts/catalogue' },
      { label: 'Data Grid', to: '/components/data-grid' },
      { label: 'Changelog', to: '/docs/installation' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Docs', to: '/docs/installation' },
      { label: 'Figma kit', href: '#' },
      { label: 'GitHub', href: 'https://github.com' },
      { label: 'Discord', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Blog', href: '#' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', to: '/privacy' },
      { label: 'Terms', to: '/terms' },
      { label: 'License', href: '#' },
    ],
  },
]

export function SiteFooter() {
  const { isMobile } = useFooterViewport()
  const { mode, setMode } = useTheme()
  const chip = (active: boolean): CSSProperties => ({
    width: 26, height: 20, display: 'grid', placeItems: 'center',
    borderRadius: 4, fontSize: 11,
    background: active ? 'var(--bg-3)' : 'transparent',
    color: active ? 'var(--fg)' : 'var(--fg-3)',
    border: 'none', cursor: 'pointer',
  })
  const renderLink = (l: ColLink) => {
    const style: CSSProperties = { color: 'var(--fg-2)', fontSize: 13, lineHeight: 1.9, display: 'block' }
    if (l.to) return <Link key={l.label} to={l.to} style={style}>{l.label}</Link>
    return <a key={l.label} href={l.href} style={style}>{l.label}</a>
  }
  return (
    <footer style={{
      borderTop: '1px solid var(--line)', background: 'var(--bg)',
      padding: isMobile ? '28px 16px 20px' : '40px 48px 24px',
      marginTop: 24,
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: isMobile ? 24 : 32,
        maxWidth: 1200, margin: '0 auto',
      }}>
        {COLS.map((c) => (
          <div key={c.title} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="vl-label" style={{ fontSize: 11, letterSpacing: '0.08em', color: 'var(--fg-3)', textTransform: 'uppercase', marginBottom: 6 }}>
              {c.title}
            </div>
            {c.links.map(renderLink)}
          </div>
        ))}
      </div>
      <div style={{
        maxWidth: 1200, margin: '0 auto', marginTop: isMobile ? 24 : 32,
        paddingTop: 16, borderTop: '1px solid var(--line)',
        display: 'flex', flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: 12,
        justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: 12.5, color: 'var(--fg-3)' }}>© 2025 CodeLoom</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <a href="mailto:hello@codeloomdevv.co.in" style={{ ...mono, fontSize: 12.5, color: 'var(--fg-2)' }}>
            hello@codeloomdevv.co.in
          </a>
          <span style={{ display: 'inline-flex', height: 26, padding: 2, border: '1px solid var(--line)', borderRadius: 6, background: 'var(--bg-1)', gap: 1 }}>
            <button aria-label="Light mode" style={chip(mode === 'light')} onClick={() => setMode('light')}>☀</button>
            <button aria-label="Dark mode" style={chip(mode === 'dark')} onClick={() => setMode('dark')}>☾</button>
          </span>
        </div>
      </div>
    </footer>
  )
}
