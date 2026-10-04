import { useState } from 'react'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Variants', id: 'variants' },
]

function StaticSlider({ value, ticks, disabled }: { value: number; ticks?: number[]; disabled?: boolean }) {
  return (
    <div style={{ position: 'relative', height: 18, opacity: disabled ? 0.45 : undefined }}>
      <div style={{ position: 'absolute', top: 7, left: 0, right: 0, height: 4, borderRadius: 2, background: 'var(--bg-3)' }} />
      <div style={{ position: 'absolute', top: 7, left: 0, width: `${value}%`, height: 4, borderRadius: 2, background: 'var(--ac)' }} />
      {ticks?.map((t) => (
        <span key={t} style={{ position: 'absolute', top: 7, left: `${t}%`, width: 4, height: 4, marginLeft: -2, borderRadius: '50%', background: 'var(--bg-1)' }} />
      ))}
      <span
        style={{
          position: 'absolute', top: 0, left: `${value}%`, width: 18, height: 18, marginLeft: -9,
          borderRadius: '50%', background: '#fff',
          boxShadow: 'var(--shadow-sm), 0 0 0 2px var(--bg-1), 0 0 0 4px var(--ac)',
        }}
      />
    </div>
  )
}

export default function SliderDoc() {
  const [value, setValue] = useState(64)

  return (
    <ComponentDoc
      slug="slider"
      name="Slider"
      description="Pick a numeric value from a range by dragging. The thumb settles over 180ms with a soft ease-out."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)' }}>Volume</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>{value}</span>
          </div>
          <div style={{ position: 'relative', height: 18, marginTop: 22 }}>
            <span
              style={{
                position: 'absolute', top: -28, left: `${value}%`, transform: 'translateX(-50%)',
                background: 'var(--fg)', color: 'var(--bg)', fontFamily: 'var(--font-mono)',
                fontSize: 11, lineHeight: 1, padding: '4px 6px', borderRadius: 5,
                pointerEvents: 'none', whiteSpace: 'nowrap',
              }}
            >
              {value}
            </span>
            <div style={{ position: 'absolute', top: 7, left: 0, right: 0, height: 4, borderRadius: 2, background: 'var(--bg-3)' }} />
            <div style={{ position: 'absolute', top: 7, left: 0, width: `${value}%`, height: 4, borderRadius: 2, background: 'var(--ac)' }} />
            <span
              style={{
                position: 'absolute', top: 0, left: `${value}%`, width: 18, height: 18, marginLeft: -9,
                borderRadius: '50%', background: '#fff',
                boxShadow: 'var(--shadow-sm), 0 0 0 2px var(--bg-1), 0 0 0 4px var(--ac)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="range"
              min={0}
              max={100}
              value={value}
              aria-label="Volume"
              onChange={(e) => setValue(Number(e.target.value))}
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                opacity: 0, cursor: 'pointer', margin: 0,
              }}
            />
          </div>
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
          {'  '}<span className="p">label=</span><span className="s">"Volume"</span>{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="variants" title="Variants">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 28, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <StaticSlider value={50} ticks={[0, 25, 50, 75, 100]} />
            with steps
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <StaticSlider value={30} disabled />
            disabled
          </div>
        </div>
      </Section>
    </ComponentDoc>
  )
}
