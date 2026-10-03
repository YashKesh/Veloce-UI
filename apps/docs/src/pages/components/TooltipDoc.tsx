import { useState } from 'react'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Timing', id: 'timing' },
]

export default function TooltipDoc() {
  const [show, setShow] = useState(false)
  return (
    <ComponentDoc
      slug="tooltip"
      name="Tooltip"
      description="A label that identifies a control on hover or focus. Rises 4px into place over 150ms; disappears instantly on leave."
      toc={TOC}
      preview={
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 110 }}>
          <div style={{ position: 'relative' }}>
            {show && (
              <>
                <div
                  role="tooltip"
                  style={{
                    position: 'absolute', bottom: 44, left: '50%', transform: 'translateX(-50%)',
                    padding: '6px 9px', borderRadius: 6, background: 'var(--fg)', color: 'var(--bg)',
                    fontSize: 12, whiteSpace: 'nowrap', boxShadow: 'var(--shadow-md)',
                    animation: 'vl-in .2s cubic-bezier(.16,1,.3,1) both',
                  }}
                >
                  Copy link <span style={{ opacity: 0.55, fontFamily: 'var(--font-mono)', fontSize: 11 }}>⌘C</span>
                </div>
                <div
                  style={{
                    position: 'absolute', bottom: 39, left: '50%', width: 8, height: 8,
                    background: 'var(--fg)', transform: 'translateX(-50%) rotate(45deg)',
                    animation: 'vl-in .2s cubic-bezier(.16,1,.3,1) both',
                  }}
                />
              </>
            )}
            <button
              type="button"
              aria-label="Copy link"
              onMouseEnter={() => setShow(true)}
              onMouseLeave={() => setShow(false)}
              onFocus={() => setShow(true)}
              onBlur={() => setShow(false)}
              style={{
                display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: 8,
                border: '1px solid var(--line-2)', background: 'var(--bg-2)', color: 'var(--fg)',
                fontSize: 14, cursor: 'pointer',
              }}
            >
              ⛓
            </button>
          </div>
          <span style={{ position: 'absolute', bottom: -8, fontSize: 12, color: 'var(--fg-3)' }}>
            Hover or tab to the button
          </span>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Tooltip }'} <span className="p">from</span> <span className="s">"@/components/ui/tooltip"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Tooltip <span className="p">content=</span><span className="s">"Copy link"</span> <span className="p">shortcut=</span><span className="s">"⌘C"</span><span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>IconButton <span className="p">aria-label=</span><span className="s">"Copy link"</span><span className="p">&gt;</span>{'\n'}
          {'    '}<span className="p">&lt;</span>LinkIcon <span className="p">/&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;/</span>IconButton<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;/</span>Tooltip<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="timing" title="Timing">
        <div className="vl-panel" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--fg-2)', margin: 0 }}>
            Tooltips wait 500ms before opening so casual pointer travel never flashes labels, then close with no
            delay the moment the pointer or focus leaves. Once one tooltip is open, siblings open instantly —
            the delay is shared across the group. The bubble rises into place over 150ms.
          </p>
          <div
            style={{
              display: 'grid', gridTemplateColumns: 'auto auto 1fr', columnGap: 24, rowGap: 8,
              fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)',
            }}
          >
            <span style={{ color: 'var(--fg-2)' }}>event</span>
            <span style={{ color: 'var(--fg-2)' }}>delay</span>
            <span style={{ color: 'var(--fg-2)' }}>motion</span>
            <span>open</span><span style={{ color: 'var(--ac-text)' }}>500ms</span><span>rise 150ms</span>
            <span>close</span><span style={{ color: 'var(--ac-text)' }}>0ms</span><span>instant</span>
            <span>sibling open</span><span style={{ color: 'var(--ac-text)' }}>0ms</span><span>rise 150ms</span>
          </div>
        </div>
      </Section>
    </ComponentDoc>
  )
}
