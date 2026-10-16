import { forwardRef, useEffect, useRef, useState, type CSSProperties } from 'react'
import { cx } from '../utils/cx'
import { parseColor, type ColorValue } from '../utils/color'
import { ColorSwatch } from './ColorSwatch'
import { ColorPicker, type ColorFormat, type ColorPickerProps } from './ColorPicker'

export type ColorInputSize = 'sm' | 'md'

export interface ColorInputProps {
  value?: string
  defaultValue?: string
  onChange?: (value: ColorValue) => void
  size?: ColorInputSize
  invalid?: boolean
  disabled?: boolean
  placeholder?: string
  /** Format shown in the text field. Defaults to 'hex'. */
  displayAs?: ColorFormat
  /** Props forwarded to the inner ColorPicker */
  pickerProps?: Omit<ColorPickerProps, 'value' | 'defaultValue' | 'onChange'>
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

const sizeMap: Record<ColorInputSize, { h: number; fs: number; pad: number }> = {
  sm: { h: 30, fs: 13, pad: 8 },
  md: { h: 36, fs: 14, pad: 10 },
}

function formatValue(v: ColorValue, as: ColorFormat): string {
  switch (as) {
    case 'rgb':
      return v.alpha < 1
        ? `rgba(${v.rgb.r}, ${v.rgb.g}, ${v.rgb.b}, ${Math.round(v.alpha * 1000) / 1000})`
        : `rgb(${v.rgb.r}, ${v.rgb.g}, ${v.rgb.b})`
    case 'hsl':
      return v.alpha < 1
        ? `hsla(${v.hsl.h}, ${v.hsl.s}%, ${v.hsl.l}%, ${Math.round(v.alpha * 1000) / 1000})`
        : `hsl(${v.hsl.h}, ${v.hsl.s}%, ${v.hsl.l}%)`
    case 'oklch':
      return v.alpha < 1
        ? `oklch(${v.oklch.l} ${v.oklch.c} ${v.oklch.h} / ${Math.round(v.alpha * 1000) / 1000})`
        : `oklch(${v.oklch.l} ${v.oklch.c} ${v.oklch.h})`
    default:
      return v.hex
  }
}

export const ColorInput = forwardRef<HTMLDivElement, ColorInputProps>(function ColorInput(
  {
    value,
    defaultValue,
    onChange,
    size = 'md',
    invalid,
    disabled,
    placeholder = '#000000',
    displayAs = 'hex',
    pickerProps,
    className,
    style,
    'aria-label': ariaLabel,
  },
  ref,
) {
  const seed = value ?? defaultValue ?? '#3b82f6'
  const seedParsed = parseColor(seed)
  const [internal, setInternal] = useState<string>(seed)
  const [draft, setDraft] = useState<string>(seed)
  const [open, setOpen] = useState(false)

  const current = value ?? internal
  const parsed = parseColor(current) ?? seedParsed
  useEffect(() => {
    setDraft(current)
  }, [current])

  const commit = (next: ColorValue) => {
    const formatted = formatValue(next, displayAs)
    if (value === undefined) setInternal(formatted)
    onChange?.(next)
  }

  const commitText = (raw: string) => {
    const p = parseColor(raw)
    if (p) commit(p)
    else setDraft(current)
  }

  const s = sizeMap[size]
  const triggerRef = useRef<HTMLDivElement | null>(null)
  const popoverRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (popoverRef.current?.contains(t)) return
      if (triggerRef.current?.contains(t)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const wrap: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    height: s.h,
    padding: `0 ${s.pad}px`,
    borderRadius: 'var(--r-md)',
    background: 'var(--bg-2)',
    border: `1px solid ${invalid ? 'var(--err)' : 'var(--line-2)'}`,
    color: 'var(--fg)',
    fontFamily: 'var(--font-sans)',
    fontSize: s.fs,
    opacity: disabled ? 0.6 : 1,
    pointerEvents: disabled ? 'none' : undefined,
    position: 'relative',
  }

  const trigger: CSSProperties = {
    appearance: 'none',
    background: 'transparent',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
  }

  const input: CSSProperties = {
    flex: 1,
    minWidth: 0,
    height: '100%',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'inherit',
    fontFamily: 'var(--font-mono)',
    fontSize: s.fs - 1,
    padding: 0,
  }

  return (
    <div ref={ref} className={cx('vl-color-input', className)} style={style}>
      <span
        ref={triggerRef}
        data-vl-color-input=""
        data-size={size}
        data-invalid={invalid ? '' : undefined}
        style={wrap}
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={ariaLabel ?? 'Open color picker'}
          aria-expanded={open}
          style={trigger}
          disabled={disabled}
        >
          <ColorSwatch color={parsed?.hex ?? '#000000'} size="sm" />
        </button>
        <input
          style={input}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={(e) => commitText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
          }}
          disabled={disabled}
          spellCheck={false}
        />
      </span>

      {open && (
        <div
          ref={popoverRef}
          style={{
            position: 'absolute',
            marginTop: 6,
            zIndex: 50,
            boxShadow: 'var(--shadow-md)',
            borderRadius: 'var(--r-md)',
          }}
        >
          <ColorPicker
            {...pickerProps}
            value={current}
            onChange={(v) => {
              commit(v)
            }}
          />
        </div>
      )}
    </div>
  )
})
