import { useRef, useState } from 'react'
import { LinkedList, type LinkedListHandle } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const btn: React.CSSProperties = {
  height: 28, padding: '0 10px', fontSize: 12,
  borderRadius: 'var(--r-sm)', border: '1px solid var(--line-2)',
  background: 'var(--bg-2)', color: 'var(--fg-2)', cursor: 'pointer',
  fontFamily: 'inherit',
}

function toolbar(onPush: () => void, onPop: () => void, onUnshift: () => void, onShift: () => void, onReset: () => void) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
      <button type="button" style={btn} onClick={onPush}>push →</button>
      <button type="button" style={btn} onClick={onPop}>pop</button>
      <button type="button" style={btn} onClick={onUnshift}>← unshift</button>
      <button type="button" style={btn} onClick={onShift}>shift</button>
      <button type="button" style={btn} onClick={onReset}>reset</button>
    </div>
  )
}

export default function LinkedListDoc() {
  const ref = useRef<LinkedListHandle<number>>(null)
  const [data, setData] = useState<number[]>([10, 20, 30, 40])
  const [highlight, setHighlight] = useState<number | null>(null)
  const INITIAL = [10, 20, 30, 40]

  return (
    <ComponentDoc
      slug="linked-list"
      name="LinkedList"
      description="Visual, interactive linked-list component with singly and doubly linked variants. Each node renders as a two-cell box (data + pointer) with arrows between. Comes with a declarative data prop and an imperative ref API for push, pop, unshift, shift, insert, remove, and highlight."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', width: '100%' }}>
          <LinkedList
            data={data}
            variant="singly"
            size="md"
            highlighted={highlight}
            onChange={setData}
          />
          {toolbar(
            () => setData((d) => [...d, (d[d.length - 1] ?? 0) + 10]),
            () => setData((d) => d.slice(0, -1)),
            () => setData((d) => [(d[0] ?? 10) - 10, ...d]),
            () => setData((d) => d.slice(1)),
            () => { setData(INITIAL); setHighlight(null) },
          )}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {data.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setHighlight((cur) => (cur === i ? null : i))}
                style={{ ...btn, background: highlight === i ? 'color-mix(in oklch, var(--ac) 15%, var(--bg-2))' : btn.background }}
              >
                highlight #{i}
              </button>
            ))}
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ LinkedList, type LinkedListHandle }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n'}
          <span className="p">import</span> {'{ useRef }'} <span className="p">from</span> <span className="s">"react"</span>
          {'\n\n'}
          <span className="p">const</span> ref = useRef&lt;LinkedListHandle&lt;<span className="p">number</span>&gt;&gt;(null){'\n\n'}
          <span className="p">&lt;</span>LinkedList{'\n'}
          {'  '}ref=<span className="p">{'{'}</span>ref<span className="p">{'}'}</span>{'\n'}
          {'  '}data=<span className="p">{'{'}</span>[10, 20, 30, 40]<span className="p">{'}'}</span>{'\n'}
          {'  '}variant=<span className="s">"singly"</span>{'\n'}
          {'  '}onChange=<span className="p">{'{'}</span>setData<span className="p">{'}'}</span>{'\n'}
          <span className="p">/&gt;</span>{'\n\n'}
          ref.current?.push(50){'\n'}
          ref.current?.highlight(2)
        </>
      }
    >
      <Section id="variants" title="Singly vs. Doubly">
        <p style={{ color: 'var(--fg-2)', margin: 0 }}>
          Singly linked nodes only have a forward pointer. Doubly linked nodes have a back pointer too — rendered as an arrow pointing left on the row below the forward arrows.
        </p>
        <div className="vl-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
          <LinkedList data={[1, 2, 3, 4, 5]} variant="singly" />
          <LinkedList data={[1, 2, 3, 4, 5]} variant="doubly" />
        </div>
      </Section>

      <Section id="sizes" title="Sizes">
        <div className="vl-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <LinkedList data={[1, 2, 3]} size="sm" />
          <LinkedList data={[1, 2, 3]} size="md" />
          <LinkedList data={[1, 2, 3]} size="lg" />
        </div>
      </Section>

      <Section id="imperative" title="Imperative API via ref">
        <p style={{ color: 'var(--fg-2)', margin: 0 }}>
          For teaching flows (step through a traversal, animate an insertion sequence) you can skip the data prop and drive the list through its ref handle.
        </p>
        <div className="vl-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <LinkedList ref={ref} defaultData={[1, 2, 3]} variant="singly" />
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" style={btn} onClick={() => ref.current?.push(Math.round(Math.random() * 99))}>ref.push(random)</button>
            <button type="button" style={btn} onClick={() => ref.current?.insert(1, 999)}>ref.insert(1, 999)</button>
            <button type="button" style={btn} onClick={() => ref.current?.remove(0)}>ref.remove(0)</button>
          </div>
        </div>
      </Section>

      <Section id="api" title="API">
        <div className="vl-panel" style={{ padding: '16px 20px', fontSize: 13.5, color: 'var(--fg-2)' }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><code>data / defaultData</code> — array of values</li>
            <li><code>variant</code> — <code>singly</code> | <code>doubly</code></li>
            <li><code>size</code> — <code>sm</code> | <code>md</code> | <code>lg</code></li>
            <li><code>highlighted</code> — index of the current highlight (controlled)</li>
            <li><code>showNull</code> — render the terminating <code>null</code> cell at the tail (default <code>true</code>)</li>
            <li><code>renderNode(value, index, highlighted)</code> — custom cell content</li>
            <li><code>onChange(next)</code> — fires after imperative mutations</li>
            <li><strong>Ref handle</strong>: <code>push</code>, <code>unshift</code>, <code>insert</code>, <code>remove</code>, <code>pop</code>, <code>shift</code>, <code>highlight</code>, <code>snapshot</code></li>
          </ul>
        </div>
      </Section>
    </ComponentDoc>
  )
}
