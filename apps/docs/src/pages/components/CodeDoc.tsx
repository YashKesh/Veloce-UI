import { Code } from 'veloce-ui'
import { ComponentDoc } from '../../components/ComponentDoc'

export default function CodeDoc() {
  return (
    <ComponentDoc
      slug="code"
      name="Code"
      description="Semantic <code> element with monospace styling. Inline by default; pass block for a padded code block."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start', maxWidth: 460 }}>
          <p style={{ fontSize: 13.5, color: 'var(--fg-2)', margin: 0 }}>
            Install with <Code>npm install veloce-ui</Code>, then import <Code>Button</Code>.
          </p>
          <Code block>
{`import { Button } from 'veloce-ui'

export default function App() {
  return <Button variant="primary">Click me</Button>
}`}
          </Code>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Code }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Code<span className="p">&gt;</span>npm install<span className="p">&lt;/</span>Code<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;</span>Code <span className="p">block</span><span className="p">&gt;</span>const x = 42<span className="p">&lt;/</span>Code<span className="p">&gt;</span>
        </>
      }
    />
  )
}
