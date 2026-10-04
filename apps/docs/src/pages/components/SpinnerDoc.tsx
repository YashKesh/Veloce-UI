import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'When to use', id: 'usage-notes' },
]

function Spinner({ size, color, borderWidth = 2 }: { size: number; color: string; borderWidth?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `${borderWidth}px solid ${color}`,
        borderRightColor: 'transparent',
        display: 'inline-block',
        animation: 'vl-spin .7s linear infinite',
      }}
    />
  )
}

function Dots() {
  return (
    <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--fg-2)',
            animation: 'vl-dots 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </span>
  )
}

export default function SpinnerDoc() {
  return (
    <ComponentDoc
      slug="spinner"
      name="Spinner"
      description="An indeterminate loading indicator — a single 700ms rotation, linear, no easing tricks."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 36, alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <Spinner size={14} color="var(--fg-3)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>sm</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <Spinner size={20} color="var(--fg-2)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>md</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <Spinner size={28} color="var(--ac)" borderWidth={2.5} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>lg</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <Dots />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>dots</span>
            </div>
          </div>
          <button
            type="button"
            disabled
            className="vl-btn vl-btn--md vl-btn--solid"
            style={{ opacity: 0.6, cursor: 'default', pointerEvents: 'none' }}
          >
            <Spinner size={14} color="currentColor" />
            Deploying…
          </button>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Spinner }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">&lt;</span>Button <span className="p">disabled</span><span className="p">&gt;</span>{'\n'}
          {'  '}<span className="p">&lt;</span>Spinner <span className="p">size=</span><span className="s">"sm"</span> <span className="p">/&gt;</span>{'\n'}
          {'  '}Deploying…{'\n'}
          <span className="p">&lt;/</span>Button<span className="p">&gt;</span>
        </>
      }
    >
      <Section id="usage-notes" title="When to use">
        <div className="vl-panel" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.55 }}>
          <span><strong style={{ color: 'var(--fg)' }}>Spinner</strong> — unknown waits under 2 seconds, like a button submit or a quick fetch.</span>
          <span><strong style={{ color: 'var(--fg)' }}>Skeleton</strong> — content loads where layout is known ahead of time.</span>
          <span><strong style={{ color: 'var(--fg)' }}>Progress</strong> — whenever a percentage is actually known; never fake it.</span>
        </div>
      </Section>
    </ComponentDoc>
  )
}
