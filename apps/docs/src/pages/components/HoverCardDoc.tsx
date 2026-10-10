import { HoverCard, Avatar, Button } from 'veloce-ui'
import { ComponentDoc } from '../../components/ComponentDoc'

export default function HoverCardDoc() {
  return (
    <ComponentDoc
      slug="hover-card"
      name="HoverCard"
      description="Rich hover-reveal card for user profiles, link previews, and tooltips with more than text. Opens on hover/focus after a short delay."
      preview={
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 20 }}>
          <HoverCard openDelay={200}>
            <HoverCard.Trigger>
              <Button variant="ghost">@yash</Button>
            </HoverCard.Trigger>
            <HoverCard.Content style={{ width: 240 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Avatar name="Yash Kesharwani" size={44} />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fg)' }}>Yash Kesharwani</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>Founder · Codeloom</div>
                </div>
              </div>
              <p style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--fg-2)', margin: '10px 0 0' }}>
                Building veloce-ui — a motion-first React component library.
              </p>
            </HoverCard.Content>
          </HoverCard>
          <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>Hover the mention →</span>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ HoverCard }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>HoverCard<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>HoverCard.Trigger<span className="p">&gt;</span>@yash<span className="p">&lt;/</span>HoverCard.Trigger<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>HoverCard.Content<span className="p">&gt;</span>...profile...<span className="p">&lt;/</span>HoverCard.Content<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;/</span>HoverCard<span className="p">&gt;</span>
        </>
      }
    />
  )
}
