import { Label, Input, Checkbox } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'States', id: 'states' },
]

export default function LabelDoc() {
  return (
    <ComponentDoc
      slug="label"
      name="Label"
      description="A form field label. Associate it with any control via htmlFor, or wrap the control inside. Includes optional affordances for required/optional fields."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: 320 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Label htmlFor="email" required>Email address</Label>
            <Input id="email" type="email" placeholder="you@acme.com" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Label htmlFor="company" optional>Company</Label>
            <Input id="company" placeholder="Acme Design" />
          </div>
          <Label style={{ gap: 10 }}>
            <Checkbox defaultChecked />
            Subscribe to the changelog
          </Label>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Label, Input }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Label <span className="p">htmlFor=</span><span className="s">"email"</span> <span className="p">required</span><span className="p">&gt;</span>Email<span className="p">&lt;/</span>Label<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;</span>Input <span className="p">id=</span><span className="s">"email"</span> <span className="p">type=</span><span className="s">"email"</span> <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="states" title="States">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 32, alignItems: 'center' }}>
          <Label>Default</Label>
          <Label required>Required</Label>
          <Label optional>Optional</Label>
        </div>
      </Section>
    </ComponentDoc>
  )
}
