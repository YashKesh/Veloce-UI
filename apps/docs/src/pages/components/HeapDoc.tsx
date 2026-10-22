import { useRef, useState } from 'react'
import { Heap, type HeapHandle, type HeapKind } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const btn: React.CSSProperties = {
  height: 28, padding: '0 10px', fontSize: 12,
  borderRadius: 'var(--r-sm)', border: '1px solid var(--line-2)',
  background: 'var(--bg-2)', color: 'var(--fg-2)', cursor: 'pointer',
  fontFamily: 'inherit',
}

export default function HeapDoc() {
  const ref = useRef<HeapHandle>(null)
  const [kind, setKind] = useState<HeapKind>('min')
  const [status, setStatus] = useState<string>('ready')

  return (
    <ComponentDoc
      slug="heap"
      name="Heap"
      description="Binary min/max heap visualised as a complete tree. Insert animates the sift-up swap path; extract animates sift-down. Array indices are labelled under each node so the array-backed representation stays visible alongside the tree."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
          <Heap ref={ref} kind={kind} defaultData={[3, 7, 5, 10, 9, 15]} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {(['min', 'max'] as HeapKind[]).map((k) => (
              <button
                key={k}
                type="button"
                style={{ ...btn, background: kind === k ? 'color-mix(in oklch, var(--ac) 15%, var(--bg-2))' : btn.background }}
                onClick={() => setKind(k)}
              >
                {k}-heap
              </button>
            ))}
            <button
              type="button"
              style={btn}
              onClick={async () => {
                const v = Math.round(Math.random() * 99)
                setStatus(`inserting ${v}…`)
                await ref.current?.insert(v)
                setStatus(`inserted ${v}`)
              }}
            >
              ▶ insert random
            </button>
            <button
              type="button"
              style={btn}
              onClick={async () => {
                setStatus('extracting root…')
                const v = await ref.current?.extract()
                setStatus(v == null ? 'empty' : `extracted ${v}`)
              }}
            >
              ▶ extract root
            </button>
            <button type="button" style={btn} onClick={() => { ref.current?.stop(); ref.current?.reset() }}>reset</button>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>{status}</div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Heap, type HeapHandle }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">const</span> ref = useRef&lt;HeapHandle&gt;(null){'\n\n'}
          <span className="p">&lt;</span>Heap ref=<span className="p">{'{'}</span>ref<span className="p">{'}'}</span> kind=<span className="s">"min"</span> defaultData=<span className="p">{'{'}</span>[3, 7, 5, 10]<span className="p">{'}'}</span> <span className="p">/&gt;</span>{'\n\n'}
          <span className="p">await</span> ref.current?.insert(1){'\n'}
          <span className="p">await</span> ref.current?.extract()
        </>
      }
    >
      <Section id="min-vs-max" title="Min-heap vs. Max-heap">
        <p style={{ color: 'var(--fg-2)', margin: 0 }}>
          <code>kind="min"</code> keeps the smallest value at the root; <code>kind="max"</code> keeps the largest. The sift animations flip accordingly.
        </p>
        <div className="vl-panel" style={{ padding: 24, display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Heap kind="min" defaultData={[1, 3, 2, 7, 5, 4, 6]} />
          <Heap kind="max" defaultData={[9, 7, 8, 2, 5, 4, 6]} />
        </div>
      </Section>

      <Section id="sizes" title="Sizes">
        <div className="vl-panel" style={{ padding: 24, display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Heap size="sm" defaultData={[1, 3, 2, 7, 5]} />
          <Heap size="md" defaultData={[1, 3, 2, 7, 5]} />
          <Heap size="lg" defaultData={[1, 3, 2, 7, 5]} />
        </div>
      </Section>

      <Section id="api" title="API">
        <div className="vl-panel" style={{ padding: '16px 20px', fontSize: 13.5, color: 'var(--fg-2)' }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><code>data / defaultData</code> — array-backed heap storage</li>
            <li><code>kind</code> — <code>min</code> | <code>max</code></li>
            <li><code>size</code> — <code>sm</code> | <code>md</code> | <code>lg</code></li>
            <li><code>intervalMs</code> — delay between sift steps (default 400)</li>
            <li><code>onChange(next)</code> — fires after each sift step</li>
            <li><strong>Ref handle</strong>: <code>insert(v)</code>, <code>extract()</code>, <code>reset()</code>, <code>snapshot()</code>, <code>stop()</code></li>
          </ul>
        </div>
      </Section>
    </ComponentDoc>
  )
}
