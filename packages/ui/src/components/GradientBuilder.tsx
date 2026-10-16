import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as RPointerEvent,
} from 'react'
import { cx } from '../utils/cx'
import { parseColor } from '../utils/color'
import { ColorInput } from './ColorInput'
import { ColorSwatch } from './ColorSwatch'

export type GradientType = 'linear' | 'radial' | 'conic'
export type GradientExportFormat = 'css' | 'tailwind' | 'oklch'

export interface GradientStop {
  color: string
  /** Position along the gradient, 0–100. */
  position: number
}

export interface GradientValue {
  type: GradientType
  stops: GradientStop[]
  /** Linear angle in degrees (0 = to top). Ignored for radial. */
  angle: number
}

export interface GradientBuilderProps {
  value?: GradientValue
  defaultValue?: GradientValue
  onChange?: (value: GradientValue, cssString: string) => void
  /** Preview height in px. Default 160. */
  previewHeight?: number
  /** Export format tabs to show. Default all three. */
  formats?: GradientExportFormat[]
  className?: string
  style?: CSSProperties
}

const DEFAULT_VALUE: GradientValue = {
  type: 'linear',
  angle: 90,
  stops: [
    { color: '#3b82f6', position: 0 },
    { color: '#8b5cf6', position: 100 },
  ],
}

/* ─────────────────────────────────────────────────────────────── */

function toCss(v: GradientValue): string {
  const stops = [...v.stops].sort((a, b) => a.position - b.position)
  const inner = stops.map((s) => `${s.color} ${s.position.toFixed(1)}%`).join(', ')
  if (v.type === 'linear') return `linear-gradient(${v.angle}deg, ${inner})`
  if (v.type === 'radial') return `radial-gradient(circle, ${inner})`
  return `conic-gradient(from ${v.angle}deg, ${inner})`
}

function toOklchCss(v: GradientValue): string {
  const converted: GradientValue = {
    ...v,
    stops: v.stops.map((s) => {
      const p = parseColor(s.color)
      if (!p) return s
      const o = p.oklch
      const color =
        p.alpha < 1
          ? `oklch(${o.l} ${o.c} ${o.h} / ${Math.round(p.alpha * 1000) / 1000})`
          : `oklch(${o.l} ${o.c} ${o.h})`
      return { ...s, color }
    }),
  }
  return toCss(converted)
}

function toTailwind(v: GradientValue): string {
  // Tailwind arbitrary-value notation: bg-[linear-gradient(...)]
  return `bg-[${toCss(v).replace(/\s+/g, '_')}]`
}

/* ─────────────────────────────────────────────────────────────── */

export const GradientBuilder = forwardRef<HTMLDivElement, GradientBuilderProps>(
  function GradientBuilder(
    { value, defaultValue, onChange, previewHeight = 160, formats = ['css', 'tailwind', 'oklch'], className, style },
    ref,
  ) {
    const [internal, setInternal] = useState<GradientValue>(() => value ?? defaultValue ?? DEFAULT_VALUE)
    const current = value ?? internal
    const [activeStop, setActiveStop] = useState(0)
    const [tab, setTab] = useState<GradientExportFormat>(formats[0] ?? 'css')
    const [copied, setCopied] = useState(false)

    const commit = useCallback(
      (next: GradientValue) => {
        if (value === undefined) setInternal(next)
        onChange?.(next, toCss(next))
      },
      [value, onChange],
    )

    // Keep internal in sync when value prop changes.
    useEffect(() => {
      if (value !== undefined) setInternal(value)
    }, [value])

    const sortedStops = [...current.stops]
      .map((s, i) => ({ ...s, _origIdx: i }))
      .sort((a, b) => a.position - b.position)

    /* ── Stop drag track ────────────────────────────────────── */

    const trackRef = useRef<HTMLDivElement | null>(null)
    const [dragIdx, setDragIdx] = useState<number | null>(null)

    const posFromClient = (clientX: number) => {
      const rect = trackRef.current?.getBoundingClientRect()
      if (!rect) return 0
      return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    }

    const onStopDown = (idx: number) => (e: RPointerEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      const target = e.currentTarget
      target.setPointerCapture?.(e.pointerId)
      setActiveStop(idx)
      setDragIdx(idx)
    }

    useEffect(() => {
      if (dragIdx === null) return
      const onMove = (ev: PointerEvent) => {
        const pos = posFromClient(ev.clientX)
        const next = {
          ...current,
          stops: current.stops.map((s, i) => (i === dragIdx ? { ...s, position: pos } : s)),
        }
        commit(next)
      }
      const onUp = () => setDragIdx(null)
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
      window.addEventListener('pointercancel', onUp)
      return () => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        window.removeEventListener('pointercancel', onUp)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dragIdx, current.stops])

    const onTrackDown = (e: RPointerEvent<HTMLDivElement>) => {
      // Add a new stop at the click position.
      const pos = posFromClient(e.clientX)
      // Choose a color halfway between neighbours.
      const sorted = [...current.stops].sort((a, b) => a.position - b.position)
      const left = [...sorted].reverse().find((s) => s.position <= pos) ?? sorted[0]
      const next = { ...current, stops: [...current.stops, { color: left.color, position: pos }] }
      commit(next)
      setActiveStop(next.stops.length - 1)
    }

    const addStop = () => {
      const pos = 50
      const next = { ...current, stops: [...current.stops, { color: '#ffffff', position: pos }] }
      commit(next)
      setActiveStop(next.stops.length - 1)
    }
    const removeStop = (idx: number) => {
      if (current.stops.length <= 2) return
      const next = { ...current, stops: current.stops.filter((_, i) => i !== idx) }
      commit(next)
      setActiveStop(Math.max(0, idx - 1))
    }

    const setStopColor = (idx: number, color: string) => {
      commit({ ...current, stops: current.stops.map((s, i) => (i === idx ? { ...s, color } : s)) })
    }
    const setStopPos = (idx: number, position: number) => {
      commit({ ...current, stops: current.stops.map((s, i) => (i === idx ? { ...s, position } : s)) })
    }

    /* ── Export + copy ──────────────────────────────────────── */

    const exportText =
      tab === 'oklch' ? toOklchCss(current) : tab === 'tailwind' ? toTailwind(current) : toCss(current)

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

    /* ── Styles ─────────────────────────────────────────────── */

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
      minWidth: 320,
    }

    const preview: CSSProperties = {
      height: previewHeight,
      borderRadius: 'var(--r-md)',
      background: toCss(current),
      border: '1px solid var(--line)',
    }

    const track: CSSProperties = {
      position: 'relative',
      height: 28,
      borderRadius: 14,
      background: `linear-gradient(90deg, ${[...current.stops]
        .sort((a, b) => a.position - b.position)
        .map((s) => `${s.color} ${s.position.toFixed(1)}%`)
        .join(', ')})`,
      border: '1px solid var(--line)',
      cursor: 'copy',
      userSelect: 'none',
      touchAction: 'none',
    }

    const stopHandle = (pos: number): CSSProperties => ({
      position: 'absolute',
      left: `${pos}%`,
      top: '50%',
      width: 18,
      height: 28,
      transform: 'translate(-50%, -50%)',
      cursor: 'grab',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    })

    const stopPip = (color: string, active: boolean): CSSProperties => ({
      width: 14,
      height: 14,
      borderRadius: '50%',
      background: color,
      border: `2px solid ${active ? 'var(--ac)' : 'var(--bg-1)'}`,
      boxShadow: active
        ? '0 0 0 2px color-mix(in oklch, var(--ac) 35%, transparent), 0 1px 3px rgba(0,0,0,0.2)'
        : '0 1px 2px rgba(0,0,0,0.3)',
      pointerEvents: 'none',
    })

    const segBtn = (active: boolean): CSSProperties => ({
      flex: 1,
      padding: '5px 0',
      fontSize: 12,
      fontFamily: 'var(--font-sans)',
      borderRadius: 'var(--r-sm)',
      border: 'none',
      background: active ? 'var(--bg-2)' : 'transparent',
      color: active ? 'var(--fg)' : 'var(--fg-3)',
      cursor: 'pointer',
      textTransform: 'capitalize',
    })

    const smallField: CSSProperties = {
      width: 56,
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

    const active = current.stops[activeStop]

    return (
      <div ref={ref} className={cx('vl-gradient-builder', className)} style={{ ...panel, ...style }}>
        {/* Preview */}
        <div style={preview} />

        {/* Type + angle */}
        <div style={{ display: 'flex', gap: 2, padding: 2, background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 'var(--r-sm)' }}>
          {(['linear', 'radial', 'conic'] as GradientType[]).map((t) => (
            <button key={t} type="button" style={segBtn(current.type === t)} onClick={() => commit({ ...current, type: t })}>
              {t}
            </button>
          ))}
        </div>

        {current.type !== 'radial' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--fg-3)', width: 48 }}>Angle</span>
            <input
              type="range"
              min={0}
              max={360}
              value={current.angle}
              onChange={(e) => commit({ ...current, angle: Number(e.target.value) })}
              style={{ flex: 1, accentColor: 'var(--ac)' }}
            />
            <input
              type="number"
              min={0}
              max={360}
              value={current.angle}
              onChange={(e) => commit({ ...current, angle: Number(e.target.value) || 0 })}
              style={smallField}
            />
            <span style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>deg</span>
          </div>
        )}

        {/* Stops track */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div ref={trackRef} style={track} onPointerDown={onTrackDown}>
            {sortedStops.map((s) => (
              <div
                key={s._origIdx}
                style={stopHandle(s.position)}
                onPointerDown={onStopDown(s._origIdx)}
              >
                <span style={stopPip(s.color, s._origIdx === activeStop)} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>
            <span>click track → add stop</span>
            <span>drag pips to re-position</span>
          </div>
        </div>

        {/* Active stop editor */}
        {active && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ColorSwatch color={active.color} size="md" />
            <ColorInput
              value={active.color}
              onChange={(v) => setStopColor(activeStop, v.hex)}
              size="sm"
            />
            <input
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={active.position.toFixed(1)}
              onChange={(e) => setStopPos(activeStop, Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
              style={smallField}
            />
            <span style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>%</span>
            <button
              type="button"
              onClick={() => removeStop(activeStop)}
              disabled={current.stops.length <= 2}
              style={{
                height: 26, padding: '0 10px', fontSize: 11, borderRadius: 'var(--r-sm)',
                border: '1px solid var(--line-2)', background: 'var(--bg-2)', color: 'var(--fg-2)',
                cursor: current.stops.length <= 2 ? 'not-allowed' : 'pointer',
                opacity: current.stops.length <= 2 ? 0.5 : 1,
              }}
            >
              Remove
            </button>
            <button
              type="button"
              onClick={addStop}
              style={{
                height: 26, padding: '0 10px', fontSize: 11, borderRadius: 'var(--r-sm)',
                border: '1px solid var(--line-2)', background: 'var(--bg-2)', color: 'var(--fg-2)',
                cursor: 'pointer',
              }}
            >
              + Add
            </button>
          </div>
        )}

        {/* Export */}
        {formats.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {formats.length > 1 && (
              <div style={{ display: 'flex', gap: 2, padding: 2, background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 'var(--r-sm)' }}>
                {formats.map((f) => (
                  <button key={f} type="button" style={segBtn(tab === f)} onClick={() => setTab(f)}>
                    {f}
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
  },
)
