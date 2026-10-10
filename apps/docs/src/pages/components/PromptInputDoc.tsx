import { useState } from 'react'
import { PromptInput, Select, ChatMessage } from 'veloce-ui'
import { ComponentDoc } from '../../components/ComponentDoc'

export default function PromptInputDoc() {
  const [messages, setMessages] = useState<string[]>(['Welcome — ask me anything about the deploy.'])
  return (
    <ComponentDoc
      slug="prompt-input"
      name="PromptInput"
      description="Multi-line prompt input for chat UIs. Auto-grows, Enter submits (Shift+Enter for newline), slots for model picker + send button."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 560 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 14, border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg-1)', minHeight: 160, maxHeight: 220, overflowY: 'auto' }}>
            {messages.map((m, i) => (
              <ChatMessage key={i} role={i === 0 ? 'system' : i % 2 ? 'assistant' : 'user'} name={i === 0 ? undefined : i % 2 ? 'Claude' : 'You'}>
                {m}
              </ChatMessage>
            ))}
          </div>
          <PromptInput
            onSubmit={(v) => setMessages((m) => [...m, v, `(mock reply to: ${v.slice(0, 60)})`])}
            leftSlot={
              <Select
                size="sm"
                defaultValue="opus"
                options={[
                  { value: 'opus', label: 'Claude Opus 4.7' },
                  { value: 'sonnet', label: 'Claude Sonnet 4.6' },
                  { value: 'haiku', label: 'Claude Haiku 4.5' },
                ]}
                style={{ minWidth: 170 }}
              />
            }
          />
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ PromptInput }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>PromptInput onSubmit={'{'}send{'}'} leftSlot={'{'}<span className="p">&lt;</span>ModelPicker <span className="p">/&gt;</span>{'}'} <span className="p">/&gt;</span>
        </>
      }
    />
  )
}
