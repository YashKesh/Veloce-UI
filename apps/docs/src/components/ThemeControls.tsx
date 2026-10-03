import { useTheme, type Accent } from '../theme'

const ACCENTS: Accent[] = ['violet', 'lime', 'cyan']

export function ThemeControls() {
  const { accent, setAccent, reducedMotion, setReducedMotion } = useTheme()
  return (
    <div
      style={{
        position: 'fixed', bottom: 16, left: 16, zIndex: 100,
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 12px', borderRadius: 10,
        background: 'var(--bg-2)', border: '1px solid var(--line-2)', boxShadow: 'var(--shadow-lg)',
        fontFamily: 'var(--font-mono)', fontSize: 11,
      }}
    >
      {ACCENTS.map((a) => (
        <button
          key={a}
          onClick={() => setAccent(a)}
          aria-label={`Accent ${a}`}
          style={{
            width: 16, height: 16, borderRadius: 999,
            background: a === 'violet' ? 'oklch(0.64 0.24 292)' : a === 'lime' ? 'oklch(0.9 0.21 128)' : 'oklch(0.8 0.13 205)',
            boxShadow: accent === a ? '0 0 0 2px var(--bg-2), 0 0 0 4px var(--ac)' : 'none',
          }}
        />
      ))}
      <span style={{ width: 1, height: 14, background: 'var(--line-2)' }} />
      <button
        onClick={() => setReducedMotion(!reducedMotion)}
        className={`vl-switch${reducedMotion ? ' vl-switch--on' : ''}`}
        style={{ transform: 'scale(.8)', transformOrigin: 'left center' }}
        role="switch"
        aria-checked={reducedMotion}
        aria-label="Reduced motion"
      >
        <span className="thumb" />
      </button>
      <span style={{ color: 'var(--fg-3)' }}>reduced motion</span>
    </div>
  )
}
