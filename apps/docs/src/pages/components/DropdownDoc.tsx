import { useState } from 'react'
import type { CSSProperties } from 'react'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Anatomy', id: 'anatomy' },
]

const mono: CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }

function Item({ label, shortcut, danger, onClick }: { label: string; shortcut?: string; danger?: boolean; onClick: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      role="menuitem"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '7px 9px', borderRadius: 6, display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', cursor: 'pointer',
        background: hover ? 'var(--bg-3)' : undefined,
        color: danger ? 'var(--err)' : hover ? 'var(--fg)' : 'var(--fg-2)',
      }}
    >
      {label}
      {shortcut ? <span style={mono}>{shortcut}</span> : null}
    </div>
  )
}

export default function DropdownDoc() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return (
    <ComponentDoc
      slug="dropdown"
      name="Dropdown menu"
      description="A menu of actions revealed from a trigger. The content unfolds over 180ms with a scale-fade origin at the trigger edge."
      toc={TOC}
      preview={
        <div
          style={{ position: 'relative', minHeight: 190, display: 'flex', justifyContent: 'center', width: 220 }}
          onClick={(e) => { if (e.target === e.currentTarget) close() }}
        >
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            style={{
              alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, height: 34,
              padding: '0 13px', borderRadius: 8, border: '1px solid var(--line-2)', background: 'var(--bg)',
              color: 'var(--fg)', fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
            }}
          >
            Options <span style={{ color: 'var(--fg-3)' }}>⌄</span>
          </button>
          {open && (
            <div
              role="menu"
              style={{
                position: 'absolute', top: 42, width: 180, padding: 4, borderRadius: 9,
                background: 'var(--bg-2)', border: '1px solid var(--line-2)', boxShadow: 'var(--shadow-md)',
                fontSize: 13, transformOrigin: 'top',
                animation: 'vl-in .2s cubic-bezier(.16,1,.3,1) both',
              }}
            >
              <Item label="Rename" shortcut="R" onClick={close} />
              <Item label="Duplicate" shortcut="⌘D" onClick={close} />
              <Item label="Move to…" onClick={close} />
              <div style={{ height: 1, background: 'var(--line)', margin: '4px 0' }} />
              <Item label="Delete" danger onClick={close} />
            </div>
          )}
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Dropdown }'} <span className="p">from</span> <span className="s">"@/components/ui/dropdown"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Dropdown.Root<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Dropdown.Trigger<span className="p">&gt;</span>Options<span className="p">&lt;/</span>Dropdown.Trigger<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Dropdown.Content<span className="p">&gt;</span>{'\n'}
          {'    '}<span className="p">&lt;</span>Dropdown.Item <span className="p">shortcut=</span><span className="s">"⌘D"</span><span className="p">&gt;</span>Duplicate<span className="p">&lt;/</span>Dropdown.Item<span className="p">&gt;</span>{'\n'}
          {'    '}<span className="p">&lt;</span>Dropdown.Separator <span className="p">/&gt;</span>{'\n'}
          {'    '}<span className="p">&lt;</span>Dropdown.Item <span className="p">variant=</span><span className="s">"danger"</span><span className="p">&gt;</span>Delete<span className="p">&lt;/</span>Dropdown.Item<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;/</span>Dropdown.Content<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;/</span>Dropdown.Root<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="anatomy" title="Anatomy">
        <div className="vl-panel" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13.5 }}>
          {[
            ['Trigger', 'The button that opens the menu. Carries aria-haspopup and aria-expanded.'],
            ['Content', 'The floating panel. Unfolds from the trigger edge over 180ms.'],
            ['Item', 'A single action. Hover and keyboard focus share the same highlight.'],
            ['Separator', 'A 1px rule that groups related items.'],
            ['Shortcut', 'Optional right-aligned hint rendered in the mono face.'],
          ].map(([part, desc]) => (
            <div key={part} style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ac-text)', minWidth: 84 }}>{part}</span>
              <span style={{ color: 'var(--fg-2)' }}>{desc}</span>
            </div>
          ))}
        </div>
      </Section>
    </ComponentDoc>
  )
}
