import { useRef, useState } from 'react'
import { BinaryTree, type BinaryTreeHandle, type TraversalOrder } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const btn: React.CSSProperties = {
  height: 28, padding: '0 10px', fontSize: 12,
  borderRadius: 'var(--r-sm)', border: '1px solid var(--line-2)',
  background: 'var(--bg-2)', color: 'var(--fg-2)', cursor: 'pointer',
  fontFamily: 'inherit',
}

const SAMPLE_BST = {
  value: 10,
  left: {
    value: 5,
    left: { value: 2 },
    right: { value: 7 },
  },
  right: {
    value: 15,
    left: { value: 12 },
    right: { value: 20, right: { value: 25 } },
  },
}

const BALANCED = {
  value: 'A',
  left: {
    value: 'B',
    left: { value: 'D' },
    right: { value: 'E' },
  },
  right: {
    value: 'C',
    left: { value: 'F' },
    right: { value: 'G' },
  },
}

export default function BinaryTreeDoc() {
  const ref = useRef<BinaryTreeHandle<number>>(null)
  const [order, setOrder] = useState<TraversalOrder>('inorder')

  const run = async () => {
    await ref.current?.traverse(order, 500)
  }

  return (
    <ComponentDoc
      slug="binary-tree"
      name="BinaryTree"
      description="Visual binary tree with automatic layout, path highlighting, and animated traversal playback. Hand it a root object (value + optional left/right) and pick an order to watch nodes light up in sequence. Works for BSTs, expression trees, heaps, or any binary structure."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
          <BinaryTree ref={ref} root={SAMPLE_BST} size="md" />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {(['inorder', 'preorder', 'postorder', 'levelorder'] as TraversalOrder[]).map((o) => (
              <button
                key={o}
                type="button"
                style={{ ...btn, background: order === o ? 'color-mix(in oklch, var(--ac) 15%, var(--bg-2))' : btn.background }}
                onClick={() => setOrder(o)}
              >
                {o}
              </button>
            ))}
            <button type="button" style={btn} onClick={run}>▶ run traversal</button>
            <button type="button" style={btn} onClick={() => { ref.current?.stop(); ref.current?.highlight(null) }}>reset</button>
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ BinaryTree, type BinaryTreeHandle }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">const</span> ref = useRef&lt;BinaryTreeHandle&lt;<span className="p">number</span>&gt;&gt;(null){'\n\n'}
          <span className="p">&lt;</span>BinaryTree{'\n'}
          {'  '}ref=<span className="p">{'{'}</span>ref<span className="p">{'}'}</span>{'\n'}
          {'  '}root=<span className="p">{'{{'}</span>{'\n'}
          {'    '}value: 10,{'\n'}
          {'    '}left: {'{'} value: 5, left: {'{'} value: 2 {'}'}, right: {'{'} value: 7 {'}'} {'}'},{'\n'}
          {'    '}right: {'{'} value: 15, right: {'{'} value: 20 {'}'} {'}'},{'\n'}
          {'  '}<span className="p">{'}}'}</span>{'\n'}
          <span className="p">/&gt;</span>{'\n\n'}
          ref.current?.traverse(<span className="s">"inorder"</span>){'\n'}
          ref.current?.highlightPath([10, 15, 20])
        </>
      }
    >
      <Section id="traversals" title="Traversal orders">
        <p style={{ color: 'var(--fg-2)', margin: 0 }}>
          Four built-in orders: <code>inorder</code>, <code>preorder</code>, <code>postorder</code>, <code>levelorder</code>. The ref's <code>traverse</code> method lights nodes up one at a time at your chosen interval.
        </p>
        <div className="vl-panel" style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
          <BinaryTree root={BALANCED} size="md" />
        </div>
      </Section>

      <Section id="path" title="Highlight an arbitrary path">
        <p style={{ color: 'var(--fg-2)', margin: 0 }}>
          Use <code>highlightPath([values])</code> (or the controlled <code>highlighted</code> prop) to light the search path for a BST lookup, the ancestors of a node, or any arbitrary set.
        </p>
        <div className="vl-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <BinaryTree root={SAMPLE_BST} highlighted={[10, 15, 20, 25]} />
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--fg-3)' }}>
            search-path for 25 in the BST
          </div>
        </div>
      </Section>

      <Section id="sizes" title="Sizes">
        <div className="vl-panel" style={{ padding: 24, display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
          <BinaryTree root={BALANCED} size="sm" />
          <BinaryTree root={BALANCED} size="md" />
          <BinaryTree root={BALANCED} size="lg" />
        </div>
      </Section>

      <Section id="api" title="API">
        <div className="vl-panel" style={{ padding: '16px 20px', fontSize: 13.5, color: 'var(--fg-2)' }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><code>root</code> — <code>{'{ value, left?, right? }'}</code> recursive node</li>
            <li><code>size</code> — <code>sm</code> | <code>md</code> | <code>lg</code></li>
            <li><code>highlighted</code> — array of values to highlight (controlled)</li>
            <li><code>nodeRadius / xGap / yGap</code> — override layout dimensions</li>
            <li><code>renderNode(value, highlighted)</code> — custom node content</li>
            <li><strong>Ref handle</strong>: <code>highlight(predicate)</code>, <code>highlightPath(values)</code>, <code>traverse(order, intervalMs?)</code>, <code>stop()</code></li>
          </ul>
        </div>
      </Section>
    </ComponentDoc>
  )
}
