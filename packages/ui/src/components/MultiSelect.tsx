import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { cx } from '../utils/cx'

export interface MultiSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface MultiSelectProps {
  options: MultiSelectOption[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
  max?: number
  className?: string
  style?: CSSProperties
}

export function MultiSelect({
  options,
  value,
  defaultValue = [],
  onValueChange,
  placeholder = 'Select…',
  disabled,
  invalid,
  max,
  className,
  style,
}: MultiSelectProps) {
  const [internal, setInternal] = useState<string[]>(defaultValue)
  const current = value ?? internal
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement | null>(null)

  const commit = (next: string[]) => {
    if (value === undefined) setInternal(next)
    onValueChange?.(next)
  }

  const toggle = (val: string) => {
    if (current.includes(val)) {
      commit(current.filter((v) => v !== val))
    } else {
      if (max != null && current.length >= max) return
      commit([...current, val])
    }
  }

  const filtered = options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', onDown)
    return () => window.removeEventListener('mousedown', onDown)
  }, [open])

  const selectedLabels = current
    .map((v) => options.find((o) => o.value === v)?.label)
    .filter(Boolean) as string[]

  return (
    <div ref={containerRef} className={cx('vl-multi-select', className)} style={{ position: 'relative', ...style }}>
      <div
        onClick={() => !disabled && setOpen((o) => !o)}
        style={{
          minHeight: 36,
          padding: 4,
          border: `1px solid ${invalid ? 'var(--err)' : 'var(--line-2)'}`,
          borderRadius: 8,
          background: 'var(--bg)',
          display: 'flex',
          gap: 4,
          flexWrap: 'wrap',
          alignItems: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          minWidth: 220,
        }}
      >
        {selectedLabels.length === 0 ? (
          <span style={{ padding: '0 8px', color: 'var(--fg-3)', fontSize: 13.5 }}>{placeholder}</span>
        ) : (
          selectedLabels.map((label) => (
            <span
              key={label}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                height: 24,
                padding: '0 6px 0 8px',
                borderRadius: 5,
                background: 'var(--ac-soft)',
                color: 'var(--ac-text)',
                fontSize: 12,
              }}
            >
              {label}
              <button
                aria-label={`Remove ${label}`}
                onClick={(e) => {
                  e.stopPropagation()
                  const opt = options.find((o) => o.label === label)
                  if (opt) toggle(opt.value)
                }}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 11, padding: '0 2px' }}
              >
                ✕
              </button>
            </span>
          ))
        )}
        <span style={{ marginLeft: 'auto', padding: '0 8px', color: 'var(--fg-3)' }}>⌄</span>
      </div>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 8, boxShadow: 'var(--shadow-md)', zIndex: 50, overflow: 'hidden' }}>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            style={{ width: '100%', height: 32, padding: '0 10px', border: 'none', borderBottom: '1px solid var(--line)', background: 'var(--bg)', color: 'var(--fg)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
          />
          <ul role="listbox" aria-multiselectable style={{ maxHeight: 220, overflowY: 'auto', margin: 0, padding: 4, listStyle: 'none' }}>
            {filtered.map((opt) => {
              const checked = current.includes(opt.value)
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={checked}
                  onClick={() => !opt.disabled && toggle(opt.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '7px 10px',
                    borderRadius: 6,
                    fontSize: 13,
                    color: opt.disabled ? 'var(--fg-3)' : 'var(--fg)',
                    cursor: opt.disabled ? 'not-allowed' : 'pointer',
                    background: checked ? 'var(--bg-3)' : 'transparent',
                  }}
                >
                  <span style={{ width: 14, height: 14, border: '1px solid var(--line-2)', borderRadius: 3, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: checked ? 'var(--ac)' : 'var(--bg)', color: 'var(--ac-fg)', fontSize: 10 }}>
                    {checked ? '✓' : ''}
                  </span>
                  {opt.label}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
