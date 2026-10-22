import { useRef, useState } from 'react'
import { SegmentTree, type SegmentTreeHandle, type SegmentTreeOp } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const btn: React.CSSProperties = {
  height: 28, padding: '0 10px', fontSize: 12,
  borderRadius: 'var(--r-sm)', border: '1px solid var(--line-2)',
  background: 'var(--bg-2)', color: 'var(--fg-2)', cursor: 'pointer',
  fontFamily: 'inherit',
}

const INIT = [3, 1, 4, 1, 5, 9, 2, 6]

export default function SegmentTreeDoc() {
  const ref = useRef<SegmentTreeHandle>(null)
  const [data, setData] = useState<number[]>(INIT)
  const [op, setOp] = useState<SegmentTreeOp>('sum')
  const [range, setRange] = useState<[number, number] | null>(null)
  const [result, setResult] = useState<number | null>(null)

  return (
    <ComponentDoc
      slug="segment-tree"
      name="SegmentTree"
      description="Classic segment tree for range queries over an array. Choose sum, min, or max aggregate; each node shows its contents and the index range it covers. Range queries light up the path of visited nodes so viewers see which O(log n) segments the result is composed of."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
          <SegmentTree ref={ref} data={data} op={op} queryRange={range} onChange={setData} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {(['sum', 'min', 'max'] as SegmentTreeOp[]).map((o) => (
              <button
                key={o}
                type="button"
                style={{ ...btn, background: op === o ? 'color-mix(in oklch, var(--ac) 15%, var(--bg-2))' : btn.background }}
                onClick={() => { setOp(o); setRange(null); setResult(null) }}
              >
                {o}
              </button>
            ))}
            <button type="button" style={btn} onClick={() => {
              const l = Number(prompt('l?', '2'))
              const r = Number(prompt('r?', '5'))
              if (!Number.isNaN(l) && !Number.isNaN(r)) {
                setRange([l, r])
                setResult(ref.current?.query(l, r) ?? null)
              }
            }}>query [l,r]</button>
            <button type="button" style={btn} onClick={() => {
              const i = Number(prompt('index?', '0'))
              const v = Number(prompt('new value?', '0'))
              if (!Number.isNaN(i) && !Number.isNaN(v)) ref.current?.update(i, v)
            }}>point update</button>
            <button type="button" style={btn} onClick={() => { setRange(null); setResult(null); setData(INIT) }}>reset</button>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>
            data = [{data.join(', ')}]
            {range && <> · query({range[0]}, {range[1]}) = <strong style={{ color: 'var(--ac)' }}>{result}</strong></>}
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ SegmentTree }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>SegmentTree data=<span className="p">{'{'}</span>[3, 1, 4, 1, 5, 9, 2, 6]<span className="p">{'}'}</span> op=<span className="s">"sum"</span> <span className="p">/&gt;</span>{'\n\n'}
          <span className="p">const</span> total = ref.current?.query(2, 5) <span className="p">// highlights path</span>
        </>
      }
    >
      <Section id="aggregates" title="Aggregate operations">
        <p style={{ color: 'var(--fg-2)', margin: 0 }}>
          The <code>op</code> prop picks the reducer. Switch between <code>sum</code>, <code>min</code>, <code>max</code> and the entire tree rebuilds with the new node values.
        </p>
        <div className="vl-panel" style={{ padding: 24, display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
          <SegmentTree data={[3, 1, 4, 1, 5, 9]} op="sum" size="sm" />
          <SegmentTree data={[3, 1, 4, 1, 5, 9]} op="min" size="sm" />
          <SegmentTree data={[3, 1, 4, 1, 5, 9]} op="max" size="sm" />
        </div>
      </Section>

      <Section id="query-path" title="Query path highlighting">
        <p style={{ color: 'var(--fg-2)', margin: 0 }}>
          Pass <code>queryRange</code> directly (or call <code>ref.current.query(l, r)</code>) to light up the O(log n) nodes visited. In a classroom this makes the "we don't recurse into fully-covered subtrees" rule obvious.
        </p>
        <div className="vl-panel" style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
          <SegmentTree data={[3, 1, 4, 1, 5, 9, 2, 6]} op="sum" queryRange={[2, 5]} />
        </div>
      </Section>

      <Section id="api" title="API">
        <div className="vl-panel" style={{ padding: '16px 20px', fontSize: 13.5, color: 'var(--fg-2)' }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><code>data / defaultData</code> — underlying array</li>
            <li><code>op</code> — <code>sum</code> (default) | <code>min</code> | <code>max</code></li>
            <li><code>queryRange</code> — current <code>[l, r]</code> to highlight (controlled)</li>
            <li><code>size</code> — <code>sm</code> | <code>md</code> | <code>lg</code></li>
            <li><strong>Ref handle</strong>: <code>update(index, value)</code>, <code>query(l, r) → number</code>, <code>reset()</code>, <code>snapshot()</code></li>
          </ul>
        </div>
      </Section>
    </ComponentDoc>
  )
}
