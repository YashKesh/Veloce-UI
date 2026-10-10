import { ScrollArea } from 'veloce-ui'
import { ComponentDoc } from '../../components/ComponentDoc'

export default function ScrollAreaDoc() {
  const items = Array.from({ length: 40 }, (_, i) => `Item ${i + 1}`)
  return (
    <ComponentDoc
      slug="scroll-area"
      name="ScrollArea"
      description="A scrollable viewport with slim scrollbars styled to match the design system."
      preview={
        <ScrollArea maxHeight={240} style={{ width: 300, border: '1px solid var(--line)', borderRadius: 10 }}>
          <ul style={{ margin: 0, padding: 12, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {items.map((label) => (
              <li
                key={label}
                style={{ padding: '8px 10px', borderRadius: 6, background: 'var(--bg-1)', fontSize: 13, color: 'var(--fg-2)' }}
              >
                {label}
              </li>
            ))}
          </ul>
        </ScrollArea>
      }
      usage={
        <>
          <span className="p">import</span> {'{ ScrollArea }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>ScrollArea <span className="p">maxHeight=</span>{'{'}240{'}'}<span className="p">&gt;</span>...<span className="p">&lt;/</span>ScrollArea<span className="p">&gt;</span>
        </>
      }
    />
  )
}
