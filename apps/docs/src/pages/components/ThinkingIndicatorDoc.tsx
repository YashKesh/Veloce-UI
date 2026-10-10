import { ThinkingIndicator } from 'veloce-ui'
import { ComponentDoc } from '../../components/ComponentDoc'

export default function ThinkingIndicatorDoc() {
  return (
    <ComponentDoc
      slug="thinking-indicator"
      name="ThinkingIndicator"
      description="Three-dot pulsing animation + optional label. Shown while the model is generating but hasn't started streaming yet, or during tool use."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
          <ThinkingIndicator />
          <ThinkingIndicator label="Thinking…" />
          <ThinkingIndicator label="Searching the web for OKLCH browser support…" />
          <ThinkingIndicator label="Running tests…" size="sm" />
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ ThinkingIndicator }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>ThinkingIndicator label=<span className="s">"Thinking…"</span> <span className="p">/&gt;</span>
        </>
      }
    />
  )
}
