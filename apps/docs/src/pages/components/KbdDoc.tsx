import { Kbd } from 'veloce-ui'
import { ComponentDoc } from '../../components/ComponentDoc'

export default function KbdDoc() {
  return (
    <ComponentDoc
      slug="kbd"
      name="Kbd"
      description="Semantic badge for a single keyboard key, with a subtle bevel. Compose multiple for a shortcut like ⌘+K."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13.5, color: 'var(--fg-2)' }}>
            Open the palette with <Kbd>⌘</Kbd> + <Kbd>K</Kbd>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Kbd>Enter</Kbd>
            <Kbd>Esc</Kbd>
            <Kbd>Tab</Kbd>
            <Kbd>Space</Kbd>
            <Kbd>↑</Kbd><Kbd>↓</Kbd><Kbd>←</Kbd><Kbd>→</Kbd>
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Kbd }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Kbd<span className="p">&gt;</span>⌘<span className="p">&lt;/</span>Kbd<span className="p">&gt;</span> + <span className="p">&lt;</span>Kbd<span className="p">&gt;</span>K<span className="p">&lt;/</span>Kbd<span className="p">&gt;</span>
        </>
      }
    />
  )
}
