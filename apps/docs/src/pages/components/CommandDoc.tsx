import { useState } from 'react'
import { Command, Button } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Anatomy', id: 'anatomy' },
]

export default function CommandDoc() {
  const [open, setOpen] = useState(false)
  const [last, setLast] = useState<string | null>(null)

  const run = (what: string) => {
    setLast(what)
    setOpen(false)
  }

  return (
    <ComponentDoc
      slug="command"
      name="Command palette"
      description="A keyboard-first launcher for actions and navigation. Opens with ⌘K, fuzzy-matches, closes on select."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <Button variant="primary" onClick={() => setOpen(true)}>Open palette (⌘K)</Button>
          {last && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ac-text)' }}>
              ran: {last}
            </span>
          )}
          <Command open={open} onOpenChange={setOpen} placeholder="Type a command…">
            <Command.Group heading="Actions">
              <Command.Item value="deploy-prod" onSelect={() => run('Deploy to production')} shortcut="↵">
                Deploy to production
              </Command.Item>
              <Command.Item value="deploy-preview" onSelect={() => run('Deploy preview')} shortcut="⌘⇧D">
                Deploy preview for current branch
              </Command.Item>
              <Command.Item value="rollback" onSelect={() => run('Roll back')}>
                Roll back last deployment
              </Command.Item>
            </Command.Group>
            <Command.Group heading="Docs">
              <Command.Item value="deploy-settings" onSelect={() => run('Open deploy settings')}>
                Deployment settings
              </Command.Item>
              <Command.Item value="env-vars" onSelect={() => run('Env vars docs')}>
                Environment variables & deploy hooks
              </Command.Item>
            </Command.Group>
          </Command>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Command }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">const</span> [open, setOpen] = useState(<span className="p">false</span>)
          {'\n\n'}
          <span className="p">&lt;</span>Command <span className="p">open=</span>{'{'}open{'}'} <span className="p">onOpenChange=</span>{'{'}setOpen{'}'}<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Command.Group <span className="p">heading=</span><span className="s">"Actions"</span><span className="p">&gt;</span>{'\n'}
          {'    '}<span className="p">&lt;</span>Command.Item <span className="p">value=</span><span className="s">"deploy"</span> <span className="p">onSelect=</span>{'{'}deploy{'}'}<span className="p">&gt;</span>{'\n'}
          {'      '}Deploy to production{'\n'}
          {'    '}<span className="p">&lt;/</span>Command.Item<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;/</span>Command.Group<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;/</span>Command<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="anatomy" title="Anatomy">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13.5, color: 'var(--fg-2)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
            <span className="vl-kbd">⌘K</span>
            <span><strong style={{ color: 'var(--fg)', fontWeight: 500 }}>Trigger</strong> — the open prop lets you wire any shortcut.</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
            <span className="vl-kbd">↑↓</span>
            <span><strong style={{ color: 'var(--fg)', fontWeight: 500 }}>Results</strong> — grouped, fuzzy-matched.</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
            <span className="vl-kbd">↵</span>
            <span><strong style={{ color: 'var(--fg)', fontWeight: 500 }}>Run</strong> — selects the current item; <span className="vl-kbd">esc</span> dismisses.</span>
          </div>
        </div>
      </Section>
    </ComponentDoc>
  )
}
