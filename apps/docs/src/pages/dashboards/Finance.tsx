import { WaterfallChart, LineChart, Table, Badge } from 'veloce-ui'
import { DashboardShell, StatCard, Panel } from './DashboardShell'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const cashflow = [
  { label: 'Open', value: 240, type: 'total' as const },
  { label: 'Revenue', value: 142 },
  { label: 'Payroll', value: -62 },
  { label: 'Infra', value: -14 },
  { label: 'Marketing', value: -22 },
  { label: 'Other', value: -8 },
  { label: 'Close', value: 276, type: 'total' as const },
]

const burn = MONTHS.map((label, i) => ({ label, value: [48, 52, 56, 58, 62, 64, 68, 72, 74, 78, 82, 84][i] }))
const runway = MONTHS.map((label, i) => ({ label, value: [24, 23, 22, 22, 21, 21, 20, 19, 19, 18, 18, 17][i] }))

const invoices = [
  { id: 'INV-2024-142', client: 'Acme Corp', amount: '$12,400', status: 'paid', due: 'Oct 1' },
  { id: 'INV-2024-141', client: 'Linear Studio', amount: '$3,840', status: 'overdue', due: 'Sep 28' },
  { id: 'INV-2024-140', client: 'Umbrella', amount: '$10,310', status: 'pending', due: 'Oct 15' },
  { id: 'INV-2024-139', client: 'Globex', amount: '$7,520', status: 'paid', due: 'Sep 20' },
]

export default function FinanceDashboard() {
  return (
    <DashboardShell slug="finance" title="Finance" description="Cashflow, burn, runway, invoices — the standard finance dashboard.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard label="Cash" value="$276k" delta="+$36k" deltaDir="up" />
        <StatCard label="Burn (monthly)" value="$84k" delta="+$2k" deltaDir="down" />
        <StatCard label="Runway" value="17 mo" delta="-1 mo" deltaDir="down" />
        <StatCard label="MRR" value="$142k" delta="+$18k" deltaDir="up" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 20 }}>
        <Panel title="Cashflow — October" span={4}>
          <WaterfallChart data={cashflow} height={240} showValues />
        </Panel>
        <Panel title="Runway (months)" span={2}>
          <LineChart data={runway} height={240} curve="spline" yMin={14} yMax={26} yFormat={(n) => `${n}mo`} />
        </Panel>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
        <Panel title="Burn trend" span={3}>
          <LineChart data={burn} height={220} curve="spline" yMin={40} yMax={90} yFormat={(n) => `$${n}k`} />
        </Panel>
        <Panel title="Open invoices" action={<Badge tone="err" variant="soft">1 overdue</Badge>} span={3}>
          <Table variant="plain" density="cozy" style={{ width: '100%' }}>
            <Table.Header>
              <Table.Row>
                <Table.Column>Invoice</Table.Column>
                <Table.Column>Client</Table.Column>
                <Table.Column align="end">Amount</Table.Column>
                <Table.Column>Status</Table.Column>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {invoices.map((i) => (
                <Table.Row key={i.id}>
                  <Table.Cell style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{i.id}</Table.Cell>
                  <Table.Cell>{i.client}</Table.Cell>
                  <Table.Cell align="end" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{i.amount}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      tone={i.status === 'paid' ? 'ok' : i.status === 'overdue' ? 'err' : 'warn'}
                      variant="soft"
                    >
                      {i.status}
                    </Badge>
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
