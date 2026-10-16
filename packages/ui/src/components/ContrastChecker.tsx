import { forwardRef, useState, type CSSProperties } from 'react'
import { cx } from '../utils/cx'
import { getContrastRatio, parseColor, wcagLevel } from '../utils/color'
import { ColorInput } from './ColorInput'

export interface ContrastCheckerProps {
  foreground?: string
  background?: string
  defaultForeground?: string
  defaultBackground?: string
  onChange?: (next: { foreground: string; background: string; ratio: number }) => void
  /** Preview text size — affects AA/AAA thresholds. Default 'normal'. */
  textSize?: 'normal' | 'large'
  className?: string
  style?: CSSProperties
}

export const ContrastChecker = forwardRef<HTMLDivElement, ContrastCheckerProps>(
  function ContrastChecker(
    {
      foreground,
      background,
      defaultForeground = '#111827',
      defaultBackground = '#ffffff',
      onChange,
      textSize = 'normal',
      className,
      style,
    },
    ref,
  ) {
    const [fg, setFg] = useState(foreground ?? defaultForeground)
    const [bg, setBg] = useState(background ?? defaultBackground)
    const curFg = foreground ?? fg
    const curBg = background ?? bg

    const ratio = getContrastRatio(curFg, curBg)
    const level = wcagLevel(ratio, textSize)

    const commit = (nextFg: string, nextBg: string) => {
      if (foreground === undefined) setFg(nextFg)
      if (background === undefined) setBg(nextBg)
      onChange?.({ foreground: nextFg, background: nextBg, ratio: getContrastRatio(nextFg, nextBg) })
    }

    const fgHex = parseColor(curFg)?.hex ?? '#000'
    const bgHex = parseColor(curBg)?.hex ?? '#fff'

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
    }

    const row: CSSProperties = { display: 'flex', gap: 10, alignItems: 'center' }
    const label: CSSProperties = {
      width: 90,
      fontSize: 12,
      fontFamily: 'var(--font-mono)',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: 'var(--fg-3)',
    }

    const preview: CSSProperties = {
      padding: '18px 20px',
      borderRadius: 'var(--r-sm)',
      background: bgHex,
      color: fgHex,
      fontSize: textSize === 'large' ? 20 : 15,
      lineHeight: 1.45,
      textAlign: 'center',
      border: '1px solid var(--line)',
    }

    const levelColor =
      level === 'AAA' ? 'var(--ok)' : level === 'AA' ? 'var(--ok)' : level === 'AA Large' ? 'var(--warn, orange)' : 'var(--err)'

    const badge = (label: string, pass: boolean) => (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '2px 8px',
          borderRadius: 999,
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          background: pass ? 'color-mix(in oklch, var(--ok) 15%, transparent)' : 'color-mix(in oklch, var(--err) 15%, transparent)',
          color: pass ? 'var(--ok)' : 'var(--err)',
          border: `1px solid ${pass ? 'color-mix(in oklch, var(--ok) 40%, transparent)' : 'color-mix(in oklch, var(--err) 40%, transparent)'}`,
        }}
      >
        {pass ? '✓' : '✕'} {label}
      </span>
    )

    const normalAA = ratio >= 4.5
    const normalAAA = ratio >= 7
    const largeAA = ratio >= 3
    const largeAAA = ratio >= 4.5

    return (
      <div ref={ref} className={cx('vl-contrast-checker', className)} style={{ ...panel, ...style }}>
        <div style={row}>
          <span style={label}>Foreground</span>
          <ColorInput value={curFg} onChange={(v) => commit(v.hex, curBg)} />
        </div>
        <div style={row}>
          <span style={label}>Background</span>
          <ColorInput value={curBg} onChange={(v) => commit(curFg, v.hex)} />
        </div>

        <div style={preview}>The quick brown fox jumps over the lazy dog</div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 26, fontFamily: 'var(--font-mono)', fontWeight: 600, lineHeight: 1.1 }}>
              {ratio.toFixed(2)}
              <span style={{ fontSize: 14, color: 'var(--fg-3)' }}> :1</span>
            </span>
            <span style={{ fontSize: 12, color: levelColor, fontWeight: 600, letterSpacing: '0.02em' }}>
              {level}
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {badge('Normal AA', normalAA)}
            {badge('Normal AAA', normalAAA)}
            {badge('Large AA', largeAA)}
            {badge('Large AAA', largeAAA)}
          </div>
        </div>
      </div>
    )
  },
)
