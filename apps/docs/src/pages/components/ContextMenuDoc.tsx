import { useState } from 'react'
import { ContextMenu } from 'veloce-ui'
import { ComponentDoc } from '../../components/ComponentDoc'

export default function ContextMenuDoc() {
  const [last, setLast] = useState<string | null>(null)
  return (
    <ComponentDoc
      slug="context-menu"
      name="ContextMenu"
      description="Right-click menu bound to any element. Supports keyboard dismiss, click-outside dismiss, and separators."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <ContextMenu
            items={[
              { label: 'Rename', onSelect: () => setLast('Rename') },
              { label: 'Duplicate', onSelect: () => setLast('Duplicate') },
              { label: 'Move to…', onSelect: () => setLast('Move to…') },
              { separator: true, label: '' },
              { label: 'Delete', tone: 'danger', onSelect: () => setLast('Delete') },
            ]}
          >
            <div style={{
              width: 220, height: 120, border: '1px dashed var(--line-2)', borderRadius: 10,
              display: 'grid', placeItems: 'center', background: 'var(--bg-1)', color: 'var(--fg-2)',
              fontSize: 13, userSelect: 'none',
            }}>
              Right-click me
            </div>
          </ContextMenu>
          {last && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ac-text)' }}>
              selected: {last}
            </span>
          )}
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ ContextMenu }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>ContextMenu <span className="p">items=</span>{'{'}[{'{'} label: <span className="s">"Rename"</span>, onSelect: rename {'}'}]{'}'}<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>FileRow <span className="p">/&gt;</span>{'\n'}
          <span className="p">&lt;/</span>ContextMenu<span className="p">&gt;</span>
        </>
      }
    />
  )
}
