import { useState } from 'react'
import { Stepper, Button } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Orientation', id: 'orientation' },
]

const STEPS = [
  { label: 'Details', description: 'Account info' },
  { label: 'Configure', description: 'Project settings' },
  { label: 'Review', description: 'Confirm choices' },
  { label: 'Deploy', description: 'Ship it' },
]

export default function StepperDoc() {
  const [step, setStep] = useState(1)

  return (
    <ComponentDoc
      slug="stepper"
      name="Stepper"
      description="Guides users through a multi-step flow. Supports horizontal and vertical orientations."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, minWidth: 440 }}>
          <Stepper steps={STEPS} activeStep={step} />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Button
              variant="outline"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              Back
            </Button>
            <Button
              variant="primary"
              disabled={step === STEPS.length - 1}
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            >
              Continue
            </Button>
          </div>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Stepper }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">const</span> [step, setStep] = useState(<span className="p">0</span>)
          {'\n\n'}
          <span className="p">&lt;</span>Stepper{'\n'}
          {'  '}<span className="p">steps=</span>{'{['}{'\n'}
          {'    '}{'{'} label: <span className="s">"Details"</span> {'}'}, {'{'} label: <span className="s">"Configure"</span> {'}'},{'\n'}
          {'    '}{'{'} label: <span className="s">"Review"</span> {'}'}, {'{'} label: <span className="s">"Deploy"</span> {'}'},{'\n'}
          {'  ]}'}{'\n'}
          {'  '}<span className="p">activeStep=</span>{'{'}step{'}'}{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="orientation" title="Orientation">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Stepper steps={STEPS} activeStep={2} orientation="horizontal" />
            horizontal
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Stepper steps={STEPS} activeStep={2} orientation="vertical" />
            vertical
          </div>
        </div>
      </Section>
    </ComponentDoc>
  )
}
