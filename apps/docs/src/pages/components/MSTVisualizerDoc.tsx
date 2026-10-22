import { useState } from 'react'
import { MSTVisualizer, type MSTAlgorithm } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const btn: React.CSSProperties = {
  height: 28, padding: '0 10px', fontSize: 12,
  borderRadius: 'var(--r-sm)', border: '1px solid var(--line-2)',
  background: 'var(--bg-2)', color: 'var(--fg-2)', cursor: 'pointer',
  fontFamily: 'inherit',
}

const NODES = [{ id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' }, { id: 'E' }, { id: 'F' }]
const EDGES = [
  { from: 'A', to: 'B', weight: 7 },
  { from: 'A', to: 'C', weight: 9 },
  { from: 'B', to: 'C', weight: 10 },
  { from: 'B', to: 'D', weight: 15 },
  { from: 'C', to: 'D', weight: 11 },
  { from: 'C', to: 'E', weight: 2 },
  { from: 'D', to: 'E', weight: 6 },
  { from: 'D', to: 'F', weight: 9 },
  { from: 'E', to: 'F', weight: 4 },
]

export default function MSTVisualizerDoc() {
  const [algo, setAlgo] = useState<MSTAlgorithm>('kruskal')

  return (
    <ComponentDoc
      slug="mst-visualizer"
      name="MSTVisualizer"
      description="Minimum spanning tree visualiser with Kruskal and Prim playback. Each step shows the edge under consideration (purple), rejected cycle-creating edges (dashed red), and accepted MST edges (bold green). Running total weight updates live."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <MSTVisualizer nodes={NODES} edges={EDGES} algorithm={algo} width={400} height={320} />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
            {(['kruskal', 'prim'] as MSTAlgorithm[]).map((a) => (
              <button
                key={a}
                type="button"
                style={{ ...btn, background: algo === a ? 'color-mix(in oklch, var(--ac) 15%, var(--bg-2))' : btn.background }}
                onClick={() => setAlgo(a)}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ MSTVisualizer }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>MSTVisualizer{'\n'}
          {'  '}nodes=<span className="p">{'{'}</span>nodes<span className="p">{'}'}</span>{'\n'}
          {'  '}edges=<span className="p">{'{'}</span>edges<span className="p">{'}'}</span>{'\n'}
          {'  '}algorithm=<span className="s">"kruskal"</span>{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="comparison" title="Kruskal vs. Prim side-by-side">
        <p style={{ color: 'var(--fg-2)', margin: 0 }}>
          Both algorithms produce the same MST on this graph but visit edges in a very different order.
        </p>
        <div className="vl-panel" style={{ padding: 24, display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          <MSTVisualizer nodes={NODES} edges={EDGES} algorithm="kruskal" width={320} height={260} />
          <MSTVisualizer nodes={NODES} edges={EDGES} algorithm="prim" width={320} height={260} />
        </div>
      </Section>

      <Section id="api" title="API">
        <div className="vl-panel" style={{ padding: '16px 20px', fontSize: 13.5, color: 'var(--fg-2)' }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><code>nodes / edges</code> — graph; edges must carry a <code>weight</code></li>
            <li><code>algorithm</code> — <code>kruskal</code> | <code>prim</code></li>
            <li><code>startNode</code> — Prim's start (default: first node)</li>
            <li><code>intervalMs</code> — delay between steps (default 500)</li>
            <li><strong>Ref handle</strong>: <code>playback</code></li>
          </ul>
        </div>
      </Section>
    </ComponentDoc>
  )
}
