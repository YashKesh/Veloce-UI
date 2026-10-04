import type { ReactNode } from 'react'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'The four primitives', id: 'primitives' },
]

function Diagram({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>{title}</span>
      {children}
    </div>
  )
}

function ContainerDiagram() {
  return (
    <div style={{ width: 180, border: '1px solid var(--line)', borderRadius: 8, padding: '10px 0', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '60%', height: 34, background: 'var(--bg-3)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)' }}>
        max-w 720
      </div>
    </div>
  )
}

function GridDiagram() {
  return (
    <div style={{ width: 180, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ height: 22, background: 'var(--bg-3)', borderRadius: 5 }} />
        ))}
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)' }}>cols=3 gap=8</span>
    </div>
  )
}

function StackDiagram() {
  return (
    <div style={{ width: 180, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ height: 12, background: 'var(--bg-3)', borderRadius: 4 }} />
        ))}
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)' }}>gap=12</span>
    </div>
  )
}

function AspectDiagram() {
  return (
    <div style={{ width: 180, aspectRatio: '16 / 9', border: '1px solid var(--line)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)' }}>
      16 / 9
    </div>
  )
}

export default function LayoutDoc() {
  return (
    <ComponentDoc
      slug="layout"
      name="Layout primitives"
      description="Zero-runtime layout components — they compile to flex and grid, no motion, no JS."
      toc={TOC}
      preview={
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px 40px' }}>
          <Diagram title="Container"><ContainerDiagram /></Diagram>
          <Diagram title="Grid"><GridDiagram /></Diagram>
          <Diagram title="Stack"><StackDiagram /></Diagram>
          <Diagram title="AspectRatio"><AspectDiagram /></Diagram>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Stack, Grid, Container }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Container <span className="p">maxWidth=</span>{'{'}720{'}'}<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Stack <span className="p">gap=</span>{'{'}12{'}'}<span className="p">&gt;</span>{'\n'}
          {'    '}<span className="p">&lt;</span>Grid <span className="p">cols=</span>{'{'}3{'}'} <span className="p">gap=</span>{'{'}8{'}'}<span className="p">&gt;</span>{'\n'}
          {'      '}<span className="p">&lt;</span>Card <span className="p">/&gt;</span>{'\n'}
          {'      '}<span className="p">&lt;</span>Card <span className="p">/&gt;</span>{'\n'}
          {'      '}<span className="p">&lt;</span>Card <span className="p">/&gt;</span>{'\n'}
          {'    '}<span className="p">&lt;/</span>Grid<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;/</span>Stack<span className="p">&gt;</span>{'\n'}
          <span className="p">&lt;/</span>Container<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="primitives" title="The four primitives">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px 40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Diagram title="Container"><ContainerDiagram /></Diagram>
            <span style={{ fontSize: 12.5, color: 'var(--fg-2)' }}>Centers content and caps line length.</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Diagram title="Grid"><GridDiagram /></Diagram>
            <span style={{ fontSize: 12.5, color: 'var(--fg-2)' }}>Equal-width columns with a fixed gutter.</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Diagram title="Stack"><StackDiagram /></Diagram>
            <span style={{ fontSize: 12.5, color: 'var(--fg-2)' }}>Vertical rhythm without margin hacks.</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Diagram title="AspectRatio"><AspectDiagram /></Diagram>
            <span style={{ fontSize: 12.5, color: 'var(--fg-2)' }}>Locks children to a ratio — media, embeds, maps.</span>
          </div>
        </div>
      </Section>
    </ComponentDoc>
  )
}
