import { useState } from 'react'
import { Textarea } from 'veloce-ui'
import { Link } from 'react-router-dom'
import { ComponentDoc, Section, CodeBlock } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'States', id: 'states' },
]

const MAX = 280

export default function TextareaDoc() {
  const [value, setValue] = useState('Rolled out the new edge cache. Watch p99 latency for the next hour.')

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
          <Textarea
            id="deploy-notes"
            value={value}
            maxLength={MAX}
            autoResize
            onChange={(e) => setValue(e.target.value)}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-3)', alignSelf: 'flex-end' }}>
            {value.length} / {MAX}
          </span>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Textarea }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">const</span> [notes, setNotes] = useState(<span className="s">""</span>)
          {'\n\n'}
          <span className="p">&lt;</span>Textarea{'\n'}
          {'  '}<span className="p">value=</span>{'{'}notes{'}'}{'\n'}
          {'  '}<span className="p">onChange=</span>{'{'}e {'=>'} setNotes(e.target.value){'}'}{'\n'}
          {'  '}<span className="p">autoResize</span>{'\n'}
          {'  '}<span className="p">maxLength=</span>{'{'}280{'}'}{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="states" title="States">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Textarea defaultValue="Ship it." style={{ minHeight: 64, resize: 'none' }} />
            default
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Textarea size="sm" defaultValue="Compact size." style={{ minHeight: 64, resize: 'none' }} />
            small
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Textarea invalid defaultValue="" placeholder="required" style={{ minHeight: 64, resize: 'none' }} />
            invalid
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Textarea disabled defaultValue="Read-only after release." style={{ minHeight: 64, resize: 'none' }} />
            disabled
          </div>
        </div>
      </Section>
      <Section id="customization" title="Customization">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Textarea defaultValue="Emerald tinted" style={{ minHeight: 56, resize: 'none', ['--vl-textarea-border' as string]: 'oklch(0.72 0.16 155)', ['--vl-textarea-bg' as string]: 'color-mix(in oklch, oklch(0.72 0.16 155) 8%, var(--bg-2))' }} />
          <CodeBlock>
            <span className="p">&lt;</span>Textarea{'\n'}
            {'  '}<span className="p">style=</span>{'{{'}{'\n'}
            {'    '}<span className="s">'--vl-textarea-border'</span>: <span className="s">'oklch(0.72 0.16 155)'</span>,{'\n'}
            {'    '}<span className="s">'--vl-textarea-bg'</span>: <span className="s">'color-mix(...)'</span>,{'\n'}
            {'  '}{'}}'}{'\n'}
            <span className="p">/&gt;</span>
          </CodeBlock>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-3)' }}>
            Tokens: <code>--vl-textarea-bg</code>, <code>-border</code>, <code>-ring</code>, <code>-color</code>. See <Link to="/docs/customization" style={{ color: 'var(--ac-text)' }}>/docs/customization</Link>.
          </p>
        </div>
      </Section>
    </ComponentDoc>
  )
}
