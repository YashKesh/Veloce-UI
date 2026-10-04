import { useState } from 'react'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Variants', id: 'variants' },
]

const ALL_CHIPS = ['react', 'typescript', 'motion', 'a11y']
const SELECTABLE = ['drafts', 'published', 'archived']

function chipBase(extra?: React.CSSProperties): React.CSSProperties {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 7,
    height: 28, padding: '0 12px', borderRadius: 999, fontSize: 13,
    background: 'var(--bg-3)', border: 'none',
    color: 'var(--fg-2)', lineHeight: 1, boxSizing: 'border-box', ...extra,
  }
}

const removeDisc: React.CSSProperties = {
  width: 16, height: 16, borderRadius: 999,
  background: 'transparent', border: '1px solid var(--line-2)',
  padding: 0, cursor: 'pointer', color: 'var(--fg-3)',
  fontSize: 9, lineHeight: 1,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0, boxSizing: 'border-box',
}

const selectedChip: React.CSSProperties = {
  border: '1px solid var(--ac)', background: 'var(--ac-soft)', color: 'var(--ac-text)',
}

const unselectedChip: React.CSSProperties = {
  border: '1px solid var(--line-2)', background: 'transparent', color: 'var(--fg-2)',
}

export default function ChipDoc() {
  const [chips, setChips] = useState(ALL_CHIPS)
  const [selected, setSelected] = useState<string[]>(['published'])
  return (
    <ComponentDoc
      slug="chip"
      name="Chip"
      description="Compact tokens for filters and selections. On remove, the chip's exit scales down 150ms before the row reflows."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 320 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {chips.map((c) => (
              <span key={c} style={chipBase()}>
                {c}
                <button
                  type="button"
                  aria-label={`Remove ${c}`}
                  onClick={() => setChips((prev) => prev.filter((x) => x !== c))}
                  style={removeDisc}
                >
                  ✕
                </button>
              </span>
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
                <button
                  key={c}
                  type="button"
                  aria-pressed={on}
                  onClick={() =>
                    setSelected((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))
                  }
                  style={chipBase({
                    cursor: 'pointer',
                    ...(on ? selectedChip : unselectedChip),
                  })}
                >
                  {on ? `✓ ${c}` : c}
                </button>
              )
            })}
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Chip }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Chip{'\n'}
          {'  '}<span className="p">label=</span><span className="s">"typescript"</span>{'\n'}
          {'  '}<span className="p">onRemove=</span>{'{'}() <span className="p">=&gt;</span> removeTag(<span className="s">"typescript"</span>){'}'}{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="variants" title="Variants">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <span style={chipBase()}>filter <span style={removeDisc}>✕</span></span>
            removable
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <span style={chipBase(selectedChip)}>✓ Motion</span>
            selected
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <span style={chipBase(unselectedChip)}>filter</span>
            unselected
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <span style={chipBase({ boxShadow: '0 0 0 2px var(--bg-1), 0 0 0 4px var(--ac)' })}>filter</span>
            focus
          </div>
        </div>
      </Section>
    </ComponentDoc>
  )
}
