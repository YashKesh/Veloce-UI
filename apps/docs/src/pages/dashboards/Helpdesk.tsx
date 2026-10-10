import { useMemo, useState } from 'react'
import { DataGrid, Avatar, Badge, Button, Input, Select, Progress } from 'veloce-ui'
import { DashboardShell, StatCard } from './DashboardShell'

type Priority = 'low' | 'med' | 'high' | 'urgent'
type Status = 'open' | 'pending' | 'resolved' | 'closed'

interface Ticket {
  id: string
  subject: string
  requester: string
  assignee: string
  priority: Priority
  status: Status
  category: string
  slaRemaining: number // minutes
  updated: string
}

const SEED: Ticket[] = [
  { id: 'T-4821', subject: 'Can\'t import CSV with special characters',  requester: 'alice@acme.io',    assignee: 'Ada',   priority: 'high',   status: 'open',     category: 'Import',   slaRemaining: 85,  updated: '12m' },
  { id: 'T-4820', subject: 'Billing: double-charged for October',        requester: 'bob@globex.com',   assignee: 'Alan',  priority: 'urgent', status: 'open',     category: 'Billing',  slaRemaining: 24,  updated: '32m' },
  { id: 'T-4819', subject: 'How do I add a second workspace?',           requester: 'carla@tyrell.co',  assignee: 'Grace', priority: 'low',    status: 'pending',  category: 'Account',  slaRemaining: 480, updated: '1h' },
  { id: 'T-4818', subject: 'API rate limit seems lower than documented', requester: 'dave@wonka.com',   assignee: 'Ada',   priority: 'med',    status: 'open',     category: 'API',      slaRemaining: 240, updated: '2h' },
  { id: 'T-4817', subject: 'Dark mode flicker in Safari',                requester: 'elena@initech.co', assignee: 'Grace', priority: 'low',    status: 'pending',  category: 'UI',       slaRemaining: 1200, updated: '3h' },
  { id: 'T-4816', subject: 'SSO redirect loop with Okta',                requester: 'frank@stark.co',   assignee: 'Alan',  priority: 'urgent', status: 'open',     category: 'Auth',     slaRemaining: 60,  updated: '45m' },
  { id: 'T-4815', subject: 'Request: export invoices to QuickBooks',     requester: 'gina@oscorp.com',  assignee: '—',     priority: 'med',    status: 'open',     category: 'Feature',  slaRemaining: 2400, updated: '5h' },
  { id: 'T-4814', subject: 'Deleted project — can you restore?',         requester: 'henry@acme.io',    assignee: 'Ada',   priority: 'high',   status: 'resolved', category: 'Data',     slaRemaining: 0,   updated: 'Yesterday' },
  { id: 'T-4813', subject: 'Need Enterprise quote for 500 seats',        requester: 'ivy@massive.co',   assignee: 'Alan',  priority: 'high',   status: 'resolved', category: 'Sales',    slaRemaining: 0,   updated: 'Yesterday' },
  { id: 'T-4812', subject: 'Typo in onboarding checklist',               requester: 'jack@wonka.com',   assignee: 'Grace', priority: 'low',    status: 'closed',   category: 'Docs',     slaRemaining: 0,   updated: '2d' },
]

const AGENTS = ['Ada', 'Alan', 'Grace']

const prioTone: Record<Priority, 'neutral' | 'warn' | 'err' | 'accent'> = { low: 'neutral', med: 'accent', high: 'warn', urgent: 'err' }
const statusTone: Record<Status, 'accent' | 'warn' | 'ok' | 'neutral'> = { open: 'accent', pending: 'warn', resolved: 'ok', closed: 'neutral' }

const PRIO_OPTIONS = [
  { value: '', label: 'All priorities' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'med', label: 'Medium' },
  { value: 'low', label: 'Low' },
]
const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'open', label: 'Open' },
  { value: 'pending', label: 'Pending' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
]

function slaBadge(mins: number, status: Status): React.ReactNode {
  if (status === 'resolved' || status === 'closed') return <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>—</span>
  if (mins <= 60) return <Badge tone="err" variant="soft">{mins}m</Badge>
  if (mins <= 240) return <Badge tone="warn" variant="soft">{Math.round(mins / 60)}h</Badge>
  return <Badge tone="ok" variant="soft">{Math.round(mins / 60)}h</Badge>
}

export default function Helpdesk() {
  const [query, setQuery] = useState('')
  const [prio, setPrio] = useState('')
  const [status, setStatus] = useState('')
  const [sel, setSel] = useState<Set<string>>(new Set())
  const [sortKey, setSortKey] = useState('priority')
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>('desc')

  const filtered = useMemo(() => SEED.filter((t) => {
    if (prio && t.priority !== prio) return false
    if (status && t.status !== status) return false
    if (!query) return true
    const q = query.toLowerCase()
    return t.subject.toLowerCase().includes(q) || t.requester.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
  }), [query, prio, status])

  const stats = useMemo(() => ({
    open: SEED.filter((t) => t.status === 'open').length,
    urgent: SEED.filter((t) => t.status === 'open' && t.priority === 'urgent').length,
    breach: SEED.filter((t) => t.status === 'open' && t.slaRemaining <= 60).length,
    resolved: SEED.filter((t) => t.status === 'resolved').length,
  }), [])

  const agentLoad = AGENTS.map((a) => ({
    name: a,
    open: SEED.filter((t) => t.assignee === a && (t.status === 'open' || t.status === 'pending')).length,
    resolved: SEED.filter((t) => t.assignee === a && t.status === 'resolved').length,
  }))

  return (
    <DashboardShell slug="helpdesk" title="Helpdesk" description="Ticket queue with SLA tracking, agent workload, filters — built on DataGrid, Badge, Progress.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard label="Open tickets"    value={String(stats.open)}     delta="+2 since yesterday" deltaDir="down" />
        <StatCard label="Urgent"          value={String(stats.urgent)}   delta="2 SLA risk"         deltaDir="down" />
        <StatCard label="SLA breaching"   value={String(stats.breach)}   delta="<1h left"           deltaDir="down" />
        <StatCard label="Resolved today"  value={String(stats.resolved)} delta="+5"                 deltaDir="up" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
        <div style={{ border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-1)', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <Input size="sm" placeholder="Search tickets…" value={query} onChange={(e) => setQuery(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
            <Select size="sm" value={prio} onValueChange={setPrio} options={PRIO_OPTIONS} style={{ width: 150 }} />
            <Select size="sm" value={status} onValueChange={setStatus} options={STATUS_OPTIONS} style={{ width: 150 }} />
            {sel.size > 0 && <Button size="sm" variant="ghost">Assign {sel.size}</Button>}
          </div>

          <DataGrid<Ticket>
            rows={filtered}
            rowKey={(r) => r.id}
            selectable
            selectedIds={sel}
            onSelectedIdsChange={setSel}
            sortKey={sortKey}
            sortDir={sortDir}
            onSortChange={(k, d) => { setSortKey(k); setSortDir(d) }}
            columns={[
              { key: 'id', header: 'ID', render: (r) => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-2)' }}>{r.id}</span> },
              { key: 'subject', header: 'Subject', sortable: true,
                render: (r) => (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 13, color: 'var(--fg)' }}>{r.subject}</span>
                    <span style={{ fontSize: 11.5, color: 'var(--fg-3)' }}>{r.requester} · {r.category}</span>
                  </div>
                )},
              { key: 'assignee', header: 'Agent', sortable: true,
                render: (r) => r.assignee === '—'
                  ? <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>unassigned</span>
                  : <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Avatar size="sm" name={r.assignee} /><span style={{ fontSize: 12.5 }}>{r.assignee}</span></div>
              },
              { key: 'priority', header: 'Priority', sortable: true, render: (r) => <Badge tone={prioTone[r.priority]} variant="soft">{r.priority}</Badge> },
              { key: 'status',   header: 'Status',   sortable: true, render: (r) => <Badge tone={statusTone[r.status]} variant="soft">{r.status}</Badge> },
              { key: 'slaRemaining', header: 'SLA', align: 'end', sortable: true, render: (r) => slaBadge(r.slaRemaining, r.status) },
              { key: 'updated', header: 'Updated', align: 'end', render: (r) => <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>{r.updated}</span> },
            ]}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-1)', padding: 16 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 13.5, fontWeight: 600, color: 'var(--fg)' }}>Agent workload</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {agentLoad.map((a) => {
                const total = a.open + a.resolved
                const pct = total === 0 ? 0 : (a.open / total) * 100
                return (
                  <div key={a.name}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Avatar size="sm" name={a.name} />
                        <span style={{ fontSize: 13 }}>{a.name}</span>
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>{a.open} open</span>
                    </div>
                    <Progress value={pct} />
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-1)', padding: 16 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 13.5, fontWeight: 600, color: 'var(--fg)' }}>Today</h3>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { t: 'Avg. first response', v: '14 min' },
                { t: 'Avg. resolution', v: '3h 22m' },
                { t: 'CSAT (7d)', v: '94%' },
                { t: 'Backlog change', v: '+3' },
              ].map((it) => (
                <li key={it.t} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--fg-3)' }}>{it.t}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg)' }}>{it.v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
