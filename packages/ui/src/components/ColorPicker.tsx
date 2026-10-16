import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as RPointerEvent,
} from 'react'
import { cx } from '../utils/cx'
import {
  fromRgb,
  hslToRgb,
  oklchToRgb,
  parseColor,
  rgbToHex,
  type ColorValue,
  type Hsl,
} from '../utils/color'
import { ColorSwatch } from './ColorSwatch'

export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch'
export type ColorPickerSize = 'sm' | 'md'

export interface ColorPickerProps {
  value?: string
  defaultValue?: string
  onChange?: (value: ColorValue) => void
  /** Which format tab is active by default */
  format?: ColorFormat
  /** Which format tabs to show. Default: all four. */
  formats?: ColorFormat[]
  /** Toggle the alpha slider */
  showAlpha?: boolean
  /** Show the EyeDropper button (only renders if the API is supported) */
  showEyeDropper?: boolean
  /** Preset palette rendered below the controls */
  swatches?: string[]
  /** When set, a WCAG contrast badge is shown vs this color */
  contrastAgainst?: string
  size?: ColorPickerSize
  className?: string
  style?: CSSProperties
}

interface EyeDropperAPI {
  open(): Promise<{ sRGBHex: string }>
}
declare global {
  interface Window {
    EyeDropper?: { new (): EyeDropperAPI }
  }
}

const DEFAULT_FORMATS: ColorFormat[] = ['hex', 'rgb', 'hsl', 'oklch']

const CHECKER =
  'repeating-conic-gradient(var(--line) 0% 25%, var(--bg-1) 0% 50%) 0 0 / 10px 10px'

/* ─────────────────────────────────────────────────────────────── */

function useControllableHsl(value: string | undefined, defaultValue: string | undefined, showAlpha: boolean) {
  // Internal state is HSL (so hue/saturation don't drift when brightness hits 0 or 100).
  const [internal, setInternal] = useState<Hsl>(() => {
    const seed = value ?? defaultValue ?? '#3b82f6'
    const parsed = parseColor(seed)
    const hsl = parsed?.hsl ?? { h: 217, s: 91, l: 60, a: 1 }
    return showAlpha ? hsl : { ...hsl, a: 1 }
  })
  // Keep in sync with controlled value — but only when it changes externally.
  const lastExternal = useRef<string | undefined>(value)
  useEffect(() => {
    if (value === undefined) return
    if (value === lastExternal.current) return
    lastExternal.current = value
    const parsed = parseColor(value)
    if (parsed) setInternal(parsed.hsl)
  }, [value])
  return [internal, setInternal] as const
}

/* ─────────────────────────────────────────────────────────────── */

export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(function ColorPicker(
  {
    value,
    defaultValue,
    onChange,
    format: initialFormat = 'hex',
    formats = DEFAULT_FORMATS,
    showAlpha = true,
    showEyeDropper = true,
    swatches,
    contrastAgainst,
    size = 'md',
    className,
    style,
  },
  ref,
) {
  const [hsl, setHsl] = useControllableHsl(value, defaultValue, showAlpha)
  const [tab, setTab] = useState<ColorFormat>(initialFormat)

  const current: ColorValue = useMemo(() => fromRgb(hslToRgb(hsl)), [hsl])

  const emit = useCallback(
    (next: Hsl) => {
      setHsl(next)
      onChange?.(fromRgb(hslToRgb(next)))
    },
    [onChange, setHsl],
  )

  const pure = useMemo(() => hslToRgb({ h: hsl.h, s: 100, l: 50, a: 1 }), [hsl.h])
  const pureHex = rgbToHex(pure)

  /* ── SV square ────────────────────────────────────────────── */

  const svRef = useRef<HTMLDivElement | null>(null)
  const onSvMove = useCallback(
    (e: RPointerEvent<HTMLDivElement>) => {
      const rect = svRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
      const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height))
      // HSV → HSL. v = 1 - y, s_hsv = x.
      const v = 1 - y
      const s_hsv = x
      const l = v * (1 - s_hsv / 2)
      const s_hsl = l === 0 || l === 1 ? 0 : ((v - l) / Math.min(l, 1 - l)) * 100
      emit({ ...hsl, s: Math.round(s_hsl * 100) / 100, l: Math.round(l * 10000) / 100 })
    },
    [emit, hsl],
  )

  // Compute SV thumb position from current HSL (reversed math).
  const { svX, svY } = useMemo(() => {
    const l = hsl.l / 100
    const s = hsl.s / 100
    const v = l + s * Math.min(l, 1 - l)
    const s_hsv = v === 0 ? 0 : 2 * (1 - l / v)
    return { svX: s_hsv, svY: 1 - v }
  }, [hsl.l, hsl.s])

  const trackPointer = useCallback(
    (
      e: RPointerEvent<HTMLDivElement>,
      onMove: (ev: RPointerEvent<HTMLDivElement>) => void,
    ) => {
      e.preventDefault()
      const target = e.currentTarget
      target.setPointerCapture?.(e.pointerId)
      onMove(e)
      const move = (me: PointerEvent) => onMove(me as unknown as RPointerEvent<HTMLDivElement>)
      const up = () => {
        target.removeEventListener('pointermove', move)
        target.removeEventListener('pointerup', up)
        target.removeEventListener('pointercancel', up)
      }
      target.addEventListener('pointermove', move)
      target.addEventListener('pointerup', up)
      target.addEventListener('pointercancel', up)
    },
    [],
  )

  /* ── Hue slider ───────────────────────────────────────────── */

  const hueRef = useRef<HTMLDivElement | null>(null)
  const onHueMove = useCallback(
    (e: RPointerEvent<HTMLDivElement>) => {
      const rect = hueRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
      emit({ ...hsl, h: Math.round(x * 360 * 100) / 100 })
    },
    [emit, hsl],
  )

  /* ── Alpha slider ─────────────────────────────────────────── */

  const alphaRef = useRef<HTMLDivElement | null>(null)
  const onAlphaMove = useCallback(
    (e: RPointerEvent<HTMLDivElement>) => {
      const rect = alphaRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
      emit({ ...hsl, a: Math.round(x * 1000) / 1000 })
    },
    [emit, hsl],
  )

  /* ── EyeDropper ───────────────────────────────────────────── */

  const [droppering, setDroppering] = useState(false)
  const hasEyeDropper =
    showEyeDropper && typeof window !== 'undefined' && typeof window.EyeDropper === 'function'
  const openDropper = useCallback(async () => {
    if (!window.EyeDropper) return
    try {
      setDroppering(true)
      const picked = await new window.EyeDropper().open()
      const parsed = parseColor(picked.sRGBHex)
      if (parsed) emit(parsed.hsl)
    } catch {
      /* user cancelled */
    } finally {
      setDroppering(false)
    }
  }, [emit])

  /* ── Numeric field editing ────────────────────────────────── */

  const [draftHex, setDraftHex] = useState(current.hex)
  useEffect(() => {
    setDraftHex(showAlpha ? rgbToHex(current.rgb, current.alpha < 1) : current.hex)
  }, [current.hex, current.rgb, current.alpha, showAlpha])

  const commitHex = (next: string) => {
    const parsed = parseColor(next)
    if (parsed) emit(parsed.hsl)
    else setDraftHex(current.hex)
  }

  const commitRgb = (k: 'r' | 'g' | 'b', raw: string) => {
    const n = Math.min(255, Math.max(0, Number(raw) || 0))
    const next = { ...current.rgb, [k]: n }
    emit(fromRgb(next).hsl)
  }
  const commitAlpha = (raw: string) => {
    const n = Math.min(1, Math.max(0, Number(raw) || 0))
    emit({ ...hsl, a: n })
  }
  const commitHslField = (k: 'h' | 's' | 'l', raw: string) => {
    const n = Number(raw) || 0
    emit({ ...hsl, [k]: n })
  }
  const commitOklch = (k: 'l' | 'c' | 'h', raw: string) => {
    const n = Number(raw) || 0
    const next = { ...current.oklch, [k]: n }
    emit(fromRgb(oklchToRgb(next)).hsl)
  }

  /* ── Styles ───────────────────────────────────────────────── */

  const panelSize = size === 'sm' ? 180 : 220
  const sliderH = 12
  const thumb = 14

  const root: CSSProperties = {
    width: panelSize + 32,
    padding: 14,
    borderRadius: 'var(--r-md)',
    background: 'var(--vl-popover-bg, var(--bg-1))',
    border: '1px solid var(--line)',
    color: 'var(--fg)',
    fontFamily: 'var(--font-sans)',
    fontSize: 13,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    boxSizing: 'border-box',
  }

  const svStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: panelSize,
    borderRadius: 'var(--r-sm)',
    cursor: 'crosshair',
    background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${pureHex})`,
    touchAction: 'none',
    userSelect: 'none',
  }

  const svThumb: CSSProperties = {
    position: 'absolute',
    left: `${svX * 100}%`,
    top: `${svY * 100}%`,
    width: thumb,
    height: thumb,
    borderRadius: '50%',
    border: '2px solid #fff',
    boxShadow: '0 0 0 1px rgba(0,0,0,0.35)',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    background: current.hex,
  }

  const hueStyle: CSSProperties = {
    position: 'relative',
    height: sliderH,
    borderRadius: sliderH / 2,
    background:
      'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
    cursor: 'pointer',
    touchAction: 'none',
    userSelect: 'none',
  }

  const alphaStyle: CSSProperties = {
    position: 'relative',
    height: sliderH,
    borderRadius: sliderH / 2,
    background: CHECKER,
    overflow: 'hidden',
    cursor: 'pointer',
    touchAction: 'none',
    userSelect: 'none',
  }
  const alphaGradient: CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(to right, transparent, ${pureHex})`,
    borderRadius: 'inherit',
    pointerEvents: 'none',
  }

  const sliderThumb = (left: number): CSSProperties => ({
    position: 'absolute',
    left: `${left * 100}%`,
    top: '50%',
    width: thumb,
    height: thumb,
    borderRadius: '50%',
    border: '2px solid #fff',
    boxShadow: '0 0 0 1px rgba(0,0,0,0.35)',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    background: 'currentColor',
  })

  const tabBtn = (active: boolean): CSSProperties => ({
    flex: 1,
    padding: '5px 0',
    fontSize: 11,
    fontFamily: 'var(--font-mono)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    borderRadius: 'var(--r-sm)',
    border: 'none',
    background: active ? 'var(--bg-2)' : 'transparent',
    color: active ? 'var(--fg)' : 'var(--fg-3)',
    cursor: 'pointer',
    transition: 'background 150ms, color 150ms',
  })

  const field: CSSProperties = {
    width: '100%',
    height: 28,
    padding: '0 8px',
    borderRadius: 'var(--r-sm)',
    border: '1px solid var(--line-2)',
    background: 'var(--bg-2)',
    color: 'var(--fg)',
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    outline: 'none',
    boxSizing: 'border-box',
  }

  const fieldLabel: CSSProperties = {
    fontSize: 10,
    fontFamily: 'var(--font-mono)',
    color: 'var(--fg-3)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    textAlign: 'center',
    marginTop: 2,
  }

  const colStack: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flex: 1,
    minWidth: 0,
  }

  /* ── Contrast badge ───────────────────────────────────────── */

  const contrast = useMemo(() => {
    if (!contrastAgainst) return null
    const against = parseColor(contrastAgainst)
    if (!against) return null
    // Reuse the WCAG math inline (keep tree-shakable surface small).
    const srgb = (c: number) => {
      const x = c / 255
      return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4
    }
    const lum = (r: number, g: number, b: number) =>
      0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b)
    const la = lum(current.rgb.r, current.rgb.g, current.rgb.b)
    const lb = lum(against.rgb.r, against.rgb.g, against.rgb.b)
    const [hi, lo] = la > lb ? [la, lb] : [lb, la]
    const ratio = (hi + 0.05) / (lo + 0.05)
    const level = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA Large' : 'Fail'
    return { ratio, level }
  }, [contrastAgainst, current.rgb])

  /* ── Render ───────────────────────────────────────────────── */

  return (
    <div
      ref={ref}
      data-vl-color-picker=""
      data-size={size}
      className={cx('vl-color-picker', className)}
      style={{ ...root, ...style }}
    >
      {/* SV square */}
      <div
        ref={svRef}
        style={svStyle}
        onPointerDown={(e) => trackPointer(e, onSvMove)}
      >
        <span style={svThumb} />
      </div>

      {/* Hue + alpha + preview column */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 36,
            height: showAlpha ? 36 : 20,
            borderRadius: 'var(--r-sm)',
            background: CHECKER,
            border: '1px solid var(--line)',
            overflow: 'hidden',
            position: 'relative',
            flexShrink: 0,
          }}
          aria-label="Current color"
        >
          <span style={{ position: 'absolute', inset: 0, background: current.hex === '#000000' && current.alpha < 1 ? `rgba(0,0,0,${current.alpha})` : `rgba(${current.rgb.r},${current.rgb.g},${current.rgb.b},${current.alpha})` }} />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div
            ref={hueRef}
            style={hueStyle}
            onPointerDown={(e) => trackPointer(e, onHueMove)}
            role="slider"
            aria-label="Hue"
            aria-valuemin={0}
            aria-valuemax={360}
            aria-valuenow={Math.round(hsl.h)}
          >
            <span style={{ ...sliderThumb(hsl.h / 360), color: pureHex }} />
          </div>
          {showAlpha && (
            <div
              ref={alphaRef}
              style={alphaStyle}
              onPointerDown={(e) => trackPointer(e, onAlphaMove)}
              role="slider"
              aria-label="Opacity"
              aria-valuemin={0}
              aria-valuemax={1}
              aria-valuenow={hsl.a}
            >
              <span style={alphaGradient} />
              <span style={{ ...sliderThumb(hsl.a), color: current.hex }} />
            </div>
          )}
        </div>

        {hasEyeDropper && (
          <button
            type="button"
            onClick={openDropper}
            disabled={droppering}
            aria-label="Pick color from screen"
            style={{
              width: 32,
              height: 32,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-2)',
              border: '1px solid var(--line-2)',
              borderRadius: 'var(--r-sm)',
              color: 'var(--fg-2)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m2 22 1-1h3l9-9" />
              <path d="M3 21v-3l9-9" />
              <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
            </svg>
          </button>
        )}
      </div>

      {/* Format tabs */}
      {formats.length > 1 && (
        <div style={{ display: 'flex', gap: 2, padding: 2, background: 'var(--bg-1)', border: '1px solid var(--line)', borderRadius: 'var(--r-sm)' }}>
          {formats.map((f) => (
            <button key={f} type="button" style={tabBtn(tab === f)} onClick={() => setTab(f)}>
              {f}
            </button>
          ))}
        </div>
      )}

      {/* Numeric fields per format */}
      {tab === 'hex' && (
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ ...colStack, flex: 2 }}>
            <input
              style={field}
              value={draftHex}
              onChange={(e) => setDraftHex(e.target.value)}
              onBlur={(e) => commitHex(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
              spellCheck={false}
            />
            <div style={fieldLabel}>HEX</div>
          </div>
          {showAlpha && (
            <div style={colStack}>
              <input
                style={field}
                value={Math.round(hsl.a * 100)}
                onChange={(e) => commitAlpha(String(Number(e.target.value) / 100))}
                type="number"
                min={0}
                max={100}
              />
              <div style={fieldLabel}>A %</div>
            </div>
          )}
        </div>
      )}

      {tab === 'rgb' && (
        <div style={{ display: 'flex', gap: 6 }}>
          {(['r', 'g', 'b'] as const).map((k) => (
            <div key={k} style={colStack}>
              <input style={field} type="number" min={0} max={255} value={Math.round(current.rgb[k])} onChange={(e) => commitRgb(k, e.target.value)} />
              <div style={fieldLabel}>{k.toUpperCase()}</div>
            </div>
          ))}
          {showAlpha && (
            <div style={colStack}>
              <input style={field} type="number" min={0} max={100} value={Math.round(hsl.a * 100)} onChange={(e) => commitAlpha(String(Number(e.target.value) / 100))} />
              <div style={fieldLabel}>A %</div>
            </div>
          )}
        </div>
      )}

      {tab === 'hsl' && (
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={colStack}>
            <input style={field} type="number" min={0} max={360} value={Math.round(hsl.h)} onChange={(e) => commitHslField('h', e.target.value)} />
            <div style={fieldLabel}>H</div>
          </div>
          <div style={colStack}>
            <input style={field} type="number" min={0} max={100} value={Math.round(hsl.s)} onChange={(e) => commitHslField('s', e.target.value)} />
            <div style={fieldLabel}>S %</div>
          </div>
          <div style={colStack}>
            <input style={field} type="number" min={0} max={100} value={Math.round(hsl.l)} onChange={(e) => commitHslField('l', e.target.value)} />
            <div style={fieldLabel}>L %</div>
          </div>
          {showAlpha && (
            <div style={colStack}>
              <input style={field} type="number" min={0} max={100} value={Math.round(hsl.a * 100)} onChange={(e) => commitAlpha(String(Number(e.target.value) / 100))} />
              <div style={fieldLabel}>A %</div>
            </div>
          )}
        </div>
      )}

      {tab === 'oklch' && (
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={colStack}>
            <input style={field} type="number" min={0} max={1} step={0.01} value={current.oklch.l} onChange={(e) => commitOklch('l', e.target.value)} />
            <div style={fieldLabel}>L</div>
          </div>
          <div style={colStack}>
            <input style={field} type="number" min={0} max={0.4} step={0.01} value={current.oklch.c} onChange={(e) => commitOklch('c', e.target.value)} />
            <div style={fieldLabel}>C</div>
          </div>
          <div style={colStack}>
            <input style={field} type="number" min={0} max={360} value={Math.round(current.oklch.h)} onChange={(e) => commitOklch('h', e.target.value)} />
            <div style={fieldLabel}>H</div>
          </div>
          {showAlpha && (
            <div style={colStack}>
              <input style={field} type="number" min={0} max={100} value={Math.round(hsl.a * 100)} onChange={(e) => commitAlpha(String(Number(e.target.value) / 100))} />
              <div style={fieldLabel}>A %</div>
            </div>
          )}
        </div>
      )}

      {/* Contrast badge */}
      {contrast && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 10px',
            borderRadius: 'var(--r-sm)',
            background: 'var(--bg-2)',
            border: '1px solid var(--line)',
            fontSize: 12,
          }}
        >
          <span style={{ color: 'var(--fg-3)' }}>Contrast</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>
            {contrast.ratio.toFixed(2)} :1 ·{' '}
            <span style={{ color: contrast.level === 'Fail' ? 'var(--err)' : 'var(--ok)', fontWeight: 600 }}>
              {contrast.level}
            </span>
          </span>
        </div>
      )}

      {/* Preset swatches */}
      {swatches && swatches.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingTop: 6, borderTop: '1px solid var(--line)' }}>
          {swatches.map((sw) => (
            <ColorSwatch
              key={sw}
              color={sw}
              size="md"
              active={sw.toLowerCase() === current.hex.toLowerCase()}
              onClick={() => {
                const p = parseColor(sw)
                if (p) emit(p.hsl)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
})
