import type { ComponentProps, CSSProperties, ReactNode } from 'react'
import { cx } from '../utils/cx'

export type BadgeTone = 'neutral' | 'accent' | 'ok' | 'warn' | 'err'
export type BadgeVariant = 'solid' | 'soft' | 'outline'

export interface BadgeProps extends ComponentProps<'span'> {
  tone?: BadgeTone
  variant?: BadgeVariant
  children?: ReactNode
}

const toneColor: Record<BadgeTone, string> = {
  neutral: 'var(--fg-2)',
  accent: 'var(--ac)',
  ok: 'var(--ok)',
  warn: 'var(--warn)',
  err: 'var(--err)',
}

const toneFg: Record<BadgeTone, string> = {
  neutral: 'var(--bg)',
  accent: 'var(--ac-fg)',
  ok: 'oklch(0.15 0.03 150)',
  warn: 'oklch(0.2 0.05 80)',
  err: 'oklch(0.98 0.01 25)',
}

export function Badge({ tone = 'neutral', variant = 'soft', style, className, children, ...rest }: BadgeProps) {
  const color = toneColor[tone]
  const styles: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    height: 20,
    padding: '0 8px',
    borderRadius: 'var(--r-full)',
    fontSize: 11,
    fontWeight: 500,
    fontFamily: 'var(--font-sans)',
    lineHeight: 1,
    whiteSpace: 'nowrap',
  }
  if (variant === 'solid') {
    styles.background = color
    styles.color = toneFg[tone]
  } else if (variant === 'soft') {
    styles.background = `color-mix(in oklch, ${color} 18%, transparent)`
    styles.color = color
  } else {
    styles.background = 'transparent'
    styles.color = color
    styles.border = `1px solid color-mix(in oklch, ${color} 50%, transparent)`
  }
  return (
    <span
      data-vl-badge=""
      data-variant={variant}
      data-tone={tone}
      className={cx('vl-badge', className)}
      style={{ ...styles, ...style }}
      {...rest}
    >
      {children}
    </span>
  )
}
