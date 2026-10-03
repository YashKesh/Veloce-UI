import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Variants', id: 'variants' },
]

const VARIANTS: Array<[string, string, string]> = [
  ['accent', 'vl-badge--accent', 'Highlight new or experimental features'],
  ['success', 'vl-badge--success', 'Healthy states — live, passing, ready'],
  ['error', 'vl-badge--error', 'Failures that need attention'],
  ['outline', 'vl-badge--outline', 'Neutral metadata — drafts, tiers, counts'],
  ['inverted', 'vl-badge--inverted', 'Version tags and high-contrast labels'],
]

export default function BadgeDoc() {
  return (
    <ComponentDoc
      slug="badge"
      name="Badge"
      description="A small status label. Static — no motion by design: badges are read at a glance and should never pulse, shimmer, or animate in."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            <span className="vl-badge vl-badge--accent">Beta</span>
            <span className="vl-badge vl-badge--success">Live</span>
            <span className="vl-badge vl-badge--error">Failed</span>
            <span className="vl-badge vl-badge--outline">Draft</span>
            <span className="vl-badge vl-badge--inverted">v1.0</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            <span className="vl-badge vl-badge--outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ok)' }} />
              Operational
            </span>
            <span className="vl-badge vl-badge--outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--err)' }} />
              Degraded
            </span>
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Badge }'} <span className="p">from</span> <span className="s">"@/components/ui/badge"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Badge <span className="p">variant=</span><span className="s">"success"</span><span className="p">&gt;</span>Live<span className="p">&lt;/</span>Badge<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;</span>Badge <span className="p">variant=</span><span className="s">"outline"</span> <span className="p">dot=</span><span className="s">"ok"</span><span className="p">&gt;</span>Operational<span className="p">&lt;/</span>Badge<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="variants" title="Variants">
        <div className="vl-panel" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '110px 180px 1fr', gap: '0 16px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', letterSpacing: '.05em', paddingBottom: 10, borderBottom: '1px solid var(--line)' }}>
            <span>VARIANT</span>
            <span>CLASS</span>
            <span>USE CASE</span>
          </div>
          {VARIANTS.map(([name, cls, use], i) => (
            <div
              key={name}
              style={{
                display: 'grid', gridTemplateColumns: '110px 180px 1fr', gap: '0 16px', alignItems: 'baseline',
                padding: '11px 0', borderBottom: i < VARIANTS.length - 1 ? '1px solid var(--line)' : 'none',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg)' }}>{name}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ac-text)' }}>{cls}</span>
              <span style={{ fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.5 }}>{use}</span>
            </div>
          ))}
        </div>
      </Section>
    </ComponentDoc>
  )
}
