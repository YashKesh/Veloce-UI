import { AreaChart, GaugeChart, HeatmapChart, Table, Badge, Avatar } from 'veloce-ui'
import { DashboardShell, StatCard, Panel } from './DashboardShell'

const minutes = Array.from({ length: 60 }, (_, i) => ({ label: `${i}m`, value: 20 + Math.sin(i * 0.3) * 10 + Math.random() * 8 }))
const errors = Array.from({ length: 60 }, (_, i) => ({ label: `${i}m`, value: Math.max(0, Math.sin(i * 0.2) * 4 + Math.random() * 2) }))

const heatmap = Array.from({ length: 24 }, (_, h) =>
  Array.from({ length: 7 }, (_, d) => ({
    x: `${h}h`,
    y: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d],
    value: Math.floor(10 + Math.abs(Math.sin((h - 12) * 0.4)) * 90 + (d % 5) * 10),
  })),
).flat()

const incidents = [
  { id: 'INC-421', title: 'Edge cache miss spike', severity: 'high', region: 'us-east-1', duration: '3m 12s', by: 'Mara K.' },
  { id: 'INC-420', title: 'DB connection pool exhausted', severity: 'critical', region: 'eu-west-2', duration: '8m 42s', by: 'Alex C.' },
  { id: 'INC-419', title: 'Rate limit tripped on /api/deploy', severity: 'medium', region: 'all', duration: '1m 18s', by: 'Rina P.' },
  { id: 'INC-418', title: 'Image optimization queue backed up', severity: 'low', region: 'ap-south-1', duration: '12m 04s', by: 'Jonas L.' },
]

export default function DevOpsDashboard() {
  return (
    <DashboardShell slug="devops" title="DevOps monitoring" description="Uptime, latency, error rate, deploy frequency, incident log — the standard SRE dashboard.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard label="Uptime (30d)" value="99.98%" delta="SLO: 99.95%" deltaDir="up" />
        <StatCard label="p95 latency" value="124ms" delta="-8ms" deltaDir="up" />
        <StatCard label="Error rate" value="0.08%" delta="+0.02pt" deltaDir="down" />
        <StatCard label="Deploys / day" value="14" delta="+3" deltaDir="up" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 20 }}>
        <Panel title="p95 latency · last hour" span={4}>
          <AreaChart data={minutes} height={200} smooth yFormat={(n) => `${Math.round(n)}ms`} />
        </Panel>
        <Panel title="System health" span={2}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <GaugeChart value={99.98} max={100} size={220} label="99.98%" sublabel="uptime" />
            </div>
          </div>
        </Panel>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 20 }}>
        <Panel title="Error rate" span={2}>
          <AreaChart data={errors} height={180} smooth color="var(--err)" yFormat={(n) => `${n.toFixed(1)}%`} />
        </Panel>
        <Panel title="Traffic by hour × day" span={4}>
          <HeatmapChart data={heatmap} width={620} height={180} />
        </Panel>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: 12 }}>
        <Panel title="Recent incidents">
          <Table variant="striped" density="cozy" hoverable style={{ width: '100%' }}>
            <Table.Header>
              <Table.Row>
                <Table.Column>ID</Table.Column>
                <Table.Column>Title</Table.Column>
                <Table.Column>Severity</Table.Column>
                <Table.Column>Region</Table.Column>
                <Table.Column align="end">Duration</Table.Column>
                <Table.Column>Owner</Table.Column>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {incidents.map((i) => (
                <Table.Row key={i.id}>
                  <Table.Cell style={{ fontFamily: 'var(--font-mono)' }}>{i.id}</Table.Cell>
                  <Table.Cell>{i.title}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      tone={i.severity === 'critical' || i.severity === 'high' ? 'err' : i.severity === 'medium' ? 'warn' : 'neutral'}
                      variant="soft"
                    >
                      {i.severity}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{i.region}</Table.Cell>
                  <Table.Cell align="end" style={{ fontFamily: 'var(--font-mono)' }}>{i.duration}</Table.Cell>
                  <Table.Cell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar name={i.by} size={22} />
                      {i.by}
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Panel>
      </div>
    </DashboardShell>
  )
}
