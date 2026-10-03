import { useState } from 'react'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Behavior', id: 'behavior' },
]

const ITEMS: Array<[string, string]> = [
  ['Is it tree-shakeable?', 'Yes. Every component is a separate entry point — import only what you use and the bundler drops the rest.'],
  ['Does it ship JS?', 'Only the component. Motion is CSS — the height transition is a single transition rule, no animation library.'],
  ['Can I theme it?', 'Everything reads from CSS variables, so a theme is just a class that overrides --ac, --bg, and friends.'],
]

const NOTES: Array<[string, string]> = [
  ['single vs multiple', 'Default is single-open: expanding one item collapses the rest. Pass type="multiple" to allow any number open.'],
  ['height 250ms', 'The body animates max-height over 250ms ease, so items of any length open smoothly.'],
  ['reduced motion', 'When prefers-reduced-motion is set, the transition is dropped and items snap open instantly.'],
]

export default function AccordionDoc() {
  const [open, setOpen] = useState<number | null>(1)
  return (
    <ComponentDoc
      slug="accordion"
      name="Accordion"
      description="Vertically stacked disclosure sections. Opening an item animates its height 250ms ease while the previous item collapses — one item open at a time by default."
      toc={TOC}
      preview={
        <div style={{ width: 340, fontSize: 13.5, border: '1px solid var(--line-2)', borderRadius: 10, background: 'var(--bg)', overflow: 'hidden' }}>
          {ITEMS.map(([q, a], i) => {
            const isOpen = open === i
            return (
              <div key={q} style={{ borderBottom: i < ITEMS.length - 1 ? '1px solid var(--line)' : 'none' }}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    width: '100%', padding: '12px 14px', background: 'none', border: 'none',
                    font: 'inherit', color: 'var(--fg)', cursor: 'pointer', textAlign: 'left',
                    fontWeight: isOpen ? 500 : 400,
                  }}
                >
                  {q}
                  <span style={{ color: isOpen ? 'var(--ac-text)' : 'var(--fg-3)', flex: 'none' }}>
                    {isOpen ? '⌃' : '⌄'}
                  </span>
                </button>
                <div
                  style={{
                    maxHeight: isOpen ? 120 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 250ms ease',
                  }}
                >
                  <div style={{ padding: '0 14px 13px', color: 'var(--fg-2)', fontSize: 13, lineHeight: 1.55 }}>{a}</div>
                </div>
              </div>
            )
          })}
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Accordion, AccordionItem }'} <span className="p">from</span> <span className="s">"@/components/ui/accordion"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Accordion <span className="p">type=</span><span className="s">"single"</span> <span className="p">defaultValue=</span><span className="s">"js"</span><span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>AccordionItem <span className="p">value=</span><span className="s">"shake"</span> <span className="p">title=</span><span className="s">"Is it tree-shakeable?"</span><span className="p">&gt;</span>{'\n'}
          {'    '}Yes — every component is a separate entry point.{'\n'}
          {'  '}<span className="p">&lt;/</span>AccordionItem<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>AccordionItem <span className="p">value=</span><span className="s">"js"</span> <span className="p">title=</span><span className="s">"Does it ship JS?"</span><span className="p">&gt;</span>{'\n'}
          {'    '}Only the component. Motion is CSS.{'\n'}
          {'  '}<span className="p">&lt;/</span>AccordionItem<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;/</span>Accordion<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="behavior" title="Behavior">
        <div className="vl-panel" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column' }}>
          {NOTES.map(([label, note], i) => (
            <div
              key={label}
              style={{
                display: 'grid', gridTemplateColumns: '150px 1fr', gap: 16, alignItems: 'baseline',
                padding: '11px 0', borderBottom: i < NOTES.length - 1 ? '1px solid var(--line)' : 'none',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ac-text)' }}>{label}</span>
              <span style={{ fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.5 }}>{note}</span>
            </div>
          ))}
        </div>
      </Section>
    </ComponentDoc>
  )
}
