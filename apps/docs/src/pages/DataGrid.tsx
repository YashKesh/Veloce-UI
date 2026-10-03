import type { CSSProperties, ReactNode } from 'react'
import { SiteHeader } from '../components/SiteHeader'

const mono: CSSProperties = { fontFamily: 'var(--font-mono)' }
const GRID_COLS = '44px 1.5fr 1fr 1fr .8fr .7fr 1fr 44px'

type Status = 'Ready' | 'Building' | 'Failed' | 'Canceled'

interface Row {
  project: string
  status: Status
  region: string
  duration: string
  size: string
  deployed: string
  selected?: boolean
  hovered?: boolean
}

const ROWS: Row[] = [
  { project: 'veloce-docs', status: 'Ready', region: 'fra1', duration: '42s', size: '2.1 MB', deployed: '2m ago', selected: true },
  { project: 'api-gateway', status: 'Ready', region: 'iad1', duration: '38s', size: '1.4 MB', deployed: '14m ago', selected: true },
  { project: 'marketing-site', status: 'Building', region: 'sfo1', duration: '12s', size: '—', deployed: 'just now' },
  { project: 'veloce-www', status: 'Failed', region: 'fra1', duration: '1m 04s', size: '—', deployed: '26m ago' },
  { project: 'edge-workers', status: 'Ready', region: 'hnd1', duration: '51s', size: '3.2 MB', deployed: '1h ago', hovered: true },
  { project: 'legacy-dashboard', status: 'Canceled', region: 'iad1', duration: '—', size: '—', deployed: '2h ago' },
]

function StatusCell({ status }: { status: Status }) {
  if (status === 'Building') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <span className="vl-spinner" style={{ width: 10, height: 10, color: 'var(--ac)', animationDuration: '.8s' }} />
        Building
      </span>
    )
  }
  const color = status === 'Ready' ? 'var(--ok)' : status === 'Failed' ? 'var(--err)' : 'var(--fg-3)'
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
      {status}
    </span>
  )
}

function Checkbox({ state }: { state: 'checked' | 'unchecked' | 'indeterminate' }) {
  if (state === 'unchecked') {
    return <span style={{ width: 16, height: 16, borderRadius: 4, border: '1px solid var(--line-2)', background: 'var(--bg)', display: 'inline-block' }} />
  }
  return (
    <span style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--ac)', color: 'var(--ac-fg)', display: 'inline-grid', placeItems: 'center', fontSize: 10, fontWeight: 700 }}>
      {state === 'checked' ? '✓' : <span style={{ width: 8, height: 2, borderRadius: 1, background: 'var(--ac-fg)' }} />}
    </span>
  )
}

function ToolBtn({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7, height: 32, padding: '0 12px', borderRadius: 8,
        border: '1px solid var(--line-2)', fontSize: 13, color: active ? 'var(--fg)' : 'var(--fg-2)',
        background: active ? 'var(--bg-2)' : undefined, whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

const NOTES: [string, string][] = [
  ['SORT', 'Click a header to cycle asc → desc → none. Rows reorder with a 250ms settle layout transition.'],
  ['SELECT', 'Shift-click for ranges. Header checkbox is tri-state. Bulk actions slide in over the toolbar in 150ms.'],
  ['RESIZE', 'Drag the accent handle between headers. Column widths snap to an 8px grid; order persists to localStorage.'],
  ['A11Y', 'role="grid" with arrow-key cell navigation. Sort state announced via aria-sort; selection via aria-selected.'],
]

const PLAN_ROWS: { plan: string; seats: string; mrr: string; change: string; err?: boolean; expanded?: boolean }[] = [
  { plan: 'Hobby', seats: '1,204', mrr: '$0', change: '+4.1%' },
  { plan: 'Pro', seats: '486', mrr: '$11,180', change: '+2.8%', expanded: true },
  { plan: 'Team', seats: '112', mrr: '$8,940', change: '+1.2%' },
  { plan: 'Enterprise', seats: '9', mrr: '$21,600', change: '−0.6%', err: true },
]

function DiagramCard({ title, meta, children }: { title: string; meta: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 20, border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
        <span style={{ ...mono, fontSize: 12, color: 'var(--fg)' }}>{title}</span>
        <span style={{ ...mono, fontSize: 11, color: 'var(--fg-3)' }}>{meta}</span>
      </div>
      {children}
    </div>
  )
}

const cell = (muted?: boolean): CSSProperties => ({
  display: 'flex', alignItems: 'center', fontSize: 13, color: muted ? 'var(--fg-3)' : undefined,
})

export default function DataGrid() {
  return (
    <div>
      <SiteHeader />
      <div style={{ padding: '56px 64px', display: 'flex', flexDirection: 'column', gap: 36 }}>
        {/* header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 24, borderBottom: '1px solid var(--line-2)' }}>
          <div className="vl-eyebrow">COVERAGE · ROUND 3</div>
          <h1 style={{ margin: 0, fontSize: 44, fontWeight: 600, letterSpacing: '-0.04em' }}>Data grid &amp; layout</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
            {['selection', 'sort', 'filter', 'resize', 'sticky header', 'row actions', 'pagination', 'virtualised'].map((t) => (
              <span key={t} className="vl-badge vl-badge--outline" style={{ ...mono, fontSize: 11.5 }}>{t}</span>
            ))}
          </div>
        </div>

        {/* ---------- data grid ---------- */}
        <div style={{ border: '1px solid var(--line-2)', borderRadius: 12, background: 'var(--bg-1)', overflow: 'hidden' }}>
          {/* toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 32, width: 240, padding: '0 10px', borderRadius: 8, border: '1px solid var(--line-2)', background: 'var(--bg)', fontSize: 13 }}>
              <span style={{ color: 'var(--fg-3)', fontSize: 13 }}>⌕</span>
              <span style={{ ...mono, fontSize: 12.5 }}>
                status:<span style={{ color: 'var(--ac-text)' }}>ready</span>
              </span>
              <span className="vl-caret" style={{ height: 14 }} />
            </div>
            <ToolBtn active>
              Status
              <span style={{ ...mono, fontSize: 10.5, minWidth: 16, height: 16, padding: '0 4px', borderRadius: 999, background: 'var(--ac)', color: 'var(--ac-fg)', display: 'inline-grid', placeItems: 'center' }}>1</span>
            </ToolBtn>
            <ToolBtn>Region <span style={{ color: 'var(--fg-3)' }}>⌄</span></ToolBtn>
            <ToolBtn>Columns <span style={{ color: 'var(--fg-3)' }}>⌄</span></ToolBtn>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>2 selected</span>
              <span className="vl-btn vl-btn--sm vl-btn--soft">Redeploy</span>
              <span className="vl-btn vl-btn--sm" style={{ color: 'var(--err)', border: '1px solid color-mix(in oklch,var(--err) 40%,var(--line-2))' }}>Delete</span>
              <span style={{ display: 'inline-flex', border: '1px solid var(--line-2)', borderRadius: 8, overflow: 'hidden' }}>
                <span style={{ width: 30, height: 30, display: 'inline-grid', placeItems: 'center', fontSize: 13, background: 'var(--bg-3)', color: 'var(--fg)' }}>☰</span>
                <span style={{ width: 30, height: 30, display: 'inline-grid', placeItems: 'center', fontSize: 13, color: 'var(--fg-3)', borderLeft: '1px solid var(--line-2)' }}>≡</span>
              </span>
            </div>
          </div>

          {/* header row */}
          <div style={{ ...mono, display: 'grid', gridTemplateColumns: GRID_COLS, alignItems: 'center', height: 38, padding: '0 16px', background: 'var(--bg-2)', borderBottom: '1px solid var(--line)', fontSize: 10.5, letterSpacing: '.06em', color: 'var(--fg-3)' }}>
            <span><Checkbox state="indeterminate" /></span>
            <span>PROJECT</span>
            <span style={{ color: 'var(--fg)', display: 'inline-flex', alignItems: 'center', gap: 5, position: 'relative' }}>
              STATUS ↓
              <span style={{ position: 'absolute', right: 8, top: -12, bottom: -12, width: 1, background: 'var(--ac)', boxShadow: '0 0 0 2px var(--ac-soft)' }} />
            </span>
            <span>REGION</span>
            <span>DURATION</span>
            <span>SIZE</span>
            <span>DEPLOYED</span>
            <span />
          </div>

          {/* rows */}
          {ROWS.map((r) => {
            const muted = r.status === 'Canceled'
            return (
              <div
                key={r.project}
                style={{
                  display: 'grid', gridTemplateColumns: GRID_COLS, alignItems: 'center', height: 46, padding: '0 16px',
                  borderBottom: '1px solid var(--line)',
                  background: r.selected ? 'var(--ac-soft)' : r.hovered ? 'var(--bg-2)' : undefined,
                  opacity: muted ? 0.6 : undefined,
                }}
              >
                <span><Checkbox state={r.selected ? 'checked' : 'unchecked'} /></span>
                <span style={{ ...cell(), fontWeight: 500 }}>{r.project}</span>
                <span style={cell()}><StatusCell status={r.status} /></span>
                <span style={{ ...cell(true), ...mono, fontSize: 12.5 }}>{r.region}</span>
                <span style={{ ...cell(true), ...mono, fontSize: 12.5, fontVariantNumeric: 'tabular-nums' }}>{r.duration}</span>
                <span style={{ ...cell(true), ...mono, fontSize: 12.5, fontVariantNumeric: 'tabular-nums' }}>{r.size}</span>
                <span style={cell(true)}>{r.deployed}</span>
                <span style={{ textAlign: 'center', color: 'var(--fg-2)', visibility: r.hovered ? 'visible' : 'hidden' }}>⋯</span>
              </div>
            )
          })}

          {/* footer */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', fontSize: 13, color: 'var(--fg-3)' }}>
            <span>Showing 1–6 of 472 · 6 rows / page</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, alignItems: 'center' }}>
              <span style={{ width: 30, height: 30, borderRadius: 7, display: 'inline-grid', placeItems: 'center', color: 'var(--fg-3)' }}>‹</span>
              <span style={{ width: 30, height: 30, borderRadius: 7, display: 'inline-grid', placeItems: 'center', background: 'var(--fg)', color: 'var(--bg)', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>1</span>
              {['2', '3'].map((n) => (
                <span key={n} style={{ width: 30, height: 30, borderRadius: 7, display: 'inline-grid', placeItems: 'center', color: 'var(--fg-2)', fontVariantNumeric: 'tabular-nums' }}>{n}</span>
              ))}
              <span style={{ color: 'var(--fg-3)', padding: '0 4px' }}>…</span>
              <span style={{ width: 30, height: 30, borderRadius: 7, display: 'inline-grid', placeItems: 'center', color: 'var(--fg-2)', fontVariantNumeric: 'tabular-nums' }}>79</span>
              <span style={{ width: 30, height: 30, borderRadius: 7, display: 'inline-grid', placeItems: 'center', color: 'var(--fg-2)' }}>›</span>
            </div>
          </div>
        </div>

        {/* behavior notes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {NOTES.map(([t, body]) => (
            <div key={t} style={{ padding: '16px 18px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg-1)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ ...mono, fontSize: 11, letterSpacing: '.06em', color: 'var(--ac-text)' }}>{t}</span>
              <span style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--fg-2)' }}>{body}</span>
            </div>
          ))}
        </div>

        {/* ---------- table variants + layout primitives ---------- */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 32, alignItems: 'start' }}>
          {/* table variants */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <h2 className="vl-h2" style={{ margin: 0 }}>Table variants</h2>
              <span style={{ ...mono, fontSize: 11.5, color: 'var(--fg-3)' }}>striped · expandable rows · tabular-nums</span>
            </div>
            <div style={{ border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-1)', overflow: 'hidden' }}>
              <div style={{ ...mono, display: 'grid', gridTemplateColumns: '30px 1.2fr 1fr 1fr .8fr', padding: '10px 16px', fontSize: 10.5, letterSpacing: '.06em', color: 'var(--fg-3)', background: 'var(--bg-2)', borderBottom: '1px solid var(--line)' }}>
                <span />
                <span>PLAN</span><span>SEATS</span><span>MRR</span><span style={{ textAlign: 'right' }}>CHANGE</span>
              </div>
              {PLAN_ROWS.map((r, i) => (
                <div key={r.plan}>
                  <div style={{ display: 'grid', gridTemplateColumns: '30px 1.2fr 1fr 1fr .8fr', alignItems: 'center', height: 40, padding: '0 16px', fontSize: 13, background: i % 2 === 1 && !r.expanded ? 'var(--bg-2)' : undefined, fontVariantNumeric: 'tabular-nums' }}>
                    <span style={{ color: r.expanded ? 'var(--ac-text)' : 'var(--fg-3)', fontSize: 11 }}>{r.expanded ? '⌄' : '›'}</span>
                    <span style={{ fontWeight: 500 }}>{r.plan}</span>
                    <span style={{ color: 'var(--fg-2)' }}>{r.seats}</span>
                    <span style={{ color: 'var(--fg-2)' }}>{r.mrr}</span>
                    <span style={{ textAlign: 'right', color: r.err ? 'var(--err)' : 'var(--ok)' }}>{r.change}</span>
                  </div>
                  {r.expanded && (
                    <div style={{ display: 'flex', gap: 24, padding: '10px 16px 14px 46px', fontSize: 12.5, color: 'var(--fg-2)', background: 'var(--bg-2)', borderBottom: '1px solid var(--line)', fontVariantNumeric: 'tabular-nums' }}>
                      <span>Monthly <span style={{ color: 'var(--fg)' }}>1,204</span></span>
                      <span>Annual <span style={{ color: 'var(--fg)' }}>726</span></span>
                      <span>Churn <span style={{ color: 'var(--fg)' }}>1.1%</span></span>
                    </div>
                  )}
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '30px 1.2fr 1fr 1fr .8fr', alignItems: 'center', height: 42, padding: '0 16px', fontSize: 13, fontWeight: 600, borderTop: '1px solid var(--line-2)', fontVariantNumeric: 'tabular-nums' }}>
                <span />
                <span>Total</span>
                <span>1,811</span>
                <span>$41,720</span>
                <span style={{ textAlign: 'right', color: 'var(--ok)' }}>+2.1%</span>
              </div>
            </div>
          </div>

          {/* layout primitives */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <h2 className="vl-h2" style={{ margin: 0 }}>Layout primitives</h2>
              <span style={{ ...mono, fontSize: 11.5, color: 'var(--fg-3)' }}>Container · Grid · Stack · AspectRatio</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <DiagramCard title='<Container size="lg">' meta="max 1200 · gutter --sp-6">
                <div style={{ height: 84, borderRadius: 8, background: 'var(--bg-2)', border: '1px dashed var(--line-2)', display: 'grid', placeItems: 'center', padding: '0 24px' }}>
                  <div style={{ width: '78%', height: 52, borderRadius: 6, background: 'var(--ac-soft)', border: '1px solid var(--ac-line)' }} />
                </div>
              </DiagramCard>
              <DiagramCard title='<Grid columns="12" gap="4">' meta="spans 8/4 · 4/4/4">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 4 }}>
                    <div style={{ gridColumn: 'span 8', height: 36, borderRadius: 5, background: 'var(--ac-soft)', border: '1px solid var(--ac-line)', display: 'grid', placeItems: 'center', ...mono, fontSize: 10.5, color: 'var(--ac-text)' }}>8</div>
                    <div style={{ gridColumn: 'span 4', height: 36, borderRadius: 5, background: 'var(--bg-3)', display: 'grid', placeItems: 'center', ...mono, fontSize: 10.5, color: 'var(--fg-3)' }}>4</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 4 }}>
                    {[4, 4, 4].map((n, i) => (
                      <div key={i} style={{ gridColumn: 'span 4', height: 36, borderRadius: 5, background: 'var(--bg-3)', display: 'grid', placeItems: 'center', ...mono, fontSize: 10.5, color: 'var(--fg-3)' }}>{n}</div>
                    ))}
                  </div>
                </div>
              </DiagramCard>
              <DiagramCard title='<Stack gap="3" divider>' meta="hairline dividers">
                <div style={{ borderRadius: 8, border: '1px solid var(--line)', background: 'var(--bg)', overflow: 'hidden' }}>
                  {['General', 'Members', 'Billing'].map((t, i) => (
                    <div key={t} style={{ padding: '9px 12px', fontSize: 13, color: 'var(--fg-2)', borderTop: i > 0 ? '1px solid var(--line)' : undefined }}>{t}</div>
                  ))}
                </div>
              </DiagramCard>
              <DiagramCard title='<AspectRatio ratio="16/9">' meta="media, previews">
                <div style={{ aspectRatio: '16 / 9', borderRadius: 8, background: 'linear-gradient(135deg,var(--ac-soft),var(--bg-3))', border: '1px solid var(--line-2)', display: 'grid', placeItems: 'center', ...mono, fontSize: 11, color: 'var(--fg-2)' }}>
                  16 : 9
                </div>
              </DiagramCard>
            </div>
            <div style={{ ...mono, fontSize: 11.5, color: 'var(--fg-3)' }}>
              breakpoints · sm 640 · md 768 · lg 1024 · xl 1280
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
