import { useState } from 'react'
import { Collapsible } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Controlled', id: 'controlled' },
]

export default function CollapsibleDoc() {
  const [open, setOpen] = useState(false)

  return (
    <ComponentDoc
      slug="collapsible"
      name="Collapsible"
      description="A single open/close region. Lighter than Accordion when you only need one disclosure — a show-more link, an advanced-options panel, a sidebar section."
      toc={TOC}
      preview={
        <div style={{ width: 360 }}>
          <Collapsible defaultOpen={false}>
            <Collapsible.Trigger
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                width: '100%', padding: '10px 14px',
                border: '1px solid var(--line-2)', borderRadius: 8,
                background: 'var(--bg-1)', fontSize: 13.5, color: 'var(--fg)',
              }}
            >
              <span>Advanced options</span>
              <span style={{ color: 'var(--fg-3)' }}>⌄</span>
            </Collapsible.Trigger>
            <Collapsible.Content>
              <div style={{ padding: '14px', marginTop: 8, border: '1px solid var(--line)', borderRadius: 8, fontSize: 13, lineHeight: 1.55, color: 'var(--fg-2)' }}>
                These settings tune the deploy. Only touch them if you know why.
                <ul style={{ margin: '8px 0 0 18px', color: 'var(--fg-3)' }}>
                  <li>Edge cache TTL</li>
                  <li>Build concurrency</li>
                  <li>Preview retention</li>
                </ul>
              </div>
            </Collapsible.Content>
          </Collapsible>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Collapsible }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Collapsible<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Collapsible.Trigger<span className="p">&gt;</span>Advanced options<span className="p">&lt;/</span>Collapsible.Trigger<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Collapsible.Content<span className="p">&gt;</span>…hidden…<span className="p">&lt;/</span>Collapsible.Content<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;/</span>Collapsible<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="controlled" title="Controlled">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setOpen((v) => !v)}
              style={{ padding: '6px 12px', borderRadius: 7, border: '1px solid var(--line-2)', background: 'var(--bg-1)', fontSize: 13 }}
            >
              {open ? 'Close externally' : 'Open externally'}
            </button>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)', alignSelf: 'center' }}>
              state: {open ? 'open' : 'closed'}
            </span>
          </div>
          <Collapsible open={open} onOpenChange={setOpen}>
            <Collapsible.Content>
              <div style={{ padding: 14, border: '1px solid var(--line)', borderRadius: 8, fontSize: 13, color: 'var(--fg-2)' }}>
                I'm controlled from outside — click the button above.
              </div>
            </Collapsible.Content>
          </Collapsible>
        </div>
      </Section>
    </ComponentDoc>
  )
}
