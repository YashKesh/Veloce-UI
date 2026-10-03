import { useState } from 'react'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'States', id: 'states' },
]

const REGIONS = ['us-east-1', 'eu-west-2', 'ap-south-1', 'sa-east-1']

export default function SelectDoc() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState('us-east-1')

  return (
    <ComponentDoc
      slug="select"
      name="Select"
      description="A dropdown listbox for picking one value from a set. The menu unfolds over 200ms from the trigger with a subtle scale-Y ease."
      toc={TOC}
      preview={
        <div style={{ position: 'relative', width: 220, alignSelf: 'flex-start', marginTop: 24 }}>
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', height: 36, padding: '0 12px', borderRadius: 8,
              border: '1px solid var(--line-2)', background: 'var(--bg)',
              fontSize: 13.5, color: 'var(--fg)', cursor: 'pointer',
            }}
          >
            {selected}
            <span style={{ color: 'var(--fg-3)', transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 200ms' }}>⌄</span>
          </button>
          {open && (
            <div
              role="listbox"
              style={{
                position: 'absolute', top: 42, left: 0, right: 0, padding: 4,
                borderRadius: 9, background: 'var(--bg-2)', border: '1px solid var(--line-2)',
                boxShadow: 'var(--shadow-md)', fontSize: 13, transformOrigin: 'top', zIndex: 5,
              }}
            >
              {REGIONS.map((r) => {
                const isSel = r === selected
                return (
                  <div
                    key={r}
                    role="option"
                    aria-selected={isSel}
                    onClick={() => { setSelected(r); setOpen(false) }}
                    style={{
                      padding: '7px 9px', borderRadius: 6, cursor: 'pointer',
                      display: 'flex', justifyContent: 'space-between',
                      background: isSel ? 'var(--bg-3)' : undefined,
                      color: isSel ? 'var(--fg)' : 'var(--fg-2)',
                    }}
                  >
                    {r}
                    {isSel && <span style={{ color: 'var(--ac-text)' }}>✓</span>}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Select }'} <span className="p">from</span> <span className="s">"@/components/ui/select"</span>
          {'\n\n'}
          <span className="p">const</span> [region, setRegion] = useState(<span className="s">"us-east-1"</span>)
          {'\n\n'}
          <span className="p">&lt;</span>Select{'\n'}
          {'  '}<span className="p">value=</span>{'{'}region{'}'}{'\n'}
          {'  '}<span className="p">onValueChange=</span>{'{'}setRegion{'}'}{'\n'}
          {'  '}<span className="p">options=</span>{'{['}<span className="s">"us-east-1"</span>, <span className="s">"eu-west-2"</span>, <span className="s">"ap-south-1"</span>{']}'}{'\n'}
          {'  '}<span className="p">placeholder=</span><span className="s">"Region"</span>{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="states" title="States">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 36, padding: '0 12px', borderRadius: 8, border: '1px solid var(--line-2)', background: 'var(--bg)', fontSize: 13.5, color: 'var(--fg)' }}>
              us-east-1<span style={{ color: 'var(--fg-3)' }}>⌄</span>
            </div>
            closed
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 36, padding: '0 12px', borderRadius: 8, border: '1px solid var(--line-2)', background: 'var(--bg)', fontSize: 13.5, color: 'var(--fg)' }}>
                us-east-1<span style={{ color: 'var(--fg-3)' }}>⌃</span>
              </div>
              <div style={{ marginTop: 6, padding: 4, borderRadius: 9, background: 'var(--bg-2)', border: '1px solid var(--line-2)', boxShadow: 'var(--shadow-md)', fontSize: 13 }}>
                <div style={{ padding: '7px 9px', borderRadius: 6, background: 'var(--bg-3)', display: 'flex', justifyContent: 'space-between', color: 'var(--fg)' }}>
                  us-east-1<span style={{ color: 'var(--ac-text)' }}>✓</span>
                </div>
                <div style={{ padding: '7px 9px', color: 'var(--fg-2)' }}>eu-west-2</div>
              </div>
            </div>
            open
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 36, padding: '0 12px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--bg-1)', fontSize: 13.5, color: 'var(--fg-3)', opacity: 0.55 }}>
              us-east-1<span>⌄</span>
            </div>
            disabled
          </div>
        </div>
      </Section>
    </ComponentDoc>
  )
}
