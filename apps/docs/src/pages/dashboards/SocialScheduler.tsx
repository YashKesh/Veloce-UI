import { useState } from 'react'
import { Avatar, Badge, Button, Tabs } from 'veloce-ui'
import { DashboardShell, StatCard } from './DashboardShell'

type Platform = 'x' | 'linkedin' | 'instagram' | 'youtube'

interface Post {
  id: string
  content: string
  platforms: Platform[]
  scheduled: string
  status: 'scheduled' | 'draft' | 'published' | 'failed'
  engagement?: { likes: number; replies: number; reposts: number }
}

const PLATFORM_LABEL: Record<Platform, string> = { x: 'X', linkedin: 'LinkedIn', instagram: 'Instagram', youtube: 'YouTube' }
const PLATFORM_COLOR: Record<Platform, string> = { x: 'var(--fg)', linkedin: '#0a66c2', instagram: '#e4405f', youtube: '#ff0000' }

const POSTS: Post[] = [
  { id: 'p1', content: 'Just shipped v2.0 with 40 new chart types and a brand new dashboard gallery. Takes 60 seconds to install. 👇', platforms: ['x', 'linkedin'], scheduled: 'Today, 2:30 PM', status: 'scheduled' },
  { id: 'p2', content: 'What are the three dashboards you build on every new project? Reply below — I\'m putting together templates.', platforms: ['x'], scheduled: 'Today, 5:00 PM', status: 'scheduled' },
  { id: 'p3', content: 'Finally wrote up our zero-runtime animation approach. tl;dr: CSS keyframes beat JS animation libraries 9 times out of 10.', platforms: ['x', 'linkedin'], scheduled: 'Tomorrow, 9:00 AM', status: 'scheduled' },
  { id: 'p4', content: 'New blog: "Why we rebuilt our DataGrid from scratch (and shipped 3× faster)"', platforms: ['x', 'linkedin'], scheduled: 'Tomorrow, 2:00 PM', status: 'draft' },
  { id: 'p5', content: 'Behind-the-scenes video of our weekly ship day — 23 PRs merged, 4 features launched, 0 incidents.', platforms: ['instagram', 'youtube'], scheduled: 'Friday, 10:00 AM', status: 'draft' },
]

const RECENT: Post[] = [
  { id: 'r1', content: 'Launched the new dashboard templates today — 10 full-page examples, copy-paste ready.', platforms: ['x', 'linkedin'], scheduled: '2 hr ago', status: 'published', engagement: { likes: 342, replies: 28, reposts: 94 } },
  { id: 'r2', content: 'Everyone\'s asking for dark mode OLED tuning. It\'s now live for everyone on Pro.', platforms: ['x'], scheduled: 'Yesterday', status: 'published', engagement: { likes: 128, replies: 11, reposts: 24 } },
  { id: 'r3', content: 'Three-pane inbox is now a template. From design to shipped in 4 hours.', platforms: ['x', 'linkedin'], scheduled: '2 days ago', status: 'published', engagement: { likes: 456, replies: 42, reposts: 156 } },
  { id: 'r4', content: 'Office hours this Thursday — bring your DataGrid questions.', platforms: ['x'], scheduled: '3 days ago', status: 'failed' },
]

export default function SocialScheduler() {
  const [tab, setTab] = useState('calendar')

  return (
    <DashboardShell slug="social-scheduler" title="Social · Scheduler" description="Multi-platform post scheduling, calendar, analytics — composed from Tabs, Badge, Avatar, Button.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard label="Scheduled"      value="23" delta="7 this week"   deltaDir="flat" />
        <StatCard label="Drafts"          value="8"  delta="3 need review" deltaDir="flat" />
        <StatCard label="Impressions (7d)" value="412k" delta="+34%"       deltaDir="up" />
        <StatCard label="Engagement rate" value="4.2%" delta="+0.6pp"      deltaDir="up" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>
        <div style={{ border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-1)', padding: 16 }}>
          <Tabs value={tab} onValueChange={setTab}>
            <Tabs.List style={{ marginBottom: 16 }}>
              <Tabs.Trigger value="calendar">Calendar</Tabs.Trigger>
              <Tabs.Trigger value="queue">Queue</Tabs.Trigger>
              <Tabs.Trigger value="recent">Recent</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="calendar">
              <CalendarView />
            </Tabs.Content>

            <Tabs.Content value="queue">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {POSTS.map((p) => <PostCard key={p.id} post={p} />)}
              </div>
            </Tabs.Content>

            <Tabs.Content value="recent">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {RECENT.map((p) => <PostCard key={p.id} post={p} showEngagement />)}
              </div>
            </Tabs.Content>
          </Tabs>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-1)', padding: 16 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 13.5, fontWeight: 600 }}>Compose</h3>
            <textarea
              placeholder="What's happening?"
              rows={5}
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--line-2)', background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'inherit', fontSize: 13, outline: 'none', resize: 'vertical' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['x', 'linkedin', 'instagram', 'youtube'] as Platform[]).map((p) => (
                  <button key={p} title={PLATFORM_LABEL[p]} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--line-2)', background: 'var(--bg)', color: PLATFORM_COLOR[p], fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    {PLATFORM_LABEL[p].slice(0, 2)}
                  </button>
                ))}
              </div>
              <Button size="sm" variant="primary">Schedule</Button>
            </div>
          </div>

          <div style={{ border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-1)', padding: 16 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 13.5, fontWeight: 600 }}>Top this week</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {RECENT.filter((r) => r.engagement).slice(0, 3).map((p) => (
                <div key={p.id} style={{ borderBottom: '1px solid var(--line)', paddingBottom: 10 }}>
                  <div style={{ fontSize: 12.5, color: 'var(--fg-2)', marginBottom: 6, lineHeight: 1.5 }}>{p.content.slice(0, 80)}…</div>
                  <div style={{ display: 'flex', gap: 10, fontSize: 11.5, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>
                    <span>❤ {p.engagement!.likes}</span>
                    <span>💬 {p.engagement!.replies}</span>
                    <span>↻ {p.engagement!.reposts}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

function PostCard({ post, showEngagement }: { post: Post; showEngagement?: boolean }) {
  const tone = post.status === 'published' ? 'ok' : post.status === 'failed' ? 'err' : post.status === 'draft' ? 'warn' : 'accent'
  return (
    <div style={{ padding: 14, border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar size="sm" name="Veloce" />
          <span style={{ fontSize: 13, fontWeight: 500 }}>@veloce</span>
          <Badge tone={tone} variant="soft">{post.status}</Badge>
        </div>
        <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>{post.scheduled}</span>
      </div>
      <div style={{ fontSize: 13.5, color: 'var(--fg)', lineHeight: 1.55, marginBottom: 10 }}>{post.content}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {post.platforms.map((p) => (
            <span key={p} style={{ fontSize: 11, padding: '2px 7px', borderRadius: 999, border: '1px solid var(--line-2)', color: PLATFORM_COLOR[p], fontWeight: 500 }}>
              {PLATFORM_LABEL[p]}
            </span>
          ))}
        </div>
        {showEngagement && post.engagement ? (
          <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>
            <span>❤ {post.engagement.likes}</span>
            <span>💬 {post.engagement.replies}</span>
            <span>↻ {post.engagement.reposts}</span>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 6 }}>
            <Button size="sm" variant="ghost">Edit</Button>
          </div>
        )}
      </div>
    </div>
  )
}

function CalendarView() {
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const HOURS = ['9am', '12pm', '3pm', '6pm']
  // sparse schedule
  const scheduled: Record<string, string[]> = {
    'Mon-9am': ['X', 'LI'],
    'Mon-3pm': ['X'],
    'Tue-12pm': ['IG'],
    'Wed-9am': ['X', 'LI'],
    'Wed-6pm': ['X'],
    'Thu-3pm': ['LI'],
    'Fri-9am': ['IG', 'YT'],
    'Fri-6pm': ['X'],
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `60px repeat(${DAYS.length}, 1fr)`, gap: 1, background: 'var(--line)', border: '1px solid var(--line)', borderRadius: 8, overflow: 'hidden', minWidth: 640 }}>
        {/* header */}
        <div style={{ background: 'var(--bg-2)', padding: '10px 8px', fontSize: 11, color: 'var(--fg-3)' }}></div>
        {DAYS.map((d) => <div key={d} style={{ background: 'var(--bg-2)', padding: '10px 8px', fontSize: 12, fontWeight: 500, color: 'var(--fg-2)', textAlign: 'center' }}>{d}</div>)}
        {/* rows */}
        {HOURS.map((h) => (
          <>
            <div key={`h-${h}`} style={{ background: 'var(--bg-1)', padding: '14px 8px', fontSize: 11, color: 'var(--fg-3)', textAlign: 'right' }}>{h}</div>
            {DAYS.map((d) => {
              const items = scheduled[`${d}-${h}`] ?? []
              return (
                <div key={`${d}-${h}`} style={{ background: 'var(--bg-1)', padding: 8, minHeight: 56, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {items.map((it) => (
                    <div key={it} style={{ fontSize: 10.5, padding: '3px 6px', borderRadius: 4, background: 'color-mix(in oklch, var(--ac) 20%, transparent)', color: 'var(--ac-text)', fontWeight: 500 }}>
                      {it}
                    </div>
                  ))}
                </div>
              )
            })}
          </>
        ))}
      </div>
    </div>
  )
}
