import { DropdownMenu, Button } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Anatomy', id: 'anatomy' },
]

export default function DropdownDoc() {
  return (
    <ComponentDoc
      slug="dropdown"
      name="Dropdown menu"
      description="A menu of actions revealed from a trigger. Keyboard navigable, closes on item select, Escape, or click outside."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <DropdownMenu>
            <DropdownMenu.Trigger>
              <Button variant="outline">Options ⌄</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item onSelect={() => alert('Rename')}>Rename</DropdownMenu.Item>
              <DropdownMenu.Item onSelect={() => alert('Duplicate')}>Duplicate</DropdownMenu.Item>
              <DropdownMenu.Item onSelect={() => alert('Move to…')}>Move to…</DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item onSelect={() => alert('Delete')} style={{ color: 'var(--err)' }}>Delete</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
          <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>Arrow keys to navigate, Enter to select, Esc to close</span>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ DropdownMenu, Button }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>DropdownMenu<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>DropdownMenu.Trigger<span className="p">&gt;</span><span className="p">&lt;</span>Button<span className="p">&gt;</span>Options<span className="p">&lt;/</span>Button<span className="p">&gt;</span><span className="p">&lt;/</span>DropdownMenu.Trigger<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>DropdownMenu.Content<span className="p">&gt;</span>{'\n'}
          {'    '}<span className="p">&lt;</span>DropdownMenu.Item <span className="p">onSelect=</span>{'{'}handleDuplicate{'}'}<span className="p">&gt;</span>Duplicate<span className="p">&lt;/</span>DropdownMenu.Item<span className="p">&gt;</span>{'\n'}
          {'    '}<span className="p">&lt;</span>DropdownMenu.Separator <span className="p">/&gt;</span>{'\n'}
          {'    '}<span className="p">&lt;</span>DropdownMenu.Item <span className="p">onSelect=</span>{'{'}handleDelete{'}'}<span className="p">&gt;</span>Delete<span className="p">&lt;/</span>DropdownMenu.Item<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;/</span>DropdownMenu.Content<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;/</span>DropdownMenu<span className="p">&gt;</span>
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
