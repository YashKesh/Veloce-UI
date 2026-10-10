import { LineChart, FunnelChart, BarChart, Table, Badge } from 'veloce-ui'
import { DashboardShell, StatCard, Panel } from './DashboardShell'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const traffic = MONTHS.map((label, i) => ({ label, value: [42, 48, 56, 64, 72, 84, 92, 108, 124, 142, 158, 172][i] * 1000 }))
const sessions = MONTHS.map((label, i) => ({ label, value: [60, 68, 78, 88, 98, 114, 126, 148, 168, 192, 214, 232][i] * 1000 }))

const funnel = [
  { label: 'Landing visits', value: 142_000 },
  { label: 'Sign-up click', value: 48_000 },
  { label: 'Account created', value: 22_400 },
  { label: 'Onboarded', value: 14_800 },
  { label: 'Activated', value: 9_200 },
]

const topPages = [
  { path: '/', views: 48200, bounce: '42%', avg: '1:48' },
  { path: '/pricing', views: 28400, bounce: '36%', avg: '2:14' },
  { path: '/docs/installation', views: 18200, bounce: '28%', avg: '3:22' },
  { path: '/blog/launch', views: 12800, bounce: '48%', avg: '4:08' },
  { path: '/components', views: 10600, bounce: '32%', avg: '2:52' },
]

const referrers = ['Direct', 'Google', 'Twitter', 'GitHub', 'HN'].map((label, i) => ({
  label,
  value: [38, 32, 14, 10, 6][i],
}))

export default function AnalyticsDashboard() {
  return (
    <DashboardShell slug="analytics" title="Analytics" description="Traffic, funnel conversion, top pages, referrer breakdown — the standard analytics dashboard.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard label="Users (30d)" value="172k" delta="+9.1%" deltaDir="up" />
        <StatCard label="Sessions" value="232k" delta="+12%" deltaDir="up" />
        <StatCard label="Avg. session" value="2:48" delta="+18s" deltaDir="up" />
        <StatCard label="Bounce rate" value="36%" delta="-2.4pt" deltaDir="up" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 20 }}>
        <Panel title="Users / Sessions · 12 months" action={<Badge tone="accent" variant="soft">Live</Badge>} span={4}>
          <LineChart
            data={traffic}
            series={[
              { label: 'Users', data: traffic.map((d) => d.value) },
              { label: 'Sessions', data: sessions.map((d) => d.value) },
            ]}
            height={240}
            curve="spline"
            yFormat={(n) => `${Math.round(n / 1000)}k`}
          />
        </Panel>
        <Panel title="Traffic sources" span={2}>
          <BarChart data={referrers} height={240} horizontal yFormat={(n) => `${n}%`} />
        </Panel>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
        <Panel title="Conversion funnel" span={3}>
          <FunnelChart data={funnel} width={520} height={260} />
        </Panel>
        <Panel title="Top pages" span={3}>
          <Table variant="plain" density="cozy" style={{ width: '100%' }}>
            <Table.Header>
              <Table.Row>
                <Table.Column>Path</Table.Column>
                <Table.Column align="end">Views</Table.Column>
                <Table.Column align="end">Bounce</Table.Column>
                <Table.Column align="end">Avg.</Table.Column>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {topPages.map((p) => (
                <Table.Row key={p.path}>
                  <Table.Cell style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5 }}>{p.path}</Table.Cell>
                  <Table.Cell align="end" style={{ fontFamily: 'var(--font-mono)' }}>{p.views.toLocaleString()}</Table.Cell>
                  <Table.Cell align="end" style={{ fontFamily: 'var(--font-mono)' }}>{p.bounce}</Table.Cell>
                  <Table.Cell align="end" style={{ fontFamily: 'var(--font-mono)' }}>{p.avg}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Panel>
      </div>
    </DashboardShell>
  )
}
