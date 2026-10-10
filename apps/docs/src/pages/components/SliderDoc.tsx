import { useState } from 'react'
import { Slider } from 'veloce-ui'
import { Link } from 'react-router-dom'
import { ComponentDoc, Section, CodeBlock } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Variants', id: 'variants' },
]

export default function SliderDoc() {
  const [value, setValue] = useState(64)

  return (
    <ComponentDoc
      slug="slider"
      name="Slider"
      description="Pick a numeric value from a range by dragging. Native range input under the hood for perfect keyboard + touch behavior."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 300 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <label htmlFor="volume-slider" style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)' }}>Volume</label>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>{value}</span>
          </div>
          <Slider
            id="volume-slider"
            value={value}
            onValueChange={setValue}
            min={0}
            max={100}
            aria-label="Volume"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-3)' }}>
            <span>0</span>
            <span>100</span>
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Slider }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">const</span> [volume, setVolume] = useState(<span className="p">64</span>)
          {'\n\n'}
          <span className="p">&lt;</span>Slider{'\n'}
          {'  '}<span className="p">value=</span>{'{'}volume{'}'}{'\n'}
          {'  '}<span className="p">onValueChange=</span>{'{'}setVolume{'}'}{'\n'}
          {'  '}<span className="p">min=</span>{'{'}0{'}'} <span className="p">max=</span>{'{'}100{'}'}{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="variants" title="Variants">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 28, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Slider defaultValue={50} min={0} max={100} step={25} aria-label="With steps" />
            steps of 25
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Slider defaultValue={30} disabled aria-label="Disabled" />
            disabled
          </div>
        </div>
      </Section>
      <Section id="customization" title="Customization">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Slider
            defaultValue={65}
            style={{
              ['--vl-slider-fill' as string]: 'oklch(0.72 0.16 155)',
              ['--vl-slider-thumb-border' as string]: 'oklch(0.72 0.16 155)',
            }}
            aria-label="Emerald slider"
          />
          <Slider
            defaultValue={40}
            style={{
              ['--vl-slider-fill' as string]: 'oklch(0.65 0.22 12)',
              ['--vl-slider-thumb-border' as string]: 'oklch(0.65 0.22 12)',
              ['--vl-slider-track' as string]: 'color-mix(in oklch, oklch(0.65 0.22 12) 15%, transparent)',
            }}
            aria-label="Rose slider"
          />
          <CodeBlock>
            <span className="p">&lt;</span>Slider{'\n'}
            {'  '}<span className="p">style=</span>{'{{'}{'\n'}
            {'    '}<span className="s">'--vl-slider-fill'</span>: <span className="s">'oklch(0.72 0.16 155)'</span>,{'\n'}
            {'    '}<span className="s">'--vl-slider-thumb-border'</span>: <span className="s">'oklch(0.72 0.16 155)'</span>,{'\n'}
            {'  '}{'}}'}{'\n'}
            <span className="p">/&gt;</span>
          </CodeBlock>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-3)' }}>
            Tokens: <code>--vl-slider-track</code>, <code>-fill</code>, <code>-thumb</code>, <code>-thumb-border</code>. See <Link to="/docs/customization" style={{ color: 'var(--ac-text)' }}>/docs/customization</Link>.
          </p>
        </div>
      </Section>
    </ComponentDoc>
  )
}
