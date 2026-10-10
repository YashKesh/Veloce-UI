import { Accordion } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Behavior', id: 'behavior' },
]

const ITEMS: Array<{ value: string; q: string; a: string }> = [
  { value: 'shake', q: 'Is it tree-shakeable?', a: 'Yes. Every component is a separate entry point — import only what you use and the bundler drops the rest.' },
  { value: 'js', q: 'Does it ship JS?', a: 'Only the component. Motion is CSS — the height transition is a single transition rule, no animation library.' },
  { value: 'theme', q: 'Can I theme it?', a: 'Everything reads from CSS variables, so a theme is just a class that overrides --ac, --bg, and friends.' },
]

const NOTES: Array<[string, string]> = [
  ['single vs multiple', 'Default is single-open: expanding one item collapses the rest. Pass type="multiple" to allow any number open.'],
  ['height 250ms', 'The body animates max-height over 250ms ease, so items of any length open smoothly.'],
  ['reduced motion', 'When prefers-reduced-motion is set, the transition is dropped and items snap open instantly.'],
]

export default function AccordionDoc() {
  return (
    <ComponentDoc
      slug="accordion"
      name="Accordion"
      description="Vertically stacked disclosure sections. Opening an item animates its height 250ms ease while the previous item collapses — one item open at a time by default."
      toc={TOC}
      preview={
        <div style={{ width: 360 }}>
          <Accordion type="single" defaultValue="js">
            {ITEMS.map((it) => (
              <Accordion.Item key={it.value} value={it.value}>
                <Accordion.Trigger>{it.q}</Accordion.Trigger>
                <Accordion.Content>{it.a}</Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Accordion }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Accordion <span className="p">type=</span><span className="s">"single"</span> <span className="p">defaultValue=</span><span className="s">"js"</span><span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Accordion.Item <span className="p">value=</span><span className="s">"shake"</span><span className="p">&gt;</span>{'\n'}
          {'    '}<span className="p">&lt;</span>Accordion.Trigger<span className="p">&gt;</span>Is it tree-shakeable?<span className="p">&lt;/</span>Accordion.Trigger<span className="p">&gt;</span>{'\n'}
          {'    '}<span className="p">&lt;</span>Accordion.Content<span className="p">&gt;</span>Yes — every component ships separately.<span className="p">&lt;/</span>Accordion.Content<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;/</span>Accordion.Item<span className="p">&gt;</span>{'\n'}
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
