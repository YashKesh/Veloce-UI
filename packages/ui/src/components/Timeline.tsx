import { forwardRef, type ComponentProps, type ReactNode } from 'react'
import { cx } from '../utils/cx'

export interface TimelineItem {
  label: ReactNode
  description?: ReactNode
  time?: ReactNode
  icon?: ReactNode
  tone?: 'default' | 'accent' | 'ok' | 'warn' | 'err'
}

export interface TimelineProps extends ComponentProps<'ol'> {
  items: TimelineItem[]
}

const toneColor: Record<NonNullable<TimelineItem['tone']>, string> = {
  default: 'var(--line-2)',
  accent: 'var(--ac)',
  ok: 'var(--ok)',
  warn: 'var(--warn)',
  err: 'var(--err)',
}

export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(function Timeline(
  { items, className, style, ...rest },
  ref,
) {
  return (
    <ol
      ref={ref}
      className={cx('vl-timeline', className)}
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        ...style,
      }}
      {...rest}
    >
      {items.map((item, i) => {
        const color = toneColor[item.tone ?? 'default']
        const isLast = i === items.length - 1
        return (
          <li key={i} style={{ display: 'flex', gap: 14, position: 'relative' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 22 }}>
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: 'var(--bg)',
                  border: `2px solid ${color}`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 9,
                  color: color,
                  marginTop: 2,
                }}
              >
                {item.icon}
              </span>
              {!isLast && <span style={{ flex: 1, width: 2, background: 'var(--line)', marginTop: 2 }} />}
            </div>
            <div style={{ paddingBottom: isLast ? 0 : 18, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--fg)' }}>{item.label}</span>
                {item.time && <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>{item.time}</span>}
              </div>
              {item.description && (
                <div style={{ marginTop: 4, fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}>{item.description}</div>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
})
