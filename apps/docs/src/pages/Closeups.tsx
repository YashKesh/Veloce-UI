import type { CSSProperties, ReactNode } from 'react'
import { SiteHeader } from '../components/SiteHeader'
import { Seo } from '../Seo'

const mono: CSSProperties = { fontFamily: 'var(--font-mono)' }

function SectionTitle({ title, meta }: { title: string; meta: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
      <h2 className="vl-h2" style={{ margin: 0 }}>{title}</h2>
      <span style={{ ...mono, fontSize: 11.5, color: 'var(--fg-3)' }}>{meta}</span>
    </div>
  )
}

const framed: CSSProperties = {
  padding: '24px 28px',
  border: '1px solid var(--line)',
  borderRadius: 12,
  background: 'var(--bg-1)',
}

/* Button size metrics per spec D */
const SIZES = {
  sm: { height: 30, padding: '0 11px', borderRadius: 7, fontSize: 13, spin: 12 },
  md: { height: 36, padding: '0 14px', borderRadius: 9, fontSize: 14, spin: 14 },
  lg: { height: 44, padding: '0 18px', borderRadius: 10, fontSize: 15, spin: 14 },
} as const

type Size = keyof typeof SIZES

function btnBase(size: Size): CSSProperties {
  const s = SIZES[size]
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    justifySelf: 'start',
    height: s.height,
    padding: s.padding,
    borderRadius: s.borderRadius,
    fontSize: s.fontSize,
    fontWeight: 500,
    fontFamily: 'var(--font-sans)',
    whiteSpace: 'nowrap',
  }
}

const solid: CSSProperties = { background: 'var(--ac)', color: 'var(--ac-fg)', boxShadow: 'inset 0 1px 0 oklch(1 0 0/.2)' }
const soft: CSSProperties = { background: 'var(--ac-soft)', color: 'var(--ac-text)' }
const outline: CSSProperties = { border: '1px solid var(--line-2)', color: 'var(--fg)' }
const ghost: CSSProperties = { color: 'var(--fg-2)' }

function LoadingBtn({ size }: { size: Size }) {
  const s = SIZES[size]
  return (
    <span style={{ ...btnBase(size), ...solid, boxShadow: 'none', opacity: 0.85 }}>
      <span className="vl-spinner" style={{ width: s.spin, height: s.spin, borderColor: 'var(--ac-fg)', borderRightColor: 'transparent' }} />
      Deploying
    </span>
  )
}

function Switch({ state }: { state: 'off' | 'on' | 'focus' | 'mid' }) {
  if (state === 'mid') {
    return (
      <span style={{ position: 'relative', width: 38, height: 22, borderRadius: 999, background: 'color-mix(in oklch,var(--ac) 55%,var(--bg-3))', display: 'block' }}>
        <span style={{ position: 'absolute', top: 2, left: 9, width: 20, height: 18, borderRadius: 9, background: 'oklch(0.99 0 0)', filter: 'blur(.3px)' }} />
      </span>
    )
  }
  const on = state === 'on' || state === 'focus'
  return (
    <span
      style={{
        position: 'relative', width: 38, height: 22, borderRadius: 999, display: 'block',
        background: on ? 'var(--ac)' : 'var(--bg-3)',
        border: on ? undefined : '1px solid var(--line-2)',
        boxShadow: state === 'focus' ? '0 0 0 2px var(--bg-1),0 0 0 4px var(--ac)' : undefined,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: on ? 2 : 1,
          left: on ? 18 : 1,
          width: 18, height: 18, borderRadius: '50%',
          background: on ? 'oklch(0.99 0 0)' : 'var(--fg-2)',
          boxShadow: state === 'focus' ? undefined : 'var(--shadow-sm)',
        }}
      />
    </span>
  )
}

function PaletteItem({
  icon, selected, dim, children, right, kbd,
}: { icon: string; selected?: boolean; dim?: boolean; children: ReactNode; right?: string; kbd?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 10px', borderRadius: 7, background: selected ? 'var(--bg-3)' : undefined, color: selected ? undefined : 'var(--fg-2)', opacity: dim ? 0.6 : undefined }}>
      <span style={{ width: 26, height: 26, borderRadius: 6, background: selected ? 'var(--ac-soft)' : 'var(--bg-3)', color: selected ? 'var(--ac-text)' : undefined, display: 'grid', placeItems: 'center', fontSize: 12 }}>
        {icon}
      </span>
      <span style={{ flex: 1 }}>{children}</span>
      {right && <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>{right}</span>}
      {kbd && (
        selected
          ? <span style={{ ...mono, fontSize: 11, padding: '2px 6px', border: '1px solid var(--line-2)', borderRadius: 4, color: 'var(--fg-2)' }}>{kbd}</span>
          : <span style={{ ...mono, fontSize: 11, color: 'var(--fg-3)' }}>{kbd}</span>
      )}
    </div>
  )
}

const Match = ({ children }: { children: ReactNode }) => (
  <span style={{ color: 'var(--ac-text)', fontWeight: 500 }}>{children}</span>
)

/* Light-mode token overrides (spec B light values, applied locally) */
const LIGHT_TOKENS = {
  '--bg': 'oklch(0.99 0.002 260)',
  '--bg-1': 'oklch(0.975 0.003 260)',
  '--bg-2': 'oklch(0.95 0.004 260)',
  '--bg-3': 'oklch(0.92 0.005 260)',
  '--line': 'oklch(0.9 0.006 260)',
  '--line-2': 'oklch(0.82 0.008 260)',
  '--fg': 'oklch(0.17 0.01 260)',
  '--fg-2': 'oklch(0.42 0.012 260)',
  '--fg-3': 'oklch(0.58 0.012 260)',
  '--ac-text': 'var(--ac-text-light)',
  '--shadow-sm': '0 1px 2px oklch(0 0 0/.08)',
  '--shadow-md': '0 4px 12px -2px oklch(0 0 0/.12),0 1px 2px oklch(0 0 0/.06)',
  '--shadow-lg': '0 16px 40px -8px oklch(0 0 0/.18),0 2px 6px oklch(0 0 0/.06)',
} as CSSProperties

export default function Closeups() {
  return (
    <div>
      <Seo
        title="Closeups"
        description="Detail shots of every Veloce UI primitive — hover, focus, press, loading, invalid, and disabled states."
      />
      <SiteHeader />
      <div style={{ padding: '56px 64px', display: 'flex', flexDirection: 'column', gap: 36 }}>
        {/* ---------- Button matrix ---------- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionTitle title="Button" meta="variant × size · press scale .97 · 120ms" />
          <div style={{ ...framed, ...mono, display: 'grid', gridTemplateColumns: '90px repeat(4,1fr) 1.2fr', gap: '14px 24px', alignItems: 'center', fontSize: 11.5, color: 'var(--fg-3)' }}>
            <span />
            <span>solid</span><span>soft</span><span>outline</span><span>ghost</span><span>loading / disabled</span>

            <span>sm · 30</span>
            <span style={{ ...btnBase('sm'), ...solid }}>Deploy</span>
            <span style={{ ...btnBase('sm'), ...soft }}>Deploy</span>
            <span style={{ ...btnBase('sm'), ...outline }}>Deploy</span>
            <span style={{ ...btnBase('sm'), ...ghost }}>Deploy</span>
            <LoadingBtn size="sm" />

            <span>md · 36</span>
            <span style={{ ...btnBase('md'), ...solid }}>Deploy</span>
            <span style={{ ...btnBase('md'), ...soft }}>Deploy</span>
            <span style={{ ...btnBase('md'), ...outline }}>Deploy</span>
            <span style={{ ...btnBase('md'), ...ghost }}>Deploy</span>
            <LoadingBtn size="md" />

            <span>lg · 44</span>
            <span style={{ ...btnBase('lg'), ...solid }}>Deploy</span>
            <span style={{ ...btnBase('lg'), ...soft }}>Deploy</span>
            <span style={{ ...btnBase('lg'), ...outline }}>Deploy</span>
            <span style={{ ...btnBase('lg'), ...ghost }}>Deploy</span>
            <span style={{ ...btnBase('lg'), background: 'var(--bg-3)', color: 'var(--fg-3)' }}>Deploy</span>

            <span>states</span>
            <span style={{ ...btnBase('md'), background: 'var(--ac-h)', color: 'var(--ac-fg)', boxShadow: 'inset 0 1px 0 oklch(1 0 0/.25)' }}>Hover</span>
            <span style={{ ...btnBase('md'), background: 'var(--ac)', color: 'var(--ac-fg)', transform: 'scale(.97)', boxShadow: 'inset 0 1px 2px oklch(0 0 0/.3)' }}>Pressed</span>
            <span style={{ ...btnBase('md'), background: 'var(--ac)', color: 'var(--ac-fg)', boxShadow: '0 0 0 2px var(--bg-1),0 0 0 4px var(--ac)' }}>Focused</span>
            <span style={{ ...btnBase('md'), ...outline, padding: '0 14px 0 12px' }}><span style={{ fontSize: 13 }}>↗</span>With icon</span>
            <span style={{ ...btnBase('md'), background: 'var(--err)', color: 'oklch(0.99 0 0)' }}>Destructive</span>
          </div>
        </div>

        {/* ---------- Input + Switch ---------- */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionTitle title="Input" meta="default · focus · error · message slides in 150ms" />
            <div style={{ ...framed, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, fontSize: 13.5 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-2)' }}>Workspace URL</span>
                <div style={{ display: 'flex', alignItems: 'center', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid var(--line-2)', background: 'var(--bg)', color: 'var(--fg-3)' }}>
                  acme<span style={{ color: 'var(--fg-3)' }}>.veloce.app</span>
                </div>
                <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>Lowercase letters and dashes.</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-2)' }}>Workspace URL</span>
                <div style={{ display: 'flex', alignItems: 'center', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid var(--ac)', background: 'var(--bg)', boxShadow: '0 0 0 2px var(--bg-1),0 0 0 4px var(--ac)', whiteSpace: 'nowrap' }}>
                  acme-design
                  <span className="vl-caret" style={{ height: 16, marginLeft: 1 }} />
                  <span style={{ color: 'var(--fg-3)' }}>.veloce.app</span>
                </div>
                <span style={{ fontSize: 12, color: 'var(--ac-text)' }}>Checking availability…</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: '1 / -1', maxWidth: '60%' }}>
                <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-2)' }}>Workspace URL</span>
                <div style={{ display: 'flex', alignItems: 'center', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid var(--err)', background: 'var(--bg)', boxShadow: '0 0 0 3px color-mix(in oklch,var(--err) 22%,transparent)', whiteSpace: 'nowrap' }}>
                  Acme Design
                  <span style={{ marginLeft: 'auto', color: 'var(--err)', fontSize: 12 }}>!</span>
                </div>
                <span style={{ fontSize: 12, color: 'var(--err)', display: 'flex', gap: 6 }}>
                  <span>⚠</span>Spaces and capitals aren’t allowed. Try “acme-design”.
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionTitle title="Switch" meta="thumb 180ms settle · track color 150ms" />
            <div style={{ ...framed, ...mono, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, fontSize: 11.5, color: 'var(--fg-3)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}><Switch state="off" />off</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}><Switch state="on" />on</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}><Switch state="focus" />focus</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}><Switch state="mid" />mid · t=90ms (thumb stretches)</div>
            </div>
          </div>
        </div>

        {/* ---------- Toast + Tabs ---------- */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionTitle title="Toast" meta="slide-in 250ms settle · exit 150ms · progress bar = timeout" />
            <div style={{ ...framed, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="vl-toast" style={{ gap: 12 }}>
                <div className="vl-toast__icon" style={{ background: 'color-mix(in oklch,var(--ok) 20%,transparent)', color: 'var(--ok)' }}>✓</div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div className="vl-toast__title">Deployed to production</div>
                  <div className="vl-toast__body" style={{ marginTop: 0 }}>v1.0.4 is live in 14 regions · 38s</div>
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ac-text)', alignSelf: 'center' }}>View</span>
                <span style={{ color: 'var(--fg-3)', fontSize: 12, alignSelf: 'center' }}>✕</span>
                <div className="vl-toast__bar" style={{ width: '62%', background: 'var(--ok)' }} />
              </div>
              <div className="vl-toast" style={{ gap: 12, borderColor: 'color-mix(in oklch,var(--err) 40%,var(--line-2))' }}>
                <div className="vl-toast__icon" style={{ background: 'color-mix(in oklch,var(--err) 20%,transparent)', color: 'var(--err)', fontSize: 12 }}>!</div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div className="vl-toast__title">Build failed</div>
                  <div className="vl-toast__body" style={{ marginTop: 0 }}>
                    Type error in <span style={{ ...mono, color: 'var(--fg-2)' }}>app/layout.tsx:42</span>
                  </div>
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg)', alignSelf: 'center', padding: '5px 10px', borderRadius: 6, border: '1px solid var(--line-2)' }}>Retry</span>
                <span style={{ color: 'var(--fg-3)', fontSize: 12, alignSelf: 'center' }}>✕</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionTitle title="Tabs" meta="indicator slides 200ms swift-out · segmented and underline" />
            <div style={{ ...framed, display: 'flex', flexDirection: 'column', gap: 20, fontSize: 13.5 }}>
              <div style={{ display: 'flex', alignSelf: 'flex-start', padding: 3, borderRadius: 9, background: 'var(--bg-2)', border: '1px solid var(--line)' }}>
                <span style={{ padding: '7px 14px', borderRadius: 6, color: 'var(--fg-2)' }}>Overview</span>
                <span style={{ padding: '7px 14px', borderRadius: 6, background: 'var(--bg)', color: 'var(--fg)', fontWeight: 500, boxShadow: 'var(--shadow-sm),0 0 0 2px var(--bg-2),0 0 0 4px var(--ac)' }}>Usage</span>
                <span style={{ padding: '7px 14px', borderRadius: 6, color: 'var(--fg-2)' }}>Billing</span>
                <span style={{ padding: '7px 14px', borderRadius: 6, color: 'var(--fg-2)', whiteSpace: 'nowrap' }}>
                  Members <span style={{ ...mono, fontSize: 10.5, padding: '1px 5px', borderRadius: 4, background: 'var(--bg-3)', marginLeft: 4 }}>12</span>
                </span>
              </div>
              <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--line)', position: 'relative' }}>
                <span style={{ padding: '8px 12px', color: 'var(--fg-2)' }}>Preview</span>
                <span style={{ padding: '8px 12px', color: 'var(--fg)', fontWeight: 500, position: 'relative' }}>
                  Code
                  <span style={{ position: 'absolute', left: 12, right: 12, bottom: -1, height: 2, borderRadius: 1, background: 'var(--ac)' }} />
                </span>
                <span style={{ padding: '8px 12px', color: 'var(--fg-2)' }}>Props</span>
                <span style={{ padding: '8px 12px', color: 'var(--fg-2)' }}>Motion</span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Command palette + Light mode ---------- */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionTitle title="Command Palette" meta="drop 200ms · results stagger 20ms · ⌘K" />
            <div className="vl-stage" style={{ padding: 32, border: '1px solid var(--line)', borderRadius: 12, display: 'grid', placeItems: 'center' }}>
              <div style={{ width: 560, borderRadius: 12, background: 'var(--bg-2)', border: '1px solid var(--line-2)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', fontSize: 13.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 50, padding: '0 16px', borderBottom: '1px solid var(--line)' }}>
                  <span style={{ color: 'var(--fg-3)', fontSize: 15 }}>⌕</span>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    deploy<span className="vl-caret" style={{ height: 17, marginLeft: 1 }} />
                  </span>
                  <span style={{ ...mono, marginLeft: 'auto', fontSize: 11, padding: '2px 6px', border: '1px solid var(--line-2)', borderRadius: 4, color: 'var(--fg-3)' }}>esc</span>
                </div>
                <div style={{ padding: 6, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <div style={{ ...mono, padding: '8px 10px 4px', fontSize: 10.5, letterSpacing: '.06em', color: 'var(--fg-3)' }}>ACTIONS</div>
                  <PaletteItem icon="↑" selected right="main → prod" kbd="↵">
                    <Match>Deploy</Match> to production
                  </PaletteItem>
                  <PaletteItem icon="⟲" kbd="⌘⇧D">
                    <Match>Deploy</Match> preview for current branch
                  </PaletteItem>
                  <PaletteItem icon="⏎">
                    Roll back last <Match>deploy</Match>ment
                  </PaletteItem>
                  <div style={{ ...mono, padding: '10px 10px 4px', fontSize: 10.5, letterSpacing: '.06em', color: 'var(--fg-3)' }}>DOCS</div>
                  <PaletteItem icon="¶" right="Guides">
                    <Match>Deploy</Match>ment settings
                  </PaletteItem>
                  <PaletteItem icon="¶" dim>
                    Environment variables &amp; <Match>deploy</Match> hooks
                  </PaletteItem>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 38, padding: '0 14px', borderTop: '1px solid var(--line)', fontSize: 12, color: 'var(--fg-3)' }}>
                  <span><span style={{ ...mono, color: 'var(--fg-2)' }}>↑↓</span> navigate</span>
                  <span><span style={{ ...mono, color: 'var(--fg-2)' }}>↵</span> run</span>
                  <span style={{ marginLeft: 'auto' }}>5 results · 3ms</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionTitle title="Light mode" meta="same tokens, scale read forwards" />
            <div
              style={{
                ...LIGHT_TOKENS,
                padding: 28, borderRadius: 12, background: 'var(--bg)', color: 'var(--fg)',
                border: '1px solid var(--line-2)', display: 'flex', flexDirection: 'column', gap: 20, fontSize: 13.5,
              }}
            >
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', height: 36, padding: '0 14px', borderRadius: 9, background: 'var(--ac)', color: 'var(--ac-fg)', fontSize: 14, fontWeight: 500, boxShadow: 'inset 0 1px 0 oklch(1 0 0/.2),var(--shadow-sm)' }}>Deploy</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', height: 36, padding: '0 14px', borderRadius: 9, background: 'var(--ac-soft)', color: 'var(--ac-text)', fontSize: 14, fontWeight: 500 }}>Soft</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', height: 36, padding: '0 14px', borderRadius: 9, border: '1px solid var(--line-2)', color: 'var(--fg)', fontSize: 14, fontWeight: 500, boxShadow: '0 0 0 2px var(--bg),0 0 0 4px var(--ac)' }}>Focused</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', height: 36, padding: '0 14px', borderRadius: 9, color: 'var(--fg-2)', fontSize: 14, fontWeight: 500 }}>Ghost</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-2)' }}>Email</span>
                <div style={{ display: 'flex', alignItems: 'center', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid var(--line-2)', background: 'var(--bg)', boxShadow: 'var(--shadow-sm)' }}>
                  mara@acme.co
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, padding: '14px 16px', border: '1px solid var(--line-2)', borderRadius: 10, background: 'var(--bg)', boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'color-mix(in oklch,var(--ok) 20%,transparent)', color: 'oklch(0.5 0.15 150)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>✓</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>Saved</div>
                  <div style={{ fontSize: 12.5, color: 'var(--fg-3)' }}>Changes synced to main</div>
                </div>
                <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>✕</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ position: 'relative', width: 38, height: 22, borderRadius: 999, background: 'var(--ac)', display: 'block' }}>
                  <span style={{ position: 'absolute', top: 2, left: 18, width: 18, height: 18, borderRadius: '50%', background: 'oklch(0.99 0 0)', boxShadow: 'var(--shadow-sm)' }} />
                </span>
                <span style={{ display: 'flex', padding: 3, borderRadius: 9, background: 'var(--bg-2)', border: '1px solid var(--line)' }}>
                  <span style={{ padding: '5px 11px', borderRadius: 6, color: 'var(--fg-2)', fontSize: 13 }}>Overview</span>
                  <span style={{ padding: '5px 11px', borderRadius: 6, background: 'var(--bg)', color: 'var(--fg)', fontWeight: 500, boxShadow: 'var(--shadow-sm)', fontSize: 13 }}>Usage</span>
                </span>
                <span style={{ padding: '3px 9px', borderRadius: 999, background: 'var(--ac-soft)', color: 'var(--ac-text)', fontSize: 12, fontWeight: 500 }}>Beta</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
