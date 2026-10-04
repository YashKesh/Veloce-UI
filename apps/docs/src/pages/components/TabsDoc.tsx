import { useState } from 'react'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Variants', id: 'variants' },
]

const TABS = ['Overview', 'Usage', 'Billing'] as const
type Tab = (typeof TABS)[number]

const CONTENT: Record<Tab, string> = {
  Overview: 'Project veloce-docs is live in 14 regions with zero cold starts.',
  Usage: '2.4M edge requests this month — 61% of your plan quota.',
  Billing: 'Pro plan · next invoice $20 on Oct 14, 2026.',
}

export default function TabsDoc() {
  const [tab, setTab] = useState<Tab>('Overview')

  return (
    <ComponentDoc
      slug="tabs"
      name="Tabs"
      description="Switch between related panels. The active indicator slides between triggers over 200ms while the incoming panel cross-fades."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 320 }}>
          <div className="vl-seg" style={{ fontSize: 13, alignSelf: 'flex-start' }}>
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`vl-seg__item${tab === t ? ' vl-seg__item--active' : ''}`}
                style={{ padding: '7px 14px', border: 'none', background: tab === t ? undefined : 'transparent', cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                {t}
                {t === 'Usage' && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10.5,
                      background: 'var(--bg-3)',
                      borderRadius: 4,
                      padding: '1px 5px',
                      color: 'var(--fg-2)',
                    }}
                  >
                    12
                  </span>
                )}
              </button>
            ))}
          </div>
          <div style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid var(--line)', background: 'var(--bg)', fontSize: 13, lineHeight: 1.5, color: 'var(--fg-2)' }}>
            {CONTENT[tab]}
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Tabs, TabsList, TabsTrigger, TabsContent }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Tabs <span className="p">defaultValue=</span><span className="s">"overview"</span><span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>TabsList<span className="p">&gt;</span>{'\n'}
          {'    '}<span className="p">&lt;</span>TabsTrigger <span className="p">value=</span><span className="s">"overview"</span><span className="p">&gt;</span>Overview<span className="p">&lt;/</span>TabsTrigger<span className="p">&gt;</span>{'\n'}
          {'    '}<span className="p">&lt;</span>TabsTrigger <span className="p">value=</span><span className="s">"billing"</span><span className="p">&gt;</span>Billing<span className="p">&lt;/</span>TabsTrigger<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;/</span>TabsList<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>TabsContent <span className="p">value=</span><span className="s">"overview"</span><span className="p">&gt;</span>…<span className="p">&lt;/</span>TabsContent<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;/</span>Tabs<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="variants" title="Variants">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
            <div className="vl-seg" style={{ fontSize: 13 }}>
              <span className="vl-seg__item">Overview</span>
              <span className="vl-seg__item vl-seg__item--active" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                Usage
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, background: 'var(--bg-3)', borderRadius: 4, padding: '1px 5px', color: 'var(--fg-2)' }}>12</span>
              </span>
              <span className="vl-seg__item">Billing</span>
            </div>
            segmented
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--line)', fontSize: 13 }}>
              <span style={{ padding: '7px 12px', color: 'var(--fg-2)' }}>Overview</span>
              <span style={{ position: 'relative', padding: '7px 12px', color: 'var(--fg)', fontWeight: 500 }}>
                Usage
                <span style={{ position: 'absolute', left: 12, right: 12, bottom: -1, height: 2, borderRadius: 1, background: 'var(--ac)' }} />
              </span>
              <span style={{ padding: '7px 12px', color: 'var(--fg-2)' }}>Billing</span>
            </div>
            underline
          </div>
        </div>
      </Section>
    </ComponentDoc>
  )
}
