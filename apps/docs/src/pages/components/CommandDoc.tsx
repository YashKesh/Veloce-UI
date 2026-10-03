import type { CSSProperties, ReactNode } from 'react'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Anatomy', id: 'anatomy' },
]

const mono: CSSProperties = { fontFamily: 'var(--font-mono)' }

function PaletteItem({
  icon, selected, dim, children, right, kbd,
}: { icon: string; selected?: boolean; dim?: boolean; children: ReactNode; right?: string; kbd?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 10px', borderRadius: 7, background: selected ? 'var(--bg-3)' : undefined, color: selected ? undefined : 'var(--fg-2)', opacity: dim ? 0.6 : undefined }}>
      <span style={{ width: 26, height: 26, borderRadius: 6, background: selected ? 'var(--ac-soft)' : 'var(--bg-3)', color: selected ? 'var(--ac-text)' : undefined, display: 'grid', placeItems: 'center', fontSize: 12 }}>
        {icon}
      </span>
      <span style={{ flex: 1 }}>{children}</span>
      {right && <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>{right}</span>}
      {kbd && (
        selected
          ? <span className="vl-kbd" style={{ color: 'var(--fg-2)' }}>{kbd}</span>
          : <span style={{ ...mono, fontSize: 11, color: 'var(--fg-3)' }}>{kbd}</span>
      )}
    </div>
  )
}

const Match = ({ children }: { children: ReactNode }) => (
  <span style={{ color: 'var(--ac-text)', fontWeight: 500 }}>{children}</span>
)

function Palette() {
  return (
    <div style={{ width: '100%', maxWidth: 560, borderRadius: 12, background: 'var(--bg-2)', border: '1px solid var(--line-2)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', fontSize: 13.5, textAlign: 'left' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 50, padding: '0 16px', borderBottom: '1px solid var(--line)' }}>
        <span style={{ color: 'var(--fg-3)', fontSize: 15 }}>⌕</span>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          deploy<span className="vl-caret" style={{ height: 17, marginLeft: 1 }} />
        </span>
        <span className="vl-kbd" style={{ marginLeft: 'auto', padding: '2px 6px' }}>esc</span>
      </div>
      <div style={{ padding: 6, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <div className="vl-label" style={{ padding: '8px 10px 4px', fontSize: 10.5 }}>Actions</div>
        <PaletteItem icon="↑" selected right="main → prod" kbd="↵">
          <Match>Deploy</Match> to production
        </PaletteItem>
        <PaletteItem icon="⟲" kbd="⌘⇧D">
          <Match>Deploy</Match> preview for current branch
        </PaletteItem>
        <PaletteItem icon="⏎">
          Roll back last <Match>deploy</Match>ment
        </PaletteItem>
        <div className="vl-label" style={{ padding: '10px 10px 4px', fontSize: 10.5 }}>Docs</div>
        <PaletteItem icon="¶" right="Guides">
          <Match>Deploy</Match>ment settings
        </PaletteItem>
        <PaletteItem icon="¶" dim>
          Environment variables &amp; <Match>deploy</Match> hooks
        </PaletteItem>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 38, padding: '0 14px', borderTop: '1px solid var(--line)', fontSize: 12, color: 'var(--fg-3)' }}>
        <span><span style={{ ...mono, color: 'var(--fg-2)' }}>↑↓</span> navigate</span>
        <span><span style={{ ...mono, color: 'var(--fg-2)' }}>↵</span> run</span>
        <span style={{ marginLeft: 'auto' }}>5 results · 3ms</span>
      </div>
    </div>
  )
}

export default function CommandDoc() {
  return (
    <ComponentDoc
      slug="command"
      name="Command palette"
      description="A keyboard-first launcher for actions and navigation. Opens with ⌘K, drops in over 200ms, and staggers results by 20ms."
      toc={TOC}
      preview={<Palette />}
      usage={
        <>
          <span className="p">import</span> {'{ Command }'} <span className="p">from</span> <span className="s">"@/components/ui/command"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Command.Root <span className="p">shortcut=</span><span className="s">"mod+k"</span><span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Command.Input <span className="p">placeholder=</span><span className="s">"Type a command…"</span> <span className="p">/&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Command.Group <span className="p">heading=</span><span className="s">"Actions"</span><span className="p">&gt;</span>{'\n'}
          {'    '}<span className="p">&lt;</span>Command.Item <span className="p">kbd=</span><span className="s">"↵"</span> <span className="p">onSelect=</span>{'{'}deploy{'}'}<span className="p">&gt;</span>{'\n'}
          {'      '}Deploy to production{'\n'}
          {'    '}<span className="p">&lt;/</span>Command.Item<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;/</span>Command.Group<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;/</span>Command.Root<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="anatomy" title="Anatomy">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13.5, color: 'var(--fg-2)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
            <span className="vl-kbd">⌘K</span>
            <span><strong style={{ color: 'var(--fg)', fontWeight: 500 }}>Trigger</strong> — global shortcut opens the palette from anywhere.</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
            <span className="vl-kbd">↑↓</span>
            <span><strong style={{ color: 'var(--fg)', fontWeight: 500 }}>Results</strong> — grouped, fuzzy-matched, with the query highlighted in each row.</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
            <span className="vl-kbd">↵</span>
            <span><strong style={{ color: 'var(--fg)', fontWeight: 500 }}>Run</strong> — executes the selected item; <span className="vl-kbd">esc</span> dismisses.</span>
          </div>
        </div>
      </Section>
    </ComponentDoc>
  )
}
