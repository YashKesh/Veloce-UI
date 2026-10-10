import { useState, type ReactNode } from 'react'
import { Input } from 'veloce-ui'
import { Link } from 'react-router-dom'
import { ComponentDoc, Section, CodeBlock } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
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
  const [slug, setSlug] = useState('')
  const [workspace, setWorkspace] = useState('acme-design')
  const invalid = /\s|[A-Z]/.test(workspace)

  return (
    <ComponentDoc
      slug="input"
      name="Input"
      description="A text field with label, help text, and validation messaging. Error messages slide in over 150ms."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 340 }}>
          <Field label="Workspace URL" help="Lowercase letters and dashes.">
            <Input
              placeholder="acme"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              suffix={<span style={{ color: 'var(--fg-3)' }}>.veloce.app</span>}
            />
          </Field>
          <Field
            label="Workspace URL"
            help={invalid ? 'Spaces and capitals aren’t allowed.' : 'Looks good.'}
            helpColor={invalid ? 'var(--err)' : 'var(--ac-text)'}
          >
            <Input
              value={workspace}
              onChange={(e) => setWorkspace(e.target.value)}
              invalid={invalid}
              suffix={<span style={{ color: 'var(--fg-3)' }}>.veloce.app</span>}
            />
          </Field>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Input }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Input{'\n'}
          {'  '}<span className="p">placeholder=</span><span className="s">"acme"</span>{'\n'}
          {'  '}<span className="p">value=</span>{'{'}slug{'}'}{'\n'}
          {'  '}<span className="p">onChange=</span>{'{'}e {'=>'} setSlug(e.target.value){'}'}{'\n'}
          {'  '}<span className="p">suffix=</span><span className="s">".veloce.app"</span>{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="states" title="States">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Field label="Default" help="Ready for input.">
            <Input placeholder="Enter a name…" />
          </Field>
          <Field label="Ghost variant" help="Flat background.">
            <Input variant="ghost" placeholder="search…" />
          </Field>
          <Field label="Invalid" help="Spaces aren’t allowed." helpColor="var(--err)">
            <Input value="Acme Design" invalid readOnly />
          </Field>
          <Field label="Disabled" help="This field is locked.">
            <Input value="acme.veloce.app" disabled readOnly />
          </Field>
        </div>
      </Section>
      <Section id="customization" title="Customization">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Input placeholder="Default" />
            <Input placeholder="Cyan ring" style={{ ['--vl-input-border' as string]: 'oklch(0.8 0.13 205)', ['--vl-input-ring' as string]: '0 0 0 3px color-mix(in oklch, oklch(0.8 0.13 205) 25%, transparent)' }} />
            <Input placeholder="Branded background" style={{ ['--vl-input-bg' as string]: 'oklch(0.55 0.22 300)', ['--vl-input-color' as string]: '#fff', ['--vl-input-border' as string]: 'oklch(0.55 0.22 300)' }} />
          </div>
          <CodeBlock>
            <span className="p">&lt;</span>Input{'\n'}
            {'  '}<span className="p">style=</span>{'{{'}{'\n'}
            {'    '}<span className="s">'--vl-input-border'</span>: <span className="s">'oklch(0.8 0.13 205)'</span>,{'\n'}
            {'    '}<span className="s">'--vl-input-ring'</span>: <span className="s">'0 0 0 3px color-mix(...)'</span>,{'\n'}
            {'  '}{'}}'}{'\n'}
            <span className="p">/&gt;</span>
          </CodeBlock>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-3)' }}>
            Tokens: <code>--vl-input-bg</code>, <code>-border</code>, <code>-ring</code>, <code>-color</code>. See <Link to="/docs/customization" style={{ color: 'var(--ac-text)' }}>/docs/customization</Link>.
          </p>
        </div>
      </Section>
    </ComponentDoc>
  )
}
