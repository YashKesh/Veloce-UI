import { useState } from 'react'
import { Tree } from 'veloce-ui'
import { ComponentDoc } from '../../components/ComponentDoc'

export default function TreeDoc() {
  const [sel, setSel] = useState<string | undefined>('b2')
  return (
    <ComponentDoc
      slug="tree"
      name="Tree"
      description="Hierarchical disclosure list. Supports nested children, selection, and controlled expand/collapse state."
      preview={
        <div style={{ width: 300, padding: 10, border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg-1)' }}>
          <Tree
            selectedId={sel}
            onSelect={setSel}
            defaultExpandedIds={['src', 'src-components']}
            data={[
              {
                id: 'src',
                label: 'src',
                children: [
                  {
                    id: 'src-components',
                    label: 'components',
                    children: [
                      { id: 'b1', label: 'Button.tsx' },
                      { id: 'b2', label: 'Dialog.tsx' },
                      { id: 'b3', label: 'Switch.tsx' },
                    ],
                  },
                  { id: 'src-styles', label: 'styles', children: [{ id: 'c1', label: 'tokens.css' }] },
                  { id: 'src-index', label: 'index.ts' },
                ],
              },
              { id: 'readme', label: 'README.md' },
              { id: 'pkg', label: 'package.json' },
            ]}
          />
          <div style={{ marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
            selected: {sel ?? '—'}
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Tree }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Tree <span className="p">data=</span>{'{'}nodes{'}'} <span className="p">selectedId=</span>{'{'}id{'}'} <span className="p">onSelect=</span>{'{'}setId{'}'} <span className="p">/&gt;</span>
        </>
      }
    />
  )
}
