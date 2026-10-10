import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { cx } from '../utils/cx'

export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
  /** Allow entering values not in the options list. */
  allowCustom?: boolean
  emptyMessage?: string
  className?: string
  style?: CSSProperties
}

export function Combobox({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Search…',
  disabled,
  invalid,
  allowCustom,
  emptyMessage = 'No results',
  className,
  style,
}: ComboboxProps) {
  const [internal, setInternal] = useState(defaultValue ?? '')
  const current = value ?? internal
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(-1)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const selected = options.find((o) => o.value === current)
  const display = open ? query : selected?.label ?? ''

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase()),
  )

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', onDown)
    return () => window.removeEventListener('mousedown', onDown)
  }, [open])

  const commit = (val: string) => {
    if (value === undefined) setInternal(val)
    onValueChange?.(val)
    setQuery('')
    setOpen(false)
    inputRef.current?.blur()
  }

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocused((f) => Math.min(filtered.length - 1, f + 1)); setOpen(true) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setFocused((f) => Math.max(0, f - 1)) }
    else if (e.key === 'Enter') {
      e.preventDefault()
      const opt = filtered[focused] ?? filtered[0]
      if (opt && !opt.disabled) commit(opt.value)
      else if (allowCustom && query) commit(query)
    }
    else if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div ref={containerRef} className={cx('vl-combobox', className)} style={{ position: 'relative', display: 'inline-block', ...style }}>
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        value={display}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); setFocused(0) }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKey}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: '100%',
          minWidth: 220,
          height: 36,
          padding: '0 32px 0 12px',
          borderRadius: 8,
          border: `1px solid ${invalid ? 'var(--err)' : 'var(--line-2)'}`,
          background: 'var(--bg)',
          color: 'var(--fg)',
          fontSize: 13.5,
          fontFamily: 'inherit',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
      <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-3)', pointerEvents: 'none' }}>⌄</span>
      {open && (
        <ul
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            maxHeight: 240,
            margin: 0,
            padding: 4,
            background: 'var(--bg-2)',
            border: '1px solid var(--line-2)',
            borderRadius: 8,
            boxShadow: 'var(--shadow-md)',
            overflowY: 'auto',
            listStyle: 'none',
            zIndex: 50,
          }}
        >
          {filtered.length === 0 ? (
            <li style={{ padding: '8px 10px', fontSize: 13, color: 'var(--fg-3)', textAlign: 'center' }}>
              {allowCustom && query ? `Create "${query}"` : emptyMessage}
            </li>
          ) : (
            filtered.map((opt, i) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={current === opt.value}
                onMouseEnter={() => setFocused(i)}
                onClick={() => !opt.disabled && commit(opt.value)}
                style={{
                  padding: '7px 10px',
                  borderRadius: 6,
                  fontSize: 13,
                  cursor: opt.disabled ? 'not-allowed' : 'pointer',
                  background: focused === i ? 'var(--bg-3)' : 'transparent',
                  color: opt.disabled ? 'var(--fg-3)' : current === opt.value ? 'var(--fg)' : 'var(--fg-2)',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>{opt.label}</span>
                {current === opt.value && <span style={{ color: 'var(--ac-text)' }}>✓</span>}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
