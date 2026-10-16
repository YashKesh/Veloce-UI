import {
  forwardRef,
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
} from 'react'
import { cx } from '../utils/cx'
import { ColorInput } from './ColorInput'

export type ShadowExportFormat = 'css' | 'tailwind' | 'cssVar'

export interface ShadowLayer {
  x: number
  y: number
  blur: number
  spread: number
  color: string
  inset: boolean
}

export interface ShadowBuilderProps {
  value?: ShadowLayer[]
  defaultValue?: ShadowLayer[]
  onChange?: (layers: ShadowLayer[], cssString: string) => void
  /** Name used for the --cssVar export (e.g. --shadow-md). Default --vl-shadow. */
  cssVarName?: string
  /** Export tabs to show. Default all three. */
  formats?: ShadowExportFormat[]
  /** Preview card background. Default var(--bg-1). */
  previewBackground?: string
  className?: string
  style?: CSSProperties
}

const DEFAULT_VALUE: ShadowLayer[] = [
  { x: 0, y: 1, blur: 2, spread: 0, color: 'rgba(0,0,0,0.08)', inset: false },
  { x: 0, y: 4, blur: 12, spread: -2, color: 'rgba(0,0,0,0.12)', inset: false },
]

/* ─────────────────────────────────────────────────────────────── */

function layerToCss(l: ShadowLayer): string {
  const parts = [`${l.x}px`, `${l.y}px`, `${l.blur}px`]
  if (l.spread !== 0) parts.push(`${l.spread}px`)
  parts.push(l.color)
  const base = parts.join(' ')
  return l.inset ? `inset ${base}` : base
}

function toCss(layers: ShadowLayer[]): string {
  return layers.map(layerToCss).join(', ')
}

function toTailwind(layers: ShadowLayer[]): string {
  return `shadow-[${toCss(layers).replace(/\s+/g, '_')}]`
}

function toCssVar(layers: ShadowLayer[], name: string): string {
  return `${name}: ${toCss(layers)};`
}

/* ─────────────────────────────────────────────────────────────── */

export const ShadowBuilder = forwardRef<HTMLDivElement, ShadowBuilderProps>(function ShadowBuilder(
  {
    value,
    defaultValue,
    onChange,
    cssVarName = '--vl-shadow',
    formats = ['css', 'tailwind', 'cssVar'],
    previewBackground = 'var(--bg-1)',
    className,
    style,
  },
  ref,
) {
  const [internal, setInternal] = useState<ShadowLayer[]>(() => value ?? defaultValue ?? DEFAULT_VALUE)
  const current = value ?? internal
  const [tab, setTab] = useState<ShadowExportFormat>(formats[0] ?? 'css')
  const [copied, setCopied] = useState(false)

  const commit = useCallback(
    (next: ShadowLayer[]) => {
      if (value === undefined) setInternal(next)
      onChange?.(next, toCss(next))
    },
    [value, onChange],
  )

  useEffect(() => {
    if (value !== undefined) setInternal(value)
  }, [value])

  const update = (idx: number, patch: Partial<ShadowLayer>) => {
    commit(current.map((l, i) => (i === idx ? { ...l, ...patch } : l)))
  }
  const addLayer = () => {
    commit([
      ...current,
      { x: 0, y: 4, blur: 8, spread: 0, color: 'rgba(0,0,0,0.12)', inset: false },
    ])
  }
  const removeLayer = (idx: number) => {
    if (current.length <= 1) return
    commit(current.filter((_, i) => i !== idx))
  }
  const move = (idx: number, dir: -1 | 1) => {
    const target = idx + dir
    if (target < 0 || target >= current.length) return
    const next = current.slice()
    ;[next[idx], next[target]] = [next[target], next[idx]]
    commit(next)
  }

  /* ── Export ──────────────────────────────────────────────── */

  const exportText =
    tab === 'tailwind' ? toTailwind(current) : tab === 'cssVar' ? toCssVar(current, cssVarName) : toCss(current)

  const copy = () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return
    navigator.clipboard.writeText(exportText).then(
      () => {
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1400)
      },
      () => {},
    )
  }

  /* ── Styles ──────────────────────────────────────────────── */

  const panel: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    padding: 16,
    borderRadius: 'var(--r-md)',
    background: 'var(--bg-1)',
    border: '1px solid var(--line)',
    fontFamily: 'var(--font-sans)',
    color: 'var(--fg)',
    minWidth: 340,
  }

  const previewWrap: CSSProperties = {
    height: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-2)',
    borderRadius: 'var(--r-md)',
    border: '1px solid var(--line)',
  }

  const previewCard: CSSProperties = {
    width: 180,
    height: 100,
    background: previewBackground,
    borderRadius: 'var(--r-md)',
    boxShadow: toCss(current),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--fg-2)',
    fontSize: 12,
    fontFamily: 'var(--font-mono)',
  }

  const segBtn = (active: boolean): CSSProperties => ({
    flex: 1,
    padding: '5px 0',
    fontSize: 12,
    borderRadius: 'var(--r-sm)',
    border: 'none',
    background: active ? 'var(--bg-2)' : 'transparent',
    color: active ? 'var(--fg)' : 'var(--fg-3)',
    cursor: 'pointer',
    textTransform: 'capitalize',
  })

  const smallField: CSSProperties = {
    width: '100%',
    height: 26,
    padding: '0 6px',
    borderRadius: 'var(--r-sm)',
    border: '1px solid var(--line-2)',
    background: 'var(--bg-2)',
    color: 'var(--fg)',
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    outline: 'none',
    boxSizing: 'border-box',
  }

  const iconBtn = (disabled?: boolean): CSSProperties => ({
    width: 24,
    height: 24,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--r-sm)',
    border: '1px solid var(--line-2)',
    background: 'var(--bg-2)',
    color: 'var(--fg-2)',
    fontSize: 12,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
  })

  const fieldLabel: CSSProperties = {
    fontSize: 10,
    fontFamily: 'var(--font-mono)',
    color: 'var(--fg-3)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginTop: 2,
    textAlign: 'center',
  }

  const col: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }

  return (
    <div ref={ref} className={cx('vl-shadow-builder', className)} style={{ ...panel, ...style }}>
      {/* Preview */}
      <div style={previewWrap}>
        <div style={previewCard}>Card</div>
      </div>

      {/* Layers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {current.map((layer, i) => (
          <div
            key={i}
            style={{
              padding: 10,
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-sm)',
              background: 'var(--bg-2)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', flex: 1 }}>
                Layer {i + 1}
              </span>
              <button type="button" style={iconBtn(i === 0)} onClick={() => move(i, -1)} aria-label="Move up" disabled={i === 0}>↑</button>
              <button type="button" style={iconBtn(i === current.length - 1)} onClick={() => move(i, 1)} aria-label="Move down" disabled={i === current.length - 1}>↓</button>
              <button type="button" style={iconBtn(current.length <= 1)} onClick={() => removeLayer(i)} aria-label="Remove layer" disabled={current.length <= 1}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {(['x', 'y', 'blur', 'spread'] as const).map((k) => (
                <div key={k} style={col}>
                  <input
                    type="number"
                    value={layer[k]}
                    onChange={(e) => update(i, { [k]: Number(e.target.value) || 0 } as Partial<ShadowLayer>)}
                    style={smallField}
                  />
                  <div style={fieldLabel}>{k === 'x' ? 'X' : k === 'y' ? 'Y' : k}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ColorInput value={layer.color} onChange={(v) => {
                const next = v.alpha < 1
                  ? `rgba(${v.rgb.r}, ${v.rgb.g}, ${v.rgb.b}, ${Math.round(v.alpha * 1000) / 1000})`
                  : v.hex
                update(i, { color: next })
              }} size="sm" />
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--fg-2)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={layer.inset}
                  onChange={(e) => update(i, { inset: e.target.checked })}
                  style={{ accentColor: 'var(--ac)' }}
                />
                inset
              </label>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addLayer}
          style={{
            padding: '8px 10px',
            fontSize: 12,
            borderRadius: 'var(--r-sm)',
            border: '1px dashed var(--line-2)',
            background: 'transparent',
            color: 'var(--fg-3)',
            cursor: 'pointer',
          }}
        >
          + Add layer
        </button>
      </div>

      {/* Export */}
      {formats.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {formats.length > 1 && (
            <div style={{ display: 'flex', gap: 2, padding: 2, background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 'var(--r-sm)' }}>
              {formats.map((f) => (
                <button key={f} type="button" style={segBtn(tab === f)} onClick={() => setTab(f)}>
                  {f === 'cssVar' ? 'CSS var' : f}
                </button>
              ))}
            </div>
          )}
          <div style={{ position: 'relative' }}>
            <pre
              style={{
                margin: 0,
                padding: '10px 44px 10px 12px',
                borderRadius: 'var(--r-sm)',
                background: 'var(--bg-2)',
                border: '1px solid var(--line)',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--fg)',
                overflow: 'auto',
                wordBreak: 'break-all',
                whiteSpace: 'pre-wrap',
              }}
            >
              {exportText}
            </pre>
            <button
              type="button"
              onClick={copy}
              style={{
                position: 'absolute', top: 6, right: 6,
                padding: '2px 8px', fontSize: 11, borderRadius: 'var(--r-sm)',
                border: '1px solid var(--line-2)',
                background: copied ? 'color-mix(in oklch, var(--ok) 15%, var(--bg-1))' : 'var(--bg-1)',
                color: copied ? 'var(--ok)' : 'var(--fg-2)', cursor: 'pointer',
              }}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
})
