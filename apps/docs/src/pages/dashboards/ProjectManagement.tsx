import { GanttChart, BarChart, Badge, Avatar } from 'veloce-ui'
import { DashboardShell, StatCard, Panel } from './DashboardShell'

const sprint = [
  { label: 'Design review',   start: 0,  end: 4 },                       // 0
  { label: 'API scaffolding', start: 2,  end: 7,  dependsOn: [0] },      // 1 — needs design
  { label: 'Frontend impl',   start: 5,  end: 12, dependsOn: [0, 1] },   // 2 — needs design + API
  { label: 'QA testing',      start: 10, end: 14, dependsOn: [2] },      // 3 — after frontend
  { label: 'Launch prep',     start: 13, end: 15, dependsOn: [3] },      // 4 — after QA
]

const velocity = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'].map((label, i) => ({ label, value: [28, 32, 30, 36, 42, 38, 44, 46][i] }))

const columns = [
  { title: 'Backlog', count: 24, color: 'var(--fg-3)', tickets: [
    { id: 'VEL-124', title: 'Dark mode token audit', assignee: 'Mara K.', priority: 'low' },
    { id: 'VEL-123', title: 'Add CSV export to DataGrid', assignee: 'Alex C.', priority: 'medium' },
  ] },
  { title: 'In progress', count: 8, color: 'var(--warn)', tickets: [
    { id: 'VEL-118', title: 'Keyboard nav for Combobox', assignee: 'Rina P.', priority: 'high' },
    { id: 'VEL-117', title: 'Fix Dialog focus trap on nested', assignee: 'Jonas L.', priority: 'high' },
    { id: 'VEL-116', title: 'Chart tooltip edge-of-viewport flip', assignee: 'Mara K.', priority: 'medium' },
  ] },
  { title: 'Review', count: 4, color: 'var(--ac-text)', tickets: [
    { id: 'VEL-112', title: 'Marketing blocks docs', assignee: 'Alex C.', priority: 'medium' },
    { id: 'VEL-110', title: 'AI primitives test coverage', assignee: 'Rina P.', priority: 'high' },
  ] },
  { title: 'Done', count: 16, color: 'var(--ok)', tickets: [
    { id: 'VEL-108', title: 'Ship DatePicker', assignee: 'Jonas L.', priority: 'high' },
    { id: 'VEL-105', title: 'Customization doc page', assignee: 'Mara K.', priority: 'medium' },
  ] },
]

export default function ProjectManagementDashboard() {
  return (
    <DashboardShell slug="project-management" title="Project management" description="Sprint gantt, velocity, kanban board, backlog — the standard team dashboard.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard label="Sprint velocity" value="46 pts" delta="+2" deltaDir="up" />
        <StatCard label="In progress" value="8" delta="2 blocked" deltaDir="flat" />
        <StatCard label="Overdue" value="3" delta="-1" deltaDir="up" />
        <StatCard label="Cycle time (p50)" value="4.2d" delta="-0.3d" deltaDir="up" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 20 }}>
        <Panel title="Sprint timeline" action={<Badge tone="accent" variant="soft">Sprint 9 · day 8/15</Badge>} span={4}>
          <GanttChart
            tasks={sprint}
            today={8}
            height={240}
            labels={['D0', 'D3', 'D6', 'D9', 'D12', 'D15']}
          />
        </Panel>
        <Panel title="Velocity (8 sprints)" span={2}>
          <BarChart data={velocity} height={240} yFormat={(n) => `${n}p`} />
        </Panel>
      </div>

      <Panel title="Current sprint">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {columns.map((col) => (
            <div key={col.title} style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 12, borderRadius: 10, background: 'var(--bg-2)', minHeight: 240 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: col.color, fontWeight: 500 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: col.color }} />
                {col.title}
                <span style={{ marginLeft: 'auto', color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>{col.count}</span>
              </div>
              {col.tickets.map((t) => (
                <div key={t.id} style={{ padding: 10, borderRadius: 8, background: 'var(--bg-1)', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-3)' }}>
                    <span>{t.id}</span>
                    <span style={{ color: t.priority === 'high' ? 'var(--err)' : t.priority === 'medium' ? 'var(--warn)' : 'var(--fg-3)' }}>{t.priority}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--fg)', lineHeight: 1.4 }}>{t.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <Avatar name={t.assignee} size={18} />
                    <span style={{ fontSize: 11.5, color: 'var(--fg-3)' }}>{t.assignee}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Panel>
    </DashboardShell>
  )
}
