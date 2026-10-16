import { forwardRef, type CSSProperties } from 'react'
import { cx } from '../../utils/cx'
import { LineChart, type LineChartProps } from './LineChart'

export interface ComparisonSeries {
  label: string
  data: number[]
}

export interface ComparisonLineChartProps
  extends Omit<LineChartProps, 'data' | 'series' | 'width' | 'height'> {
  /** The current period data. Its labels drive the x-axis. */
  current: { label: string; value: number }[]
  /** The previous period's values. Length should match `current` (will be clipped/padded). */
  previous: number[]
  currentLabel?: string
  previousLabel?: string
  currentColor?: string
  previousColor?: string
  width?: number
  height?: number
  /** How to format the delta. Default: percentage with sign. */
  formatDelta?: (currentTotal: number, previousTotal: number) => string
  /** Reduce to a single scalar for the delta badge. Default: sum. */
  aggregate?: (values: number[]) => number
  /** Hide the delta header. */
  showHeader?: boolean
}

function alignLength(src: number[], target: number): number[] {
  if (src.length === target) return src
  if (src.length > target) return src.slice(0, target)
  const out = src.slice()
  while (out.length < target) out.push(0)
  return out
}

function defaultFormatDelta(curr: number, prev: number): string {
  if (prev === 0 && curr === 0) return '0%'
  if (prev === 0) return '—'
  const pct = ((curr - prev) / Math.abs(prev)) * 100
  const prefix = pct > 0 ? '+' : ''
  return `${prefix}${pct.toFixed(1)}%`
}

const defaultAggregate = (vs: number[]) => vs.reduce((a, b) => a + b, 0)

export const ComparisonLineChart = forwardRef<HTMLDivElement, ComparisonLineChartProps>(
  function ComparisonLineChart(
    {
      current,
      previous,
      currentLabel = 'Current',
      previousLabel = 'Previous',
      currentColor = 'var(--ac)',
      previousColor = 'var(--fg-3)',
      width = 480,
      height = 220,
      formatDelta = defaultFormatDelta,
      aggregate = defaultAggregate,
      showHeader = true,
      className,
      style,
      ...lineProps
    },
    ref,
  ) {
    const prevAligned = alignLength(previous, current.length)
    const currValues = current.map((d) => d.value)
    const currTotal = aggregate(currValues)
    const prevTotal = aggregate(prevAligned)
    const deltaText = formatDelta(currTotal, prevTotal)
    const direction = currTotal === prevTotal ? 'flat' : currTotal > prevTotal ? 'up' : 'down'

    const wrap: CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      width,
      ...style,
    }

    const header: CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      flexWrap: 'wrap',
    }

    const legendItem: CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      color: 'var(--fg-2)',
      fontFamily: 'var(--font-sans)',
    }

    const swatch = (color: string, dashed?: boolean): CSSProperties => ({
      width: 16,
      height: 2,
      background: dashed
        ? `repeating-linear-gradient(to right, ${color} 0 4px, transparent 4px 7px)`
        : color,
      borderRadius: 1,
    })

    const badge: CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '2px 8px',
      borderRadius: 999,
      fontSize: 11,
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      background:
        direction === 'up'
          ? 'color-mix(in oklch, var(--ok) 15%, transparent)'
          : direction === 'down'
            ? 'color-mix(in oklch, var(--err) 15%, transparent)'
            : 'var(--bg-2)',
      color: direction === 'up' ? 'var(--ok)' : direction === 'down' ? 'var(--err)' : 'var(--fg-3)',
    }

    return (
      <div ref={ref} className={cx('vl-comparison-chart', className)} style={wrap}>
        {showHeader && (
          <div style={header}>
            <div style={{ display: 'flex', gap: 14 }}>
              <span style={legendItem}>
                <span style={swatch(currentColor)} /> {currentLabel}
              </span>
              <span style={legendItem}>
                <span style={swatch(previousColor, true)} /> {previousLabel}
              </span>
            </div>
            <span style={badge}>
              {direction === 'up' ? '↑' : direction === 'down' ? '↓' : '→'} {deltaText}
            </span>
          </div>
        )}
        <div style={{ position: 'relative', width, height }}>
          <LineChart
            {...lineProps}
            data={current.map((d, i) => ({ label: d.label, value: prevAligned[i] }))}
            width={width}
            height={height}
            color={previousColor}
            showDots={false}
            showGrid={false}
            strokeWidth={1.5}
            style={{ position: 'absolute', inset: 0, opacity: 0.75 }}
            className="vl-comparison-prev"
          />
          <LineChart
            {...lineProps}
            data={current}
            width={width}
            height={height}
            color={currentColor}
            style={{ position: 'absolute', inset: 0, background: 'transparent' }}
          />
        </div>
        <style>{`
          .vl-comparison-prev path[fill^="url"] { opacity: 0; }
          .vl-comparison-prev path[stroke]:not([stroke-dasharray]) { stroke-dasharray: 4 3; }
          .vl-comparison-prev text { opacity: 0; }
        `}</style>
      </div>
    )
  },
)
