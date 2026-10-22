import { DijkstraVisualizer } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const NODES = [
  { id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' }, { id: 'E' }, { id: 'F' },
]
const EDGES = [
  { from: 'A', to: 'B', weight: 4 },
  { from: 'A', to: 'C', weight: 2 },
  { from: 'B', to: 'C', weight: 5 },
  { from: 'B', to: 'D', weight: 10 },
  { from: 'C', to: 'E', weight: 3 },
  { from: 'E', to: 'D', weight: 4 },
  { from: 'D', to: 'F', weight: 11 },
  { from: 'E', to: 'F', weight: 5 },
]

export default function DijkstraVisualizerDoc() {
  return (
    <ComponentDoc
      slug="dijkstra-visualizer"
      name="DijkstraVisualizer"
      description="Dijkstra's shortest-path algorithm, visualised. Weighted graph on the left; live distance / predecessor table on the right. Each step highlights the node being extracted from the priority queue and lights the edge being relaxed."
      preview={<DijkstraVisualizer nodes={NODES} edges={EDGES} start="A" width={360} height={300} />}
      usage={
        <>
          <span className="p">import</span> {'{ DijkstraVisualizer }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>DijkstraVisualizer{'\n'}
          {'  '}nodes=<span className="p">{'{'}</span>nodes<span className="p">{'}'}</span>{'\n'}
          {'  '}edges=<span className="p">{'{'}</span>edges<span className="p">{'}'}</span>{'\n'}
          {'  '}start=<span className="s">"A"</span>{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="color-coding" title="Reading the visualisation">
        <div className="vl-panel" style={{ padding: '16px 20px', fontSize: 13.5, color: 'var(--fg-2)' }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><strong style={{ color: 'var(--ac)' }}>purple ring</strong> — current node being expanded</li>
            <li><strong style={{ color: 'var(--ok)' }}>green ring + green edges</strong> — nodes finalised; shortest-path tree so far</li>
            <li><strong>bold purple edge</strong> — the edge being relaxed this step</li>
            <li><strong>distance under each node</strong> — current best known distance from <code>start</code></li>
          </ul>
        </div>
      </Section>

      <Section id="api" title="API">
        <div className="vl-panel" style={{ padding: '16px 20px', fontSize: 13.5, color: 'var(--fg-2)' }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><code>nodes / edges</code> — the input graph. Edges must carry a <code>weight</code>.</li>
            <li><code>start</code> — source node id</li>
            <li><code>intervalMs</code> — delay between steps (default 600)</li>
            <li><code>autoPlay</code> — start playing immediately</li>
            <li><code>width / height</code> — graph viewport size</li>
            <li><strong>Ref handle</strong>: <code>playback</code> — the full <code>PlaybackState</code></li>
          </ul>
        </div>
      </Section>
    </ComponentDoc>
  )
}
