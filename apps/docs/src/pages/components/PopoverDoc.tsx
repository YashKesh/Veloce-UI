import { useState } from 'react'
import { Popover, Button, Input } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Placement', id: 'placement' },
]

function SharePopover() {
  const [copied, setCopied] = useState(false)
  return (
    <Popover>
      <Popover.Trigger>
        <Button variant="primary">Share</Button>
      </Popover.Trigger>
      <Popover.Content style={{ width: 240, padding: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>Share this link</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <Input readOnly value="veloce.dev/8fk2" size="sm" style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5 }} />
            <Button size="sm" variant="primary" onClick={() => setCopied(true)}>
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>
      </Popover.Content>
    </Popover>
  )
}

export default function PopoverDoc() {
  return (
    <ComponentDoc
      slug="popover"
      name="Popover"
      description="Rich content anchored to a trigger. Enters with a scale-fade over 180ms and stays open until dismissed."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <SharePopover />
          <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>Click outside or press Esc to close</span>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Popover }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Popover<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Popover.Trigger<span className="p">&gt;</span><span className="p">&lt;</span>Button<span className="p">&gt;</span>Share<span className="p">&lt;/</span>Button<span className="p">&gt;</span><span className="p">&lt;/</span>Popover.Trigger<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Popover.Content <span className="p">side=</span><span className="s">"bottom"</span> <span className="p">align=</span><span className="s">"start"</span><span className="p">&gt;</span>{'\n'}
          {'    '}<span className="p">&lt;</span>ShareForm <span className="p">/&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;/</span>Popover.Content<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;/</span>Popover<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="placement" title="Placement">
        <div className="vl-panel" style={{ padding: '28px 24px', display: 'flex', gap: 24, justifyContent: 'center' }}>
          <Popover>
            <Popover.Trigger><Button variant="outline" size="sm">Top</Button></Popover.Trigger>
            <Popover.Content side="top" align="center" style={{ padding: 10, fontSize: 12.5 }}>Opens above</Popover.Content>
          </Popover>
          <Popover>
            <Popover.Trigger><Button variant="outline" size="sm">Bottom</Button></Popover.Trigger>
            <Popover.Content side="bottom" align="center" style={{ padding: 10, fontSize: 12.5 }}>Opens below</Popover.Content>
          </Popover>
          <Popover>
            <Popover.Trigger><Button variant="outline" size="sm">End-aligned</Button></Popover.Trigger>
            <Popover.Content side="bottom" align="end" style={{ padding: 10, fontSize: 12.5 }}>Right-aligned to trigger</Popover.Content>
          </Popover>
        </div>
      </Section>
    </ComponentDoc>
  )
}
