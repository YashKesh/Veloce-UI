import { PieChart, BarChart, Table, Badge, Avatar, Progress } from 'veloce-ui'
import { DashboardShell, StatCard, Panel } from './DashboardShell'

const departments = [
  { label: 'Engineering', value: 48 },
  { label: 'Design', value: 14 },
  { label: 'Sales', value: 22 },
  { label: 'Marketing', value: 10 },
  { label: 'Ops', value: 6 },
]

const headcount = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((label, i) => ({
  label,
  value: [68, 70, 74, 78, 82, 88, 92, 96, 98, 100][i],
}))

const requests = [
  { by: 'Mara Kim', type: 'PTO', dates: 'Oct 20 — Oct 24', status: 'approved' },
  { by: 'Alex Chen', type: 'WFH', dates: 'Oct 18', status: 'approved' },
  { by: 'Rina Patel', type: 'Sick', dates: 'Oct 15', status: 'approved' },
  { by: 'Jonas Lind', type: 'PTO', dates: 'Nov 1 — Nov 10', status: 'pending' },
  { by: 'Priya Rao', type: 'Parental', dates: 'Nov 15 — Feb 15', status: 'pending' },
]

const reviews = [
  { person: 'Mara Kim', role: 'Design Lead', progress: 92 },
  { person: 'Alex Chen', role: 'Staff Engineer', progress: 76 },
  { person: 'Rina Patel', role: 'Product Manager', progress: 54 },
  { person: 'Jonas Lind', role: 'Growth', progress: 32 },
]

export default function HRDashboard() {
  return (
    <DashboardShell slug="hr" title="People / HR" description="Headcount, departments, leave requests, review cycle — the standard people-ops dashboard.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard label="Headcount" value="100" delta="+4 this month" deltaDir="up" />
        <StatCard label="Open roles" value="12" delta="2 to close soon" deltaDir="flat" />
        <StatCard label="Avg. tenure" value="2.4 yr" />
        <StatCard label="eNPS" value="+42" delta="+3" deltaDir="up" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 20 }}>
        <Panel title="Headcount growth" span={4}>
          <BarChart data={headcount} height={240} />
        </Panel>
        <Panel title="Departments" span={2}>
          <PieChart data={departments} size={220} showLabels />
        </Panel>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
        <Panel title="Leave requests" action={<Badge tone="warn" variant="soft">2 pending</Badge>} span={3}>
          <Table variant="plain" density="cozy" style={{ width: '100%' }}>
            <Table.Header>
              <Table.Row>
                <Table.Column>Person</Table.Column>
                <Table.Column>Type</Table.Column>
                <Table.Column>Dates</Table.Column>
                <Table.Column>Status</Table.Column>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {requests.map((r) => (
                <Table.Row key={r.by + r.dates}>
                  <Table.Cell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar name={r.by} size={22} />
                      {r.by}
                    </div>
                  </Table.Cell>
                  <Table.Cell>{r.type}</Table.Cell>
                  <Table.Cell style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{r.dates}</Table.Cell>
                  <Table.Cell>
                    <Badge tone={r.status === 'approved' ? 'ok' : 'warn'} variant="soft">{r.status}</Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Panel>
        <Panel title="Review cycle · Q4" span={3}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {reviews.map((r) => (
              <div key={r.person} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar name={r.person} size={28} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{r.person}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--fg-3)' }}>{r.role}</div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: r.progress >= 75 ? 'var(--ok)' : r.progress >= 50 ? 'var(--warn)' : 'var(--err)' }}>
                    {r.progress}%
                  </span>
                </div>
                <Progress value={r.progress} max={100} />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  )
}
