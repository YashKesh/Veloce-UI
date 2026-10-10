import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { Progress } from 'veloce-ui'

import { Link } from 'react-router-dom'
import { ComponentDoc, Section, CodeBlock } from '../../components/ComponentDoc'

const mono: CSSProperties = { fontFamily: 'var(--font-mono)' }

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'States', id: 'states' },
]

export default function ProgressDoc() {
  const [value, setValue] = useState(72)

  useEffect(() => {
    const t = setInterval(() => setValue((v) => (v >= 96 ? 12 : v + 7)), 900)
    return () => clearInterval(t)
  }, [])

  const preview = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, width: '100%', maxWidth: 480 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
          <span style={{ color: 'var(--fg-2)' }}>Uploading source maps</span>
          <span style={{ ...mono, fontVariantNumeric: 'tabular-nums', color: 'var(--fg-3)' }}>{value}%</span>
        </div>
        <Progress value={value} max={100} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
          <span style={{ color: 'var(--fg-2)' }}>Compile</span>
          <span style={{ ...mono, color: 'var(--fg-3)' }}>8 / 10 steps</span>
        </div>
        <Progress value={8} max={10} />
      </div>
    </div>
  )

  const usage = (
    <>
      <span className="p">import</span> {'{'} Progress {'}'} <span className="p">from</span> <span className="s">"veloce-ui"</span>{'\n'}
      {'\n'}
      <span className="p">const</span> [value, setValue] = useState(<span className="p">0</span>){'\n\n'}
      <span className="p">{'<'}</span>Progress value=<span className="p">{'{'}</span>value<span className="p">{'}'}</span> max=<span className="p">{'{'}</span>100<span className="p">{'}'}</span> <span className="p">{'/>'}</span>
    </>
  )

  return (
    <ComponentDoc
      slug="progress"
      name="Progress"
      description="Determinate bar for known work. Width settles over 250ms with ease-settle."
      preview={preview}
      usage={usage}
      toc={TOC}
    >
      <Section id="states" title="States">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Progress value={25} max={100} />
            25%
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Progress value={62} max={100} />
            62%
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Progress value={100} max={100} />
            complete
          </div>
        </div>
        <CodeBlock>
          <span className="p">{'<'}</span>Progress value=<span className="p">{'{'}</span>62<span className="p">{'}'}</span> max=<span className="p">{'{'}</span>100<span className="p">{'}'}</span> <span className="p">{'/>'}</span>
        </CodeBlock>
      </Section>
      <Section id="customization" title="Customization">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Progress value={70} style={{ ['--vl-progress-fill' as string]: 'oklch(0.72 0.16 155)' }} />
          <Progress value={40} style={{ ['--vl-progress-fill' as string]: 'oklch(0.65 0.22 12)', ['--vl-progress-track' as string]: 'color-mix(in oklch, oklch(0.65 0.22 12) 15%, transparent)' }} />
          <CodeBlock>
            <span className="p">&lt;</span>Progress value=<span className="p">{'{'}</span>70<span className="p">{'}'}</span>{'\n'}
            {'  '}<span className="p">style=</span>{'{{'}{'\n'}
            {'    '}<span className="s">'--vl-progress-fill'</span>: <span className="s">'oklch(0.72 0.16 155)'</span>,{'\n'}
            {'  '}{'}}'}{'\n'}
            <span className="p">/&gt;</span>
          </CodeBlock>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-3)' }}>
            Tokens: <code>--vl-progress-track</code>, <code>--vl-progress-fill</code>. See <Link to="/docs/customization" style={{ color: 'var(--ac-text)' }}>/docs/customization</Link>.
          </p>
        </div>
      </Section>
    </ComponentDoc>
  )
}
