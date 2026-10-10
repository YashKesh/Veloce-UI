import { useState } from 'react'
import { PinInput } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

export default function PinInputDoc() {
  const [code, setCode] = useState('')
  return (
    <ComponentDoc
      slug="pin-input"
      name="PinInput"
      description="OTP-style multi-cell input for codes. Auto-advances on digit entry, Backspace moves back, paste fills all cells."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <PinInput length={6} value={code} onValueChange={setCode} onComplete={(v) => alert(`Entered: ${v}`)} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>
            {code.length} / 6 digits
          </span>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ PinInput }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>PinInput <span className="p">length=</span>{'{'}6{'}'} <span className="p">onComplete=</span>{'{'}verify{'}'} <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="variants" title="Variants">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start' }}>
          <PinInput length={4} defaultValue="1234" />
          <PinInput length={6} mask defaultValue="123456" />
          <PinInput length={5} type="alphanumeric" />
        </div>
      </Section>
    </ComponentDoc>
  )
}
