import { useRef, useState } from 'react'
import { AVLTree, type AVLTreeHandle } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const btn: React.CSSProperties = {
  height: 28, padding: '0 10px', fontSize: 12,
  borderRadius: 'var(--r-sm)', border: '1px solid var(--line-2)',
  background: 'var(--bg-2)', color: 'var(--fg-2)', cursor: 'pointer',
  fontFamily: 'inherit',
}

const INIT = [10, 20, 30, 40, 50, 25]

export default function AVLTreeDoc() {
  const ref = useRef<AVLTreeHandle>(null)
  const [vals, setVals] = useState<number[]>(INIT)

  return (
    <ComponentDoc
      slug="avl-tree"
      name="AVLTree"
      description="Self-balancing binary search tree with LL / LR / RR / RL rotations. Each node carries its balance factor badge in a chip; chips go purple when the balance factor hits ±1 so viewers see when a rotation is about to trigger."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
          <AVLTree ref={ref} values={vals} onChange={setVals} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button type="button" style={btn} onClick={() => {
              const v = Math.round(Math.random() * 99)
              setVals((xs) => [...xs, v])
            }}>+ insert random</button>
            <button type="button" style={btn} onClick={() => {
              const n = prompt('value to insert?')
              const v = Number(n)
              if (!Number.isNaN(v)) setVals((xs) => [...xs, v])
            }}>+ insert value</button>
            <button type="button" style={btn} onClick={() => {
              const n = prompt('value to remove?')
              const v = Number(n)
              if (!Number.isNaN(v)) setVals((xs) => xs.filter((x) => x !== v))
            }}>− remove value</button>
            <button type="button" style={btn} onClick={() => setVals(INIT)}>reset</button>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>
            insertion sequence: [{vals.join(', ')}]
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ AVLTree }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>AVLTree defaultValues=<span className="p">{'{'}</span>[10, 20, 30, 40, 50, 25]<span className="p">{'}'}</span> <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="rotations" title="Rotation examples">
        <p style={{ color: 'var(--fg-2)', margin: 0 }}>
          Each sequence below triggers a different rotation. Compare the balance-factor chips against the final shape.
        </p>
        <div className="vl-panel" style={{ padding: 24, display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <AVLTree defaultValues={[10, 20, 30]} />
            <span style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>RR → left rotation</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <AVLTree defaultValues={[30, 20, 10]} />
            <span style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>LL → right rotation</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <AVLTree defaultValues={[30, 10, 20]} />
            <span style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>LR → left-right rotation</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <AVLTree defaultValues={[10, 30, 20]} />
            <span style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>RL → right-left rotation</span>
          </div>
        </div>
      </Section>

      <Section id="api" title="API">
        <div className="vl-panel" style={{ padding: '16px 20px', fontSize: 13.5, color: 'var(--fg-2)' }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><code>values / defaultValues</code> — insertion sequence</li>
            <li><code>showBalance</code> — toggle the balance-factor chip (default true)</li>
            <li><code>size</code> — <code>sm</code> | <code>md</code> | <code>lg</code></li>
            <li><strong>Ref handle</strong>: <code>insert(v)</code>, <code>remove(v)</code>, <code>reset()</code>, <code>snapshot()</code></li>
          </ul>
        </div>
      </Section>
    </ComponentDoc>
  )
}
