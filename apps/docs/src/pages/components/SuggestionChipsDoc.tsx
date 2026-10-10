import { useState } from 'react'
import { SuggestionChips } from 'veloce-ui'
import { ComponentDoc } from '../../components/ComponentDoc'

export default function SuggestionChipsDoc() {
  const [last, setLast] = useState<string | null>(null)
  return (
    <ComponentDoc
      slug="suggestion-chips"
      name="SuggestionChips"
      description="Row of click-to-send prompt suggestions. Used below empty chat states and after responses to kickstart the next turn."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 560 }}>
          <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>Try one of these to start:</div>
          <SuggestionChips
            suggestions={[
              { label: '✨ Summarize this file', value: 'Summarize this file' },
              { label: '🧪 Write unit tests', value: 'Write unit tests for the selected code' },
              { label: '🐛 Explain this error', value: 'Explain this error and suggest a fix' },
              { label: '🎨 Convert to Tailwind', value: 'Convert this CSS to Tailwind' },
            ]}
            onSelect={setLast}
          />
          {last && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ac-text)' }}>
              selected: {last}
            </div>
          )}
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ SuggestionChips }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>SuggestionChips suggestions={'{'}presets{'}'} onSelect={'{'}send{'}'} <span className="p">/&gt;</span>
        </>
      }
    />
  )
}
