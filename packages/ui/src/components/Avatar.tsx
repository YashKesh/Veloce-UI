import { useState, type ComponentProps, type CSSProperties } from 'react'
import { cx } from '../utils/cx'

export type AvatarSize = 'sm' | 'md' | 'lg' | number

export interface AvatarProps extends Omit<ComponentProps<'div'>, 'children'> {
  name: string
  src?: string
  size?: AvatarSize
  hue?: number
  interactive?: boolean
}

function resolveSize(size: AvatarSize): number {
  if (typeof size === 'number') return size
  return size === 'sm' ? 24 : size === 'lg' ? 48 : 36
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return (parts[0]?.[0] ?? '').toUpperCase()
  return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase()
}

function hashHue(name: string): number {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return h % 360
}

export function Avatar({ name, src, size = 'md', hue, interactive, style, className, ...rest }: AvatarProps) {
  const [errored, setErrored] = useState(false)
  const px = resolveSize(size)
  const h = hue ?? hashHue(name)
  const bg = `oklch(0.55 0.18 ${h})`
  const fg = `oklch(0.98 0.02 ${h})`
  const base: CSSProperties = {
    width: px,
    height: px,
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: bg,
    color: fg,
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    fontSize: Math.max(10, Math.round(px * 0.4)),
    overflow: 'hidden',
    userSelect: 'none',
  }
  return (
    <div
      data-vl-avatar=""
      data-interactive={interactive ? '' : undefined}
      className={cx('vl-avatar', className)}
      style={{ ...base, ...style }}
      {...rest}
    >
      {src && !errored ? (
        <img
          src={src}
          alt={name}
          onError={() => setErrored(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        initials(name)
      )}
    </div>
  )
}
