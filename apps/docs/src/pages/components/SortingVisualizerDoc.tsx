import { useState } from 'react'
import { SortingVisualizer, type SortAlgorithm } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const btn: React.CSSProperties = {
  height: 28, padding: '0 10px', fontSize: 12,
  borderRadius: 'var(--r-sm)', border: '1px solid var(--line-2)',
  background: 'var(--bg-2)', color: 'var(--fg-2)', cursor: 'pointer',
  fontFamily: 'inherit',
}

const SAMPLE = [8, 3, 1, 7, 4, 6, 2, 5, 9]

export default function SortingVisualizerDoc() {
  const [algo, setAlgo] = useState<SortAlgorithm>('bubble')
  const [data, setData] = useState(SAMPLE)

  return (
    <ComponentDoc
      slug="sorting-visualizer"
      name="SortingVisualizer"
      description="Watch a sorting algorithm run step by step. Pick bubble, selection, insertion, quick, or merge; bars grow / shrink / re-order with every compare and swap. Built-in play / pause / step / reset / speed controls. Perfect for CS101 lectures, interview-prep articles, and algorithm blogs."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <SortingVisualizer data={data} algorithm={algo} width={520} height={240} />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
            {(['bubble', 'selection', 'insertion', 'quick', 'merge'] as SortAlgorithm[]).map((a) => (
              <button
                key={a}
                type="button"
                style={{ ...btn, background: algo === a ? 'color-mix(in oklch, var(--ac) 15%, var(--bg-2))' : btn.background }}
                onClick={() => setAlgo(a)}
              >
                {a}
              </button>
            ))}
            <button type="button" style={btn} onClick={() => setData([...SAMPLE].sort(() => Math.random() - 0.5))}>shuffle</button>
            <button type="button" style={btn} onClick={() => setData(SAMPLE)}>reset data</button>
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ SortingVisualizer }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>SortingVisualizer{'\n'}
          {'  '}data=<span className="p">{'{'}</span>[8, 3, 1, 7, 4, 6, 2, 5]<span className="p">{'}'}</span>{'\n'}
          {'  '}algorithm=<span className="s">"quick"</span>{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="algorithms" title="Side-by-side comparison">
        <p style={{ color: 'var(--fg-2)', margin: 0 }}>
          Mount two visualisers with the same data and different <code>algorithm</code> to show complexity differences.
        </p>
        <div className="vl-panel" style={{ padding: 24, display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          <SortingVisualizer data={SAMPLE} algorithm="bubble" width={360} height={180} />
          <SortingVisualizer data={SAMPLE} algorithm="merge" width={360} height={180} />
        </div>
      </Section>

      <Section id="api" title="API">
        <div className="vl-panel" style={{ padding: '16px 20px', fontSize: 13.5, color: 'var(--fg-2)' }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><code>data / defaultData</code> — array to sort</li>
            <li><code>algorithm</code> — <code>bubble</code> | <code>selection</code> | <code>insertion</code> | <code>quick</code> | <code>merge</code></li>
            <li><code>intervalMs</code> — delay between steps (default 220)</li>
            <li><code>autoPlay</code> — start playing immediately (default false)</li>
            <li><code>width / height</code> — SVG viewport</li>
            <li><code>showControls</code> — toggle the built-in PlaybackControls</li>
            <li><strong>Ref handle</strong>: <code>playback</code> — the full <code>PlaybackState</code> for custom controls</li>
          </ul>
        </div>
      </Section>
    </ComponentDoc>
  )
}
