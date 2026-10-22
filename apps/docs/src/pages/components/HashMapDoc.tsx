import { useRef, useState } from 'react'
import { HashMap, type HashMapEntry, type HashMapHandle } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const btn: React.CSSProperties = {
  height: 28, padding: '0 10px', fontSize: 12,
  borderRadius: 'var(--r-sm)', border: '1px solid var(--line-2)',
  background: 'var(--bg-2)', color: 'var(--fg-2)', cursor: 'pointer',
  fontFamily: 'inherit',
}

const INIT: HashMapEntry[] = [
  { key: 'apple', value: 1 },
  { key: 'banana', value: 2 },
  { key: 'cherry', value: 3 },
  { key: 'date', value: 4 },
  { key: 'elderberry', value: 5 },
  { key: 'fig', value: 6 },
]

export default function HashMapDoc() {
  const ref = useRef<HashMapHandle>(null)
  const [entries, setEntries] = useState<HashMapEntry[]>(INIT)

  return (
    <ComponentDoc
      slug="hash-map"
      name="HashMap"
      description="Hash map visualised as a bucket array with chained collisions. Each put / get flashes the hashed bucket so the hash → bucket relationship stays visible. Load factor badge updates live as entries are added."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
          <HashMap ref={ref} entries={entries} buckets={7} onChange={setEntries} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button type="button" style={btn} onClick={() => {
              const k = prompt('key?')
              const v = prompt('value?')
              if (k && v != null) ref.current?.put(k, v)
            }}>put</button>
            <button type="button" style={btn} onClick={() => {
              const k = prompt('key to get?')
              if (!k) return
              const v = ref.current?.get(k)
              alert(v == null ? 'not found' : `value = ${v}`)
            }}>get</button>
            <button type="button" style={btn} onClick={() => {
              const k = prompt('key to remove?')
              if (k) ref.current?.remove(k)
            }}>remove</button>
            <button type="button" style={btn} onClick={() => ref.current?.clear()}>clear</button>
            <button type="button" style={btn} onClick={() => setEntries(INIT)}>reset</button>
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ HashMap }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>HashMap{'\n'}
          {'  '}defaultEntries=<span className="p">{'{'}</span>[{'{'} key: <span className="s">"apple"</span>, value: 1 {'}'}]<span className="p">{'}'}</span>{'\n'}
          {'  '}buckets=<span className="p">{'{'}</span>7<span className="p">{'}'}</span>{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="buckets" title="Bucket count">
        <p style={{ color: 'var(--fg-2)', margin: 0 }}>
          Smaller bucket counts drive up the load factor and collision rate — perfect for teaching why rehashing matters.
        </p>
        <div className="vl-panel" style={{ padding: 24, display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          <HashMap defaultEntries={INIT} buckets={3} />
          <HashMap defaultEntries={INIT} buckets={11} />
        </div>
      </Section>

      <Section id="custom-hash" title="Custom hash function">
        <p style={{ color: 'var(--fg-2)', margin: 0 }}>
          Pass <code>hashFn</code> to override the default djb2. Useful for showing how a bad hash produces uneven distribution.
        </p>
        <div className="vl-panel" style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
          <HashMap
            defaultEntries={INIT}
            buckets={5}
            hashFn={(k, b) => k.charCodeAt(0) % b}
          />
        </div>
      </Section>

      <Section id="api" title="API">
        <div className="vl-panel" style={{ padding: '16px 20px', fontSize: 13.5, color: 'var(--fg-2)' }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><code>entries / defaultEntries</code> — array of <code>{'{ key, value }'}</code></li>
            <li><code>buckets</code> — bucket count (default 7)</li>
            <li><code>hashFn(key, buckets)</code> — custom hash</li>
            <li><code>size</code> — <code>sm</code> | <code>md</code> | <code>lg</code></li>
            <li><strong>Ref handle</strong>: <code>put(key, value)</code>, <code>get(key)</code>, <code>remove(key)</code>, <code>clear()</code>, <code>snapshot()</code></li>
          </ul>
        </div>
      </Section>
    </ComponentDoc>
  )
}
