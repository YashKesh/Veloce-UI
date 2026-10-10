import { useState } from 'react'
import {
  Tabs, Form, Input, Textarea, Select, Switch, RadioGroup, Radio, Button,
  Avatar, Badge, Separator, Alert,
} from 'veloce-ui'
import { DashboardShell } from './DashboardShell'

const TZ_OPTIONS = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/Los_Angeles', label: 'America / Los Angeles' },
  { value: 'America/New_York', label: 'America / New York' },
  { value: 'Europe/London', label: 'Europe / London' },
  { value: 'Asia/Kolkata', label: 'Asia / Kolkata' },
  { value: 'Asia/Tokyo', label: 'Asia / Tokyo' },
]

const PLAN_OPTIONS = [
  { value: 'free', label: 'Free — 1 project' },
  { value: 'pro', label: 'Pro — unlimited' },
  { value: 'team', label: 'Team — unlimited + SSO' },
]

export default function Settings() {
  const [tab, setTab] = useState('profile')
  return (
    <DashboardShell slug="settings" title="Settings" description="Multi-tab settings page using Tabs, Form, Switch, Radio, and Select — no charts needed.">
      <div style={{ maxWidth: 920, marginInline: 'auto', width: '100%' }}>
        <Tabs value={tab} onValueChange={setTab}>
          <Tabs.List style={{ marginBottom: 20 }}>
            <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
            <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
            <Tabs.Trigger value="security">Security</Tabs.Trigger>
            <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="profile"><ProfilePanel /></Tabs.Content>
          <Tabs.Content value="notifications"><NotificationsPanel /></Tabs.Content>
          <Tabs.Content value="security"><SecurityPanel /></Tabs.Content>
          <Tabs.Content value="billing"><BillingPanel /></Tabs.Content>
        </Tabs>
      </div>
    </DashboardShell>
  )
}

function SettingsCard({ title, description, children, footer }: { title: string; description?: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-1)', marginBottom: 16, overflow: 'hidden' }}>
      <div style={{ padding: '18px 20px 14px' }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--fg)' }}>{title}</h3>
        {description && <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--fg-3)' }}>{description}</p>}
      </div>
      <div style={{ padding: '0 20px 18px' }}>{children}</div>
      {footer && <div style={{ padding: '12px 20px', background: 'var(--bg-2)', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>{footer}</div>}
    </div>
  )
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20, padding: '14px 0', borderTop: '1px solid var(--line)', alignItems: 'start' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)' }}>{label}</div>
        {hint && <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>{hint}</div>}
      </div>
      <div>{children}</div>
    </div>
  )
}

function ProfilePanel() {
  const [name, setName] = useState('Ada Lovelace')
  const [handle, setHandle] = useState('ada')
  const [bio, setBio] = useState('Building things with Veloce.')
  const [tz, setTz] = useState('UTC')

  return (
    <>
      <SettingsCard title="Profile" description="Public information shown on your Veloce profile." footer={<><Button variant="ghost">Reset</Button><Button variant="primary">Save changes</Button></>}>
        <Row label="Avatar" hint="Shown next to your name across the app.">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Avatar size="lg" name={name} />
            <Button variant="ghost" size="sm">Upload new photo</Button>
            <Button variant="ghost" size="sm">Remove</Button>
          </div>
        </Row>
        <Form>
          <Row label="Display name">
            <Form.Field>
              <Form.Control><Input value={name} onChange={(e) => setName(e.target.value)} /></Form.Control>
            </Form.Field>
          </Row>
          <Row label="Handle" hint="veloce.dev/@your-handle">
            <Form.Field>
              <Form.Control><Input value={handle} onChange={(e) => setHandle(e.target.value)} /></Form.Control>
            </Form.Field>
          </Row>
          <Row label="Bio">
            <Form.Field>
              <Form.Control><Textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} /></Form.Control>
              <Form.Description>160 characters max.</Form.Description>
            </Form.Field>
          </Row>
          <Row label="Timezone">
            <Form.Field>
              <Form.Control><Select value={tz} onValueChange={setTz} options={TZ_OPTIONS} /></Form.Control>
            </Form.Field>
          </Row>
        </Form>
      </SettingsCard>
    </>
  )
}

function NotificationsPanel() {
  const [email, setEmail] = useState({ product: true, security: true, marketing: false, digest: true })
  const [push, setPush] = useState({ mentions: true, replies: true, newsletter: false })

  return (
    <>
      <SettingsCard title="Email notifications" description="Choose what we email you about.">
        {([
          ['product', 'Product updates', 'Monthly digest of what shipped.'],
          ['security', 'Security alerts', 'Always on — unusual sign-ins, API key changes.'],
          ['marketing', 'Marketing', 'Occasional emails about launches and offers.'],
          ['digest', 'Weekly digest', 'Your activity summary every Monday.'],
        ] as const).map(([k, label, hint]) => (
          <Row key={k} label={label} hint={hint}>
            <Switch checked={email[k]} onCheckedChange={(v) => setEmail({ ...email, [k]: v })} />
          </Row>
        ))}
      </SettingsCard>

      <SettingsCard title="Push notifications" description="Delivered to your browser and mobile apps.">
        {([
          ['mentions', 'Mentions', 'Someone @-mentions you.'],
          ['replies', 'Replies', 'Replies to your comments and threads.'],
          ['newsletter', 'Newsletter', 'In-app newsletter badge.'],
        ] as const).map(([k, label, hint]) => (
          <Row key={k} label={label} hint={hint}>
            <Switch checked={push[k]} onCheckedChange={(v) => setPush({ ...push, [k]: v })} />
          </Row>
        ))}
      </SettingsCard>
    </>
  )
}

function SecurityPanel() {
  const [twofa, setTwofa] = useState<string>('app')
  const [sessionTimeout, setSessionTimeout] = useState('30d')

  return (
    <>
      <SettingsCard title="Two-factor authentication" description="Add a second step to your sign-in." footer={<Button variant="primary">Save</Button>}>
        <Row label="Method" hint="How you receive the second factor.">
          <RadioGroup value={twofa} onValueChange={setTwofa}>
            <label style={{ display: 'flex', gap: 10, padding: '8px 0', cursor: 'pointer' }}>
              <Radio value="app" />
              <div>
                <div style={{ fontSize: 13, color: 'var(--fg)' }}>Authenticator app</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>Use 1Password, Authy, Google Authenticator.</div>
              </div>
            </label>
            <label style={{ display: 'flex', gap: 10, padding: '8px 0', cursor: 'pointer' }}>
              <Radio value="sms" />
              <div>
                <div style={{ fontSize: 13, color: 'var(--fg)' }}>SMS</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>Codes sent to your phone.</div>
              </div>
            </label>
            <label style={{ display: 'flex', gap: 10, padding: '8px 0', cursor: 'pointer' }}>
              <Radio value="key" />
              <div>
                <div style={{ fontSize: 13, color: 'var(--fg)' }}>Hardware key</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>YubiKey or any FIDO2 key.</div>
              </div>
            </label>
          </RadioGroup>
        </Row>
      </SettingsCard>

      <SettingsCard title="Sessions" description="Devices currently signed in.">
        <Row label="Auto sign-out" hint="Inactive sessions sign out automatically.">
          <Select
            value={sessionTimeout}
            onValueChange={setSessionTimeout}
            options={[
              { value: '1d', label: '1 day' },
              { value: '7d', label: '7 days' },
              { value: '30d', label: '30 days' },
              { value: 'never', label: 'Never' },
            ]}
          />
        </Row>
        <Row label="Active sessions">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { d: 'MacBook Pro · Chrome', loc: 'San Francisco', time: 'now', current: true },
              { d: 'iPhone 15 · Safari', loc: 'San Francisco', time: '3 hr ago' },
              { d: 'Linux · Firefox', loc: 'Berlin', time: '2 days ago' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--fg)' }}>{s.d} {s.current && <Badge tone="ok" variant="soft" style={{ marginLeft: 6 }}>this device</Badge>}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--fg-3)' }}>{s.loc} · {s.time}</div>
                </div>
                {!s.current && <Button size="sm" variant="ghost">Sign out</Button>}
              </div>
            ))}
          </div>
        </Row>
      </SettingsCard>
    </>
  )
}

function BillingPanel() {
  const [plan, setPlan] = useState('pro')
  return (
    <>
      <Alert tone="info" title="Trial active" style={{ marginBottom: 16 }}>
        Your Pro trial ends in 7 days. Add a payment method to keep access.
      </Alert>

      <SettingsCard title="Plan" description="Change or cancel your subscription." footer={<><Button variant="ghost">Cancel plan</Button><Button variant="primary">Update plan</Button></>}>
        <Row label="Current plan">
          <Select value={plan} onValueChange={setPlan} options={PLAN_OPTIONS} />
        </Row>
        <Row label="Billing cycle">
          <RadioGroup value="yearly" orientation="horizontal">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <Radio value="monthly" /> Monthly
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', marginLeft: 20 }}>
              <Radio value="yearly" /> Yearly <Badge tone="ok" variant="soft" style={{ marginLeft: 4 }}>-20%</Badge>
            </label>
          </RadioGroup>
        </Row>
      </SettingsCard>

      <SettingsCard title="Payment method">
        <Row label="Card on file">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: '6px 10px', border: '1px solid var(--line-2)', borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 12.5 }}>VISA •••• 4242</div>
            <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>expires 12/27</span>
            <Button variant="ghost" size="sm">Replace</Button>
          </div>
        </Row>
      </SettingsCard>

      <SettingsCard title="Invoices">
        <div style={{ paddingTop: 4 }}>
          {[
            { d: '2026-10-01', amt: '$39.00', st: 'paid' },
            { d: '2026-09-01', amt: '$39.00', st: 'paid' },
            { d: '2026-08-01', amt: '$39.00', st: 'paid' },
          ].map((i, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: idx === 0 ? '1px solid var(--line)' : '1px solid var(--line)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--fg-2)' }}>{i.d}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Badge tone="ok" variant="soft">{i.st}</Badge>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{i.amt}</span>
                <Button variant="ghost" size="sm">PDF</Button>
              </div>
            </div>
          ))}
        </div>
      </SettingsCard>

      <Separator />
    </>
  )
}
