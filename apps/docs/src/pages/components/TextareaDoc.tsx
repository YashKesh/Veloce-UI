import { useState } from 'react'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'States', id: 'states' },
]

const MAX = 280

const baseStyle: React.CSSProperties = {
  width: '100%', minHeight: 84, padding: '10px 12px', borderRadius: 8,
  border: '1px solid var(--line-2)', background: 'var(--bg)',
  fontSize: 13.5, lineHeight: 1.55, color: 'var(--fg)', resize: 'vertical',
  outline: 'none', fontFamily: 'inherit',
}

export default function TextareaDoc() {
  const [value, setValue] = useState('Rolled out the new edge cache. Watch p99 latency for the next hour.')
  const [focused, setFocused] = useState(false)

  return (
    <ComponentDoc
      slug="textarea"
      name="Textarea"
      description="A multi-line text field for longer input. The focus ring fades in over 150ms and the field resizes vertically."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 340 }}>
          <label htmlFor="deploy-notes" style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)' }}>
            Deploy notes
          </label>
          <textarea
            id="deploy-notes"
            value={value}
            maxLength={MAX}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              ...baseStyle,
              boxShadow: focused ? '0 0 0 2px var(--bg-1),0 0 0 4px var(--ac)' : undefined,
              transition: 'box-shadow 150ms',
            }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-3)', alignSelf: 'flex-end' }}>
            {value.length} / {MAX}
          </span>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Textarea }'} <span className="p">from</span> <span className="s">"@/components/ui/textarea"</span>
          {'\n\n'}
          <span className="p">const</span> [notes, setNotes] = useState(<span className="s">""</span>)
          {'\n\n'}
          <span className="p">&lt;</span>Textarea{'\n'}
          {'  '}<span className="p">value=</span>{'{'}notes{'}'}{'\n'}
          {'  '}<span className="p">onValueChange=</span>{'{'}setNotes{'}'}{'\n'}
          {'  '}<span className="p">label=</span><span className="s">"Deploy notes"</span>{'\n'}
          {'  '}<span className="p">maxLength=</span>{'{'}280{'}'}{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="states" title="States">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <textarea readOnly value="Ship it." style={{ ...baseStyle, minHeight: 64, resize: 'none' }} />
            default
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <textarea readOnly value="Ship it." style={{ ...baseStyle, minHeight: 64, resize: 'none', boxShadow: '0 0 0 2px var(--bg-1),0 0 0 4px var(--ac)' }} />
            focus
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <textarea readOnly value="" style={{ ...baseStyle, minHeight: 64, resize: 'none', border: '1px solid var(--err)' }} />
              <span style={{ fontSize: 12, color: 'var(--err)', fontFamily: 'inherit' }}>Deploy notes are required.</span>
            </div>
            error
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <textarea disabled value="Read-only after release." style={{ ...baseStyle, minHeight: 64, resize: 'none', background: 'var(--bg-1)', color: 'var(--fg-3)', opacity: 0.55 }} />
            disabled
          </div>
        </div>
      </Section>
    </ComponentDoc>
  )
}
