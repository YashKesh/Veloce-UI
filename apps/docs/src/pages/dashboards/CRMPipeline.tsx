import { useState } from 'react'
import { Avatar, Badge, Button, Input } from 'veloce-ui'
import { DashboardShell, StatCard } from './DashboardShell'

type Stage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won'

interface Deal {
  id: string
  company: string
  contact: string
  value: number
  stage: Stage
  owner: string
  updated: string
  priority: 'low' | 'med' | 'high'
}

const SEED: Deal[] = [
  { id: 'd1', company: 'Acme Corp',       contact: 'Jim Halpert',    value: 48000, stage: 'lead',        owner: 'Ada',   updated: '2h',   priority: 'med' },
  { id: 'd2', company: 'Umbrella',        contact: 'Alice Wesker',   value: 125000, stage: 'qualified',  owner: 'Alan',  updated: '1d',   priority: 'high' },
  { id: 'd3', company: 'Globex',          contact: 'Hank Scorpio',   value: 32000, stage: 'proposal',    owner: 'Grace', updated: '4h',   priority: 'med' },
  { id: 'd4', company: 'Soylent',         contact: 'Thorn',          value: 18000, stage: 'lead',        owner: 'Ada',   updated: '12h',  priority: 'low' },
  { id: 'd5', company: 'Initech',         contact: 'Bill Lumbergh',  value: 76000, stage: 'negotiation', owner: 'Alan',  updated: '2h',   priority: 'high' },
  { id: 'd6', company: 'Wonka',           contact: 'Willy Wonka',    value: 24000, stage: 'proposal',    owner: 'Grace', updated: '3d',   priority: 'low' },
  { id: 'd7', company: 'Cyberdyne',       contact: 'Miles Dyson',    value: 210000, stage: 'won',        owner: 'Ada',   updated: '5h',   priority: 'high' },
  { id: 'd8', company: 'Weyland-Yutani',  contact: 'Carter Burke',   value: 155000, stage: 'qualified',  owner: 'Alan',  updated: '2d',   priority: 'high' },
  { id: 'd9', company: 'Tyrell',          contact: 'Eldon Tyrell',   value: 92000, stage: 'negotiation', owner: 'Grace', updated: '6h',   priority: 'med' },
  { id: 'd10', company: 'Oscorp',         contact: 'Norman Osborn',  value: 45000, stage: 'won',         owner: 'Ada',   updated: '1d',   priority: 'med' },
  { id: 'd11', company: 'Stark Industries', contact: 'Pepper Potts', value: 320000, stage: 'proposal',   owner: 'Alan',  updated: '45m',  priority: 'high' },
  { id: 'd12', company: 'Massive Dynamic', contact: 'Nina Sharp',    value: 68000, stage: 'lead',        owner: 'Grace', updated: '4h',   priority: 'low' },
]

const STAGES: { id: Stage; label: string; tone: 'neutral' | 'accent' | 'warn' | 'ok' }[] = [
  { id: 'lead',        label: 'Lead',        tone: 'neutral' },
  { id: 'qualified',   label: 'Qualified',   tone: 'accent' },
  { id: 'proposal',    label: 'Proposal',    tone: 'accent' },
  { id: 'negotiation', label: 'Negotiation', tone: 'warn' },
  { id: 'won',         label: 'Won',         tone: 'ok' },
]

const prioTone: Record<Deal['priority'], 'neutral' | 'warn' | 'err'> = { low: 'neutral', med: 'warn', high: 'err' }

const fmt = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`

export default function CRMPipeline() {
  const [query, setQuery] = useState('')

  const rows = SEED.filter((d) => !query || d.company.toLowerCase().includes(query.toLowerCase()) || d.contact.toLowerCase().includes(query.toLowerCase()))

  const totals = STAGES.map((s) => ({
    ...s,
    deals: rows.filter((r) => r.stage === s.id),
    sum: rows.filter((r) => r.stage === s.id).reduce((a, b) => a + b.value, 0),
  }))

  const totalPipeline = rows.reduce((a, b) => a + b.value, 0)
  const wonSum = rows.filter((r) => r.stage === 'won').reduce((a, b) => a + b.value, 0)

  return (
    <DashboardShell slug="crm-pipeline" title="CRM · Pipeline" description="Sales pipeline Kanban — drag-and-drop ready, built from Avatar, Badge, Button, Input.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard label="Open pipeline" value={fmt(totalPipeline - wonSum)} delta="+$42k this week" deltaDir="up" />
        <StatCard label="Won YTD"       value={fmt(wonSum)}                 delta="+18%"              deltaDir="up" />
        <StatCard label="Deals"         value={String(rows.length)}         delta="3 new today"       deltaDir="flat" />
        <StatCard label="Avg deal size" value={fmt(Math.round(totalPipeline / rows.length))} delta="+$3.2k"       deltaDir="up" />
      </div>

      <div style={{ border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-1)', padding: 14, marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <Input size="sm" placeholder="Search deals, contacts…" value={query} onChange={(e) => setQuery(e.target.value)} style={{ flex: 1, minWidth: 240, maxWidth: 400 }} />
        <Button variant="primary" size="sm">New deal</Button>
      </div>

      <div className="vl-kanban" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, alignItems: 'start' }}>
        {totals.map((col) => (
          <div key={col.id} style={{ border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg-1)', minHeight: 400, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Badge tone={col.tone} variant="soft">{col.label}</Badge>
                <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>{col.deals.length}</span>
              </div>
              <span style={{ fontSize: 12, color: 'var(--fg-2)', fontFamily: 'var(--font-mono)' }}>{fmt(col.sum)}</span>
            </div>
            <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
              {col.deals.map((d) => (
                <div key={d.id} style={{ padding: 12, border: '1px solid var(--line)', borderRadius: 8, background: 'var(--bg)', cursor: 'grab', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fg)' }}>{d.company}</div>
                    <Badge tone={prioTone[d.priority]} variant="soft" style={{ fontSize: 10 }}>{d.priority}</Badge>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>{d.contact}</div>
                  <div style={{ fontSize: 15, fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--fg)' }}>{fmt(d.value)}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Avatar size="sm" name={d.owner} />
                      <span style={{ fontSize: 11.5, color: 'var(--fg-3)' }}>{d.owner}</span>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--fg-3)' }}>{d.updated} ago</span>
                  </div>
                </div>
              ))}
              {col.deals.length === 0 && <div style={{ fontSize: 12, color: 'var(--fg-3)', padding: 10, textAlign: 'center' }}>No deals</div>}
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  )
}
