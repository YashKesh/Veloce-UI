import type { CSSProperties, ReactNode } from 'react'
import { SiteHeader } from '../components/SiteHeader'
import { Seo } from '../Seo'

const mono: CSSProperties = { fontFamily: 'var(--font-mono)' }

const PILLS = [
  'Toaster', 'Spinner', 'Progress', 'Skeleton', 'Alert', 'Avatar', 'Chip', 'Radio', 'Slider', 'Textarea',
  'Toggle group', 'Breadcrumbs', 'Pagination', 'Stepper', 'Table', 'Sheet', 'Empty state',
]

function Section({ title, meta, children, style }: { title: string; meta: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, ...style }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <h2 className="vl-h2" style={{ margin: 0 }}>{title}</h2>
        <span style={{ ...mono, fontSize: 11.5, color: 'var(--fg-3)' }}>{meta}</span>
      </div>
      {children}
    </div>
  )
}

const framed: CSSProperties = {
  flex: 1,
  padding: '24px 28px',
  border: '1px solid var(--line)',
  borderRadius: 12,
  background: 'var(--bg-1)',
}

/* ---------- toasts ---------- */
function Toast({
  tone, title, body, action, bar, style,
}: { tone: 'ok' | 'err' | 'warn'; title: string; body: ReactNode; action?: ReactNode; bar?: string; style?: CSSProperties }) {
  const glyph = tone === 'ok' ? '✓' : '!'
  return (
    <div className="vl-toast" style={{ gap: 12, width: 380, ...style }}>
      <div className="vl-toast__icon" style={{ background: `color-mix(in oklch,var(--${tone}) 20%,transparent)`, color: `var(--${tone})` }}>{glyph}</div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div className="vl-toast__title">{title}</div>
        <div className="vl-toast__body" style={{ marginTop: 0 }}>{body}</div>
      </div>
      {action}
      <span style={{ color: 'var(--fg-3)', fontSize: 12, alignSelf: 'center' }}>✕</span>
      {bar && <div className="vl-toast__bar" style={{ width: bar, background: `var(--${tone})` }} />}
    </div>
  )
}

/* ---------- alert ---------- */
function Alert({
  border, bg, icon, iconBg, iconColor, title, body, action,
}: { border: string; bg: string; icon: string; iconBg: string; iconColor: string; title: string; body: string; action?: string }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '12px 14px', borderRadius: 9, border: `1px solid ${border}`, background: bg }}>
      <div style={{ width: 18, height: 18, borderRadius: '50%', background: iconBg, color: iconColor, display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 12.5, color: 'var(--fg-2)', marginTop: 2, lineHeight: 1.45 }}>{body}</div>
      </div>
      {action && <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ac-text)', alignSelf: 'center', whiteSpace: 'nowrap' }}>{action}</span>}
    </div>
  )
}

/* ---------- avatar ---------- */
const AV_HUES = ['oklch(0.55 0.12 292)', 'oklch(0.6 0.12 200)', 'oklch(0.62 0.12 40)']
function Avatar({ size, name, hue, style }: { size: number; name: string; hue: number; style?: CSSProperties }) {
  return (
    <span
      style={{
        width: size, height: size, borderRadius: '50%', background: AV_HUES[hue % 3], color: 'oklch(0.98 0 0)',
        display: 'inline-grid', placeItems: 'center', fontWeight: 600, fontSize: size * 0.36, flexShrink: 0, ...style,
      }}
    >
      {name}
    </span>
  )
}

/* ---------- stepper ---------- */
function Step({ state, n, label }: { state: 'done' | 'current' | 'upcoming'; n: number; label: string }) {
  const circle: CSSProperties =
    state === 'done'
      ? { background: 'var(--ac)', color: 'var(--ac-fg)' }
      : state === 'current'
        ? { border: '2px solid var(--ac)', color: 'var(--ac-text)', boxShadow: '0 0 0 4px var(--ac-soft)' }
        : { border: '1px solid var(--line-2)', color: 'var(--fg-3)' }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 24, height: 24, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 11.5, fontWeight: 600, flexShrink: 0, ...circle }}>
        {state === 'done' ? '✓' : n}
      </span>
      <span style={{ fontSize: 13, color: state === 'current' ? 'var(--fg)' : state === 'done' ? 'var(--fg-2)' : 'var(--fg-3)', fontWeight: state === 'current' ? 500 : 400, whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </div>
  )
}

const pageBtn = (current?: boolean): CSSProperties => ({
  width: 30, height: 30, borderRadius: 7, display: 'inline-grid', placeItems: 'center', fontSize: 13,
  fontVariantNumeric: 'tabular-nums',
  background: current ? 'var(--fg)' : undefined,
  color: current ? 'var(--bg)' : 'var(--fg-2)',
  fontWeight: current ? 500 : 400,
  border: current ? undefined : '1px solid transparent',
})

export default function Feedback() {
  return (
    <div>
      <Seo
        title="Toast & feedback"
        description="Toast system with four tones, four positions, auto-dismiss, custom actions, and a hooks-first API."
      />
      <SiteHeader />
      <div style={{ padding: '56px 64px', display: 'flex', flexDirection: 'column', gap: 36 }}>
        {/* header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 24, borderBottom: '1px solid var(--line-2)' }}>
          <div className="vl-eyebrow">COVERAGE · ROUND 2</div>
          <h1 style={{ margin: 0, fontSize: 44, fontWeight: 600, letterSpacing: '-0.04em' }}>Feedback, loading &amp; navigation</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
            {PILLS.map((p) => (
              <span key={p} className="vl-badge vl-badge--outline">{p}</span>
            ))}
          </div>
        </div>

        {/* Toaster + Spinner/Progress */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 32 }}>
          <Section title="Toaster" meta="stack 180ms · max 3 · aria-live polite · pause on hover">
            <div style={{ ...framed, position: 'relative', height: 278, overflow: 'hidden' }}>
              <span style={{ ...mono, position: 'absolute', top: 16, left: 20, fontSize: 11, color: 'var(--fg-3)' }}>
                region · bottom-right · toast.promise morphs loading → success in place
              </span>
              <div style={{ position: 'absolute', right: 28, bottom: 24 }}>
                <Toast
                  tone="ok"
                  title="Invite sent"
                  body="mara@acme.co can now view this project"
                  style={{ position: 'absolute', right: 0, bottom: 0, transform: 'translateY(-124px) scale(.92)', opacity: 0.45, filter: 'blur(.6px)' }}
                />
                <Toast
                  tone="warn"
                  title="Approaching bandwidth limit"
                  body="82% of the 1 TB included this cycle"
                  style={{ position: 'absolute', right: 0, bottom: 0, transform: 'translateY(-64px) scale(.96)', opacity: 0.8 }}
                />
                <Toast
                  tone="ok"
                  title="Deployed to production"
                  body="v1.0.4 is live in 14 regions · 38s"
                  action={<span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ac-text)', alignSelf: 'center' }}>View</span>}
                  bar="62%"
                  style={{ position: 'relative' }}
                />
              </div>
            </div>
          </Section>

          <Section title="Spinner & Progress" meta="spin .7s linear · width 250ms settle · indeterminate 1.4s">
            <div style={{ ...framed, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <span className="vl-spinner" style={{ width: 14, height: 14, color: 'var(--fg-2)' }} />
                <span className="vl-spinner" style={{ width: 20, height: 20, color: 'var(--fg-2)' }} />
                <span className="vl-spinner" style={{ width: 28, height: 28, color: 'var(--ac)', borderWidth: 2.5 }} />
                <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }}>
                  {[0, 1, 2].map((i) => (
                    <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--fg-2)', animation: `vl-dots 1.2s ${i * 0.2}s infinite` }} />
                  ))}
                </span>
                <span style={{ ...mono, fontSize: 11, color: 'var(--fg-3)', marginLeft: 'auto' }}>14 · 20 · 28 · dots</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                  <span style={{ color: 'var(--fg-2)' }}>Uploading source maps</span>
                  <span style={{ ...mono, fontVariantNumeric: 'tabular-nums', color: 'var(--fg-3)' }}>72%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-3)' }}>
                  <div style={{ height: 6, borderRadius: 3, background: 'var(--ac)', width: '72%' }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 12.5, color: 'var(--fg-2)' }}>Indeterminate</span>
                <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-3)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, height: 6, borderRadius: 3, background: 'var(--ac)', animation: 'vl-indet 1.4s cubic-bezier(.4,0,.2,1) infinite' }} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'conic-gradient(var(--ac) 0 72%, var(--bg-3) 0)', display: 'grid', placeItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bg-1)', display: 'grid', placeItems: 'center', ...mono, fontSize: 11, color: 'var(--fg-2)' }}>72%</div>
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                  {[1, 1, 1, 1, 0, 0].map((on, i) => (
                    <span key={i} style={{ width: 28, height: 6, borderRadius: 3, background: on ? 'var(--ac)' : 'var(--bg-3)' }} />
                  ))}
                </div>
                <span style={{ ...mono, fontSize: 11, color: 'var(--fg-3)', marginLeft: 'auto' }}>circular · segmented</span>
              </div>
            </div>
          </Section>
        </div>

        {/* Skeleton + Alert */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 32 }}>
          <Section title="Skeleton" meta="shimmer 1.6s linear · content crossfades in 200ms swift-out · static under reduced motion">
            <div style={{ ...framed, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <span className="vl-skeleton" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span className="vl-skeleton" style={{ height: 12, borderRadius: 4, width: '46%' }} />
                  <span className="vl-skeleton" style={{ height: 10, borderRadius: 4, width: '68%' }} />
                </div>
              </div>
              <span className="vl-skeleton" style={{ height: 120, borderRadius: 9 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span className="vl-skeleton" style={{ height: 10, borderRadius: 4, width: '92%' }} />
                <span className="vl-skeleton" style={{ height: 10, borderRadius: 4, width: '84%' }} />
                <span className="vl-skeleton" style={{ height: 10, borderRadius: 4, width: '58%' }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <span className="vl-skeleton" style={{ height: 32, width: 96, borderRadius: 8 }} />
                <span className="vl-skeleton" style={{ height: 32, width: 72, borderRadius: 8 }} />
              </div>
            </div>
          </Section>

          <Section title="Alert" meta="info · success · warning · error · static, no motion">
            <div style={{ ...framed, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Alert
                border="var(--ac-line)" bg="var(--ac-soft)"
                icon="i" iconBg="var(--ac)" iconColor="var(--ac-fg)"
                title="Preview deployments are enabled"
                body="Every push to a branch gets its own URL. Configure retention in project settings."
                action="Settings →"
              />
              <Alert
                border="color-mix(in oklch,var(--ok) 35%,transparent)" bg="color-mix(in oklch,var(--ok) 10%,transparent)"
                icon="✓" iconBg="var(--ok)" iconColor="oklch(0.15 0 0)"
                title="Domain verified"
                body="veloce.app now points to this project. SSL was issued automatically."
              />
              <Alert
                border="color-mix(in oklch,var(--warn) 35%,transparent)" bg="color-mix(in oklch,var(--warn) 10%,transparent)"
                icon="!" iconBg="var(--warn)" iconColor="oklch(0.15 0 0)"
                title="Approaching bandwidth limit"
                body="You've used 82% of the 1 TB included in your plan this cycle."
                action="Upgrade"
              />
              <Alert
                border="color-mix(in oklch,var(--err) 40%,transparent)" bg="color-mix(in oklch,var(--err) 10%,transparent)"
                icon="!" iconBg="var(--err)" iconColor="oklch(0.99 0 0)"
                title="Build failed"
                body="Type error in app/layout.tsx:42 — 'Session' is not assignable to 'User'."
                action="View logs"
              />
            </div>
          </Section>
        </div>

        {/* Avatar / Chip / Toggle / Breadcrumbs / Pagination */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <Section title="Avatar & Chip" meta="24 / 32 / 40 · presence dot · group overlap −8 · chips h28 r999">
            <div style={{ ...framed, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Avatar size={24} name="MK" hue={0} />
                <Avatar size={32} name="JT" hue={1} />
                <span style={{ position: 'relative', display: 'inline-flex' }}>
                  <Avatar size={40} name="AR" hue={2} />
                  <span style={{ position: 'absolute', right: 0, bottom: 0, width: 11, height: 11, borderRadius: '50%', background: 'var(--ok)', border: '2px solid var(--bg-1)' }} />
                </span>
                <span style={{ display: 'inline-flex', marginLeft: 8 }}>
                  <Avatar size={32} name="MK" hue={0} style={{ border: '2px solid var(--bg-1)' }} />
                  <Avatar size={32} name="JT" hue={1} style={{ border: '2px solid var(--bg-1)', marginLeft: -8 }} />
                  <Avatar size={32} name="AR" hue={2} style={{ border: '2px solid var(--bg-1)', marginLeft: -8 }} />
                  <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-3)', color: 'var(--fg-2)', display: 'inline-grid', placeItems: 'center', fontSize: 11.5, fontWeight: 600, border: '2px solid var(--bg-1)', marginLeft: -8 }}>+9</span>
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 28, padding: '0 6px 0 12px', borderRadius: 999, background: 'var(--bg-3)', fontSize: 13 }}>
                  react
                  <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--line-2)', display: 'inline-grid', placeItems: 'center', fontSize: 9, color: 'var(--fg-2)' }}>✕</span>
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 12px', borderRadius: 999, border: '1px solid var(--ac)', background: 'var(--ac-soft)', color: 'var(--ac-text)', fontSize: 13, fontWeight: 500 }}>
                  ✓ Motion
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', height: 28, padding: '0 12px', borderRadius: 999, border: '1px solid var(--line-2)', color: 'var(--fg-2)', fontSize: 13 }}>
                  Accessibility
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', height: 28, padding: '0 12px', borderRadius: 999, border: '1px solid var(--line-2)', color: 'var(--fg-2)', fontSize: 13, boxShadow: '0 0 0 2px var(--bg-1),0 0 0 4px var(--ac)' }}>
                  Forms
                </span>
              </div>
            </div>
          </Section>

          <Section title="Toggle group, Breadcrumbs & Pagination" meta="joined segments h34 · … collapses middle crumbs · current page inverted">
            <div style={{ ...framed, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'inline-flex', alignSelf: 'flex-start', border: '1px solid var(--line-2)', borderRadius: 9, overflow: 'hidden', fontSize: 13 }}>
                {['General', 'Members', 'Billing'].map((t, i) => (
                  <span
                    key={t}
                    style={{
                      height: 34, display: 'inline-flex', alignItems: 'center', padding: '0 16px',
                      borderLeft: i > 0 ? '1px solid var(--line-2)' : undefined,
                      background: i === 1 ? 'var(--bg-3)' : undefined,
                      color: i === 1 ? 'var(--fg)' : 'var(--fg-2)',
                      fontWeight: i === 1 ? 500 : 400,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                <span style={{ color: 'var(--fg-2)' }}>Projects</span>
                <span style={{ color: 'var(--fg-3)' }}>/</span>
                <span style={{ padding: '1px 7px', borderRadius: 5, background: 'var(--bg-3)', color: 'var(--fg-2)' }}>…</span>
                <span style={{ color: 'var(--fg-3)' }}>/</span>
                <span style={{ color: 'var(--fg-2)' }}>veloce-docs</span>
                <span style={{ color: 'var(--fg-3)' }}>/</span>
                <span style={{ color: 'var(--fg)', fontWeight: 500 }}>Deployments</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={pageBtn()}>‹</span>
                <span style={pageBtn()}>1</span>
                <span style={pageBtn()}>2</span>
                <span style={pageBtn(true)}>3</span>
                <span style={pageBtn()}>4</span>
                <span style={{ ...pageBtn(), color: 'var(--fg-3)' }}>…</span>
                <span style={pageBtn()}>79</span>
                <span style={pageBtn()}>›</span>
              </div>
            </div>
          </Section>
        </div>

        {/* Radio / Slider / Textarea */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32 }}>
          <Section title="Radio" meta="selected border 5px · focus ring · disabled">
            <div style={{ ...framed, display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13.5 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', border: '5px solid var(--ac)', background: 'var(--bg)', flexShrink: 0 }} />
                Deploy on push
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', border: '1px solid var(--line-2)', background: 'var(--bg)', flexShrink: 0, boxShadow: '0 0 0 2px var(--bg-1),0 0 0 4px var(--ac)' }} />
                Deploy manually
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--fg-3)' }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', border: '1px solid var(--line)', background: 'var(--bg-2)', flexShrink: 0 }} />
                Scheduled deploys
                <span className="vl-badge vl-badge--accent" style={{ fontSize: 11, padding: '1px 7px' }}>Pro</span>
              </label>
            </div>
          </Section>

          <Section title="Slider" meta="thumb 18 · value tooltip · settle 250ms">
            <div style={{ ...framed, display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
              <div style={{ position: 'relative', padding: '26px 0 4px' }}>
                <div style={{ height: 4, borderRadius: 2, background: 'var(--bg-3)' }}>
                  <div style={{ height: 4, borderRadius: 2, background: 'var(--ac)', width: '64%' }} />
                </div>
                <span
                  style={{
                    position: 'absolute', top: 16, left: '64%', transform: 'translate(-50%,-50%)',
                    width: 18, height: 18, borderRadius: '50%', background: 'oklch(0.99 0 0)',
                    boxShadow: 'var(--shadow-sm),0 0 0 2px var(--bg-1),0 0 0 4px var(--ac)',
                  }}
                />
                <span style={{ ...mono, position: 'absolute', top: -12, left: '64%', transform: 'translateX(-50%)', padding: '2px 6px', borderRadius: 5, background: 'var(--fg)', color: 'var(--bg)', fontSize: 11 }}>
                  64
                </span>
              </div>
              <div style={{ ...mono, display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--fg-3)' }}>
                <span>0</span><span>100</span>
              </div>
            </div>
          </Section>

          <Section title="Textarea" meta="min-height 84 · counter">
            <div style={framed}>
              <span className="vl-field-label">Deploy note</span>
              <div style={{ minHeight: 84, padding: '10px 12px', borderRadius: 8, border: '1px solid var(--line-2)', background: 'var(--bg)', fontSize: 13.5, color: 'var(--fg)', lineHeight: 1.5 }}>
                Hotfix for the dialog focus trap — restores focus to the trigger after Escape.
              </div>
              <div style={{ ...mono, textAlign: 'right', fontSize: 10.5, color: 'var(--fg-3)', marginTop: 6 }}>92 / 280</div>
            </div>
          </Section>
        </div>

        {/* Stepper + Table */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 32 }}>
          <Section title="Stepper" meta="done · current (ring glow) · upcoming · connectors 2px">
            <div style={{ ...framed, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Step state="done" n={1} label="Connect repo" />
              <span style={{ flex: 1, height: 2, background: 'var(--ac)', borderRadius: 1 }} />
              <Step state="done" n={2} label="Configure build" />
              <span style={{ flex: 1, height: 2, borderRadius: 1, background: 'linear-gradient(90deg,var(--ac) 50%,var(--bg-3) 50%)' }} />
              <Step state="current" n={3} label="Set env vars" />
              <span style={{ flex: 1, height: 2, background: 'var(--bg-3)', borderRadius: 1 }} />
              <Step state="upcoming" n={4} label="Deploy" />
            </div>
          </Section>

          <Section title="Table" meta="compact · 40px rows · mono caps header">
            <div style={{ ...framed, padding: 0, overflow: 'hidden' }}>
              <div style={{ ...mono, display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr .8fr', padding: '10px 16px', fontSize: 10.5, letterSpacing: '.06em', color: 'var(--fg-3)', background: 'var(--bg-2)', borderBottom: '1px solid var(--line)' }}>
                <span>MEMBER</span><span>ROLE</span><span>LAST ACTIVE</span><span style={{ textAlign: 'right' }}>2FA</span>
              </div>
              {[
                ['Mara Kim', 'Owner', '2m ago', '✓'],
                ['Jonas Thal', 'Admin', '1h ago', '✓'],
                ['Ana Reyes', 'Developer', 'Yesterday', '—'],
                ['Sam Okafor', 'Viewer', 'Mar 12', '✓'],
              ].map(([m, r, t, f]) => (
                <div key={m} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr .8fr', alignItems: 'center', height: 40, padding: '0 16px', fontSize: 13, borderBottom: '1px solid var(--line)' }}>
                  <span style={{ fontWeight: 500 }}>{m}</span>
                  <span style={{ color: 'var(--fg-2)' }}>{r}</span>
                  <span style={{ color: 'var(--fg-3)' }}>{t}</span>
                  <span style={{ textAlign: 'right', color: f === '✓' ? 'var(--ok)' : 'var(--fg-3)' }}>{f}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Sheet + Empty state */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 32 }}>
          <Section title="Sheet" meta="slides from right 350ms settle · width 62% · scrim .45">
            <div style={{ position: 'relative', height: 300, borderRadius: 12, border: '1px solid var(--line)', background: 'var(--bg-1)', overflow: 'hidden' }}>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span className="vl-skeleton" style={{ height: 12, width: '32%', borderRadius: 4 }} />
                <span className="vl-skeleton" style={{ height: 10, width: '58%', borderRadius: 4 }} />
                <span className="vl-skeleton" style={{ height: 10, width: '44%', borderRadius: 4 }} />
              </div>
              <div style={{ position: 'absolute', inset: 0, background: 'oklch(0 0 0/.45)' }} />
              <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '62%', background: 'var(--bg-2)', borderLeft: '1px solid var(--line-2)', boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--line)' }}>
                  <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.015em' }}>Filter deployments</span>
                  <span style={{ color: 'var(--fg-3)', fontSize: 13 }}>✕</span>
                </div>
                <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-2)' }}>Status</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 12px', borderRadius: 999, border: '1px solid var(--ac)', background: 'var(--ac-soft)', color: 'var(--ac-text)', fontSize: 12.5, fontWeight: 500 }}>✓ Ready</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', height: 28, padding: '0 12px', borderRadius: 999, border: '1px solid var(--line-2)', color: 'var(--fg-2)', fontSize: 12.5 }}>Failed</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-2)' }}>Branch</span>
                    <div style={{ display: 'flex', alignItems: 'center', height: 34, padding: '0 12px', borderRadius: 8, border: '1px solid var(--line-2)', background: 'var(--bg)', color: 'var(--fg-2)', fontSize: 13, justifyContent: 'space-between' }}>
                      main <span style={{ color: 'var(--fg-3)' }}>⌄</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '14px 20px', borderTop: '1px solid var(--line)' }}>
                  <span className="vl-btn vl-btn--sm vl-btn--outline">Reset</span>
                  <span className="vl-btn vl-btn--sm vl-btn--solid">Apply</span>
                </div>
              </div>
            </div>
          </Section>

          <Section title="Empty state" meta="dashed border · centered · solid CTA">
            <div style={{ flex: 1, border: '1px dashed var(--line-2)', borderRadius: 12, background: 'var(--bg-1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 40, textAlign: 'center', minHeight: 300 }}>
              <span style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-3)', display: 'grid', placeItems: 'center', fontSize: 17, color: 'var(--fg-2)' }}>▲</span>
              <div style={{ fontSize: 14, fontWeight: 600 }}>No deployments yet</div>
              <div style={{ fontSize: 13, color: 'var(--fg-2)', maxWidth: 260, lineHeight: 1.5 }}>
                Push to a connected branch or deploy manually to see your first build here.
              </div>
              <span className="vl-btn vl-btn--solid" style={{ height: 32, padding: '0 13px', borderRadius: 8, fontSize: 13, marginTop: 4 }}>Deploy now</span>
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}
