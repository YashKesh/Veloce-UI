import { useState } from 'react'
import { Select } from 'veloce-ui'
import { Link } from 'react-router-dom'
import { ComponentDoc, Section, CodeBlock } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'States', id: 'states' },
]

const REGION_OPTIONS = [
  { value: 'us-east-1', label: 'us-east-1' },
  { value: 'eu-west-2', label: 'eu-west-2' },
  { value: 'ap-south-1', label: 'ap-south-1' },
  { value: 'sa-east-1', label: 'sa-east-1' },
]

export default function SelectDoc() {
  const [selected, setSelected] = useState('us-east-1')

  return (
    <ComponentDoc
      slug="select"
      name="Select"
      description="A dropdown listbox for picking one value from a set. Native select under the hood for perfect mobile + a11y behavior."
      toc={TOC}
      preview={
        <div style={{ width: 240 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--fg)' }}>
            Region
          </label>
          <Select
            value={selected}
            onValueChange={setSelected}
            options={REGION_OPTIONS}
            placeholder="Select a region"
          />
          <div style={{ marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
            selected: {selected}
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Select }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">const</span> [region, setRegion] = useState(<span className="s">"us-east-1"</span>)
          {'\n\n'}
          <span className="p">&lt;</span>Select{'\n'}
          {'  '}<span className="p">value=</span>{'{'}region{'}'}{'\n'}
          {'  '}<span className="p">onValueChange=</span>{'{'}setRegion{'}'}{'\n'}
          {'  '}<span className="p">options=</span>{'{'}[{'{'} value: <span className="s">"us-east-1"</span>, label: <span className="s">"us-east-1"</span> {'}'}]{'}'}{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="states" title="States">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Select options={REGION_OPTIONS} placeholder="Pick one" />
            default
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Select size="sm" options={REGION_OPTIONS} defaultValue="us-east-1" />
            small
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Select invalid options={REGION_OPTIONS} placeholder="required" />
            invalid
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Select disabled options={REGION_OPTIONS} defaultValue="us-east-1" />
            disabled
          </div>
        </div>
      </Section>
      <Section id="customization" title="Customization">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Select options={REGION_OPTIONS} defaultValue="us-east-1" style={{ ['--vl-select-border' as string]: 'oklch(0.72 0.16 155)' }} />
          <CodeBlock>
            <span className="p">&lt;</span>Select{'\n'}
            {'  '}<span className="p">style=</span>{'{{'}{'\n'}
            {'    '}<span className="s">'--vl-select-border'</span>: <span className="s">'oklch(0.72 0.16 155)'</span>,{'\n'}
            {'  '}{'}}'}{'\n'}
            <span className="p">/&gt;</span>
          </CodeBlock>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-3)' }}>
            Tokens: <code>--vl-select-bg</code>, <code>-border</code>, <code>-ring</code>, <code>-color</code>. See <Link to="/docs/customization" style={{ color: 'var(--ac-text)' }}>/docs/customization</Link>.
          </p>
        </div>
      </Section>
    </ComponentDoc>
  )
}
