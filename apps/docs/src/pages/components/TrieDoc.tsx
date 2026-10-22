import { useRef, useState } from 'react'
import { Trie, type TrieHandle } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const btn: React.CSSProperties = {
  height: 28, padding: '0 10px', fontSize: 12,
  borderRadius: 'var(--r-sm)', border: '1px solid var(--line-2)',
  background: 'var(--bg-2)', color: 'var(--fg-2)', cursor: 'pointer',
  fontFamily: 'inherit',
}

const INIT = ['cat', 'car', 'cart', 'dog', 'door', 'do']

export default function TrieDoc() {
  const ref = useRef<TrieHandle>(null)
  const [words, setWords] = useState<string[]>(INIT)
  const [query, setQuery] = useState('ca')

  return (
    <ComponentDoc
      slug="trie"
      name="Trie"
      description="Prefix tree visualisation. Words share their common prefix in a single branch; terminal nodes (end of a word) get a green ring. Great for autocomplete demos, word-break articles, and interview prep."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
          <Trie ref={ref} words={words} highlightedPrefix={query} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value.toLowerCase())}
              placeholder="prefix"
              style={{
                height: 28, padding: '0 10px', fontSize: 12, width: 100,
                borderRadius: 'var(--r-sm)', border: '1px solid var(--line-2)',
                background: 'var(--bg-2)', color: 'var(--fg)',
                fontFamily: 'var(--font-mono)', outline: 'none',
              }}
            />
            <button type="button" style={btn} onClick={() => {
              const w = prompt('word to insert')?.toLowerCase()
              if (w) setWords((xs) => (xs.includes(w) ? xs : [...xs, w]))
            }}>+ insert word</button>
            <button type="button" style={btn} onClick={() => { setWords(INIT); setQuery('') }}>reset</button>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>
            words: [{words.map((w) => <span key={w} style={{ marginRight: 6 }}>{w}</span>)}]
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Trie }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Trie words=<span className="p">{'{'}</span>["cat", "car", "cart", "dog"]<span className="p">{'}'}</span> highlightedPrefix=<span className="s">"ca"</span> <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="terminal" title="Terminal nodes">
        <p style={{ color: 'var(--fg-2)', margin: 0 }}>
          Nodes where a word ends get a green ring. In the example below, both <code>do</code> and <code>door</code> end on the trie — look for rings on the <code>o</code> at depth 2 and the <code>r</code> at depth 4.
        </p>
        <div className="vl-panel" style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
          <Trie words={['do', 'door', 'dot']} />
        </div>
      </Section>

      <Section id="sizes" title="Sizes">
        <div className="vl-panel" style={{ padding: 24, display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <Trie size="sm" words={['hi', 'hey']} />
          <Trie size="md" words={['hi', 'hey']} />
          <Trie size="lg" words={['hi', 'hey']} />
        </div>
      </Section>

      <Section id="api" title="API">
        <div className="vl-panel" style={{ padding: '16px 20px', fontSize: 13.5, color: 'var(--fg-2)' }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><code>words / defaultWords</code> — list of words to build the trie from</li>
            <li><code>highlightedPrefix</code> — current prefix to light the path for (controlled)</li>
            <li><code>size</code> — <code>sm</code> | <code>md</code> | <code>lg</code></li>
            <li><code>onChange(next)</code> — fires when words change via the ref</li>
            <li><strong>Ref handle</strong>: <code>insert(word)</code>, <code>remove(word)</code>, <code>search(word)</code>, <code>startsWith(prefix)</code>, <code>reset()</code>, <code>snapshot()</code></li>
          </ul>
        </div>
      </Section>
    </ComponentDoc>
  )
}
