import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Fallbacks', id: 'fallbacks' },
]

const HUES = {
  violet: 'oklch(0.55 0.12 292)',
  cyan: 'oklch(0.6 0.12 200)',
  orange: 'oklch(0.62 0.12 40)',
} as const

function Avatar({
  size, initials, hue = 'violet', style,
}: {
  size: number
  initials: string
  hue?: keyof typeof HUES
  style?: React.CSSProperties
}) {
  return (
    <span
      style={{
        width: size, height: size, borderRadius: 999,
        background: HUES[hue],
        color: 'rgba(255,255,255,0.95)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 600,
        fontSize: Math.round(size * 0.34),
        flexShrink: 0, ...style,
      }}
    >
      {initials}
    </span>
  )
}

export default function AvatarDoc() {
  return (
    <ComponentDoc
      slug="avatar"
      name="Avatar"
      description="A user image with initials fallback. Images crossfade 200ms on image load — no pop-in, ever."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar size={24} initials="YK" hue="violet" />
            <Avatar size={32} initials="AM" hue="cyan" />
            <Avatar size={40} initials="RS" hue="orange" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {(['violet', 'cyan', 'orange'] as const).map((h, i) => (
              <Avatar
                key={h}
                size={36}
                initials={['YK', 'AM', 'RS'][i]}
                hue={h}
                style={{ marginLeft: i === 0 ? 0 : -8, border: '2px solid var(--bg-1)' }}
              />
            ))}
            <span
              style={{
                width: 36, height: 36, borderRadius: 999, marginLeft: -8,
                background: 'var(--bg-3)', border: '2px solid var(--bg-1)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 600, fontSize: 12, color: 'var(--fg-2)',
              }}
            >
              +9
            </span>
          </div>
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <Avatar size={40} initials="YK" hue="violet" />
            <span
              style={{
                position: 'absolute', right: 0, bottom: 0,
                width: 11, height: 11, borderRadius: 999,
                background: 'var(--ok)', border: '2px solid var(--bg)',
              }}
            />
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Avatar }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Avatar{'\n'}
          {'  '}<span className="p">src=</span><span className="s">"/team/yash.png"</span>{'\n'}
          {'  '}<span className="p">alt=</span><span className="s">"Yash Kesharwani"</span>{'\n'}
          {'  '}<span className="p">fallback=</span><span className="s">"YK"</span>{'\n'}
          {'  '}<span className="p">size=</span>{'{40}'}{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="fallbacks" title="Fallbacks">
        <div className="vl-panel" style={{ padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--fg-2)' }}>
            image <span style={{ color: 'var(--fg-3)' }}>→</span> initials <span style={{ color: 'var(--fg-3)' }}>→</span> icon
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--fg-3)', margin: 0 }}>
            Initials render immediately. When the image finishes loading it crossfades in over
            200ms on top of the fallback. If the image errors, the initials stay; if no name is
            available, a generic person icon is the final fallback.
          </p>
        </div>
      </Section>
    </ComponentDoc>
  )
}
