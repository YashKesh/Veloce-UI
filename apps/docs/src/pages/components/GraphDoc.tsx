import { useRef, useState } from 'react'
import { Graph, type GraphAlgorithm, type GraphHandle } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const btn: React.CSSProperties = {
  height: 28, padding: '0 10px', fontSize: 12,
  borderRadius: 'var(--r-sm)', border: '1px solid var(--line-2)',
  background: 'var(--bg-2)', color: 'var(--fg-2)', cursor: 'pointer',
  fontFamily: 'inherit',
}

const UNDIRECTED_NODES = [
  { id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' }, { id: 'E' }, { id: 'F' },
]
const UNDIRECTED_EDGES = [
  { from: 'A', to: 'B' }, { from: 'A', to: 'C' },
  { from: 'B', to: 'D' }, { from: 'C', to: 'D' },
  { from: 'C', to: 'E' }, { from: 'D', to: 'F' },
  { from: 'E', to: 'F' },
]

const DAG_NODES = [
  { id: 'start' }, { id: 'build' }, { id: 'test' },
  { id: 'lint' }, { id: 'deploy' }, { id: 'notify' },
]
const DAG_EDGES = [
  { from: 'start', to: 'build' },
  { from: 'start', to: 'lint' },
  { from: 'build', to: 'test' },
  { from: 'test', to: 'deploy' },
  { from: 'lint', to: 'deploy' },
  { from: 'deploy', to: 'notify' },
]

const WEIGHTED_NODES = [{ id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' }]
const WEIGHTED_EDGES = [
  { from: 'A', to: 'B', weight: 4 },
  { from: 'A', to: 'C', weight: 2 },
  { from: 'B', to: 'D', weight: 5 },
  { from: 'C', to: 'D', weight: 8 },
  { from: 'C', to: 'B', weight: 1 },
]

export default function GraphDoc() {
  const ref = useRef<GraphHandle>(null)
  const [start, setStart] = useState('A')
  const [alg, setAlg] = useState<GraphAlgorithm>('bfs')
  const [order, setOrder] = useState<string[]>([])

  const run = async () => {
    const seen = await ref.current?.run(alg, start, 500)
    if (seen) setOrder(seen)
  }

  return (
    <ComponentDoc
      slug="graph"
      name="Graph"
      description="Visual graph component with circular or layered layout, directed/undirected/weighted edges, and animated BFS or DFS playback. Click a node to pick a traversal start, run the algorithm, and watch the visit order light up. Great for CS classrooms, algorithm articles, and interview prep docs."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
          <Graph
            ref={ref}
            nodes={UNDIRECTED_NODES}
            edges={UNDIRECTED_EDGES}
            width={360}
            height={300}
            onNodeClick={(id) => { setStart(id); setOrder([]) }}
          />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', alignSelf: 'center' }}>
              start = {start}
            </span>
            {(['bfs', 'dfs'] as GraphAlgorithm[]).map((a) => (
              <button
                key={a}
                type="button"
                style={{ ...btn, background: alg === a ? 'color-mix(in oklch, var(--ac) 15%, var(--bg-2))' : btn.background }}
                onClick={() => setAlg(a)}
              >
                {a}
              </button>
            ))}
            <button type="button" style={btn} onClick={run}>▶ run</button>
            <button type="button" style={btn} onClick={() => { ref.current?.stop(); ref.current?.highlight(null); setOrder([]) }}>
              reset
            </button>
          </div>
          {order.length > 0 && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-2)' }}>
              visit order: <strong style={{ color: 'var(--ac)' }}>{order.join(' → ')}</strong>
            </div>
          )}
          <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>
            tip: click a node to change the traversal start
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Graph, type GraphHandle }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">const</span> ref = useRef&lt;GraphHandle&gt;(null){'\n\n'}
          <span className="p">&lt;</span>Graph{'\n'}
          {'  '}ref=<span className="p">{'{'}</span>ref<span className="p">{'}'}</span>{'\n'}
          {'  '}nodes=<span className="p">{'{'}</span>[{'{'} id: <span className="s">"A"</span> {'}'}, {'{'} id: <span className="s">"B"</span> {'}'}]<span className="p">{'}'}</span>{'\n'}
          {'  '}edges=<span className="p">{'{'}</span>[{'{'} from: <span className="s">"A"</span>, to: <span className="s">"B"</span> {'}'}]<span className="p">{'}'}</span>{'\n'}
          {'  '}layout=<span className="s">"circular"</span>{'\n'}
          <span className="p">/&gt;</span>{'\n\n'}
          <span className="p">const</span> order = <span className="p">await</span> ref.current?.run(<span className="s">"bfs"</span>, <span className="s">"A"</span>)
        </>
      }
    >
      <Section id="dag" title="Directed Acyclic Graph (layered layout)">
        <p style={{ color: 'var(--fg-2)', margin: 0 }}>
          For DAGs use <code>layout="layered"</code> and <code>directed</code>. Nodes get topologically sorted into horizontal layers — perfect for build pipelines, dependency graphs, workflow diagrams.
        </p>
        <div className="vl-panel" style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
          <Graph
            nodes={DAG_NODES}
            edges={DAG_EDGES}
            directed
            layout="layered"
            width={600}
            height={240}
          />
        </div>
      </Section>

      <Section id="weighted" title="Weighted edges">
        <p style={{ color: 'var(--fg-2)', margin: 0 }}>
          Add <code>weight</code> to any edge to render a labelled chip at its midpoint. Supports both number and string weights (useful for symbolic labels like <code>"3G"</code> or <code>"east"</code>).
        </p>
        <div className="vl-panel" style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
          <Graph
            nodes={WEIGHTED_NODES}
            edges={WEIGHTED_EDGES}
            directed
            layout="circular"
            width={320}
            height={300}
          />
        </div>
      </Section>

      <Section id="api" title="API">
        <div className="vl-panel" style={{ padding: '16px 20px', fontSize: 13.5, color: 'var(--fg-2)' }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><code>nodes</code> — array of <code>{'{ id, label?, x?, y? }'}</code>; explicit coords skip auto-layout</li>
            <li><code>edges</code> — array of <code>{'{ from, to, weight?, directed? }'}</code></li>
            <li><code>directed</code> — default direction for edges (overridable per edge)</li>
            <li><code>layout</code> — <code>circular</code> (default) | <code>layered</code> (DAG)</li>
            <li><code>size</code> — <code>sm</code> | <code>md</code> | <code>lg</code></li>
            <li><code>width / height</code> — SVG viewport</li>
            <li><code>onNodeClick(id)</code> — click handler per node</li>
            <li><code>highlighted</code> — current highlighted node ids (controlled)</li>
            <li><strong>Ref handle</strong>: <code>highlight(ids)</code>, <code>run(algorithm, start, intervalMs?) → visitOrder</code>, <code>stop()</code></li>
          </ul>
        </div>
      </Section>
    </ComponentDoc>
  )
}
