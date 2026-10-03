import { useEffect, useState } from 'react'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Sides', id: 'sides' },
]

function SheetDemo() {
  const [open, setOpen] = useState(false)
  const [shown, setShown] = useState(false)

  // Mount off-screen, then flip a frame later so the transition runs.
  useEffect(() => {
    if (!open) return
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [open])

  const close = () => {
    setShown(false)
    setTimeout(() => setOpen(false), 360)
  }

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: 260, overflow: 'hidden', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button type="button" className="vl-btn vl-btn--md vl-btn--solid" onClick={() => setOpen(true)}>
        Open sheet
      </button>

      {open && (
        <>
          <div
            onClick={close}
            style={{
              position: 'absolute', inset: 0, background: 'oklch(0 0 0/.45)',
              opacity: shown ? 1 : 0, transition: 'opacity 350ms cubic-bezier(.22,1,.36,1)',
            }}
          />
          <div
            style={{
              position: 'absolute', top: 0, right: 0, bottom: 0, width: '62%',
              background: 'var(--bg-2)', borderLeft: '1px solid var(--line-2)', boxShadow: 'var(--shadow-lg)',
              transform: shown ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 350ms cubic-bezier(.22,1,.36,1)',
              display: 'flex', flexDirection: 'column', gap: 16, padding: '20px 18px',
            }}
          >
            <span style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--fg)' }}>Deployment details</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
              <span>status</span><span style={{ color: 'var(--ok)' }}>ready</span>
              <span>branch</span><span style={{ color: 'var(--fg-2)' }}>main</span>
              <span>commit</span><span style={{ color: 'var(--fg-2)' }}>e4a91c2</span>
              <span>duration</span><span style={{ color: 'var(--fg-2)' }}>34s</span>
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={close}
                style={{
                  height: 30, padding: '0 12px', borderRadius: 7, fontSize: 13, fontFamily: 'inherit',
                  background: 'transparent', border: '1px solid var(--line-2)', color: 'var(--fg-2)',
                  cursor: 'pointer',
                }}
              >
                Reset
              </button>
              <button
                type="button"
                onClick={close}
                style={{
                  height: 30, padding: '0 12px', borderRadius: 7, fontSize: 13, fontFamily: 'inherit',
                  background: 'var(--ac)', border: '1px solid var(--ac)', color: 'var(--ac-fg)',
                  fontWeight: 500, cursor: 'pointer',
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function SideDiagram({ label, panel }: { label: string; panel: { top?: number; right?: number; bottom?: number; left?: number; width?: number | string; height?: number | string } }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 84, height: 56, border: '1px solid var(--line-2)', borderRadius: 6, background: 'var(--bg)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', background: 'var(--ac-soft)', borderRadius: 2, ...panel }} />
      </div>
      <span>{label}</span>
    </div>
  )
}

export default function SheetDoc() {
  return (
    <ComponentDoc
      slug="sheet"
      name="Sheet"
      description="A panel that overlays content from an edge of the screen. It slides 350ms with a settle easing — cubic-bezier(.22,1,.36,1) — the overlay fading in step."
      toc={TOC}
      preview={<SheetDemo />}
      usage={
        <>
          <span className="p">import</span> {'{ Sheet, SheetTrigger, SheetContent }'} <span className="p">from</span> <span className="s">"@/components/ui/sheet"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Sheet<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>SheetTrigger<span className="p">&gt;</span>Open sheet<span className="p">&lt;/</span>SheetTrigger<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>SheetContent <span className="p">side=</span><span className="s">"right"</span><span className="p">&gt;</span>{'\n'}
          {'    '}<span className="p">&lt;</span>SheetTitle<span className="p">&gt;</span>Deployment details<span className="p">&lt;/</span>SheetTitle<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;/</span>SheetContent<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;/</span>Sheet<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="sides" title="Sides">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', gap: 40, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)', flexWrap: 'wrap' }}>
          <SideDiagram label="right (default)" panel={{ top: 0, right: 0, bottom: 0, width: 26 }} />
          <SideDiagram label="left" panel={{ top: 0, left: 0, bottom: 0, width: 26 }} />
          <SideDiagram label="bottom" panel={{ left: 0, right: 0, bottom: 0, height: 20 }} />
        </div>
      </Section>
    </ComponentDoc>
  )
}
