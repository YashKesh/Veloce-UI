import { useRef, useState } from 'react'
import { Queue, type QueueHandle } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const btn: React.CSSProperties = {
  height: 28, padding: '0 10px', fontSize: 12,
  borderRadius: 'var(--r-sm)', border: '1px solid var(--line-2)',
  background: 'var(--bg-2)', color: 'var(--fg-2)', cursor: 'pointer',
  fontFamily: 'inherit',
}

export default function QueueDoc() {
  const [data, setData] = useState<string[]>(['task-1', 'task-2', 'task-3'])
  const dequeRef = useRef<QueueHandle<number>>(null)
  const [deque, setDeque] = useState<number[]>([2, 3, 4])

  return (
    <ComponentDoc
      slug="queue"
      name="Queue"
      description="FIFO queue visualisation (plus a double-ended deque variant). Horizontal row of frames with explicit front and back labels. Enqueue animates in from the right; dequeue removes from the left. Deque mode adds pushFront + popBack to the ref API."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
          <Queue data={data} onChange={setData} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button type="button" style={btn} onClick={() => setData((q) => [...q, `task-${q.length + 1}`])}>enqueue</button>
            <button type="button" style={btn} onClick={() => setData((q) => q.slice(1))}>dequeue</button>
            <button type="button" style={btn} onClick={() => setData(['task-1', 'task-2', 'task-3'])}>reset</button>
            <button type="button" style={btn} onClick={() => setData([])}>clear</button>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>
            front = <strong style={{ color: 'var(--fg)' }}>{data[0] ?? '(empty)'}</strong> · size = {data.length}
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Queue }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Queue data=<span className="p">{'{'}</span>["a", "b", "c"]<span className="p">{'}'}</span> onChange=<span className="p">{'{'}</span>setData<span className="p">{'}'}</span> <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="deque" title="Deque variant">
        <p style={{ color: 'var(--fg-2)', margin: 0 }}>
          Pass <code>variant="deque"</code> to unlock both ends. The ref handle exposes <code>pushFront</code> and <code>popBack</code> alongside the standard <code>enqueue / dequeue</code>.
        </p>
        <div className="vl-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <Queue ref={dequeRef} data={deque} variant="deque" onChange={setDeque} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button type="button" style={btn} onClick={() => setDeque((q) => [q[0] - 1, ...q])}>pushFront</button>
            <button type="button" style={btn} onClick={() => setDeque((q) => q.slice(1))}>dequeue</button>
            <button type="button" style={btn} onClick={() => setDeque((q) => [...q, q[q.length - 1] + 1])}>enqueue</button>
            <button type="button" style={btn} onClick={() => setDeque((q) => q.slice(0, -1))}>popBack</button>
          </div>
        </div>
      </Section>

      <Section id="sizes" title="Sizes">
        <div className="vl-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <Queue defaultData={[1, 2, 3, 4]} size="sm" />
          <Queue defaultData={[1, 2, 3, 4]} size="md" />
          <Queue defaultData={[1, 2, 3, 4]} size="lg" />
        </div>
      </Section>

      <Section id="api" title="API">
        <div className="vl-panel" style={{ padding: '16px 20px', fontSize: 13.5, color: 'var(--fg-2)' }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><code>data / defaultData</code> — queue contents (front = first element)</li>
            <li><code>variant</code> — <code>fifo</code> (default) | <code>deque</code></li>
            <li><code>size</code> — <code>sm</code> | <code>md</code> | <code>lg</code></li>
            <li><code>maxVisible</code> — collapse older frames (default 7)</li>
            <li><code>renderNode(value, index, isFront, isBack)</code> — custom frame content</li>
            <li><strong>Ref handle</strong>: <code>enqueue</code>, <code>dequeue</code>, <code>pushFront</code>*, <code>popBack</code>*, <code>peek</code>, <code>clear</code>, <code>snapshot</code> (<em>* deque only</em>)</li>
          </ul>
        </div>
      </Section>
    </ComponentDoc>
  )
}
