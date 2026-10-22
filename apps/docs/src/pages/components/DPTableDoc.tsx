import { useState } from 'react'
import { DPTable, type DPKind } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const btn: React.CSSProperties = {
  height: 28, padding: '0 10px', fontSize: 12,
  borderRadius: 'var(--r-sm)', border: '1px solid var(--line-2)',
  background: 'var(--bg-2)', color: 'var(--fg-2)', cursor: 'pointer',
  fontFamily: 'inherit',
}

export default function DPTableDoc() {
  const [kind, setKind] = useState<DPKind>('lcs')
  return (
    <ComponentDoc
      slug="dp-table"
      name="DPTable"
      description="Dynamic-programming table visualiser. Three built-in variants: longest common subsequence (LCS), edit distance (Levenshtein), and 0/1 knapsack. Each cell fills in with the recurrence; dependency cells light up so viewers see where the value came from. Final back-trace highlights the solution path."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
            {(['lcs', 'edit-distance', 'knapsack'] as DPKind[]).map((k) => (
              <button
                key={k}
                type="button"
                style={{ ...btn, background: kind === k ? 'color-mix(in oklch, var(--ac) 15%, var(--bg-2))' : btn.background }}
                onClick={() => setKind(k)}
              >
                {k}
              </button>
            ))}
          </div>
          {kind === 'lcs' && <DPTable kind="lcs" a="AGCAT" b="GAC" />}
          {kind === 'edit-distance' && <DPTable kind="edit-distance" a="kitten" b="sitting" />}
          {kind === 'knapsack' && <DPTable kind="knapsack" weights={[2, 3, 4, 5]} values={[3, 4, 5, 6]} capacity={8} />}
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ DPTable }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>DPTable kind=<span className="s">"lcs"</span> a=<span className="s">"AGCAT"</span> b=<span className="s">"GAC"</span> <span className="p">/&gt;</span>{'\n'}
          <span className="p">&lt;</span>DPTable kind=<span className="s">"knapsack"</span> weights=<span className="p">{'{'}</span>[2, 3, 4]<span className="p">{'}'}</span> values=<span className="p">{'{'}</span>[3, 4, 5]<span className="p">{'}'}</span> capacity=<span className="p">{'{'}</span>8<span className="p">{'}'}</span> <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="examples" title="Three built-in recurrences">
        <div className="vl-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <DPTable kind="lcs" a="ABCBDAB" b="BDCAB" cellSize={30} />
            <span style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>LCS of "ABCBDAB" and "BDCAB"</span>
          </div>
        </div>
      </Section>

      <Section id="api" title="API">
        <div className="vl-panel" style={{ padding: '16px 20px', fontSize: 13.5, color: 'var(--fg-2)' }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><code>kind</code> — <code>lcs</code> | <code>edit-distance</code> | <code>knapsack</code></li>
            <li><code>a / b</code> — strings for LCS / edit-distance</li>
            <li><code>weights / values / capacity</code> — knapsack inputs</li>
            <li><code>cellSize</code> — grid cell edge in px (default 36)</li>
            <li><code>intervalMs</code> — delay between cell fills (default 300)</li>
            <li><strong>Ref handle</strong>: <code>playback</code> — PlaybackState for custom controls</li>
          </ul>
        </div>
      </Section>
    </ComponentDoc>
  )
}
