import { useState } from 'react'
import { Drawer, Button } from 'veloce-ui'
import { ComponentDoc } from '../../components/ComponentDoc'

export default function DrawerDoc() {
  const [open, setOpen] = useState(false)
  return (
    <ComponentDoc
      slug="drawer"
      name="Drawer"
      description="Bottom (or top) drawer for mobile-first flows. Slides up with a settle easing; closes on backdrop click or Esc."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <Button variant="primary" onClick={() => setOpen(true)}>Open drawer</Button>
          <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>Opens from the bottom · Esc to close</span>
          <Drawer open={open} onOpenChange={setOpen} title="Deploy settings" description="Tune the next deploy before it ships.">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '8px 0' }}>
              <div style={{ fontSize: 13.5, color: 'var(--fg)' }}>Branch: main</div>
              <div style={{ fontSize: 13.5, color: 'var(--fg)' }}>Regions: 14</div>
              <div style={{ fontSize: 13.5, color: 'var(--fg)' }}>Cache TTL: 60s</div>
              <Button variant="primary" style={{ marginTop: 10 }} onClick={() => setOpen(false)}>Deploy now</Button>
            </div>
          </Drawer>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Drawer }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Drawer <span className="p">open=</span>{'{'}open{'}'} <span className="p">onOpenChange=</span>{'{'}setOpen{'}'} <span className="p">title=</span><span className="s">"Deploy settings"</span><span className="p">&gt;</span>{'\n'}
          {'  '}...body...{'\n'}
          <span className="p">&lt;/</span>Drawer<span className="p">&gt;</span>
        </>
      }
    />
  )
}
