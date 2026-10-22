import { useRef, useState } from 'react'
import { DisjointSet, type DisjointSetHandle } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const btn: React.CSSProperties = {
  height: 28, padding: '0 10px', fontSize: 12,
  borderRadius: 'var(--r-sm)', border: '1px solid var(--line-2)',
  background: 'var(--bg-2)', color: 'var(--fg-2)', cursor: 'pointer',
  fontFamily: 'inherit',
}

const ITEMS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

export default function DisjointSetDoc() {
  const ref = useRef<DisjointSetHandle>(null)
  const [tick, setTick] = useState(0)

  return (
    <ComponentDoc
      slug="disjoint-set"
      name="DisjointSet"
      description="Union-Find data structure visualised as a forest. Each root carries its rank badge; union-by-rank links the shorter tree under the taller. Perfect for Kruskal's MST, connected-components, and cycle-detection pedagogy."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
          <DisjointSet
            ref={ref}
            items={ITEMS}
            initialUnions={[['A', 'B'], ['C', 'D'], ['E', 'F']]}
            key={tick}
          />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button type="button" style={btn} onClick={() => {
              const a = prompt('union: first element?')
              const b = prompt('union: second element?')
              if (a && b) { ref.current?.union(a.toUpperCase(), b.toUpperCase()); setTick((t) => t + 1) }
            }}>union a b</button>
            <button type="button" style={btn} onClick={() => {
              const a = prompt('find: element?')
              if (a) alert(`find(${a.toUpperCase()}) = ${ref.current?.find(a.toUpperCase())}`)
            }}>find a</button>
            <button type="button" style={btn} onClick={() => {
              const a = prompt('connected: first?')
              const b = prompt('connected: second?')
              if (a && b) alert(`connected(${a.toUpperCase()}, ${b.toUpperCase()}) = ${ref.current?.connected(a.toUpperCase(), b.toUpperCase())}`)
            }}>connected a b</button>
            <button type="button" style={btn} onClick={() => { ref.current?.reset(); setTick((t) => t + 1) }}>reset</button>
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ DisjointSet }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>DisjointSet{'\n'}
          {'  '}items=<span className="p">{'{'}</span>["A", "B", "C", "D"]<span className="p">{'}'}</span>{'\n'}
          {'  '}initialUnions=<span className="p">{'{'}</span>[["A", "B"], ["C", "D"]]<span className="p">{'}'}</span>{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="by-rank" title="Union-by-rank + path compression">
        <p style={{ color: 'var(--fg-2)', margin: 0 }}>
          <code>byRank=true</code> (default) attaches the smaller-rank tree under the larger-rank root. <code>find()</code> also compresses the path so repeated queries flatten the structure.
        </p>
      </Section>

      <Section id="examples" title="Common topologies">
        <div className="vl-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <DisjointSet items={['A', 'B', 'C', 'D']} initialUnions={[['A', 'B'], ['C', 'D'], ['A', 'C']]} />
          <DisjointSet items={['v1', 'v2', 'v3', 'v4', 'v5', 'v6']} initialUnions={[['v1', 'v2'], ['v3', 'v4'], ['v5', 'v6'], ['v2', 'v4']]} />
        </div>
      </Section>

      <Section id="api" title="API">
        <div className="vl-panel" style={{ padding: '16px 20px', fontSize: 13.5, color: 'var(--fg-2)' }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><code>items</code> — the universe of elements; each starts as its own set</li>
            <li><code>initialUnions</code> — seed unions as <code>[a, b]</code> pairs</li>
            <li><code>byRank</code> — union-by-rank + path compression (default true)</li>
            <li><code>size</code> — <code>sm</code> | <code>md</code> | <code>lg</code></li>
            <li><strong>Ref handle</strong>: <code>union(a, b)</code>, <code>find(a)</code>, <code>connected(a, b)</code>, <code>reset()</code>, <code>snapshot()</code></li>
          </ul>
        </div>
      </Section>
    </ComponentDoc>
  )
}
