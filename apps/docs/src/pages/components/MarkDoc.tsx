import { Mark } from 'veloce-ui'
import { ComponentDoc } from '../../components/ComponentDoc'

export default function MarkDoc() {
  return (
    <ComponentDoc
      slug="mark"
      name="Mark"
      description="Text highlighter. Uses the accent color at low opacity for a soft highlight — ideal for search-result emphasis."
      preview={
        <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--fg)', maxWidth: 520, textAlign: 'center' }}>
          Veloce ships <Mark>zero-runtime</Mark> components with <Mark>CSS-only motion</Mark> and complete <Mark>accessibility</Mark>.
        </p>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Mark }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          Veloce is <span className="p">&lt;</span>Mark<span className="p">&gt;</span>fast<span className="p">&lt;/</span>Mark<span className="p">&gt;</span>.
        </>
      }
    />
  )
}
