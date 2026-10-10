import { useState } from 'react'
import { Avatar, Badge, Button, Input, Separator } from 'veloce-ui'
import { DashboardShell } from './DashboardShell'

interface Thread {
  id: string
  from: string
  subject: string
  preview: string
  time: string
  unread: boolean
  tag?: 'support' | 'billing' | 'bug' | 'feature'
  body: string
}

const THREADS: Thread[] = [
  { id: 't1', from: 'Grace Hopper', subject: 'Can you review the new DataGrid API?', preview: 'Pushed a draft that drops onSelectionChange in favor of…', time: '12 min', unread: true, tag: 'feature', body: 'Hey! I pushed a draft that drops onSelectionChange in favor of onSelectedIdsChange — matches the Set<string> pattern you already use in Tree + Combobox. Tests pass. WDYT?\n\nShould we deprecate the old signature with a console warning for one minor, or hard-break?' },
  { id: 't2', from: 'Alan Turing', subject: 'Billing: invoice INV-142 overdue reminder', preview: 'Just a heads up — Acme Corp hasn\'t paid INV-142 since…', time: '1 hr', unread: true, tag: 'billing', body: 'Just a heads up — Acme Corp hasn\'t paid INV-142 since Oct 1. I\'ve sent two automated reminders. Want me to escalate to a human follow-up?' },
  { id: 't3', from: 'Ada Lovelace', subject: 'Dark mode has a contrast issue in the Combobox popover', preview: 'The listbox background matches --bg-1 but the hover…', time: '3 hr', unread: false, tag: 'bug', body: 'The listbox background matches --bg-1 but the hover state is barely visible against it. Can we bump the hover to --bg-3 or add a 2px accent-tinted border?' },
  { id: 't4', from: 'Linus Torvalds', subject: 'Deployment pipeline question', preview: 'Noticed the GitHub Actions workflow doesn\'t cache…', time: 'Yesterday', unread: false, tag: 'support', body: 'Noticed the GitHub Actions workflow doesn\'t cache the pnpm store between runs. Saw ~2 min savings on a test branch when I added actions/cache. Want me to open a PR?' },
  { id: 't5', from: 'Margaret H.', subject: 'Slide deck for Q4 review — need final numbers by Friday', preview: 'Reaching out early so we don\'t do the usual Thursday night…', time: 'Yesterday', unread: false, body: 'Reaching out early so we don\'t do the usual Thursday night scramble. If you can send the MRR + churn + burn figures by EOD Friday I can get the deck locked by Monday morning.' },
  { id: 't6', from: 'Edsger D.', subject: 'Research notes: skip-list vs. B-tree for the DataGrid', preview: 'Did a quick benchmark on 1M rows. Skip-list wins on…', time: '2 days', unread: false, tag: 'feature', body: 'Did a quick benchmark on 1M rows. Skip-list wins on insert-heavy workloads, B-tree is better for range scans. Our workload is 95% read so I\'d lean B-tree. Writing it up.' },
  { id: 't7', from: 'Barbara L.', subject: 'Customer feedback roundup', preview: '47 responses this week — top request is still "export…', time: '3 days', unread: false, tag: 'support', body: '47 responses this week — top request is still "export to CSV" (14 mentions), then "dark mode is too bright on OLED" (9), then "please add keyboard shortcuts" (7).' },
]

const FOLDERS = [
  { id: 'inbox', label: 'Inbox', count: THREADS.filter((t) => t.unread).length },
  { id: 'starred', label: 'Starred', count: 3 },
  { id: 'sent', label: 'Sent', count: 0 },
  { id: 'drafts', label: 'Drafts', count: 2 },
  { id: 'archive', label: 'Archive', count: 0 },
  { id: 'spam', label: 'Spam', count: 0 },
  { id: 'trash', label: 'Trash', count: 0 },
]

const tagTone: Record<NonNullable<Thread['tag']>, 'accent' | 'warn' | 'err' | 'ok'> = {
  support: 'accent', billing: 'warn', bug: 'err', feature: 'ok',
}

export default function Inbox() {
  const [folder, setFolder] = useState('inbox')
  const [selectedId, setSelectedId] = useState<string>('t1')
  const [query, setQuery] = useState('')
  const [reply, setReply] = useState('')

  const filtered = THREADS.filter((t) => !query || t.subject.toLowerCase().includes(query.toLowerCase()) || t.from.toLowerCase().includes(query.toLowerCase()))
  const active = THREADS.find((t) => t.id === selectedId) ?? THREADS[0]

  return (
    <DashboardShell slug="inbox" title="Inbox" description="Three-pane list / detail layout using Avatar, Badge, Button, Input — no charts.">
      <div className="vl-inbox" style={{ display: 'grid', gridTemplateColumns: '220px 320px 1fr', gap: 0, border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-1)', overflow: 'hidden', minHeight: 600 }}>
        {/* Folder sidebar */}
        <aside style={{ borderRight: '1px solid var(--line)', padding: 12, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button variant="primary" size="sm" style={{ marginBottom: 10 }}>Compose</Button>
          {FOLDERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFolder(f.id)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '7px 10px', border: 'none', borderRadius: 7, cursor: 'pointer',
                background: folder === f.id ? 'var(--bg-3)' : 'transparent',
                color: folder === f.id ? 'var(--fg)' : 'var(--fg-2)',
                fontSize: 13, fontFamily: 'inherit', textAlign: 'left',
              }}
            >
              <span>{f.label}</span>
              {f.count > 0 && <Badge tone={f.id === 'inbox' ? 'accent' : 'neutral'} variant="soft">{f.count}</Badge>}
            </button>
          ))}
          <Separator style={{ margin: '12px 0' }} />
          <div style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '4px 10px 2px' }}>Labels</div>
          {[
            { label: 'Support', color: 'var(--ac)' },
            { label: 'Billing', color: 'var(--warn)' },
            { label: 'Bugs', color: 'var(--err)' },
            { label: 'Features', color: 'var(--ok)' },
          ].map((l) => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', fontSize: 13, color: 'var(--fg-2)' }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: l.color }} />
              {l.label}
            </div>
          ))}
        </aside>

        {/* Thread list */}
        <section style={{ borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ padding: 12, borderBottom: '1px solid var(--line)' }}>
            <Input size="sm" placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} style={{ width: '100%' }} />
          </div>
          <div style={{ overflow: 'auto', flex: 1 }}>
            {filtered.map((t) => {
              const isActive = t.id === active.id
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '12px 11px 12px 14px',
                    background: isActive ? 'var(--bg-2)' : 'transparent',
                    borderTop: 'none', borderRight: 'none',
                    borderBottom: '1px solid var(--line)',
                    borderLeft: isActive ? '3px solid var(--ac)' : '3px solid transparent',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: t.unread ? 600 : 500, color: 'var(--fg)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.from}
                    </span>
                    {t.unread && <span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--ac)' }} />}
                    <span style={{ fontSize: 11, color: 'var(--fg-3)' }}>{t.time}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--fg)', fontWeight: t.unread ? 500 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>
                    {t.subject}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--fg-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.preview}
                  </div>
                  {t.tag && <Badge tone={tagTone[t.tag]} variant="soft" style={{ marginTop: 6, fontSize: 10 }}>{t.tag}</Badge>}
                </button>
              )
            })}
          </div>
        </section>

        {/* Detail pane */}
        <section style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <header style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar size="md" name={active.from} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{active.subject}</h2>
              <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>From <strong style={{ color: 'var(--fg-2)' }}>{active.from}</strong> · {active.time} ago</div>
            </div>
            <Button size="sm" variant="ghost">Archive</Button>
            <Button size="sm" variant="ghost">Delete</Button>
          </header>

          <article style={{ padding: 20, flex: 1, overflow: 'auto', fontSize: 14, lineHeight: 1.65, color: 'var(--fg-2)', whiteSpace: 'pre-wrap' }}>
            {active.body}
          </article>

          <footer style={{ borderTop: '1px solid var(--line)', padding: 14, background: 'var(--bg-2)' }}>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder={`Reply to ${active.from}…`}
              rows={3}
              style={{
                width: '100%', resize: 'vertical', padding: 10, borderRadius: 8,
                border: '1px solid var(--line-2)', background: 'var(--bg-1)',
                color: 'var(--fg)', fontFamily: 'inherit', fontSize: 13, outline: 'none',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>⌘↩ to send</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button size="sm" variant="ghost">Save draft</Button>
                <Button size="sm" variant="primary" disabled={!reply.trim()}>Send</Button>
              </div>
            </div>
          </footer>
        </section>
      </div>
    </DashboardShell>
  )
}
