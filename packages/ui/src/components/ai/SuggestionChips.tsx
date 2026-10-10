import { type ComponentProps, type ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface SuggestionChipsProps extends Omit<ComponentProps<'div'>, 'onSelect'> {
  suggestions: Array<string | { label: ReactNode; value: string; icon?: ReactNode }>
  onSelect?: (value: string) => void
}

/** Row of click-to-send prompt suggestions. Used below empty chat states and after responses. */
export function SuggestionChips({ suggestions, onSelect, className, style, ...rest }: SuggestionChipsProps) {
  return (
    <div
      data-vl-suggestion-chips=""
      className={cx('vl-suggestion-chips', className)}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        ...style,
      }}
      {...rest}
    >
      {suggestions.map((s, i) => {
        const value = typeof s === 'string' ? s : s.value
        const label = typeof s === 'string' ? s : s.label
        const icon = typeof s === 'string' ? null : s.icon
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect?.(value)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 12px',
              borderRadius: 999,
              border: '1px solid var(--line-2)',
              background: 'var(--bg-1)',
              color: 'var(--fg-2)',
              fontSize: 12.5,
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'background 150ms, color 150ms, border-color 150ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--ac-soft)'
              e.currentTarget.style.color = 'var(--ac-text)'
              e.currentTarget.style.borderColor = 'var(--ac-line)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-1)'
              e.currentTarget.style.color = 'var(--fg-2)'
              e.currentTarget.style.borderColor = 'var(--line-2)'
            }}
          >
            {icon}
            {label}
          </button>
        )
      })}
    </div>
  )
}
