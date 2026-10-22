import { useState } from 'react'
import { AStarVisualizer, type AStarHeuristic } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const btn: React.CSSProperties = {
  height: 28, padding: '0 10px', fontSize: 12,
  borderRadius: 'var(--r-sm)', border: '1px solid var(--line-2)',
  background: 'var(--bg-2)', color: 'var(--fg-2)', cursor: 'pointer',
  fontFamily: 'inherit',
}

// 12 x 20 grid; 1 = wall.
const GRID = [
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
  [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

export default function AStarVisualizerDoc() {
  const [heuristic, setHeuristic] = useState<AStarHeuristic>('manhattan')
  const [diagonal, setDiagonal] = useState(false)

  return (
    <ComponentDoc
      slug="astar-visualizer"
      name="AStarVisualizer"
      description="A* grid pathfinding, visualised. Walls block movement; the open set (frontier) and closed set (visited) light up as A* expands cells. Final path lights green on completion. Pick a heuristic (Manhattan / Euclidean / Chebyshev) and compare how it changes the expansion pattern."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <AStarVisualizer grid={GRID} start={[0, 0]} goal={[11, 19]} heuristic={heuristic} diagonal={diagonal} cellSize={22} />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
            {(['manhattan', 'euclidean', 'chebyshev'] as AStarHeuristic[]).map((h) => (
              <button
                key={h}
                type="button"
                style={{ ...btn, background: heuristic === h ? 'color-mix(in oklch, var(--ac) 15%, var(--bg-2))' : btn.background }}
                onClick={() => setHeuristic(h)}
              >
                {h}
              </button>
            ))}
            <button
              type="button"
              style={{ ...btn, background: diagonal ? 'color-mix(in oklch, var(--ac) 15%, var(--bg-2))' : btn.background }}
              onClick={() => setDiagonal((d) => !d)}
            >
              diagonal {diagonal ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ AStarVisualizer }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>AStarVisualizer{'\n'}
          {'  '}grid=<span className="p">{'{'}</span>grid<span className="p">{'}'}</span>{'\n'}
          {'  '}start=<span className="p">{'{'}</span>[0, 0]<span className="p">{'}'}</span>{'\n'}
          {'  '}goal=<span className="p">{'{'}</span>[11, 19]<span className="p">{'}'}</span>{'\n'}
          {'  '}heuristic=<span className="s">"manhattan"</span>{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="legend" title="Reading the grid">
        <div className="vl-panel" style={{ padding: '16px 20px', fontSize: 13.5, color: 'var(--fg-2)' }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><strong style={{ color: 'var(--ac)' }}>purple cell</strong> — start</li>
            <li><strong style={{ color: 'var(--ok)' }}>green cell</strong> — goal / final path</li>
            <li><strong>dark cell</strong> — wall (not passable)</li>
            <li><strong>soft purple</strong> — open set (frontier)</li>
            <li><strong>medium green</strong> — closed set (already expanded)</li>
          </ul>
        </div>
      </Section>

      <Section id="api" title="API">
        <div className="vl-panel" style={{ padding: '16px 20px', fontSize: 13.5, color: 'var(--fg-2)' }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><code>grid</code> — 2D number array; <code>1</code> = wall, <code>0</code> = passable</li>
            <li><code>start / goal</code> — <code>[row, col]</code> tuples</li>
            <li><code>heuristic</code> — <code>manhattan</code> | <code>euclidean</code> | <code>chebyshev</code></li>
            <li><code>diagonal</code> — allow 8-way movement (default false)</li>
            <li><code>cellSize</code> — px per cell</li>
            <li><strong>Ref handle</strong>: <code>playback</code> — PlaybackState for custom controls</li>
          </ul>
        </div>
      </Section>
    </ComponentDoc>
  )
}
