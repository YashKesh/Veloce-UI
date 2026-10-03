import { useState } from 'react'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Placement', id: 'placement' },
]

const placementBox = {
  padding: '5px 10px', borderRadius: 6, border: '1px dashed var(--line-2)',
  fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)',
} as const

export default function PopoverDoc() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  return (
    <ComponentDoc
      slug="popover"
      name="Popover"
      description="Rich content anchored to a trigger. Enters with a scale-fade over 180ms from the anchor side and stays open until dismissed."
      toc={TOC}
      preview={
        <div
          style={{ position: 'relative', minHeight: 190, display: 'flex', justifyContent: 'center', width: 260 }}
          onClick={(e) => { if (e.target === e.currentTarget) { setOpen(false); setCopied(false) } }}
        >
          <button
            type="button"
            aria-expanded={open}
            onClick={() => { setOpen((v) => !v); setCopied(false) }}
            style={{
              alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', height: 34,
              padding: '0 13px', borderRadius: 8, background: 'var(--ac)', color: 'var(--ac-fg)',
              border: 'none', fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
              boxShadow: 'inset 0 1px 0 oklch(1 0 0/.2)',
            }}
          >
            Share
          </button>
          {open && (
            <div
              role="dialog"
              style={{
                position: 'absolute', top: 44, width: 224, padding: 14, borderRadius: 10,
                background: 'var(--bg-2)', border: '1px solid var(--line-2)', boxShadow: 'var(--shadow-md)',
                fontSize: 13, display: 'flex', flexDirection: 'column', gap: 8, transformOrigin: 'top',
                animation: 'vl-in .2s cubic-bezier(.16,1,.3,1) both',
              }}
            >
              <div style={{ fontWeight: 600 }}>Share</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  readOnly
                  value="veloce.dev/8fk2"
                  style={{
                    flex: 1, minWidth: 0, height: 30, borderRadius: 6, border: '1px solid var(--line-2)',
                    background: 'var(--bg)', fontFamily: 'var(--font-mono)', fontSize: 11.5,
                    color: 'var(--fg-2)', padding: '0 8px', outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setCopied(true)}
                  style={{
                    height: 30, padding: '0 10px', borderRadius: 6, background: 'var(--ac)',
                    color: 'var(--ac-fg)', fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer',
                  }}
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Popover }'} <span className="p">from</span> <span className="s">"@/components/ui/popover"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Popover.Root<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Popover.Trigger<span className="p">&gt;</span>Share<span className="p">&lt;/</span>Popover.Trigger<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Popover.Content <span className="p">side=</span><span className="s">"bottom"</span> <span className="p">align=</span><span className="s">"start"</span><span className="p">&gt;</span>{'\n'}
          {'    '}<span className="p">&lt;</span>ShareForm <span className="p">url=</span><span className="s">"veloce.dev/8fk2"</span> <span className="p">/&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;/</span>Popover.Content<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;/</span>Popover.Root<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="placement" title="Placement">
        <div className="vl-panel" style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <span style={placementBox}>top</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <span style={placementBox}>left</span>
            <span
              style={{
                display: 'grid', placeItems: 'center', width: 68, height: 40, borderRadius: 8,
                background: 'var(--ac-soft)', border: '1px solid var(--line-2)',
                fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ac-text)',
              }}
            >
              anchor
            </span>
            <span style={placementBox}>right</span>
          </div>
          <span style={placementBox}>bottom</span>
          <p style={{ fontSize: 12.5, color: 'var(--fg-3)', margin: 0 }}>
            Defaults to bottom-start. Flips automatically when the preferred side would clip the viewport.
          </p>
        </div>
      </Section>
    </ComponentDoc>
  )
}
