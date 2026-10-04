import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Orientation', id: 'orientation' },
]

function HRule() {
  return <div style={{ height: 1, background: 'var(--line)' }} />
}

function VRule() {
  return <span style={{ width: 1, height: 14, background: 'var(--line)', display: 'inline-block' }} />
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 18px', fontSize: 13.5 }}>
      <span style={{ color: 'var(--fg)' }}>{label}</span>
      <span style={{ color: 'var(--fg-3)', fontSize: 12.5 }}>{value}</span>
    </div>
  )
}

export default function SeparatorDoc() {
  return (
    <ComponentDoc
      slug="separator"
      name="Separator"
      description="Zero motion. A separator that animates is a progress bar."
      toc={TOC}
      preview={
        <div style={{ minWidth: 320, border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-1)', overflow: 'hidden' }}>
          <Row label="Appearance" value="Dark" />
          <HRule />
          <Row label="Accent" value="Violet" />
          <HRule />
          <Row label="Density" value="Comfortable" />
          <HRule />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 18px', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
            <span>Docs</span>
            <VRule />
            <span>GitHub</span>
            <VRule />
            <span>v1.0.4</span>
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Separator }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Separator <span className="p">/&gt;</span>{'\n'}
          <span className="p">&lt;</span>Separator <span className="p">orientation=</span><span className="s">"vertical"</span> <span className="p">/&gt;</span>{'\n'}
          <span className="p">&lt;</span>Separator <span className="p">label=</span><span className="s">"OR"</span> <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="orientation" title="Orientation">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ paddingTop: 10 }}><HRule /></div>
            horizontal
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--fg-2)' }}>
              <span>left</span>
              <VRule />
              <span>right</span>
            </div>
            vertical
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 4 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
              <span style={{ fontSize: 10.5, color: 'var(--fg-3)' }}>OR</span>
              <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
            </div>
            labeled
          </div>
        </div>
      </Section>
    </ComponentDoc>
  )
}
