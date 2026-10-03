import type { ComponentProps, CSSProperties, ReactNode } from 'react'
import { cx } from '../utils/cx'

export type ChipTone = 'neutral' | 'accent' | 'ok' | 'warn' | 'err'
export type ChipVariant = 'solid' | 'soft' | 'outline'

export interface ChipProps extends ComponentProps<'span'> {
  tone?: ChipTone
  variant?: ChipVariant
  onRemove?: () => void
  children?: ReactNode
}

const toneColor: Record<ChipTone, string> = {
  neutral: 'var(--fg-2)',
  accent: 'var(--ac)',
  ok: 'var(--ok)',
  warn: 'var(--warn)',
  err: 'var(--err)',
}

const toneFg: Record<ChipTone, string> = {
  neutral: 'var(--bg)',
  accent: 'var(--ac-fg)',
  ok: 'oklch(0.15 0.03 150)',
  warn: 'oklch(0.2 0.05 80)',
  err: 'oklch(0.98 0.01 25)',
}

export function Chip({ tone = 'neutral', variant = 'soft', onRemove, style, className, children, ...rest }: ChipProps) {
  const color = toneColor[tone]
  const styles: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    height: 24,
    padding: onRemove ? '0 4px 0 10px' : '0 10px',
    borderRadius: 'var(--r-full)',
    fontSize: 12,
    fontWeight: 500,
    fontFamily: 'var(--font-sans)',
    lineHeight: 1,
  }
  // Variable indirection makes the chip survive aggressive consumer resets.
  // The layered CSS hover rule updates `--vl-chip-bg`; inline background re-reads it live.
  if (variant === 'solid') {
    styles.background = `var(--vl-chip-bg, ${color})`
    styles.color = toneFg[tone]
  } else if (variant === 'soft') {
    styles.background = `var(--vl-chip-bg, color-mix(in oklch, ${color} 18%, transparent))`
    styles.color = color
  } else {
    styles.background = 'var(--vl-chip-bg, transparent)'
    styles.color = color
    styles.border = `1px solid color-mix(in oklch, ${color} 50%, transparent)`
  }
  return (
    <span
      data-vl-chip=""
      data-variant={variant}
      data-tone={tone}
      className={cx('vl-chip', className)}
      style={{ ...styles, ...style }}
      {...rest}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove"
          data-vl-chip-remove=""
          style={{
            width: 16,
            height: 16,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            border: 'none',
            background: 'var(--vl-chip-remove-bg, transparent)',
            color: 'currentColor',
            cursor: 'pointer',
            fontSize: 11,
            padding: 0,
          }}
        >
          ✕
        </button>
      )}
    </span>
  )
}
