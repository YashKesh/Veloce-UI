import { Link } from 'react-router-dom'
import { Seo } from '../../Seo'
import { SiteHeader } from '../../components/SiteHeader'
import { SiteFooter } from '../../components/SiteFooter'

interface DashboardMeta {
  slug: string
  title: string
  tag: string
  category: 'analytics' | 'operations' | 'admin' | 'marketing'
  description: string
  features: string[]
  components: string[]
  thumb: React.ReactNode
}

const CATEGORIES: { id: DashboardMeta['category']; label: string; description: string }[] = [
  { id: 'analytics',  label: 'Analytics & metrics', description: 'Chart-heavy dashboards. For founders, PMs, finance, SRE.' },
  { id: 'operations', label: 'Workflow & operations', description: 'Process-oriented layouts — tickets, deals, projects, inbox.' },
  { id: 'admin',      label: 'Admin & settings', description: 'User management, settings, account configuration.' },
  { id: 'marketing',  label: 'Marketing & content', description: 'Landing pages, social schedulers, content-first layouts.' },
]

const DASHBOARDS: DashboardMeta[] = [
  {
    slug: 'saas-metrics',
    title: 'SaaS metrics',
    tag: 'Business',
    category: 'analytics',
    description: 'MRR, churn, and activation — the three numbers every SaaS founder reads first every morning.',
    features: [
      'Monthly recurring revenue over 12 months (AreaChart)',
      'Churn trend with spline smoothing',
      'Activation funnel per cohort',
      'Top customers by MRR, sortable table',
      'Delta badges on every stat tile',
    ],
    components: ['AreaChart', 'LineChart', 'BarChart', 'Table', 'Badge', 'Avatar'],
    thumb: <ThumbSaaS />,
  },
  {
    slug: 'analytics',
    title: 'Analytics',
    tag: 'Product',
    category: 'analytics',
    description: 'Traffic patterns, conversion funnel, top pages, and referrer breakdown — the dashboard product teams live in.',
    features: [
      'User / session dual-series line chart',
      'Funnel chart with 5 conversion steps',
      'Top-pages table with bounce + avg. time',
      'Referrer breakdown as horizontal bars',
    ],
    components: ['LineChart', 'FunnelChart', 'BarChart', 'Table'],
    thumb: <ThumbAnalytics />,
  },
  {
    slug: 'ecommerce-admin',
    title: 'E-commerce admin',
    tag: 'Store',
    category: 'analytics',
    description: 'Revenue, orders, and inventory in one glance — ready to drop into a Shopify-style admin.',
    features: [
      'Revenue trend with 12-month history',
      'Category mix donut with center label',
      'Recent orders with status badges + avatars',
      'Low-stock alerts with color-coded progress bars',
    ],
    components: ['AreaChart', 'PieChart', 'Table', 'Progress', 'Badge'],
    thumb: <ThumbEcommerce />,
  },
  {
    slug: 'finance',
    title: 'Finance',
    tag: 'Finance',
    category: 'analytics',
    description: 'Cashflow waterfall, burn rate, runway, and open invoices — the view a CFO wants Monday morning.',
    features: [
      'Monthly cashflow as waterfall (positive / negative deltas)',
      'Runway as step-chart in months',
      'Burn trend over 12 months',
      'Open invoices with overdue flagging',
    ],
    components: ['WaterfallChart', 'LineChart', 'Table', 'Badge'],
    thumb: <ThumbFinance />,
  },
  {
    slug: 'devops',
    title: 'DevOps monitoring',
    tag: 'SRE',
    category: 'analytics',
    description: 'Uptime gauge, p95 latency, error rate, deploy frequency, and incident log — the SRE war room.',
    features: [
      'Live p95 latency area chart (60-minute window)',
      'Uptime gauge against SLO',
      'Error-rate band in --err tone',
      'Traffic heatmap (hour × day-of-week)',
      'Recent incidents with severity + region',
    ],
    components: ['AreaChart', 'GaugeChart', 'HeatmapChart', 'Table'],
    thumb: <ThumbDevOps />,
  },
  {
    slug: 'project-management',
    title: 'Project management',
    tag: 'Team',
    category: 'operations',
    description: 'Sprint gantt, velocity, kanban board, and backlog — a complete Linear/Jira-style team view.',
    features: [
      'Gantt chart with "today" marker',
      '8-sprint velocity history',
      '4-column kanban with ticket cards',
      'Priority, assignee, and sprint tags on every ticket',
    ],
    components: ['GanttChart', 'BarChart', 'Avatar', 'Badge'],
    thumb: <ThumbPM />,
  },
  {
    slug: 'hr',
    title: 'People / HR',
    tag: 'People',
    category: 'analytics',
    description: 'Headcount growth, department mix, leave requests, review cycle — the operating view for people-ops.',
    features: [
      'Headcount growth over 10 months',
      'Department breakdown as donut with labels',
      'Leave requests with status badges',
      'Review-cycle progress per direct report',
    ],
    components: ['PieChart', 'BarChart', 'Progress', 'Avatar', 'Badge'],
    thumb: <ThumbHR />,
  },
  {
    slug: 'admin-users',
    title: 'Admin · Users',
    tag: 'Admin',
    category: 'admin',
    description: 'User management with searchable DataGrid, bulk actions, filters, and a Dialog + Form for inviting members.',
    features: [
      'DataGrid with sort, selection, and per-cell renders',
      'Live search + role filter',
      'Bulk DropdownMenu actions on selected rows',
      'Dialog + Form for invites (Input, Select, Checkbox)',
      'Empty state when filters match nothing',
    ],
    components: ['DataGrid', 'Dialog', 'Form', 'Input', 'Select', 'Checkbox', 'DropdownMenu', 'Avatar', 'Badge'],
    thumb: <ThumbAdminUsers />,
  },
  {
    slug: 'settings',
    title: 'Settings',
    tag: 'Account',
    category: 'admin',
    description: 'Multi-tab settings page — Profile, Notifications, Security, Billing — composed entirely from form primitives.',
    features: [
      'Tabs with four full-page panels',
      'Form fields with inline label + hint columns',
      'Switches for notification preferences',
      'RadioGroup for 2FA method & billing cycle',
      'Alert for trial banner',
    ],
    components: ['Tabs', 'Form', 'Switch', 'RadioGroup', 'Input', 'Textarea', 'Select', 'Alert'],
    thumb: <ThumbSettings />,
  },
  {
    slug: 'inbox',
    title: 'Inbox',
    tag: 'Productivity',
    category: 'operations',
    description: 'Three-pane list-detail layout — folder sidebar, threaded list, message reader with reply composer. No charts.',
    features: [
      'Folder sidebar with unread counts',
      'Live-search over threads',
      'Message reader with Archive / Delete actions',
      'Inline reply composer',
      'Color-coded labels (support / billing / bug / feature)',
    ],
    components: ['Avatar', 'Badge', 'Button', 'Input', 'Separator', 'Textarea'],
    thumb: <ThumbInbox />,
  },
  {
    slug: 'crm-pipeline',
    title: 'CRM · Pipeline',
    tag: 'Sales',
    category: 'operations',
    description: '5-stage sales pipeline Kanban. Deal cards, priority badges, pipeline totals per column.',
    features: [
      '5-column Kanban (Lead → Qualified → Proposal → Negotiation → Won)',
      'Totals + deal count per stage',
      'Priority + owner on every card',
      'Live search across companies and contacts',
    ],
    components: ['Avatar', 'Badge', 'Button', 'Input'],
    thumb: <ThumbCRM />,
  },
  {
    slug: 'helpdesk',
    title: 'Helpdesk',
    tag: 'Support',
    category: 'operations',
    description: 'Ticket queue with SLA tracking, agent workload bars, filter chain, and bulk assign.',
    features: [
      'DataGrid with multi-column sort + selection',
      'SLA badge (<1h = red, <4h = warn)',
      'Agent workload Progress bars',
      'Priority + status + category filters',
      'Today metrics sidebar',
    ],
    components: ['DataGrid', 'Progress', 'Select', 'Input', 'Avatar', 'Badge', 'Button'],
    thumb: <ThumbHelpdesk />,
  },
  {
    slug: 'marketing-site',
    title: 'Marketing · Landing',
    tag: 'Marketing',
    category: 'marketing',
    description: 'A complete marketing landing page template — Hero, Features, Stats, Logos, Testimonials, Pricing, CTA, Footer.',
    features: [
      'Hero with split-layout media',
      'LogoCloud + StatsBar',
      '6-tile FeatureGrid',
      '6-up TestimonialWall',
      '3-tier PricingTable with featured tier',
      'Final CTA band + MarketingFooter',
    ],
    components: ['Hero', 'FeatureGrid', 'StatsBar', 'LogoCloud', 'TestimonialWall', 'PricingTable', 'CTA', 'MarketingFooter'],
    thumb: <ThumbMarketing />,
  },
  {
    slug: 'social-scheduler',
    title: 'Social scheduler',
    tag: 'Content',
    category: 'marketing',
    description: 'Multi-platform post scheduler — weekly calendar grid, draft queue, recent engagement, compose panel.',
    features: [
      'Tabs for Calendar / Queue / Recent',
      'Weekly grid showing scheduled posts per time-slot',
      'Multi-platform post cards (X, LinkedIn, Instagram, YouTube)',
      'Engagement counts on recent posts',
      'Compose panel with platform picker',
    ],
    components: ['Tabs', 'Avatar', 'Badge', 'Button'],
    thumb: <ThumbSocial />,
  },
]

export default function DashboardIndex() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Seo
        title="Dashboard blueprints"
        description="Full-page admin dashboard compositions — SaaS metrics, analytics, e-commerce admin, finance, DevOps, project management, HR. Copy-paste ready."
      />
      <SiteHeader height={56} />

      {/* Hero */}
      <section style={{ padding: '72px 24px 48px', maxWidth: 1200, width: '100%', marginInline: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ padding: '3px 10px', borderRadius: 999, background: 'var(--ac)', color: 'var(--ac-fg)', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.03em' }}>
            NEW
          </span>
          <span style={{ fontSize: 12.5, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>{DASHBOARDS.length} blueprints · 4 categories · composed from existing primitives</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 56, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1.02, color: 'var(--fg)', maxWidth: 900 }}>
          Dashboards, <span style={{ color: 'var(--ac-text)' }}>not components</span>.
        </h1>
        <p style={{ margin: '20px 0 0', fontSize: 18, lineHeight: 1.6, color: 'var(--fg-2)', maxWidth: 680 }}>
          Veloce ships full admin pages — not just the LEGO. Each blueprint is a single <code style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--fg)' }}>.tsx</code> file
          composed from the same primitives you use everywhere else. Click a preview, copy the source, wire it to real data.
        </p>
        <div style={{ display: 'flex', gap: 32, marginTop: 32, flexWrap: 'wrap', fontSize: 13, color: 'var(--fg-3)' }}>
          <span><strong style={{ color: 'var(--fg)', fontWeight: 500 }}>Zero new deps</strong> — same veloce components</span>
          <span><strong style={{ color: 'var(--fg)', fontWeight: 500 }}>Themed</strong> — accent + mode cascade in</span>
          <span><strong style={{ color: 'var(--fg)', fontWeight: 500 }}>Copy, paste, ship</strong> — no CLI, no scaffold</span>
        </div>
      </section>

      {/* Blueprint sections by category */}
      <div style={{ maxWidth: 1200, width: '100%', marginInline: 'auto', padding: '0 24px 48px' }}>
        {CATEGORIES.map((cat) => {
          const items = DASHBOARDS.filter((d) => d.category === cat.id)
          if (items.length === 0) return null
          return (
            <section key={cat.id} id={cat.id} style={{ marginBottom: 56 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600, letterSpacing: '-0.025em', color: 'var(--fg)' }}>{cat.label}</h2>
                  <p style={{ margin: '4px 0 0', fontSize: 13.5, color: 'var(--fg-3)' }}>{cat.description}</p>
                </div>
                <span style={{ fontSize: 12, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>{items.length} blueprint{items.length === 1 ? '' : 's'}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 18 }}>
                {items.map((d) => <DashboardCard key={d.slug} dashboard={d} />)}
              </div>
            </section>
          )
        })}
      </div>

      {/* How to use */}
      <section style={{ padding: '48px 24px 96px', maxWidth: 1000, width: '100%', marginInline: 'auto' }}>
        <h2 style={{ margin: '0 0 12px', fontSize: 28, fontWeight: 600, letterSpacing: '-0.025em' }}>How to use these</h2>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: 'var(--fg-2)', maxWidth: 640 }}>
          Each blueprint is a single React page under <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13.5 }}>apps/docs/src/pages/dashboards/</code>.
          Open any preview, copy the source, drop it into your project. Replace the inline mock data with your real queries — the rest just works.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 32 }}>
          {[
            { n: '01', title: 'Pick a blueprint', body: 'Browse the grid above and preview the layout that matches your use case.' },
            { n: '02', title: 'Copy the source', body: 'One file. All inline. No prop-drilling across a dozen imports — just React and veloce.' },
            { n: '03', title: 'Wire your data', body: 'Replace the mock arrays with your API calls. Keep the shape; swap the values.' },
          ].map((s) => (
            <div key={s.n} style={{ padding: 20, border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-1)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ac-text)', letterSpacing: '0.08em', marginBottom: 8 }}>{s.n}</div>
              <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--fg-2)' }}>{s.body}</div>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

// Thumbnail SVGs — tiny abstract previews that hint at the dashboard shape.
function DashboardCard({ dashboard: d }: { dashboard: DashboardMeta }) {
  return (
    <Link
      to={`/dashboards/${d.slug}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 14,
        border: '1px solid var(--line)',
        background: 'var(--bg-1)',
        color: 'var(--fg)',
        textDecoration: 'none',
        overflow: 'hidden',
        transition: 'border-color 150ms, transform 150ms, box-shadow 150ms',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--ac-line)'
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--line)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ height: 150, background: 'var(--bg-2)', borderBottom: '1px solid var(--line)', padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {d.thumb}
      </div>
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ac-text)', fontFamily: 'var(--font-mono)' }}>{d.tag}</span>
          <span style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>{d.components.length} components</span>
        </div>
        <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em' }}>{d.title}</div>
        <div style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--fg-2)' }}>{d.description}</div>
        <ul style={{ listStyle: 'none', margin: '6px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {d.features.slice(0, 3).map((f) => (
            <li key={f} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.5 }}>
              <span style={{ color: 'var(--ok)', flexShrink: 0 }}>✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 4 }}>
          {d.components.slice(0, 6).map((c) => (
            <span key={c} style={{ fontSize: 10.5, padding: '2px 7px', borderRadius: 4, background: 'var(--bg-2)', color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>{c}</span>
          ))}
          {d.components.length > 6 && <span style={{ fontSize: 10.5, padding: '2px 7px', color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>+{d.components.length - 6}</span>}
        </div>
        <div style={{ marginTop: 6, fontSize: 12.5, color: 'var(--ac-text)', fontWeight: 500 }}>Open preview →</div>
      </div>
    </Link>
  )
}

const t = { stroke: 'var(--ac)', fill: 'color-mix(in oklch, var(--ac) 20%, transparent)' }

function ThumbSaaS() {
  return (
    <svg viewBox="0 0 320 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <path d="M 10 90 L 50 80 L 90 70 L 130 55 L 170 50 L 210 35 L 250 25 L 290 15 L 310 10" fill="none" stroke={t.stroke} strokeWidth="2" />
      <path d="M 10 90 L 50 80 L 90 70 L 130 55 L 170 50 L 210 35 L 250 25 L 290 15 L 310 10 L 310 105 L 10 105 Z" fill={t.fill} opacity="0.4" />
      {[20, 40, 60, 80, 100].map((v, i) => <circle key={i} cx={30 + i * 60} cy={110 - v} r="2" fill="var(--ac)" />)}
    </svg>
  )
}

function ThumbAnalytics() {
  return (
    <svg viewBox="0 0 320 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      {/* funnel */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={30 + i * 12} y={20 + i * 8} width={260 - i * 24} height="10" fill={i === 0 ? 'var(--ac)' : 'color-mix(in oklch, var(--ac) 50%, var(--bg-3))'} opacity={1 - i * 0.15} rx="2" />
      ))}
    </svg>
  )
}

function ThumbEcommerce() {
  return (
    <svg viewBox="0 0 320 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <path d="M 10 90 Q 60 60, 100 70 T 190 40 T 290 20" fill="none" stroke={t.stroke} strokeWidth="2" />
      <circle cx="260" cy="60" r="30" fill="none" stroke="var(--line-2)" strokeWidth="12" />
      <circle cx="260" cy="60" r="30" fill="none" stroke="var(--ac)" strokeWidth="12" strokeDasharray="110 188" transform="rotate(-90 260 60)" />
    </svg>
  )
}

function ThumbFinance() {
  const heights = [60, 20, 35, 25, 30, 70]
  const colors = ['var(--ac)', 'var(--ok)', 'var(--err)', 'var(--ok)', 'var(--err)', 'var(--ac)']
  return (
    <svg viewBox="0 0 320 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      {heights.map((h, i) => (
        <rect key={i} x={30 + i * 46} y={100 - h} width="36" height={h} fill={colors[i]} opacity="0.7" rx="2" />
      ))}
    </svg>
  )
}

function ThumbDevOps() {
  return (
    <svg viewBox="0 0 320 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <path d="M 10 70 L 30 65 L 50 72 L 70 68 L 90 60 L 110 65 L 130 55 L 150 58 L 170 48 L 190 52 L 210 44 L 230 48 L 250 40 L 270 42 L 290 35 L 310 38" fill="none" stroke={t.stroke} strokeWidth="2" />
      {/* uptime gauge */}
      <path d="M 240 95 A 40 40 0 1 1 300 95" fill="none" stroke="var(--line-2)" strokeWidth="8" strokeLinecap="round" />
      <path d="M 240 95 A 40 40 0 1 1 300 95" fill="none" stroke="var(--ac)" strokeWidth="8" strokeLinecap="round" strokeDasharray="120 10" />
    </svg>
  )
}

function ThumbPM() {
  return (
    <svg viewBox="0 0 320 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      {/* 4 columns */}
      {[0, 1, 2, 3].map((c) => (
        <g key={c}>
          <rect x={10 + c * 80} y={10} width={72} height={100} fill="var(--bg)" stroke="var(--line)" strokeWidth="1" rx="4" />
          <rect x={16 + c * 80} y={18} width={60} height={6} fill={c === 1 ? 'var(--warn)' : c === 2 ? 'var(--ac-text)' : c === 3 ? 'var(--ok)' : 'var(--fg-3)'} opacity="0.6" rx="1" />
          <rect x={16 + c * 80} y={34} width={60} height={14} fill="var(--bg-2)" rx="3" />
          <rect x={16 + c * 80} y={54} width={60} height={14} fill="var(--bg-2)" rx="3" />
          {c < 3 && <rect x={16 + c * 80} y={74} width={60} height={14} fill="var(--bg-2)" rx="3" />}
        </g>
      ))}
    </svg>
  )
}

function ThumbHR() {
  return (
    <svg viewBox="0 0 320 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      {/* bar chart left */}
      {[30, 40, 50, 55, 65, 70].map((h, i) => (
        <rect key={i} x={20 + i * 28} y={100 - h} width="20" height={h} fill="var(--ac)" opacity={0.4 + i * 0.1} rx="2" />
      ))}
      {/* donut right */}
      <circle cx="260" cy="60" r="36" fill="none" stroke="var(--bg-3)" strokeWidth="14" />
      <circle cx="260" cy="60" r="36" fill="none" stroke="var(--ac)" strokeWidth="14" strokeDasharray="140 226" transform="rotate(-90 260 60)" />
    </svg>
  )
}

function ThumbAdminUsers() {
  return (
    <svg viewBox="0 0 320 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      {/* table header */}
      <rect x="10" y="10" width="300" height="18" fill="var(--bg-2)" stroke="var(--line)" strokeWidth="1" rx="3" />
      {/* 4 rows */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="10" y={34 + i * 20} width="300" height="18" fill={i === 1 ? 'color-mix(in oklch, var(--ac) 10%, transparent)' : 'transparent'} stroke="var(--line)" strokeWidth="0.5" rx="2" />
          <circle cx="22" cy={43 + i * 20} r="6" fill="var(--ac)" opacity="0.5" />
          <rect x="34" y={40 + i * 20} width="60" height="5" fill="var(--fg-3)" rx="1" />
          <rect x="110" y={40 + i * 20} width="40" height="5" fill="var(--fg-3)" opacity="0.6" rx="1" />
          <rect x="170" y={38 + i * 20} width="30" height="10" fill={i === 2 ? 'var(--warn)' : 'var(--ok)'} opacity="0.4" rx="5" />
          <rect x="220" y={40 + i * 20} width="50" height="5" fill="var(--fg-3)" opacity="0.4" rx="1" />
        </g>
      ))}
    </svg>
  )
}

function ThumbSettings() {
  return (
    <svg viewBox="0 0 320 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      {/* tabs */}
      <rect x="20" y="12" width="40" height="4" fill="var(--ac)" rx="2" />
      <rect x="68" y="12" width="48" height="4" fill="var(--fg-3)" opacity="0.4" rx="2" />
      <rect x="124" y="12" width="40" height="4" fill="var(--fg-3)" opacity="0.4" rx="2" />
      {/* form rows */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="20" y={32 + i * 24} width="60" height="6" fill="var(--fg-3)" opacity="0.6" rx="1" />
          <rect x="100" y={28 + i * 24} width="200" height="14" fill="var(--bg-2)" stroke="var(--line)" strokeWidth="1" rx="3" />
        </g>
      ))}
      {/* switches row */}
      <rect x="20" y="104" width="60" height="6" fill="var(--fg-3)" opacity="0.6" rx="1" />
      <rect x="100" y="100" width="24" height="14" fill="var(--ac)" rx="7" />
      <circle cx="117" cy="107" r="5" fill="var(--bg-1)" />
      <rect x="140" y="100" width="24" height="14" fill="var(--bg-3)" rx="7" />
      <circle cx="147" cy="107" r="5" fill="var(--bg-1)" />
    </svg>
  )
}

function ThumbInbox() {
  return (
    <svg viewBox="0 0 320 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      {/* 3 panes */}
      <rect x="10" y="10" width="70" height="100" fill="var(--bg-2)" stroke="var(--line)" strokeWidth="1" rx="4" />
      <rect x="88" y="10" width="100" height="100" fill="var(--bg)" stroke="var(--line)" strokeWidth="1" rx="4" />
      <rect x="196" y="10" width="114" height="100" fill="var(--bg-1)" stroke="var(--line)" strokeWidth="1" rx="4" />
      {/* folder items */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x="18" y={22 + i * 14} width="54" height="6" fill={i === 0 ? 'var(--ac)' : 'var(--fg-3)'} opacity={i === 0 ? 0.9 : 0.5} rx="1" />
      ))}
      {/* thread list */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="94" y={20 + i * 22} width="88" height="18" fill={i === 1 ? 'color-mix(in oklch, var(--ac) 10%, transparent)' : 'transparent'} rx="2" />
          <circle cx="100" cy={29 + i * 22} r="4" fill="var(--ac)" opacity={i < 2 ? 1 : 0.3} />
          <rect x="110" y={25 + i * 22} width="60" height="4" fill="var(--fg-3)" opacity="0.7" rx="1" />
          <rect x="110" y={32 + i * 22} width="40" height="3" fill="var(--fg-3)" opacity="0.4" rx="1" />
        </g>
      ))}
      {/* detail header */}
      <circle cx="208" cy="24" r="7" fill="var(--ac)" opacity="0.6" />
      <rect x="220" y="20" width="60" height="5" fill="var(--fg)" opacity="0.7" rx="1" />
      <rect x="220" y="28" width="40" height="3" fill="var(--fg-3)" opacity="0.5" rx="1" />
      {/* body */}
      {[42, 50, 58, 66, 74].map((y, i) => (
        <rect key={i} x="204" y={y} width={100 - i * 6} height="3" fill="var(--fg-3)" opacity="0.4" rx="1" />
      ))}
      {/* reply box */}
      <rect x="204" y="88" width="100" height="18" fill="var(--bg-2)" stroke="var(--line)" strokeWidth="1" rx="3" />
    </svg>
  )
}

function ThumbCRM() {
  return (
    <svg viewBox="0 0 320 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      {/* 5 kanban columns */}
      {[0, 1, 2, 3, 4].map((c) => (
        <g key={c}>
          <rect x={8 + c * 62} y={8} width={56} height={104} fill="var(--bg)" stroke="var(--line)" strokeWidth="1" rx="4" />
          <rect x={12 + c * 62} y={14} width={48} height={4} fill={c === 4 ? 'var(--ok)' : c === 3 ? 'var(--warn)' : 'var(--ac)'} opacity="0.7" rx="1" />
          {Array.from({ length: 4 - c > 0 ? 4 - c : 1 }).map((_, k) => (
            <rect key={k} x={12 + c * 62} y={24 + k * 20} width={48} height={16} fill="var(--bg-2)" rx="3" />
          ))}
        </g>
      ))}
    </svg>
  )
}

function ThumbHelpdesk() {
  return (
    <svg viewBox="0 0 320 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      {/* ticket queue left */}
      <rect x="10" y="10" width="210" height="100" fill="var(--bg)" stroke="var(--line)" strokeWidth="1" rx="4" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="16" y={18 + i * 22} width="4" height="16" fill={i === 0 ? 'var(--err)' : i === 1 ? 'var(--warn)' : 'var(--ac)'} rx="2" />
          <rect x="26" y={20 + i * 22} width="80" height="4" fill="var(--fg-3)" opacity="0.6" rx="1" />
          <rect x="26" y={28 + i * 22} width="50" height="3" fill="var(--fg-3)" opacity="0.4" rx="1" />
          <rect x="180" y={20 + i * 22} width="30" height="10" fill={i === 0 ? 'var(--err)' : i === 1 ? 'var(--warn)' : 'var(--ok)'} opacity="0.3" rx="5" />
        </g>
      ))}
      {/* workload sidebar */}
      <rect x="228" y="10" width="82" height="100" fill="var(--bg)" stroke="var(--line)" strokeWidth="1" rx="4" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="234" y={20 + i * 28} width="50" height="3" fill="var(--fg-3)" opacity="0.6" rx="1" />
          <rect x="234" y={28 + i * 28} width="70" height="5" fill="var(--bg-3)" rx="2" />
          <rect x="234" y={28 + i * 28} width={30 + i * 15} height="5" fill="var(--ac)" rx="2" />
        </g>
      ))}
    </svg>
  )
}

function ThumbMarketing() {
  return (
    <svg viewBox="0 0 320 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      {/* hero */}
      <rect x="10" y="10" width="300" height="40" fill={t.fill} opacity="0.3" rx="4" />
      <rect x="20" y="18" width="120" height="6" fill="var(--fg)" opacity="0.7" rx="1" />
      <rect x="20" y="30" width="80" height="3" fill="var(--fg-3)" opacity="0.5" rx="1" />
      <rect x="20" y="38" width="40" height="8" fill="var(--ac)" rx="2" />
      {/* features */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={10 + i * 102} y={56} width={96} height={28} fill="var(--bg)" stroke="var(--line)" strokeWidth="1" rx="3" />
          <circle cx={20 + i * 102} cy={70} r="4" fill="var(--ac)" opacity="0.5" />
          <rect x={30 + i * 102} y={66} width="60" height="4" fill="var(--fg-3)" opacity="0.6" rx="1" />
          <rect x={30 + i * 102} y={74} width="40" height="3" fill="var(--fg-3)" opacity="0.4" rx="1" />
        </g>
      ))}
      {/* pricing */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={10 + i * 102} y={90} width={96} height={20} fill={i === 1 ? 'color-mix(in oklch, var(--ac) 15%, var(--bg))' : 'var(--bg)'} stroke={i === 1 ? 'var(--ac)' : 'var(--line)'} strokeWidth="1" rx="3" />
      ))}
    </svg>
  )
}

function ThumbSocial() {
  return (
    <svg viewBox="0 0 320 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      {/* calendar grid */}
      <rect x="10" y="10" width="200" height="100" fill="var(--bg)" stroke="var(--line)" strokeWidth="1" rx="4" />
      {/* header */}
      {[0, 1, 2, 3, 4, 5, 6].map((d) => (
        <rect key={d} x={16 + d * 27} y={14} width={25} height={4} fill="var(--fg-3)" opacity="0.5" rx="1" />
      ))}
      {/* cells */}
      {[0, 1, 2].map((r) => [0, 1, 2, 3, 4, 5, 6].map((d) => {
        const scheduled = (r + d) % 3 === 0 || (r === 1 && d === 3)
        return <rect key={`${r}-${d}`} x={16 + d * 27} y={24 + r * 26} width={25} height={22} fill={scheduled ? 'color-mix(in oklch, var(--ac) 25%, transparent)' : 'var(--bg-2)'} rx="2" />
      }))}
      {/* compose panel */}
      <rect x="218" y="10" width="92" height="100" fill="var(--bg-1)" stroke="var(--line)" strokeWidth="1" rx="4" />
      <rect x="224" y="18" width="80" height="4" fill="var(--fg-3)" opacity="0.6" rx="1" />
      <rect x="224" y="28" width="80" height="40" fill="var(--bg-2)" stroke="var(--line)" strokeWidth="1" rx="3" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={224 + i * 18} y={76} width={14} height={14} fill="var(--bg-2)" stroke="var(--line)" strokeWidth="1" rx="3" />
      ))}
      <rect x="266" y="96" width="38" height="10" fill="var(--ac)" rx="2" />
    </svg>
  )
}
