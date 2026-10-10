import { AgentAvatar } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

export default function AgentAvatarDoc() {
  return (
    <ComponentDoc
      slug="agent-avatar"
      name="AgentAvatar"
      description="Avatar for AI agents with a status dot — idle / thinking / typing / tool / error. Thinking + typing pulse."
      preview={
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
            <AgentAvatar name="Claude" status="idle" size={44} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>idle</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
            <AgentAvatar name="Claude" status="thinking" size={44} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>thinking</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
            <AgentAvatar name="Claude" status="typing" size={44} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>typing</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
            <AgentAvatar name="Tool" glyph="⚙" status="tool" size={44} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>tool</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
            <AgentAvatar name="Agent" status="error" size={44} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>error</span>
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ AgentAvatar }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>AgentAvatar name=<span className="s">"Claude"</span> status=<span className="s">"typing"</span> <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="multi-agent" title="Multi-agent scene">
        <div className="vl-panel" style={{ padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'center' }}>
          <AgentAvatar name="Planner" status="idle" />
          <span style={{ color: 'var(--fg-3)' }}>→</span>
          <AgentAvatar name="Researcher" status="thinking" />
          <span style={{ color: 'var(--fg-3)' }}>→</span>
          <AgentAvatar name="Writer" status="typing" />
          <span style={{ color: 'var(--fg-3)' }}>→</span>
          <AgentAvatar name="Reviewer" status="idle" />
        </div>
      </Section>
    </ComponentDoc>
  )
}
