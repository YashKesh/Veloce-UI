import { useRef, useState } from 'react'
import { DsaStack, type DsaStackHandle } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const btn: React.CSSProperties = {
  height: 28, padding: '0 10px', fontSize: 12,
  borderRadius: 'var(--r-sm)', border: '1px solid var(--line-2)',
  background: 'var(--bg-2)', color: 'var(--fg-2)', cursor: 'pointer',
  fontFamily: 'inherit',
}

export default function DsaStackDoc() {
  const ref = useRef<DsaStackHandle<string>>(null)
  const [data, setData] = useState<string[]>(['A', 'B', 'C'])

  return (
    <ComponentDoc
      slug="dsa-stack"
      name="DsaStack"
      description="LIFO stack visualisation. Vertical column of frames with the top entry highlighted and animated on push. Named DsaStack to avoid colliding with the existing Stack layout primitive. Imperative push / pop / peek / clear API via ref."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
          <DsaStack data={data} onChange={setData} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button type="button" style={btn} onClick={() => setData((d) => [...d, String.fromCharCode(65 + d.length)])}>push</button>
            <button type="button" style={btn} onClick={() => setData((d) => d.slice(0, -1))}>pop</button>
            <button type="button" style={btn} onClick={() => setData(['A', 'B', 'C'])}>reset</button>
            <button type="button" style={btn} onClick={() => setData([])}>clear</button>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>
            top = <strong style={{ color: 'var(--fg)' }}>{data[data.length - 1] ?? '(empty)'}</strong> · depth = {data.length}
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ DsaStack, type DsaStackHandle }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">const</span> ref = useRef&lt;DsaStackHandle&lt;<span className="p">string</span>&gt;&gt;(null){'\n\n'}
          <span className="p">&lt;</span>DsaStack ref=<span className="p">{'{'}</span>ref<span className="p">{'}'}</span> defaultData=<span className="p">{'{'}</span>["A", "B", "C"]<span className="p">{'}'}</span> <span className="p">/&gt;</span>{'\n\n'}
          ref.current?.push(<span className="s">"D"</span>){'\n'}
          ref.current?.pop(){'\n'}
          ref.current?.peek()
        </>
      }
    >
      <Section id="sizes" title="Sizes">
        <div className="vl-panel" style={{ padding: 24, display: 'flex', gap: 20, justifyContent: 'center', alignItems: 'flex-end' }}>
          <DsaStack defaultData={[1, 2, 3]} size="sm" />
          <DsaStack defaultData={[1, 2, 3]} size="md" />
          <DsaStack defaultData={[1, 2, 3]} size="lg" />
        </div>
      </Section>

      <Section id="overflow" title="Overflow handling">
        <p style={{ color: 'var(--fg-2)', margin: 0 }}>
          When the stack exceeds <code>maxVisible</code> frames, older entries collapse into a <code>+N hidden</code> indicator at the top. Default is 8.
        </p>
        <div className="vl-panel" style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
          <DsaStack defaultData={Array.from({ length: 15 }, (_, i) => `frame-${i + 1}`)} maxVisible={5} />
        </div>
      </Section>

      <Section id="imperative" title="Imperative API via ref">
        <div className="vl-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <DsaStack ref={ref} defaultData={['A']} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" style={btn} onClick={() => ref.current?.push(Math.random().toString(36).slice(2, 5))}>ref.push(random)</button>
            <button type="button" style={btn} onClick={() => alert(`peek = ${ref.current?.peek()}`)}>ref.peek()</button>
            <button type="button" style={btn} onClick={() => ref.current?.clear()}>ref.clear()</button>
          </div>
        </div>
      </Section>

      <Section id="api" title="API">
        <div className="vl-panel" style={{ padding: '16px 20px', fontSize: 13.5, color: 'var(--fg-2)' }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><code>data / defaultData</code> — stack contents (top = last element)</li>
            <li><code>size</code> — <code>sm</code> | <code>md</code> | <code>lg</code></li>
            <li><code>maxVisible</code> — collapse older frames beyond this count (default 8)</li>
            <li><code>renderNode(value, index, isTop)</code> — custom frame content</li>
            <li><code>onChange(next)</code> — fires after imperative mutations</li>
            <li><strong>Ref handle</strong>: <code>push</code>, <code>pop</code>, <code>peek</code>, <code>clear</code>, <code>snapshot</code></li>
          </ul>
        </div>
      </Section>
    </ComponentDoc>
  )
}
