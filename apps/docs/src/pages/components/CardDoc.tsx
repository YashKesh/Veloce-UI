import { useState } from 'react'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Composition', id: 'composition' },
]

const PARTS: Array<[string, string]> = [
  ['Card', 'Root container. Owns the border, radius, and hover lift.'],
  ['CardMedia', 'Full-bleed header slot for gradients, images, or charts.'],
  ['CardTitle', 'Semibold heading, 13.5px, truncates on overflow.'],
  ['CardMeta', 'Muted supporting line under the title.'],
  ['CardFooter', 'Optional action row, separated by a hairline border.'],
]

function DemoCard({
  title, meta, gradient, footer,
}: { title: string; meta: string; gradient: string; footer?: string }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 210,
        borderRadius: 10,
        border: '1px solid var(--line-2)',
        background: 'var(--bg)',
        overflow: 'hidden',
        fontSize: 13,
        cursor: 'pointer',
        transform: hover ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hover ? 'var(--shadow-md)' : 'none',
        transition: 'transform 200ms ease, box-shadow 200ms ease',
      }}
    >
      <div style={{ height: 62, background: gradient }} />
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>{meta}</div>
      </div>
      {footer ? (
        <div style={{ padding: '9px 12px', borderTop: '1px solid var(--line)', fontSize: 12, color: 'var(--ac-text)', fontWeight: 500 }}>
          {footer}
        </div>
      ) : null}
    </div>
  )
}

export default function CardDoc() {
  return (
    <ComponentDoc
      slug="card"
      name="Card"
      description="A surface for grouped content. The whole card lifts 3px on hover — lift 200ms with a matching shadow — so lists of cards feel tactile without any JS."
      toc={TOC}
      preview={
        <>
          <DemoCard
            title="Edge Functions"
            meta="Deploy in 14 regions"
            gradient="linear-gradient(135deg,var(--ac-soft),var(--bg-3))"
            footer="View docs →"
          />
          <DemoCard
            title="Analytics"
            meta="Realtime, privacy-first"
            gradient="linear-gradient(135deg,var(--bg-3),var(--ac-soft))"
            footer="Enable →"
          />
        </>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Card, CardMedia, CardTitle, CardMeta }'} <span className="p">from</span> <span className="s">"@/components/ui/card"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Card<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>CardMedia <span className="p">src=</span><span className="s">"/edge.png"</span> <span className="p">/&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>CardTitle<span className="p">&gt;</span>Edge Functions<span className="p">&lt;/</span>CardTitle<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>CardMeta<span className="p">&gt;</span>Deploy in 14 regions<span className="p">&lt;/</span>CardMeta<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;/</span>Card<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="composition" title="Composition">
        <div className="vl-panel" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {PARTS.map(([part, desc], i) => (
            <div
              key={part}
              style={{
                display: 'grid', gridTemplateColumns: '140px 1fr', gap: 16, alignItems: 'baseline',
                padding: '11px 0', borderBottom: i < PARTS.length - 1 ? '1px solid var(--line)' : 'none',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ac-text)' }}>{part}</span>
              <span style={{ fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.5 }}>{desc}</span>
            </div>
          ))}
        </div>
      </Section>
    </ComponentDoc>
  )
}
