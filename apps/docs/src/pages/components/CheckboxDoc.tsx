import { useState } from 'react'
import { Checkbox } from 'veloce-ui'
import { ComponentDoc, Section, CodeBlock } from '../../components/ComponentDoc'
import { Link } from 'react-router-dom'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'States', id: 'states' },
]

const ITEMS = ['Run tests', 'Lint', 'Type-check']

export default function CheckboxDoc() {
  const [checked, setChecked] = useState([true, true, false])
  const allOn = checked.every(Boolean)
  const someOn = checked.some(Boolean)

  return (
    <ComponentDoc
      slug="checkbox"
      name="Checkbox"
      description="A tri-state selection control. The check mark draws in over 150ms; the indeterminate dash is reserved for parent rows with mixed children."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 260, fontSize: 13.5, color: 'var(--fg)' }}>
          <Checkbox
            checked={allOn}
            indeterminate={someOn && !allOn}
            onCheckedChange={() => setChecked(checked.map(() => !allOn))}
            label={<span style={{ fontWeight: 500 }}>CI pipeline</span>}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingLeft: 26 }}>
            {ITEMS.map((label, i) => (
              <Checkbox
                key={label}
                checked={checked[i]}
                onCheckedChange={(v) => setChecked(checked.map((c, j) => (j === i ? v : c)))}
                label={label}
              />
            ))}
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Checkbox }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">const</span> [runTests, setRunTests] = useState(<span className="p">true</span>)
          {'\n\n'}
          <span className="p">&lt;</span>Checkbox{'\n'}
          {'  '}<span className="p">checked=</span>{'{'}runTests{'}'}{'\n'}
          {'  '}<span className="p">onCheckedChange=</span>{'{'}setRunTests{'}'}{'\n'}
          {'  '}<span className="p">label=</span><span className="s">"Run tests"</span>{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="states" title="States">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: 28, alignItems: 'start', justifyContent: 'start', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
            <Checkbox checked={false} />
            unchecked
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
            <Checkbox checked />
            checked
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
            <Checkbox indeterminate />
            indeterminate
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
            <Checkbox checked disabled />
            disabled
          </div>
        </div>
      </Section>
      <Section id="customization" title="Customization">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Checkbox checked style={{ ['--vl-checkbox-bg-checked' as string]: 'var(--err)', ['--vl-checkbox-border-checked' as string]: 'var(--err)' }} />
            <Checkbox checked style={{ ['--vl-checkbox-bg-checked' as string]: 'oklch(0.72 0.16 155)', ['--vl-checkbox-border-checked' as string]: 'oklch(0.72 0.16 155)' }} />
            <Checkbox indeterminate style={{ ['--vl-checkbox-bg-checked' as string]: 'oklch(0.83 0.16 70)', ['--vl-checkbox-border-checked' as string]: 'oklch(0.83 0.16 70)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>bg-checked overrides</span>
          </div>
          <CodeBlock>
            <span className="p">&lt;</span>Checkbox checked{'\n'}
            {'  '}<span className="p">style=</span>{'{{'}{'\n'}
            {'    '}<span className="s">'--vl-checkbox-bg-checked'</span>: <span className="s">'var(--err)'</span>,{'\n'}
            {'    '}<span className="s">'--vl-checkbox-border-checked'</span>: <span className="s">'var(--err)'</span>,{'\n'}
            {'  '}{'}}'}{'\n'}
            <span className="p">/&gt;</span>
          </CodeBlock>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-3)' }}>
            Tokens: <code>--vl-checkbox-bg/-checked</code>, <code>--vl-checkbox-border/-checked</code>, <code>--vl-checkbox-check</code>, <code>--vl-checkbox-ring</code>. Full table at <Link to="/docs/customization" style={{ color: 'var(--ac-text)' }}>/docs/customization</Link>.
          </p>
        </div>
      </Section>
    </ComponentDoc>
  )
}
