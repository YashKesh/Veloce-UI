import { useState } from 'react'
import { MultiSelect } from 'veloce-ui'
import { ComponentDoc } from '../../components/ComponentDoc'

const SKILLS = [
  { value: 'ts', label: 'TypeScript' },
  { value: 'react', label: 'React' },
  { value: 'css', label: 'CSS' },
  { value: 'node', label: 'Node' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'py', label: 'Python' },
  { value: 'sql', label: 'SQL' },
]

export default function MultiSelectDoc() {
  const [value, setValue] = useState<string[]>(['ts', 'react'])
  return (
    <ComponentDoc
      slug="multi-select"
      name="MultiSelect"
      description="Multi-value select with chip summary, search filter, and max-selection limit."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <MultiSelect options={SKILLS} value={value} onValueChange={setValue} placeholder="Pick skills" max={4} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>
            selected: [{value.join(', ')}]
          </span>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ MultiSelect }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>MultiSelect{'\n'}
          {'  '}<span className="p">options=</span>{'{'}skills{'}'}{'\n'}
          {'  '}<span className="p">value=</span>{'{'}value{'}'} <span className="p">onValueChange=</span>{'{'}setValue{'}'}{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    />
  )
}
