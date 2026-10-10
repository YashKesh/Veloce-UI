import { useState } from 'react'
import { Combobox } from 'veloce-ui'
import { ComponentDoc } from '../../components/ComponentDoc'

const FRAMEWORKS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular' },
  { value: 'solid', label: 'SolidJS' },
  { value: 'qwik', label: 'Qwik' },
  { value: 'preact', label: 'Preact' },
  { value: 'htmx', label: 'htmx' },
]

export default function ComboboxDoc() {
  const [value, setValue] = useState('react')
  return (
    <ComponentDoc
      slug="combobox"
      name="Combobox"
      description="Searchable single-select. Keyboard navigable, filters options as you type, Enter commits."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <Combobox options={FRAMEWORKS} value={value} onValueChange={setValue} placeholder="Pick a framework" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>value: {value}</span>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Combobox }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Combobox{'\n'}
          {'  '}<span className="p">options=</span>{'{'}frameworks{'}'}{'\n'}
          {'  '}<span className="p">value=</span>{'{'}value{'}'} <span className="p">onValueChange=</span>{'{'}setValue{'}'}{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    />
  )
}
