import { forwardRef, type CSSProperties, type ReactNode } from 'react'
import { cx } from '../../utils/cx'
import { SparklineChart, type SparklineChartType } from './SparklineChart'

export interface SparklineGridRow {
  label: string
  data: number[]
  /** Optional explicit value shown on the right. Falls back to the last data point. */
  value?: ReactNode
  /** Optional override color for this row. */
  color?: string
  /** Optional meta line under the label. */
  meta?: ReactNode
}

export interface SparklineGridProps {
  rows: SparklineGridRow[]
  type?: SparklineChartType
  /** Columns in the grid. Default 1. */
  columns?: 1 | 2 | 3 | 4
  /** Sparkline cell size. */
  sparkWidth?: number
  sparkHeight?: number
  /** Format applied to the fallback value (last data point). */
  valueFormat?: (n: number) => string
  /** Show delta vs. first data point as a badge. */
  showDelta?: boolean
  color?: string
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

function formatDelta(curr: number, prev: number): { text: string; sign: 'up' | 'down' | 'flat' } {
  if (prev === 0 && curr === 0) return { text: '0%', sign: 'flat' }
  if (prev === 0) return { text: '—', sign: 'flat' }
  const pct = ((curr - prev) / Math.abs(prev)) * 100
  const sign = pct > 0.5 ? 'up' : pct < -0.5 ? 'down' : 'flat'
  const prefix = sign === 'up' ? '+' : ''
  return { text: `${prefix}${pct.toFixed(1)}%`, sign }
}

export const SparklineGrid = forwardRef<HTMLDivElement, SparklineGridProps>(function SparklineGrid(
  {
    rows,
    type = 'line',
    columns = 1,
    sparkWidth = 120,
    sparkHeight = 32,
    valueFormat,
    showDelta = true,
    color = 'var(--ac)',
    className,
    style,
    'aria-label': ariaLabel,
  },
  ref,
) {
  const fmt = valueFormat ?? ((n: number) => String(n))

  const grid: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gap: 1,
    background: 'var(--line)',
    border: '1px solid var(--line)',
    borderRadius: 'var(--r-md)',
    overflow: 'hidden',
    fontFamily: 'var(--font-sans)',
  }

  const cell: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr auto auto',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    background: 'var(--bg-1)',
    minWidth: 0,
  }

  const deltaBadge = (sign: 'up' | 'down' | 'flat'): CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 2,
    padding: '2px 6px',
    borderRadius: 999,
    fontSize: 11,
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    background:
      sign === 'up'
        ? 'color-mix(in oklch, var(--ok) 15%, transparent)'
        : sign === 'down'
          ? 'color-mix(in oklch, var(--err) 15%, transparent)'
          : 'var(--bg-2)',
    color: sign === 'up' ? 'var(--ok)' : sign === 'down' ? 'var(--err)' : 'var(--fg-3)',
    whiteSpace: 'nowrap',
  })

  return (
    <div
      ref={ref}
      data-vl-sparkline-grid=""
      className={cx('vl-sparkline-grid', className)}
      style={{ ...grid, ...style }}
      aria-label={ariaLabel}
    >
      {rows.map((row) => {
        const last = row.data.length > 0 ? row.data[row.data.length - 1] : 0
        const first = row.data.length > 0 ? row.data[0] : 0
        const delta = showDelta ? formatDelta(last, first) : null
        return (
          <div key={row.label} style={cell}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
              <span
                style={{
                  fontSize: 13,
                  color: 'var(--fg)',
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {row.label}
              </span>
              {row.meta != null && (
                <span style={{ fontSize: 11, color: 'var(--fg-3)' }}>{row.meta}</span>
              )}
            </div>

            <SparklineChart
              data={row.data}
              type={type}
              width={sparkWidth}
              height={sparkHeight}
              color={row.color ?? color}
              label={`${row.label} trend`}
            />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
              <span style={{ fontSize: 14, fontFamily: 'var(--font-mono)', color: 'var(--fg)' }}>
                {row.value ?? fmt(last)}
              </span>
              {delta && <span style={deltaBadge(delta.sign)}>{delta.text}</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
})
