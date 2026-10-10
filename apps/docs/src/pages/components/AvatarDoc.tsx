import { Avatar } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Sizes', id: 'sizes' },
]

export default function AvatarDoc() {
  return (
    <ComponentDoc
      slug="avatar"
      name="Avatar"
      description="A user image with initials fallback. The hue derives from the name so stacks of avatars read consistently without manual color assignment."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar name="Yash Kesharwani" size="sm" />
            <Avatar name="Alex Miller" size="md" />
            <Avatar name="Rina Shah" size="lg" />
            <Avatar name="Priya Rao" size={56} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {['Yash Kesharwani', 'Alex Miller', 'Rina Shah'].map((n, i) => (
              <Avatar
                key={n}
                name={n}
                size="md"
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
            <Avatar name="Yash Kesharwani" size={40} />
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
          {'  '}<span className="p">name=</span><span className="s">"Yash Kesharwani"</span>{'\n'}
          {'  '}<span className="p">src=</span><span className="s">"/team/yash.png"</span>{'\n'}
          {'  '}<span className="p">size=</span><span className="s">"md"</span>{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="sizes" title="Sizes">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', gap: 32, alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            <Avatar name="Yash K" size="sm" />
            sm
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            <Avatar name="Yash K" size="md" />
            md
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            <Avatar name="Yash K" size="lg" />
            lg
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            <Avatar name="Yash K" size={64} />
            64 (custom)
          </div>
        </div>
      </Section>
    </ComponentDoc>
  )
}
