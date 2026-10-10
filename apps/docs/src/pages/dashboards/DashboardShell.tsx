import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '../../Seo'
import { SiteHeader } from '../../components/SiteHeader'

export function DashboardShell({
  slug,
  title,
  description,
  children,
}: {
  slug: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="vl-dash-root" style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Seo title={`${title} dashboard`} description={description} />
      <style>{dashResponsiveCss}</style>
      <SiteHeader height={56} />
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--fg-3)' }}>
            <Link to="/dashboards" style={{ color: 'inherit' }}>Dashboards</Link>
            <span>›</span>
            <span style={{ color: 'var(--fg-2)' }}>{title}</span>
          </div>
          <h1 style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--fg)' }}>
            {title} dashboard
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8, fontSize: 12.5, color: 'var(--fg-3)' }}>
          <span style={{ padding: '2px 8px', borderRadius: 999, border: '1px solid var(--line-2)' }}>
            blueprint · {slug}
          </span>
          <span style={{ padding: '2px 8px', borderRadius: 999, background: 'color-mix(in oklch, var(--ok) 15%, transparent)', color: 'var(--ok)' }}>
            copy-paste ready
          </span>
        </div>
      </div>
      <main style={{ flex: 1, padding: 24, maxWidth: 1400, width: '100%', marginInline: 'auto' }}>
        {children}
      </main>
    </div>
  )
}

export function StatCard({ label, value, delta, deltaDir }: { label: string; value: string; delta?: string; deltaDir?: 'up' | 'down' | 'flat' }) {
  const deltaColor = deltaDir === 'up' ? 'var(--ok)' : deltaDir === 'down' ? 'var(--err)' : 'var(--fg-3)'
  return (
    <div style={{ padding: '16px 18px', border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-1)', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 12, color: 'var(--fg-3)', letterSpacing: '0.03em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--fg)', fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </div>
      {delta && (
        <div style={{ fontSize: 12, color: deltaColor, fontFamily: 'var(--font-mono)' }}>
          {deltaDir === 'up' ? '↑' : deltaDir === 'down' ? '↓' : '→'} {delta}
        </div>
      )}
    </div>
  )
}

export function Panel({ title, action, children, span }: { title: string; action?: ReactNode; children: ReactNode; span?: number }) {
  return (
    <div
      className="vl-dash-panel"
      style={{
        gridColumn: span ? `span ${span}` : undefined,
        padding: 18,
        border: '1px solid var(--line)',
        borderRadius: 12,
        background: 'var(--bg-1)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fg)' }}>{title}</span>
        {action}
      </div>
      {children}
    </div>
  )
}

const dashResponsiveCss = `
.vl-dash-root .vl-dash-panel svg.vl-chart:not([data-vl-chart="gauge"]) {
  width: 100% !important;
  height: auto !important;
  max-width: 100%;
  display: block;
}
.vl-dash-root .vl-dash-panel [data-vl-chart-wrap="gauge"] {
  margin-inline: auto;
}
@media (max-width: 900px) {
  .vl-dash-root main > div[style*="grid-template-columns"] {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  .vl-dash-root main > div[style*="grid-template-columns"] > .vl-dash-panel {
    grid-column: auto !important;
  }
}
@media (max-width: 600px) {
  .vl-dash-root main {
    padding: 16px !important;
  }
  .vl-dash-root main > div[style*="grid-template-columns"] {
    grid-template-columns: 1fr !important;
  }
  .vl-dash-root main > div[style*="grid-template-columns"] > .vl-dash-panel {
    grid-column: auto !important;
  }
}
`

