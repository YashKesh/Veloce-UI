import { useTheme, type Accent } from '../theme'

const ACCENTS: { id: Accent; swatch: string }[] = [
  { id: 'violet', swatch: 'oklch(0.64 0.24 292)' },
  { id: 'blue', swatch: 'oklch(0.62 0.19 255)' },
  { id: 'cyan', swatch: 'oklch(0.8 0.13 205)' },
  { id: 'emerald', swatch: 'oklch(0.72 0.16 155)' },
  { id: 'lime', swatch: 'oklch(0.9 0.21 128)' },
  { id: 'amber', swatch: 'oklch(0.83 0.16 70)' },
  { id: 'rose', swatch: 'oklch(0.65 0.22 12)' },
]

export function AccentSwitcher({ compact = false }: { compact?: boolean }) {
  const { accent, setAccent } = useTheme()
  const size = compact ? 16 : 20
  return (
    <div
      role="radiogroup"
      aria-label="Accent color"
      style={{
        display: 'inline-flex',
        gap: 6,
        padding: 4,
        border: '1px solid var(--line)',
        borderRadius: 999,
        background: 'var(--bg-1)',
      }}
    >
      {ACCENTS.map((a) => {
        const active = a.id === accent
        return (
          <button
            key={a.id}
            role="radio"
            aria-checked={active}
            aria-label={a.id}
            onClick={() => setAccent(a.id)}
            style={{
              width: size,
              height: size,
              borderRadius: '50%',
              background: a.swatch,
              padding: 0,
              cursor: 'pointer',
              boxShadow: active ? '0 0 0 2px var(--bg-1), 0 0 0 4px var(--fg)' : 'none',
              transition: 'box-shadow 150ms var(--ease-swift-out)',
            }}
          />
        )
      })}
    </div>
  )
}
