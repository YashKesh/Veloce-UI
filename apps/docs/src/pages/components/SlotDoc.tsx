import { Slot } from 'veloce-ui'
import { ComponentDoc } from '../../components/ComponentDoc'

export default function SlotDoc() {
  return (
    <ComponentDoc
      slug="slot"
      name="Slot"
      description="Merges props onto a single child element (Radix-style asChild composition). Lets you style/wire any wrapper without introducing extra DOM."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
          <Slot style={{ padding: '8px 14px', borderRadius: 8, background: 'var(--ac)', color: 'var(--ac-fg)' }}>
            <a href="#slot-demo" onClick={(e) => e.preventDefault()}>I'm a plain anchor, styled like a button via Slot</a>
          </Slot>
          <Slot className="my-link" onClick={() => alert('composed click!')}>
            <button style={{ padding: '6px 12px', borderRadius: 7, border: '1px solid var(--line-2)', background: 'var(--bg-1)', color: 'var(--fg)', cursor: 'pointer' }}>
              Click me (handler merged)
            </button>
          </Slot>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Slot }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Slot <span className="p">className=</span><span className="s">"vl-btn"</span><span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>a <span className="p">href=</span><span className="s">"/docs"</span><span className="p">&gt;</span>Looks like a button<span className="p">&lt;/</span>a<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;/</span>Slot<span className="p">&gt;</span>
        </>
      }
    />
  )
}
