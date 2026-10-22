import { TopologicalSortVisualizer } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const BUILD_PIPELINE_NODES = [
  { id: 'start' }, { id: 'lint' }, { id: 'build' }, { id: 'test' },
  { id: 'bundle' }, { id: 'deploy' }, { id: 'notify' },
]
const BUILD_PIPELINE_EDGES = [
  { from: 'start', to: 'lint' },
  { from: 'start', to: 'build' },
  { from: 'build', to: 'test' },
  { from: 'build', to: 'bundle' },
  { from: 'lint', to: 'bundle' },
  { from: 'test', to: 'deploy' },
  { from: 'bundle', to: 'deploy' },
  { from: 'deploy', to: 'notify' },
]

const COURSE_NODES = [
  { id: 'cs101' }, { id: 'math1' }, { id: 'ds' }, { id: 'algo' },
  { id: 'os' }, { id: 'db' }, { id: 'ml' },
]
const COURSE_EDGES = [
  { from: 'cs101', to: 'ds' },
  { from: 'math1', to: 'ds' },
  { from: 'ds', to: 'algo' },
  { from: 'ds', to: 'db' },
  { from: 'cs101', to: 'os' },
  { from: 'algo', to: 'ml' },
  { from: 'db', to: 'ml' },
]

export default function TopologicalSortVisualizerDoc() {
  return (
    <ComponentDoc
      slug="topological-sort-visualizer"
      name="TopologicalSortVisualizer"
      description="Kahn's algorithm for topological sort, visualised step by step. Starts with every in-degree-0 node in the queue; dequeues one at a time, appends to the ordering, then decrements in-degrees of its neighbours (enqueuing any that drop to zero). Great for teaching build pipelines, course prerequisites, and dependency resolution."
      preview={<TopologicalSortVisualizer nodes={BUILD_PIPELINE_NODES} edges={BUILD_PIPELINE_EDGES} width={560} height={240} />}
      usage={
        <>
          <span className="p">import</span> {'{ TopologicalSortVisualizer }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>TopologicalSortVisualizer{'\n'}
          {'  '}nodes=<span className="p">{'{'}</span>nodes<span className="p">{'}'}</span>{'\n'}
          {'  '}edges=<span className="p">{'{'}</span>edges<span className="p">{'}'}</span>{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="legend" title="Reading the visualisation">
        <div className="vl-panel" style={{ padding: '16px 20px', fontSize: 13.5, color: 'var(--fg-2)' }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><strong>in=N</strong> — current in-degree of each node</li>
            <li><strong style={{ color: 'var(--ac)' }}>purple ring</strong> — node just dequeued</li>
            <li><strong style={{ color: 'var(--ok)' }}>green ring</strong> — already in the final order</li>
            <li><strong>soft purple fill</strong> — node currently in the queue</li>
          </ul>
        </div>
      </Section>

      <Section id="use-cases" title="Common DAG shapes">
        <p style={{ color: 'var(--fg-2)', margin: 0 }}>
          Any DAG works — build pipelines, course-prerequisite graphs, task dependency trees, or Makefile-style targets.
        </p>
        <div className="vl-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <TopologicalSortVisualizer nodes={COURSE_NODES} edges={COURSE_EDGES} width={560} height={200} />
          <div style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
            CS course prerequisites — any ordering that respects in-degrees is valid
          </div>
        </div>
      </Section>

      <Section id="api" title="API">
        <div className="vl-panel" style={{ padding: '16px 20px', fontSize: 13.5, color: 'var(--fg-2)' }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><code>nodes</code> — DAG vertex list</li>
            <li><code>edges</code> — directed edges <code>{'{ from, to }'}</code></li>
            <li><code>intervalMs</code> — delay between steps (default 500)</li>
            <li><code>width / height</code> — graph viewport</li>
            <li><strong>Ref handle</strong>: <code>playback</code> — the full <code>PlaybackState</code></li>
            <li>Detects cycles — if the final order has fewer nodes than input, the caption flags "cycle detected"</li>
          </ul>
        </div>
      </Section>
    </ComponentDoc>
  )
}
