import { useMemo, useState } from 'react'
import {
  DataGrid, Avatar, Badge, Button, Input, Select, Dialog, Form,
  DropdownMenu, Checkbox, EmptyState,
} from 'veloce-ui'
import { DashboardShell, StatCard } from './DashboardShell'

type Role = 'admin' | 'editor' | 'viewer'
type Status = 'active' | 'invited' | 'suspended'

interface User {
  id: string
  name: string
  email: string
  role: Role
  status: Status
  team: string
  lastSeen: string
}

const SEED: User[] = [
  { id: 'u1', name: 'Ada Lovelace',    email: 'ada@veloce.dev',      role: 'admin',  status: 'active',    team: 'Engineering', lastSeen: '2 min ago' },
  { id: 'u2', name: 'Alan Turing',     email: 'alan@veloce.dev',     role: 'admin',  status: 'active',    team: 'Engineering', lastSeen: '14 min ago' },
  { id: 'u3', name: 'Grace Hopper',    email: 'grace@veloce.dev',    role: 'editor', status: 'active',    team: 'Design',      lastSeen: '1 hr ago' },
  { id: 'u4', name: 'Linus Torvalds',  email: 'linus@veloce.dev',    role: 'editor', status: 'suspended', team: 'Infra',       lastSeen: '3 days ago' },
  { id: 'u5', name: 'Margaret H.',     email: 'margaret@veloce.dev', role: 'viewer', status: 'active',    team: 'Marketing',   lastSeen: '12 min ago' },
  { id: 'u6', name: 'Edsger D.',       email: 'edsger@veloce.dev',   role: 'editor', status: 'invited',   team: 'Research',    lastSeen: '—' },
  { id: 'u7', name: 'Barbara L.',      email: 'barbara@veloce.dev',  role: 'viewer', status: 'active',    team: 'Support',     lastSeen: '45 min ago' },
  { id: 'u8', name: 'Donald K.',       email: 'donald@veloce.dev',   role: 'admin',  status: 'active',    team: 'Engineering', lastSeen: 'just now' },
  { id: 'u9', name: 'Katherine J.',    email: 'kat@veloce.dev',      role: 'viewer', status: 'invited',   team: 'Design',      lastSeen: '—' },
  { id: 'u10', name: 'Ken Thompson',   email: 'ken@veloce.dev',      role: 'editor', status: 'active',    team: 'Infra',       lastSeen: '6 hr ago' },
]

const roleTone: Record<Role, 'accent' | 'warn' | 'neutral'> = { admin: 'accent', editor: 'warn', viewer: 'neutral' }
const statusTone: Record<Status, 'ok' | 'warn' | 'err'> = { active: 'ok', invited: 'warn', suspended: 'err' }

const ROLE_OPTIONS = [
  { value: '', label: 'All roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
]

const TEAM_OPTIONS = ['Engineering', 'Design', 'Infra', 'Marketing', 'Research', 'Support'].map((t) => ({ value: t, label: t }))
const INVITE_ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
]

export default function AdminUsers() {
  const [rows, setRows] = useState<User[]>(SEED)
  const [quick, setQuick] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [sel, setSel] = useState<Set<string>>(new Set())
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>('asc')
  const [open, setOpen] = useState(false)

  const filtered = useMemo(() => rows.filter((r) => {
    if (roleFilter && r.role !== roleFilter) return false
    if (!quick) return true
    const q = quick.toLowerCase()
    return r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.team.toLowerCase().includes(q)
  }), [rows, quick, roleFilter])

  const stats = useMemo(() => ({
    total: rows.length,
    active: rows.filter((r) => r.status === 'active').length,
    invited: rows.filter((r) => r.status === 'invited').length,
    admins: rows.filter((r) => r.role === 'admin').length,
  }), [rows])

  return (
    <DashboardShell slug="admin-users" title="Admin · Users" description="User management with DataGrid, filters, Dialog add-user, and bulk actions.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard label="Total members" value={String(stats.total)} delta="+3 this week" deltaDir="up" />
        <StatCard label="Active" value={String(stats.active)} delta={`${Math.round(stats.active / stats.total * 100)}%`} deltaDir="flat" />
        <StatCard label="Pending invites" value={String(stats.invited)} delta="2 expiring" deltaDir="down" />
        <StatCard label="Admins" value={String(stats.admins)} delta="2 of 3 seats" deltaDir="flat" />
      </div>

      <div style={{ border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-1)', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1, minWidth: 240 }}>
            <Input
              size="sm"
              placeholder="Search by name, email, team…"
              value={quick}
              onChange={(e) => setQuick(e.target.value)}
              style={{ minWidth: 240, flex: 1, maxWidth: 360 }}
            />
            <Select size="sm" value={roleFilter} onValueChange={setRoleFilter} options={ROLE_OPTIONS} style={{ width: 140 }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {sel.size > 0 && (
              <DropdownMenu>
                <DropdownMenu.Trigger>
                  <Button variant="ghost" size="sm">{sel.size} selected ▾</Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item onSelect={() => alert(`Reset ${sel.size} passwords`)}>Reset passwords</DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={() => {
                    setRows((prev) => prev.map((r) => sel.has(r.id) ? { ...r, status: 'suspended' } : r))
                    setSel(new Set())
                  }}>Suspend</DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item onSelect={() => {
                    setRows((prev) => prev.filter((r) => !sel.has(r.id)))
                    setSel(new Set())
                  }} style={{ color: 'var(--err)' }}>Delete</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
            )}
            <Button variant="primary" size="sm" onClick={() => setOpen(true)}>Invite member</Button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No matches"
            description="Try clearing the filters or search for someone else."
            action={<Button size="sm" variant="ghost" onClick={() => { setQuick(''); setRoleFilter('') }}>Clear filters</Button>}
          />
        ) : (
          <DataGrid<User>
            rows={filtered}
            rowKey={(r) => r.id}
            selectable
            selectedIds={sel}
            onSelectedIdsChange={setSel}
            sortKey={sortKey}
            sortDir={sortDir}
            onSortChange={(k, d) => { setSortKey(k); setSortDir(d) }}
            columns={[
              {
                key: 'name', header: 'Member', sortable: true,
                render: (r) => (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar size="sm" name={r.name} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)' }}>{r.name}</span>
                      <span style={{ fontSize: 11.5, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>{r.email}</span>
                    </div>
                  </div>
                ),
              },
              { key: 'team', header: 'Team', sortable: true },
              { key: 'role', header: 'Role', sortable: true, render: (r) => <Badge tone={roleTone[r.role]} variant="soft">{r.role}</Badge> },
              { key: 'status', header: 'Status', sortable: true, render: (r) => <Badge tone={statusTone[r.status]} variant="soft">{r.status}</Badge> },
              { key: 'lastSeen', header: 'Last seen', align: 'end', render: (r) => <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>{r.lastSeen}</span> },
            ]}
          />
        )}
      </div>

      <InviteDialog
        open={open}
        onClose={() => setOpen(false)}
        onInvite={(u) => { setRows((prev) => [{ ...u, id: `u${prev.length + 1}`, lastSeen: '—', status: 'invited' }, ...prev]); setOpen(false) }}
      />
    </DashboardShell>
  )
}

function InviteDialog({ open, onClose, onInvite }: { open: boolean; onClose: () => void; onInvite: (u: Omit<User, 'id' | 'lastSeen' | 'status'>) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [team, setTeam] = useState('Engineering')
  const [role, setRole] = useState<Role>('viewer')
  const [notify, setNotify] = useState(true)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email) return
    onInvite({ name, email, team, role })
    setName(''); setEmail(''); setTeam('Engineering'); setRole('viewer'); setNotify(true)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title="Invite member"
      description="Send an invite email to a new teammate."
    >
      <Form onSubmit={submit}>
        <Form.Field>
          <Form.Label>Full name</Form.Label>
          <Form.Control>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" />
          </Form.Control>
        </Form.Field>
        <Form.Field>
          <Form.Label>Email</Form.Label>
          <Form.Control>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ada@company.com" />
          </Form.Control>
        </Form.Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Form.Field>
            <Form.Label>Team</Form.Label>
            <Form.Control>
              <Select value={team} onValueChange={setTeam} options={TEAM_OPTIONS} />
            </Form.Control>
          </Form.Field>
          <Form.Field>
            <Form.Label>Role</Form.Label>
            <Form.Control>
              <Select value={role} onValueChange={(v) => setRole(v as Role)} options={INVITE_ROLE_OPTIONS} />
            </Form.Control>
          </Form.Field>
        </div>
        <Checkbox
          checked={notify}
          onCheckedChange={(v) => setNotify(!!v)}
          label="Send welcome email"
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Send invite</Button>
        </div>
      </Form>
    </Dialog>
  )
}
