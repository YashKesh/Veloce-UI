import { useState } from 'react'
import { StreamingText, Button } from 'veloce-ui'
import { ComponentDoc } from '../../components/ComponentDoc'

const SAMPLES = [
  "The deploy succeeded in 42 seconds across 14 regions. Zero errors, two warnings — both from the chartsAll bundle size budget. I'd recommend tree-shaking the unused chart variants on the next pass.",
  'Analyzing the stack trace… the error originates in app/layout.tsx on line 42 where the Session type is being assigned to a User-typed slot. Suggested fix: narrow with a type guard before the assignment.',
  'I searched three documentation sources and found that the preferred pattern is to colocate the handler with the form, pass a reducer, and let the parent manage the controlled state. Want me to refactor?',
]

export default function StreamingTextDoc() {
  const [idx, setIdx] = useState(0)
  const [key, setKey] = useState(0)
  return (
    <ComponentDoc
      slug="streaming-text"
      name="StreamingText"
      description="Reveals text character-by-character — the classic LLM typing effect. Respects prefers-reduced-motion by snapping to the full string."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 540 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button size="sm" variant="outline" onClick={() => setKey((k) => k + 1)}>Replay</Button>
            <Button size="sm" variant="ghost" onClick={() => setIdx((i) => (i + 1) % SAMPLES.length)}>Next sample</Button>
          </div>
          <div style={{ padding: 16, border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg-1)', fontSize: 14, lineHeight: 1.55, color: 'var(--fg)', minHeight: 110 }}>
            <StreamingText key={key} text={SAMPLES[idx]} speed={80} />
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ StreamingText }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>StreamingText text={'{'}reply{'}'} speed={'{'}60{'}'} <span className="p">/&gt;</span>
        </>
      }
    />
  )
}
