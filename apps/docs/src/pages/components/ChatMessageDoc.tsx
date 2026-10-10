import { ChatMessage } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

export default function ChatMessageDoc() {
  return (
    <ComponentDoc
      slug="chat-message"
      name="ChatMessage"
      description="Chat bubble primitive for AI UIs. Four roles (user/assistant/system/tool), each with its own tint and alignment. Optional avatar, name, meta, streaming cursor."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 540 }}>
          <ChatMessage role="user" name="You">
            Can you summarize the deploy logs?
          </ChatMessage>
          <ChatMessage role="assistant" name="Claude" meta="just now">
            Build succeeded in 42s across 14 regions. No warnings. The only notable change was a 12 kB
            reduction in the chartsAll chunk.
          </ChatMessage>
          <ChatMessage role="assistant" name="Claude" streaming>
            Analyzing the next log file
          </ChatMessage>
          <ChatMessage role="tool" name="run_sql">
            SELECT COUNT(*) FROM users WHERE active = true;
          </ChatMessage>
          <ChatMessage role="system">
            Reduced motion is on — exits snap instantly.
          </ChatMessage>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ ChatMessage }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>ChatMessage role=<span className="s">"assistant"</span> streaming<span className="p">&gt;</span>{'\n'}
          {'  '}{'{'}reply{'}'}{'\n'}
          <span className="p">&lt;/</span>ChatMessage<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="tokens" title="Customization">
        <div className="vl-panel" style={{ padding: '20px 24px', fontSize: 13, color: 'var(--fg-2)' }}>
          Tokens per role: <code>--vl-chat-user-bg</code>, <code>--vl-chat-user-fg</code>, <code>--vl-chat-user-border</code>, and
          the matching <code>-assistant-</code>, <code>-system-</code>, <code>-tool-</code> variants.
        </div>
      </Section>
    </ComponentDoc>
  )
}
