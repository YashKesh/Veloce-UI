import { useState } from 'react'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Step states', id: 'states' },
]

const STEPS = ['Details', 'Configure', 'Review', 'Deploy']

function Circle({ state, n }: { state: 'done' | 'current' | 'upcoming' | 'error'; n: number }) {
  const base = {
    width: 24, height: 24, borderRadius: '50%', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0,
    transition: 'background .25s, border-color .25s, color .25s, box-shadow .25s',
  } as const
  if (state === 'done') {
    return <div style={{ ...base, background: 'var(--ac)', color: 'var(--ac-fg)' }}>✓</div>
  }
  if (state === 'current') {
    return <div style={{ ...base, background: 'transparent', border: '2px solid var(--ac)', boxShadow: '0 0 0 4px var(--ac-soft)', color: 'var(--ac-text)' }}>{n}</div>
  }
  if (state === 'error') {
    return <div style={{ ...base, background: 'transparent', border: '1px solid var(--err)', color: 'var(--err)' }}>✕</div>
  }
  return <div style={{ ...base, background: 'transparent', border: '1px solid var(--line-2)', color: 'var(--fg-3)' }}>{n}</div>
}

export default function StepperDoc() {
  const [step, setStep] = useState(1)

  return (
    <ComponentDoc
      slug="stepper"
      name="Stepper"
      description="Guides users through a multi-step flow. The check draws in 150ms; connector fills 250ms."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, minWidth: 420 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            {STEPS.map((label, i) => {
              const state = i < step ? 'done' : i === step ? 'current' : 'upcoming'
              return (
                <div key={label} style={{ display: 'flex', alignItems: 'flex-start', flex: i === 0 ? '0 0 auto' : 1 }}>
                  {i > 0 && (
                    <div style={{
                      flex: 1, height: 2, marginTop: 11,
                      background: i < step
                        ? 'var(--ac)'
                        : i === step
                          ? 'linear-gradient(90deg, var(--ac) 50%, var(--bg-3) 50%)'
                          : 'var(--bg-3)',
                      transition: 'background .25s',
                    }} />
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '0 10px' }}>
                    <Circle state={state} n={i + 1} />
                    <span style={{ fontSize: 12, fontWeight: state === 'current' ? 500 : 400, color: state === 'upcoming' ? 'var(--fg-3)' : 'var(--fg)' }}>{label}</span>
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              style={{
                padding: '7px 16px', borderRadius: 8, fontSize: 13, cursor: step === 0 ? 'default' : 'pointer',
                background: 'var(--bg-1)', color: 'var(--fg-2)', border: '1px solid var(--line)',
                opacity: step === 0 ? 0.4 : 1,
              }}
            >
              Back
            </button>
            <button
              type="button"
              disabled={step === STEPS.length - 1}
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              style={{
                padding: '7px 16px', borderRadius: 8, fontSize: 13, cursor: step === STEPS.length - 1 ? 'default' : 'pointer',
                background: 'var(--ac)', color: 'var(--ac-fg)', border: '1px solid var(--ac)',
                opacity: step === STEPS.length - 1 ? 0.4 : 1,
              }}
            >
              Continue
            </button>
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Stepper, Step }'} <span className="p">from</span> <span className="s">"@/components/ui/stepper"</span>
          {'\n\n'}
          <span className="p">const</span> [step, setStep] = useState(<span className="p">0</span>)
          {'\n\n'}
          <span className="p">&lt;</span>Stepper <span className="p">value=</span>{'{'}step{'}'} <span className="p">onValueChange=</span>{'{'}setStep{'}'}<span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Step <span className="p">label=</span><span className="s">"Details"</span> <span className="p">/&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Step <span className="p">label=</span><span className="s">"Configure"</span> <span className="p">/&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Step <span className="p">label=</span><span className="s">"Review"</span> <span className="p">/&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Step <span className="p">label=</span><span className="s">"Deploy"</span> <span className="p">/&gt;</span>{'\n'}
          <span className="p">&lt;/</span>Stepper<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="states" title="Step states">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <Circle state="done" n={1} />
            done
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <Circle state="current" n={2} />
            current
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <Circle state="upcoming" n={3} />
            upcoming
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <Circle state="error" n={4} />
            error
          </div>
        </div>
      </Section>
    </ComponentDoc>
  )
}
