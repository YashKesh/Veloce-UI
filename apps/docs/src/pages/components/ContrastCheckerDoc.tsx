import { ContrastChecker } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

export default function ContrastCheckerDoc() {
  return (
    <ComponentDoc
      slug="contrast-checker"
      name="ContrastChecker"
      description="WCAG 2.1 contrast calculator. Live ratio and AA / AAA pass/fail badges for both normal and large text sizes. Powered by the same color engine as ColorPicker."
      preview={<ContrastChecker defaultForeground="#111827" defaultBackground="#ffffff" />}
      usage={
        <>
          <span className="p">import</span> {'{ ContrastChecker }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>ContrastChecker{'\n'}
          {'  '}<span className="p">defaultForeground=</span><span className="s">"#111827"</span>{'\n'}
          {'  '}<span className="p">defaultBackground=</span><span className="s">"#ffffff"</span>{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="dark" title="Dark palette example">
        <div className="vl-panel" style={{ padding: 20 }}>
          <ContrastChecker defaultForeground="#f8fafc" defaultBackground="#0f172a" />
        </div>
      </Section>

      <Section id="failing" title="Failing combination">
        <div className="vl-panel" style={{ padding: 20 }}>
          <ContrastChecker defaultForeground="#64748b" defaultBackground="#94a3b8" />
        </div>
      </Section>

      <Section id="api" title="API">
        <div className="vl-panel" style={{ padding: '16px 20px', fontSize: 13.5, color: 'var(--fg-2)' }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><code>foreground / background</code> — controlled values</li>
            <li><code>defaultForeground / defaultBackground</code> — uncontrolled</li>
            <li><code>onChange</code> — fires with <code>{'{ foreground, background, ratio }'}</code></li>
            <li><code>textSize</code> — <code>normal</code> | <code>large</code> (affects threshold labels)</li>
          </ul>
        </div>

        <p style={{ color: 'var(--fg-2)', margin: '12px 0 0' }}>
          You can also use the underlying helpers directly:
        </p>
        <pre className="vl-code" style={{ padding: '12px 14px', fontSize: 13 }}>
{`import { getContrastRatio, wcagLevel } from "veloce-ui"

const ratio = getContrastRatio("#111827", "#ffffff")
const level = wcagLevel(ratio) // "AAA" | "AA" | "AA Large" | "Fail"`}
        </pre>
      </Section>
    </ComponentDoc>
  )
}
