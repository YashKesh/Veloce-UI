import { useState } from 'react'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'States', id: 'states' },
]

function Box({ checked, indeterminate, disabled, onClick }: { checked: boolean; indeterminate?: boolean; disabled?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      disabled={disabled}
      onClick={onClick}
      className={`vl-checkbox${checked || indeterminate ? ' vl-checkbox--checked' : ''}`}
      style={{ cursor: disabled ? 'default' : 'pointer', padding: 0, opacity: disabled ? 0.45 : undefined }}
    >
      {indeterminate ? <span style={{ width: 8, height: 2, background: 'var(--ac-fg)', borderRadius: 1 }} /> : checked ? '✓' : null}
    </button>
  )
}

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
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 500 }}>
            <Box
              checked={allOn}
              indeterminate={someOn && !allOn}
              onClick={() => setChecked(checked.map(() => !allOn))}
            />
            CI pipeline
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingLeft: 26 }}>
            {ITEMS.map((label, i) => (
              <label key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Box
                  checked={checked[i]}
                  onClick={() => setChecked(checked.map((c, j) => (j === i ? !c : c)))}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Checkbox }'} <span className="p">from</span> <span className="s">"@/components/ui/checkbox"</span>
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
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <span className="vl-checkbox" />
            unchecked
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <span className="vl-checkbox vl-checkbox--checked">✓</span>
            checked
            <span style={{ color: 'var(--ac-text)', fontSize: 10.5 }}>draw 150ms</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <span className="vl-checkbox vl-checkbox--checked">
              <span style={{ width: 8, height: 2, background: 'var(--ac-fg)', borderRadius: 1 }} />
            </span>
            indeterminate
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <span className="vl-checkbox" style={{ opacity: 0.45 }} />
            disabled
          </div>
        </div>
      </Section>
    </ComponentDoc>
  )
}
