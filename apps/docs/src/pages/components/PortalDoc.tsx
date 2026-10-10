import { useState } from 'react'
import { Portal, Button } from 'veloce-ui'
import { ComponentDoc } from '../../components/ComponentDoc'

export default function PortalDoc() {
  const [open, setOpen] = useState(false)
  return (
    <ComponentDoc
      slug="portal"
      name="Portal"
      description="Renders children into another DOM node (defaults to document.body). Essential primitive for overlays and tooltips that escape overflow:hidden parents."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <Button variant="primary" onClick={() => setOpen((o) => !o)}>
            {open ? 'Close portal' : 'Open portal'}
          </Button>
          <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>Rendered at the bottom-right of the viewport</span>
          {open && (
            <Portal>
              <div style={{
                position: 'fixed', bottom: 20, right: 20, zIndex: 1000,
                padding: '14px 18px', background: 'var(--bg-2)', border: '1px solid var(--line-2)',
                borderRadius: 10, boxShadow: 'var(--shadow-lg)', fontSize: 13, color: 'var(--fg)',
                maxWidth: 280,
              }}>
                I'm portaled into document.body — no matter where the Portal element is in the React tree.
                <button
                  onClick={() => setOpen(false)}
                  style={{ marginLeft: 10, background: 'none', border: 'none', color: 'var(--fg-3)', cursor: 'pointer' }}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </Portal>
          )}
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Portal }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Portal<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Overlay <span className="p">/&gt;</span>{'\n'}
          <span className="p">&lt;/</span>Portal<span className="p">&gt;</span>
        </>
      }
    />
  )
}
