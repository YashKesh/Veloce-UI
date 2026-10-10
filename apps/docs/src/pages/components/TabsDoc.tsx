import { Tabs } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'
import { useState } from 'react'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Variants', id: 'variants' },
]

export default function TabsDoc() {
  const [tab, setTab] = useState('overview')

  return (
    <ComponentDoc
      slug="tabs"
      name="Tabs"
      description="Switch between related panels. The active indicator slides between triggers over 200ms while the incoming panel cross-fades."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 320 }}>
          <Tabs value={tab} onValueChange={setTab}>
            <Tabs.List>
              <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
              <Tabs.Trigger value="usage">
                Usage
                <span
                  style={{
                    marginLeft: 6,
                    fontFamily: 'var(--font-mono)', fontSize: 10.5,
                    background: 'var(--bg-3)', borderRadius: 4,
                    padding: '1px 5px', color: 'var(--fg-2)',
                  }}
                >
                  12
                </span>
              </Tabs.Trigger>
              <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="overview">
              <div style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid var(--line)', background: 'var(--bg)', fontSize: 13, lineHeight: 1.5, color: 'var(--fg-2)' }}>
                Project veloce-docs is live in 14 regions with zero cold starts.
              </div>
            </Tabs.Content>
            <Tabs.Content value="usage">
              <div style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid var(--line)', background: 'var(--bg)', fontSize: 13, lineHeight: 1.5, color: 'var(--fg-2)' }}>
                2.4M edge requests this month — 61% of your plan quota.
              </div>
            </Tabs.Content>
            <Tabs.Content value="billing">
              <div style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid var(--line)', background: 'var(--bg)', fontSize: 13, lineHeight: 1.5, color: 'var(--fg-2)' }}>
                Pro plan · next invoice $20 on Oct 14, 2026.
              </div>
            </Tabs.Content>
          </Tabs>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Tabs }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Tabs <span className="p">value=</span>{'{'}tab{'}'} <span className="p">onValueChange=</span>{'{'}setTab{'}'}<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Tabs.List<span className="p">&gt;</span>{'\n'}
          {'    '}<span className="p">&lt;</span>Tabs.Trigger <span className="p">value=</span><span className="s">"overview"</span><span className="p">&gt;</span>Overview<span className="p">&lt;/</span>Tabs.Trigger<span className="p">&gt;</span>{'\n'}
          {'    '}<span className="p">&lt;</span>Tabs.Trigger <span className="p">value=</span><span className="s">"billing"</span><span className="p">&gt;</span>Billing<span className="p">&lt;/</span>Tabs.Trigger<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;/</span>Tabs.List<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Tabs.Content <span className="p">value=</span><span className="s">"overview"</span><span className="p">&gt;</span>…<span className="p">&lt;/</span>Tabs.Content<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;/</span>Tabs<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="variants" title="Variants">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <SegmentedExample />
        </div>
      </Section>
    </ComponentDoc>
  )
}

function SegmentedExample() {
  const [t, setT] = useState('a')
  return (
    <Tabs value={t} onValueChange={setT}>
      <Tabs.List>
        <Tabs.Trigger value="a">Overview</Tabs.Trigger>
        <Tabs.Trigger value="b">Usage</Tabs.Trigger>
        <Tabs.Trigger value="c">Billing</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="a">
        <div style={{ padding: 14, fontSize: 13, color: 'var(--fg-2)' }}>Overview panel</div>
      </Tabs.Content>
      <Tabs.Content value="b">
        <div style={{ padding: 14, fontSize: 13, color: 'var(--fg-2)' }}>Usage panel</div>
      </Tabs.Content>
      <Tabs.Content value="c">
        <div style={{ padding: 14, fontSize: 13, color: 'var(--fg-2)' }}>Billing panel</div>
      </Tabs.Content>
    </Tabs>
  )
}
