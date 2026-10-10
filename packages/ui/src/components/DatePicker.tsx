import { useRef, useState, type CSSProperties } from 'react'
import { cx } from '../utils/cx'

export interface DatePickerProps {
  value?: Date | null
  defaultValue?: Date | null
  onValueChange?: (value: Date | null) => void
  min?: Date
  max?: Date
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
  format?: (date: Date) => string
  className?: string
  style?: CSSProperties
}

const DEFAULT_FORMAT = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export function DatePicker({
  value,
  defaultValue,
  onValueChange,
  min,
  max,
  placeholder = 'Pick a date',
  disabled,
  invalid,
  format = DEFAULT_FORMAT,
  className,
  style,
}: DatePickerProps) {
  const [internal, setInternal] = useState<Date | null>(defaultValue ?? null)
  const current = value !== undefined ? value : internal
  const [open, setOpen] = useState(false)
  const [cursor, setCursor] = useState<Date>(current ?? new Date())
  const containerRef = useRef<HTMLDivElement | null>(null)

  const commit = (d: Date | null) => {
    if (value === undefined) setInternal(d)
    onValueChange?.(d)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className={cx('vl-date-picker', className)} style={{ position: 'relative', display: 'inline-block', ...style }}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        aria-expanded={open}
        style={{
          minWidth: 180,
          height: 36,
          padding: '0 12px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          background: 'var(--bg)',
          color: current ? 'var(--fg)' : 'var(--fg-3)',
          border: `1px solid ${invalid ? 'var(--err)' : 'var(--line-2)'}`,
          borderRadius: 8,
          fontSize: 13.5,
          fontFamily: 'inherit',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        {current ? format(current) : placeholder}
        <span style={{ color: 'var(--fg-3)' }}>📅</span>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            zIndex: 50,
            padding: 12,
            background: 'var(--bg-2)',
            border: '1px solid var(--line-2)',
            borderRadius: 10,
            boxShadow: 'var(--shadow-md)',
            minWidth: 272,
          }}
        >
          <Calendar
            month={cursor}
            onMonthChange={setCursor}
            selected={current ?? undefined}
            onSelect={commit}
            min={min}
            max={max}
          />
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Calendar primitive (also exported)
// ─────────────────────────────────────────────────────────────────────────────

export interface CalendarProps {
  month?: Date
  defaultMonth?: Date
  onMonthChange?: (month: Date) => void
  selected?: Date
  onSelect?: (date: Date) => void
  min?: Date
  max?: Date
  className?: string
  style?: CSSProperties
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function Calendar({
  month,
  defaultMonth,
  onMonthChange,
  selected,
  onSelect,
  min,
  max,
  className,
  style,
}: CalendarProps) {
  const [internalMonth, setInternalMonth] = useState(defaultMonth ?? new Date())
  const current = month ?? internalMonth
  const setMonth = (next: Date) => {
    if (month === undefined) setInternalMonth(next)
    onMonthChange?.(next)
  }

  const year = current.getFullYear()
  const m = current.getMonth()
  const firstDay = new Date(year, m, 1)
  const startIdx = firstDay.getDay()
  const daysInMonth = new Date(year, m + 1, 0).getDate()

  const cells: (Date | null)[] = []
  for (let i = 0; i < startIdx; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, m, d))

  const today = new Date()
  const isDisabled = (d: Date) => {
    if (min && d < new Date(min.getFullYear(), min.getMonth(), min.getDate())) return true
    if (max && d > new Date(max.getFullYear(), max.getMonth(), max.getDate())) return true
    return false
  }

  return (
    <div className={cx('vl-calendar', className)} style={{ ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setMonth(new Date(year, m - 1, 1))}
          style={navBtn}
        >
          ‹
        </button>
        <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--fg)' }}>
          {MONTHS[m]} {year}
        </span>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setMonth(new Date(year, m + 1, 1))}
          style={navBtn}
        >
          ›
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {DAYS.map((d, i) => (
          <span key={i} style={{ textAlign: 'center', fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', padding: '2px 0' }}>{d}</span>
        ))}
        {cells.map((d, i) => {
          if (!d) return <span key={`e${i}`} />
          const disabled = isDisabled(d)
          const isSel = selected && sameDay(selected, d)
          const isToday = sameDay(today, d)
          return (
            <button
              key={d.getTime()}
              type="button"
              disabled={disabled}
              onClick={() => onSelect?.(d)}
              aria-selected={isSel}
              aria-current={isToday ? 'date' : undefined}
              style={{
                height: 32,
                borderRadius: 6,
                border: isToday && !isSel ? '1px solid var(--line-2)' : '1px solid transparent',
                background: isSel ? 'var(--ac)' : 'transparent',
                color: isSel ? 'var(--ac-fg)' : disabled ? 'var(--fg-3)' : 'var(--fg)',
                fontSize: 12.5,
                fontFamily: 'var(--font-mono)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.4 : 1,
                padding: 0,
                transition: 'background 150ms',
              }}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const navBtn: CSSProperties = {
  width: 26,
  height: 26,
  borderRadius: 6,
  background: 'transparent',
  border: '1px solid var(--line-2)',
  color: 'var(--fg-2)',
  fontSize: 14,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
}
