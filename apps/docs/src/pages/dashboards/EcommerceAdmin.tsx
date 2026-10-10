import { AreaChart, PieChart, Table, Badge, Avatar, Progress, Button } from 'veloce-ui'
import { DashboardShell, StatCard, Panel } from './DashboardShell'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const revenue = MONTHS.map((label, i) => ({ label, value: [28, 32, 34, 42, 48, 56, 62, 74, 82, 98, 124, 142][i] * 1000 }))

const categories = [
  { label: 'Apparel', value: 42 },
  { label: 'Electronics', value: 28 },
  { label: 'Home', value: 18 },
  { label: 'Beauty', value: 8 },
  { label: 'Other', value: 4 },
]

const orders = [
  { id: '#4821', customer: 'Mara K.', items: 3, total: '$184.20', status: 'shipped' },
  { id: '#4820', customer: 'Alex C.', items: 1, total: '$42.00', status: 'processing' },
  { id: '#4819', customer: 'Rina P.', items: 5, total: '$312.80', status: 'shipped' },
  { id: '#4818', customer: 'Jonas L.', items: 2, total: '$98.50', status: 'pending' },
  { id: '#4817', customer: 'Priya R.', items: 4, total: '$256.00', status: 'cancelled' },
  { id: '#4816', customer: 'Mike S.', items: 1, total: '$24.00', status: 'shipped' },
]

const inventory = [
  { sku: 'TEE-001', name: 'Signature Tee', stock: 128, threshold: 50, pct: 85 },
  { sku: 'HOD-002', name: 'Logo Hoodie', stock: 32, threshold: 50, pct: 21 },
  { sku: 'CAP-003', name: 'Dad Cap', stock: 8, threshold: 25, pct: 11 },
  { sku: 'BAG-004', name: 'Tote Bag', stock: 64, threshold: 50, pct: 48 },
]

export default function EcommerceAdminDashboard() {
  return (
    <DashboardShell slug="ecommerce-admin" title="E-commerce admin" description="Revenue, orders, inventory alerts, category mix — the standard store admin dashboard.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard label="Revenue (30d)" value="$142k" delta="+18%" deltaDir="up" />
        <StatCard label="Orders" value="2,842" delta="+124" deltaDir="up" />
        <StatCard label="AOV" value="$50.14" delta="-$1.20" deltaDir="down" />
        <StatCard label="Conversion" value="3.4%" delta="+0.3pt" deltaDir="up" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 20 }}>
        <Panel title="Revenue" action={<Badge tone="ok" variant="soft">Trending up</Badge>} span={4}>
          <AreaChart data={revenue} height={240} smooth yFormat={(n) => `$${Math.round(n / 1000)}k`} />
        </Panel>
        <Panel title="Category mix" span={2}>
          <PieChart data={categories} size={220} innerRadius={60} centerLabel="100%" centerSublabel="total" />
        </Panel>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
        <Panel title="Recent orders" action={<Button size="sm" variant="ghost">View all</Button>} span={4}>
          <Table variant="striped" density="cozy" hoverable style={{ width: '100%' }}>
            <Table.Header>
              <Table.Row>
                <Table.Column>Order</Table.Column>
                <Table.Column>Customer</Table.Column>
                <Table.Column align="end">Items</Table.Column>
                <Table.Column align="end">Total</Table.Column>
                <Table.Column>Status</Table.Column>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {orders.map((o) => (
                <Table.Row key={o.id}>
                  <Table.Cell style={{ fontFamily: 'var(--font-mono)' }}>{o.id}</Table.Cell>
                  <Table.Cell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar name={o.customer} size={24} />
                      {o.customer}
                    </div>
                  </Table.Cell>
                  <Table.Cell align="end">{o.items}</Table.Cell>
                  <Table.Cell align="end" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{o.total}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      tone={o.status === 'shipped' ? 'ok' : o.status === 'cancelled' ? 'err' : o.status === 'pending' ? 'warn' : 'accent'}
                      variant="soft"
                    >
                      {o.status}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Panel>
        <Panel title="Inventory alerts" action={<Badge tone="warn" variant="soft">2 low</Badge>} span={2}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {inventory.map((i) => (
              <div key={i.sku} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ fontWeight: 500 }}>{i.name}</span>
                  <span style={{ color: i.pct < 25 ? 'var(--err)' : i.pct < 50 ? 'var(--warn)' : 'var(--ok)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                    {i.stock}
                  </span>
                </div>
                <Progress value={i.pct} max={100} style={{ ['--vl-progress-fill' as string]: i.pct < 25 ? 'var(--err)' : i.pct < 50 ? 'var(--warn)' : 'var(--ok)' }} />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  )
}
