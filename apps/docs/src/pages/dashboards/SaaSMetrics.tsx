import { AreaChart, BarChart, LineChart, Table, Badge, Avatar, Button } from 'veloce-ui'
import { DashboardShell, StatCard, Panel } from './DashboardShell'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const mrr = MONTHS.map((label, i) => ({ label, value: [120, 135, 148, 165, 178, 194, 212, 234, 258, 276, 298, 322][i] }))
const churn = MONTHS.map((label, i) => ({ label, value: [4.2, 3.8, 4.1, 3.6, 3.4, 3.1, 2.9, 2.8, 2.6, 2.4, 2.3, 2.1][i] }))
const activation = MONTHS.slice(0, 8).map((label, i) => ({ label, value: [62, 65, 68, 71, 74, 76, 79, 82][i] }))

const topCustomers = [
  { name: 'Acme Corp', plan: 'Enterprise', seats: 142, mrr: '$12,400', trend: 'up' },
  { name: 'Linear Studio', plan: 'Pro', seats: 48, mrr: '$3,840', trend: 'up' },
  { name: 'Globex', plan: 'Enterprise', seats: 86, mrr: '$7,520', trend: 'flat' },
  { name: 'Initech', plan: 'Pro', seats: 32, mrr: '$2,560', trend: 'down' },
  { name: 'Umbrella', plan: 'Enterprise', seats: 118, mrr: '$10,310', trend: 'up' },
]

export default function SaaSMetricsDashboard() {
  return (
    <DashboardShell slug="saas-metrics" title="SaaS metrics" description="MRR, churn, activation, cohorts — the standard SaaS KPI dashboard.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard label="MRR" value="$322k" delta="+8.4% MoM" deltaDir="up" />
        <StatCard label="New customers" value="128" delta="+12 vs last mo" deltaDir="up" />
        <StatCard label="Churn" value="2.1%" delta="-0.2pt" deltaDir="up" />
        <StatCard label="ARPU" value="$184" delta="+$6" deltaDir="up" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 20 }}>
        <Panel title="Monthly Recurring Revenue" action={<Badge tone="ok" variant="soft">+24% YoY</Badge>} span={4}>
          <AreaChart data={mrr} height={240} smooth yFormat={(n) => `$${n}k`} />
        </Panel>
        <Panel title="Churn trend" span={2}>
          <LineChart data={churn} height={240} curve="spline" yFormat={(n) => `${n}%`} />
        </Panel>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 20 }}>
        <Panel title="Activation rate" span={3}>
          <BarChart data={activation} height={220} yFormat={(n) => `${n}%`} />
        </Panel>
        <Panel title="Top customers by MRR" action={<Button size="sm" variant="ghost">View all →</Button>} span={3}>
          <Table variant="striped" density="cozy" style={{ width: '100%' }}>
            <Table.Header>
              <Table.Row>
                <Table.Column>Customer</Table.Column>
                <Table.Column>Plan</Table.Column>
                <Table.Column align="end">Seats</Table.Column>
                <Table.Column align="end">MRR</Table.Column>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {topCustomers.map((c) => (
                <Table.Row key={c.name}>
                  <Table.Cell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar name={c.name} size={24} />
                      <span style={{ fontWeight: 500 }}>{c.name}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge tone={c.plan === 'Enterprise' ? 'accent' : 'neutral'} variant="soft">{c.plan}</Badge>
                  </Table.Cell>
                  <Table.Cell align="end" style={{ fontFamily: 'var(--font-mono)' }}>{c.seats}</Table.Cell>
                  <Table.Cell align="end" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{c.mrr}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Panel>
      </div>
    </DashboardShell>
  )
}
