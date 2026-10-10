import { DashboardBuilder } from 'veloce-ui'
import { Seo } from '../Seo'
import { SiteHeader } from '../components/SiteHeader'

// The DashboardBuilder is now a packaged component — this page is a thin host.
// Anyone can drop <DashboardBuilder /> into their own app with:
//   import { DashboardBuilder } from 'veloce-ui'

export default function Builder() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Seo
        title="Dashboard builder"
        description="Drag-and-drop dashboard builder. Pick components from the Veloce library, drop them on a canvas, re-order widgets, and export working JSX."
      />
      <SiteHeader height={56} />

      <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--line)' }}>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--fg)' }}>Dashboard builder</h1>
        <div style={{ fontSize: 12.5, color: 'var(--fg-3)', marginTop: 2 }}>
          Also available as <code style={{ fontFamily: 'var(--font-mono)' }}>{`<DashboardBuilder />`}</code> from <code style={{ fontFamily: 'var(--font-mono)' }}>veloce-ui</code>.
        </div>
      </div>

      <div style={{ flex: 1, padding: 20, minHeight: 0, display: 'flex' }}>
        <DashboardBuilder style={{ flex: 1, minHeight: 'calc(100vh - 180px)' }} />
      </div>
    </div>
  )
}
