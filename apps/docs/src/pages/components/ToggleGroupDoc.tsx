import { useState } from 'react'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Modes', id: 'modes' },
]

const ALIGNMENTS = ['Left', 'Center', 'Right']
const FORMATS = [
  { id: 'bold', label: 'B', weight: 700 },
  { id: 'italic', label: 'I', italic: true },
  { id: 'underline', label: 'U', underline: true },
]

export default function ToggleGroupDoc() {
  const [align, setAlign] = useState('Left')
  const [formats, setFormats] = useState<string[]>(['bold'])

  const toggleFormat = (id: string) =>
    setFormats((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))

  return (
    <ComponentDoc
      slug="toggle-group"
      name="Toggle group"
      description="A set of two-state buttons — single-select or multi-select. The active background slides between items over 200ms."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
          <div
            role="radiogroup"
            aria-label="Text alignment"
            style={{
              display: 'inline-flex', border: '1px solid var(--line-2)',
              borderRadius: 9, overflow: 'hidden',
            }}
          >
            {ALIGNMENTS.map((a, i) => {
              const active = align === a
              return (
                <button
                  key={a}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setAlign(a)}
                  style={{
                    height: 34, padding: '0 14px', border: 'none', cursor: 'pointer',
                    borderLeft: i > 0 ? '1px solid var(--line-2)' : 'none',
                    background: active ? 'var(--bg-3)' : 'transparent',
                    color: active ? 'var(--fg)' : 'var(--fg-2)',
                    fontSize: 13, fontWeight: 500,
                    transition: 'background 200ms, color 200ms',
                  }}
                >
                  {a}
                </button>
              )
            })}
          </div>
          <div
            role="group"
            aria-label="Text formatting"
            style={{
              display: 'inline-flex', border: '1px solid var(--line-2)',
              borderRadius: 9, overflow: 'hidden',
            }}
          >
            {FORMATS.map((f, i) => {
              const active = formats.includes(f.id)
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleFormat(f.id)}
                  style={{
                    height: 34, padding: '0 14px', border: 'none', cursor: 'pointer',
                    borderLeft: i > 0 ? '1px solid var(--line-2)' : 'none',
                    background: active ? 'var(--bg-3)' : 'transparent',
                    color: active ? 'var(--fg)' : 'var(--fg-2)',
                    fontSize: 13,
                    fontWeight: f.weight ?? 500,
                    fontStyle: f.italic ? 'italic' : undefined,
                    textDecoration: f.underline ? 'underline' : undefined,
                    transition: 'background 200ms, color 200ms',
                  }}
                >
                  {f.label}
                </button>
              )
            })}
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ ToggleGroup, ToggleItem }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">const</span> [align, setAlign] = useState(<span className="s">"left"</span>)
          {'\n\n'}
          <span className="p">&lt;</span>ToggleGroup <span className="p">type=</span><span className="s">"single"</span> <span className="p">value=</span>{'{'}align{'}'} <span className="p">onValueChange=</span>{'{'}setAlign{'}'}<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>ToggleItem <span className="p">value=</span><span className="s">"left"</span><span className="p">&gt;</span>Left<span className="p">&lt;/</span>ToggleItem<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>ToggleItem <span className="p">value=</span><span className="s">"center"</span><span className="p">&gt;</span>Center<span className="p">&lt;/</span>ToggleItem<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>ToggleItem <span className="p">value=</span><span className="s">"right"</span><span className="p">&gt;</span>Right<span className="p">&lt;/</span>ToggleItem<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;/</span>ToggleGroup<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="modes" title="Modes">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16, fontSize: 13.5, lineHeight: 1.6, color: 'var(--fg-2)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ac-text)' }}>type="single"</span>
            <span>Exactly one item is active at a time — clicking another item moves the selection. Ideal for mutually exclusive choices like text alignment.</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ac-text)' }}>type="multiple"</span>
            <span>Any number of items can be active, each toggling independently. Ideal for compounding options like bold, italic, and underline.</span>
          </div>
        </div>
      </Section>
    </ComponentDoc>
  )
}
