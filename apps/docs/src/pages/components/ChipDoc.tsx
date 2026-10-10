import { useState } from 'react'
import { Chip } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Variants', id: 'variants' },
]

const ALL_CHIPS = ['react', 'typescript', 'motion', 'a11y']
const SELECTABLE = ['drafts', 'published', 'archived']

export default function ChipDoc() {
  const [chips, setChips] = useState(ALL_CHIPS)
  const [selected, setSelected] = useState<string[]>(['published'])

  return (
    <ComponentDoc
      slug="chip"
      name="Chip"
      description="Compact tokens for filters and selections. Pass onRemove to show a dismiss affordance."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 320 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {chips.map((c) => (
              <Chip key={c} onRemove={() => setChips((prev) => prev.filter((x) => x !== c))}>
                {c}
              </Chip>
            ))}
            {chips.length < ALL_CHIPS.length && (
              <button
                type="button"
                onClick={() => setChips(ALL_CHIPS)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12.5, color: 'var(--ac-text)', padding: '4px 6px' }}
              >
                Reset
              </button>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {SELECTABLE.map((c) => {
              const on = selected.includes(c)
              return (
                <Chip
                  key={c}
                  tone={on ? 'accent' : 'neutral'}
                  variant={on ? 'soft' : 'outline'}
                  onClick={() =>
                    setSelected((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))
                  }
                  style={{ cursor: 'pointer' }}
                >
                  {on ? `✓ ${c}` : c}
                </Chip>
              )
            })}
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Chip }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Chip <span className="p">onRemove=</span>{'{'}() <span className="p">=&gt;</span> remove(<span className="s">"typescript"</span>){'}'}<span className="p">&gt;</span>{'\n'}
          {'  '}typescript{'\n'}
          <span className="p">&lt;/</span>Chip<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="variants" title="Variants">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: 'repeat(5, auto)', gap: '20px 24px', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
          <span>variant →</span>
          <span>neutral</span><span>accent</span><span>ok</span><span>err</span>
          <span>solid</span>
          <Chip tone="neutral" variant="solid">tag</Chip>
          <Chip tone="accent" variant="solid">tag</Chip>
          <Chip tone="ok" variant="solid">tag</Chip>
          <Chip tone="err" variant="solid">tag</Chip>
          <span>soft</span>
          <Chip tone="neutral" variant="soft">tag</Chip>
          <Chip tone="accent" variant="soft">tag</Chip>
          <Chip tone="ok" variant="soft">tag</Chip>
          <Chip tone="err" variant="soft">tag</Chip>
          <span>outline</span>
          <Chip tone="neutral" variant="outline">tag</Chip>
          <Chip tone="accent" variant="outline">tag</Chip>
          <Chip tone="ok" variant="outline">tag</Chip>
          <Chip tone="err" variant="outline">tag</Chip>
        </div>
      </Section>
    </ComponentDoc>
  )
}
