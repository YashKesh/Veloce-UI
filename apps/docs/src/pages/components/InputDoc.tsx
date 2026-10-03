import type { ReactNode } from 'react'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'States', id: 'states' },
]

function Field({ label, help, helpColor, children }: {
  label: string
  help?: ReactNode
  helpColor?: string
  children: ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 240 }}>
      <span className="vl-field-label">{label}</span>
      {children}
      {help && <span className="vl-field-help" style={helpColor ? { color: helpColor } : undefined}>{help}</span>}
    </div>
  )
}

export default function InputDoc() {
  return (
    <ComponentDoc
      slug="input"
      name="Input"
      description="A text field with label, help text, and validation messaging. Error messages slide in over 150ms."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 340 }}>
          <Field label="Workspace URL" help="Lowercase letters and dashes.">
            <div className="vl-input" style={{ color: 'var(--fg-3)' }}>
              acme<span style={{ color: 'var(--fg-3)' }}>.veloce.app</span>
            </div>
          </Field>
          <Field label="Workspace URL" help="Checking availability…" helpColor="var(--ac-text)">
            <div className="vl-input vl-input--focus" style={{ whiteSpace: 'nowrap' }}>
              acme-design
              <span className="vl-caret" style={{ height: 16, marginLeft: -6 }} />
              <span style={{ color: 'var(--fg-3)', marginLeft: -6 }}>.veloce.app</span>
            </div>
          </Field>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Input, Field }'} <span className="p">from</span> <span className="s">"@/components/ui/input"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Field <span className="p">label=</span><span className="s">"Workspace URL"</span> <span className="p">help=</span><span className="s">"Lowercase letters and dashes."</span><span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Input{'\n'}
          {'    '}<span className="p">placeholder=</span><span className="s">"acme"</span>{'\n'}
          {'    '}<span className="p">suffix=</span><span className="s">".veloce.app"</span>{'\n'}
          {'    '}<span className="p">error=</span>{'{'}errors.url{'}'}{'\n'}
          {'  '}<span className="p">/&gt;</span>{'\n'}
          <span className="p">&lt;/</span>Field<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="states" title="States">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Field label="Default" help="Ready for input.">
            <div className="vl-input" style={{ color: 'var(--fg-3)' }}>Enter a name…</div>
          </Field>
          <Field label="Focus" help="Checking availability…" helpColor="var(--ac-text)">
            <div className="vl-input vl-input--focus">
              acme-design<span className="vl-caret" style={{ height: 16 }} />
            </div>
          </Field>
          <Field
            label="Error"
            help={<span style={{ display: 'flex', gap: 6 }}><span>⚠</span>Spaces and capitals aren’t allowed. Try “acme-design”.</span>}
            helpColor="var(--err)"
          >
            <div className="vl-input vl-input--error">
              Acme Design
              <span style={{ marginLeft: 'auto', color: 'var(--err)', fontSize: 12 }}>!</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-3)', marginTop: 4 }}>
              message slides in 150ms
            </span>
          </Field>
          <Field label="Disabled" help="This field is locked.">
            <div className="vl-input" style={{ background: 'var(--bg-2)', color: 'var(--fg-3)', borderColor: 'var(--line)' }}>
              acme.veloce.app
            </div>
          </Field>
        </div>
      </Section>
    </ComponentDoc>
  )
}
