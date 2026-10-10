import { useState } from 'react'
import { Sheet, Button } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Sides', id: 'sides' },
]

function SheetDemo({ side, label }: { side: 'left' | 'right' | 'top' | 'bottom'; label: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>{label}</Button>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        side={side}
        title="Deployment details"
        description="Project veloce-docs · main · e4a91c2"
      >
        <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
          <span>status</span><span style={{ color: 'var(--ok)' }}>ready</span>
          <span>branch</span><span style={{ color: 'var(--fg-2)' }}>main</span>
          <span>commit</span><span style={{ color: 'var(--fg-2)' }}>e4a91c2</span>
          <span>duration</span><span style={{ color: 'var(--fg-2)' }}>34s</span>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', padding: '12px 20px', borderTop: '1px solid var(--line)' }}>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Close</Button>
          <Button variant="primary" size="sm" onClick={() => setOpen(false)}>Apply</Button>
        </div>
      </Sheet>
    </>
  )
}

export default function SheetDoc() {
  return (
    <ComponentDoc
      slug="sheet"
      name="Sheet"
      description="A panel that overlays content from an edge of the screen. Slides 350ms with a settle easing — the overlay fades in step."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <SheetDemo side="right" label="Open right sheet" />
          <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>Click outside, press Esc, or use the buttons to close</span>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Sheet, Button }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">const</span> [open, setOpen] = useState(<span className="p">false</span>)
          {'\n\n'}
          <span className="p">&lt;</span>Sheet{'\n'}
          {'  '}<span className="p">open=</span>{'{'}open{'}'}{'\n'}
          {'  '}<span className="p">onOpenChange=</span>{'{'}setOpen{'}'}{'\n'}
          {'  '}<span className="p">side=</span><span className="s">"right"</span>{'\n'}
          {'  '}<span className="p">title=</span><span className="s">"Deployment details"</span>{'\n'}
          <span className="p">&gt;</span>…body…<span className="p">&lt;/</span>Sheet<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="sides" title="Sides">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <SheetDemo side="right" label="Right (default)" />
          <SheetDemo side="left" label="Left" />
          <SheetDemo side="top" label="Top" />
          <SheetDemo side="bottom" label="Bottom" />
        </div>
      </Section>
    </ComponentDoc>
  )
}
